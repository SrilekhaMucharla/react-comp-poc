import Faq from '../faq';

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ }),
}));

// TODO this test is wrong, returns many `UnhandledPromiseRejectionWarning`
describe.skip('FAQ integration', () => {
    const groupId = 506;
    const documentId = 706;

    beforeEach(() => {
        fetch.mockClear();
    });

    it('Search for group', () => {
        const faq = new Faq();
        faq.getGroupData(groupId);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Search for sub groups', () => {
        const faq = new Faq();
        faq.getSubGroupIds(groupId);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Search for documents in group', () => {
        new Faq().getDocumentIds(groupId, 0, 10);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Search for best ranked documents in group', () => {
        new Faq().getBestRankedDocuments(groupId, 0, 5);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Search for most seen documents in group', () => {
        new Faq().getMostSeenDocuments(groupId, 0, 5);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Return document data', () => {
        new Faq().getDocumentData(documentId);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Return document content', () => {
        new Faq().getDocumentContent(documentId);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Return document creator', () => {
        new Faq().getDocumentCreator(documentId);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('Search top 5 questions about policy', () => {
        new Faq().searchDocuments(groupId, 'policy', 0, 5);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
