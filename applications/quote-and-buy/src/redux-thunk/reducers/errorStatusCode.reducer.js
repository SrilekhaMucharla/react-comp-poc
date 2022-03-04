
import { SET_ERROR_STATUS_CODE, CLEAR_ERROR_STATUS_CODE } from '../actions/errorStatusCode.action';

const INITIAL_STATE = {
    errorStatusCode: undefined
};
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_ERROR_STATUS_CODE:
            return {
                errorStatusCode: action.payload
            };
        case CLEAR_ERROR_STATUS_CODE:
            return {
                errorStatusCode: undefined
            };
        default:
            return state;
    }
}
