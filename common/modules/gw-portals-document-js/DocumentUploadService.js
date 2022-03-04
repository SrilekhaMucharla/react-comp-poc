import _ from 'lodash';
import { TransportService } from 'gw-portals-transport-js';

const defaultDocumentMetaDataTemplate = {
    docUID: '001',
    documentType: 'letter_received',
    securityType: 'unrestricted',
    status: 'approved'
};

export default class DocumentUploadService {
    /**
     * Sends the request to the given endpoint.
     * @param {string} serviceEndpoint - The service endpoint
     * @param {File} file - The file to send to the server
     * @param {Object} metadataTemplate - Document metadata template for document upload
     * @param {Object} [additionalHeaders] - Additional headers to pass to the backend
     * @returns {Promise} - The promise from the remote call
     */
    static send(serviceEndpoint, file, metadataTemplate, additionalHeaders = {}) {
        const documentMetadataTemplate = _.merge(
            {}, defaultDocumentMetaDataTemplate, metadataTemplate
        );
        const data = new FormData();

        data.append('document', JSON.stringify(documentMetadataTemplate));
        data.append('file[]', file);

        return TransportService.send(serviceEndpoint, data, additionalHeaders)
            .then((response) => {
                return response;
            }).catch((error) => {
                if (TransportService.isSessionExpiredReason(error)
                    || TransportService.isUserUnauthenticatedReason(error)) {
                    /* refresh the page to get to login page
                     * Set reload to true. Some "authentication solutions" does not set proper
                     * caching headers.
                     */
                    window.location.reload(true);
                }
                throw error;
            });
    }
}
