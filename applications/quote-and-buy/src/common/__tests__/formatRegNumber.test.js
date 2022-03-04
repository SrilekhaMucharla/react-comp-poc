import formatRegNumber from '../formatRegNumber';

describe('formatRegNumber', () => {
    it('should format reg number', () => {
        // given
        const regNumber = 'AV12BGE';
        // when
        const formattedRegNumber = formatRegNumber(regNumber);
        // then
        expect(formattedRegNumber).toBe('AV12 BGE');
    });

    it('should return unformatted reg number', () => {
        // given
        const regNumber = 'sample text';
        // when
        const formattedRegNumber = formatRegNumber(regNumber);
        // then
        expect(formattedRegNumber).toBe(regNumber);
    });
});
