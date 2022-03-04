/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import HDQuoteService from '../../api/HDQuoteService';
import {
    MULTI_QUOTE_SUCCESS,
    MULTI_QUOTE_FAIL,
    MULTI_QUOTE_START,
    MULTI_TO_SINGLE_QUOTE_START,
    MULTI_TO_SINGLE_QUOTE_SUCCESS,
    MULTI_TO_SINGLE_QUOTE_FAIL,
    CLEAR_MULTI_TO_SINGLE_QUOTE,
    CLEAR_MULTI_QUOTE,
    MULTI_TO_SINGLE_RESET
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { getMultiToSingleParam } from '../../common/utils';
import { setErrorStatusCode } from './errorStatusCode.action';
import trackQuoteData from '../../web-analytics/trackQuoteData';
import { populateNCDProtection, removeMultiCarDataBasedOnPeriodStatus, removeOfferings } from '../../common/submissionMappers/helpers';

export const getDataForMultiQuote = (mcsubmissionVM, removedQuoteID, removeNoRegCars) => {
    const mock = _.cloneDeep(mcsubmissionVM.value);
    mock.quotes.map((quote) => {
        const vehicle = _.first(_.get(quote, 'lobData.privateCar.coverables.vehicles', []));
        // populate NCD for multiQuote API
        populateNCDProtection(vehicle);
        removeMultiCarDataBasedOnPeriodStatus(quote, ['Quoted', 'Draft']);
        removeOfferings(quote);
        if (!_.get(quote, 'isQuoteToBeUpdated', false)) {
            _.set(quote, 'isQuoteToBeUpdated', false);
        }
    });
    if (removedQuoteID !== undefined) {
        mock.quotes = mock.quotes.filter((quote) => {
            return quote.quoteID !== removedQuoteID;
        });
    }
    if (removeNoRegCars) {
        mock.quotes = mock.quotes.filter((quote) => {
            return quote.lobData.privateCar.coverables.vehicles[0].registrationsNumber;
        });
    }
    return mock;
};

export const createParam = (mcsubmissionVM, removedQuoteID, removeNoRegCars) => (dispatch) => {
    dispatch({
        type: MULTI_QUOTE_START
    });
    return getDataForMultiQuote(mcsubmissionVM, removedQuoteID, removeNoRegCars);
};

export const multiQuote = (mcsubmissionVM, removedQuoteID, removeNoRegCars, translator) => (dispatch) => {
    dispatch({
        type: MULTI_QUOTE_START
    });
    HDQuoteService.multiQuote(getDataForMultiQuote(mcsubmissionVM, removedQuoteID, removeNoRegCars))
        .then(({ result }) => {
            dispatch({
                type: MULTI_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackQuoteData(result, translator);
            trackAPICallSuccess('Multi Quote');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error && error.error && error.error.data && error.error.data.appErrorCode ? error.error.data.appErrorCode : error.status));
            dispatch({
                type: MULTI_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Multi Quote', 'Multi Quote Failed');
        });
};

export const multiToSingleQuote = (mcsubmissionVM) => (dispatch) => {
    dispatch({
        type: MULTI_TO_SINGLE_QUOTE_START
    });
    HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
        .then(({ result }) => {
            dispatch({
                type: MULTI_TO_SINGLE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Multi Car to Single Car');
        }).catch((error) => {
            dispatch({
                type: MULTI_TO_SINGLE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Multi Car to Single Car', 'Multi Car to Single Car Failed');
        });
};

export const clearmultiQuoteData = () => ({
    type: CLEAR_MULTI_QUOTE
});

export const clearmultiToSingleQuoteData = () => ({
    type: CLEAR_MULTI_TO_SINGLE_QUOTE
});

// add action to reset multiToSIngle
export const resetMultiToSingleObject = () => (
    {
        type: MULTI_TO_SINGLE_RESET
    }
);
