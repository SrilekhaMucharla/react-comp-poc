import _ from 'lodash';
import { driverAddressCountry } from '../../../constant/const';

/**
 * Supports address in multiple lines, and separated by coma
 * @param {string} dlAddress
 *
 * @returns {object}
 */
function parseAddress(dlAddress) {
    const addressLines = dlAddress.split(/\n/);

    // Three lines of addressLines, like:
    // Line 1: 122 BURNS CRESCENT
    // Line 2: EDINBURGH
    // Line 2: EH1 9GP
    if (addressLines.length === 3 && _.trim(addressLines[2]).length > 5 && _.trim(addressLines[2]).length < 9) {
        return {
            addressLine1: _.trim(addressLines[0]),
            addressLine2: '',
            addressLine3: '',
            city: _.trim(addressLines[1]),
            postalCode: _.trim(addressLines[2]),
            country: driverAddressCountry
        };
    }

    // Coma seperated address, like:
    // 122 BURNS CRESCENT, EDINBURGH, EH1 9GP
    const addressCommas = dlAddress.split(/,/);
    const postalCodeIndex = addressCommas.length - 1;
    const cityIndex = addressCommas.length - 2;
    // Take all other parts and remove lines
    const addressLine2Array = _.slice(addressCommas, 1, cityIndex).map((e) => _.replace(e, '\n', ' '));
    const addressLine2OneLine = _.trim(_.join(addressLine2Array, ', '));

    return {
        addressLine1: _.trim(addressCommas[0]),
        addressLine2: cityIndex > 1 ? _.replace(addressLine2OneLine, / {2,}/g, ' ') : '',
        addressLine3: '',
        city: _.replace(_.trim(addressCommas[cityIndex]), '\n', ''),
        postalCode: _.replace(_.trim(addressCommas[postalCodeIndex]), '\n', ''),
        country: driverAddressCountry
    };
}

/**
 * Update model with given recognition result
 * @param {json} result microblink scan result
 * @param {object} model View Model
 * @param {integer} driverIndex setting data for proper driver
 * @param {boolean} isAnotherDriver setting data for proper driver
 * @constructor
 */
const HDMicroblinkDataExtractor = (result, model, driverIndex, isAnotherDriver) => {
    // Get Data from License
    const dlNames = _.get(result, 'firstName');
    const noSalutationNames = _.replace(dlNames, RegExp('(^)(MR |MS |MISS |MRS |DR )'), '');
    const noSalutationFirstName = noSalutationNames.split(' ')[0];
    const drivingLicenseFirstName = _.startCase(_.camelCase(noSalutationFirstName));
    const drivingLicenseLastName = _.startCase(_.camelCase(_.get(result, 'lastName')));
    const drivingLicenseDateOfBirthDay = _.get(result, 'dateOfBirth.day');
    const drivingLicenseDateOfBirthMonth = Number(_.get(result, 'dateOfBirth.month')) - 1;
    const drivingLicenseDateOfBirthYear = _.get(result, 'dateOfBirth.year');
    const drivingLicenseLicenceNumber = _.get(result, 'documentNumber');
    const drivingLicenseAddress = _.get(result, 'address');
    const policyAddressPath = 'baseData.policyAddress';
    const primaryAddressPath = 'baseData.accountHolder.primaryAddress';

    const accountHolderPath = 'baseData.accountHolder';
    const driverPath = `lobData.privateCar.coverables.drivers.children.${driverIndex}`;
    const firstNameFieldName = 'firstName';
    const lastNameFieldName = 'lastName';
    const driverBornField = 'dateOfBirth';
    const genderFieldName = 'gender';
    const licenceNumberFieldName = 'licenseNumber';
    const licenceNumberPath = `${driverPath}.${licenceNumberFieldName}`;
    const driverResidingField = 'residingInUKSince';
    const prefixFieldName = 'prefix';

    // Set data for account holder
    if (!isAnotherDriver) {
        // Clear gender
        _.set(model, `${accountHolderPath}.${genderFieldName}`, '');

        _.set(model, `${accountHolderPath}.${firstNameFieldName}`, drivingLicenseFirstName);
        _.set(model, `${accountHolderPath}.${lastNameFieldName}`, drivingLicenseLastName);
        // init values for date
        _.set(model, `${accountHolderPath}.${driverBornField}`, {});
        _.set(model, `${accountHolderPath}.${driverBornField}.day`, drivingLicenseDateOfBirthDay);
        _.set(model, `${accountHolderPath}.${driverBornField}.month`, drivingLicenseDateOfBirthMonth);
        _.set(model, `${accountHolderPath}.${driverBornField}.year`, drivingLicenseDateOfBirthYear);

        _.set(model, `${accountHolderPath}.${driverResidingField}`, {});
        _.set(model, `${accountHolderPath}.${driverResidingField}.day`, drivingLicenseDateOfBirthDay);
        _.set(model, `${accountHolderPath}.${driverResidingField}.month`, drivingLicenseDateOfBirthMonth);
        _.set(model, `${accountHolderPath}.${driverResidingField}.year`, drivingLicenseDateOfBirthYear);
    }

    // Set data for driver index
    // clear gender
    _.set(model, `${driverPath}.${genderFieldName}`, '');

    _.set(model, `${driverPath}.person.${prefixFieldName}`, '');
    _.set(model, `${driverPath}.person.${firstNameFieldName}`, drivingLicenseFirstName);
    _.set(model, `${driverPath}.person.${lastNameFieldName}`, drivingLicenseLastName);


    // init values for date
    _.set(model, `${driverPath}.${driverBornField}`, {});
    _.set(model, `${driverPath}.${driverBornField}.day`, drivingLicenseDateOfBirthDay);
    _.set(model, `${driverPath}.${driverBornField}.month`, drivingLicenseDateOfBirthMonth);
    _.set(model, `${driverPath}.${driverBornField}.year`, drivingLicenseDateOfBirthYear);

    _.set(model, `${driverPath}.${driverResidingField}`, {});
    _.set(model, `${driverPath}.${driverResidingField}.day`, drivingLicenseDateOfBirthDay);
    _.set(model, `${driverPath}.${driverResidingField}.month`, drivingLicenseDateOfBirthMonth);
    _.set(model, `${driverPath}.${driverResidingField}.year`, drivingLicenseDateOfBirthYear);

    if (!_.isNil(drivingLicenseLicenceNumber) && typeof drivingLicenseLicenceNumber === 'string') {
        _.set(model, licenceNumberPath, drivingLicenseLicenceNumber.substring(0, 16));
    }

    if (!isAnotherDriver) {
        const address = parseAddress(drivingLicenseAddress);
        _.set(model, policyAddressPath, address);
        _.set(model, primaryAddressPath, address);
    }
};

export default HDMicroblinkDataExtractor;
