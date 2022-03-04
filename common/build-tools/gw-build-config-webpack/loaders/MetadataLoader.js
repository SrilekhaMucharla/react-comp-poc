const loaderUtils = require('loader-utils');
const expandTemplate = require('expand-template');

/**
 * This loader is used for processing presentation metadata
 * and replaces the occurrences of {{IS_VERSION}} with the option provided
 * as `isVersion`
 *
 * @param {String} content the content of the presentation metadata
 */
module.exports = function MetadataLoader(content) {
    const callback = this.async();
    const { isVersion = 'granite', persona } = loaderUtils.getOptions(this);

    const parser = expandTemplate({
        sep: '{{}}'
    });
    const newContent = parser(content, {
        IS_VERSION: isVersion,
        PERSONA: persona
    });
    callback(null, newContent);
};
