import reductEmailInString from '../reductEmailInString';

describe('reductEmailInString function', () => {
    test('reducted string is returned when string does contain email address', () => {
        const text = 'abc@xyz.com';
        const expected = 'email_deleted';
        const actual = reductEmailInString(text);
        expect(actual).toBe(expected);
    });
    test('text with reducted string is returned when text does contain email address', () => {
        const text = 'Lorem ipsum  abc@xyz.com ipsum lorem';
        const expected = 'Lorem ipsum email_deleted ipsum lorem';
        const actual = reductEmailInString(text);
        expect(actual).toBe(expected);
    });
    test('string is returned when string does not contain email address', () => {
        const text = 'test123';
        const actual = reductEmailInString(text);
        expect(actual).toBe(text);
    });
    test('empty string is returned when empty string is given', () => {
        const text = '';
        const actual = reductEmailInString(text);
        expect(actual).toBe(text);
    });
});
