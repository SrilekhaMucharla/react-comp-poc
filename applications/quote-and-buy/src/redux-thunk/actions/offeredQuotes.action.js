/* eslint-disable import/prefer-default-export */
import {
    OFFERED_QUOTE_DETAILS,
    MULTI_OFFERED_QUOTE_DETAILS
} from '../action.types';

export const setOfferedQuotesDetails = (data) => (
    {
        type: OFFERED_QUOTE_DETAILS,
        payload: data
    }
);

export const setMultiOfferedQuotesDetails = (data) => (
    {
        type: MULTI_OFFERED_QUOTE_DETAILS,
        payload: data
    }
);
