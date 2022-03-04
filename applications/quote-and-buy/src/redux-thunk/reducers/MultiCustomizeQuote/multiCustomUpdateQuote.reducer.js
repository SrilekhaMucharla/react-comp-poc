import {
    MULTI_CUSTOM_UPDATE_QUOTE_START,
    MULTI_CUSTOM_UPDATE_QUOTE_SUCCESS,
    MULTI_CUSTOM_UPDATE_QUOTE_FAIL,
    MULTI_CUSTOM_UPDATE_QUOTE_RESET
} from '../../action.types';

const INITIAL_STATE = {
    multiCustomUpdatedQuoteObj: {},
    multiCustomQuoteError: null,
    multiCustomQuoteFlag: false,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MULTI_CUSTOM_UPDATE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_SUCCESS:
            return {
                ...state,
                multiCustomUpdatedQuoteObj: action.payload.quoteObj,
                multiCustomQuoteError: null,
                multiCustomQuoteFlag: false,
                loading: false,
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_FAIL:
            return {
                ...state,
                multiCustomUpdatedQuoteObj: {},
                multiCustomQuoteError: action.payload,
                multiCustomQuoteFlag: false,
                loading: false,
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_RESET:
            return {
                ...state,
                multiCustomUpdatedQuoteObj: {},
                multiCustomQuoteError: null,
                multiCustomQuoteFlag: false,
                loading: false,
            };
        default:
            return state;
    }
}
