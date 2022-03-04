import {
    INCREMENT_MC_START_DATE_PAGE,
    DECREMENT_MC_START_DATE_PAGE
} from '../action.types';

const INITIAL_STATE = {
    currentPageIndex: 0
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case INCREMENT_MC_START_DATE_PAGE:
            return {
                ...state,
                currentPageIndex: state.currentPageIndex + 1
            };
        case DECREMENT_MC_START_DATE_PAGE:
            return {
                ...state,
                currentPageIndex: state.currentPageIndex - 1
            };
        default:
            return state;
    }
}
