import wizardReducer from '../wizard.reducer';
import submission from '../../../routes/SubmissionVMInitial';

const EXPECTED_INIT_STATE = {
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
        isEditCancelled: false,
        multiCarFlag: false,
        createMultiQuoteFlag: false,
        dipslayAddressAsACard: false,
        ancillaryCoveragesObject: null,
        hideGoBack: false,
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
        isDiscountApplied: false,
        isEditTriggered: false,
        showContinueOnML: false,
        showContinueOnSV: false,
        showContinueOnPAC: false,
        showContinueOnRAC: false,
        driverLicenceDetails: [],
        softSellJourney: false,
        finishEditingEnabled: false,
        isEditQuoteJourneyDriver: false,
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
        vehicleEdited: false
    },
    data: {
        submissionVM: submission,
        mcsubmissionVM: {}
    }
};

describe('wizard reducer', () => {
    test('should return expected initial state', () => {
        expect(wizardReducer(undefined, {})).toEqual(EXPECTED_INIT_STATE);
    });
});
