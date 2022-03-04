/* eslint-disable no-plusplus */
import _ from 'lodash';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE
} from '../../constant/const';

export const DEFAULTS = {
    VOLUNTARY_EXCESS: '250',
    COVER_TYPE: 'comprehensive',
    VEHICLE_NUMBER: 1,
    DVLA_REPORTED_MED_COND: '99_NO',
    BODY_CODE: '02',
    ABI_CODE: '32120102',
    ALLOW_SMS: true,
    ALLOW_EMAIL: true,
    ALLOW_POST: true,
    ALLOW_TELEPHONE: true,
    NCD_GRANTED_YEARS: '1',
    NCD_EARNED_IN_UK_FLAG: true,
    NCD_SOURCE: '11',
    PROTECT_NCD: false,
    DRIVING_EXPIRIENCE_YEARS: null,
    DRIVING_EXPIRIENCE_TYPE: null,
    DRIVING_EXPIRIENCE_FLAG: null
};

export const cloneViewModel = (viewModel) => _.cloneDeep(viewModel);

export const removeDataBasedOnPeriodStatus = (dataObj, periodStatuses) => {
    const { periodStatus } = dataObj.baseData;
    if (_.includes(periodStatuses, periodStatus)) {
        _.unset(dataObj, 'bindData');
        _.unset(dataObj, 'quoteData');
    }
};

export const removeMultiCarDataBasedOnPeriodStatus = (dataObj, periodStatuses) => {
    const { periodStatus } = dataObj.baseData;
    if (_.includes(periodStatuses, periodStatus)) {
        _.unset(dataObj, 'bindData');
    }
};

export const removeOfferings = (dataObj) => {
    _.unset(dataObj.lobData.privateCar, 'offerings');
};


export const getPersonData = (driver) => {
    const { person } = driver;
    return {
        firstName: driver.firstName || person.firstName,
        lastName: driver.lastName || person.lastName,
        prefix: driver.prefix || person.prefix,
        dateOfBirth: driver.dateOfBirth,
        emailAddress1: driver.emailAddress1 || person.emailAddress1,
    };
};

export const populateMarketingContacts = (dataObj) => {
    _.set(dataObj.baseData, 'marketingContacts', {
        allowEmail: DEFAULTS.ALLOW_EMAIL,
        allowPost: DEFAULTS.ALLOW_POST,
        allowSMS: DEFAULTS.ALLOW_SMS,
        allowTelephone: DEFAULTS.ALLOW_TELEPHONE
    });
};

export const populateDriversWithPersonData = (drivers) => {
    for (let index = 0; index < drivers.length; index++) {
        const driver = drivers[index];
        const personData = getPersonData(driver);
        _.set(driver, 'isPolicyOwner', false);
        _.set(driver, 'isPolicyHolder', false);
        _.set(driver, 'dvlaReportedMedCond', DEFAULTS.DVLA_REPORTED_MED_COND); // not setting anywhere // it will be removed from backend as a mandatory
        _.set(driver, 'person', personData);
        _.set(driver, 'tempID', uuidv4());
    }
};

export const populateAccountHolderDriver = (drivers, accountHolder) => {
    const accountHolderIndex = _.findIndex(drivers, (driver) => driver.relationToProposer === undefined);
    const accountHolderDriver = drivers[accountHolderIndex];
    _.set(accountHolderDriver, 'person.displayName', accountHolder.displayName);
    _.set(accountHolderDriver, 'person.publicID', accountHolder.publicID);
    _.set(accountHolderDriver, 'isPolicyOwner', true);
    _.set(accountHolderDriver, 'isPolicyHolder', true);
    _.set(accountHolder, 'prefix', accountHolderDriver.person.prefix);
};

export const populateVehicle = (vehicle) => {
    // set only if values don't exist
    _.defaults(vehicle, {
        voluntaryExcess: DEFAULTS.VOLUNTARY_EXCESS,
        coverType: DEFAULTS.COVER_TYPE,
    });
    _.set(vehicle, 'vehicleNumber', DEFAULTS.VEHICLE_NUMBER); // constant // pick from number of vehicle from household // single car flow set 1
    _.set(vehicle, 'tempID', uuidv4());
};

export const populateNCDProtectionForUpdate = (vehicle) => {
    const drivingExperience = _.get(vehicle, 'ncdProtection.drivingExperience', {});
    _.set(vehicle, 'ncdProtection.drivingExperience', {
        protectNCD: _.get(vehicle, 'ncdProtection.drivingExperience.protectNCD', ''),
        // these cannot be empty strings
        drivingExperienceYears: drivingExperience.drivingExperienceYears ? drivingExperience.drivingExperienceYears : DEFAULTS.DRIVING_EXPIRIENCE_YEARS,
        drivingExperienceType: drivingExperience.drivingExperienceType ? drivingExperience.drivingExperienceType : DEFAULTS.DRIVING_EXPIRIENCE_TYPE,
        drivingExperienceFlag: drivingExperience.drivingExperienceFlag ? drivingExperience.drivingExperienceFlag : DEFAULTS.DRIVING_EXPIRIENCE_FLAG
    });
};

export const populateNCDProtection = (vehicle) => {
    const drivingExperience = _.get(vehicle, 'ncdProtection.drivingExperience', {});
    _.set(vehicle, 'ncdProtection', {
        nCDGrantedYears: _.get(vehicle, 'ncdProtection.ncdgrantedYears', DEFAULTS.NCD_GRANTED_YEARS),
        nCDEarnedInUkFlag: DEFAULTS.NCD_EARNED_IN_UK_FLAG,
        nCDSource: DEFAULTS.NCD_SOURCE,
        drivingExperience: {
            protectNCD: _.get(vehicle, 'ncdProtection.drivingExperience.protectNCD', DEFAULTS.PROTECT_NCD),
            // these cannot be empty strings
            drivingExperienceYears: drivingExperience.drivingExperienceYears ? drivingExperience.drivingExperienceYears : DEFAULTS.DRIVING_EXPIRIENCE_YEARS,
            drivingExperienceType: drivingExperience.drivingExperienceType ? drivingExperience.drivingExperienceType : DEFAULTS.DRIVING_EXPIRIENCE_TYPE,
            drivingExperienceFlag: drivingExperience.drivingExperienceFlag ? drivingExperience.drivingExperienceFlag : DEFAULTS.DRIVING_EXPIRIENCE_FLAG,
        }
    });
};

export const populateVehicleDrivers = (coverables, vehicle, drivers) => {
    const vehicleID = _.get(vehicle, 'tempID');
    for (let index = 0; index < drivers.length; index++) {
        _.set(coverables, `vehicleDrivers[${index}].driverTempID`, drivers[index].tempID);
        _.set(coverables, `vehicleDrivers[${index}].vehicleTempID`, vehicleID);
    }
};

export const cleanUpIDs = (dataObject) => {
    const drivers = _.get(dataObject, 'lobData.privateCar.coverables.drivers', []);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', [])) || {};
    const vehicleDrivers = _.get(dataObject, 'lobData.privateCar.coverables.vehicleDrivers', []);

    _.unset(vehicle, 'tempID');
    for (let index = 0; index < drivers.length; index++) {
        _.unset(drivers[index], 'tempID');
        const vehicleDriver = vehicleDrivers[index];
        if (_.get(vehicleDriver, 'driverID')) _.unset(vehicleDriver, 'driverTempID');
        if (_.get(vehicleDriver, 'vehicleID')) _.unset(vehicleDriver, 'vehicleTempID');
        // eslint-disable-next-line no-warning-comments
        // TODO : Need to align vehicle id assignment for multicar
        if (_.get(vehicle, 'fixedId')) _.set(vehicleDriver, 'vehicleID', _.get(vehicle, 'fixedId'));
        if (_.get(vehicle, 'fixedId') && _.get(vehicleDriver, 'vehicleID')) _.unset(vehicleDriver, 'vehicleTempID');
    }
};

export const cleanUpIDsForUpdate = (dataObject) => {
    const drivers = _.get(dataObject, 'lobData.privateCar.coverables.drivers', []);
    const vehicle = _.first(_.get(dataObject, 'lobData.privateCar.coverables.vehicles', [])) || {};
    const vehicleDrivers = _.get(dataObject, 'lobData.privateCar.coverables.vehicleDrivers', []);
    for (let index = 0; index < drivers.length; index++) {
        const vehicleDriver = vehicleDrivers[index];
        if (_.get(vehicleDriver, 'driverID')) _.unset(vehicleDriver, 'driverTempID');
        if (_.get(vehicleDriver, 'vehicleID')) _.unset(vehicleDriver, 'vehicleTempID');
        if (_.get(vehicle, 'fixedId')) _.set(vehicleDriver, 'vehicleID', _.get(vehicle, 'fixedId'));
        if (_.get(vehicle, 'fixedId') && _.get(vehicleDriver, 'vehicleID')) _.unset(vehicleDriver, 'vehicleTempID');
    }
};

export const removeLobData = (dataObj) => {
    _.unset(dataObj, 'lobData');
};

// For checking of hastings error of a single submissionVM.value
export const checkHastingsError = (quote) => {
    const errorObject = { errorMessage: null };
    const offeredQuotes = _.get(quote, 'quoteData.offeredQuotes');
    const hasUWErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
        .filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
    const greyListErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
        .filter((hastingsError) => hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
    const cueErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
        .filter((hastingsError) => hastingsError.technicalErrorCode === CUE_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
    const quoteDecline = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
        .filter((hastingsError) => hastingsError.technicalErrorCode === QUOTE_DECLINE_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
    const quoteUnavailable = quote.baseData.periodStatus !== 'Quoted';
    if (!hasUWErrors && !greyListErrors && !cueErrors && !quoteUnavailable && !quoteDecline) {
        return errorObject;
    }
    if (hasUWErrors) { errorObject.errorCode = UW_ERROR_CODE; }
    if (greyListErrors) { errorObject.errorCode = GREY_LIST_ERROR_CODE; }
    if (cueErrors) { errorObject.errorCode = CUE_ERROR_CODE; }
    if (quoteDecline) { errorObject.errorCode = QUOTE_DECLINE_ERROR_CODE; }
    if (quoteUnavailable) { errorObject.errorCode = 'quoteUnavailable'; }
    return errorObject;
};

export const populateMCDriversWithPersonData = (drivers, policyHolderPersonPublicID, driverSelectedPublicID) => {
    for (let index = 0; index < drivers.length; index++) {
        const driver = drivers[index];
        if (driver.person.publicID === driverSelectedPublicID) {
            _.set(driver, 'isPolicyOwner', false);
            _.set(driver, 'isPolicyHolder', false);
            _.set(driver, 'fixedId', undefined);
            _.set(driver, 'publicID', undefined);
            _.set(driver, 'relationToProposer', undefined);
            _.set(driver, 'dvlaReportedMedCond', DEFAULTS.DVLA_REPORTED_MED_COND); // not setting anywhere // it will be removed from backend as a mandatory
            _.set(driver, 'tempID', uuidv4());
        }
    }
};

export const populateMCAccountHolderDriver = (drivers, accountHolder) => {
    const accountHolderDriver = drivers[0];
    _.set(accountHolderDriver, 'isPolicyOwner', true);
    _.set(accountHolderDriver, 'isPolicyHolder', true);
    _.set(accountHolderDriver, 'fixedId', undefined);
    _.set(accountHolderDriver, 'publicID', undefined);
    _.set(accountHolderDriver, 'relationToProposer', undefined);
    _.set(accountHolder, 'prefix', accountHolderDriver.person.prefix);
    _.set(accountHolderDriver, 'dvlaReportedMedCond', DEFAULTS.DVLA_REPORTED_MED_COND);
    _.set(accountHolderDriver, 'tempID', uuidv4());
};

// returns parent car quoteID
export const getParentQuoteID = (mcsubmissionVM) => {
    for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
        if (mcsubmissionVM.value.quotes[i].isParentPolicy) { return mcsubmissionVM.value.quotes[i].quoteID; }
    }
    return '';
};

// returns first instalment amount in MC (dd scenario)
export const getMonthlyInitialPaymentAmount = (mcsubmissionVM, mcPaymentSchedule) => {
    let initialPaymentDateObj;
    let initialPaymentAmount = 0;
    mcPaymentSchedule.mcPaymentScheduleObject.map((singlePaymentScheduleObj) => {
        if (singlePaymentScheduleObj.submissionID === getParentQuoteID(mcsubmissionVM)) {
            initialPaymentDateObj = singlePaymentScheduleObj.paymentSchedule[0].paymentDate;
        }
        return null;
    });
    mcPaymentSchedule.mcPaymentScheduleObject.map((singlePaymentScheduleObj) => {
        const firstInstalmentDate = singlePaymentScheduleObj.paymentSchedule[0].paymentDate;
        if (initialPaymentDateObj.month === firstInstalmentDate.month && initialPaymentDateObj.day === firstInstalmentDate.day
            && initialPaymentDateObj.year === firstInstalmentDate.year) {
            initialPaymentAmount += singlePaymentScheduleObj.paymentSchedule[0].paymentAmount.amount;
        }
        return null;
    });
    return initialPaymentAmount;
};

// returns pc date
export const getPCStartDate = (mcsubmissionVM) => {
    const pcStartDate = _.get(mcsubmissionVM.value.quotes[0], 'baseData.pccurrentDate', new Date());
    const pcStartDateObject = (pcStartDate) ? new Date(pcStartDate) : new Date();
    pcStartDateObject.setHours(0, 0, 0, 0);
    return pcStartDateObject;
};

// returns today's annually payment amount, MC
export const getAnnuallyInitialPayment = (mcsubmissionVM, multiCustomizeSubmissionVM) => {
    const pcDate = dayjs(getPCStartDate(mcsubmissionVM));
    let initialPaymentAmount = 0;
    multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
        const quoteStartDateObj = customQuoteObj.periodStartDate;
        const quoteStartDate = dayjs(`${_.get(quoteStartDateObj, 'year')}-${1 + _.get(quoteStartDateObj, 'month')}-${_.get(quoteStartDateObj, 'day')}`);
        if (!(quoteStartDate.diff(pcDate, 'day') > 30)) {
            initialPaymentAmount += customQuoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
        }
        return null;
    });
    return initialPaymentAmount;
};

// display months for home renewal
export const availableValuesMonth = [{
    label: 'January',
    value: 'January',
}, {
    label: 'February',
    value: 'February',
}, {
    label: 'March',
    value: 'March',
}, {
    label: 'April',
    value: 'April',
}, {
    label: 'May',
    value: 'May',
}, {
    label: 'June',
    value: 'June',
}, {
    label: 'July',
    value: 'July',
}, {
    label: 'August',
    value: 'August',
}, {
    label: 'September',
    value: 'September',
}, {
    label: 'October',
    value: 'October',
}, {
    label: 'November',
    value: 'November',
}, {
    label: 'December',
    value: 'December',
}];
