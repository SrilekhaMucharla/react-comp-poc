import _ from 'lodash';
import queryString from 'query-string';

import { getProxiedUrl } from 'gw-portals-url-js';

import iframeUtil from './IframeUtil/IframeUtil';
import { waitForPostMessage } from './PostMessageUtil';
import jwtHelper from './JwtHelper';
import ERRORS from '../AuthErrors';

let tokensSetPromise = new Promise(_.noop);
const tokens = {};
let nonceValue = '';
let stateValue = '';
let tokenRefreshTimer;

let oAuthConfig;
// 100 seconds prior to token expiration we want to request a new token
const refreshTimeOffset = 100e3;

/**
 * Normalizes the authorities to an array of Strings
 * some auth servers (e.g. Auth0) pass authorities as an array
 * rather than as a string (e.g. UAA)
 * @param {String|Array<String>} authorities
 * @returns {Array<String>}
 */
function getAuthoritiesArray(authorities) {
    if (_.isString(authorities)) {
        return authorities.split(' ');
    }
    return authorities;
}

/**
 * Returns whether the give `authority` is an edge authority
 * @param {String} authority the string representing the authority
 * @returns {Boolean} `true` if the authority is an Edge\ authority
 */
function isEdgeAuthority(authority) {
    return _.includes(authority, 'guidewire.edge');
}

/**
 * Leaves only `guidewire.edge` authorities
 *
 * @param {Array<String>|String} authorities
 * @returns {Array.<String>}
 */
function filterScopeAuthorities(authorities) {
    return getAuthoritiesArray(authorities).filter(isEdgeAuthority);
}

function scheduleTokenRefreshReq(stateParam, currentToken) {
    const currentTokenExpiryWindowSecs = currentToken.exp - currentToken.iat;
    const currentTokenExpiryWindowMilliseconds = currentTokenExpiryWindowSecs * 1000;
    if (tokenRefreshTimer) {
        window.clearTimeout(tokenRefreshTimer);
    }
    tokenRefreshTimer = window.setTimeout(() => {
        // eslint-disable-next-line no-use-before-define
        requestAccessToken(stateParam).catch(oAuthConfig.onRefreshError);
    }, currentTokenExpiryWindowMilliseconds - refreshTimeOffset);
}

function setTokensFromUrlHash(parsedHash) {
    // uaa validates using nonce
    if (oAuthConfig.validate === 'nonce' && parsedHash.nonce !== nonceValue) {
        throw new Error('nonce value of token does not match the value used in request');
    }
    // auth0 and cognito validate using state
    if (oAuthConfig.validate === 'state' && parsedHash.state !== stateValue) {
        throw new Error('state value of token does not match the value used in request');
    }

    tokens.accessToken = parsedHash.access_token;

    const scopeAuthorities = parsedHash.scope ? filterScopeAuthorities(parsedHash.scope.split(' ')) : '';

    tokensSetPromise = new Promise((resolve, reject) => {
        if (!tokens.accessToken && !scopeAuthorities.length) {
            reject(new Error('Expecting to set an access token or authorities or both'));
        } else {
            resolve();
        }
    }).then(() => {
        // if the auth solution uses an id_token: validate it
        if (parsedHash.id_token) {
            return jwtHelper
                .isValidIdToken(parsedHash.id_token, stateValue, oAuthConfig)
                .then((result) => {
                    if (result === true) {
                        tokens.idToken = parsedHash.id_token;
                        return tokens;
                    }
                    return Promise.reject(new Error('invalid token provided'));
                });
        }
        return tokens;
    });

    return tokensSetPromise;
}

/**
 * Generates a sequence of chars for the nonce
 * @param {Number} nonceLength the length of the string to generate
 * @yields {String}
 */
function* getNonceChars(nonceLength) {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < nonceLength; i += 1) {
        const nextCharPosition = Math.floor(Math.random() * possibleChars.length);
        yield possibleChars.charAt(nextCharPosition);
    }
}

function getAuthorizeUrl(stateParam) {
    const nonceLength = 16;
    nonceValue = Array.from(getNonceChars(nonceLength)).join('');

    const params = {
        response_type: 'token',
        client_id: oAuthConfig.clientId,
        nonce: nonceValue
    };

    if (oAuthConfig.requiresRedirectUrl) {
        const currentLocation = window.location.href;
        const redirectUrl = new URL('./common/redirect-login.html', currentLocation).href;
        params.redirect_uri = redirectUrl;
    }
    if (oAuthConfig.audience) {
        params.audience = oAuthConfig.audience;
    }
    if (oAuthConfig.scope) {
        params.scope = oAuthConfig.scope;
    }

    stateValue = nonceValue;
    if (stateParam) {
        stateValue = `|${stateParam}`;
    }
    params.state = stateValue;

    const serializedParams = queryString.stringify(params);

    return getProxiedUrl(`${oAuthConfig.url}${oAuthConfig.endpoints.authorize}?${serializedParams}`);
}

function requestAccessToken(stateParam) {
    const authorizeUrl = getAuthorizeUrl(stateParam);
    const LOGIN_POST_MESSAGE_CHANNEL_NAME = 'login-redirect-data';// used on both redirect-login page as well
    const LOGGED_USER_REDIRECT_URL = 'redirect-login.html';// expected URL to be redirected when user is logged in

    const iframeConfig = {
        src: authorizeUrl,
        expectedSrcPartOnLoad: LOGGED_USER_REDIRECT_URL
    };

    // Some auth solutions will always redirect to the login page unless a
    // parameter is added to the url.
    // If so we attempt to call with the parameter. If that fails (user not logged in)
    // then we will use the url without the parameter (i.e. the failureRedirectUrl)
    if (oAuthConfig.silentLoginParam) {
        const authorizeUrlWithoutPrompt = `${getAuthorizeUrl(stateParam)}&${oAuthConfig.silentLoginParam}`; // call the function again to get a different nonce
        iframeConfig.src = authorizeUrlWithoutPrompt;
        iframeConfig.failureRedirectUrl = authorizeUrl;
    }
    const loadIframeForTokensPromise = iframeUtil.loadIframe(iframeConfig);

    const setTokensFromIframePromise = waitForPostMessage(LOGIN_POST_MESSAGE_CHANNEL_NAME)
        .then((loginRedirectHash) => {
            return setTokensFromUrlHash(queryString.parse(loginRedirectHash));
        });

    // waits till the Auth page is loaded
    // in iframe with possible redirect if user is logged in,
    // which in turn triggers post_message with tokens,
    // so the promise waits till the post_message is received as well.
    // After that tokens are assigned
    return Promise.all([
        loadIframeForTokensPromise,
        setTokensFromIframePromise
    ]).then(([, oAuthToken]) => {
        scheduleTokenRefreshReq(stateParam, jwtHelper.decodeToken(oAuthToken.accessToken));
        return {
            res: oAuthToken
        };
    }).catch((err) => {
        let resultError = {
            // default
            error: ERRORS.loginError
        };
        if (err) {
            if (err.authorizeWithoutIFrame) {
                resultError = {
                    error: ERRORS.notLoggedIn,
                    redirect: getAuthorizeUrl(stateParam)
                };
            } else if (err.fullPageRedirectRequired) {
                resultError = {
                    error: ERRORS.notLoggedIn,
                    redirect: err.fullPageRedirectRequired
                };
            } else if (err.error && err.error === ERRORS.expectedSrcPartOnLoad) {
                resultError = {
                    error: ERRORS.notLoggedIn
                };
            }
        }
        return Promise.reject(resultError);
    });
}

function removeTokens() {
    const tokenOrigin = jwtHelper.decodeToken(tokens.accessToken).origin;
    delete tokens.accessToken;
    delete tokens.authorities;
    delete tokens.id_token;
    nonceValue = '';
    stateValue = '';
    tokensSetPromise = new Promise(_.noop);
    if (tokenRefreshTimer) {
        window.clearTimeout(tokenRefreshTimer);
    }
    return tokenOrigin;
}

function waitTokensSet() {
    return tokensSetPromise;
}


// EXPORT
export default (oAuth) => {
    oAuthConfig = oAuth;
    return {
        requestAccessToken: () => requestAccessToken(oAuth.refreshRedirectPage),
        removeTokens,
        waitTokensSet,
        filterScopeAuthorities
    };
};
