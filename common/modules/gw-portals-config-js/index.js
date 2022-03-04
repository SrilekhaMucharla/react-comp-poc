const _ = require('lodash');
// since this module is used

const TRANSACTIONS_MAP = {
    fnol: ['claims', 'fnol'],
    policychange: ['policychange', 'endorsement'],
    quote: ['quoteandbind', 'quote'],
    renewal: ['renewal', 'policyrenewal']
};

const COMMON_LOB = 'common';
const ALL_LOBS_PLACEHOLDER = '__ALL_LOBS__';

const LOBS_MAP = {
    bop: ['bop', 'BusinessOwners', 'BusinessOwnersLine', 'BOPLine'],
    ca: ['ca', 'CommercialAuto', 'BusinessAuto', 'BusinessAutoLine'],
    cp: ['cp', 'CommercialProperty', 'CommercialPropertyLine', 'CPLine'],
    cpkg: ['cpkg', 'CommercialPackageLine', 'CommercialPackage'],
    gl: ['gl', 'GeneralLiability', 'GeneralLiabilityLine', 'GLLine'],
    ho: ['ho', 'Homeowners', 'HomeownersLine_HOE', 'HOPHomeowners', 'HOPLine', 'HOLine', 'pr'],
    im: ['im', 'InlandMarine', 'InlandMarineLine', 'IMLine'],
    pa: ['pa', 'PersonalAuto', 'PersonalAutoLine', 'auto_per', 'auto'],
    wc7: ['wc7', 'WC7WorkersComp', 'WC7Line', 'WC7WorkersCompLine', 'Workers\' Compensation (v7)'],
    wc: ['wc', 'WorkersComp', 'WorkersCompLine', 'Workers\' compensation']
};

const keyAndValuesToEntries = ([key, arr]) => arr.map((el) => [_.toLower(el), key]);

function reverseLookupMap(obj) {
    const lookupMap = _(obj)
        .toPairs()
        .flatMap(keyAndValuesToEntries)
        .fromPairs()
        .value();
    return lookupMap;
}


// this contains the lookup from transaction name in the package to the normalized transaction name
/*
 * e.g.
 * {
 *   quoteandbind: "quote",
 *   policyrenewal: "renewal",
 *   endorsement: "policychange"
 * }
 */
const transactionLookupMap = reverseLookupMap(TRANSACTIONS_MAP);

function getNormalizedTransactionName(transactionName) {
    const transactionNameLwr = _.toLower(transactionName);
    return transactionLookupMap[transactionNameLwr];
}


const lobLookupMap = reverseLookupMap(LOBS_MAP);

function getNormalizedLOBName(productName) {
    const productNameLwr = _.toLower(productName);
    return lobLookupMap[productNameLwr];
}

function isValidTransaction(transactionName) {
    return !!getNormalizedTransactionName(transactionName);
}

function getEnabledLobsForCapability(capabilityName, allowedCapabilities) {
    // enabled can be undefined, true, false, an array [empty] of strings
    const enabled = allowedCapabilities[capabilityName];
    if (!enabled) {
        return [];
    }
    if (_.isArray(enabled)) {
        return _.uniq([...enabled, COMMON_LOB]);
    }
    // if enabled is true return only the COMMON_LOB
    return [ALL_LOBS_PLACEHOLDER];
}


function isCapabilityEnabled({
    capabilitiesConfig,
    capabilityName,
    lob: inputLob = COMMON_LOB
}) {
    const enabledLobs = getEnabledLobsForCapability(capabilityName, capabilitiesConfig);
    if (_.includes(enabledLobs, ALL_LOBS_PLACEHOLDER)) {
        return true;
    }
    const lob = getNormalizedLOBName(inputLob) || inputLob;
    return _.includes(enabledLobs, lob);
}

module.exports = {
    getNormalizedTransactionName,
    getNormalizedLOBName,
    isValidTransaction,
    isCapabilityEnabled
};
