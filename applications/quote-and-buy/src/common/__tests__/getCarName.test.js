import getCarName from '../getCarName';

describe('getCarName', () => {
    it('should format car make and model', () => {
        // given
        const make = 'MERCEDES-BENZ';
        const model = 'E250 SPORT ED125 CDI BLUE';
        // when
        const formattedMakeAndModel = getCarName(make, model);
        // then
        expect(formattedMakeAndModel).toBe('MERCEDES-BENZ E250 SPORT');
    });
});
