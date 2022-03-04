/* eslint-disable no-plusplus */
import _, { isArray } from 'lodash';
// eslint-disable-next-line import/no-unresolved
import { deployment } from 'app-config';
import fuelTypes from '../constant/fuelTypes';
import { getAmountAsTwoDecimalDigit } from './premiumFormatHelper';
// eslint-disable-next-line import/no-unresolved
import {
    UW_ERROR_CODE,
    GREY_LIST_ERROR_CODE,
    CUE_ERROR_CODE,
    QUOTE_DECLINE_ERROR_CODE,
    currencyShortToSymbol,
    HASTINGS_DIRECT,
    HASTINGS_ESSENTIAL,
    HASTINGS_PREMIER
} from '../constant/const';


const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE];
export const PAYMENT_TYPE_ANNUALLY_CODE = '1';
export const PAYMENT_TYPE_MONTHLY_CODE = '3';
export const payAnnuallyHeader = 'Pay in full';
export const payMonthlyHeader = 'Pay monthly';
export const payAnnuallyHeaderForMulticar = (mcsubmissionVM) => `Total price for ${mcsubmissionVM.value.quotes.length} cars\nPay in full`;
export const payMonthlyHeaderForMulticar = (mcsubmissionVM) => `Total amount for ${mcsubmissionVM.value.quotes.length} cars\nPay monthly`;

let alarmImmobilizerDefaultValue;

export const getAmount = (paymentType, annualAmount, monthlyAmount) => {
    const data = (paymentType === PAYMENT_TYPE_ANNUALLY_CODE)
        ? {
            price: annualAmount || 0,
            text: payAnnuallyHeader,
            currency: '£'
        }
        : {
            prefix: '11 x',
            price: monthlyAmount || 0,
            text: payMonthlyHeader,
            currency: '£'
        };
    return data;
};

export const getMCAmount = (paymentType, annualAmount, monthlyAmount, mcsubmissionVM) => {
    const data = (paymentType === PAYMENT_TYPE_ANNUALLY_CODE)
        ? {
            price: annualAmount || 0,
            text: payAnnuallyHeaderForMulticar(mcsubmissionVM),
            currency: '£'
        }
        : {
            prefix: '11 x',
            price: monthlyAmount || 0,
            text: payMonthlyHeaderForMulticar(mcsubmissionVM),
            currency: '£'
        };
    return data;
};

// check browser
export const isSafariAndiOS = () => {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    const iOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document)) && !window.MSStream;

    return isSafari && iOS;
};


export const generateDownloadableLink = (docParam, ancCode) => {
    return `${deployment.url}/download/${ancCode}/${docParam.documentUUID}/${docParam.referenceNumber}/${docParam.sessionUUID}`;
};

// get the bytes
export const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
};

// download the files
export const saveByteArray = (reportName, byte) => {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    link.download = fileName;
    link.click();
};

// API object to fetch the all the document by product code
export const iPidMatchForAllAPIObject = (submissionVM, customizeSubmissionVM) => {
    const ipidObject = {
        product: _.get(submissionVM, 'value.baseData.productCode'),
        brand: _.get(customizeSubmissionVM, 'value.quote.branchCode'),
        inceptionDate: _.get(customizeSubmissionVM, 'value.periodStartDate'),
        vehicleCoverType: _.get(customizeSubmissionVM, 'value.coverType')
    };
    return ipidObject;
};

// API object to fetch the all the document by product code
export const mcIpidMatchForAllAPIObject = (customMultiQuoteData) => {
    const ipidVariants = [];
    const customizeQuotesArray = _.get(customMultiQuoteData, 'value.quotes', []);
    customizeQuotesArray.forEach((quoteObj) => {
        const jobNumber = quoteObj.quoteID;
        let vehicleCoverType = '';
        quoteObj.lobData.privateCar.coverables.vehicles.forEach((vehicle) => {
            if (vehicle.coverType) {
                vehicleCoverType = vehicle.coverType;
            }
        });
        const inceptionDate = quoteObj.baseData.periodEndDate;
        const brand = quoteObj.baseData.brandCode;
        const product = quoteObj.baseData.productCode;
        ipidVariants.push({
            product: product,
            brand: brand,
            inceptionDate: inceptionDate,
            vehicleCoverType: vehicleCoverType,
            jobNumber: jobNumber
        });
    });
    const ipidObject = {
        MultiProductIpidVariants: ipidVariants
    };
    return ipidObject;
};

// API object to fetch the document by UUID
export const iPidAncillaryAPIObject = (data, customizeSubmissionVM) => {
    const docParam = {
        documentUUID: data.uuid, // if we have to remove object string(ex: {some UUID}) -- data.uuid.substring(1, data.uuid.length - 1),
        referenceNumber: _.get(customizeSubmissionVM, 'value.quoteID'),
        sessionUUID: _.get(customizeSubmissionVM, 'value.sessionUUID')
    };
    return docParam;
};

export const mcIPidAncillaryAPIObject = (data, customizeSubmissionVM, referenceNum) => {
    const docParam = {
        documentUUID: data.uuid, // if we have to remove object string(ex: {some UUID}) -- data.uuid.substring(1, data.uuid.length - 1),
        referenceNumber: referenceNum,
        sessionUUID: _.get(customizeSubmissionVM, 'sessionUUID')
    };
    return docParam;
};

// API object to update the marketing preferences and contact details
export const getMarketingPreferencesAPI = (submissionVM) => {
    const paramObject = {
        sessionUUID: submissionVM.sessionUUID,
        quoteNumber: submissionVM.quoteID,
        accountNumber: submissionVM.baseData.accountNumber,
        brand: submissionVM.baseData.brandCode,
        cellNumber: submissionVM.baseData.accountHolder.cellNumber,
        emailAddress1: submissionVM.baseData.accountHolder.emailAddress1,
        marketingContacts: submissionVM.baseData.marketingContacts
    };
    return paramObject;
};

export const getMCMarketingPreferencesAPI = (mcsubmissionVM, currentPageIndex) => {
    const driversList = mcsubmissionVM.value.quotes[currentPageIndex].lobData.privateCar.coverables.drivers;
    let idx = 0;
    driversList.forEach((element, index) => {
        if (currentPageIndex === 0 && element.person && element.person.accountHolder) {
            idx = index;
        } else if (currentPageIndex > 0 && element.isPolicyHolder) {
            idx = index;
        }
    });
    const paramObject = {
        sessionUUID: mcsubmissionVM.value.sessionUUID,
        quoteNumber: mcsubmissionVM.value.quotes[currentPageIndex].quoteID,
        accountNumber: mcsubmissionVM.value.accountNumber,
        brand: mcsubmissionVM.value.quotes[currentPageIndex].baseData.brandCode,
        cellNumber: mcsubmissionVM.value.quotes[currentPageIndex].lobData.privateCar.coverables.drivers[idx].person.cellNumber,
        emailAddress1: mcsubmissionVM.value.quotes[currentPageIndex].lobData.privateCar.coverables.drivers[idx].person.emailAddress1,
        marketingContacts: {
            allowEmail: mcsubmissionVM.value.quotes[currentPageIndex].baseData.marketingContacts.allowEmail,
            allowTelephone: mcsubmissionVM.value.quotes[currentPageIndex].baseData.marketingContacts.allowTelephone,
            allowSMS: mcsubmissionVM.value.quotes[currentPageIndex].baseData.marketingContacts.allowSMS,
            allowPost: mcsubmissionVM.value.quotes[currentPageIndex].baseData.marketingContacts.allowPost
        }
    };
    return paramObject;
};

// API object to update the Bind and issue
export const getBindAndIssueAPIObject = (submissionVM, paymentdetailsinfoDto, bindAndIssueData, amount, paymentFrequency) => {
    _.set(paymentdetailsinfoDto, 'orderCode', bindAndIssueData.orderCode);
    _.set(paymentdetailsinfoDto, 'merchantCode', bindAndIssueData.merchantCode);
    _.set(paymentdetailsinfoDto, 'depositCollected', amount);
    _.set(paymentdetailsinfoDto, 'cardType', 'debitcard');
    _.set(paymentdetailsinfoDto, 'paymentMethod', paymentFrequency);
    _.set(paymentdetailsinfoDto, 'completionCode', _.get(submissionVM, 'baseData.producerCode.value', 'completed'));
    _.set(submissionVM, 'bindData.paymentDetailsInfo.value', paymentdetailsinfoDto.value);
    _.set(submissionVM, 'bindData.contactPhone', _.get(submissionVM, 'baseData.accountHolder.cellNumber.value', null));
    return submissionVM;
};

export const setVehicleDetailsInCustomizeQuote = (vehicledata, regNO, submissionVM) => {
    const alarmImmobilizersList = _.head(
        _.head(submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            .alarmImmobilizer
            .aspects
            .availableValues)
            .typelist
            .filters
            .filter((el) => el.name === 'PrivateCar_Ext')
    )
        .codes
        .map((element) => ({
            value: element.code,
            label: {
                id: element.name,
                defaultMessage: element.name
            },
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    alarmImmobilizerDefaultValue = _.head(alarmImmobilizersList.filter((el) => el.value === '93'));
    alarmImmobilizerDefaultValue = alarmImmobilizerDefaultValue.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const drivingSides = submissionVM.lobData.privateCar.coverables.vehicles.children[0]
        .drivingSide
        .aspects
        .availableValues
        .map((element) => ({
            value: element.code,
            label: {
                id: element.name,
                defaultMessage: element.name
            }
        }));

    let drivingSideDefaultValue = _.head(drivingSides.filter((el) => el.value === 'R'));
    drivingSideDefaultValue = drivingSideDefaultValue.value;
    const vehicleData = vehicledata.result;
    vehicleData.drivingSide = drivingSideDefaultValue;
    vehicleData.alarmImmobilizer = alarmImmobilizerDefaultValue;
    vehicleData.importType = vehicleData.imported ? 'yes_uk_import' : 'no';
    vehicleData.registrationsNumber = vehicleData.regNo || regNO;
    vehicleData.yearManufactured = vehicleData.year;
    vehicleData.bodyType = vehicleData.bodyType;
    vehicleData.transmission = (vehicleData.transmission && vehicleData.transmission.toLowerCase() === 'automatic') ? '001' : '002';
    vehicleData.numberOfSeats = vehicleData.numberOfSeats ? vehicleData.numberOfSeats : 5;
    vehicleData.numberOfSeats += '';
    delete vehicleData.imported; // Removing and remapping variables from API with viewmodel
    delete vehicleData.regNo; // Removing and remapping variables from API with viewmodel
    const fuelObject = vehicleData ? _.head(fuelTypes.filter((el) => el.value === vehicleData.fuelType)) : '';
    vehicleData.fuelType = fuelObject ? fuelObject.label : vehicleData.fuelType;
    const vehicle = _.get(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0]').value;
    const newVehicle = { ...vehicle, ...vehicleData };
    return newVehicle;
};

export const isDateBeforeInception = (date) => {
    const inceptionDate = new Date(date.year, date.month, date.day);
    return new Date(inceptionDate.toDateString()) < new Date(new Date().toDateString());
};

// Check error in mcsubmissionVM
export const getMCError = (mcsubmissionVM) => {
    const errorObject = {
        parentError: false,
        errorCode: null
    };
    for (let index = 0; index < mcsubmissionVM.value.quotes.length; index++) {
        const offeredQuotes = _.get(mcsubmissionVM.value.quotes[index], 'quoteData.offeredQuotes', []);
        const hasUWErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
            .filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
        const greyListErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
            .filter((hastingsError) => hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
        const cueErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
            .filter((hastingsError) => hastingsError.technicalErrorCode === CUE_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
        const quoteDecline = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
            .filter((hastingsError) => hastingsError.technicalErrorCode === QUOTE_DECLINE_ERROR_CODE)).length > 0)).length === offeredQuotes.length;
        if (hasUWErrors || greyListErrors || cueErrors || quoteDecline) {
            if (hasUWErrors) {
                errorObject.errorCode = UW_ERROR_CODE;
            } else if (greyListErrors) {
                errorObject.errorCode = GREY_LIST_ERROR_CODE;
            } else if (cueErrors) {
                errorObject.errorCode = CUE_ERROR_CODE;
            } else {
                errorObject.errorCode = QUOTE_DECLINE_ERROR_CODE;
            }
            if (mcsubmissionVM.value.quotes[index].isParentPolicy) {
                errorObject.parentError = true;
                break;
            }
        }
    }
    return errorObject;
};

export const getNumberAsString = (number) => {
    switch (number) {
        case 1: return 'one';
        case 2: return 'two';
        case 3: return 'three';
        case 4: return 'four';
        case 5: return 'five';
        default: return '';
    }
};

export const displayHeaderMassage = (msg, quoteLength) => {
    switch (quoteLength) {
        case 0:
            return msg;
        case 1:
            return msg.replace('first', 'second');
        case 2:
            return msg.replace('first', 'third');
        case 3:
            return msg.replace('first', 'fourth');
        case 4:
            return msg.replace('first', 'fifth');
        default:
            return msg;
    }
};

export const getMultiToSingleParam = (mcsubmissionVM) => {
    const mock = _.cloneDeep(mcsubmissionVM.value);
    const drivingExperiencePath = 'lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience';
    mock.quotes = mock.quotes.filter((quote) => {
        const drivingExperienceObject = quote.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience;
        if (quote.isParentPolicy && drivingExperienceObject.drivingExperienceYears === '') {
            _.set(quote, `${drivingExperiencePath}.drivingExperienceYears`, null);
        }
        if (quote.isParentPolicy && drivingExperienceObject.drivingExperienceType === '') {
            _.set(quote, `${drivingExperiencePath}.drivingExperienceType`, null);
        }
        if (quote.isParentPolicy && drivingExperienceObject.drivingExperienceFlag === '') {
            _.set(quote, `${drivingExperiencePath}.drivingExperienceFlag`, null);
        }
        if (quote.isParentPolicy && quote.baseData.periodStatus === 'Quoted') {
            _.unset(quote, 'bindData');
            _.unset(quote, 'quoteData');
            _.unset(quote.lobData.privateCar, 'offerings');
        }
        return quote.isParentPolicy;
    });
    return {
        accountHolder: mock.accountHolder,
        accountNumber: mock.accountNumber,
        quotes: mock.quotes,
        mpwrapperJobNumber: mock.mpwrapperJobNumber,
        mpwrapperNumber: mock.mpwrapperNumber,
        sessionUUID: mock.sessionUUID
    };
};

export const getPriceWithCurrencySymbol = ({ amount, currency }) => (`${currencyShortToSymbol[currency]}${getAmountAsTwoDecimalDigit(amount)}`);

export const sumFloats = (first, second) => {
    return (first * 100 + second * 100) / 100;
};

export const subtractFloats = (first, second) => {
    return (first * 100 - second * 100) / 100;
};

// API object to update the marketing preferences and contact details
export const getUpdateSelectedVersionForMPAPI = (submissionVM, mcsubmissionVM, selectedBrandName) => {
    const mock = _.cloneDeep(mcsubmissionVM.value);
    const param = {
        sessionUUID: mock.sessionUUID,
        quoteID: submissionVM.value.quoteID,
        branch: selectedBrandName
    };
    return param;
};

export const returnAncillaryCoveragesObject = (customizeSubmissionVM) => {
    if (customizeSubmissionVM && _.get(customizeSubmissionVM, 'quoteID') !== undefined) {
        const ancillaryCoveragesObject = _.cloneDeep(customizeSubmissionVM.coverages.privateCar.ancillaryCoverages[0].coverages);
        return ancillaryCoveragesObject ? ancillaryCoveragesObject.filter((anc) => anc.selected) : [];
    }
};

export const isHigherBrandsAvailable = (currentBrand, customizeSubmissionVM, submissionVM) => {
    let offeredQuotes;
    const otherOffferedQuotesPath = 'value.otherOfferedQuotes';
    const quotePath = 'value.quote';
    const offeredQuotesPath = 'quoteData.offeredQuotes.value';
    const otherOfferedQuotes = _.get(customizeSubmissionVM, otherOffferedQuotesPath);
    if (_.isArray(otherOfferedQuotes) && otherOfferedQuotes[0].offeredQuote) {
        const selectedQuote = _.get(customizeSubmissionVM, quotePath);
        offeredQuotes = [...otherOfferedQuotes.map((q) => q.offeredQuote), (selectedQuote.offeredQuote || selectedQuote)];
    } else {
        offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
    }
    const brandOrder = [HASTINGS_ESSENTIAL, HASTINGS_DIRECT, HASTINGS_PREMIER];
    const offeredQuotesForUpgrade = offeredQuotes
        .filter((offeredQuoteEntry) => brandOrder.indexOf(offeredQuoteEntry.branchCode) > brandOrder.indexOf(currentBrand));
    return offeredQuotesForUpgrade && !(offeredQuotesForUpgrade.filter((offeredQuote) => (offeredQuote.hastingsErrors
        && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1)))
        .length === offeredQuotesForUpgrade.length);
};

// Multi car: MCSubmission VM : check if all quotes are having PAYMENT_TYPE_MONTHLY_CODE
export const returnIsMonthlyAvailableForMCSubmissionVM = (mcSubmissionVM) => {
    let PaymentTypeVar;
    const mcQuotesArray = _.get(mcSubmissionVM, 'value.quotes', []);
    for (let i = 0; i < mcQuotesArray.length; i++) {
        PaymentTypeVar = mcQuotesArray[i].baseData.affordablePaymentPlan;
        if (mcQuotesArray[i].baseData.affordablePaymentPlan === PAYMENT_TYPE_ANNUALLY_CODE) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return PaymentTypeVar || PAYMENT_TYPE_ANNUALLY_CODE;
};

// Multi car: MC Customize Submission VM : check if all quotes are having PAYMENT_TYPE_MONTHLY_CODE
export const returnIsMonthlyAvailableForMCCustomizeSubmissionVM = (customizeSubmissionVM) => {
    let checkInnerPaymentType;
    for (let i = 0; i < customizeSubmissionVM.value.customQuotes.length; i++) {
        checkInnerPaymentType = customizeSubmissionVM.value.customQuotes[i].insurancePaymentType;
        if (customizeSubmissionVM.value.customQuotes[i].insurancePaymentType === PAYMENT_TYPE_ANNUALLY_CODE) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return checkInnerPaymentType || PAYMENT_TYPE_ANNUALLY_CODE;
};

// Multi car: MC Customize Submission VM : check if all quotes are having monthlyPayment object
export const returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM = (customizeSubmissionVM) => {
    let checkInnerMonthlyPaymentType = {};
    for (let i = 0; i < customizeSubmissionVM.value.customQuotes.length; i++) {
        checkInnerMonthlyPaymentType = _.get(customizeSubmissionVM.value.customQuotes[i], 'quote.hastingsPremium.monthlyPayment', {});
        if (Object.entries(checkInnerMonthlyPaymentType).length === 0) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return Object.entries(checkInnerMonthlyPaymentType).length === 0 ? PAYMENT_TYPE_ANNUALLY_CODE : PAYMENT_TYPE_MONTHLY_CODE;
};

// Multi car: MC Customize Submission VM : check if all quotes are having monthlyPayment object
export const returnIsMonthlyPaymentAvailable = (customizeSubmissionVM) => {
    let checkInnerMonthlyPaymentType = {};
    for (let i = 0; i < customizeSubmissionVM.value.customQuotes.length; i++) {
        checkInnerMonthlyPaymentType = _.get(customizeSubmissionVM.value.customQuotes[i], 'quote.hastingsPremium.monthlyPayment', {});
        if (Object.entries(checkInnerMonthlyPaymentType).length === 0) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return Object.entries(checkInnerMonthlyPaymentType).length === 0;
};

export const checkPCWJourney = (mcsubmissionVM, isPCWJourney) => {
    const vehicleArrayLength = _.get(mcsubmissionVM, 'value.quotes', []);
    if (isPCWJourney && vehicleArrayLength.length >= 2) return true;
    return false;
};

export const createNecessaryDataForMCPaymentScheduleModel = (mcPaymentScheduleModel) => {
    if (isArray(mcPaymentScheduleModel)) {
        for (let i = 0; i < mcPaymentScheduleModel.length; i++) {
            if (mcPaymentScheduleModel[i].paymentSchedule.length === 1) {
                const paymentDate = {
                    year: mcPaymentScheduleModel[i].paymentSchedule[0].paymentDate.year,
                    month: mcPaymentScheduleModel[i].paymentSchedule[0].paymentDate.month + 1,
                    day: mcPaymentScheduleModel[i].paymentSchedule[0].paymentDate.day,
                };
                const paymentAmount = {
                    amount: 0,
                    currency: 'gbp'
                };
                const emptyPaymentSchedule = {
                    paymentDate: paymentDate,
                    paymentAmount: paymentAmount
                };
                _.set(mcPaymentScheduleModel[i], 'paymentSchedule[1]', emptyPaymentSchedule);
            }
        }
    }
    return mcPaymentScheduleModel;
};
