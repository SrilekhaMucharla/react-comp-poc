import {
    MULTI_QUOTE_SUCCESS,
    MULTI_QUOTE_FAIL,
    MULTI_QUOTE_START,
    CLEAR_MULTI_QUOTE
} from '../action.types';

const INITIAL_STATE = {
    multiQuoteObj: {},
    multiQuoteError: null,
    callMultiQuote: false,
    loading: false,
    triggerMultiQuoteAPICall: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MULTI_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case MULTI_QUOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                multiQuoteObj: action.payload.quoteObj,
                multiQuoteError: null,
                callMultiQuote: false,
                triggerMultiQuoteAPICall: false
            };
        case MULTI_QUOTE_FAIL:
            return {
                ...state,
                multiQuoteObj: {},
                loading: false,
                multiQuoteError: action.payload,
                callMultiQuote: false,
                triggerMultiQuoteAPICall: false
            };
        case CLEAR_MULTI_QUOTE:
            return {
                ...state,
                multiQuoteObj: {},
                multiQuoteError: null,
                callMultiQuote: false,
                loading: false,
                triggerMultiQuoteAPICall: false
            };
        default:
            return state;
    }
}
