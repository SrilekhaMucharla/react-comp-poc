import {
    TEST_FETCH_START,
    TEST_FETCH_SUCCESS,
    TEST_FETCH_FAILED,
    TEST_FETCH_RESET
} from '../action.types';

const INITIAL_STATE = {
    error: null,
    loading: false,
    finished: false,
    testResult: {}
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TEST_FETCH_START:
            return {
                loading: true,
                ...state
            };
        case TEST_FETCH_SUCCESS:
            return {
                ...state,
                testResult: action.payload,
                loading: false,
                finished: true,
                error: null,
            };
        case TEST_FETCH_FAILED:
            return {
                ...state,
                loading: false,
                finished: true,
                error: action.payload,
            };
        case TEST_FETCH_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
}
