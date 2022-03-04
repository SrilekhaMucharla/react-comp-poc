import errorStateReducers from '../errorStatusCode.reducer';
import { SET_ERROR_STATUS_CODE, CLEAR_ERROR_STATUS_CODE } from '../../actions/errorStatusCode.action';

const INITIAL_STATE = {
    errorStatusCode: undefined
};
describe('errorStateCode reducers', () => {
    it('should return the initial state', () => {
        expect(errorStateReducers(undefined, {})).toEqual({
            errorStatusCode: undefined
        });
    });
    it('should handle SET_ERROR_STATUS_CODE ', () => {
        expect(errorStateReducers(INITIAL_STATE, {
            type: SET_ERROR_STATUS_CODE,
            payload: 404
        })).toEqual({
            errorStatusCode: 404
        });
    });
    it('should handle CLEAR_ERROR_STATUS_CODE ', () => {
        expect(errorStateReducers(INITIAL_STATE, {
            type: CLEAR_ERROR_STATUS_CODE,
            payload: undefined
        })).toEqual({
            errorStatusCode: undefined
        });
    });
});
