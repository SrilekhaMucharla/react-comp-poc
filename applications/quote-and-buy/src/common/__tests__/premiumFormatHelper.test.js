/* eslint-disable import/no-named-as-default */
import getAmountAsTwoDecimalDigit, { getAmountAsTwoDecimalDigitsOrWhole } from '../premiumFormatHelper';

describe('Premium Helper', () => {
    it('getAmountAsTwoDecimalDigit', () => {
        // given
        const amount = '500.00';
        const returnedAmount = '500.00';
        // when
        const getAmountAsTwoDecimalDigitValue = getAmountAsTwoDecimalDigit(amount);
        // then
        expect(getAmountAsTwoDecimalDigitValue).toBe(returnedAmount);
    });

    it('getAmountAsTwoDecimalDigitsOrWhole', () => {
        // given
        const amount = '500.00';
        const returnedAmount = '500.00';
        // when
        const getAmountAsTwoDecimalDigitValue = getAmountAsTwoDecimalDigitsOrWhole(amount);
        // then
        expect(getAmountAsTwoDecimalDigitValue).toBe(returnedAmount);
    });
});
