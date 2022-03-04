import {
    UPDATE_QUOTE_SUCCESS,
    UPDATE_QUOTE_FAIL,
    UPDATE_QUOTE_START,
    CLEAR_UPDATE_QUOTE
} from '../action.types';

const INITIAL_STATE = {
    updatedQuoteObj: {},
    quoteError: null,
    updateQuoteFlag: false,
    loading: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case UPDATE_QUOTE_SUCCESS:
            return {
                ...state,
                updatedQuoteObj: action.payload.quoteObj,
                quoteError: null,
                updateQuoteFlag: false,
                loading: false
            };
        case UPDATE_QUOTE_FAIL:
            return {
                ...state,
                updatedQuoteObj: {},
                quoteError: action.payload,
                updateQuoteFlag: false,
                loading: false
            };
        case CLEAR_UPDATE_QUOTE:
            return {
                updatedQuoteObj: {},
                quoteError: null,
                updateQuoteFlag: false,
                loading: false
            };
        default:
            return state;
    }
}
