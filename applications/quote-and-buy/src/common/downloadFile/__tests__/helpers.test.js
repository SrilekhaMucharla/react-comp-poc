import { dateCheckBeforeORAfter, getFilename } from '../helpers';

describe('downloadPolicyBookletFile', () => {
    // given
    const dateBefore = {
        day: 1,
        month: 1,
        year: 2022
    };
    const dateAfter = {
        day: 17,
        month: 1,
        year: 2022
    };
    const dateBeforeYD = {
        day: 1,
        month: 1,
        year: 2022
    };
    const dateAfterYD = {
        day: 18,
        month: 2,
        year: 2022
    };

    describe('dateCheckBeforeORAfter', () => {
        it('should return true if date is before 2020, 11, 9', () => {
            // then
            expect(dateCheckBeforeORAfter(dateBefore, 'HD')).toBeTruthy();
        });

        it('should return false if date is after 2020, 11, 9', () => {
            // then
            expect(dateCheckBeforeORAfter(dateAfter, 'HD')).toBeFalsy();
        });
    });

    describe('dateCheckBeforeORAfter', () => {
        it('should return true if date is before 2020, 11, 9', () => {
            // then
            expect(dateCheckBeforeORAfter(dateBeforeYD, 'YD')).toBeTruthy();
        });

        it('should return false if date is after 2020, 11, 9', () => {
            // then
            expect(dateCheckBeforeORAfter(dateAfterYD, 'YD')).toBeFalsy();
        });
    });

    describe('getFilename', () => {
        it('should return file name based on url', () => {
            // given
            const url = 'https://www.hastingsdirect.com/documents/Policy_documents/Car/HDYD-PC-GW-07-20.pdf';
            // when
            const fileName = getFilename(url);
            // then
            expect(fileName).toBe('HDYD-PC-GW-07-20.pdf');
        });
    });
});
