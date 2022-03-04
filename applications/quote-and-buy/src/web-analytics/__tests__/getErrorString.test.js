import {
    CUE_ERROR_CODE, GREY_LIST_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE,
    QUOTE_RATE_ERROR_CODE, SESSION_TIMEOUT_ERROR, UW_ERROR_CODE, VALIDATION_ERROR
} from '../../constant/const';
import getErrorString from '../getErrorString';

const BACKEND = 'backend';
const VALIDATION = 'validation';
const SESSION_TIMEOUT = 'session timeout';

describe('getErrorString', () => {
    test('UW_ERROR_CODE', () => {
        const expected = BACKEND;
        const actual = getErrorString(UW_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('QUOTE_RATE_ERROR_CODE', () => {
        const expected = BACKEND;
        const actual = getErrorString(QUOTE_RATE_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('CUE_ERROR_CODE', () => {
        const expected = BACKEND;
        const actual = getErrorString(CUE_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('GREY_LIST_ERROR_CODE', () => {
        const expected = BACKEND;
        const actual = getErrorString(GREY_LIST_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('QUOTE_DECLINE_ERROR_CODE', () => {
        const expected = BACKEND;
        const actual = getErrorString(QUOTE_DECLINE_ERROR_CODE);
        expect(actual).toBe(expected);
    });

    test('VALIDATION_ERROR', () => {
        const expected = VALIDATION;
        const actual = getErrorString(VALIDATION_ERROR);
        expect(actual).toBe(expected);
    });

    test('SESSION_TIMEOUT_ERROR', () => {
        const expected = SESSION_TIMEOUT;
        const actual = getErrorString(SESSION_TIMEOUT_ERROR);
        expect(actual).toBe(expected);
    });
});
