const _ = require('lodash');
const expandTemplate = require('expand-template');

const DEFAULT_GW_BC_PORT = 8580;
const DEFAULT_GW_CC_PORT = 8080;
const DEFAULT_GW_AB_PORT = 8280;
const DEFAULT_GW_PC_PORT = 8180;

/**
 * Validates the server ID is amongst the accepted ones (bc, cc, ab, pc).
 * It throws ane error if the ID is not recognized
 *
 * @param {string} serverId
 * @throws an error in case the ID is not a valid Insurance Suite server ID
 */
function validateServerId(serverId) {
    if (_.isEmpty(serverId)) {
        throw new Error('serverId was not passed');
    }
    const validServers = ['bc', 'cc', 'ab', 'pc'];
    if (!_.includes(validServers, serverId.toLowerCase())) {
        throw new Error(`Invalid serverId was passed ${serverId}. Please provide one of ${validServers.join(', ')}`);
    }
}


/**
 * Retrieves the server port for the given server ID
 *
 * @param {string} serverId a valid server ID (bc, cc, ab, pc)
 * @returns {string} the server port to use to communicate with the server ID
 */
function getServerPort(serverId) {
    validateServerId(serverId);

    const serverPorts = {
        bc: process.env.GW_BC_PORT || DEFAULT_GW_BC_PORT,
        cc: process.env.GW_CC_PORT || DEFAULT_GW_CC_PORT,
        ab: process.env.GW_AB_PORT || DEFAULT_GW_AB_PORT,
        pc: process.env.GW_PC_PORT || DEFAULT_GW_PC_PORT
    };

    return serverPorts[serverId.toLowerCase()];
}

function replaceParamsInUrl(urlPattern, serverId) {
    const serverLowerCase = serverId.toLowerCase();
    const parser = expandTemplate({
        sep: '{{}}'
    });
    const serverUrlString = parser(urlPattern, {
        PORT: getServerPort(serverId),
        SUITE_APPLICATION: serverLowerCase
    });

    // ensures the serverUrl ends in /
    const sanitizedServerUrl = `${serverUrlString}/`.replace(/(\/){2,}$/, '/');

    return sanitizedServerUrl;
}

/**
 * Retrieves the buildtime host which responds to the given server ID (bc, cc, ab, pc)
 *
 * @param {string} serverId a valid server ID (bc, cc, ab, pc)
 * @returns {string} the buildtime host used to communicate with the given server ID
 */
function getBuildTimeHost(serverId) {
    validateServerId(serverId);
    const serverIdUpperCase = serverId.toUpperCase();

    const { GW_BUILD_TIME_HOST } = process.env;
    const serverBuildTimeHost = process.env[`GW_BUILD_TIME_HOST_${serverIdUpperCase}`];

    const host = serverBuildTimeHost || GW_BUILD_TIME_HOST;
    return replaceParamsInUrl(host, serverId);
}


/**
 * Retrieves the runtime host which responds to the given server ID (bc, cc, ab, pc)
 * Defaults to the corresponding buildtime host.
 *
 * @param {string} serverId a valid server ID (bc, cc, ab, pc)
 * @returns {string} the runtime host used to communicate with the given server ID
 */
function getRunTimeHost(serverId) {
    validateServerId(serverId);

    const serverIdUpperCase = serverId.toUpperCase();

    const { GW_RUN_TIME_HOST } = process.env;
    const serverRunTimeHost = process.env[`GW_RUN_TIME_HOST_${serverIdUpperCase}`];

    const host = serverRunTimeHost || GW_RUN_TIME_HOST;

    return host ? replaceParamsInUrl(host, serverId) : getBuildTimeHost(serverId);
}

/**
 * Retrieves the credentials to communicate with the given serverID
 * @param {string} serverId a valid server ID (bc, cc, ab, pc)
 * @returns {{username: string, password: string}} credentials
 *           used to communicate with the specified server
 */
function getBuildTimeHostCredentials(serverId) {
    validateServerId(serverId);
    const serverIdUpperCase = serverId.toUpperCase();

    const { GW_BUILD_TIME_HOST_USERNAME } = process.env;
    const serverUsername = process.env[`GW_BUILD_TIME_HOST_USERNAME_${serverIdUpperCase}`];
    const { GW_BUILD_TIME_HOST_PASSWORD } = process.env;
    const serverPassword = process.env[`GW_BUILD_TIME_HOST_PASSWORD_${serverIdUpperCase}`];

    return {
        username: serverUsername || GW_BUILD_TIME_HOST_USERNAME,
        password: serverPassword || GW_BUILD_TIME_HOST_PASSWORD
    };
}

/**
 * Returns the full service **build time** URL generated combining information
 * about the server ID and the servcice
 * @param {string} server a valid server ID (bc, cc, ab, pc)
 * @param {string} service the path to a specific service on the server
 * @returns {string} the full serviceURL
 */
function getBuildTimeServiceUrl(server, service) {
    const buildTimeHost = getBuildTimeHost(server);

    const serviceUrl = new URL(service, buildTimeHost);

    return serviceUrl.toString();
}

/**
 * Returns the full service **run time** URL generated combining information
 * about the server ID and the servcice
 * @param {string} server a valid server ID (bc, cc, ab, pc)
 * @param {string} service the path to a specific service on the server
 * @returns {string} the full serviceURL
 */
function getRunTimeServiceUrl(server, service) {
    const runTimeHost = getRunTimeHost(server);

    const serviceURL = new URL(service, runTimeHost);

    return serviceURL.toString();
}


module.exports = {
    getServerPort,
    getBuildTimeHostCredentials,
    getBuildTimeHost,
    getBuildTimeServiceUrl,
    getRunTimeHost,
    getRunTimeServiceUrl
};
