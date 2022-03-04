import _ from 'lodash';

export default {
    /**
     * Converts a type info or function returning a type info into the property definition.
     * @param {*} typeRef
     * @returns {Object}
     */
    toPropertyDef: (typeRef) => {
        if (_.isFunction(typeRef)) {
            return {
                get: typeRef
            };
        }

        return {
            value: typeRef
        };
    }
};
