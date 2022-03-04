import {
    CREATE_QUOTE_SUCCESS,
    CREATE_QUOTE_FAIL,
    CREATE_QUOTE_START,
    CLEAR_LWR_QUOTE
} from '../action.types';

const INITIAL_STATE = {
    lwrQuoteObj: {},
    quoteError: null,
    callCreateQuote: false,
    loading: false,
    triggerLWRAPICall: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case CREATE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case CREATE_QUOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                lwrQuoteObj: action.payload.quoteObj,
                quoteError: null,
                callCreateQuote: false,
                triggerLWRAPICall: false
            };
        case CREATE_QUOTE_FAIL:
            return {
                ...state,
                lwrQuoteObj: {},
                loading: false,
                quoteError: action.payload,
                callCreateQuote: false,
                triggerLWRAPICall: false
            };
        case CLEAR_LWR_QUOTE:
            return {
                lwrQuoteObj: {},
                quoteError: null,
                callCreateQuote: false,
                loading: false,
                triggerLWRAPICall: false
            };
        default:
            return state;
    }
}
