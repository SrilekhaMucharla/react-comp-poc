import _ from 'lodash';
import routes from './RouteConst';
import { VRN_SEARCH_PAGE, CUSTOMIZE_QUOTE_WIZARD, MC_CUSTOMIZE_QUOTE_WIZARD } from '../BaseRouter/RouteConst';
import * as eptica from '../../customer/directintegrations/faq/epticaMapping';
import {
    HDVehicleDetailsPage,
    HDCarLocationPage,
    HDCarMileagePage,
    HDDriverAddressPage,
    HDDriverDOBPage,
    HDDriverEmailPage,
    HDDriverHomeOwnerPage,
    HDDriverLicenceLengthPage,
    HDCompletedCarDetailsPage,
    HDDriverLicenceNumberPage,
    HDDriverLicenceTypePage,
    HDDriverMaritalStatusPage,
    HDDriverNamePage,
    HDPolicyStartDatePage,
    HDPrimaryEmployementInfoPage,
    HDSecondaryEmployementInfoPage,
    HDDriverClaimsPage,
    HDDriverConvictionsPage,
    HDYourQuotesPage,
    HDThanksPage,
    HDCarWorthPage,
    HDTrackerPage,
    HDCarUsagePage,
    HDCarPurchasePage,
    HDDriverScanOrContinuePage,
    HDDriverScanPage,
    HDAddAnotherDriverPage,
    HDQuoteDeclinePage,
    HDTransitionPage,
    HDCoverageTransitionPage,
    HDPromotionalPage,
    HDMultiCarMilestonePage,
    HDMCPolicyStartDatePage,
    HDSavingsPage,
    HDMCQuoteDeclinePage,
    HDMCHeadsUpPage,
    HDMCYourQuotesPage,
    HDMCAddressVerify,
    HDMCDriverHomeOwnership,
    HDMCDriverClaims,
    HDMCCompletedCarDetailsPage,
    HDMCDriverAllocation,
    HDMCPolicyHolderAllocation,
    HDMCDriverAllocationSecondary,
    HDMCQuoteErrorPage,
} from '../../pages/wizard-pages';
import { getQuoteDeclineErrors } from '../../pages/wizard-pages/__helpers__/policyErrorCheck';
import { UW_ERROR_CODE, GREY_LIST_ERROR_CODE } from '../../constant/const';
import { setNavigation } from '../../redux-thunk/actions';
import { YD } from './HDWizard.messages';

export const getWizardConfig = (dispatch) => [
    {
        id: 'HastingsCarDetails',
        WizardPage: HDVehicleDetailsPage,
        path: routes.VEHICLE_DETAILS,
        stepper: 'Details',
        stepperStart: true,
        backward: (_submissionVM, state) => {
            const fromPage = _.get(state, 'fromPage');
            if (fromPage === 'PROMOTION') { return [routes.PROMOTION]; }
            if (fromPage === routes.MC_SAVINGS_PAGE) { return [routes.MC_SAVINGS_PAGE]; }
            return [VRN_SEARCH_PAGE];
        },
        forward: () => [routes.CAR_WORTH],
        epticaId: eptica.VEHICLE_DETAILS_SECURITY_TRACKER,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCarWorth',
        WizardPage: HDCarWorthPage,
        path: routes.CAR_WORTH,
        vehicleRibbon: true,
        stepper: 'Details',
        backward: () => [routes.VEHICLE_DETAILS],
        forward: () => [routes.TRACKER],
        epticaId: eptica.VEHICLE_DETAILS_WORTH,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsTracker',
        WizardPage: HDTrackerPage,
        path: routes.TRACKER,
        stepper: 'Details',
        vehicleRibbon: true,
        backward: () => [routes.CAR_WORTH],
        forward: () => [routes.CAR_PURCHASE],
        epticaId: eptica.VEHICLE_DETAILS_MODIFICATIONS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsLegalOwner',
        WizardPage: HDCarPurchasePage,
        path: routes.CAR_PURCHASE,
        stepper: 'Details',
        vehicleRibbon: true,
        backward: () => [routes.TRACKER],
        forward: () => [routes.CAR_USAGE],
        epticaId: eptica.VEHICLE_DETAILS_PURCHASE_DATE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCarUsage',
        WizardPage: HDCarUsagePage,
        path: routes.CAR_USAGE,
        stepper: 'Details',
        vehicleRibbon: true,
        backward: () => [routes.CAR_PURCHASE],
        forward: () => [routes.MILEAGE],
        epticaId: eptica.VEHICLE_USAGE_GENERIC,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCarMileage',
        WizardPage: HDCarMileagePage,
        path: routes.MILEAGE,
        vehicleRibbon: true,
        stepper: 'Details',
        backward: () => [routes.CAR_USAGE],
        forward: () => [routes.CAR_LOCATION],
        epticaId: eptica.VEHICLE_USAGE_MILEAGE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCarLocation',
        WizardPage: HDCarLocationPage,
        path: routes.CAR_LOCATION,
        vehicleRibbon: true,
        stepper: 'Details',
        backward: () => [routes.MILEAGE],
        forward: (submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney) => {
            if (multiCarFlag) {
                return isEditQuoteJourney ? [routes.MC_MILESTONE] : [routes.MC_CAR_DETAILS];
            }
            return [routes.CAR_DETAILS];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCarDetails_Complete',
        WizardPage: HDCompletedCarDetailsPage,
        path: routes.CAR_DETAILS,
        stepper: 'Details',
        backward: () => [routes.CAR_LOCATION],
        forward: (submissionVM, routerPageContext) => {
            const isVehicleEdit = _.get(routerPageContext, 'isVehicleEdit', false);
            const finishedEdit = _.get(routerPageContext, 'finishedEditing', false);
            const isEdit = _.get(routerPageContext, 'isInEditJourney');
            if (finishedEdit) {
                return getQuoteDeclineErrors(submissionVM) ? [routes.QUOTE_DECLINE] : [routes.YOUR_QUOTES];
            }
            if (isEdit) {
                return [routes.DRIVER_NAME];
            }
            return isVehicleEdit ? [routes.VEHICLE_DETAILS, routerPageContext] : [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsScanOrContinue',
        WizardPage: HDDriverScanOrContinuePage,
        path: routes.DRIVER_SCAN_OR_CONTINUE,
        personalDetails: 'true',
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            if (multiCarFlag && routerPageContext.driverIndex > 0) {
                const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
                if (mcQuote.length) {
                    return [routes.MC_MILESTONE, { driverIndex: 0, removeDriver: true }];
                }
                return [routes.MC_DRIVER_ALLOCATION, { driverIndex: 0, removeDriver: true }];
            }
            if (!multiCarFlag && routerPageContext.driverIndex > 0) {
                return [routes.ADD_ANOTHER_DRIVER, { driverIndex: 0, removeDriver: true }];
            }
            const isAddNewDriver = _.get(routerPageContext, 'addNewDriver', false);
            if (isAddNewDriver) {
                return [routes.MC_POLICY_HOLDER_ALLOCATION];
            }
            return [routes.CAR_DETAILS];
        },
        forward: (_submissionVM, routerPageContext) => [routes.DRIVER_SCAN, routerPageContext],
        skip: (_submissionVM, routerPageContext) => [routes.DRIVER_NAME, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_DRIVING_LICENCE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsScanDrivingLicence',
        WizardPage: HDDriverScanPage,
        path: routes.DRIVER_SCAN,
        personalDetails: 'true',
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext],
        forward: (_submissionVM, routerPageContext) => [routes.DRIVER_NAME, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_DRIVING_LICENCE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails',
        WizardPage: HDDriverNamePage,
        path: routes.DRIVER_NAME,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag) => {
            const isEdit = _.get(routerPageContext, 'isDriverEdit', false);
            if (isEdit && multiCarFlag) {
                if (_.get(routerPageContext, 'fromPage') === routes.MC_DRIVER_ALLOCATION) {
                    return [routes.MC_DRIVER_ALLOCATION, { driverIndex: 0, removeDriver: false }];
                }
                return [routes.MC_MILESTONE, { driverIndex: 0, removeDriver: false }];
            }
            if (isEdit) return [routes.ADD_ANOTHER_DRIVER, { driverIndex: 0, isDriverEdit: false }];
            if (multiCarFlag) return [routes.MC_DRIVER_SCAN_OR_CONTINUE, routerPageContext];
            return [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => {
            return [routes.DRIVER_DOB, routerPageContext];
        },
        epticaId: eptica.YOUR_DETAILS_PERSONAL,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_DOB',
        WizardPage: HDDriverDOBPage,
        path: routes.DRIVER_DOB,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_NAME, routerPageContext],
        forward: (_submissionVM, routerPageContext) => (!routerPageContext.isPolicyHolder
            ? [routes.DRIVER_MARITAL_STATUS, routerPageContext] : [routes.DRIVER_EMAIL, routerPageContext]),
        epticaId: eptica.YOUR_DETAILS_DOB_RESIDENCY,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_Email',
        WizardPage: HDDriverEmailPage,
        path: routes.DRIVER_EMAIL,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_DOB, routerPageContext],
        forward: (_submissionVM, routerPageContext) => {
            const isChildCarPH = _.get(routerPageContext, 'isChildCarPH', false);
            if (isChildCarPH) { return [routes.MC_ADDRESS_VERIFY_CHILD_PH, routerPageContext]; }
            return [routes.DRIVER_ADDRESS, routerPageContext];
        },
        epticaId: eptica.YOUR_DETAILS_EMAIL_VALIDATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_Address',
        WizardPage: HDDriverAddressPage,
        path: routes.DRIVER_ADDRESS,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_EMAIL, routerPageContext],
        forward: (_submissionVM, routerPageContext) => [routes.HOMEOWNER, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_ADDRESS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCPersonalDetails_Address',
        WizardPage: HDMCAddressVerify,
        path: routes.MC_ADDRESS_VERIFY_CHILD_PH,
        personalDetails: true,
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_EMAIL, routerPageContext],
        forward: (submissionVM, routerPageContext) => {
            const chooseAnotherPH = _.get(routerPageContext, 'chooseAnotherPH', false);
            if (chooseAnotherPH) {
                return [routes.MC_POLICY_HOLDER_ALLOCATION];
            }
            return [routes.HOMEOWNER, routerPageContext];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_HomeOwner',
        WizardPage: HDDriverHomeOwnerPage,
        path: routes.HOMEOWNER,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => {
            const isChildCarPH = _.get(routerPageContext, 'isChildCarPH', false);
            if (isChildCarPH) { return [routes.MC_ADDRESS_VERIFY_CHILD_PH, routerPageContext]; }
            return [routes.DRIVER_ADDRESS, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => [routes.DRIVER_MARITAL_STATUS, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_YOUR_HOME,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_MaritalStatus',
        WizardPage: HDDriverMaritalStatusPage,
        path: routes.DRIVER_MARITAL_STATUS,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            return driverIndex > 0 ? [routes.DRIVER_DOB, routerPageContext] : [routes.HOMEOWNER, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => [routes.PRIMARY_EMPLOYMENT, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_FAMILY,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_EmploymentStatus',
        WizardPage: HDPrimaryEmployementInfoPage,
        path: routes.PRIMARY_EMPLOYMENT,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_MARITAL_STATUS, routerPageContext],
        forward: (submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const primaryEmpStatus = _.get(submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].fullEmpStatus.value.code`);
            return primaryEmpStatus === 'U' || primaryEmpStatus === 'N'
                ? [routes.DRIVING_LICENSE_TYPE, routerPageContext] : [routes.SECONDARY_EMPLOYMENT, routerPageContext];
        },
        epticaId: eptica.YOUR_DETAILS_EMPLOYMENT,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_AnotherJob',
        WizardPage: HDSecondaryEmployementInfoPage,
        path: routes.SECONDARY_EMPLOYMENT,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.PRIMARY_EMPLOYMENT, routerPageContext],
        forward: (_submissionVM, routerPageContext) => [routes.DRIVING_LICENSE_TYPE, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_EMPLOYMENT,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_DrivingLicence',
        WizardPage: HDDriverLicenceTypePage,
        path: routes.DRIVING_LICENSE_TYPE,
        stepper: 'Details',
        personalDetails: true,
        backward: (submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const primaryEmpStatus = _.get(submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].fullEmpStatus.value.code`);
            return primaryEmpStatus === 'U' || primaryEmpStatus === 'N'
                ? [routes.PRIMARY_EMPLOYMENT, routerPageContext] : [routes.SECONDARY_EMPLOYMENT, routerPageContext];
        },
        forward: (submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const licenceCode = _.get(submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].licenceType.value.code`);

            // for Full UK, Pass Plus and Microblink scan skip DLN and Length page
            if (['F_FP', 'F_FM'].includes(licenceCode)
                && routerPageContext.drivers[driverIndex].licenceSuccessfulScanned
                && routerPageContext.drivers[driverIndex].licenceSuccessfulValidated
                && !routerPageContext.drivers[driverIndex].licenceDataChanged) {
                return [routes.DRIVER_CLAIMS, routerPageContext];
            }

            const allowedLicences = ['F_FM', 'F_FA', 'F_FP', 'F_FI', 'P_PU'];
            const includesLicence = allowedLicences.includes(licenceCode);
            return includesLicence ? [routes.DRIVING_LICENSE_NUMBER, routerPageContext] : [routes.DRIVING_LICENSE_LENGTH, routerPageContext];
        },
        epticaId: eptica.YOUR_DETAILS_LICENCE_TYPE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_DrivingLicence_Number',
        WizardPage: HDDriverLicenceNumberPage,
        path: routes.DRIVING_LICENSE_NUMBER,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVING_LICENSE_TYPE, routerPageContext],
        forward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            if (routerPageContext.drivers[driverIndex].licenceSuccessfulValidated) {
                return [routes.DRIVER_CLAIMS, routerPageContext];
            }
            return [routes.DRIVING_LICENSE_LENGTH, routerPageContext];
        },
        skip: (_submissionVM, routerPageContext) => [routes.DRIVER_CLAIMS, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_LICENCE_TYPE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_DrivingLicence_Length',
        WizardPage: HDDriverLicenceLengthPage,
        path: routes.DRIVING_LICENSE_LENGTH,
        stepper: 'Details',
        personalDetails: true,
        backward: (submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const licenceCode = _.get(submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].licenceType.value.code`);
            const allowedLicences = ['F_FM', 'F_FA', 'F_FP', 'F_FI', 'P_PU'];
            const includesLicence = allowedLicences.includes(licenceCode);
            return includesLicence ? [routes.DRIVING_LICENSE_NUMBER, routerPageContext] : [routes.DRIVING_LICENSE_TYPE, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => [routes.DRIVER_CLAIMS, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_LICENCE_TYPE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_Claims',
        WizardPage: HDDriverClaimsPage,
        path: routes.DRIVER_CLAIMS,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const licenceCode = _.get(_submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].licenceType.value.code`);

            // for Full UK, Pass Plus and Microblink scan skip DLN and Length page
            if (['F_FP', 'F_FM'].includes(licenceCode)
                && routerPageContext.drivers[driverIndex].licenceSuccessfulScanned
                && routerPageContext.drivers[driverIndex].licenceSuccessfulValidated) {
                return [routes.DRIVING_LICENSE_TYPE, routerPageContext];
            }

            if (routerPageContext.drivers[driverIndex].licenceSuccessfulValidated) {
                return [routes.DRIVING_LICENSE_NUMBER, routerPageContext];
            }

            return [routes.DRIVING_LICENSE_LENGTH, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => {
            return [routes.DRIVER_CONVICTIONS, routerPageContext];
        },
        epticaId: eptica.YOUR_DETAILS_CLAIMS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_Convictions',
        WizardPage: HDDriverConvictionsPage,
        path: routes.DRIVER_CONVICTIONS,
        stepper: 'Details',
        personalDetails: true,
        backward: (_submissionVM, routerPageContext) => [routes.DRIVER_CLAIMS, routerPageContext],
        forward: (submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag) => {
            const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
            if (multiCarFlag && mcQuote.length < 1) {
                return [routes.MC_DRIVER_ALLOCATION, { driverIndex: 0, removeDriver: false }];
            }
            if (multiCarFlag && (mcQuote.length >= 1)) {
                return [routes.MC_MILESTONE, { driverIndex: 0, removeDriver: false }];
            }
            return [routes.ADD_ANOTHER_DRIVER, { driverIndex: 0, removeDriver: false }];
        },
        epticaId: eptica.YOUR_DETAILS_CONVICTIONS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsPersonalDetails_Complete',
        WizardPage: HDAddAnotherDriverPage,
        path: routes.ADD_ANOTHER_DRIVER,
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext) => {
            return [routes.DRIVER_CONVICTIONS, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const isEdit = _.get(routerPageContext, 'isDriverEdit', false);
            const isVehicleEdit = _.get(routerPageContext, 'isVehicleEdit', false);
            const finishedEdit = _.get(routerPageContext, 'finishedEditing', false);
            if (finishedEdit) {
                return getQuoteDeclineErrors(_submissionVM) ? [routes.QUOTE_DECLINE] : [routes.YOUR_QUOTES];
            }
            if (isVehicleEdit) {
                return [routes.VEHICLE_DETAILS];
            }
            if (isEdit) {
                return [routes.DRIVER_NAME, routerPageContext];
            }
            return driverIndex > 0 ? [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext] : [routes.TRANSITION];
        },
        epticaId: eptica.YOUR_DETAILS_CONVICTIONS,
        gridsContainerSize: {
            md: { span: 12 },
            lg: { span: 12 }
        },
    },
    {
        id: 'HastingsTransitionPage',
        WizardPage: HDTransitionPage,
        path: routes.TRANSITION,
        stepper: 'Details',
        milestone: true,
        backward: (_submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag) => (
            multiCarFlag ? [routes.MC_MILESTONE] : [routes.ADD_ANOTHER_DRIVER, routerPageContext]
        ),
        forward: (_submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => (
            multiCarFlag ? [routes.MC_POLICY_START_DATE] : [routes.POLICY_START_DATE, routerPageContext]
        ),
        epticaId: eptica.YOUR_DETAILS_CONVICTIONS,
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 12, offset: 0 }
        },
    },
    {
        id: 'HastingsPolicyStart',
        WizardPage: HDPolicyStartDatePage,
        path: routes.POLICY_START_DATE,
        vehicleRibbon: true,
        stepper: 'Cover',
        stepperTwo: true,
        backward: (submissionVM, routerPageContext, currentPageIndex, mcsubmissionVM, multiCarFlag) => {
            if (_.get(routerPageContext, 'fromPage') === routes.MC_DRIVER_ALLOCATION) {
                dispatch(setNavigation({ multiCarFlag: true }));
            } else if (!multiCarFlag) {
                return [routes.ADD_ANOTHER_DRIVER];
            }
            return [routes.MC_DRIVER_ALLOCATION, { driverIndex: 0, removeDriver: false }];
        },
        forward: (submissionVM) => {
            const offeredQuotes = _.get(submissionVM, 'quoteData.offeredQuotes.value');
            if (offeredQuotes) {
                const hasUWErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
                    .filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
                const hasGreyListErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
                    .filter((hastingsError) => (hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
                return (hasUWErrors || hasGreyListErrors) ? [routes.QUOTE_DECLINE] : [routes.YOUR_QUOTES];
            }
            return [routes.QUOTE_DECLINE];
        },
        epticaId: eptica.COVER_DETAILS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsQuoteDeclinePage',
        WizardPage: HDQuoteDeclinePage,
        path: routes.QUOTE_DECLINE,
        forward: () => [CUSTOMIZE_QUOTE_WIZARD],
        epticaId: eptica.MISCELLANEOUS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 8, offset: 2 }
        },
    },
    {
        id: 'HastingsYourQuotes',
        WizardPage: HDYourQuotesPage,
        path: routes.YOUR_QUOTES,
        vehicleRibbon: true,
        stepper: 'Cover',
        backward: () => [routes.POLICY_START_DATE],
        forward: (_submissionVM, routerPageContext) => {
            const hasQuoteErrors = _.get(routerPageContext, 'isQuoteErrorState', false);
            if (hasQuoteErrors) {
                return [routes.QUOTE_DECLINE];
            }
            return [routes.COVERAGE_TRANSITION];
        },
        epticaId: eptica.COVER_DETAILS,
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 12, offset: 0 }
        },
    },
    {
        id: 'HastingsThanksPage',
        WizardPage: HDThanksPage,
        path: routes.THANKS,
        stepper: 'Quote',
        backward: () => [routes.YOUR_QUOTES],
        forward: () => [routes.THANKS],
        epticaId: eptica.THANK_YOU,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsCoverageTransitionPage',
        WizardPage: HDCoverageTransitionPage,
        path: routes.COVERAGE_TRANSITION,
        stepper: 'Quote',
        stepperThree: true,
        backward: (submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag) => (
            multiCarFlag ? [routes.MC_YOURQUOTE_PAGE] : [routes.YOUR_QUOTES]
        ),
        forward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            const isMultiCar = _.get(routerPageContext, 'multiFlag', false);
            const isShowHidePromotionalPageFlag = _.get(routerPageContext, 'showHidePromotionalPageFlag', false);
            const numberOfCarsOnHousehold = _.get(submissionVM, 'value.baseData.numberOfCarsOnHousehold');
            const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
            const checkBrandCode = _.get(submissionVM, 'value.baseData.brandCode');
            if (multiCarFlag && mcQuote.length > 1) return [MC_CUSTOMIZE_QUOTE_WIZARD];
            return (numberOfCarsOnHousehold > 1 && !multiCarFlag && isMultiCar && checkBrandCode !== YD && !isShowHidePromotionalPageFlag) ? [routes.PROMOTION] : [CUSTOMIZE_QUOTE_WIZARD];
        },
        epticaId: eptica.COVER_DETAILS,
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 12, offset: 0 }
        },
    },
    {
        id: 'HastingsPromotion',
        WizardPage: HDPromotionalPage,
        path: routes.PROMOTION,
        stepper: 'Quote',
        backward: () => [routes.YOUR_QUOTES],
        forward: () => [CUSTOMIZE_QUOTE_WIZARD],
        gridsContainerSize: {
            md: { span: 10, offset: 1 },
            lg: { span: 10, offset: 1 },
        },
    },
    {
        id: 'HastingsMCMilestonePage',
        WizardPage: HDMultiCarMilestonePage,
        path: routes.MC_MILESTONE,
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext) => {
            const ismoveToMCMilestone = _.get(routerPageContext, 'moveToMCMilestone', false);
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const licenceCode = _.get(_submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].licenceType.value.code`);

            if (ismoveToMCMilestone) {
                return [routes.MC_DRIVER_ALLOCATION_SECONDARY];
            }
            // for Full UK, Pass Plus and Microblink scan skip DLN, Length page and convictions
            if (['F_FP', 'F_FM'].includes(licenceCode) && routerPageContext.drivers[driverIndex].licenceSuccessfulScanned) {
                return [routes.DRIVER_CLAIMS, routerPageContext];
            }

            return [routes.DRIVER_CONVICTIONS, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const isEdit = _.get(routerPageContext, 'isDriverEdit', false);
            const isVehicleEdit = _.get(routerPageContext, 'isVehicleEdit', false);
            const convertToSingle = _.get(routerPageContext, 'convertToSingle', false);
            if (isVehicleEdit) {
                return [routes.VEHICLE_DETAILS];
            }
            if (isEdit) {
                return [routes.DRIVER_NAME, routerPageContext];
            }
            if (convertToSingle) {
                return [routes.MC_DRIVER_ALLOCATION];
            }
            return driverIndex >= 0 ? [routes.MC_DRIVER_ALLOCATION_SECONDARY, routerPageContext] : [routes.TRANSITION];
        },
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCPolicyStart',
        WizardPage: HDMCPolicyStartDatePage,
        path: routes.MC_POLICY_START_DATE,
        vehicleRibbon: true,
        stepper: 'Cover',
        stepperTwo: true,
        // eslint-disable-next-line no-unused-vars
        backward: (submissionVM, routerPageContext, currentCarIndex, _mcsubmissionVM, _multiCarFlag) => {
            if (currentCarIndex === 0) {
                return [routes.MC_MILESTONE];
            }
            return [routes.MC_POLICY_START_DATE];
        },
        // eslint-disable-next-line no-unused-vars
        forward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, _multiCarFlag) => {
            if (currentCarIndex < mcsubmissionVM.value.quotes.length) {
                return [routes.MC_POLICY_START_DATE];
            }

            if (mcsubmissionVM.value.quotes.length) {
                for (let submissionVMIndex = 0; submissionVMIndex < mcsubmissionVM.value.quotes.length; submissionVMIndex += 1) {
                    const localSubmissionVM = mcsubmissionVM.quotes.children[submissionVMIndex];
                    const hasError = getQuoteDeclineErrors(localSubmissionVM);
                    if (hasError && localSubmissionVM.value.isParentPolicy) {
                        _.set(submissionVM, 'value', localSubmissionVM.value);
                        return [routes.MC_QUOTE_DECLINE];
                    }
                    if (hasError) {
                        return [routes.MC_QUOTE_ERROR_PAGE];
                    }
                }
            }
            return [routes.MC_SAVINGS_PAGE];
        },
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        }
    },
    {
        id: 'HastingsMCQuoteErrorPage',
        WizardPage: HDMCQuoteErrorPage,
        path: routes.MC_QUOTE_ERROR_PAGE,
        stepper: 'Cover',
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 8, offset: 2 }
        }
    },
    {
        id: 'HastingsMCSavingsPage',
        WizardPage: HDSavingsPage,
        path: routes.MC_SAVINGS_PAGE,
        stepper: 'Cover',
        backward: () => [routes.MC_POLICY_START_DATE],
        forward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            const quotelength = _.get(mcsubmissionVM, 'value.quotes', []);
            if (quotelength.length && multiCarFlag) { return [routes.MC_YOURQUOTE_PAGE]; }
            const offeredQuotes = _.get(submissionVM, 'quoteData.offeredQuotes.value');
            if (offeredQuotes) {
                const hasUWErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
                    .filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
                const hasGreyListErrors = offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
                    .filter((hastingsError) => (hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE))).length > 0)).length === offeredQuotes.length;
                return (hasUWErrors || hasGreyListErrors) ? [routes.QUOTE_DECLINE] : [routes.YOUR_QUOTES];
            }
            return [routes.QUOTE_DECLINE];
        },
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 8, offset: 2 }
        }
    },
    {
        id: 'HastingsMCYourQuotePage',
        WizardPage: HDMCYourQuotesPage,
        path: routes.MC_YOURQUOTE_PAGE,
        vehicleRibbon: true,
        stepper: 'Cover',
        gridsContainerSize: {
            md: { span: 12, offset: 0 },
            lg: { span: 12, offset: 0 }
        },
    },
    {
        id: 'HastingsMCDetailsComplete',
        WizardPage: HDMCCompletedCarDetailsPage,
        path: routes.MC_CAR_DETAILS,
        stepper: 'Details',
        backward: () => [routes.CAR_LOCATION],
        forward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            const isVehicleEdit = _.get(routerPageContext, 'isVehicleEdit', false);
            const isEdit = _.get(routerPageContext, 'isInEditJourney');
            const finishedEdit = _.get(routerPageContext, 'finishedEditing', false);
            const quotelength = _.get(mcsubmissionVM, 'value.quotes', []);
            if (isEdit) {
                return [routes.DRIVER_NAME];
            }
            if (finishedEdit) {
                return getQuoteDeclineErrors(submissionVM) ? [routes.QUOTE_DECLINE] : [routes.YOUR_QUOTES];
            }
            if (quotelength.length && multiCarFlag && !isVehicleEdit) {
                return [routes.MC_POLICY_HOLDER_ALLOCATION];
            }
            return isVehicleEdit ? [routes.VEHICLE_DETAILS, routerPageContext] : [routes.MC_DRIVER_SCAN_OR_CONTINUE];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCDriverScanOrContinuePage',
        WizardPage: HDMCHeadsUpPage,
        path: routes.MC_DRIVER_SCAN_OR_CONTINUE,
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            if (multiCarFlag && routerPageContext.driverIndex > 0) {
                const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
                if (mcQuote.length) {
                    return [routes.MC_MILESTONE, { driverIndex: 0, removeDriver: true }];
                }
                return [routes.MC_DRIVER_ALLOCATION, { driverIndex: 0, removeDriver: true }];
            }
            if (!multiCarFlag && routerPageContext.driverIndex > 0) {
                return [routes.ADD_ANOTHER_DRIVER, { driverIndex: 0, removeDriver: true }];
            }
            return [routes.MC_CAR_DETAILS];
        },
        forward: (_submissionVM, routerPageContext) => [routes.DRIVER_SCAN, routerPageContext],
        skip: (_submissionVM, routerPageContext) => [routes.DRIVER_NAME, routerPageContext],
        epticaId: eptica.YOUR_DETAILS_DRIVING_LICENCE,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        }
    },
    {
        id: 'HastingsMCPersonalDetails_Complete',
        WizardPage: HDMCDriverAllocation,
        path: routes.MC_DRIVER_ALLOCATION,
        stepper: 'Details',
        backward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const licenceCode = _.get(_submissionVM, `lobData.privateCar.coverables.drivers.children[${driverIndex}].licenceType.value.code`);

            // for Full UK, Pass Plus and Microblink scan skip DLN, Length page and convictions
            if (['F_FP', 'F_FM'].includes(licenceCode) && routerPageContext.drivers[driverIndex].licenceSuccessfulScanned) {
                return [routes.DRIVER_CLAIMS, routerPageContext];
            }

            return [routes.DRIVER_CONVICTIONS, routerPageContext];
        },
        forward: (_submissionVM, routerPageContext) => {
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const isEdit = _.get(routerPageContext, 'isDriverEdit', false);
            const isVehicleEdit = _.get(routerPageContext, 'isVehicleEdit', false);
            if (isVehicleEdit) {
                return [routes.VEHICLE_DETAILS];
            }
            if (isEdit) {
                return [routes.DRIVER_NAME, routerPageContext];
            }
            return driverIndex > 0 ? [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext] : [routes.TRANSITION, { fromPage: routes.MC_DRIVER_ALLOCATION }];
        },
        epticaId: eptica.YOUR_DETAILS_CONVICTIONS,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCQuoteDecline',
        WizardPage: HDMCQuoteDeclinePage,
        path: routes.MC_QUOTE_DECLINE,
        stepper: 'Quote',
        forward: () => [CUSTOMIZE_QUOTE_WIZARD],
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 },
        }
    },
    {
        id: 'HastingsMCPolicyHolderAllocation',
        WizardPage: HDMCPolicyHolderAllocation,
        path: routes.MC_POLICY_HOLDER_ALLOCATION,
        stepper: 'Details',
        backward: () => [routes.MC_CAR_DETAILS],
        // eslint-disable-next-line no-unused-vars
        forward: (submissionVM, routerPageContext, _currentCarIndex, _mcsubmissionVM, _multiCarFlag) => {
            const isAddNewDriver = _.get(routerPageContext, 'addNewDriver', false);
            const isaddedExistingDriver = _.get(routerPageContext, 'addedExistingDriver', false);
            const notAPolicyHolder = _.get(routerPageContext, 'notAPolicyHolder', false);
            if (isAddNewDriver) {
                return [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext];
            }
            if (isaddedExistingDriver) {
                return [routes.MC_DRIVER_ALLOCATION_SECONDARY];
            }
            if (notAPolicyHolder) {
                return [routes.MC_ADDRESS_VERIFY];
            }
            return [routes.MC_DRIVER_ALLOCATION_SECONDARY];
        },
        // forward: () => [routes.MC_DRIVER_ALLOCATION],
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCAddressVerify',
        WizardPage: HDMCAddressVerify,
        path: routes.MC_ADDRESS_VERIFY,
        personalDetails: true,
        stepper: 'Details',
        backward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            const notAPolicyHolder = _.get(routerPageContext, 'notAPolicyHolder', false);
            return notAPolicyHolder ? [routes.MC_POLICY_HOLDER_ALLOCATION] : [routes.MC_POLICY_HOLDER_ALLOCATION];
        },
        // eslint-disable-next-line no-unused-vars
        forward: (submissionVM, routerPageContext, currentCarIndex, mcsubmissionVM, multiCarFlag) => {
            const chooseAnotherPH = _.get(routerPageContext, 'chooseAnotherPH', false);
            if (chooseAnotherPH) {
                return [routes.MC_POLICY_HOLDER_ALLOCATION];
            }
            return [routes.MC_DRIVER_HOME_OWNERSHIP];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCDriverHomeOwnership',
        WizardPage: HDMCDriverHomeOwnership,
        path: routes.MC_DRIVER_HOME_OWNERSHIP,
        personalDetails: true,
        stepper: 'Details',
        backward: () => [routes.MC_ADDRESS_VERIFY],
        forward: () => [routes.MC_DRIVER_ALLOCATION_SECONDARY],
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCDriverClaims',
        WizardPage: HDMCDriverClaims,
        path: routes.MC_DRIVER_CLAIMS,
        personalDetails: true,
        stepper: 'Details',
        backward: () => [routes.MC_DRIVER_HOME_OWNERSHIP],
        forward: () => [routes.MC_DRIVER_ALLOCATION_SECONDARY],
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    },
    {
        id: 'HastingsMCDriverAllocationSecondary',
        WizardPage: HDMCDriverAllocationSecondary,
        path: routes.MC_DRIVER_ALLOCATION_SECONDARY,
        stepper: 'Details',
        backward: () => [routes.MC_POLICY_HOLDER_ALLOCATION],
        // eslint-disable-next-line no-unused-vars
        forward: (submissionVM, routerPageContext, _currentCarIndex, _mcsubmissionVM, _multiCarFlag) => {
            const isAddNewDriver = _.get(routerPageContext, 'addNewDriver', false);
            const driverIndex = _.get(routerPageContext, 'driverIndex', 0);
            const ismoveToMCMilestone = _.get(routerPageContext, 'moveToMCMilestone', false);
            const isSelectPolicyHolderRemoved = _.get(routerPageContext, 'selectPolicyHolder', false);
            if (isAddNewDriver) {
                return [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext];
            }
            if (ismoveToMCMilestone) {
                return [routes.MC_MILESTONE, routerPageContext];
            }
            if (isSelectPolicyHolderRemoved) {
                return [routes.MC_POLICY_HOLDER_ALLOCATION];
            }
            return driverIndex >= 0 ? [routes.DRIVER_SCAN_OR_CONTINUE, routerPageContext] : [routes.MC_MILESTONE];
        },
        epticaId: eptica.VEHICLE_USAGE_LOCATION,
        gridsContainerSize: {
            md: { span: 8, offset: 2 },
            lg: { span: 6, offset: 3 }
        },
    }
].map((config) => ({
    ...config,
    pageMetadata: {
        page_name: config.id,
        page_type: 'Car Insurance - Get Price',
        sales_journey_type: 'single_car'
    }
}));

export const getCurrentPageConfig = (configList, pathname) => {
    const configration = configList.find((config) => config.path === pathname);
    return configration || {
        path: '',
        gridsContainerSize: {
            md: { span: 6, offset: 3 },
            lg: { span: 6, offset: 3 },
        }
    };
};
