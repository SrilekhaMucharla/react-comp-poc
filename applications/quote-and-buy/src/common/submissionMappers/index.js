/* eslint-disable no-param-reassign */
import _ from 'lodash';
import {
    removeDataBasedOnPeriodStatus,
    cloneViewModel,
    populateVehicleDrivers,
    populateDriversWithPersonData,
    populateAccountHolderDriver,
    populateMarketingContacts,
    populateVehicle,
    cleanUpIDs,
    cleanUpIDsForUpdate,
    populateNCDProtection,
    populateNCDProtectionForUpdate,
    removeLobData,
    removeOfferings,
    populateMCDriversWithPersonData,
    populateMCAccountHolderDriver,
    removeMultiCarDataBasedOnPeriodStatus
} from './helpers';

export const populateMandatoryData = (viewModel) => {
    const dataObject = cloneViewModel(viewModel);
    const drivers = _.get(dataObject, 'lobData.privateCar.coverables.drivers', []);
    const accountHolder = _.get(dataObject, 'baseData.accountHolder', {});
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', [])) || {};
    const coverables = _.get(dataObject, 'lobData.privateCar.coverables', []);

    populateDriversWithPersonData(drivers);
    populateAccountHolderDriver(drivers, accountHolder);
    populateMarketingContacts(dataObject);
    populateVehicle(vehicle);
    populateVehicleDrivers(coverables, vehicle, drivers);
    return dataObject;
};

export const getDataForLWRQuoteAPICall = (submission) => {
    const dataObject = populateMandatoryData(submission);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', []));
    populateNCDProtection(vehicle);
    cleanUpIDs(dataObject);
    removeDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']);
    return dataObject;
};

export const getDataForUpdateQuoteAPICall = (submission) => {
    const dataObject = populateMandatoryData(submission);
    cleanUpIDsForUpdate(dataObject);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', []));
    populateNCDProtectionForUpdate(vehicle);
    removeDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']); // Adding draft to fix issue regarding binddata send in update call
    removeOfferings(dataObject);
    return dataObject;
};

export const getDataForCreateSubmissionAPICall = (submission) => {
    const dataObject = cloneViewModel(submission);
    removeLobData(dataObject);
    _.set(dataObject, 'baseData.accountHolder.subtype', 'Person');
    return dataObject;
};

export const populateMCMandatoryData = (viewModel) => {
    const dataObject = cloneViewModel(viewModel);
    const drivers = _.get(dataObject, 'lobData.privateCar.coverables.drivers', []);
    const accountHolder = _.get(dataObject, 'baseData.accountHolder', {});
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', [])) || {};
    const coverables = _.get(dataObject, 'lobData.privateCar.coverables', []);

    populateMCAccountHolderDriver(drivers, accountHolder);
    populateMarketingContacts(dataObject);
    populateVehicle(vehicle);
    populateVehicleDrivers(coverables, vehicle, drivers);
    return dataObject;
};

export const getDataForUpdateQuoteAPICallinMulti = (submission) => {
    const dataObject = populateMCMandatoryData(submission);
    cleanUpIDsForUpdate(dataObject);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', []));
    populateNCDProtectionForUpdate(vehicle);
    removeMultiCarDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']); // Adding draft to fix issue regarding binddata send in update call
    removeOfferings(dataObject);
    return dataObject;
};

export const updateDataForMC = (multicarAddresChanged, mcsubmissionVM, submissionVM) => {
    const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
    // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
    const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
    if (mcQuote.length && getSCQuoteID !== null) {
        const ChangedAddress = _.get(submissionVM, 'value.baseData.accountHolder.primaryAddress');
        const availableDrivers = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers');
        if (multicarAddresChanged && ChangedAddress) {
            _.set(mcsubmissionVM, 'value.accountHolder.primaryAddress', ChangedAddress);
        }
        mcQuote.map((data, index) => {
            if (multicarAddresChanged && ChangedAddress) {
                data.baseData.accountHolder.primaryAddress = ChangedAddress;
                data.baseData.policyAddress = ChangedAddress;
            }
            if (data.quoteID === getSCQuoteID) {
                const emailAddress = _.get(submissionVM, 'value.baseData.accountHolder.emailAddress1');
                availableDrivers.map((driver, driverIndex) => {
                    if (driver.isPolicyHolder) {
                        _.set(submissionVM, `lobData.privateCar.coverables.drivers.children.${driverIndex}.person.emailAddress1`, emailAddress);
                    }
                });
                _.set(submissionVM, 'value.lobData.privateCar.coverables.drivers', availableDrivers);
                mcQuote[index] = getDataForUpdateQuoteAPICallinMulti(submissionVM.value);
                mcQuote[index].isQuoteToBeUpdated = true;
            } else {
                data.isQuoteToBeUpdated = false;
            }
        });
        _.set(mcsubmissionVM, 'value.quotes', mcQuote);
    }
};

export const getDataForUpdateMultiQuoteAPICall = (mcsubmission) => {
    const dataObject = cloneViewModel(mcsubmission);
    dataObject.quotes.map((quote) => {
        const vehicle = _.first(_.get(quote, 'lobData.privateCar.coverables.vehicles', []));
        // populate NCD for multi quote update draft API
        populateNCDProtectionForUpdate(vehicle);
        removeMultiCarDataBasedOnPeriodStatus(quote, ['Quoted', 'Draft']);
        if (!_.get(quote, 'isQuoteToBeUpdated', false)) {
            _.set(quote, 'isQuoteToBeUpdated', false);
        }
    });
    return dataObject;
};

export const getDataForMultiQuoteAPICallWithUpdatedFlag = (mcsubmission) => {
    const dataObject = cloneViewModel(mcsubmission);
    dataObject.quotes.map((quote) => {
        const vehicle = _.first(_.get(quote, 'lobData.privateCar.coverables.vehicles', []));
        // populate NCD for multiQuote API
        populateNCDProtection(vehicle);
        removeMultiCarDataBasedOnPeriodStatus(quote, ['Quoted', 'Draft']);
        if (!_.get(quote, 'isQuoteToBeUpdated', false)) {
            _.set(quote, 'isQuoteToBeUpdated', false);
        }
    });
    return dataObject;
};

export const getDataForMultiQuoteAPICallWithoutUpdatedFlag = (mcsubmission) => {
    const dataObject = cloneViewModel(mcsubmission);
    dataObject.quotes.map((quote) => {
        const vehicle = _.first(_.get(quote, 'lobData.privateCar.coverables.vehicles', []));
        // populate NCD for multiQuote API
        populateNCDProtection(vehicle);
        removeMultiCarDataBasedOnPeriodStatus(quote, ['Quoted', 'Draft']);
    });
    return dataObject;
};

export const getDataForMultiUpdateQuoteAPICall = (submission) => {
    const dataObject = populateMCMandatoryData(submission);
    cleanUpIDsForUpdate(dataObject);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', []));
    populateNCDProtectionForUpdate(vehicle);
    removeDataBasedOnPeriodStatus(dataObject, ['Quoted', 'Draft']); // Adding draft to fix issue regarding binddata send in update call
    removeOfferings(dataObject);
    return dataObject;
};

export const populateMCMandatoryAdditionalDriverData = (viewModel, policyHolderPersonPublicID, driverSelectedPublicID) => {
    const dataObject = cloneViewModel(viewModel);
    const drivers = _.get(dataObject, 'lobData.privateCar.coverables.drivers', []);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', [])) || {};
    const coverables = _.get(dataObject, 'lobData.privateCar.coverables', []);

    populateMCDriversWithPersonData(drivers, policyHolderPersonPublicID, driverSelectedPublicID);
    populateMarketingContacts(dataObject);
    populateVehicle(vehicle);
    populateVehicleDrivers(coverables, vehicle, drivers);
    return dataObject;
};

export const getDataForMultiUpdateQuoteAdditionalDriverAPICall = (submission, policyHolderPersonPublicID, driverSelectedPublicID) => {
    const dataObject = populateMCMandatoryAdditionalDriverData(submission, policyHolderPersonPublicID, driverSelectedPublicID);
    cleanUpIDsForUpdate(dataObject);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', []));
    populateNCDProtectionForUpdate(vehicle);
    return dataObject;
};

export const getDataForMultiQuoteAPICall = (mcsubmission) => {
    const dataObject = cloneViewModel(mcsubmission.value);
    dataObject.quotes.map((quote) => {
        _.unset(quote, 'bindData');
        return null;
    });
    return dataObject;
};
