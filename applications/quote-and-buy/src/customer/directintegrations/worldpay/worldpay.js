export default (paymentUrl, resultCallback) => {
    const options = {
        iframeHelperURL: `${window.location.origin}/worldpay/helper.html`,
        url: paymentUrl,
        type: 'iframe',
        inject: 'immediate',
        target: 'worldpay',
        accessibility: true,
        debug: false,
        language: 'en',
        country: 'gb',
        resultCallback
    };

    const libraryObject = new window.WPCL.Library();
    libraryObject.setup(options);
};
