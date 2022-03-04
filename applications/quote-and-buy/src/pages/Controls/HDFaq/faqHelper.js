import Faq from '../../../customer/directintegrations/faq/faq';

const MAX_NUMBER_OF_DOCUMENTS = 50;
const NUMBER_OF_TOP_DOCUMENTS = 5;

const mapDocuments = (faq, documents) => (Promise.all(documents.map(async ({ documentId }) => {
    const docData = await faq.getDocumentData(documentId);
    const docContent = await faq.getDocumentContent(documentId);

    return {
        header: docData.name,
        content: docContent.content
    };
})));

export const searchByTerm = async (epticaId, searchTerm) => {
    const faq = new Faq();
    const documents = await faq.searchDocuments(epticaId, searchTerm, 0, MAX_NUMBER_OF_DOCUMENTS);
    return mapDocuments(faq, documents);
};

export const getTopDocuments = async (epticaId) => {
    const faq = new Faq();
    const documents = await faq.getBestRankedDocuments(epticaId, 0, NUMBER_OF_TOP_DOCUMENTS);
    return mapDocuments(faq, documents);
};
