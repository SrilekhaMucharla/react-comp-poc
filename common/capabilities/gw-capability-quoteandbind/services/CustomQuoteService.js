import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class CustomQuoteService {
    /**
     * Selects a quote
     * @param {String} quoteID the quote ID
     * @param {String} branchName the name of the selected quote
     * @param {String} sessionUUID the session UUID associated to the quoteID
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static setSelectedVersionOnSubmission(
        quoteID,
        branchName,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl('customquote'),
            'setSelectedVersionOnSubmission',
            [quoteID, branchName, sessionUUID],
            additionalHeaders
        );
    }

    /**
     * Updates a custom quote
     * @param {Object} customQuoteDTO CustomQuoteDataDTO
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static updateCustomQuote(customQuoteDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('customquote'),
            'updateCustomQuote',
            [customQuoteDTO],
            additionalHeaders
        );
    }

    /**
     * Updates a custom quote coverage
     * @param {Object} customQuoteDTO CustomQuoteDataDTO
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static updateCustomQuoteCoverages(customQuoteDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('customquote'),
            'updateCustomQuoteCoverages',
            [customQuoteDTO],
            additionalHeaders
        );
    }

    /**
     * Force Updates a custom quote coverage
     * @param {Object} customQuoteDTO CustomQuoteDataDTO
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static forceUpdateCustomQuoteCoverages(customQuoteDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('customquote'),
            'forceUpdateCustomQuoteCoverages',
            [customQuoteDTO],
            additionalHeaders
        );
    }
}
