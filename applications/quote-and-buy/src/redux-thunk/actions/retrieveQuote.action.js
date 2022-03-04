/* eslint-disable import/prefer-default-export */
import HDQuoteService from '../../api/HDQuoteService';
import {
    RETRIEVE_QUOTE_SUCCESS,
    RETRIEVE_QUOTE_FAIL,
    RETRIEVE_QUOTE_START,
    CREATE_SUBMISSION_SUCCESS
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { setErrorStatusCode } from './errorStatusCode.action';
import trackQuoteData from '../../web-analytics/trackQuoteData';


export const retrieveQuote = (retrieveIQuoteObject, translator) => (dispatch) => {
    dispatch({
        type: RETRIEVE_QUOTE_START
    });
    HDQuoteService.retrieveQuote(retrieveIQuoteObject)
        .then(({ result }) => {
            dispatch({
                type: RETRIEVE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackQuoteData(result, translator);
            trackAPICallSuccess('Retrieve Quote');
            dispatch({
                type: CREATE_SUBMISSION_SUCCESS,
                payload: {
                    submissionObject: result,
                    quoteID: result.quoteID,
                    sessionUUID: result.sessionUUID,
                }
            });
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: RETRIEVE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Retrieve Quote', 'Retrieve Quote Failed');
        });
};

export const retrieveSubmission = (retrieveIQuoteObject) => (dispatch) => {
    dispatch({
        type: RETRIEVE_QUOTE_START
    });
    HDQuoteService.retrieveSubmission(retrieveIQuoteObject)
        .then(({ result }) => {
            dispatch({
                type: RETRIEVE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Retrieve Submission');
            dispatch({
                type: CREATE_SUBMISSION_SUCCESS,
                payload: {
                    submissionObject: result,
                    quoteID: result.quoteID,
                    sessionUUID: result.sessionUUID,
                }
            });
        }).catch((error) => {
            dispatch({
                type: RETRIEVE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Retrieve Submission', 'Retrieve Submission Failed');
        });
};
