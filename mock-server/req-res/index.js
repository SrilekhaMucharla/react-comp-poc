/* eslint-disable camelcase */
const applyDiscountOnMulticar = require('./applyDiscountOnMulticar.json');
const createQuote = require('./create.json');
const fetchHostedPaymentUrl = require('./fetchHostedPaymentUrl.json');
const fetchOrderCode = require('./fetchOrderCode.json');
const lwrSaveAndQuote = require('./lwrSaveAndQuote.json');
const matchForAll = require('./matchForAll.json');
const multiProductMatchForAll = require('./multiProductMatchForAll.json');
const multiToSingleProduct = require('./multiToSingleProduct.json');
const retrieve = require('./retrieve.json');
const retrieveQuote = require('./retrieveQuote.json');
const retrieveManufacturers = require('./retrieveManufacturers.json');
const retrieveModels = require('./retrieveModels.json');
const retrieveMultiProduct = require('./retrieveMultiProduct.json');
// const retrieveSubmission = require('./retrieveSubmission.json');
const retrieveVehicleDataBasedOnVRN = require('./retrieveVehicleDataBasedOnVRN.json');
const retrireveVehicleData = require('./retrireveVehicleData.json');
const sendEmailNotification = require('./sendEmailNotification.json');
const updateDraftSubmission = require('./updateDraftSubmission.json');
const updateMarketingPreferences = require('./updateMarketingPreferences.json');
const updateMarketingPreferencesForMC = require('./updateMarketingPreferencesForMC.json');
const updateQuote = require('./updateQuote.json');
const validateBankAccount = require('./validateBankAccount.json');
const validateDLN = require('./validateDLN.json');
const lookupAddressByPostCode = require('./lookupAddressByPostCode.json');
const updateQuoteCoverages = require('./updateQuoteCoverages.json');
const updateMultiQuoteCoverages = require('./updateMultiQuoteCoverages.json');
const retrieveNCDData = require('./retrieveNCDData.json');
const retrievePaymentScheduleForMulti = require('./retrievePaymentScheduleForMulti.json');
const bindAndIssue = require('./bindAndIssue.json');
const singleToMultiProduct = require('./singleToMultiProduct.json');
const updateDraftMultiproduct = require('./updateDraftMultiproduct.json');
const updateSelectedVersion = require('./updateSelectedVersion.json');
const updateSelectedVersionForMP = require('./updateSelectedVersionForMP.json');
const multiQuote = require('./multiQuote.json');

module.exports = [
    applyDiscountOnMulticar,
    createQuote,
    fetchHostedPaymentUrl,
    fetchOrderCode,
    lwrSaveAndQuote,
    matchForAll,
    multiProductMatchForAll,
    multiToSingleProduct,
    retrieve,
    retrieveManufacturers,
    retrieveModels,
    retrieveMultiProduct,
    // retrieveSubmission,
    retrieveVehicleDataBasedOnVRN,
    retrireveVehicleData,
    sendEmailNotification,
    updateDraftSubmission,
    updateMarketingPreferences,
    updateMarketingPreferencesForMC,
    updateQuote,
    validateBankAccount,
    lookupAddressByPostCode,
    validateDLN,
    updateQuoteCoverages,
    updateMultiQuoteCoverages,
    retrieveQuote,
    retrieveNCDData,
    retrievePaymentScheduleForMulti,
    bindAndIssue,
    singleToMultiProduct,
    updateDraftMultiproduct,
    updateSelectedVersion,
    updateSelectedVersionForMP,
    multiQuote
];
