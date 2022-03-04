import _ from 'lodash';

const getValueFromModel = (fieldName, vmPath, model) => {
    const vmValue = _.get(model, `${vmPath}.value`);

    if (!_.isNil(vmValue) && typeof vmValue === 'object' && typeof vmValue.code === 'string') {
        // type lists value handler
        return vmValue.code;
    }

    if (!_.isNil(vmValue) && typeof vmValue === 'object' && fieldName === 'amount') {
        // amount value handler
        return vmValue.amount;
    }

    if (!_.isNil(vmValue) && typeof vmValue === 'object' && typeof (vmValue.day && vmValue.month && vmValue.year) === 'number') {
        // date value handler
        return new Date(new Date(vmValue.year, vmValue.month, vmValue.day, 0, 0, 0, 0).setFullYear(vmValue.year));
    }

    // Workaround for Confirm Contact Details checkboxes due to string converting in next if
    if (!_.isNil(vmValue) && _.isBoolean(vmValue)
         && (fieldName === 'allowEmail'
            || fieldName === 'allowPost'
            || fieldName === 'allowSMS'
            || fieldName === 'allowTelephone')) {
        return vmValue;
    }

    if (!_.isNil(vmValue) && _.isBoolean(vmValue)) {
        return vmValue.toString();
    }

    // Workaround until form refactoring is in place
    if (!_.isNil(vmValue) && fieldName === 'numberOfCarsOnHousehold') {
        return vmValue.toString();
    }

    if (!_.isNil(vmValue)) {
        return vmValue;
    }

    return '';
};

export default getValueFromModel;
