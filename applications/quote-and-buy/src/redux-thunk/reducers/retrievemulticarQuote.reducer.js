import {
    RETRIEVE_MULTICAR_QUOTE_SUCCESS,
    RETRIEVE_MULTICAR_QUOTE_FAIL,
    RETRIEVE_MULTICAR_QUOTE_START
} from '../action.types';

const INITIAL_STATE = {
    retrievemulticarQuoteObj: {},
    retrievemulticarQuoteError: null,
    loading: false
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case RETRIEVE_MULTICAR_QUOTE_START:
            return {
                ...state,
                loading: true
            };
        case RETRIEVE_MULTICAR_QUOTE_SUCCESS:
            return {
                ...state,
                retrievemulticarQuoteObj: action.payload,
                retrievemulticarQuoteError: null,
                loading: false
            };
        case RETRIEVE_MULTICAR_QUOTE_FAIL:
            return {
                ...state,
                retrievemulticarQuoteObj: {},
                retrievemulticarQuoteError: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
