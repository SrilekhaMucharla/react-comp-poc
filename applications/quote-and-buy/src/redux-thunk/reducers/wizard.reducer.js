import { combineReducers } from 'redux';
import {
    CHANGE_REG_NUMBER,
    SET_NAVIGATION,
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
import submission from '../../routes/SubmissionVMInitial';

const INIT_STATE = {
    app: {
        canSkip: false,
        showForward: false,
        canForward: false,
        showBackward: false,
        canBackward: false,
        showWizardTooltip: false,
        wizardTooltip: null,
        callCreateSubmission: false,
        loading: false,
        quoteID: null,
        sessionUUID: null,
        updateQuoteFlag: false,
        updateMultiQuoteFlag: false,
        createSubmissionObject: null,
        submissionErrorObject: null,
        triggerLWRAPICall: false,
        isEditQuoteJourney: false,
        isEditQuoteJourneyDriver: false,
        isEditCancelled: false,
        multiCarFlag: false,
        createMultiQuoteFlag: false,
        dipslayAddressAsACard: false,
        ancillaryCoveragesObject: null,
        currentPageIndex: 0,
        autoUpgradeData: null,
        isAppStartPoint: false,
        isPCWJourney: false,
        pcwName: '',
        breakDownCoverChosen: false,
        pcwLegalChosen: false,
        pcwBreakdownChosen: false,
        chosenAncillaryTerms: null,
        singleToMultiJourney: false,
        fromMCDriverAllocation: false,
        showedNoRegModal: false,
        savingsPageRerateModal: false,
        multicarAddresChanged: false,
        hideGoBack: false,
        isDiscountApplied: false,
        isEditTriggered: false,
        driverLicenceDetails: [],
        showContinueOnML: false,
        showContinueOnSV: false,
        showContinueOnPAC: false,
        showContinueOnRAC: false,
        softSellJourney: false,
        homeMonthRenewal: 'Please select',
        renewalType: 'not_selected',
        renewalMonth: 'not_selected',
        pages: {
            drivers: {
                0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                1: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                2: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                3: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                4: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                5: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
            }
        },
        mcsubmissionVMBeforeEdit: {},
        vehicleEdited: false,
        finishEditingEnabled: false
    },
    data: {
        submissionVM: submission,
        mcsubmissionVM: {}
    }
};

function app(state = INIT_STATE.app, { type, payload }) {
    switch (type) {
        case SET_WIZARD_PAGES_STATE:
            return {
                ...state,
                pages: { ...state.pages, ...payload }
            };
        case SET_NAVIGATION:
            return {
                ...state,
                ...payload
            };
        case CREATE_SUBMISSION_START:
            return {
                ...state,
                loading: true,
                callCreateSubmission: false
            };
        case CREATE_SUBMISSION_SUCCESS:
            return {
                ...state,
                quoteID: payload.quoteID,
                sessionUUID: payload.sessionUUID,
                createSubmissionObject: payload.submissionObject,
                submissionErrorObject: null,
                loading: false,
                callCreateSubmission: false
            };
        case CREATE_SUBMISSION_FAIL:
            return {
                ...state,
                submissionErrorObject: payload.error,
                loading: false,
                callCreateSubmission: false
            };
        case INCREMENT_CURRENT_PAGE_INDEX:
            return {
                ...state,
                currentPageIndex: state.currentPageIndex + 1
            };
        case DECREMENT_CURRENT_PAGE_INDEX:
            return {
                ...state,
                currentPageIndex: state.currentPageIndex - 1
            };
        case RESET_CURRENT_PAGE_INDEX:
            return {
                ...state,
                currentPageIndex: 0
            };
        case CREATE_SUBMISSION_CLEAR:
            return {
                ...state,
                quoteID: null,
                sessionUUID: null,
                createSubmissionObject: null,
                submissionErrorObject: null,
                loading: false,
                callCreateSubmission: false
            };
        case SET_ADDRESS_DISPLAY:
            return {
                ...state,
                dipslayAddressAsACard: payload
            };
        default:
            return state;
    }
}

function data(state = INIT_STATE.data, { type, payload }) {
    switch (type) {
        case CHANGE_REG_NUMBER:
            return {
                ...state,
                regNumber: payload
            };
        case SET_SUBMISSION:
            return {
                ...state,
                submissionVM: payload.submissionVM,
            };
        case SET_MC_SUBMISSION:
            return {
                ...state,
                mcsubmissionVM: payload.mcsubmissionVM,
            };
        case SET_CUSTOMIZE_SUBMISSION:
            return {
                ...state,
                customizeSubmissionVM: payload.customizeSubmissionVM,
            };
        case SET_MULTI_CUSTOMIZE_SUBMISSION:
            return {
                ...state,
                multiCustomizeSubmissionVM: payload.multiCustomizeSubmissionVM
            };
        case SET_UPDATE_DDI:
            return {
                ...state,
                updateDDIVM: payload.updateDDIVM,
            };
        default:
            return state;
    }
}

export default combineReducers(
    {
        app,
        data
    }
);
