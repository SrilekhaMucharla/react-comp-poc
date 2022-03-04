/* eslint-disable prefer-promise-reject-errors */
import { JsonRPCService } from 'gw-portals-transport-js';
import { getProxiedUrl } from 'gw-portals-url-js';

import EventEmitter from 'eventemitter2';
import OAuthUtil from './OAuthUtil';
import iframeUtil from './IframeUtil/IframeUtil';
import jwtHelper from './JwtHelper';
import ERRORS from '../AuthErrors';

/**
 * @type {Promise}
 */
let loginResultPromise;
const authStatusListeners = [];
// an alternative to registering a listener with AuthenticationService
// is to listen for loginState::change events
const authUtilEmitter = new EventEmitter.EventEmitter2({
    wildcard: true,
    delimiter: '::',
    maxListeners: 0
});

function emitLoginStateChangeEvent(authData) {
    authUtilEmitter.emit('loginState::change', authData);
    authStatusListeners.forEach((listener) => listener(authData));
}

// METHODS
function emitLoginEvent(userData, oAuthConfig) {
    // eslint-disable-next-line no-param-reassign
    userData.user_name = userData[oAuthConfig.usernameProperty];
    const authData = {
        isLoggedIn: true,
        userData: userData
    };
    emitLoginStateChangeEvent(authData);
}

function emitLogoutEvent(evtData) {
    const authData = {
        isLoggedIn: false,
        userData: null,
        evtData
    };
    loginResultPromise = Promise.reject();
    emitLoginStateChangeEvent(authData);
}

function addLoginStateChangeListener(listener) {
    authStatusListeners.push(listener);
}

function testForOAuthToken(oAuthUtil, { onRefreshError }) {
    return oAuthUtil.requestAccessToken({ onRefreshError });
}

function getIdTokenDetails(tokens, oAuthConfig) {
    if (tokens.idToken) {
        return jwtHelper.decodeToken(tokens.idToken);
    }
    const authUrl = getProxiedUrl(oAuthConfig.url + oAuthConfig.endpoints.userinfo);
    return fetch(authUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        if (!response.ok) {
            return Promise.reject(`${authUrl} - ${response.status} - ${response.statusText}`);
        }
        return response.json();
    }).then((userInfo) => {
        return { ...userInfo, ...tokens };
    });
}

function getUserInfo(oAuthUtil, oAuthConfig) {
    return oAuthUtil.waitTokensSet()
        .then((tokens) => {
            return getIdTokenDetails(tokens, oAuthConfig);
        });
}

function loginWithCurrentCookies(oAuthUtil, oAuthConfig) {
    loginResultPromise = testForOAuthToken(oAuthUtil, oAuthConfig)
        .then(() => getUserInfo(oAuthUtil, oAuthConfig))
        .then((data) => {
            emitLoginEvent(data, oAuthConfig);
            return data;
        })
        .catch((err) => {
            if (err && err.redirect) {
                // go to external login page
                window.location.href = err.redirect;
                return;
            }
            throw err;
        });
    return loginResultPromise;
}

function isErrorCode(baseError, codeToCheck) {
    if (baseError instanceof Error) {
        const errorCode = baseError.message.match(/[0-9]+/);
        return errorCode && errorCode[0] === codeToCheck;
    }
    return baseError.error.message.includes(codeToCheck);
}

function forgotPassword(email, additionalHeaders = {}) {
    const authResetPath = '/auth/resetpassword';
    const newPasswordEntryUrl = `${window.location.origin}${authResetPath}`;
    const params = [{
        email,
        newPasswordEntryUrl
    }];

    return JsonRPCService.send(getProxiedUrl('resetpassword'), 'sendPasswordToken', params, additionalHeaders)
        .then((res) => ({ res: res }))
        .catch((error) => {
            // email does not exists when error message return code 404
            if (isErrorCode(error.baseError, '404')) {
                return Promise.reject({
                    error: ERRORS.emailNotFound
                });
            }
            return Promise.reject(error);
        });
}
// eslint-disable-next-line camelcase
function changePassword({ code, new_password }, additionalHeaders = {}) {
    const params = [{
        code,
        new_password
    }];

    return JsonRPCService.send(getProxiedUrl('resetpassword'), 'newPassword', params, additionalHeaders)
        .catch((error) => {
            // invalid token or password returns error message code 422
            if (isErrorCode(error.baseError, '422')) {
                return Promise.reject({
                    error: ERRORS.invalidTokenOrEmail
                });
            }
            return Promise.reject(error);
        });
}

function signUp({
    givenName, familyName, userName, email, password
}) {
    const params = [{
        name: {
            givenName,
            familyName
        },
        emails: [{
            value: email,
            primary: true
        }],
        userName,
        password
    }];

    return JsonRPCService.send(getProxiedUrl('signup'), 'createUser', params)
        .then((res) => ({ res }))
        .catch((error) => {
            const errorCode = error.baseError.error.message.match(/[0-9]+/gi);
            // user already exists if error message return code 409
            if (errorCode && errorCode.includes('409')) {
                return Promise.reject({
                    error: ERRORS.userAlreadyExists
                });
            }
            return Promise.reject(error);
        });
}

function verifyResetCode(code) {
    return iframeUtil.loadIframe({
        src: `/reset_password?code=${code}`
    }).then((iframeData) => {
        /**
         * @type {HTMLInputElement}
         */
        const codeIframeInput = iframeData.iframeDoc.querySelector('[name="code"]');
        const newCode = codeIframeInput.value;
        return {
            res: newCode
        };
    });
}

// EXPORT'
export default (oAuthConfig) => {
    const oAuthUtil = OAuthUtil(oAuthConfig);
    return {
        testForOAuthToken: () => testForOAuthToken(oAuthUtil),
        emitLoginEvent,
        emitLogoutEvent,
        addLoginStateChangeListener,
        loginWithCurrentCookies: () => loginWithCurrentCookies(oAuthUtil, oAuthConfig),
        waitForLoginRequestComplete: loginResultPromise,
        forgotPassword: forgotPassword,
        changePassword: changePassword,
        signUp,
        verifyResetCode
    };
};
