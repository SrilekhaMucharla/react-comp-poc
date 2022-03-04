import { getAncillaryCoverages, getVehicleCoverages } from '../mapper';

describe('mapper', () => {
    it('getAncillaryCoverages', () => {
        // given
        const ancillaryCoverages = [{
            name: 'name 1',
            required: false,
            selected: false,
            amount: 'amount 1',
            otherProp: 'should not be mapped'
        },
        {
            name: 'name 2',
            required: true,
            selected: true,
            amount: 'amount 2',
            otherProp: 'should not be mapped'
        }];
        // when
        const mappedAncillaries = getAncillaryCoverages(ancillaryCoverages);
        // then
        expect(mappedAncillaries).toHaveLength(ancillaryCoverages.length);
        mappedAncillaries.forEach((ancillary) => {
            expect(ancillary.name).toBeDefined();
            expect(typeof ancillary.name).toBe('string');
            expect(ancillary.required).toBeDefined();
            expect(typeof ancillary.required).toBe('boolean');
            expect(ancillary.selected).toBeDefined();
            expect(typeof ancillary.selected).toBe('boolean');
            expect(ancillary.amount).toBeDefined();
            expect(ancillary.otherProp).toBeUndefined();
        });
    });
    it('getVehicleCoverages', () => {
        // given
        const vehicleCoverages = [{
            name: 'name 1',
            publicID: '123',
            terms: ['term 1', 'term 2'],
            otherProp: 'should not be mapped'
        },
        {
            name: 'name 2',
            publicID: '124',
            terms: ['term 3', 'term 4'],
            otherProp: 'should not be mapped'
        }];
        // when
        const mappedCoverages = getVehicleCoverages(vehicleCoverages);
        // then
        expect(mappedCoverages).toHaveLength(vehicleCoverages.length);
        mappedCoverages.forEach((coverage) => {
            expect(coverage.name).toBeDefined();
            expect(typeof coverage.name).toBe('string');
            expect(coverage.publicID).toBeDefined();
            expect(typeof coverage.publicID).toBe('string');
            expect(coverage.terms).toBeDefined();
            expect(Array.isArray(coverage.terms)).toBeTruthy();
            expect(coverage.otherProp).toBeUndefined();
        });
    });
});
