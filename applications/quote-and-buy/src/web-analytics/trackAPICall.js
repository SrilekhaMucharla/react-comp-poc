import { trackEvent } from './trackData';

export const API_CALL_TYPE = 'API call';
export const SUCCESS = 'SUCCESS';
export const FAIL = 'FAIL';

export const trackAPICallSuccess = (eventAction) => {
    trackEvent({
        event_value: SUCCESS,
        event_type: API_CALL_TYPE,
        event_action: eventAction
    });
};

export const trackAPICallFail = (eventAction, errorMessage) => {
    trackEvent({
        event_value: FAIL,
        event_type: API_CALL_TYPE,
        event_action: eventAction,
        error_message: errorMessage
    });
};
