// time before the postMessage is expected to be sent (in ms)
const TIMEOUT_BEFORE_LISTENER_REJECT = 10000;

function waitTimeoutRejection() {
    let waitTimeout;
    return new Promise((resolve, reject) => {
        waitTimeout = setTimeout(reject, TIMEOUT_BEFORE_LISTENER_REJECT);
    }).finally(() => clearTimeout(waitTimeout));
}

function onPostMessage(resolve, channelName, event) {
    if (event.data && event.data[channelName]) {
        const postMessageData = event.data[channelName];
        resolve(postMessageData);
    }
}

function waitForMessage(channelName) {
    let listener;
    return new Promise((resolve) => {
        listener = (event) => onPostMessage(resolve, channelName, event);
        window.addEventListener('message', listener);// start listening
    }).finally(() => {
        window.removeEventListener('message', listener);// remove the listener (cleaning)
    });
}

/**
 * Waits till the post message is sent to the channel name
 * @param {String} channelName
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export function waitForPostMessage(channelName) {
    return Promise.race([
        waitForMessage(channelName),
        waitTimeoutRejection()
    ]);
}
