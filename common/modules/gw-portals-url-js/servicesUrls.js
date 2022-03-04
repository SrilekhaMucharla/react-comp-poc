// eslint doesn't seem to play nicely with the webpack aliases
// eslint-disable-next-line import/no-unresolved
import { capabilities, servers, deployment } from 'app-config';


function ensureSingleTrailingSlash(url) {
    return `${url}/`.replace(/(\/){2,}$/, '/');
}

/**
 * Returns the Real service url (not proxied)
 * @param {string} serviceName the name of the service to invoke
 *                  (the service name is defined in the ServiceEnpoint of each capability)
 * @returns {string} the real service url
 */
export function getRealServiceUrl(serviceName) {
    const endpoint = capabilities[serviceName];
    const backendUrl = servers[endpoint.server].url;
    const baseUrl = ensureSingleTrailingSlash(backendUrl);
    return baseUrl + endpoint.service;
}

/**
 * Returns the Real service url (not proxied)
 * @param {string} serviceName the name of the service to invoke
 *                  (the service name is defined in the ServiceEnpoint of each capability)
 * @returns {string} the real service url
 */
export function getProxiedServiceUrl(serviceName) {
    const endpoint = capabilities[serviceName];
    const baseUrl = ensureSingleTrailingSlash(deployment.url);
    return baseUrl + endpoint.service;
}

/**
 * Returns a url which will be proxied depending on the base url
 *
 * This is generally meant for *non-EDGE* URLs.
 * If you you want to proxy an edge capability, you should probably use
 * `getProxiedServiceUrl`
 *
 * @see {@link getProxiedServiceUrl}
 * @param {string} urlToProxy the url that should be proxied
 * @returns {string} the real url which accounts for the deployment url
 */
export function getProxiedUrl(urlToProxy) {
    const baseUrl = ensureSingleTrailingSlash(deployment.url);
    return baseUrl + urlToProxy;
}
