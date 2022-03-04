const appPaths = require('gw-build-config-paths');

/**
 * returns {{config}} for WebPack
 */

// eslint-disable-next-line no-unused-vars
const { customerPath } = appPaths;

/* --- ALIASES CONFIG --- */
const customerAliasesConfig = {

    /*
     EXAMPLE: DOMAIN-DRIVEN BRANDING
     */
    // './media-sidebar-config':`${customerPath}/js/mediasidebar/media-sidebar-config`

    /*
        Override the DriverComponent component from
        common/capabilities-react/gw-capability-policyjob-react/components/DriverComponent
        Left is the import to override from gw-capability-policyjob-react/index.js
        Right is the path to the next component jsx

        './components/DriverComponent/DriverComponent': `${customerPath}/react/MyDriverCompoment/DriverComponent`
     */

};

const customerRelativeAliasesConfig = {
    /*
     EXAMPLES:
     */

    // 'text!./ForgotPassword.html': {
    //     fromContext: 'js/src/edge/platform/auth/components/ForgotPassword',
    //     alias: `${customerEdge}/platform/auth/components/ForgotPassword/ForgotPassword.html`
    // },
    //
    // './components/LockLogin/': {
    //     fromContext: 'js/src/edge/platform/auth',
    //     alias: `${customerEdge}/platform/auth/components/LockLogin/index.js`
    // }
};

module.exports = {
    customerAliasesConfig,
    customerRelativeAliasesConfig
};
