const Module = require('module');
const path = require('path');
const fs = require('fs-extra');
const glob = require('fast-glob');
const normalizePath = require('normalize-path');

const _ = require('lodash');

const appPaths = require('gw-build-config-paths');
const {
    isValidTransaction,
    getNormalizedTransactionName,
    isCapabilityEnabled
} = require('gw-portals-config-js');

const GW_DEPENDENCY_IDENTIFIER = /^gw-.*/;
const HASTINGS_DEPENDENCY_IDENTIFIER = /^hastings-.*/;


/**
 * @typedef {Object} PackageDescription
 * @property {Object<String,String>} [dependencies]
 * @property {Object<String,String>} [devDependencies]
 */

/**
 * @typedef {Object|Array<String>} CapabilitiesLOB

/**
 * An object which keys represent the capabilities names
 * (e.g. quote, endorsement, ...)
 * and which values contain an Array or an Object specifying the LOBs of the given capabilities
 * @typedef {Object<String,CapabilitiesLOB>} AllowedCapabilitiesSpecification
 */

/**
 * @typedef {Object} DependencyDescriptor
 * @property {String} name
 * @property {String} version
 * @property {String} requiredAt
 * @property {String} [foundAt]
 */

class DependencyError extends Error {
    constructor(dependency, ...params) {
        super(...params);
        this.dependency = dependency;
        this.name = 'DependencyError';

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DependencyError);
        }
    }
}

function isGwDependency(depName) {
    return GW_DEPENDENCY_IDENTIFIER.test(depName);
}

function isHastingsDependency(depName) {
    return HASTINGS_DEPENDENCY_IDENTIFIER.test(depName);
}

/**
 * Lists the dependencies from a package
 * @param {PackageDescription} packageInfo the package information
 * @param {String} packageLocation where the package is located
 * @param {boolean} onlyGwDependencies whether only the GW dependencies should be listed or not
 * @returns {DependencyDescriptor[]} the list of dependencies for a package
 */
function parseDependencies(packageInfo, packageLocation, onlyGwDependencies) {
    const { devDependencies = {}, dependencies = {}, peerDependencies = {} } = packageInfo;
    return Object.entries(devDependencies)
        .concat(Object.entries(dependencies))
        .concat(Object.entries(peerDependencies))
        .filter(([name]) => {
            if (!onlyGwDependencies) {
                return true;
            }
            return (isGwDependency(name) || isHastingsDependency(name));
        })
        .map(([name, version]) => ({
            name,
            version: version.startsWith('file:') ? '' : version,
            requiredAt: packageLocation
        }));
}

/**
 * Reads the dependencies of a package.json file
 * @param {String} pathToPackageJson the path to the package.json
 * @param {boolean} onlyGwDependencies whether only GW dependencies should be returned or not
 * @returns {Promise<DependencyDescriptor[]>} the dependencies for the package.json
 */
async function parseDependenciesForPackage(pathToPackageJson, onlyGwDependencies) {
    const packageInfo = await fs.readJson(pathToPackageJson);
    const moreDependencies = parseDependencies(
        packageInfo,
        pathToPackageJson,
        onlyGwDependencies
    );
    return moreDependencies;
}


const requireInApp = (lookupRoot) => Module.createRequireFromPath(lookupRoot);

/**
 *  Searches for a package.json using the node dependency resolution mechanism and returns its path
 * @param {string} packageName the name of the package which package.json should be retrieved
 * @param {string} lookupRoot the path where the module should start looking for the package
 * @returns {Promise<string>} returns the path
 */
async function findPackageJson(packageName, lookupRoot = appPaths.appPackageJson) {
    const nodePaths = requireInApp(lookupRoot).resolve.paths(packageName) || [];
    const paths = nodePaths
        .map((searchPath) => path.join(searchPath, packageName, 'package.json'))
        .map((searchPath) => normalizePath(searchPath));

    const files = await glob(paths);
    return _(files)
        .sort()
        .reverse()
        .take(1)
        .first(); // unwrap from Lodash
}


/**
 * Returns an array of tokens describing the capability
 * An empty array is returned if the package is not a capability
 *
 * @example
 * [ 'producer', 'quote', 'cp']
 *
 * @param {String} packageId - the name of the package
 * @returns {String[]} The tokens defining the capability name
 */
function getCapabilityTokens(packageId) {
    const [, capabilityPackageName] = packageId.match(/(?:-capability)((?:-\w+)+)$/) || [];

    if (_.isEmpty(capabilityPackageName)) {
        // the package is not a capability (e.g. gw-platform)
        return [];
    }

    const capabilitySpecArr = _(capabilityPackageName.replace(/-react|-ui/, '')
        .split('-'))
        .filter(Boolean)
        .value();

    return capabilitySpecArr;
}

function getCapabilityIdentifiers(capabilitySpecArr, capabilitiesConfig) {
    // we have to apply the following fallback strategy
    // * find transactions
    // * find capabilities
    // This is because there are packages named gateway-policychange where the transaction is
    // effectively "policychange"
    // But there are also packages which capabilities are named "gateway"
    // which should be a capability of its own
    //
    // When trying to identify the capability purpose
    // We should prefer transactions


    // lookup transactions first
    const [transactionNameInPackage, ...restOfTransactionSpec] = _.dropWhile(
        capabilitySpecArr,
        _.negate(isValidTransaction)
    );
    if (_.isEmpty(transactionNameInPackage)) {
        // If it's not a transaction we check if the capability should be enabled
        return _.dropWhile(capabilitySpecArr, (token) => !capabilitiesConfig[token]);
    }
    const transactionName = getNormalizedTransactionName(transactionNameInPackage);
    return [transactionName, ...restOfTransactionSpec];
}


function isCapabilityEnabledInternal(capabilitySpecArr, capabilitiesConfig) {
    const [capabilityName, ...restOfCapabilitySpec] = getCapabilityIdentifiers(
        capabilitySpecArr,
        capabilitiesConfig
    );
    // not a transaction or not enabled
    if (_.isNil(capabilityName)) {
        // capability is not enabled
        return false;
    }
    // by convention the LOB is the last item of the array
    const capabilityLob = _.last(restOfCapabilitySpec);
    return isCapabilityEnabled({
        capabilityName,
        lob: capabilityLob,
        capabilitiesConfig
    });
}

/**
 * Check whether a particular module is enabled
 *
 * @param {String} dependencyId - the identifier for the dependency
 * @param {AllowedCapabilitiesSpecification} allowedCapabilities - an object specifying the
 *                              transactions which are enabled in the application
 * @returns {boolean} true if the dependency should be enabled
 */
function isModuleEnabled(dependencyId, allowedCapabilities) {
    if (_.isEmpty(allowedCapabilities)) {
        return true;
    }
    const capabilityTokens = getCapabilityTokens(dependencyId);
    if (_.isEmpty(capabilityTokens)) {
        // this is not a capability/transaction module so we enable it
        return true;
    }

    const enabled = isCapabilityEnabledInternal(capabilityTokens, allowedCapabilities);
    if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`capability-enabled-status: ${_.padEnd(dependencyId, 60)} | enabled: ${enabled}`);
    }
    return enabled;
}

/**
 * Explores transitive dependencies of a given dependency descriptor with name and version
 *
 * It will add itself to the `visitedDependencies` and add
 * the transitive dependencies to `moreDependenciesToExplore`.
 * Upon error it will record the `packageName` into the `dependenciesWithErrors`
 * While the dependencies are being resolved they will be stored in `dependenciesBeingResolved`
 *
 * @param {DependencyDescriptor} dependency the descriptor of the dependency
 * @param {Map<String, DependencyDescriptor>} visitedDependencies the set of visited dependencies
 * @param {Set<DependencyDescriptor>} moreDependenciesToExplore set of dependencies yet to explore
 * @param {Map<String, String>} dependenciesWithErrors dependencies which could not be resolved
 * @param {Map<String, Promise>} dependenciesBeingResolved dependencies which are being processed
 * @param {boolean} onlyGwDependencies whether only the GW dependencies should be explored or not
 * @param {AllowedCapabilitiesSpecification} allowedCapabilities the transactions|capabilities that
 *                                                       are allowed in the application
 *
 */
function exploreDependency(
    dependency,
    visitedDependencies,
    moreDependenciesToExplore,
    dependenciesWithErrors,
    dependenciesBeingResolved,
    onlyGwDependencies,
    allowedCapabilities
) {
    // we are doing side effect on the input
    /* eslint-disable no-param-reassign */
    const { name, version, requiredAt } = dependency;
    const dependencyId = `${name}@${version}`;

    if (
        visitedDependencies.has(dependencyId)
        || dependenciesWithErrors.has(dependencyId)
        || dependenciesBeingResolved.has(dependencyId)
        || !isModuleEnabled(name, allowedCapabilities)
    ) {
        // already explored -> no need to re-analyze
        // if not enabled -> no eed to analyze
        return;
    }

    const dependencyBeingExplored = findPackageJson(name, requiredAt)
        .then(async (pathToPackageJson) => {
            if (!pathToPackageJson) {
                throw new DependencyError(dependency, `package.json could not be found for ${dependencyId} at ${requiredAt}`);
            }
            const realPathToPackageJson = await fs.realpath(pathToPackageJson);
            visitedDependencies.set(dependencyId, {
                ...dependency,
                foundAt: realPathToPackageJson
            });
            return parseDependenciesForPackage(realPathToPackageJson, onlyGwDependencies);
        })
        .then((moreDeps) => {
            moreDeps.forEach((dep) => moreDependenciesToExplore.add(dep));
        })
        .catch((err) => {
            if (err instanceof DependencyError) {
                dependenciesWithErrors.set(dependencyId, err.message);
            } else {
                // re-throw
                throw err;
            }
        });
    dependenciesBeingResolved.set(dependencyId, dependencyBeingExplored);
    /* eslint-enable no-param-reassign */
}

/**
 * @typedef ExploreDependencyResult
 * @property {DependencyDescriptor[]} visited the visited dependencies
 * @property {string[]} withErrors dependencies with errors
 */

/**
  * Resolves the dependencies for the given `rootPackage`
  *
  * @param {Object} arguments
  * @param {PackageDescription} arguments.rootPackage the root package information
  * @param {boolean} [arguments.onlyGwDependencies] whether only GW dependencies should be listed
  * @param {String} [arguments.packageLocation] where the root package is located
  * @param {AllowedCapabilitiesSpecification} [arguments.capabilitiesSpecification]
  *                                      which capabilities are enabled
  * @returns {Promise<ExploreDependencyResult>}
  */
async function listDependencies({
    rootPackage,
    onlyGwDependencies = false,
    packageLocation = appPaths.appPackageJson,
    capabilitiesSpecification
}) {
    const rootPackageDependencies = parseDependencies(
        rootPackage,
        packageLocation,
        onlyGwDependencies
    );
    const moreDependenciesToExplore = new Set(rootPackageDependencies);
    const visitedDependencies = new Map();
    const dependenciesWithErrors = new Map();
    const dependenciesBeingResolved = new Map();

    while (moreDependenciesToExplore.size > 0 || dependenciesBeingResolved.size > 0) {
        if (moreDependenciesToExplore.size === 0) {
            const pendingResolution = Array.from(dependenciesBeingResolved.values());
            dependenciesBeingResolved.clear();
            // since the state of both the collections (to visit and being visited)
            // depends on these promises to be resolved we
            // temporarily disable this linting rule
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(pendingResolution);
        } else {
            // explore the first dependency from the list
            const dependency = Array.from(moreDependenciesToExplore.values())[0];
            exploreDependency(
                dependency,
                visitedDependencies,
                moreDependenciesToExplore,
                dependenciesWithErrors,
                dependenciesBeingResolved,
                onlyGwDependencies,
                capabilitiesSpecification
            );
            moreDependenciesToExplore.delete(dependency);
        }
    }

    return {
        visited: Array.from(visitedDependencies.values()),
        withErrors: Array.from(dependenciesWithErrors.keys())
    };
}


module.exports = {
    findPackageJson,
    listDependencies
};
