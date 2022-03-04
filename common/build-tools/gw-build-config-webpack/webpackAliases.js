const fs = require('fs');
const path = require('path');
const appPaths = require('gw-build-config-paths');

const appModuleResolutionConfig = require(appPaths.moduleResolution);
function loadCustomerConfigs(customerConfigPath) {
    if (fs.existsSync(customerConfigPath)) {
        const { customerAliasesConfig } = require(customerConfigPath);
        return customerAliasesConfig;
    }
    return {};
}

const customerAliasesConfig = loadCustomerConfigs(`${appPaths.customerPath}/customer-config.js`);
const hlReactDom = require.resolve('@hot-loader/react-dom');
module.exports = {
    'app-config': appPaths.appGeneratedConfig,
    'app-translation': appPaths.appTranslation,
    config: appPaths.appConfig,
    'locale-config': `${appPaths.appTranslationRoot}/locale.json`,
    'product-metadata': appPaths.appProductMetadata,
    'question-sets-metadata': appPaths.appQuestionSetsMetadata,
    'faq-config': appPaths.faqConfig,
    'react-dom$': hlReactDom,
    'react-dom': path.dirname(hlReactDom),
    ...appModuleResolutionConfig,
    ...customerAliasesConfig
};
