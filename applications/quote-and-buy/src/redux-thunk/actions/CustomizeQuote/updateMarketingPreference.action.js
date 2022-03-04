import HDQuoteService from '../../../api/HDQuoteService';
import {
    UPDATE_MARKETING_PREFERENCES_SUCCESS,
    UPDATE_MARKETING_PREFERENCES_FAIL,
    UPDATE_MARKETING_PREFERENCES_START,
    CLEAR_MARKETING_PREFERENCES_DATA
} from '../../action.types';
import { setErrorStatusCode } from '../errorStatusCode.action';
import { getMarketingPreferencesAPI } from '../../../common/utils';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import trackQuoteData from '../../../web-analytics/trackQuoteData';

// eslint-disable-next-line import/prefer-default-export
export const updateMarketingPreference = (submissionVM, translator) => (dispatch) => {
    dispatch({
        type: UPDATE_MARKETING_PREFERENCES_START
    });
    HDQuoteService.updateMarketingPreference(getMarketingPreferencesAPI(submissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: UPDATE_MARKETING_PREFERENCES_SUCCESS,
                payload: result
            });
            trackQuoteData(result, translator);
            trackAPICallSuccess('Update Marketing Preference');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: UPDATE_MARKETING_PREFERENCES_FAIL,
                payload: error
            });
            trackAPICallFail('Update Marketing Preference', 'Update Marketing Preference Failed');
        });
};

export const clearMarketingPreference = () => (dispatch) => {
    dispatch({
        type: CLEAR_MARKETING_PREFERENCES_DATA
    });
};
