import reductNumbersInString from '../reductNumbersInString';

describe('reductNumbersInString function', () => {
    test('when empty string expect to return empty string', () => {
        const word = '';
        const actual = reductNumbersInString(word);
        expect(actual).toBe(word);
    });
    test('when word does not contain numbers expect to return word', () => {
        const word = 'test';
        const actual = reductNumbersInString(word);
        expect(actual).toBe(word);
    });
    test('when word does contain numbers expect to return reduced word', () => {
        const word = 'test123';
        const expected = 'testnum_deleted';
        const actual = reductNumbersInString(word);
        expect(actual).toBe(expected);
    });
    test('when string does not contain numbers expect to return string', () => {
        const text = 'testa testb  testc';
        const actual = reductNumbersInString(text);
        const expected = 'testa testb testc';
        expect(actual).toBe(expected);
    });
    test('when string does contain numbers expect to return reduced string', () => {
        const text = 'test123  123test te123st';
        const expected = 'testnum_deleted num_deletedtest tenum_deletedst';
        const actual = reductNumbersInString(text);
        expect(actual).toBe(expected);
    });
});
