import {
    RETRIEVE_QUOTE_SUCCESS,
    RETRIEVE_QUOTE_FAIL,
    RETRIEVE_QUOTE_START
} from '../action.types';

const INITIAL_STATE = {
    retrieveQuoteObj: {},
    retrieveQuoteError: null,
    loading: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case RETRIEVE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case RETRIEVE_QUOTE_SUCCESS:
            return {
                ...state,
                retrieveQuoteObj: action.payload.quoteObj,
                retrieveQuoteError: null,
                loading: false
            };
        case RETRIEVE_QUOTE_FAIL:
            return {
                ...state,
                retrieveQuoteObj: {},
                retrieveQuoteError: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
