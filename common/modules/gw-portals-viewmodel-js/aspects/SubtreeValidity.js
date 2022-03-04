/* eslint-disable no-restricted-syntax */
/**
 * Default notion of the subtree validity. This validity is just tho validity of the node itself.
 * @param {Object} node
 * @returns {Boolean}
 */
function defaultValidity(node) {
    return node.aspects.valid;
}

/**
 * Notion of the validity for the array node.
 * @param {Object} node
 * @returns {boolean}
 */
function arrayValidity(node) {
    if (!node.aspects.valid) {
        return false;
    }
    const len = node.length;
    for (let i = 0; i < len; i += 1) {
        if (!node.getElement(i).aspects.subtreeValid) {
            return false;
        }
    }
    return true;
}

/**
 * Returns a validity function for the dto.
 * @param {Object} info
 * @returns {function}
 */
function getDtoValidityFunction(info) {
    return (node) => {
        if (!node.aspects.valid) {
            return false;
        }

        for (const prop of info.properties) {
            if (node[prop.jsProperty] && !node[prop.jsProperty].aspects.subtreeValid) {
                return false;
            }
        }

        return true;
    };
}

/**
 * Returns a function to extract validity from the metadata node.
 * @param {Object} metadata
 * @returns {Function}
 */
function getValidityFn(metadata) {
    if (metadata.readOnly) {
        return () => true;
    }
    switch (metadata.valueType.kind) {
        case 'class':
            // eslint-disable-next-line no-case-declarations
            const { typeInfo } = metadata.valueType;
            if (typeInfo.metaType.isDto) {
                return getDtoValidityFunction(typeInfo);
            }
            return defaultValidity;
        case 'collection':
            return arrayValidity;
        default:
            return defaultValidity;
    }
}


/* Aspect defining validity of the whole model subtree. */
const alwaysValid = () => true;
export default {
    getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain, config) => {
        const consideredValid = config
            && config.subtreeValidity
            && config.subtreeValidity.assumeValid
            ? config.subtreeValidity.assumeValid : null;

        const accessor = consideredValid
            && consideredValid.includes(currentMetadataNode.valueType.name)
            ? alwaysValid : getValidityFn(currentMetadataNode);

        return {
            subtreeValid: {
                get: () => accessor(currentViewModelNode)
            }
        };
    }
};
