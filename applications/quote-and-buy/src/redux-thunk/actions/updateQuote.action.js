/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import HDQuoteService from '../../api/HDQuoteService';
import {
    UPDATE_QUOTE_SUCCESS,
    UPDATE_QUOTE_FAIL,
    UPDATE_QUOTE_START,
    CLEAR_UPDATE_QUOTE
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { setErrorStatusCode } from './errorStatusCode.action';
import { getDataForUpdateQuoteAPICall } from '../../common/submissionMappers';

export const updateQuote = (submissionVM) => (dispatch) => {
    dispatch({
        type: UPDATE_QUOTE_START
    });
    HDQuoteService.updateQuote(getDataForUpdateQuoteAPICall(submissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: UPDATE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Update Quote');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: UPDATE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Update Quote', 'Update Quote Failed');
        });
};
export const clearUpdateQuoteData = () => ({
    type: CLEAR_UPDATE_QUOTE
});
