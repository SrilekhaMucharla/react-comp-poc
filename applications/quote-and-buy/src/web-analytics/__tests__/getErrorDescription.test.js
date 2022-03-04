import { SESSION_TIMEOUT_ERROR, UW_ERROR_CODE, VALIDATION_ERROR } from '../../constant/const';
import getErrorDescription from '../getErrorDescription';

describe('getErrorDescription', () => {
    test('BACKEND', () => {
        const expected = 'Backend error, covers error codes: 705, 716, 802, 805, 805.';
        const actual = getErrorDescription(UW_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('VALIDATION', () => {
        const expected = 'Validation error.';
        const actual = getErrorDescription(VALIDATION_ERROR);
        expect(actual).toBe(expected);
    });

    test('VALIDATION', () => {
        const expected = 'Session timeout error code: 408.';
        const actual = getErrorDescription(SESSION_TIMEOUT_ERROR);
        expect(actual).toBe(expected);
    });

    test('null', () => {
        const expected = null;
        const actual = getErrorDescription();
        expect(actual).toBe(expected);
    });
});
