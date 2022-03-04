import {
    OFFERED_QUOTE_DETAILS,
    MULTI_OFFERED_QUOTE_DETAILS
} from '../action.types';

const INITIAL_STATE = {
    offeredQuotes: {},
    mcOfferedQuotes: [],
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case OFFERED_QUOTE_DETAILS:
            return {
                ...state,
                offeredQuotes: action.payload
            };
        case MULTI_OFFERED_QUOTE_DETAILS:
            return {
                ...state,
                mcOfferedQuotes: action.payload
            };

        default:
            return state;
    }
}
