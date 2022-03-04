/* eslint-disable import/prefer-default-export */
import HDQuoteService from '../../api/HDQuoteService';
import {
    UPDATE_MULTI_QUOTE_SUCCESS,
    UPDATE_MULTI_QUOTE_FAIL,
    UPDATE_MULTI_QUOTE_START,
    UPDATE_MULTI_QUOTE_CLEAR
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { getDataForUpdateMultiQuoteAPICall } from '../../common/submissionMappers';
import { setErrorStatusCode } from './errorStatusCode.action';

export const updateMultiQuote = (mcsubmissionVM) => (dispatch) => {
    dispatch({
        type: UPDATE_MULTI_QUOTE_START
    });
    HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: UPDATE_MULTI_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Update Draft MC Quote');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: UPDATE_MULTI_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Update Draft MC Quote', 'Update Draft MC Quote Failed');
        });
};

export const clearUpdateMultiQuoteData = () => ({
    type: UPDATE_MULTI_QUOTE_CLEAR
});
