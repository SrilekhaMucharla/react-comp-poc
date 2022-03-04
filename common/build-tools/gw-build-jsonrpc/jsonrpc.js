process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('gw-build-config-environment');


const _ = require('lodash');
const {
    getBuildTimeHostCredentials,
    getBuildTimeServiceUrl
} = require('gw-build-config-urls');

const fetch = require('node-fetch');

/**
 * Sends a JsonRpc call to the given endpoint
 *
 * @param {Object} endpoint the endpoint which metadata should be fetched
 * @param {string} endpoint.server the endpoint which metadata should be fetched
 * @param {string} endpoint.service the endpoint which metadata should be fetched
 * @param {string} method the method name to invoke on the method
 * @param {Object[]} [params] the params for the request
 * @param {Object} [customization]
 * @param {Object} [customization.credentials]
 * @param {Object} [customization.credentials.username] username
 *                  used to send the request (overrinding the endpoint defaults)
 * @param {Object} [customization.credentials.password] password
 *                  used to send the request (overrinding the endpoint defaults)
 * @param {Object} [customization.id] the request id
 * @returns {Object} the metadata retrieved from the given endpoint
 */
function sendJsonRpcRequest(endpoint, method, params = [], { credentials = {}, id = '1' } = {}) {
    const { server, service } = endpoint;

    if (_.isEmpty(server)) {
        throw new Error('server for endpoint is not defined');
    }
    if (_.isEmpty(service)) {
        throw new Error('service for endpoint is not defined');
    }
    const { username, password } = _.isEmpty(credentials)
        ? getBuildTimeHostCredentials(server) : credentials;
    const serviceUrl = getBuildTimeServiceUrl(server, service);


    const authorizationToken = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
        'Content-Type': 'application/json',
        usertoken: 'any',
        Authorization: `Basic ${authorizationToken}`
    };

    const body = {
        id: id,
        jsonrpc: '2.0',
        method: method,
        params: params
    };

    return fetch(serviceUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`${serviceUrl} - ${resp.statusText}`);
            }
            return resp;
        })
        .then((resp) => resp.json())
        .then((resp) => resp.result);
}

module.exports = {
    sendJsonRpcRequest
};
