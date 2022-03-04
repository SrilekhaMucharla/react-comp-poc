import {
    UPDATE_MARKETING_PREFERENCES_SUCCESS,
    UPDATE_MARKETING_PREFERENCES_FAIL,
    UPDATE_MARKETING_PREFERENCES_START,
    CLEAR_MARKETING_PREFERENCES_DATA
} from '../../action.types';

const INITIAL_STATE = {
    marketingUpdatedObj: {},
    marketingUpdatedError: null,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_MARKETING_PREFERENCES_START:
            return {
                ...state,
                loading: true
            };
        case UPDATE_MARKETING_PREFERENCES_SUCCESS:
            return {
                ...state,
                marketingUpdatedObj: action.payload,
                marketingUpdatedError: null,
                loading: false,
            };
        case UPDATE_MARKETING_PREFERENCES_FAIL:
            return {
                ...state,
                marketingUpdatedObj: {},
                marketingUpdatedError: action.payload,
                loading: false,
            };
        case CLEAR_MARKETING_PREFERENCES_DATA:
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
