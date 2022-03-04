
import _ from 'lodash';

let displayKey;
const INT_TYPES = ['byte', 'short', 'int', 'long', 'Byte', 'Short', 'Integer', 'Long', 'BigInteger'];
const FLOAT_TYPES = ['float', 'double', 'Float', 'Double', 'BigDecimal'];
const isNotAValidNumber = (value) => _.isNaN(Number(value));
const isNumericType = (type) => INT_TYPES.includes(type) || FLOAT_TYPES.includes(type);

export default (currentViewModelNode, translator) => (
    {
        valid: {
            get: () => {
                let isValid = true;
                if (isNumericType(currentViewModelNode.question.questionType)) {
                    displayKey = {
                        id: 'gw-portals-questionsets-js.answer.validation.An invalid character was entered, such as a letter in a numeric field'
                    };
                    isValid = !isNotAValidNumber(
                        currentViewModelNode.modelValue.answers[currentViewModelNode.question.code]
                    );
                }
                if (isValid) {
                    displayKey = {
                        id: 'gw-portals-questionsets-js.answer.validation.This is a required field'
                    };
                    isValid = !(currentViewModelNode.aspects.required
                        && _.isNil(currentViewModelNode.answer));
                }
                return isValid;
            }
        },
        validationMessages: {
            get: () => {
                if (!currentViewModelNode.aspects.valid) {
                    return [translator(displayKey)];
                }
                return [];
            }
        },
        validationMessage: {
            get: () => {
                if (!currentViewModelNode.aspects.valid) {
                    return translator(displayKey);
                }
                return undefined;
            }
        }
    }
);
