import getMonthAsString from '../getMonthAsString';

describe('getMonthAsString', () => {
    it('should return proper month string', () => {
        // then
        expect(getMonthAsString(0)).toBe('Jan');
        expect(getMonthAsString(1)).toBe('Feb');
        expect(getMonthAsString(2)).toBe('Mar');
        expect(getMonthAsString(3)).toBe('Apr');
        expect(getMonthAsString(4)).toBe('May');
        expect(getMonthAsString(5)).toBe('Jun');
        expect(getMonthAsString(6)).toBe('Jul');
        expect(getMonthAsString(7)).toBe('Aug');
        expect(getMonthAsString(8)).toBe('Sep');
        expect(getMonthAsString(9)).toBe('Oct');
        expect(getMonthAsString(10)).toBe('Nov');
        expect(getMonthAsString(11)).toBe('Dec');
    });

    it('should return default value', () => {
        // then
        expect(getMonthAsString({ propname: 'propvalue' })).toBe('');
        expect(getMonthAsString('string')).toBe('');
        expect(getMonthAsString(null)).toBe('');
        expect(getMonthAsString(undefined)).toBe('');
    });
});
