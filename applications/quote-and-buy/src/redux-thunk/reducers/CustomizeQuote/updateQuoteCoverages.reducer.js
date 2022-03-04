import {
    UPDATE_QUOTE_COVERAGES_SUCCESS,
    UPDATE_QUOTE_COVERAGES_FAIL
} from '../../action.types';

const INITIAL_STATE = {
    quoteCoveragesObj: {},
    quoteCoveragesError: null
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_QUOTE_COVERAGES_SUCCESS:
            return {
                ...state,
                quoteCoveragesObj: action.payload,
                quoteCoveragesError: null
            };
        case UPDATE_QUOTE_COVERAGES_FAIL:
            return {
                ...state,
                quoteCoveragesObj: {},
                quoteCoveragesError: action.payload
            };
        default:
            return state;
    }
}
