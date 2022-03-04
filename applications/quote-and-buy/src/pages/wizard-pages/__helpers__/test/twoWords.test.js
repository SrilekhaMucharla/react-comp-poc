
import twoWords from '../twoWords';

describe('twoWords function', () => {
    test('one word sentence', () => {
        const testSentence = 'one';
        const expected = 'one';
        const actual = twoWords(testSentence);
        expect(actual).toEqual(expected);
    });
    test('two word sentence', () => {
        const testSentence = 'one two';
        const expected = 'one';
        const actual = twoWords(testSentence);
        expect(actual).toEqual(expected);
    });
    test('not string as input', () => {
        const testSentence = 3;
        const expected = null;
        const actual = twoWords(testSentence);
        expect(actual).toEqual(expected);
    });
});
