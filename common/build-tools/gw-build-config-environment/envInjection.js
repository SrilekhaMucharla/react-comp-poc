const _ = require('lodash');
const expandTemplate = require('expand-template');

const envExpressionParser = expandTemplate({
    sep: '{{}}'
});

function expandEnvString(string) {
    return envExpressionParser(string, process.env);
}

function expandValue(value) {
    if (_.isString(value)) {
        return expandEnvString(value);
    }
    if (_.isObjectLike(value)) {
        // eslint-disable-next-line no-use-before-define
        return expandObject(value);
    }
    return value;
}

function expandKey(key) {
    if (_.isString(key)) {
        return expandEnvString(key);
    }
    return key;
}

function expandObject(obj) {
    const newEntries = _.toPairsIn(obj)
        .map(([key, value]) => {
            const newKey = expandKey(key);
            const newValue = expandValue(value);
            return [newKey, newValue];
        });
    // if value is OBJ recursion
    return _.fromPairs(newEntries);
}

/**
 *
 * @param {Object[]|Object|String} injectable the array, object or string into which
 *                        the environment should be replaced
 * @returns {Object[]|Object|String} the same array/object/string
 *                          with the environment variables replaced
 */
function injectEnv(injectable) {
    if (_.isString(injectable)) {
        return expandEnvString(injectable);
    }
    if (_.isArray(injectable)) {
        return injectable.map(injectEnv);
    }
    if (_.isObjectLike(injectable)) {
        return expandObject(injectable);
    }
    return injectable;
}

module.exports = {
    injectEnv
};
