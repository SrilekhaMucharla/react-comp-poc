import {
    MULTI_TO_SINGLE_QUOTE_START,
    MULTI_TO_SINGLE_QUOTE_SUCCESS,
    MULTI_TO_SINGLE_QUOTE_FAIL,
    CLEAR_MULTI_TO_SINGLE_QUOTE,
    MULTI_TO_SINGLE_RESET
} from '../action.types';

const INITIAL_STATE = {
    multiToSingleQuoteObj: {},
    multiToSingleQuoteError: null,
    loading: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MULTI_TO_SINGLE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case MULTI_TO_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                multiToSingleQuoteObj: action.payload.quoteObj,
                multiToSingleQuoteError: null,
                loading: false
            };
        case MULTI_TO_SINGLE_QUOTE_FAIL:
            return {
                ...state,
                multiToSingleQuoteObj: {},
                multiToSingleQuoteError: action.payload,
                loading: false
            };
        case CLEAR_MULTI_TO_SINGLE_QUOTE:
            return {
                ...state,
                multiToSingleQuoteObj: {},
                multiToSingleQuoteError: null,
                loading: false
            };
        case MULTI_TO_SINGLE_RESET:
            return {
                ...state,
                multiToSingleQuoteObj: {},
                multiToSingleQuoteError: null,
                loading: false
            };
        default:
            return state;
    }
}
