import {
    SET_ERROR_STATUS_CODE, CLEAR_ERROR_STATUS_CODE, setErrorStatusCode, clearErrorStatusCode
} from '../errorStatusCode.action';

describe('actions', () => {
    it('should create an action to set error status code', () => {
        const errorStatusCode = 404;
        const expectedAction = {
            type: SET_ERROR_STATUS_CODE,
            payload: errorStatusCode
        };
        expect(setErrorStatusCode(errorStatusCode)).toEqual(expectedAction);
    });
    it('should create an action to clear error status code', () => {
        const expectedAction = {
            type: CLEAR_ERROR_STATUS_CODE
        };
        expect(clearErrorStatusCode()).toEqual(expectedAction);
    });
});
