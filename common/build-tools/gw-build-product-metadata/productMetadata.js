const _ = require('lodash');
const { readJson } = require('fs-extra');
const appPaths = require('gw-build-config-paths');
const { sendJsonRpcRequest } = require('gw-build-jsonrpc');
const fileUtils = require('./util/fileUtils');
const metadataLocalisation = require('./metadataLocalisation');

function toMetadataMap(serverMetadataResult) {
    const metadataByName = _.groupBy(serverMetadataResult, 'name');
    return _.mapValues(metadataByName, (typeMetas) => {
        const allMetadataForName = _.map(typeMetas, 'metadata');
        return _.merge({}, ...allMetadataForName);
    });
}

/**
 * Fetches the metadata for the given endpoint
 *
 * @param {ApplicationEndpoint} endpoint the endpoint which metadata should be fetched
 * @returns {Promise<Object>} the metadata retrieved from the given endpoint
 */
function fetchMetadataForEndpoint(endpoint) {
    return sendJsonRpcRequest(endpoint, 'getMetaData')
        .then((metadata) => ({
            endpoint,
            metadata
        }));
}

/**
 * @typedef { import("gw-build-capabilities-management").ApplicationEndpoint } ApplicationEndpoint
 */

/**
 * @typedef PreprocessMetadata
 * @property {{server: string, service: string}} endpoint the server nickname (e.g. pc, cc, ...)
 * @property {object} metadata the metadata from the server
 */

/**
 * Structures the product metadata
 *
 * @param {PreprocessMetadata} data containing the endpoint from which
 * the metadata came from and the metadata from the server
 * @returns {Object} the metadata retrieved from the given endpoint
 */
function preprocessDtoMetadata({ endpoint, metadata }) {
    return {
        [endpoint.server]: toMetadataMap(metadata.newTypeMeta)
    };
}

/**
 * Structures the question set metadata
 *
 * @param {PreprocessMetadata} data containing the endpoint from which
 * the metadata came from and the metadata from the server
 * @returns {Object} the metadata from the server
 */
function preprocessQuestionSetsMetadata({ metadata }) {
    return metadata.questionSets;
}

/**
 * Combines all the metadatas from all the endpoints into one object
 *
 * @param {Array<Object>} allMetadataResponses containing the metadata from the server
 * @returns {Object} the metadata to save
 */
function mergeMetadata(allMetadataResponses) {
    return allMetadataResponses.reduce((generatedMetadata, serviceMetadata) => {
        return _.merge(generatedMetadata, serviceMetadata);
    }, {});
}

/**
 * Pipeline to format, combine and save the metadata
 *
 * @param {Promise<Object>} metadataPromises response from the server
 * @param {function} preprocessingFunction function to format the metadata from the server
 * @param {string} destinationFile path to save the metadata
 * @returns {Object} the metadata to save
 */
function metadataPipeline(metadataPromises, preprocessingFunction, destinationFile) {
    return metadataPromises
        .then((metadataFromEndpoints) => metadataFromEndpoints.map(preprocessingFunction))
        .then(mergeMetadata)
        .then((allMetadata) => fileUtils.writeFile(allMetadata, destinationFile));
}

/**
 * Process the product metadata
 *
 * @param {Promise<Object>} metadataPromises response from the server
 * @returns {Promise} the metadata to save
 */
function processDTOMetadata(metadataPromises) {
    return metadataPipeline(metadataPromises, preprocessDtoMetadata, appPaths.appProductMetadata);
}

/**
 * Process the question sets metadata
 *
 * @param {Promise<Object>} metadataPromises response from the server
 * @returns {Promise} the metadata to save
 */
function processQuestionSetsMetadata(metadataPromises) {
    return metadataPipeline(metadataPromises, preprocessQuestionSetsMetadata,
        appPaths.appQuestionSetsMetadata);
}

async function buildMetadata() {
    const { capabilities } = await readJson(appPaths.appGeneratedConfig);
    const endpoints = Object.values(capabilities);
    const endpointsWithMetadata = endpoints.filter((endpoint) => !endpoint.skipMetadata);
    const metadataPromises = Promise.all(endpointsWithMetadata.map(fetchMetadataForEndpoint));
    await Promise.all([
        processDTOMetadata(metadataPromises),
        processQuestionSetsMetadata(metadataPromises)
    ]);
    const localeConfig = await metadataLocalisation.fetchLocaleInfo();
    metadataLocalisation.processMetadataDisplayKeys(localeConfig, endpoints);
}

module.exports = {
    buildMetadata
};
