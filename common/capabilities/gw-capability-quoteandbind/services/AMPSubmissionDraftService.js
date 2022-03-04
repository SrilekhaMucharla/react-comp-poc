import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class AMPSubmissionDraftService {
    /**
     * Creates a submission for an account
     * @param {Object} submissionDTO QuoteDataDTO
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} a promise from the backend call with no result (if successful)
     */
    static createForAccount(submissionDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('quote'),
            'createForAccount',
            [submissionDTO],
            additionalHeaders
        );
    }
}
