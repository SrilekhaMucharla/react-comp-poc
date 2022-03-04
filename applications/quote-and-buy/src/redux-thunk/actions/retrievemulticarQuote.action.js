/* eslint-disable import/prefer-default-export */
import HDQuoteService from '../../api/HDQuoteService';
import {
    RETRIEVE_MULTICAR_QUOTE_SUCCESS,
    RETRIEVE_MULTICAR_QUOTE_FAIL,
    RETRIEVE_MULTICAR_QUOTE_START
} from '../action.types';
import trackQuoteData from '../../web-analytics/trackQuoteData';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';

export const retrievemulticarQuote = (params, translator) => async (dispatch) => {
    dispatch({
        type: RETRIEVE_MULTICAR_QUOTE_START
    });
    HDQuoteService.retrievemulticarQuote(params)
        .then(({ result }) => {
            dispatch({
                type: RETRIEVE_MULTICAR_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackQuoteData(result, translator);
            trackAPICallSuccess('Retrieve MC Quote');
        }).catch((error) => {
            dispatch({
                type: RETRIEVE_MULTICAR_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Retrieve MC Quote', 'Retrieve MC Quote Failed');
        });
};
