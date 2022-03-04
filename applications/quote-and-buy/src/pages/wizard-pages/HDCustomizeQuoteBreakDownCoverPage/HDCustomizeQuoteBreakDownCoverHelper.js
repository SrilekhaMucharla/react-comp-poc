/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React from 'react';
import _ from 'lodash';
import {
    howDoesCoverWork, howDoesCoverWorkAnswer, whatIsCover, whatIsCoverAnswer,
    whatIsCoverSecondaryAnswer, directRoute, premierRoute, pcwRoute, roadsideRecoveryHomeEuropean, roadside,
    roadsideRecovery, roadsideRecoveryHome, coverageModalHeader, coverAtHome, coverInEurope, roadsideAssistance,
    recoveryAwayFromHomeText, roadsideAndRecovery, noCoverageContent, noCoverageModalHeader,
    misfuelling, ukWideCoverage, youNeed, youDontNeed, roadsideAndRecoveryAtAway,
    recoveryAwayFromHomeLabel, coverAtHomeLabel, coverInEuropeLabel, roadSideAssistanceMoreThan
} from './HDCustomizeQuoteBreakDownCoverPage.messages';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';

export const defaultPrimaryHeaderName = [roadside, roadsideRecovery, roadsideRecoveryHome, roadsideRecoveryHomeEuropean];
export const defaultSecondaryHeaderName = ['Already included', '', '', ''];
export const getOverlayQuestionAnswer = [
    { question: whatIsCover, answer: whatIsCoverAnswer, secondaryAnswer: whatIsCoverSecondaryAnswer },
    { question: howDoesCoverWork, answer: howDoesCoverWorkAnswer }
];
export const coverageValues = [
    {
        rowLabel: (
            <>
                <span className="d-inline-block capitalized-first-letter">{roadsideAssistance}</span>
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
export const getHeaderValues = (fromRoute, customizeSubmissionVM) => {
    const finalHeaderArrayObject = [];
    let roadsideAmount = [];
    const ancDataPath = 'coverages.privateCar.ancillaryCoverages';
    const ancData = _.get(customizeSubmissionVM, `${ancDataPath}.value`);
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
export const getModalContent = (contentPicker) => {
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
