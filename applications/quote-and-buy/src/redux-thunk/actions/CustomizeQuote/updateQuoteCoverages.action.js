import _ from 'lodash';
import HDQuoteService from '../../../api/HDQuoteService';
import {
    UPDATE_QUOTE_COVERAGES_SUCCESS,
    UPDATE_QUOTE_COVERAGES_FAIL
} from '../../action.types';
import { setErrorStatusCode } from '../errorStatusCode.action';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
// Hard coded value because all the pages are not completed and it will be removed in future once all the data is available.
// data type needs to be corrected.
const mockQuote = (customSubmission) => {
    const mock = _.cloneDeep(customSubmission);
    _.unset(mock, 'otherOfferedQuotes');
    _.unset(mock, 'baseData');
    return mock;
};

// eslint-disable-next-line import/prefer-default-export
export const updateQuoteCoverages = (customizeSubmissionVM) => (dispatch) => {
    HDQuoteService.updateQuoteCoverages(mockQuote(customizeSubmissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: UPDATE_QUOTE_COVERAGES_SUCCESS,
                payload: result
            });
            trackAPICallSuccess('Update Quote Coverages');
            return result;
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: UPDATE_QUOTE_COVERAGES_FAIL,
                payload: error
            });
            trackAPICallFail('Update Quote Coverages', 'Update Quote Coverages Failed');
        });
};
