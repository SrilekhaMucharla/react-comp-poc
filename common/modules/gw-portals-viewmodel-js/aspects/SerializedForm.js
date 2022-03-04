import _ from 'lodash';
/**
 * Serializes node as its value.
 * @param {Object} node
 * @returns {*}
 */
function simpleSerializer(node) {
    return node.value;
}

/**
 * Serializer for typelist values.
 * @param {Array} node
 * @returns {*}
 */
function typelistSerializer(node) {
    const { value } = node;
    if (_.isString(value)) {
        // eslint-disable-next-line no-console
        console.warn('Serializing string as a typelist value.Typecodes should be used instead.');
        return value;
    }
    return value.code;
}


/**
 * Serializer for the array values.
 * @param {Array} node
 * @returns {Array}
 */
function arraySerializer(node) {
    const len = node.length;
    const res = [];
    for (let i = 0; i < len; i += 1) {
        res.push(node.getElement(i).aspects.serializedForm);
    }
    return res;
}

/**
 * Serializes a DTO using given properties.
 * @param {Array} propNames
 * @param {Object} node
 * @returns {Object}
 */
function dtoSerializer(propNames, node) {
    const res = {};
    propNames.forEach((propName) => {
        const propVal = node[propName].aspects.serializedForm;
        if (!_.isUndefined(propVal)) {
            res[propName] = propVal;
        }
    });
    return res;
}

/** Finds a value serializer based on the step metadata.
 * Serializer takes an object node and returns its serialized form.
 *
 * @param {Object} metadata
 *
 * @returns {Function}
 */
function getSerializer(metadata) {
    const type = metadata.valueType;

    switch (type.kind) {
        case 'primitive':
            return simpleSerializer;
        case 'collection':
            return arraySerializer;
        case 'stringMap':
            if (type.valueType.kind === 'primitive') {
                // console.log('Using fallback for the map value on the view model');
                return simpleSerializer;
            }
            throw new Error('Maps are not supported on the view model');
        case 'class':
            switch (type.typeInfo.metaType.kind) {
                case 'typelist':
                    return typelistSerializer;
                case 'dto':
                    return _.partial(dtoSerializer, type.typeInfo.properties.map((property) => {
                        return property.jsProperty;
                    }));
                default:
                    throw new Error(`Unsupported class type kind ${type.typeInfo.metaType.kind}`);
            }
        default:
            throw new Error(`Unsupported kind of the view model node : ${type.kind}`);
    }
}

/** Model cleanup and optimization module.
 * Removes non-visible and read-only arguments. Converts model values into
 * its serialized form.
 */
export default {
    getAspectProperties: (currentViewModelNode, currentMetadataNode /* , ancestorChain*/) => {
        const serializer = getSerializer(currentMetadataNode);

        return {
            serializedForm: {
                get: () => {
                    if (!currentViewModelNode.aspects.visible) {
                        return;
                    }
                    const { value } = currentViewModelNode;
                    if (_.isUndefined(value) || _.isNull(value)) {
                        // eslint-disable-next-line consistent-return
                        return value;
                    }
                    // eslint-disable-next-line consistent-return
                    return serializer(currentViewModelNode);
                }
            }
        };
    }
};
