import youngInexperiencedDriverExcess from '../getYoungAndInexperiencedExcess';

describe('youngInexperiencedDriverExcess', () => {
    it('should return young In experienced Driver Excess', () => {
        // given
        const driver = [{
            isPolicyHolder: true,
            youngInexperiencedDriverExcess: {
                amount: 200
            }
        }];
        const excessValue = 200;
        // when
        const youngInexperiencedDriverExcessValue = youngInexperiencedDriverExcess(driver);
        // then
        expect(youngInexperiencedDriverExcessValue).toBe(excessValue);
    });
});
