/* eslint-disable prefer-promise-reject-errors */
import { getProxiedUrl, encodeFormData } from 'gw-portals-url-js';
import AuthenticationUtil from './utils/AuthenticationUtil';
import OAuthUtil from './utils/OAuthUtil';
import ERRORS from './AuthErrors';

// METHODS
function login(authUtil, { username, password }) {
    const formData = encodeFormData({
        username: username,
        password: password,
        client_id: 'uaa'
    });
    return fetch(getProxiedUrl('sso/oauth/authorize'), {
        method: 'POST',
        credentials: 'same-origin', // add cookies
        headers: {
            Accept: 'text/html',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then((res) => {
        if (res.status === 403 && res.statusText.includes('locked')) {
            return Promise.reject({
                error: ERRORS.account_locked
            });
        }

        return authUtil.loginWithCurrentCookies(res);
    }).catch((err) => {
        return Promise.reject({
            error: (err.error === 'account_locked' && ERRORS.account_locked) || ERRORS.login_failure
        });
    });
}

function logout(authUtil, oAuthUtil, oAuthConfig) {
    const xCenterSSOLogoutUrl = getProxiedUrl('/sso/logout');
    const authSolutionLogoutUrl = getProxiedUrl(`${oAuthConfig.url}${oAuthConfig.endpoints.logout}?redirect=${encodeURIComponent(xCenterSSOLogoutUrl)}`);
    return fetch(authSolutionLogoutUrl, {
        mode: oAuthConfig.logoutMode,
        credentials: 'same-origin'// add cookies
    }).then((res) => {
        oAuthUtil.removeTokens();
        authUtil.emitLogoutEvent();
        return {
            res: res
        };
    });
}

// EXPORT
export default (oAuthConf) => {
    const authUtil = AuthenticationUtil(oAuthConf);
    const oAuthUtil = OAuthUtil({
        ...oAuthConf,
        onRefreshError: logout
    });
    return {
        logout: () => logout(authUtil, oAuthUtil, oAuthConf),
        login: (credentials) => login(authUtil, credentials),
        forgotPassword: authUtil.forgotPassword,
        changePassword: authUtil.changePassword,
        signUp: authUtil.signUp,
        verifyResetCode: authUtil.verifyResetCode,
        testForOAuthToken: authUtil.testForOAuthToken,
        onLoginStateChange: authUtil.addLoginStateChangeListener,
        loginWithCurrentCookies: authUtil.loginWithCurrentCookies,
        waitForLoginRequestComplete: authUtil.waitForLoginRequestComplete,
    };
};
