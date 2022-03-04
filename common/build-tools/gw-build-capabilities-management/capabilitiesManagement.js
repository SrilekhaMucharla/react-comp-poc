const path = require('path');
require('json5/lib/register');
const _ = require('lodash');
const { readJson } = require('fs-extra');

const appPaths = require('gw-build-config-paths');
const { listDependencies } = require('gw-build-dependency-analysis');


/**
 * Retrieves the path to the ServiceEndpoints.json for the given capability
 *
 * @param {string} capabilityPackage the path to the package.json for the capability
 * @returns {Promise<string>} returns the endpoints file path
 */
async function findServiceEndpointsFile(capabilityPackage) {
    const rootDir = path.dirname(capabilityPackage);
    return path.join(rootDir, 'config', 'ServiceEndpoints.json');
}


/**
* @typedef ApplicationEndpoint
* @property {string} server the server nickname (e.g. pc, cc, ...)
* @property {string} serviceName the name of this service, used for lookup
* @property {boolean} [skipMetadata]  the endpoint does not need metadata
                                    to be retrieved (i.e. raw post request)
* @property {string} service the path to the service being used (e.g. "quote/quote" )
*/

/**
* Returns an array of endpoints used by the application
*
* @returns {Promise<ApplicationEndpoint[]>}
*/
async function getApplicationEndpoints() {
    const isGwCapability = (dep) => /^gw-capability-(?:(?!-react).)+$/.test(dep);
    const isHastingsCapability = (dep) => /^hastings-capability-(?:(?!-react).)+$/.test(dep);

    const { appPackageJson, appCustomerConfig } = appPaths;
    const packageInfoPath = require.resolve(appPackageJson);

    // load the actual package.json file
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const packageInfo = await readJson(packageInfoPath);
    const { capabilitiesConfig } = require(appCustomerConfig);
    const dependencies = await listDependencies({
        rootPackage: packageInfo,
        onlyGwDependencies: true,
        capabilitiesSpecification: capabilitiesConfig
    });

    const resolvedDependencies = dependencies.visited;

    const serviceEndpointFiles = await Promise.all(
        resolvedDependencies
            .filter(({ name }) => isGwCapability(name) || isHastingsCapability(name))
            .map(({ foundAt }) => findServiceEndpointsFile(foundAt))
    );

    const endpointLists = await Promise.all(
        serviceEndpointFiles.map((serviceEndpointFile) => readJson(serviceEndpointFile))
    );
    return _.flatten(endpointLists);
}

module.exports = {
    getApplicationEndpoints
};
