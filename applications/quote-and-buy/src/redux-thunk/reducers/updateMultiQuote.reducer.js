import {
    UPDATE_MULTI_QUOTE_SUCCESS,
    UPDATE_MULTI_QUOTE_FAIL,
    UPDATE_MULTI_QUOTE_START,
    UPDATE_MULTI_QUOTE_CLEAR
} from '../action.types';

const INITIAL_STATE = {
    updatedMultiQuoteObj: {},
    multiQuoteError: null,
    updateMultiQuoteFlag: false,
    loading: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_MULTI_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case UPDATE_MULTI_QUOTE_SUCCESS:
            return {
                ...state,
                updatedMultiQuoteObj: action.payload.quoteObj,
                multiQuoteError: null,
                updateMultiQuoteFlag: false,
                loading: false
            };
        case UPDATE_MULTI_QUOTE_FAIL:
            return {
                ...state,
                updatedMultiQuoteObj: {},
                multiQuoteError: action.payload,
                updateMultiQuoteFlag: false,
                loading: false
            };
        case UPDATE_MULTI_QUOTE_CLEAR:
            return {
                ...state,
                updatedMultiQuoteObj: {},
                multiQuoteError: null,
                updateMultiQuoteFlag: false,
                loading: false
            };
        default:
            return state;
    }
}
