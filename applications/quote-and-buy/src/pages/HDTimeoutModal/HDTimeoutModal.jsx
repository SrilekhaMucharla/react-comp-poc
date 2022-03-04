/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { useIdleTimer } from 'react-idle-timer';
import { AnalyticsHDModal as HDModal } from '../../web-analytics';
import { TIMEOUT_PAGE, BASENAME } from '../../routes/BaseRouter/RouteConst';
import { WARNING_TIME, LOGOUT_TIME } from '../../constant/const';
import * as messages from './HDTimeoutModal.messages';
// import './HDTimeoutModal.scss';
import '../../assets/sass-refactor/main.scss';

const EVENTS = ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove'];
const INTERVAL_TIME = 1000;
const DEBOUNCE_TIME = 500;

const HDTimeoutModal = () => {
    const warningTime = 1000 * 60 * WARNING_TIME;
    const logoutTime = 1000 * 60 * LOGOUT_TIME;
    const [showWarning, setShowWarning] = useState(false);
    const [remainingTime, setRemainingTime] = useState();

    const millisToMinutesAndSeconds = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        setRemainingTime(`${minutes} min ${(seconds < 10 ? '0' : '')}${seconds} secs`);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            millisToMinutesAndSeconds(getRemainingTimeToLogout());
        }, INTERVAL_TIME);

        return () => clearInterval(intervalId);
    }, []);

    const handleShowingWarning = () => {
        if (!((window.location.pathname).includes(`${TIMEOUT_PAGE}`))) {
            setShowWarning(true);
            millisToMinutesAndSeconds(logoutTime);
            startLogoutTimer();
        }
    };

    const handleLogout = () => {
        setShowWarning(false);
        const history = createBrowserHistory();
        history.push(`${BASENAME}${TIMEOUT_PAGE}`);
        window.location.reload();
    };

    const handleContinue = () => {
        setShowWarning(false);
        pauseLogoutTimer();
        startWarningTimer();
    };

    const {
        start: startWarningTimer
    } = useIdleTimer({
        timeout: warningTime,
        events: EVENTS,
        onIdle: handleShowingWarning,
        stopOnIdle: true,
        debounce: DEBOUNCE_TIME
    });

    const {
        getRemainingTime: getRemainingTimeToLogout,
        start: startLogoutTimer,
        pause: pauseLogoutTimer
    } = useIdleTimer({
        startManually: true,
        timeout: logoutTime,
        events: [],
        onIdle: handleLogout,
        stopOnIdle: true
    });

    return (
        <HDModal
            webAnalyticsView={{ page_section: messages.header }}
            webAnalyticsEvent={{ event_action: messages.header }}
            id="timeout-popup"
            customStyle="timeout-modal"
            headerText={messages.header}
            hideCancelButton
            hideClose
            confirmLabel={messages.continueButton}
            onConfirm={handleContinue}
            show={showWarning}
        >
            <p id="timeout-popup-text">{messages.sessionMessage}</p>
            <p id="timeout-popup-time" className="font-bold mb-n3 mt-3">{remainingTime}</p>
        </HDModal>
    );
};

export default HDTimeoutModal;
