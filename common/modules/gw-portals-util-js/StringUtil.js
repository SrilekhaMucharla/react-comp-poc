function isUpperCase(char) {
    return char.toUpperCase() === char;
}

function buildPropertyName(accumulatedPropName, shouldTransformNext, currentChar) {
    if (shouldTransformNext && isUpperCase(currentChar)) {
        return accumulatedPropName + currentChar.toLowerCase();
    }
    return accumulatedPropName + currentChar;
}

function willContinueTransforming(shouldTransformNext, currentChar) {
    return shouldTransformNext && isUpperCase(currentChar);
}


function toJsCaseConvention({ shouldTransform, composedPropName }, currentChar) {
    return {
        composedPropName: buildPropertyName(composedPropName, shouldTransform, currentChar),
        shouldTransform: willContinueTransforming(shouldTransform, currentChar)
    };
}


/**
 * String utility functions
 */
export default {
    /**
     * Capitalizes a first letter of the string.
     * @param {String} str
     * @returns {string}
     */
    capitalizeFirstLetter: (str) => {
        return str.charAt(0).toUpperCase() + str.substring(1);
    },


    /**
     * Sets the first letter of the string to lowercase
     * @param {String} str
     * @returns {string}
     */
    lowercaseFirstLetter: (str) => {
        return str.charAt(0).toLowerCase() + str.substring(1);
    },

    toSerializedPropertyName: (str) => str.split('').reduce(toJsCaseConvention, {
        composedPropName: '',
        shouldTransform: true
    }).composedPropName
};
