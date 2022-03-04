/* eslint-disable no-else-return */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React from 'react';
import _ from 'lodash';
import {
    directRoute, premierRoute, pcwRoute, roadsideRecoveryHomeEuropean, roadside,
    roadsideRecovery, roadsideRecoveryHome, coverageModalHeader, coverAtHome, coverInEurope, roadsideAssistance,
    recoveryAwayFromHomeText, roadsideAndRecovery, noCoverageContent, noCoverageModalHeader,
    misfuelling, ukWideCoverage, youNeed, youDontNeed, roadsideAndRecoveryAtAway,
    recoveryAwayFromHomeLabel, coverAtHomeLabel, coverInEuropeLabel, roadSideAssistanceMoreThan,
    areyouSure, racBreakdownFor, breakDownCoverQuestion, pageTitle, trueString, falseString, yes, no,
    ipidRoadside, ipidRoadsideAndRecovery, ipidHomestart, ipidEuropean
} from '../pages/wizard-pages/HDMCRACBreakDownPage/HDMCRACBreakDownPage.messages';
import formatRegNumber from './formatRegNumber';
import { getAmountAsTwoDecimalDigit } from './premiumFormatHelper';
import { ANCMotorLegalExpensesCovExt } from '../pages/wizard-pages/HDMotorLegalMultiCarPage/HDMotorLegalMultiCarPage.messages';
import {
    mcIPidAncillaryAPIObject
} from './utils';

export const defaultSecondaryHeaderName = ['Already included', '', '', ''];
export const defaultPrimaryHeaderName = [roadside, roadsideRecovery, roadsideRecoveryHome, roadsideRecoveryHomeEuropean];
export const coverageRACValues = [
    {
        rowLabel: (
            <>
                <span className="text-capitalize">{roadsideAssistance}</span>
                <div className="d-sm-inline">{roadSideAssistanceMoreThan}</div>
            </>
        ),
        cells: [{
            value: true
        }, {
            value: true
        }, {
            value: true
        }, {
            value: true
        }]
    },
    {
        rowLabel: ukWideCoverage,
        cells: [{
            value: true
        }, {
            value: true
        },
        {
            value: true
        }, {
            value: true
        }]
    },
    {
        rowLabel: misfuelling,
        cells: [{
            value: true
        }, {
            value: true
        }, {
            value: true
        }, {
            value: true
        }]
    },
    {
        rowLabel: recoveryAwayFromHomeLabel,
        cells: [{
            value: false
        }, {
            value: true
        }, {
            value: true
        }, {
            value: true
        }]
    },
    {
        rowLabel: coverAtHomeLabel,
        cells: [{
            value: false
        }, {
            value: false
        }, {
            value: true
        }, {
            value: true
        }]
    },
    {
        rowLabel: coverInEuropeLabel,
        cells: [{
            value: false
        }, {
            value: false
        }, {
            value: false
        }, {
            value: true
        }]
    }];

export const regularColProps = {
    xs: { span: 12, offset: 0 },
    md: { span: 8, offset: 2 },
    lg: { span: 6, offset: 3 }
};

export const tableColProps = {
    xs: { span: 12, offset: 0 },
    md: { span: 10, offset: 1 },
    lg: { span: 8, offset: 2 }
};

export const availableValues = [{
    value: 'true',
    name: yes
}, {
    value: 'false',
    name: no
}];

export const callIPIDDocumnetAPI = (data, pageID, param) => {
    const mcsubmisionVal = _.get(param.multiCustomizeSubmissionVM, 'value', {});
    const referenceNum = _.get(param.multiCustomizeSubmissionVM, 'value.mpwrapperNumber', '');
    const docParam = mcIPidAncillaryAPIObject(data, mcsubmisionVal, referenceNum);
    return docParam;
};

export const getRACIPIDDownloadParams = (param) => {
    const ipiddata = _.get(param.ancillaryJourneyDataModel, 'ipidsInfo[0].ipids', []);
    let ipidParams = null;
    if (ipiddata.length) {
        ipiddata.forEach((data) => {
            const isAncillaryCode = data.ancillaryCode || '';
            if (isAncillaryCode === ipidRoadside && param.pageid === ipidRoadside) {
                ipidParams = callIPIDDocumnetAPI(data, isAncillaryCode, param);
            }
            if (isAncillaryCode === ipidRoadsideAndRecovery && param.pageid === ipidRoadsideAndRecovery) {
                ipidParams = callIPIDDocumnetAPI(data, isAncillaryCode, param);
            }
            if (isAncillaryCode === ipidHomestart && param.pageid === ipidHomestart) {
                ipidParams = callIPIDDocumnetAPI(data, isAncillaryCode, param);
            }
            if (isAncillaryCode === ipidEuropean && param.pageid === ipidEuropean) {
                ipidParams = callIPIDDocumnetAPI(data, isAncillaryCode, param);
            }
        });
    } else {
        // TODO : Error handeling if documnet is not available
    }
    return ipidParams;
};

export const getIPIDDownloadParams = (param) => {
    const ipiddata = _.get(param.ancillaryJourneyDataModel, 'ipidsInfo[0].ipids', []);
    const mcsubmisionVal = _.get(param.multiCustomizeSubmissionVM, 'value', {});
    const referenceNum = _.get(param.multiCustomizeSubmissionVM, 'value.mpwrapperNumber', '');
    let docParam = null;
    if (ipiddata.length) {
        ipiddata.forEach((data) => {
            const isAncillaryCode = data.ancillaryCode || '';
            if (isAncillaryCode === param.coverExt) {
                docParam = mcIPidAncillaryAPIObject(data, mcsubmisionVal, referenceNum);
            }
        });
    } else {
        // Error handling if documnet is not available
    }
    return docParam;
};

export const getRACHeaderValues = (fromRoute, customizeSubmissionVM) => {
    const finalHeaderArrayObject = [];
    let roadsideAmount = [];
    const ancDataPath = 'coverages.privateCar.ancillaryCoverages';
    const ancData = _.get(customizeSubmissionVM, `${ancDataPath}`);
    ancData.map((coveragesObj) => {
        coveragesObj.coverages.map((coveragesChildObj) => {
            if (coveragesChildObj.publicID === 'ANCBreakdownCov_Ext') {
                coveragesChildObj.terms.map((termsObj) => {
                    roadsideAmount = termsObj.options && termsObj.options.filter((option) => option.name === roadside);
                    termsObj.options.map((optionsObj, index) => {
                        if (fromRoute === premierRoute) {
                            const roadSideBreakdown = roadsideAmount && roadsideAmount[0].amount && roadsideAmount[0].amount.amount;
                            finalHeaderArrayObject.push({ value: defaultPrimaryHeaderName[index], headerLabelValue: index ? `+ £${(optionsObj.amount.amount - roadSideBreakdown).toFixed(2)}` : '', secondaryLabel: defaultSecondaryHeaderName[index] });
                        } else {
                            finalHeaderArrayObject.push({ value: defaultPrimaryHeaderName[index], headerLabelValue: `£${getAmountAsTwoDecimalDigit(optionsObj.amount.amount)}` });
                        }
                    });
                });
            }
        });
    });
    if (!finalHeaderArrayObject.length) {
        switch (fromRoute) {
            case directRoute:
                return [
                    { value: roadside, headerLabelValue: '£34.99' },
                    { value: roadsideRecovery, headerLabelValue: '£59.99' },
                    { value: roadsideRecoveryHome, headerLabelValue: '£89.99' },
                    { value: roadsideRecoveryHomeEuropean, headerLabelValue: '£95.00' }
                ];
            case premierRoute:
                return [
                    { value: roadside, headerLabelValue: '', secondaryLabel: 'Already included' },
                    { value: roadsideRecovery, headerLabelValue: '+ £24.00' },
                    { value: roadsideRecoveryHome, headerLabelValue: '+ £54.00' },
                    { value: roadsideRecoveryHomeEuropean, headerLabelValue: '+ £59.01' }
                ];
            case pcwRoute:
                return [
                    { value: roadside, headerLabelValue: '£34.99' },
                    { value: roadsideRecovery, headerLabelValue: '£59.99' },
                    { value: roadsideRecoveryHome, headerLabelValue: '£89.99' },
                    { value: roadsideRecoveryHomeEuropean, headerLabelValue: '£95.00' }];
            default:
                return [
                    { value: roadside, headerLabelValue: '£34.99' },
                    { value: roadsideRecovery, headerLabelValue: '£59.99' },
                    { value: roadsideRecoveryHome, headerLabelValue: '£89.99' },
                    { value: roadsideRecoveryHomeEuropean, headerLabelValue: '£95.00' }
                ];
        }
    } else {
        return finalHeaderArrayObject;
    }
};

export const getremoveOverlay = () => {
    return {
        modalHeader: areyouSure,
        listItems: []
    };
};

export const getregNumber = (index, mcsubmissionVM, mcObj) => {
    const subVm = mcsubmissionVM.value.quotes.find((submissionVM) => submissionVM.quoteID === mcObj.quoteID);
    let regNum = _.get(subVm, 'lobData.privateCar.coverables.vehicles[0].license', null);
    regNum = formatRegNumber(regNum);
    return regNum || '';
};

export const getbreakdownText = (index, mcsubmissionVM, multiCustomizeSubmissionVM, branchCodePath) => {
    let vehicleName = '';
    const mcsubmissionQuotes = _.get(mcsubmissionVM, 'value.quotes', null);
    const mccustomizeQuotes = _.get(multiCustomizeSubmissionVM, 'value.customQuotes', null);
    const quotePath = mcsubmissionQuotes[index];
    const quoteVehiclePath = _.get(quotePath, 'lobData.privateCar.coverables.vehicles', []);
    quoteVehiclePath.map((vehicle) => {
        vehicleName = `${vehicle.make} ${vehicle.model}`;
    });
    if (_.get(mccustomizeQuotes[index], `${branchCodePath}`) === premierRoute) {
        return `${racBreakdownFor} ${vehicleName}`;
        // eslint-disable-next-line no-else-return
    } else {
        return `${breakDownCoverQuestion} ${vehicleName} ?`;
    }
};

export const checkRACDisplayEligibility = (mcObj, ancillaryJourneyDataModel, indexArray, submissionlength) => {
    let dpBool = false;
    if (ancillaryJourneyDataModel && ancillaryJourneyDataModel.breakdown && ancillaryJourneyDataModel.breakdown.length
        && submissionlength === ancillaryJourneyDataModel.breakdown.length) {
        dpBool = true;
    } else if (indexArray && indexArray.length > 0) {
        indexArray.forEach((indexObj) => {
            if (indexObj.quoteID === mcObj.quoteID) {
                dpBool = true;
            }
        });
    }
    return dpBool;
};

export const displayRACBreakDownToggle = (mcObj, ancillaryJourneyDataModel) => {
    let btn = '';
    const coverTemp = mcObj.producerCode;
    let foundAncillary = [];
    const coveragePath = 'coverages.privateCar.ancillaryCoverages[0].coverages';
    if (_.get(mcObj, coveragePath)) {
        const brandCover = _.get(mcObj, coveragePath);
        foundAncillary = brandCover.filter((item) => {
            return item.name === pageTitle;
        });
    }
    if (ancillaryJourneyDataModel.breakdown.length
        && ancillaryJourneyDataModel.breakdown.find((brk) => brk.quoteID === mcObj.quoteID)) {
        ancillaryJourneyDataModel.breakdown.forEach((mc) => {
            if (mc.quoteID === mcObj.quoteID) {
                if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
                    btn = trueString;
                } else if (foundAncillary && foundAncillary.length && foundAncillary[0].selected === false && mc.breakdown) {
                    btn = falseString;
                }
            }
        });
    } else if (coverTemp !== 'Default' && coverTemp !== 'ClearScore') {
        if (foundAncillary && foundAncillary.length && foundAncillary[0].selected) {
            btn = trueString;
        } else if (foundAncillary && foundAncillary.length && foundAncillary[0].selected === false) {
            btn = null;
        }
    }
    return btn;
};

export const getRACModalContent = (contentPicker) => {
    switch (contentPicker) {
        case roadside:
            return {
                modalHeader: coverageModalHeader,
                listItems: [{
                    item: youNeed + roadsideAssistance,
                },
                {
                    item: youDontNeed + recoveryAwayFromHomeText,
                },
                {
                    item: youDontNeed + coverAtHome,
                },
                {
                    item: youDontNeed + coverInEurope,
                }]
            };
        case roadsideRecovery:
            return {
                modalHeader: coverageModalHeader,
                listItems: [{
                    item: youNeed + roadsideAndRecovery,
                },
                {
                    item: youDontNeed + coverAtHome,
                },
                {
                    item: youDontNeed + coverInEurope,
                }]
            };
        case roadsideRecoveryHome:
            return {
                modalHeader: coverageModalHeader,
                listItems: [{
                    item: youNeed + roadsideAndRecoveryAtAway,
                },
                {
                    item: youDontNeed + coverInEurope,
                }]
            };
        case roadsideRecoveryHomeEuropean:
            return {
                modalHeader: coverageModalHeader,
                listItems: [{
                    item: youNeed + roadsideAndRecoveryAtAway,
                },
                {
                    item: youNeed + coverInEurope,
                }]
            };
        default:
            return {
                modalHeader: noCoverageModalHeader,
                listItems: [{
                    item: noCoverageContent,
                }]
            };
    }
};
