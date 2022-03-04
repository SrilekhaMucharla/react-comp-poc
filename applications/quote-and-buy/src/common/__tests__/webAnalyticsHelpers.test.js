import { QUOTE_DECLINE_ERROR_CODE } from '../../constant/const';
import {
    getEndPolicyDateForMC, getEndPolicyDateForSC, getStartPolicyDateForMC, getStartPolicyDateForSC, updateStateOnQuoteDecline
} from '../webAnalyticsHelpers';

describe('webAnalytics helpers', () => {
    const date = {
        day: '01',
        month: '02',
        year: '2022'
    };
    const submissionVM = {
        baseData: {
            periodStartDate: {
                value: date
            },
            periodEndDate: {
                value: date
            }
        }
    };

    const mcsubmissionVM = {
        quotes: [{
            baseData: {
                periodStartDate: {
                    value: date
                },
                periodEndDate: {
                    value: date
                }
            }
        }]
    };

    const state = {
        test: 'test'
    };

    describe('getStartPolicyDateForSC', () => {
        it('on given submission extract start date', () => {
            const actual = getStartPolicyDateForSC(submissionVM);
            expect(actual).toBe(date);
        });
    });
    describe('getEndPolicyDateForSC', () => {
        it('on given submission extract end date', () => {
            const actual = getEndPolicyDateForSC(submissionVM);
            expect(actual).toBe(date);
        });
    });
    describe('getStartPolicyDateForMC', () => {
        it('on given submission extract start date', () => {
            const actual = getStartPolicyDateForMC(mcsubmissionVM);
            expect(actual).toBe(date);
        });
    });
    describe('getEndPolicyDateForMC', () => {
        it('on given submission extract end date', () => {
            const actual = getEndPolicyDateForMC(mcsubmissionVM);
            expect(actual).toBe(date);
        });
    });
    describe('updateStateOnQuoteDecline', () => {
        it('on given submission and state return state with error code', () => {
            const expected = {
                ...state,
                error: QUOTE_DECLINE_ERROR_CODE,
                periodDates: {
                    startDate: '01-02-2022',
                    endDate: '01-02-2022'
                }
            };
            const actual = updateStateOnQuoteDecline(state, submissionVM);
            expect(actual).toStrictEqual(expected);
        });
    });
});
