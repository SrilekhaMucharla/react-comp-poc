import {
    SINGLE_TO_MULTI_PRODUCT_START,
    SINGLE_TO_MULTI_PRODUCT_SUCCESS,
    SINGLE_TO_MULTI_PRODUCT_FAIL
} from '../action.types';

const INITIAL_STATE = {
    multiQuoteObj: {},
    quoteError: null,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SINGLE_TO_MULTI_PRODUCT_START:
            return {
                ...state,
                loading: true
            };
        case SINGLE_TO_MULTI_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                multiQuoteObj: action.payload,
                quoteError: null
            };
        case SINGLE_TO_MULTI_PRODUCT_FAIL:
            return {
                ...state,
                multiQuoteObj: {},
                loading: false,
                quoteError: action.payload
            };
        default:
            return state;
    }
}
