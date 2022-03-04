/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import HDQuoteService from '../../../api/HDQuoteService';
import {
    MULTI_CUSTOM_UPDATE_QUOTE_START,
    MULTI_CUSTOM_UPDATE_QUOTE_SUCCESS,
    MULTI_CUSTOM_UPDATE_QUOTE_FAIL,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_START,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_SUCCESS,
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_FAIL,
    MULTI_CUSTOM_UPDATE_QUOTE_RESET
} from '../../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { setErrorStatusCode } from '../errorStatusCode.action';
import { PAYMENT_TYPE_ANNUALLY_CODE } from '../../../constant/const';

// Hard coded value because all the pages are not completed and it will be removed in future once all the data is available.
// data type needs to be corrected.
const mockQuote = (customSubmission) => {
    const mock = _.cloneDeep(customSubmission);
    _.unset(mock.customQuotes[0], 'otherOfferedQuotes');
    _.unset(mock.customQuotes[0], 'baseData');
    return mock;
};

// to check if monthlyPayment is available
const checkHastingsPremiumMonthlyPayment = (mock) => {
    let checkMonthlyPaymentType = {};
    for (let i = 0; i < mock.length; i++) {
        checkMonthlyPaymentType = _.get(mock[i], 'quote.hastingsPremium.monthlyPayment', {});
        if (Object.entries(checkMonthlyPaymentType).length === 0) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return Object.entries(checkMonthlyPaymentType).length === 0;
};

// to check if insurancePaymentType is available
const checkInsurancePaymentType = (mock) => {
    let checkPaymentType;
    for (let i = 0; i < mock.length; i++) {
        checkPaymentType = mock[i].insurancePaymentType;
        if (mock[i].insurancePaymentType === PAYMENT_TYPE_ANNUALLY_CODE) {
            break; // breaks the loop after matching the affordability plan
        }
    }
    return checkPaymentType || PAYMENT_TYPE_ANNUALLY_CODE;
};

// if BE is not sending the cover details in case of error code 716
const assignMissingCoverDetails = (obj) => {
    const mock = _.cloneDeep(_.get(obj, 'customQuotesResponses', []));
    mock.forEach((element) => {
        const branchName = _.get(element, 'quote.branchName', null);
        const branchCode = _.get(element, 'quote.branchCode', null);
        if (branchCode === null) _.set(element, 'quote.branchCode', 'HD');
        if (branchName === null) _.set(element, 'quote.branchName', 'Hastings Direct');
        if (checkHastingsPremiumMonthlyPayment(mock)) {
            _.set(element, 'insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
        } else {
            _.set(element, 'insurancePaymentType', checkInsurancePaymentType(mock));
        }
    });
    _.set(obj, 'customQuotesResponses', mock);
    return obj;
};

export const updateMultiCustomQuote = (CustomizeSubmissionVM) => (dispatch) => {
    dispatch({
        type: MULTI_CUSTOM_UPDATE_QUOTE_START
    });
    HDQuoteService.customUpdateMultiQuote(mockQuote(CustomizeSubmissionVM))
        .then(({ result }) => {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: assignMissingCoverDetails(result)
                }
            });
            trackAPICallSuccess('Update MC Quote');
        }).catch((error) => {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_FAIL,
                payload: error
            });
            dispatch(setErrorStatusCode(error.status));
            trackAPICallFail('Update MC Quote', 'Update MC Quote Failed');
        });
};

export const updateMultiCustomQuoteCoverages = (CustomizeSubmissionVM) => (dispatch) => {
    dispatch({
        type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_START
    });
    HDQuoteService.customUpdateMultiQuoteCoverages(mockQuote(CustomizeSubmissionVM))
        .then(({ result }) => {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_SUCCESS,
                payload: {
                    quoteObj: assignMissingCoverDetails(result)
                }
            });
            trackAPICallSuccess('Update MC Quote Coverages');
        }).catch((error) => {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_FAIL,
                payload: error
            });
            dispatch(setErrorStatusCode(error.status));
            trackAPICallFail('Update MC Quote Coverages', 'Update MC Quote Coverages Failed');
        });
};

export const resetMultiCustomUpdateQuote = () => (
    {
        type: MULTI_CUSTOM_UPDATE_QUOTE_RESET
    }
);
