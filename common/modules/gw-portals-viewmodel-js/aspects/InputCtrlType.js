/**
 * Simple aspect that is used to suggest the type of input directive that
 * should be used based on the metadata for the property
 *
 * @param {Object} metadataType
 * @returns {String}
 */
function getInputCtrlType(metadataType) {
    let inputType = 'text';
    const isClass = metadataType.kind !== 'primitive';
    const numberTypeNames = ['integer', 'int', 'bigdecimal', 'long'];
    if (isClass && metadataType.isCollection) {
        inputType = 'collection';
    } else if (isClass && metadataType.typeInfo.metaType.isTypelist) {
        inputType = 'typelist';
    } else if (metadataType.name === 'Date') {
        inputType = 'date';
    } else if (numberTypeNames.includes(metadataType.name.toLowerCase())) {
        inputType = 'number';
    } else if (metadataType.name === 'Boolean') {
        inputType = 'boolean';
    }
    return inputType;
}

export default {
    getAspectProperties: (currentViewModelNode, currentMetadataNode /* , ancestorChain*/) => {
        return {
            inputCtrlType: {
                get: () => {
                    return getInputCtrlType(currentMetadataNode.valueType);
                }
            }
        };
    }
};
