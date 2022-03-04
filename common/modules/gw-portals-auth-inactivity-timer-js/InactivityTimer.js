import { AuthenticationServiceFactory } from 'gw-portals-auth-js';

let inactivityTimerId;
let logoutConfirmationTimerId;

export default ({
    oAuthConfig,
    logoutWarningCallback,
    inactivityIntervalMins = 5,
    logoutConfirmationIntervalMins = 1
}) => {
    const authenticationService = AuthenticationServiceFactory(oAuthConfig);

    function initializeInActivityTimer() {
        let warningModal;
        const inactivityInterval = inactivityIntervalMins * 1000 * 60;
        // initial timer to check for inactivity
        inactivityTimerId = window.setTimeout(
            () => {
                const logoutConfirmationInterval = logoutConfirmationIntervalMins * 1000 * 60;

                // second timer to show warning message for a period of time
                logoutConfirmationTimerId = window.setTimeout(() => {
                    warningModal.close();
                    authenticationService.logout();
                }, logoutConfirmationInterval);
                // eslint-disable-next-line no-use-before-define
                warningModal = logoutWarningCallback(resetInactivityTimer);
            },
            inactivityInterval
        );
    }

    function deactivateTimers() {
        if (inactivityTimerId) {
            window.clearTimeout(inactivityTimerId);
            inactivityTimerId = null;
        }
        if (logoutConfirmationTimerId) {
            window.clearTimeout(logoutConfirmationTimerId);
            logoutConfirmationTimerId = null;
        }
    }

    function resetInactivityTimer() {
        deactivateTimers();
        initializeInActivityTimer();
    }

    authenticationService.onLoginStateChange((authData) => {
        const authenticatedFlag = authData.isLoggedIn;
        if (authenticatedFlag) {
            // kick off a timer when user logs in
            resetInactivityTimer();
        } else {
            // if user has logged out then deactivate the timers
            deactivateTimers();
        }
    });

    return {
        // this method is called by the transport service,
        // called every time the user makes an XHR call to the backend -
        resetInactivityTimer: resetInactivityTimer
    };
};
