import fetchPromotionalSavings from '../fetchPromotionalSavings';
import * as helpers from '../downloadFile/helpers';

describe('fetchPromotionalSavings', () => {
    describe('fetchPromotionalSavings', () => {
        let fetchSavingsPromotionalSpy;
        beforeEach(() => {
            fetchSavingsPromotionalSpy = jest.spyOn(helpers, 'fetchSavingsPromotional');
        });
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should check the required data', () => {
            // when
            fetchPromotionalSavings();
            // then
            expect(fetchSavingsPromotionalSpy).toHaveBeenCalled();
        });
    });
});
