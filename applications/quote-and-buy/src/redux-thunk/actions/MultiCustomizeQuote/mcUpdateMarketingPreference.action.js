import HDQuoteService from '../../../api/HDQuoteService';
import {
    MC_UPDATE_MARKETING_PREFERENCES_SUCCESS,
    MC_UPDATE_MARKETING_PREFERENCES_FAIL,
    MC_UPDATE_MARKETING_PREFERENCES_START,
    MC_CLEAR_MARKETING_PREFERENCES_DATA
} from '../../action.types';
import { setErrorStatusCode } from '../errorStatusCode.action';
import { getMCMarketingPreferencesAPI } from '../../../common/utils';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';

// eslint-disable-next-line import/prefer-default-export
export const mcUpdateMarketingPreference = (submissionVM, index) => (dispatch) => {
    dispatch({
        type: MC_UPDATE_MARKETING_PREFERENCES_START
    });
    HDQuoteService.updateMarketingPreferencesForMC(getMCMarketingPreferencesAPI(submissionVM, index))
        .then(({ result }) => {
            dispatch({
                type: MC_UPDATE_MARKETING_PREFERENCES_SUCCESS,
                payload: result
            });
            trackAPICallSuccess('Update MC Marketing Preferences');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: MC_UPDATE_MARKETING_PREFERENCES_FAIL,
                payload: error
            });
            trackAPICallFail('Update MC Marketing Preferences', 'Update MC Marketing Preferences Failed');
        });
};

export const mcClearMarketingPreference = () => (dispatch) => {
    dispatch({
        type: MC_CLEAR_MARKETING_PREFERENCES_DATA
    });
};
