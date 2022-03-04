import generateGuid from 'uuid/v4';
import TransportService from './TransportService';

let currentRequestIdCounter = 0;

const uuidForAllJsonRPCRequestsOfThisAppLoad = generateGuid();

const headers = {
    'Content-Type': 'application/json; charset=utf-8'
};

export default class JsonRPCService {
    /**
     * Sends the JSON-RPC request to the given endpoint.
     * @param {string} serviceEndpoint - The service endpoint
     * @param {string} method - The RPC method to invoke
     * @param {Array} params - The parameters to invoke the service with
     * @param {Object} [additionalHeaders] - Additional headers to pass to the backend
     * @returns {Promise} - The promise from the remote call
     */
    static send(serviceEndpoint, method, params, additionalHeaders = {}) {
        currentRequestIdCounter += 1;

        const jsonRPCid = `${uuidForAllJsonRPCRequestsOfThisAppLoad}_${currentRequestIdCounter}`;

        const body = JSON.stringify({
            id: `${jsonRPCid}`,
            jsonrpc: '2.0',
            method,
            params
        });

        return (
            TransportService.send(serviceEndpoint, body, { ...headers, ...additionalHeaders })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    if (TransportService.isSessionExpiredReason(error)
                        || TransportService.isUserUnauthenticatedReason(error)) {
                        /* refresh the page to get to login page
                         * Set reload to true. Some "authentication solutions" does not set proper
                         * caching headers.
                         */
                        window.location.reload(true);
                    }
                    // eslint-disable-next-line no-param-reassign
                    error.gwInfo = {
                        serviceEndPoint: serviceEndpoint,
                        method: method,
                        params: params,
                    };
                    throw error;
                })
        );
    }
}
