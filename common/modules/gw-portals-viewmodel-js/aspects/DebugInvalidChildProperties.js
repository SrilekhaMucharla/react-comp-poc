/* eslint-disable no-underscore-dangle */
/**
 * Aspect to help track down which properties in a model are invalid
 * @param {Object} currentVmNode
 * @param {String} pathFromRoot
 * @param {Array} errorPathsArray
 * @returns {Array}
 */
function failingPropertiesReducer(currentVmNode, pathFromRoot, errorPathsArray) {
    if (!currentVmNode || currentVmNode.aspects.subtreeValid) {
        return errorPathsArray;
    }
    const { valueType } = currentVmNode._metadataInfo;
    if (valueType.isPrimitive || (valueType.typeInfo && valueType.typeInfo.metaType.isTypelist)) {
        if (!currentVmNode.aspects.valid) {
            errorPathsArray.push(pathFromRoot);
        }
    } else if (valueType.isCollection) {
        currentVmNode.children.forEach((vmChildNode, idx) => {
            return failingPropertiesReducer(vmChildNode, `${pathFromRoot}[${idx}]`, errorPathsArray);
        });
    } else if (valueType.isClass || !currentVmNode._parent) {
        const props = currentVmNode._metadataInfo.valueType.typeInfo.properties;
        // eslint-disable-next-line consistent-return
        props.forEach((prop) => {
            const childProp = currentVmNode[prop.jsProperty];
            if (!childProp && prop) {
                errorPathsArray.push(pathFromRoot);
            } else {
                return failingPropertiesReducer(childProp, `${pathFromRoot}.${prop.jsProperty}`, errorPathsArray);
            }
        });
    }
    return errorPathsArray;
}

export default {
    getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain) => {
        if (ancestorChain.parent) {
            // only add this aspect to the root object
            return undefined;
        }
        return {
            invalidChildProperties: {
                get: () => {
                    return failingPropertiesReducer(currentViewModelNode, '', []);
                }
            }
        };
    }
};
