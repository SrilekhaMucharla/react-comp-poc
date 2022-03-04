const url = require('url');
const _ = require('lodash');
const paths = require('gw-build-config-paths');

const { servers } = require(paths.appGeneratedConfig);


/*
 * Setup some environment variables for the proxy
 * E.g. GW_BC_HOST, GW_AB_HOST, etc...
 */

/** known GW servers */
const GW_SERVERS = ['ab', 'bc', 'cc', 'pc'];

/**
 * Returns whether a certain server name is a known gw server;
 * @param {string} serverName the name of the server
 * @returns {boolean}
 */
function isGWServer(serverName) {
    return _.includes(GW_SERVERS, serverName.toLowerCase());
}

/**
 * Removes the path referring to Edge from a given URL
 * @param {string} aUrl the url to change
 * @returns {string} a url string that does not contain any more reference to the edge layer
 */
function getGWServerUrl(aUrl) {
    return aUrl.replace(/\/service(\/unauthenticated)?\/edge\/?/, '');
}

/**
 *
 * @param {[String, Object]} arg an array which first argument is the sever name
 * and the second is the server configuration
 * @returns {Object<String, String>} an Object which keys are the name of the
 *      generated HOST,HOSTNAME,DOMAIN,PATH env Variable and the keys are the
 *      url,hostname,domain,path to the server
 */
function toServerEnv([serverName, serverParams]) {
    const isInternalServer = isGWServer(serverName);
    const prefix = isInternalServer ? 'GW_' : '';
    const fullServerName = `${prefix}${serverName.toUpperCase()}`;
    const { url: aUrl } = serverParams;
    const serverUrl = isInternalServer ? getGWServerUrl(aUrl) : aUrl;
    const {
        host: serverDomain,
        hostname: serverHostname,
        pathname: serverPath,
        protocol
    } = url.parse(serverUrl);
    const baseName = `${protocol}//${serverDomain}`;

    return {
        [`${fullServerName}_HOST`]: serverUrl,
        [`${fullServerName}_HOSTNAME`]: serverHostname,
        [`${fullServerName}_DOMAIN`]: serverDomain,
        [`${fullServerName}_PATH`]: serverPath,
        [`${fullServerName}_BASE`]: baseName,
    };
}

/**
 * Returns the GW_DEPLOYMENT_HOST entry
 * @returns {Object}
 */
function getDeploymentHostVariables() {
    const {
        host: domain,
        hostname,
        pathname,
    } = url.parse(process.env.GW_RUN_TIME_DEPLOYMENT_URL);
    return {
        GW_RUN_TIME_DEPLOYMENT_DOMAIN: domain,
        GW_RUN_TIME_DEPLOYMENT_HOSTNAME: hostname,
        GW_RUN_TIME_DEPLOYMENT_PATH: pathname,
    };
}

/**
 * Returns a object which keys are the environment variables and the values
 * are the corresponding env values
 * @returns {Object}
 */
function getEnvVariables() {
    const serverOverrides = _(Object.entries(servers))
        .map(toServerEnv)
        .reduce(_.merge);

    const deploymentHostVariables = getDeploymentHostVariables();
    const overrides = { ...serverOverrides, ...deploymentHostVariables };
    return overrides;
}

/**
 * Prints a warning in case the keys of the `overrides` are already defined
 * in the environment
 * @param {Object} overrides
 */
function warnEnvConflicts(overrides) {
    Object.keys(overrides)
        .filter((envVar) => _.has(process.env, envVar))
        .forEach((duplicatedEnv) => {
            // eslint-disable-next-line no-console
            console.warn(`WARNING: ${duplicatedEnv} is already defined in the environment and will be overridden`);
        });
}

/**
 * Assigns the overrides to the existing environment
 * @param {Object} overrides an object which keys are the env variable names and the
 *                  values are the corresponding variable names;
 */
function assignEnv(overrides) {
    Object.entries(overrides)
        .forEach(([envVar, value]) => {
            process.env[envVar] = value;
        });
}

const overrides = getEnvVariables();
warnEnvConflicts(overrides);
assignEnv(overrides);
