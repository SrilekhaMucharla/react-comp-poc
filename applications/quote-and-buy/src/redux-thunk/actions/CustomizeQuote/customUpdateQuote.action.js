/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import HDQuoteService from '../../../api/HDQuoteService';
import {
    CUSTOM_UPDATE_QUOTE_START,
    CUSTOM_UPDATE_QUOTE_SUCCESS,
    CUSTOM_UPDATE_QUOTE_FAIL
} from '../../action.types';
import { setErrorStatusCode } from '../errorStatusCode.action';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
// Hard coded value because all the pages are not completed and it will be removed in future once all the data is available.
// data type needs to be corrected.
const mockQuote = (customSubmission, vehicle) => {
    const mock = _.cloneDeep(customSubmission);
    if (vehicle) _.set(mock, 'vehicleSpecification', vehicle);
    _.unset(mock, 'otherOfferedQuotes');
    _.unset(mock, 'baseData');
    return mock;
};

export const updateCustomQuote = (CustomizeSubmissionVM, vehicle) => (dispatch) => {
    dispatch({
        type: CUSTOM_UPDATE_QUOTE_START
    });
    HDQuoteService.customUpdateQuote(mockQuote(CustomizeSubmissionVM.value, vehicle))
        .then(({ result }) => {
            dispatch({
                type: CUSTOM_UPDATE_QUOTE_SUCCESS,
                payload: {
                    quoteObj: result
                }
            });
            trackAPICallSuccess('Custom Update Quote');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: CUSTOM_UPDATE_QUOTE_FAIL,
                payload: error
            });
            trackAPICallFail('Custom Update Quote', 'Custom Update Quote Failed');
        });
};
