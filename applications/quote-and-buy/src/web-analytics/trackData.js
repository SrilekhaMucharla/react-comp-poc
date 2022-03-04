/* eslint-disable no-undef */
export const trackView = (dataObj) => {
    if (typeof utag !== 'undefined') {
        utag.view(dataObj);
    }
};

export const trackEvent = (dataObj) => {
    if (typeof utag !== 'undefined') {
        utag.link(dataObj);
    }
};
