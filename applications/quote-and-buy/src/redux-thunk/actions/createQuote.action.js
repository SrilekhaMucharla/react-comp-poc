/* eslint-disable import/prefer-default-export */

import _ from 'lodash';
import HDQuoteService from '../../api/HDQuoteService';
import {
    CREATE_QUOTE_SUCCESS,
    CREATE_QUOTE_FAIL,
    CREATE_QUOTE_START,
    CLEAR_LWR_QUOTE
} from '../action.types';
import { setErrorStatusCode } from './errorStatusCode.action';
import { getDataForLWRQuoteAPICall } from '../../common/submissionMappers';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import trackQuoteData from '../../web-analytics/trackQuoteData';

export const createQuote = (submissionVM, translator) => (dispatch) => {
    dispatch({
        type: CREATE_QUOTE_START
    });
    HDQuoteService.createQuote(getDataForLWRQuoteAPICall(submissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: CREATE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Create Quote');
            trackQuoteData(result, translator);
            _.set(submissionVM.value, 'baseData', result.baseData);
            _.set(submissionVM.value, 'lobData', result.lobData);
            _.set(submissionVM.value, 'bindData', result.bindData);
            _.set(submissionVM.value, 'quoteData', result.quoteData);
            _.set(submissionVM.value, 'quoteID', result.quoteID);
            _.set(submissionVM.value, 'sessionUUID', result.sessionUUID);
        }).catch((error) => {
            dispatch(setErrorStatusCode(error && error.error && error.error.data && error.error.data.appErrorCode ? error.error.data.appErrorCode : error.status));
            dispatch({
                type: CREATE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Create Quote', 'Create Quote Failed');
        });
};
export const clearLWRQuoteData = () => ({
    type: CLEAR_LWR_QUOTE
});
