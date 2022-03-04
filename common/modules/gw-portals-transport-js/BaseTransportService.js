/* eslint-disable prefer-promise-reject-errors */
/**
 * Base implementation of low-level transport. Each low-level transport
 * should implement following methods:
 * <ul>
 *     <li>send(endpoint : String, headers: {}, method : String, params : *[]) :
 *          Promise<Object> - performs a network query. </li>
 * </ul>
 */
import _ from 'lodash';
import generateGuid from 'uuid/v4';
import cookie from 'js-cookie';

function manageStickySessionCookie() {
    const STICKY_SESSION_ID = 'JSESSIONID';
    if (!cookie.get(STICKY_SESSION_ID)) {
        cookie.set(STICKY_SESSION_ID, generateGuid());
    }
}

export const JSON_CONTENT_TYPE = 'application/json';

export default {
    send: (endpoint, headers, body, isJSON = true) => {
        const baseHeaders = {
            Accept: JSON_CONTENT_TYPE,
            'Accept-Language': localStorage.getItem('selectedLanguage')
        };
        manageStickySessionCookie();
        const newHeaders = Object.assign(baseHeaders, headers);
        return fetch(endpoint, {
            method: 'POST',
            headers: newHeaders,
            body: (isJSON) ? JSON.stringify(body) : body
        }).then((res) => {
            const responseContentType = res.headers.get('Content-Type');
            if (!res.ok) {
                // status NOT in the range 200-299
                if (res.status === 401) {
                    return Promise.reject({
                        status: 401
                    });
                }
                if (responseContentType && responseContentType.includes(JSON_CONTENT_TYPE)) {
                    return res.json().then((data) => {
                        return Promise.reject(_.pick(data, 'id', 'error'));
                    });
                }
                // reject with Error if response does not contain parsable JSON content
                return Promise.reject({ status: res.status, statusMsg: res.statusText });
            }
            return (isJSON) ? res.json() : res.text();
        }).then((data) => {
            if (typeof data === 'string') {
                return data;
            }
            return _.pick(data, 'id', 'result');
        }).catch((res) => Promise.reject({ status: 503, statusMsg: res.TypeError, error: res.error }));
    }
};
