const url = require('url');
const _ = require('lodash');
const modifyResponse = require('node-http-proxy-json');
const proxy = require('http-proxy-middleware');

const paths = require('gw-build-config-paths');
const { injectEnv } = require('gw-build-config-environment');
const { getRunTimeHost } = require('gw-build-config-urls');

require('./proxyEnv'); // inject additional env variables (e.g. GW_PC_HOST)

const { capabilities = {}, proxiedUrls = [], servers } = require(paths.appGeneratedConfig);
const secureProxy = JSON.parse(process.env.SECURE_PROXY || 'true');

const PROXY_ENTRY_CONFIG = 'X-Proxy-EntryConfig';

/** @typedef {import("express").Request} IncomingMessage */
/** @typedef {import("http").ClientRequest} ClientRequest */
/** @typedef {import("express").Response} ServerResponse */

/**
 * Removes the path referring to Edge from a given URL
 * @param {string} aUrl the url to change
 * @returns {string} a url string that does not contain any more reference to the edge layer
 */
function stripEdgePath(aUrl) {
    return aUrl.replace(/\/service(\/unauthenticated)?\/edge\/?/, '');
}

/**
 * Checks whether a certain URL contains a reference to an xCenter
 * If so it returns the matching xCenter url, otherwise it returns undefined
 * @param {String} redirectUrl the url to check
 * @returns {?String} undefined if no reference is found
 */
function findUrlRefersToXCenter(redirectUrl) {
    const xCenterUrls = _.map(servers, 'url')
        .map(stripEdgePath);
    return xCenterUrls.find((xCenterUrl) => redirectUrl.startsWith(xCenterUrl));
}

/**
 * Returns the new location obtained replacing the xCenters URLs that are
 * already proxied
 * @param {String} location the location in the redirect
 * @param {String} initialTarget the original request sent TO the proxy
 * @returns {String}
 */
function replaceXCenterRefs(location, initialTarget) {
    const xCenterReference = findUrlRefersToXCenter(location);
    if (xCenterReference && !location.startsWith(initialTarget)) {
        const newLocation = location
            .replace(xCenterReference, process.env.GW_RUN_TIME_DEPLOYMENT_URL);
        return newLocation;
    }
    return location;
}

/**
 * Replaces the first matching rule (described as key, value in `replacementRules`)
 * with the corresponding substitution
 *
 * @param {string} location the location in the initial redirect response
 * @param {Object} replacementRules an object which keys are patterns for substitution
*                                   and values are the actual replacements
 * @returns {string}
 */
function replaceRedirects(location, replacementRules) {
    const aUrl = url.parse(location);
    const originalPath = aUrl.pathname;
    const regExps = Object.entries(injectEnv(replacementRules))
        .map(([pattern, replacement]) => (
            [new RegExp(pattern), replacement]
        ));
    const firstApplicableReplacement = regExps.find(([regex]) => originalPath.match(regex));
    if (firstApplicableReplacement) {
        const [regex, replacement] = firstApplicableReplacement;
        aUrl.pathname = originalPath.replace(regex, replacement);
    }
    return url.format(aUrl);
}

/**
 * Returns the configuration of the proxy that applies to a given request
 * @param {IncomingMessage} req the request sent TO the proxy
 * @returns {Object} an object containing the configuration of the proxy for the given request
 */
function getRequestProxyConfig(req) {
    return _.get(req, `headers.${PROXY_ENTRY_CONFIG}`, {});
}

/**
 * Temporarily stores the configuration for a given request
 * @param {IncomingMessage} req the request sent TO the proxy
 * @param {Object} config the configuration applying to the current request
 */
function setRequestProxyConfig(req, config) {
    req.headers[PROXY_ENTRY_CONFIG] = config;
}

function getLocations(proxyRes, req) {
    const location = _.get(proxyRes, 'headers.location', '');
    const { target: targetURL } = getRequestProxyConfig(req);
    return {
        location,
        initialTarget: targetURL ? targetURL.format() : undefined
    };
}

function replaceProtocol(location, protocolRewrite) {
    return location.replace(/https?/, (match) => {
        return protocolRewrite || match;
    });
}

function processRedirect({
    reqProxyConfig,
    location,
    initialTarget,
    proxyRes
}) {
    const replacementRules = _.get(reqProxyConfig, 'custom.replaceRedirect', {});
    const { protocolRewrite } = reqProxyConfig;
    let newLocation = replaceXCenterRefs(location, initialTarget);
    newLocation = replaceRedirects(newLocation, replacementRules);
    newLocation = replaceProtocol(newLocation, protocolRewrite);
    _.set(proxyRes, 'headers.location', newLocation);
}

const bodyReplacement = (body, substitute) => {
    return Object.entries(substitute).reduce((bodyAcc, [pattern, replacement]) => {
        return bodyAcc.replace(new RegExp(pattern), replacement);
    }, body);
};

/**
 * @param {Object} [options]
 * @param {Object} [options.reqProxyConfig]
 * @param {IncomingMessage} [options.proxyRes]
 * @param {ServerResponse} [options.clientRes]
 */
function processBodyRewrites({ reqProxyConfig, proxyRes, clientRes }) {
    const { substitute } = _.get(reqProxyConfig, 'custom', {});
    if (!_.isEmpty(substitute)) {
        modifyResponse(clientRes, proxyRes, (body) => bodyReplacement(body, substitute));
    }
}

function onProxyReq(proxyReq, req, res, config) {
    setRequestProxyConfig(req, config);
}

function onProxyRes(proxyRes, clientReq, clientRes) {
    const { location, initialTarget } = getLocations(proxyRes, clientReq);
    const reqProxyConfig = getRequestProxyConfig(clientReq);

    if (reqProxyConfig.headers) {
        Object.entries(reqProxyConfig.headers).forEach(([key, value]) => {
            // eslint-disable-next-line no-param-reassign
            proxyRes.headers[key] = value;
        });
    }

    if (location) {
        // redirect should be managed in the proxyRes, so that
        // the http-proxy downstream will manage that properly
        processRedirect({
            reqProxyConfig,
            location,
            initialTarget,
            proxyRes
        });
    }
    processBodyRewrites({
        reqProxyConfig,
        proxyRes,
        clientRes
    });
}

function onError(err, req, res) {
    // log the error before returning the response
    // eslint-disable-next-line no-console
    console.log(err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end(
        'Proxy Error: Something went wrong'
    );
}

module.exports = function proxySetup(app) {
    const capabilitiesToProxy = _.orderBy(Object.values(capabilities), 'service', 'desc')
        .map(({ server, service }) => ({
            server,
            service: `/${service}`
        }))
        .map(({ server, service }) => ({
            context: service,
            config: {
                target: getRunTimeHost(server) + service,
                secure: secureProxy,
                protocolRewrite: process.env.HTTPS === 'true' ? 'https' : undefined,
                pathRewrite: {
                    [service]: ''
                }
            }
        }));

    const otherProxies = injectEnv(proxiedUrls).map((proxyEntry) => {
        const { config } = proxyEntry;
        const expandedConfig = {
            ...config,
            target: config.target,
            onError,
            onProxyReq,
            onProxyRes
        };
        return {
            ...proxyEntry,
            config: expandedConfig
        };
    });

    capabilitiesToProxy.concat(otherProxies).forEach(({ context, config }) => {
        app.use(proxy(context, config));
    });
};
