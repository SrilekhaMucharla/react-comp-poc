import HDQuoteService from '../../api/HDQuoteService';
import { getDataForCreateSubmissionAPICall } from '../../common/submissionMappers';
import {
    SET_NAVIGATION,
    CHANGE_REG_NUMBER,
    SET_SUBMISSION,
    CREATE_SUBMISSION_START,
    CREATE_SUBMISSION_SUCCESS,
    CREATE_SUBMISSION_FAIL,
    SET_CUSTOMIZE_SUBMISSION,
    SET_MC_SUBMISSION,
    SET_MULTI_CUSTOMIZE_SUBMISSION,
    SET_UPDATE_DDI,
    SET_WIZARD_PAGES_STATE,
    INCREMENT_CURRENT_PAGE_INDEX,
    DECREMENT_CURRENT_PAGE_INDEX,
    RESET_CURRENT_PAGE_INDEX,
    CREATE_SUBMISSION_CLEAR,
    SET_ADDRESS_DISPLAY
} from '../action.types';
import { setErrorStatusCode } from './errorStatusCode.action';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';

export const setNavigation = (navigation) => ({
    type: SET_NAVIGATION,
    payload: navigation
});

export const setWizardPagesState = (wizardState) => ({
    type: SET_WIZARD_PAGES_STATE,
    payload: wizardState
});

export const changeRegNumber = (regNumber) => ({
    type: CHANGE_REG_NUMBER,
    payload: regNumber
});


export const setSubmission = (submission) => ({
    type: SET_SUBMISSION,
    payload: submission
});

export const setMultiCarSubmissionVM = (mcsubmission) => ({
    type: SET_MC_SUBMISSION,
    payload: mcsubmission
});

export const setSubmissionVM = (submission) => {
    return (dispatch) => {
        dispatch(setSubmission(submission));
    };
};

export const setCustomizeSubmissionVM = (submission) => ({
    type: SET_CUSTOMIZE_SUBMISSION,
    payload: submission
});

export const setUpdateDDIVM = (submission) => ({
    type: SET_UPDATE_DDI,
    payload: submission
});
export const setMultiCustomizeSubmissionVM = (submission) => ({
    type: SET_MULTI_CUSTOMIZE_SUBMISSION,
    payload: submission
});

export const createSubmission = (submissionVM) => (dispatch) => {
    dispatch({
        type: CREATE_SUBMISSION_START
    });
    HDQuoteService.createSubmission(getDataForCreateSubmissionAPICall(submissionVM.value))
        .then(({ result }) => {
            dispatch({
                type: CREATE_SUBMISSION_SUCCESS,
                payload: {
                    quoteID: result.quoteID,
                    sessionUUID: result.sessionUUID,
                    submissionObject: result
                }
            });
            trackAPICallSuccess('Create Submission');
        }).catch((error) => {
            dispatch(setErrorStatusCode(error.status));
            dispatch({
                type: CREATE_SUBMISSION_FAIL,
                payload: {
                    error: error
                }
            });
            trackAPICallFail('Create Submission', 'Create Submission Failed');
        });
};
export const incrementCurrentPageIndex = () => (
    {
        type: INCREMENT_CURRENT_PAGE_INDEX
    }
);

export const decrementCurrentPageIndex = () => (
    {
        type: DECREMENT_CURRENT_PAGE_INDEX
    }
);

export const resetCurrentPageIndex = () => (
    {
        type: RESET_CURRENT_PAGE_INDEX
    }
);

export const clearCreatedSubmission = () => (
    {
        type: CREATE_SUBMISSION_CLEAR
    }
);

export const setAddressDisplay = (displayAsACard) => ({
    type: SET_ADDRESS_DISPLAY,
    payload: displayAsACard
});
