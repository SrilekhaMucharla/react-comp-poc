import * as helpers from '../helpers';
import {
    singleCarHPBefore2020, singleCarHDBefore2020,
    singleCarHEBefore2020, singleCarYDBefore2020,
    singleCarAdditionalProductBefore2020, singleCarHPAfter2020,
    singleCarHDAfter2020, singleCarHEAfter2020,
    singleCarYDAfter2020, singleCarAdditionalProductAfter2020,
    HASTINGS_ESSENTIAL,
    HASTINGS_DIRECT,
    HASTINGS_PREMIER,
    YOU_DRIVE,
    ADDITIONAL_PRODUCT
} from '../../../constant/const';
import handlePolicyBookletDownloadFile from '../handlePolicyBookletDownloadFile';

const origin = window.location.origin ? window.location.origin : 'https://hastingsdirect.com';

describe('downloadPolicyBookletFile', () => {
    // given
    const dateBefore = {
        day: 1,
        month: 1,
        year: 2019
    };
    const dateAfter = {
        day: 1,
        month: 5,
        year: 2022
    };


    describe('handlePolicyBookletDownloadFile', () => {
        let dateCheckBeforeORAfterSpy;
        let downloadFileSpy;

        beforeEach(() => {
            dateCheckBeforeORAfterSpy = jest.spyOn(helpers, 'dateCheckBeforeORAfter');
            downloadFileSpy = jest.spyOn(helpers, 'downloadFile').mockImplementation(() => jest.fn());
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should call downloadFile for HD when date is before 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_DIRECT, dateBefore);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateBefore, HASTINGS_DIRECT);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHDBefore2020}`);
        });

        it('should call downloadFile for HE when date is before 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_ESSENTIAL, dateBefore);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateBefore, HASTINGS_ESSENTIAL);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHEBefore2020}`);
        });

        it('should call downloadFile for HE when date is before 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_PREMIER, dateBefore);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateBefore, HASTINGS_PREMIER);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHPBefore2020}`);
        });

        it('should call downloadFile for YD when date is before 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(YOU_DRIVE, dateBefore);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateBefore, YOU_DRIVE);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarYDBefore2020}`);
        });

        it('should call downloadFile for additional product when date is before 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(ADDITIONAL_PRODUCT, dateBefore);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateBefore, ADDITIONAL_PRODUCT);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarAdditionalProductBefore2020}`);
        });

        it('should call downloadFile for HD when date is after 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_DIRECT, dateAfter);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateAfter, HASTINGS_DIRECT);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHDAfter2020}`);
        });

        it('should call downloadFile for HE when date is after 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_ESSENTIAL, dateAfter);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateAfter, HASTINGS_ESSENTIAL);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHEAfter2020}`);
        });

        it('should call downloadFile for HE when date is after 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(HASTINGS_PREMIER, dateAfter);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateAfter, HASTINGS_PREMIER);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarHPAfter2020}`);
        });

        it('should call downloadFile for YD when date is after 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(YOU_DRIVE, dateAfter);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateAfter, YOU_DRIVE);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarYDAfter2020}`);
        });

        it('should call downloadFile for additional product when date is after 2020, 11, 9', () => {
            // when
            handlePolicyBookletDownloadFile(ADDITIONAL_PRODUCT, dateAfter);
            // then
            expect(dateCheckBeforeORAfterSpy).toHaveBeenCalledWith(dateAfter, ADDITIONAL_PRODUCT);
            expect(downloadFileSpy).toHaveBeenCalledWith(`${origin}${singleCarAdditionalProductAfter2020}`);
        });
    });
});
