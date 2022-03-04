function Faq() {
    const domainUrl = 'https://hastingsinsuranceuk.epticahosting.com/selfhastingsinsuranceuk/api/configuration/default/';

    const sendRequest = async (url) => {
        const request = await fetch(domainUrl + url, {
            method: 'GET',
            headers: { 'X-Eptica-AccessToken': 'gQeYFMaRoV0DNAxNHGu3' },
            cache: 'no-cache'
        }).catch((error) => `{error: ${error.message}`);
        // eslint-disable-next-line no-return-await
        return await request.json();
    };

    this.getGroupData = async (groupId) => {
        const requestUrl = `documentGroup/${groupId}`;
        const resp = await sendRequest(requestUrl);
        return {
            name: resp.names[0].name,
            reachableDocumentsCount: resp.reachableDocumentsCount
        };
    };

    this.getSubGroupIds = async (groupId) => {
        const requestUrl = `documentGroup/${groupId}/subGroups`;
        const resp = await sendRequest(requestUrl);
        return resp.elements.map((el) => el.id);
    };

    this.getDocumentIds = async (groupId, offset, pageSize) => {
        const searchParams = new URLSearchParams({
            offset,
            pageSize
        });
        const requestUrl = `documentGroup/${groupId}/documents?${searchParams}`;
        const resp = await sendRequest(requestUrl);
        return resp.elements.map((el) => el.id);
    };

    this.getBestRankedDocuments = async (groupId, offset, pageSize) => {
        const searchParams = new URLSearchParams({
            offset,
            pageSize
        });
        const requestUrl = `documentGroup/${groupId}/bestRankedDocuments?${searchParams}`;
        const resp = await sendRequest(requestUrl);
        return resp.elements.map((el) => ({
            documentId: el.document.id,
            rank: el.ranks[0].rank,
            count: el.ranks[0].count
        }));
    };

    this.getMostSeenDocuments = async (groupId, offset, pageSize) => {
        const searchParams = new URLSearchParams({
            offset,
            pageSize
        });
        const requestUrl = `documentGroup/${groupId}/mostSeenDocuments?${searchParams}`;
        const resp = await sendRequest(requestUrl);
        return resp.elements.map((el) => ({
            documentId: el.document.id,
            hits: el.hits.hits
        }));
    };

    this.getDocumentData = async (documentId) => {
        const requestUrl = `document/${documentId}`;
        const resp = await sendRequest(requestUrl);
        return {
            name: resp.names[0].name,
            creationDate: resp.creationDate,
            lastModificationDate: resp.lastModificationDate,
            publicationStatus: resp.publicationStatus
        };
    };

    this.getDocumentContent = async (documentId) => {
        const requestUrl = `document/${documentId}/content`;
        const resp = await sendRequest(requestUrl);
        return resp.contents[0];
    };

    this.getDocumentCreator = async (documentId) => {
        const requestUrl = `document/${documentId}/creator`;
        const resp = await sendRequest(requestUrl);
        return {
            fields: resp.fields
        };
    };

    this.searchDocuments = async (groupId, query, offset, pageSize) => {
        const searchParams = new URLSearchParams({
            query,
            offset,
            pageSize
        });
        const requestUrl = `documentGroup/${groupId}/search?${searchParams}`;
        const resp = await sendRequest(requestUrl);
        return resp.elements.map((el) => ({
            documentId: el.document.id,
            relevance: el.relevance,
            matchingLocations: el.matchingLocations
        }));
    };
}

export default Faq;
