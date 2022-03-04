import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class CustomQuoteService {
    /**
     * Selects a quote
     * @param {Object} submissionDTO QuoteDataDTO
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static createSubmission(submissionDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('slquote'),
            'createBaseOffering',
            [submissionDTO],
            additionalHeaders
        );
    }
}
