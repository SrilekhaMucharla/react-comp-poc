// import dayjs from 'dayjs';
import {
    getLatestQuoteByInceptionDate, getYearsDifferenceFromToday, getDateObject, dateToFormattedString
} from '../dateHelpers';

describe('getLatestQuoteByInceptionDate', () => {
    it('getLatestQuoteByInceptionDate', () => {
        // given
        const quoteObject = [{
            baseData: {
                periodStatus: 'Draft', accountHolder: {}, termType: 'Annual', numberOfCarsOnHousehold: 6, producerCode: 'Default'
            },
            isParentPolicy: false,
            lobData: { privateCar: {} },
            quoteCreationTime: '2023-06-04T05:59:02Z',
            quoteData: { offeredQuotes: [] },
            quoteID: '0000017872',
            quoteUpdateTime: '2023-06-04T07:51:48Z'
        }];
        // when
        const findLatestQuote = getLatestQuoteByInceptionDate(quoteObject);
        // then
        expect(findLatestQuote).toBe(quoteObject[0]);
    });
});

describe('getYearsDifferenceFromToday', () => {
    it('getYearsDifferenceFromToday', () => {
        // given
        const diffNo = 3;
        const pastDate = '2018-12-07';
        // when
        const yearDiff = getYearsDifferenceFromToday(pastDate);
        // then
        expect(yearDiff).toBe(diffNo);
    });
});

describe('getDateObject', () => {
    it('getDateObject', () => {
        // given
        const definedDate = { day: 2, month: 11, year: 2018 };
        const dateString = `${1 + definedDate.month}/${definedDate.day}/${definedDate.year}`;
        const diffNo = new Date(dateString);
        // when
        const yearDiff = getDateObject(definedDate);
        // then
        expect(yearDiff).toStrictEqual(diffNo);
    });
});

describe('dateToFormattedString', () => {
    const expected = '10-5-2022';
    const actual = dateToFormattedString({
        day: 10,
        month: 5,
        year: 2022
    });
    expect(actual).toBe(expected);
});
