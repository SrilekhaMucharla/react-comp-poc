/* eslint-disable prefer-promise-reject-errors */
import _ from 'lodash';
import styles from './IframeUtil.module.scss';
import ERRORS from '../../AuthErrors';

// time before the iframe is expected to be loaded (in ms)
const TIMEOUT_BEFORE_IFRAME_REJECT = 20000;

// Errors which can be used to detect the reason

function getIframeData(iframeEl) {
    const iframeData = {
        iframeEl,
        iframeDoc: iframeEl.contentDocument || iframeEl.contentWindow.document,
        iframeWin: iframeEl.contentWindow || iframeEl,
        iframeWrapper: iframeEl.parentNode
    };
    return iframeData;
}

/**
 * @typedef {Object} IFrameRequest
 * @property {String} src the source of the iframe
 * @property {String} [expectedSrcPartOnLoad] the expected path if the user is logged in already
 * @property {String} [failureRedirectUrl] the URL to which the user should be redirected
 *                                          upon failure
 */

/**
 * @typedef {Object} IFrameResponse
 * @property {String} [error] describes why Promise is rejected
 * @property {Document} [iframeDoc] the iframe document
 */


function iframeLoadPromiseHandler(iframeEl, resolve, reject) {
    try {
        const iframeData = getIframeData(iframeEl);
        // i.e. and firefox dont throw an error for some auth iframes.
        // This is forcing the same behaviour as chrome
        if (iframeData.iframeWin.location.href.includes('about:blank')) {
            throw new DOMException();
        }
        resolve(iframeData);
    } catch (e) {
        if (e instanceof DOMException || _.includes(e.message, 'Access is denied.')) {
            reject({
                authorizeWithoutIFrame: true
            });
            return;
        }
        // eslint-disable-next-line no-console
        console.error(e);
        reject();
    }
}

function checkIframeContent(iframeData, options) {
    const { expectedSrcPartOnLoad, failureRedirectUrl } = options;
    if (!iframeData.iframeDoc.querySelector('meta[content="Cloud Foundry"],meta[content="Guidewire"]')) {
        // not redirected to a UAA page so must be an external IDP Page
        return Promise.reject({
            fullPageRedirectRequired: iframeData.iframeDoc.URL
        });
    }
    if (expectedSrcPartOnLoad) {
        // check if the src meets expectations (e.g. iframe was redirected)
        if (!iframeData.iframeWin.location.href.includes(expectedSrcPartOnLoad)) {
            return Promise.reject({ error: ERRORS.expectedSrcPartOnLoad });
        }
        if (iframeData.iframeWin.location.href.includes('error')) {
            return Promise.reject({
                fullPageRedirectRequired: failureRedirectUrl
            });
        }
    }
    return Promise.resolve(iframeData);
}

function iframeErrorPromiseHandler(reject) {
    reject({ error: ERRORS.iframeLoadError });
}

/**
 * Loads a new iframe.
 *
 * @param {IFrameRequest} request the iframe request
 * @returns {Promise<IFrameResponse>}
 */
function loadIframe({ src, expectedSrcPartOnLoad, failureRedirectUrl }) {
    const iframeEl = document.createElement('iframe');
    const iframeWrapper = document.createElement('div');
    iframeWrapper.classList.add(styles.hiddenIframe);
    iframeWrapper.appendChild(iframeEl);

    let iframeOnLoadListener;
    let iframeOnErrorListener;

    const iframePromise = new Promise(
        (resolve, reject) => {
            iframeOnLoadListener = () => iframeLoadPromiseHandler(iframeEl, resolve, reject);
            iframeOnErrorListener = () => iframeErrorPromiseHandler(reject);
            // on iframe changes the state
            iframeEl.addEventListener('load', iframeOnLoadListener);
            iframeEl.addEventListener('error', iframeOnErrorListener);
        }
    ).then((iframeData) => {
        return checkIframeContent(iframeData, { expectedSrcPartOnLoad, failureRedirectUrl });
    });

    // Promise with timeout rejections
    let timeoutId;
    const loadingTimeout = new Promise(
        (resolve, reject) => {
            timeoutId = setTimeout(
                () => reject({ error: ERRORS.loadTimeout }),
                TIMEOUT_BEFORE_IFRAME_REJECT
            );
        }
    ).finally(() => {
        clearTimeout(timeoutId);
    });


    // start loading
    iframeEl.src = src;
    document.body.appendChild(iframeWrapper);

    // load with timeout
    const loadingPromise = Promise.race([
        iframePromise,
        loadingTimeout
    ]).catch((err) => {
        throw err;
    }).finally(() => {
        // cleanup
        iframeEl.removeEventListener('load', iframeOnLoadListener);
        iframeEl.removeEventListener('error', iframeOnErrorListener);
        document.body.removeChild(iframeWrapper);// remove appended nodes
    });

    return loadingPromise;
}

// EXPORT
export default {
    loadIframe
};
