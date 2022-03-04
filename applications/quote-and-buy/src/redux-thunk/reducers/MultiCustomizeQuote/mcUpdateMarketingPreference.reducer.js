import {
    MC_UPDATE_MARKETING_PREFERENCES_SUCCESS,
    MC_UPDATE_MARKETING_PREFERENCES_FAIL,
    MC_UPDATE_MARKETING_PREFERENCES_START,
    MC_CLEAR_MARKETING_PREFERENCES_DATA,
    MC_CLEAR_MARKETING_PREFERENCES_RESET
} from '../../action.types';

const INITIAL_STATE = {
    marketingUpdatedObj: {},
    marketingUpdatedError: null,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MC_UPDATE_MARKETING_PREFERENCES_START:
            return {
                ...state,
                loading: true
            };
        case MC_UPDATE_MARKETING_PREFERENCES_SUCCESS:
            return {
                ...state,
                marketingUpdatedObj: action.payload,
                marketingUpdatedError: null,
                loading: false,
            };
        case MC_UPDATE_MARKETING_PREFERENCES_FAIL:
            return {
                ...state,
                marketingUpdatedObj: {},
                marketingUpdatedError: action.payload,
                loading: false,
            };
        case MC_CLEAR_MARKETING_PREFERENCES_RESET:
            return {
                ...state,
                marketingUpdatedObj: {},
                marketingUpdatedError: null,
                loading: false,
            };
        case MC_CLEAR_MARKETING_PREFERENCES_DATA:
            return {
                ...state,
                marketingUpdatedObj: {},
                marketingUpdatedError: null,
                loading: false,
            };
        default:
            return state;
    }
}
