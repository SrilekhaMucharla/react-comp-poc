import {
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_START,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_SUCCESS,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_FAIL,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET
} from '../../action.types';

const INITIAL_STATE = {
    multiCustomUpdatedQuoteCoverageObj: {},
    multiCustomQuoteCoverageError: null,
    multiCustomQuoteCoverageFlag: false,
    loading: false,
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_START:
            return {
                ...state,
                loading: true
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_SUCCESS:
            return {
                ...state,
                multiCustomUpdatedQuoteCoverageObj: action.payload.quoteObj,
                multiCustomQuoteCoverageError: null,
                multiCustomQuoteCoverageFlag: false,
                loading: false,
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_FAIL:
            return {
                ...state,
                multiCustomUpdatedQuoteCoverageObj: {},
                multiCustomQuoteCoverageError: action.payload,
                multiCustomQuoteCoverageFlag: false,
                loading: false,
            };
        case MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET:
            return {
                ...state,
                multiCustomUpdatedQuoteCoverageObj: {},
                multiCustomQuoteCoverageError: null,
                multiCustomQuoteCoverageFlag: false,
                loading: false,
            };
        default:
            return state;
    }
}
