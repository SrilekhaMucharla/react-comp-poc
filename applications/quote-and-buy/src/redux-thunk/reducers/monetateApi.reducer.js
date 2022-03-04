import {
    MONETATE_FETCH_START,
    MONETATE_FETCH_SUCCESS,
    MONETATE_FETCH_FAILED,
    MONETATE_FETCH_RESET
} from '../action.types';

const INITIAL_STATE = {
    error: null,
    loading: false,
    finished: false,
    resultData: {}
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MONETATE_FETCH_START:
            return {
                loading: true,
                ...state
            };
        case MONETATE_FETCH_SUCCESS:
            return {
                ...state,
                resultData: action.payload.data.responses[0].actions,
                monetateId: action.payload.meta.monetateId,
                loading: false,
                finished: true,
                error: null,
            };
        case MONETATE_FETCH_FAILED:
            return {
                ...state,
                loading: false,
                finished: true,
                error: action.payload,
            };
        case MONETATE_FETCH_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
}
