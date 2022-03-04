import {
    CUSTOM_UPDATE_QUOTE_START,
    CUSTOM_UPDATE_QUOTE_SUCCESS,
    CUSTOM_UPDATE_QUOTE_FAIL
} from '../../action.types';

const INITIAL_STATE = {
    customUpdatedQuoteObj: {},
    customQuoteError: null,
    customQuoteFlag: false,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CUSTOM_UPDATE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case CUSTOM_UPDATE_QUOTE_SUCCESS:
            return {
                ...state,
                customUpdatedQuoteObj: action.payload.quoteObj,
                customQuoteError: null,
                customQuoteFlag: false,
                loading: false,
            };
        case CUSTOM_UPDATE_QUOTE_FAIL:
            return {
                ...state,
                customUpdatedQuoteObj: {},
                customQuoteError: action.payload,
                customQuoteFlag: false,
                loading: false,
            };
        default:
            return state;
    }
}
