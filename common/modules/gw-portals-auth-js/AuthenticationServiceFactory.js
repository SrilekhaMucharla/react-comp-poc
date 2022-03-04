import _ from 'lodash';
import queryString from 'query-string';
import { getProxiedUrl, encodeFormData } from 'gw-portals-url-js';

import iframeUtil from './utils/IframeUtil/IframeUtil';

import OAuthUtil from './utils/OAuthUtil';
import AuthenticationUtil from './utils/AuthenticationUtil';

// METHODS
/**
 * If user is not logged in and iframe is loaded properly-
 * returns an XUaaCsrf value and sets a "XUaaCsrf" cookie
 *
 * @returns {Promise}
 */
function getXUaaCsrf() {
    return iframeUtil.loadIframe(
        {
            src: getProxiedUrl('login'),
            // detect isn't redirected (not logged in already)
            // expectedSrcPartOnLoad: '/login'
        }
    ).then((iframeData) => {
        /**
         * @type {HTMLInputElement}
         */
        const XUaaCsrfIframeInput = iframeData.iframeDoc.querySelector('[name="X-Uaa-Csrf"]');
        const XUaaCsrf = XUaaCsrfIframeInput.value;
        return XUaaCsrf;
    });
}

function sendLoginRequest(XUaaCsrf, username, password) {
    const formData = encodeFormData({
        username: username,
        password: password,
        'X-Uaa-Csrf': XUaaCsrf
    });

    return fetch(getProxiedUrl('login.do'), {
        method: 'POST',
        credentials: 'same-origin', // add cookies
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then((res) => {
        const urlQueryString = queryString.extract(res.url);
        const urlQueryParams = queryString.parse(urlQueryString);
        const urlQueryError = [].concat(urlQueryParams.error).join('');

        if (_.isEmpty(urlQueryError)) {
            return res;
        }

        const loginError = {
            error: urlQueryError // reflected in the ERRORS variable
        };

        throw loginError; // trigger the Promise reject
    });
}

function configWithLogout(config, logoutFn) {
    return {
        ...config,
        onRefreshError: logoutFn
    };
}

function logout(oAuthConfig) {
    const authUtil = AuthenticationUtil(oAuthConfig);
    const oAuthUtil = OAuthUtil(oAuthConfig);
    let token;
    return oAuthUtil.waitTokensSet()
        .then((tokens) => {
            token = tokens.accessToken;
        }).then(() => fetch(
            getProxiedUrl(oAuthConfig.url + oAuthConfig.endpoints.logout),
            { // call logout endpoint to signal that auth session should be destroyed
                mode: oAuthConfig.logoutMode,
                credentials: 'include'// add cookies
            }
        )).then((res) => {
            const origin = oAuthUtil.removeTokens();
            authUtil.emitLogoutEvent({ token, origin });
            return { res };
        })
        .catch((err) => {
            const origin = oAuthUtil.removeTokens();
            authUtil.emitLogoutEvent({ token, origin });
            return {
                res: err
            };
        });
}

function loginWithGoogle(authUtil) {
    // first try to retrieve a token so that we will be redirected back to the
    // correct page after authentication
    return authUtil.testForOAuthToken().catch(() => {
        // not authenticated so load the login page and get the 'login with google' link
        return iframeUtil.loadIframe({
            src: '/login',
            // detect isn't redirected (not logged in already)
            expectedSrcPartOnLoad: '/login'
        }).then((iframeData) => {
            // go to the google authorize url
            /**
             * @type {HTMLLinkElement}
             */
            const googleLoginLink = iframeData.iframeDoc.querySelector('a[href^="https://accounts.google.com/o/oauth2"]');
            window.top.location.href = googleLoginLink.href;
        });
    });
}

function login(authUtil, { username, password }) {
    return getXUaaCsrf()
        .then((csrfToken) => {
            return sendLoginRequest(csrfToken, username, password);
        })
        .then(authUtil.loginWithCurrentCookies);
}

// EXPORT
export default (oAuthConfig) => {
    const authUtil = AuthenticationUtil(configWithLogout(oAuthConfig));
    return {
        logout: () => logout(oAuthConfig),
        login: (credentials) => login(authUtil, credentials),
        loginWithGoogle: () => loginWithGoogle(authUtil),
        forgotPassword: authUtil.forgotPassword,
        changePassword: authUtil.changePassword,
        signUp: authUtil.signUp,
        verifyResetCode: authUtil.verifyResetCode,
        testForOAuthToken: authUtil.testForOAuthToken,
        onLoginStateChange: authUtil.addLoginStateChangeListener,
        loginWithCurrentCookies: authUtil.loginWithCurrentCookies,
        waitForLoginRequestComplete: authUtil.waitForLoginRequestComplete
    };
};
