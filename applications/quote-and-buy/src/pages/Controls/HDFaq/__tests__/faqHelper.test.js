import Faq from '../../../../customer/directintegrations/faq/faq';
import { searchByTerm, getTopDocuments } from '../faqHelper';

jest.mock('../../../../customer/directintegrations/faq/faq');

const EPTICA_ID = 855;
const HEADER = 'What is a home address?';
const CONTENT = 'The home address is a place where you live.';

describe('faqHelper', () => {
    const mockDocuments = [{ documentId: 1 }, { documentId: 2 }, { documentId: 3 }];

    beforeEach(() => {
        Faq.mockImplementation(() => ({
            searchDocuments: () => Promise.resolve(mockDocuments),
            getBestRankedDocuments: () => Promise.resolve(mockDocuments),
            getDocumentData: () => Promise.resolve({ name: HEADER }),
            getDocumentContent: () => Promise.resolve({ content: CONTENT })
        }));
    });

    it('searchByTerm', async () => {
        const resp = await searchByTerm(EPTICA_ID, 'payment');
        expect(resp.length).toBe(3);
        const { header, content } = resp[0];
        expect(header).toBe(HEADER);
        expect(content).toBe(CONTENT);
    });

    it('getTopDocuments', async () => {
        const resp = await getTopDocuments(EPTICA_ID);
        expect(resp.length).toBe(3);
        const { header, content } = resp[0];
        expect(header).toBe(HEADER);
        expect(content).toBe(CONTENT);
    });
});
