import _ from 'lodash';
import traverse from 'traverse';
import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

function generateTempID(data) {
    const tempIDPaths = traverse(data).paths()
        .filter((pathArray) => _.last(pathArray) === 'tempId')
        .map((pathArray) => pathArray.join('.'));

    return tempIDPaths.reduce((acc, path) => {
        acc[path] = _.get(data, path);
        return acc;
    }, {});
}

function setTempIDs(tempIDMap, data) {
    Object.entries(tempIDMap).forEach(([tempIDPath, tempIDValue]) => {
        _.set(data, tempIDPath, tempIDValue);
    });
}

/**
 * Invokes the given method on the backend endpoint passing the given data as parameters
 *
 * @param {any} method the method to invoke on the backend endpoint
 * @param {any} data the data to be passed as part of the invokation on the backend
 * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
 * @returns {Promise} the promise from the backend call
 */
function processSubmission(method, data, additionalHeaders = {}) {
    return JsonRPCService.send(getProxiedServiceUrl('quote'), method, data, additionalHeaders);
}

/**
 * This is the server responsible for dealing with the Quote and Buy backend operations
 *
 * @export
 * @class LoadSaveService
 */
export default class LoadSaveService {
    /**
     * Creates new submission job and generates a session to be used during the submission process.
     *
     * @param {Object} data the submission
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise}
     * @memberof LoadSaveService
     */
    static createSubmission(data, additionalHeaders = {}) {
        return processSubmission('create', [data], additionalHeaders);
    }

    /**
     * Updates, saves and performs a quote on an existing submission.
     * Generates quotes for all available product offerings.
     *
     * @param {Object} data tge submission that will be saved
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static saveAndQuoteSubmission(data, additionalHeaders = {}) {
        return processSubmission('saveAndQuote', [data], additionalHeaders);
    }

    /**
     * Updates an existing draft submission.
     *
     * @param {Object} data the submission to be saved as draft
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static updateDraftSubmission(data, additionalHeaders = {}) {
        const tempIDs = generateTempID(data);
        return processSubmission('updateDraftSubmission', [data], additionalHeaders).then((result) => {
            setTempIDs(tempIDs, result);
            return result;
        });
    }

    /**
     * Updates a quoted submission.
     *
     * @param {Object} data the submission to be saved as draft
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static updateQuotedSubmission(data, additionalHeaders = {}) {
        return processSubmission('updateQuotedSubmission', [data], additionalHeaders);
    }

    /**
     * Updates a quoted submission with LOB Data.
     *
     * @param {Object} data the submission to be saved as draft
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static updateQuotedSubmissionWithLOBData(data, additionalHeaders = {}) {
        return processSubmission('updateQuotedSubmissionWithLOBData', [data], additionalHeaders);
    }

    /**
     * Retrieves the payment plans for the current submission.
     *
     * @param {string} quoteID quoteID of submission that needs to be found
     * @param {string} sessionUUID current session id
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static retrievePaymentPlans(quoteID, sessionUUID, additionalHeaders = {}) {
        return processSubmission(
            'retrievePaymentPlans',
            [quoteID, sessionUUID],
            additionalHeaders
        );
    }

    /**
     * Updates an existing draft submission and account primary location.
     * @param {Object} submission the submission
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static updateDraftSubmissionAndPrimaryLocation(submission, additionalHeaders = {}) {
        const tempIDs = generateTempID(submission);
        return processSubmission(
            'updateDraftSubmissionAndPrimaryLocation',
            [submission],
            additionalHeaders
        ).then((result) => {
            setTempIDs(tempIDs, result);
            return result;
        });
    }

    static updateCoverages(quoteID, sessionUUID, lobCoverages, additionalHeaders = {}) {
        return processSubmission(
            'updateCoverages',
            [quoteID, sessionUUID, lobCoverages],
            additionalHeaders
        );
    }

    static setQuoteToDraft(quoteID, sessionUUID, additionalHeaders = {}) {
        return processSubmission(
            'setQuoteToDraft',
            [quoteID, sessionUUID],
            additionalHeaders
        );
    }

    /**
     * Binds the submission.
     *
     * @param {Object} data the submission to be bound
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static bindSubmission(data, additionalHeaders = {}) {
        return processSubmission('bind', [data], additionalHeaders);
    }

    /**
     * Retrieves a submission.
     *
     * @param {Object} data the retrieval payload (QuoteRetrievalDTO)
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof LoadSaveService
     */
    static retrieveSubmission(data, additionalHeaders = {}) {
        return processSubmission('retrieve', [data], additionalHeaders);
    }

    /**
     * Get the address from postalcode.
     *
     * @param {Number} submission the submission
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise}
     * @memberof LoadSaveService
     */
    static createBaseOffering(submission, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('slquote'),
            'createBaseOffering',
            [submission],
            additionalHeaders
        );
    }

    /**
     * Get Email of Quote with its number.
     *
     * @param {Number} submission the submission
     * @param {Object} [additionalHeaders] additional headers to pass to the backend (e.g. auth)
     * @returns {Promise}
     * @memberof LoadSaveService
     */
    static getEmailQuote(submission, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('quote'),
            'emailQuote',
            [submission],
            additionalHeaders
        );
    }
}
