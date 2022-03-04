import _ from 'lodash';
import {
    mixed,
    string,
    number,
    bool,
    boolean,
    date,
    object,
    array,
    ref,
    lazy,
    reach,
    isSchema,
    addMethod,
    setLocale,
    ValidationError
} from 'yup';

const minOrEqual = function (compereTo, message) {
    return this.test('minOrEqual', message,
        (value) => {
            return new Date(value).setHours(0, 0, 0, 0) >= new Date(compereTo).setHours(0, 0, 0, 0);
        });
};
const before17thBirthday = function (message) {
    const maxDate = new Date();
    const minDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 17);
    maxDate.setDate(maxDate.getDate() + 30);
    return this.test('before17thBirthday', message,
        (value) => {
            const dateToCompare = new Date(value).setHours(0, 0, 0, 0);
            return !(dateToCompare <= new Date(minDate).setHours(0, 0, 0, 0)
             && dateToCompare >= new Date(maxDate).setHours(0, 0, 0, 0));
        });
};

const notInTheFuture = function (message) {
    return this.test('notInTheFuture', message,
        (value) => {
            const now = new Date().setHours(0, 0, 0, 0);
            if (value) {
                return now > new Date(value).setHours(0, 0, 0, 0);
            }
            return false;
        });
};

const VMValidation = function (vmPath, customMessage, submissionVM) {
    const defaultMessage = customMessage || 'Please enter valid value';
    this.vmPath = vmPath;
    return this.test('VMValidation', defaultMessage,
        function () {
            const { path, createError } = this;
            const vmValidationMessage = _.get(submissionVM, `${vmPath}.aspects.validationMessage`);
            return _.get(submissionVM, `${vmPath}.aspects.subtreeValid`) || createError({ path, message: vmValidationMessage || defaultMessage });
        });
};

// eslint-disable-next-line func-names
const notMobileNumber = function (message) {
    return this.test('notMobileNumber', message, (value) => !(value && value.length === 10));
};

// eslint-disable-next-line func-names
const mobileNumber = function (message) {
    return this.test('mobileNumber', message, (value) => value && value.startsWith('0'));
};

addMethod(mixed, 'VMValidation', VMValidation);
addMethod(date, 'minOrEqual', minOrEqual);
addMethod(date, 'before17thBirthday', before17thBirthday);
addMethod(date, 'notInTheFuture', notInTheFuture);
addMethod(string, 'notMobileNumber', notMobileNumber);
addMethod(string, 'mobileNumber', mobileNumber);

export {
    mixed,
    string,
    number,
    bool,
    boolean,
    date,
    object,
    array,
    ref,
    lazy,
    reach,
    isSchema,
    addMethod,
    setLocale,
    ValidationError,
    VMValidation
};
