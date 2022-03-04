// react
import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import {
    Switch, useHistory, useLocation, Route
} from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// GW
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
// Hastings
import {
    HDModal
} from 'hastings-components';
import classNames from 'classnames';
import { AnalyticsHDButton as HDButton } from '../../web-analytics';
import { HDCustomizeQuoteFooterPage } from '../../pages/wizard-pages';
import {
    createSubmission as createSubmissionAction,
    setSubmissionVM as setSubmissionVMAction,
    createQuote as createQuoteAction,
    setNavigation as setNavigationAction,
    updateQuote as updateQuoteAction,
    setBackNavigationFlag as setBackNavigationFlagAction,
    clearLWRQuoteData as clearLWRQuoteDataAction,
    clearUpdateQuoteData as clearUpdateQuoteDataAction,
    incrementCurrentPageIndex as incrementCurrentPageIndexAction,
    decrementCurrentPageIndex as decrementCurrentPageIndexAction,
    updateMultiQuote as updateMultiQuoteAction,
    multiQuote as multiQuoteAction,
    createParam as createParamForMultiQuote,
    setErrorStatusCode as setErrorStatusCodeAction
} from '../../redux-thunk/actions';
import useAnotherDriver from '../../pages/wizard-pages/__helpers__/useAnotherDriver';
// import './HDWizardRouter.scss';
import submission from '../SubmissionVMInitial';
import { getWizardConfig, getCurrentPageConfig } from './HDWizardConfig';
import HDWizardRoute from './HDWizardRoute';
import routes from './RouteConst';
import HDWizardStepper from './HDWizardStepper';
import BackNavigation from '../../pages/Controls/BackNavigation/BackNavigation';
import * as monetateHelper from '../../common/monetateHelper';
import * as messages from './HDWizard.messages';
import useFullscreenLoader from '../../pages/Controls/Loader/useFullscreenLoader';
import { HOMEPAGE } from '../../constant/const';
import useScrollToTop from '../common/useScrollToTop';
import {
    addAnotherDriverPage, policyInfoPage, mcPolicyInfoPage,
    mcSavingPage, promotionalPage, multicarDriverAllocationPage,
    milestonePage, yourQuotePage, mcYourQuotePage, multicarPolicyHolderAllocation, multicarDriverAllocationSecondaryPage, mcQuoteErrorPage
} from '../../pages/HastingsMCDOBInterstitialPage/HastingsMCDOBInterstititalPage.messages';
import { CUSTOMIZE_QUOTE_WIZARD, MC_CUSTOMIZE_QUOTE_WIZARD } from '../BaseRouter/RouteConst';
import HDInvalidURLErrorPage from '../../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';
import useViewTracking from '../../web-analytics/useViewTracking';
import arcTop from '../../assets/images/background/top-arc.svg';
import { TranslatorContext } from '../../integration/TranslatorContext';
import { updateDataForMC, getDataForMultiQuoteAPICallWithUpdatedFlag } from '../../common/submissionMappers';
import HDQuoteService from '../../api/HDQuoteService';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import { getQuoteDeclineErrors } from '../../pages/wizard-pages/__helpers__/policyErrorCheck';
import { faultyClaims } from '../../common/faultClaimsHelper';
import { updateStateOnQuoteDecline } from '../../common/webAnalyticsHelpers';
import homeRenewalEventTracking from '../../web-analytics/homeRenewalEventTracking';


export const HDWizardRouter = ({
    showForward,
    canForward,
    showWizardTooltip,
    wizardTooltip,
    canSkip,
    callCreateSubmission,
    submissionVM,
    callCreateQuote,
    quoteID,
    sessionUUID,
    updateQuoteFlag,
    updatedQuoteObject,
    createSubmissionObject,
    createSubmissionLoading,
    lwrQuoteLoading,
    lwrQuoteObject,
    lwrQuoteFlag,
    setSubmissionVM,
    createSubmission,
    createQuote,
    updateQuote,
    setNavigation,
    updateQuoteError,
    mcsubmissionVM,
    currentMCStartDateIndex,
    incrementCurrentPageIndex,
    decrementCurrentPageIndex,
    updateMultiQuote,
    updatedMultiQuoteObject,
    updateMultiQuoteError,
    updateMultiQuoteFlag,
    multiCarFlag,
    isAddAnotherCar,
    createMultiQuoteFlag,
    multiQuote,
    createParam,
    setErrorStatusCode,
    multiQuoteObject,
    multiQuoteError,
    getPriceNavigationFlag,
    setBackNavigationFlag,
    isEditQuoteJourney,
    isEditFromCarComplete,
    isEditFromMilestonePage,
    submissionVMBeforeEdit,
    wizardPagesState,
    clearLWRQuoteData,
    clearUpdateQuoteData,
    multiFlagdisplay,
    mcEditedObjectForRetrieve,
    MCSingalQuoteIDForSync,
    isEditedDataSynced,
    isEditTriggered,
    setmilestoneEdit,
    multicarAddresChanged,
    dispatch,
    hideGoBack,
    isShowHidePromotionalPage,
    isEditQuoteJourneyDriver,
    finishEditingEnabled,
    renewalType,
    renewalMonth

}) => {
    const translator = useContext(TranslatorContext);
    const viewModelService = useContext(ViewModelServiceContext);
    const [submissionVMCreated, setSubmissionVMCreated] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [cancelEditDriverModal, setEditDriverModal] = useState(false);
    const [quoteTriggerPoint, setQuoteTriggerPoint] = useState(false);
    const [, isAnotherDriver] = useAnotherDriver(location);
    const [finishEditClicked, setFinishEditClicked] = useState(false);
    const [isDriverEdit, setIsDriverEdit] = useState(false);
    const [showStepper, setShowStepper] = useState(true);
    const [showBack, setShowBack] = useState(true);
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const protectNcdPath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${'protectNCD'}`;

    const wizardConfig = getWizardConfig(dispatch, isAnotherDriver);
    const currentConfig = getCurrentPageConfig(wizardConfig, location.pathname);
    useViewTracking(history, wizardConfig);
    useScrollToTop(location.pathname);
    const handleForward = (context) => {
        const sortedArray = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
        const drivers = context && context.fixedId ? _.sortBy(sortedArray, 'isPolicyHolder').reverse() : sortedArray;
        _.set(submissionVM, 'lobData.privateCar.coverables.drivers.value', drivers);
        setNavigation({ submissionVM: submissionVM });
        const isMultiCar = { multiFlag: monetateHelper.getMultiCarParams(multiFlagdisplay) };
        const isShowHidePromotionalPageFlag = { showHidePromotionalPageFlag: isShowHidePromotionalPage };
        const routerPageContext = {
            ...location.state, ...context, ...wizardPagesState, ...isMultiCar, ...isShowHidePromotionalPageFlag
        };
        let path;
        let state;
        if (multiCarFlag) {
            const localCurrentMCStartDateIndex = currentMCStartDateIndex;
            [path, state] = currentConfig.forward(submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
        } else {
            [path, state] = currentConfig.forward(submissionVM, routerPageContext);
        }

        if (context && context.isDriverEdit && context.isDriverEdit) {
            setIsDriverEdit(context.isDriverEdit);
        }
        if (currentConfig.path === routes.QUOTE_DECLINE || currentConfig.path === routes.MC_QUOTE_DECLINE) {
            window.location.assign(HOMEPAGE);
            history.push(path, state);
        } else {
            state = { ...state, waMultiFlag: multiCarFlag };
            history.push(path, state);
        }
    };

    const handleBackward = (context) => {
        setNavigation({
            showWizardTooltip: false,
            wizardTooltip: null,
            updateMultiQuoteFlag: false,
            createMultiQuoteFlag: false,
            callCreateSubmission: false
        });
        const isShowHidePromotionalPageFlag = { showHidePromotionalPageFlag: isShowHidePromotionalPage };
        const routerPageContext = {
            ...location.state, ...context, ...wizardPagesState, ...isShowHidePromotionalPageFlag
        };
        const { backward } = currentConfig;
        let path;
        let state;
        if (backward) {
            if (multiCarFlag) {
                if (isAddAnotherCar && (currentConfig.path === routes.MC_POLICY_START_DATE
                    || currentConfig.path === routes.MC_SAVINGS_PAGE)) {
                    let localCurrentMCStartDateIndex;
                    if (currentMCStartDateIndex === 1 && currentConfig.path === routes.MC_POLICY_START_DATE) {
                        localCurrentMCStartDateIndex = 0;
                        decrementCurrentPageIndex();
                    } else if (currentMCStartDateIndex === 0 && currentConfig.path === routes.MC_SAVINGS_PAGE) {
                        localCurrentMCStartDateIndex = 1;
                        incrementCurrentPageIndex();
                    }
                    [path, state] = backward(submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
                } else if (currentMCStartDateIndex > 0) {
                    const localCurrentMCStartDateIndex = currentMCStartDateIndex;
                    [path, state] = backward(submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
                    decrementCurrentPageIndex();
                } else {
                    const localCurrentMCStartDateIndex = currentMCStartDateIndex;
                    [path, state] = backward(submissionVM, routerPageContext, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
                }
            } else {
                [path, state] = backward(submissionVM, routerPageContext);
            }
            history.push(path, state);
        } else {
            history.goBack();
        }
    };

    const handleSkip = (context) => {
        const routerPageContext = { ...location.state, ...context, ...wizardPagesState };
        const [path, state] = currentConfig.skip(submissionVM, routerPageContext);
        if (path) {
            history.push(path, state);
        }
    };


    if (viewModelService) {
        if (!submissionVMCreated && _.get(submissionVM, 'value.quoteID') === undefined) {
            setSubmissionVM({
                submissionVM: viewModelService.create(submission, 'pc', 'edgev10.capabilities.quote.submission.dto.QuoteDataDTO')
            });

            setSubmissionVMCreated(true);
        }
    }

    const navigationAfterAPICall = () => {
        const routerPageContext = { ...location.state };
        const [path, state] = currentConfig.forward(submissionVM, routerPageContext);

        if (path === routes.QUOTE_DECLINE) {
            history.push(path, { ...updateStateOnQuoteDecline(state, submissionVM) });
        } else {
            history.push(path, state);
        }
    };

    // for multi car pages
    const navigationAfterAPICallMC = (checkFlagIndex) => {
        const newState = { ...location.state };
        let path;
        let state;
        if (currentConfig.path === routes.MC_POLICY_START_DATE) {
            const localCurrentMCStartDateIndex = currentMCStartDateIndex + 1;
            [path, state] = currentConfig.forward(submissionVM, newState, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
            if (checkFlagIndex) incrementCurrentPageIndex();
        } else {
            const localCurrentMCStartDateIndex = currentMCStartDateIndex;
            [path, state] = currentConfig.forward(submissionVM, newState, localCurrentMCStartDateIndex, mcsubmissionVM, multiCarFlag, isEditQuoteJourney);
        }
        history.push(path, state);
    };

    useEffect(() => {
        const { path } = currentConfig;
        if (path === routes.PROMOTION) {
            setShowStepper(false);
            setShowBack(false);
        } else {
            setShowStepper(true);
            setShowBack(true);
        }
    }, [currentConfig]);

    const sendHomeRenewalWebAnalyticsEvent = (args) => {
        homeRenewalEventTracking({
            ...args,
            renewal_type: renewalType,
            renewal_month: renewalMonth
        });
    };

    const confirmEventData = {
        event_value: messages.eventValue,
        event_action: messages.monthRenewal,
        event_label: renewalMonth,
        element_id: messages.elementId,
    };

    useEffect(() => {
        // save and replace the submissionVM >> baseData dto after create quote
        if (!createSubmissionLoading && createSubmissionObject) {
            _.set(submissionVM.value, 'baseData', createSubmissionObject.baseData);
            _.set(submissionVM.value, 'quoteID', createSubmissionObject.quoteID);
            _.set(submissionVM.value, 'sessionUUID', createSubmissionObject.sessionUUID);
            setSubmissionVM({ submissionVM: submissionVM });
            setSubmissionVMCreated(true);
            hideLoader();
        }

        // loader for lwr quote create api
        if (lwrQuoteLoading || createSubmissionLoading) {
            showLoader();
        } else {
            hideLoader();
            setNavigation({
                callCreateQuote: false,
                lwrQuoteFlag: false
            });
            if (isEditQuoteJourney && finishEditClicked && _.get(lwrQuoteObject, 'quoteID')) {
                setFinishEditClicked(false);
                setNavigation({
                    callCreateQuote: false,
                    lwrQuoteFlag: false,
                    showForward: true
                });
                _.set(submissionVM, 'value', lwrQuoteObject);
                handleForward({ finishedEditing: true });
            }
        }
        // save and replace the SubmissionVN >> baseData/lobData/quoteID/sessionUUID dto after lwrSaveAndQuote quote
        // to be defined 0000007993 W22SZ
        if (!lwrQuoteLoading && lwrQuoteObject && _.get(lwrQuoteObject, 'quoteID')) {
            _.set(submissionVM, 'value', lwrQuoteObject);
            setSubmissionVM({ submissionVM: submissionVM });
            setSubmissionVMCreated(true);
            if (lwrQuoteFlag && callCreateQuote) {
                navigationAfterAPICall();
            }
            sendHomeRenewalWebAnalyticsEvent(confirmEventData);
        } else if (lwrQuoteFlag && callCreateQuote) {
            navigationAfterAPICall();
        }
        // execute this
    }, [createSubmissionObject,
        submissionVM,
        updatedQuoteObject,
        lwrQuoteLoading,
        lwrQuoteObject,
        createSubmissionLoading]); // when createSubmissionObject changes

    useEffect(() => {
        // save and replace the SubmissionVN >> baseData/lobData/quoteID/sessionUUID dto after updateDraftSubmission quote
        if (updatedQuoteObject && _.get(updatedQuoteObject, 'quoteID') && quoteTriggerPoint) {
            _.set(submissionVM.value, 'baseData', updatedQuoteObject.baseData);
            _.set(submissionVM.value, 'lobData', updatedQuoteObject.lobData);
            _.set(submissionVM.value, 'quoteID', updatedQuoteObject.quoteID);
            _.set(submissionVM.value, 'sessionUUID', updatedQuoteObject.sessionUUID);
            setSubmissionVM({ submissionVM: submissionVM });
            setSubmissionVMCreated(true);
            hideLoader();
            if (lwrQuoteFlag && updateQuoteFlag) {
                navigationAfterAPICall();
            }
            setNavigation({
                updateQuoteFlag: false,
                lwrQuoteFlag: false
            });
            setQuoteTriggerPoint(false);
        }
        if (updateQuoteError && _.get(updateQuoteError, 'error.message') && quoteTriggerPoint) {
            hideLoader();
            setNavigation({
                updateQuoteFlag: false,
                lwrQuoteFlag: false
            });
            setQuoteTriggerPoint(false);
        }
    }, [
        submissionVM,
        updatedQuoteObject,
        updateQuoteError]); // when createSubmissionObject changes
    const checkDriverPage = (path) => {
        const driverPages = [
            routes.DRIVER_DOB,
            routes.DRIVER_NAME,
            routes.DRIVER_EMAIL,
            routes.DRIVER_ADDRESS, routes.HOMEOWNER, routes.DRIVER_MARITAL_STATUS,
            routes.PRIMARY_EMPLOYMENT,
            routes.SECONDARY_EMPLOYMENT,
            routes.DRIVING_LICENSE_TYPE,
            routes.DRIVING_LICENSE_LENGTH,
            routes.DRIVING_LICENSE_NUMBER,
            routes.DRIVER_CLAIMS,
            routes.DRIVER_CONVICTIONS
        ];
        return driverPages.find((driverPage) => driverPage === path);
    };

    // for hiding back nav in mc-car-details
    const checkMCCarDetailsHideBack = (path) => {
        const quotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
        if (path === routes.MC_CAR_DETAILS && quotesArray.length === 0) { return false; }
        if (path === routes.MC_CAR_DETAILS && _.get(submissionVM, 'value.quoteID', null) && !_.get(submissionVM, 'value.isParentPolicy', true)) {
            return true;
        }
        return false;
    };

    const checkPathToHideBack = (path) => {
        const hideBackPath = [routes.VEHICLE_DETAILS, routes.DRIVER_NAME, routes.ADD_ANOTHER_DRIVER, routes.MC_MILESTONE];
        return isEditQuoteJourney && hideBackPath.includes(path);
    };
    const checkGetPricePathToHideBack = (path) => {
        const hideBackPath = [routes.QUOTE_DECLINE, routes.TRANSITION, routes.COVERAGE_TRANSITION, routes.DRIVER_SCAN, routes.PROMOTION];
        return hideBackPath.includes(path);
    };

    const checkPathToHideEdit = (path) => {
        const hideEditPath = [
            routes.YOUR_QUOTES,
            routes.TRANSITION,
            routes.QUOTE_DECLINE,
            routes.COVERAGE_TRANSITION,
            routes.MC_SAVINGS_PAGE,
            routes.MC_YOURQUOTE_PAGE,
            routes.MC_QUOTE_DECLINE,
            routes.MC_QUOTE_ERROR_PAGE
        ];
        return hideEditPath.includes(path);
    };

    const hideBackFromMilestone = (path) => {
        const hideEditPath = [routes.VEHICLE_DETAILS];
        return (isEditFromCarComplete || isEditFromMilestonePage) && hideEditPath.includes(path);
    };

    const shouldShowEmailTriggerFooterPage = (path) => {
        const showEmailTriggerFooterPage = [
            routes.ADD_ANOTHER_DRIVER,
            routes.POLICY_START_DATE,
            routes.MC_POLICY_START_DATE,
            routes.MC_SAVINGS_PAGE,
            routes.PROMOTION,
            routes.MC_DRIVER_ALLOCATION,
            routes.MC_MILESTONE,
            routes.YOUR_QUOTES,
            routes.MC_YOURQUOTE_PAGE,
            routes.MC_POLICY_HOLDER_ALLOCATION,
            routes.MC_DRIVER_ALLOCATION_SECONDARY,
            routes.MC_QUOTE_ERROR_PAGE
        ];
        return showEmailTriggerFooterPage.includes(path);
    };

    const getEmailTriggerFooterPageID = (path) => {
        switch (path) {
            case routes.ADD_ANOTHER_DRIVER:
                return addAnotherDriverPage;
            case routes.POLICY_START_DATE:
                return policyInfoPage;
            case routes.MC_POLICY_START_DATE:
                return mcPolicyInfoPage;
            case routes.MC_SAVINGS_PAGE:
                return mcSavingPage;
            case routes.MC_QUOTE_ERROR_PAGE:
                return mcQuoteErrorPage;
            case routes.PROMOTION:
                return promotionalPage;
            case routes.MC_DRIVER_ALLOCATION:
                return multicarDriverAllocationPage;
            case routes.MC_POLICY_HOLDER_ALLOCATION:
                return multicarPolicyHolderAllocation;
            case routes.MC_DRIVER_ALLOCATION_SECONDARY:
                return multicarDriverAllocationSecondaryPage;
            case routes.MC_MILESTONE:
                return milestonePage;
            case routes.YOUR_QUOTES:
                return yourQuotePage;
            case routes.MC_YOURQUOTE_PAGE:
                return mcYourQuotePage;
            default:
                return undefined;
        }
    };
    const confirmModal = () => {
        // to check for multicar
        if (multiCarFlag) {
            // push the editrd data to mcsubmissionVM
            mcsubmissionVM.value.quotes.forEach((element, index) => {
                const editedQuoteID = _.get(mcEditedObjectForRetrieve, 'quoteID', null);
                if (element.quoteID === editedQuoteID) {
                    mcsubmissionVM.value.quotes[index] = mcEditedObjectForRetrieve;
                }
            });
            setEditDriverModal(false);
            setNavigation({
                isEditQuoteJourney: false,
                isEditedDataSynced: false,
                MCSingalQuoteIDForSync: null,
                MCSingalQuoteEditObject: null
            });
            // navigate to mc customize page
            history.push(MC_CUSTOMIZE_QUOTE_WIZARD);
        } else {
            _.set(submissionVM, 'lobData.privateCar.coverables.drivers.value', submissionVMBeforeEdit.drivers);
            _.set(submissionVM, 'lobData.privateCar.coverables.vehicles.value', submissionVMBeforeEdit.vehicle);
            _.set(submissionVM, 'value.baseData', submissionVMBeforeEdit.account);
            _.set(submissionVM, 'value', submissionVMBeforeEdit.submission);
            setNavigation({
                updateQuoteFlag: false,
                lwrQuoteFlag: false,
                callCreateQuote: false
            });
            setEditDriverModal(false);
            history.push(CUSTOMIZE_QUOTE_WIZARD);
        }
    };
    const cancelEdit = () => {
        setNavigation({
            isEditCancelled: true,
            isEditQuoteJourneyDriver: false,
            finishEditingEnabled: false
        });
        if (checkDriverPage(location.pathname) && isEditQuoteJourney) {
            setEditDriverModal(true);
        } else {
            confirmModal();
        }
    };

    const redirectAfterEdit = () => {
        if (mcsubmissionVM.value.quotes) {
            for (let submissionVMIndex = 0; submissionVMIndex < mcsubmissionVM.value.quotes.length; submissionVMIndex += 1) {
                const localSubmissionVM = mcsubmissionVM.quotes.children[submissionVMIndex];
                const hasError = getQuoteDeclineErrors(localSubmissionVM);
                if (hasError && localSubmissionVM.isParentPolicy.value) {
                    return routes.MC_QUOTE_DECLINE;
                } if (hasError) {
                    return routes.MC_QUOTE_ERROR_PAGE;
                }
            }
        }
        return routes.MC_SAVINGS_PAGE;
    };

    const triggerFinishEdit = () => {
        return new Promise(async (resolve, reject) => {
            if (isEditTriggered) {
                updateDataForMC(multicarAddresChanged, mcsubmissionVM, submissionVM);
            }
            showLoader();
            await HDQuoteService.multiQuote(getDataForMultiQuoteAPICallWithUpdatedFlag(mcsubmissionVM.value))
                .then((resultObject) => {
                    const { result } = resultObject;
                    _.set(mcsubmissionVM, 'value', result);
                    setNavigation({
                        isEditTriggered: false
                    });
                    trackAPICallSuccess('Multi Quote');
                    hideLoader();
                    resolve();
                }).catch((error) => {
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    setErrorStatusCode(error.status);
                    hideLoader();
                    reject();
                });
        });
    };

    const finishEdit = () => {
        const fetchMCsubmissionVMQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
        const claimsDetails = faultyClaims(submissionVM);
        if (claimsDetails && claimsDetails.length > 1) {
            _.set(submissionVM, `${protectNcdPath}.value`, false);
        }
        if (multiCarFlag && fetchMCsubmissionVMQuotes.length) {
            triggerFinishEdit().then(() => {
                const redirectPath = redirectAfterEdit();
                history.push(redirectPath);
            });
        } else {
            clearUpdateQuoteData();
            clearLWRQuoteData();
            setFinishEditClicked(true);
            _.set(submissionVM.value, 'quoteID', quoteID);
            _.set(submissionVM.value, 'sessionUUID', sessionUUID);
            if (lwrQuoteObject && lwrQuoteObject !== undefined && lwrQuoteObject !== null && Object.keys(lwrQuoteObject).length > 0) {
                _.isEqual(lwrQuoteObject.baseData, submissionVM.value.baseData);
                _.isEqual(lwrQuoteObject.lobData, submissionVM.value.lobData);
            }
            if (submissionVM.aspects.valid) {
                _.set(submissionVM, 'baseData.periodStartDate.value', submissionVMBeforeEdit.submission.baseData.periodStartDate);
                const preselectedBrandCode = _.get(submissionVMBeforeEdit, 'submission.baseData.brandCode');
                if (preselectedBrandCode) {
                    // Selected versions brand code is added to request if value available in before edit object
                    _.set(submissionVM.value, 'baseData.brandCode', preselectedBrandCode);
                }
                createQuote(submissionVM, translator);
                setNavigation({
                    callCreateQuote: false,
                    lwrQuoteFlag: false
                });
            }
        }
    };
    const attemptForward = (context) => {
        setNavigation({
            showWizardTooltip: false,
            wizardTooltip: null,
            submissionVM: submissionVM
        });

        setBackNavigationFlag({ data: true });
        if (location.pathname !== routes.POLICY_START_DATE && location.pathname !== routes.MC_POLICY_START_DATE) {
            // eslint-disable-next-line no-param-reassign
            callCreateQuote = false;
            // eslint-disable-next-line no-param-reassign
            lwrQuoteFlag = false;
        }

        if (!lwrQuoteFlag) {
            handleForward(context);
        }

        // call the create quote
        if (callCreateSubmission && location.pathname === routes.DRIVER_ADDRESS) {
            createSubmission(submissionVM);
        }

        if (isEditQuoteJourney && submissionVMBeforeEdit
            && location.pathname === routes.ADD_ANOTHER_DRIVER) {
            _.set(submissionVM, 'value.baseData.periodStartDate', submissionVMBeforeEdit.account.periodStartDate);
        }

        // call the updateDraftSubmission quote >> flag is coming from HDDriverConvictionsPage.js
        if (updateQuoteFlag) {
            showLoader();
            _.set(submissionVM.value, 'quoteID', quoteID);
            _.set(submissionVM.value, 'sessionUUID', sessionUUID);
            const preselectedBrandCode = _.get(submissionVMBeforeEdit, 'submission.baseData.brandCode');
            if (preselectedBrandCode) {
                _.set(submissionVM.value, 'baseData.brandCode', preselectedBrandCode);
            }
            if (submissionVM.aspects.valid) {
                updateQuote(submissionVM);
                setNavigation({
                    updateQuoteFlag: false,
                    lwrQuoteFlag: false
                });
                setQuoteTriggerPoint(true);
            }
        }

        // call updateDraftMultiProduct, flag is coming from HDMCPolicyStartDatePage
        if (updateMultiQuoteFlag) {
            navigationAfterAPICallMC(true);
            setNavigation({
                updateMultiQuoteFlag: false,
                lwrQuoteFlag: false
            });
        }

        // call the lwrSaveAndQuote >> flag is coming from HDPolicyStartDatePage.js
        if (callCreateQuote) {
            _.set(submissionVM.value, 'quoteID', quoteID);
            _.set(submissionVM.value, 'sessionUUID', sessionUUID);
            if (lwrQuoteObject && lwrQuoteObject !== undefined && lwrQuoteObject !== null && Object.keys(lwrQuoteObject).length > 0) {
                _.isEqual(lwrQuoteObject.baseData, submissionVM.value.baseData);
                _.isEqual(lwrQuoteObject.lobData, submissionVM.value.lobData);
            }
            if (submissionVM.aspects.valid) {
                clearUpdateQuoteData();
                const preselectedBrandCode = _.get(submissionVMBeforeEdit, 'submission.baseData.brandCode');
                if (preselectedBrandCode) {
                    _.set(submissionVM.value, 'baseData.brandCode', preselectedBrandCode);
                }
                createQuote(submissionVM, translator);
                setNavigation({
                    callCreateQuote: false,
                    lwrQuoteFlag: false
                });
            }
        }

        // call the multiQuoteApi, flag is coming from HDMCPolicyStartDatePage
        if (createMultiQuoteFlag) {
            navigationAfterAPICallMC(false);
            setNavigation({
                createMultiQuoteFlag: false,
                lwrQuoteFlag: false
            });
        }
    };

    const getContinueButtonClass = () => {
        const { path } = currentConfig;
        const baseClass = 'wizard-buttons-footer';
        let additionalClasses = '';
        if (path === routes.CAR_DETAILS || path === routes.QUOTE_DECLINE) {
            additionalClasses += ' button-stepchange-size';
        } else if (path === routes.ADD_ANOTHER_DRIVER) {
            additionalClasses += ' button-continue-to-size';
        }
        if (path === routes.PROMOTION) {
            return 'wizard-buttons-footer-single';
        }
        return baseClass + additionalClasses;
    };

    const getWizardNavigationClass = () => {
        const { path } = currentConfig;
        if (path === routes.YOUR_QUOTES || path === routes.MC_YOURQUOTE_PAGE) {
            return 'wizard-navigation-forward wizard-navigation-forward_override';
        }
        return 'wizard-navigation-forward';
    };

    const getWizardBaseRouterContainerClass = () => {
        const { path } = currentConfig;
        let classes = 'WizardBaseRouterContainer page-content-wrapper background-body';
        if (path === routes.YOUR_QUOTES || path === routes.MC_YOURQUOTE_PAGE) {
            classes += ' WizardBaseRouterContainerOverride';
        }
        if (path === routes.PROMOTION || path === routes.MC_POLICY_HOLDER_ALLOCATION) {
            classes += ' disable-wizard-pages-email';
        }
        return classes;
    };

    const getContinueLabel = () => {
        const { path } = currentConfig;
        switch (path) {
            case routes.CAR_DETAILS:
                return messages.driverDetailsButton;
            case routes.ADD_ANOTHER_DRIVER:
                return messages.coverDetailsButton;
            case routes.QUOTE_DECLINE:
                return messages.quoteDeclineButton;
            case routes.DRIVER_DOB:
                return messages.confirmButton;
            case routes.PROMOTION:
                return messages.continueSingleCarButton;
            case routes.MC_QUOTE_DECLINE:
                return messages.quoteDeclineButton;
            default:
                return messages.continueButton;
        }
    };

    const wizardRoutes = wizardConfig.map((config) => (
        <HDWizardRoute
            key={config.id}
            pageId={config.id}
            pageMetadata={config.pageMetadata}
            path={config.path}
            WizardPage={config.WizardPage}
            handleBackward={handleBackward}
            handleForward={attemptForward}
            handleSkip={handleSkip}
            epticaId={config.epticaId}
            personalDetails={config.personalDetails} />
    ));

    // eslint-disable-next-line react/prop-types
    const EditDetailsFooterBtns = ({ children }) => (
        location.pathname === routes.ADD_ANOTHER_DRIVER
            ? (
                <Container className="px-tab-0">
                    {children}
                </Container>
            )
            : children
    );

    const checkMilestoneEdit = () => {
        if (currentConfig.path === routes.VEHICLE_DETAILS && setmilestoneEdit && setmilestoneEdit.trigger) {
            return setmilestoneEdit.trigger;
        }
        return false;
    };

    const checkSingleToMultiHideBack = () => {
        const quotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
        if (currentConfig.path === routes.VEHICLE_DETAILS && quotesArray.length === 0) {
            if (hideGoBack) { setNavigation({ hideGoBack: false }); }
            return false;
        }
        if (currentConfig.path === routes.VEHICLE_DETAILS && quotesArray.length !== 0 && hideGoBack) {
            return true;
        }
        return false;
    };

    const checkeditDriverPath = () => {
        if (currentConfig.path === routes.ADD_ANOTHER_DRIVER && isEditQuoteJourneyDriver && finishEditingEnabled) {
            return false;
        }
        return true;
    };
    const checkeditDriverPathForMC = () => {
        if (currentConfig.path === routes.MC_MILESTONE && isEditQuoteJourneyDriver && finishEditingEnabled) {
            return false;
        }
        return true;
    };

    return (
        <>
            <Container fluid className={getWizardBaseRouterContainerClass()}>
                {(currentConfig.path === routes.YOUR_QUOTES || currentConfig.path === routes.MC_YOURQUOTE_PAGE) && (
                    <div className={classNames('arc-header', { 'mc-arc-header': currentConfig.path === routes.MC_YOURQUOTE_PAGE })}>
                        <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                    </div>
                )}
                {currentConfig.path.length > 0 && currentConfig.path !== routes.MC_QUOTE_DECLINE && currentConfig.path !== routes.MC_SAVINGS_PAGE
                    && currentConfig.path !== routes.PROMOTION
                    && currentConfig.stepper && currentConfig.path.length && <HDWizardStepper location={location} multiCarFlag={multiCarFlag} />}
                {/* Error due to handleBackward() is not working */}
                {/* {currentConfig.path === routes.MC_POLICY_START_DATE
                    ? (
                        <VehicleRibbon
                            vehicleAdded={true} />
                    ) : null
                } */}
                <Container
                    fluid={currentConfig.path === routes.MC_YOURQUOTE_PAGE}
                    className={classNames({ 'container--get-a-price': currentConfig.path !== routes.MC_YOURQUOTE_PAGE })}
                >
                    <Row>
                        <Col className="px-0" sm={12} xs={12} md={currentConfig.gridsContainerSize.md} lg={currentConfig.gridsContainerSize.lg}>
                            {(currentConfig.path.length > 0 && currentConfig.path !== routes.MC_YOURQUOTE_PAGE && currentConfig.path !== routes.QUOTE_DECLINE
                                && currentConfig.path !== routes.MC_QUOTE_DECLINE && currentConfig.path !== routes.MC_QUOTE_ERROR_PAGE
                                && currentConfig.path !== routes.MC_ADDRESS_VERIFY && currentConfig.path !== routes.MC_ADDRESS_VERIFY_CHILD_PH
                                && !checkGetPricePathToHideBack(currentConfig.path) && !checkPathToHideBack(currentConfig.path)) && !hideBackFromMilestone(currentConfig.path)
                                && !checkMilestoneEdit() && !checkSingleToMultiHideBack() && !checkMCCarDetailsHideBack(currentConfig.path)
                                && (
                                    <Container className="stepper-go-back mt-3">
                                        <BackNavigation
                                            id="backNavMainWizard"
                                            onClick={() => ((isEditQuoteJourney && canForward) || !isEditQuoteJourney) && handleBackward()}
                                            aria-disabled={(isEditQuoteJourney && !canForward)}
                                            disabled={(isEditQuoteJourney && !canForward)}
                                            onKeyPress={handleBackward} />
                                    </Container>
                                )}
                            <div>
                                <Switch>
                                    {wizardRoutes}
                                    <Route component={(props) => <HDInvalidURLErrorPage {...props} fromWizard="yes" />} />
                                </Switch>
                                <Container
                                    className={classNames('wizard-navigation margin-top-lg margin-top-lg-mobile', { 'margin-bottom-xl': isEditQuoteJourney })}
                                >
                                    <div className={getWizardNavigationClass()}>
                                        {showForward && (
                                            <div className={getContinueButtonClass()}>
                                                {canSkip
                                                    && (
                                                        <HDButton
                                                            webAnalyticsEvent={{ event_action: `Skip - Redirecting from: ${currentConfig.id}` }}
                                                            variant="primary"
                                                            label="Skip"
                                                            onClick={handleSkip}
                                                            disabled={!canSkip} />
                                                    )
                                                }
                                                <HDButton
                                                    id="continue-button"
                                                    webAnalyticsEvent={{ event_action: `Continue - Redirecting from: ${currentConfig.id}` }}
                                                    variant="primary"
                                                    label={getContinueLabel()}
                                                    onClick={() => attemptForward()}
                                                    disabled={!canForward} />
                                            </div>
                                        )}
                                        {showWizardTooltip && (
                                            <div className="wizard-tooltip-footer">
                                                {wizardTooltip}
                                            </div>
                                        )}
                                    </div>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {(isEditQuoteJourney && !checkPathToHideEdit(currentConfig.path)) && (
                    <div className="cancel-finish-edit">
                        <Container className="container--get-a-price">
                            <Row>
                                <Col xs={12} md={currentConfig.gridsContainerSize.md} lg={currentConfig.gridsContainerSize.lg}>
                                    <EditDetailsFooterBtns>
                                        <Row>
                                            <Col xs={6}>
                                                <HDButton
                                                    id="finish-editing-button"
                                                    webAnalyticsEvent={{ event_action: messages.finishEditing }}
                                                    size="sm"
                                                    variant="primary"
                                                    className="theme-white w-100"
                                                    onClick={() => finishEdit()}
                                                    disabled={(currentConfig.path !== routes.CAR_DETAILS
                                                        && checkeditDriverPathForMC()
                                                        && currentConfig.path !== routes.MC_CAR_DETAILS && checkeditDriverPath())}
                                                    label={messages.finishEditing} />
                                            </Col>
                                            <Col xs={6}>
                                                <HDButton
                                                    id="cancel-editing-button"
                                                    webAnalyticsEvent={{ event_action: messages.cancelEdit }}
                                                    size="sm"
                                                    variant="secondary"
                                                    className="theme-white w-100"
                                                    label={messages.cancelEdit}
                                                    onClick={() => cancelEdit()}
                                                    disabled={isEditedDataSynced} />
                                            </Col>
                                        </Row>
                                    </EditDetailsFooterBtns>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )}
                {shouldShowEmailTriggerFooterPage(location.pathname)
                    && (
                        <div className="wizard-pages-email">
                            <HDCustomizeQuoteFooterPage
                                pageId={getEmailTriggerFooterPageID(location.pathname)}
                                quoteID={multiCarFlag && mcsubmissionVM && mcsubmissionVM.value.mpwrapperNumber
                                    ? mcsubmissionVM.value.mpwrapperNumber : quoteID} />
                        </div>
                    )}
                <HDModal
                    webAnalyticsView={{ page_section: `Cancel edit driver - ${messages.areYourSure}` }}
                    webAnalyticsEvent={{ event_action: `Cancel edit driver - ${messages.areYourSure}` }}
                    id="cancel-edit-driver-modal"
                    show={cancelEditDriverModal}
                    customStyle="rev-button-order footer-btns-w-100"
                    headerText={messages.areYourSure}
                    confirmLabel={messages.cancelEditConfirm}
                    cancelLabel={messages.cancelEditGoBack}
                    onCancel={() => setEditDriverModal(false)}
                    onConfirm={() => confirmModal()}
                    hideClose
                >
                    <div>{messages.youllLoseChanges}</div>
                </HDModal>
            </Container>
            {HDFullscreenLoader}
        </>
    );
};

HDWizardRouter.propTypes = {
    submissionVM: PropTypes.shape({
        value: PropTypes.object,
        aspects: PropTypes.object,
        baseData: PropTypes.object,
        lobData: PropTypes.object
    }),
    quoteObject: PropTypes.shape({ quoteObj: PropTypes.object }),
    createSubmissionObject: PropTypes.shape({
        baseData: PropTypes.object,
        lobData: PropTypes.object,
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    updatedQuoteObject: PropTypes.shape({
        baseData: PropTypes.object,
        lobData: PropTypes.object,
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    lwrQuoteObject: PropTypes.shape({
        baseData: PropTypes.object,
        bindData: PropTypes.object,
        quoteData: PropTypes.object,
        lobData: PropTypes.object,
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    createSubmission: PropTypes.func.isRequired,
    showForward: PropTypes.bool,
    canForward: PropTypes.bool,
    showWizardTooltip: PropTypes.bool,
    wizardTooltip: PropTypes.element,
    canSkip: PropTypes.bool,
    callCreateSubmission: PropTypes.bool,
    callCreateQuote: PropTypes.bool,
    createQuote: PropTypes.func.isRequired,
    quoteID: PropTypes.number,
    sessionUUID: PropTypes.number,
    updateQuoteFlag: PropTypes.bool,
    updateQuote: PropTypes.func.isRequired,
    lwrQuoteLoading: PropTypes.bool,
    updateQuoteError: PropTypes.shape({}),
    lwrQuoteFlag: PropTypes.bool,
    createSubmissionLoading: PropTypes.bool,
    setNavigation: PropTypes.func.isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.object,
        quotes: PropTypes.object
    }),
    currentMCStartDateIndex: PropTypes.number,
    incrementCurrentPageIndex: PropTypes.func.isRequired,
    decrementCurrentPageIndex: PropTypes.func.isRequired,
    updateMultiQuote: PropTypes.func.isRequired,
    updateMultiQuoteFlag: PropTypes.bool,
    updateMultiQuoteError: PropTypes.shape({}),
    updatedMultiQuoteObject: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        accountNumber: PropTypes.string,
        quotes: PropTypes.array,
        mpwrapperJobNumber: PropTypes.string,
        mpwrapperNumber: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    multiCarFlag: PropTypes.bool.isRequired,
    isAddAnotherCar: PropTypes.bool.isRequired,
    createMultiQuoteFlag: PropTypes.bool,
    multiQuote: PropTypes.func.isRequired,
    createParam: PropTypes.func.isRequired,
    setErrorStatusCodeAction: PropTypes.func.isRequired,
    multiQuoteObject: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        accountNumber: PropTypes.string,
        quotes: PropTypes.array,
        mpwrapperJobNumber: PropTypes.string,
        mpwrapperNumber: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    multiQuoteError: PropTypes.shape({}),
    getPriceNavigationFlag: PropTypes.bool,
    setBackNavigationFlag: PropTypes.func.isRequired,
    isEditQuoteJourney: PropTypes.bool,
    isEditFromCarComplete: PropTypes.bool,
    isEditFromMilestonePage: PropTypes.bool,
    submissionVMBeforeEdit: PropTypes.shape({
        drivers: PropTypes.shape({}),
        vehicle: PropTypes.shape({}),
        account: PropTypes.shape({
            periodStartDate: PropTypes.string
        }),
        submission: PropTypes.shape({
            baseData: PropTypes.shape({
                periodStartDate: PropTypes.string
            })
        })
    }),
    wizardPagesState: PropTypes.shape({
        drivers: PropTypes.shape({}),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    setmilestoneEdit: PropTypes.shape({
        trigger: PropTypes.bool,
    }).isRequired,
    multicarAddresChanged: PropTypes.bool,
    isShowHidePromotionalPage: PropTypes.bool
};
HDWizardRouter.defaultProps = {
    canSkip: false,
    submissionVM: null,
    quoteObject: null,
    createSubmissionObject: null,
    createSubmissionLoading: false,
    updatedQuoteObject: null,
    lwrQuoteObject: null,
    showForward: false,
    canForward: false,
    showWizardTooltip: false,
    wizardTooltip: null,
    callCreateSubmission: false,
    callCreateQuote: false,
    quoteID: null,
    sessionUUID: null,
    updateQuoteFlag: false,
    lwrQuoteLoading: false,
    updateQuoteError: null,
    lwrQuoteFlag: false,
    mcsubmissionVM: null,
    currentMCStartDateIndex: 0,
    updateMultiQuoteFlag: false,
    updateMultiQuoteError: null,
    updatedMultiQuoteObject: null,
    createMultiQuoteFlag: false,
    multiQuoteObject: null,
    multiQuoteError: null,
    getPriceNavigationFlag: true,
    isEditQuoteJourney: false,
    isEditFromCarComplete: false,
    isEditFromMilestonePage: false,
    submissionVMBeforeEdit: {},
    multicarAddresChanged: false,
    isShowHidePromotionalPage: false
};

const mapStateToProps = (state) => ({
    canSkip: state.wizardState.app.canSkip,
    showForward: state.wizardState.app.showForward,
    canForward: state.wizardState.app.canForward,
    showWizardTooltip: state.wizardState.app.showWizardTooltip,
    wizardTooltip: state.wizardState.app.wizardTooltip,
    callCreateSubmission: state.wizardState.app.callCreateSubmission,
    callCreateQuote: state.wizardState.app.callCreateQuote,
    submissionVM: state.wizardState.data.submissionVM,
    quoteID: state.wizardState.app.quoteID,
    sessionUUID: state.wizardState.app.sessionUUID,
    updateQuoteFlag: state.wizardState.app.updateQuoteFlag,
    updatedQuoteObject: state.updateQuoteModel.updatedQuoteObj,
    createSubmissionObject: state.wizardState.app.createSubmissionObject,
    createSubmissionLoading: state.wizardState.app.loading,
    lwrQuoteObject: state.createQuoteModel.lwrQuoteObj,
    lwrQuoteLoading: state.createQuoteModel.loading,
    lwrQuoteFlag: state.wizardState.app.triggerLWRAPICall,
    updateQuoteError: state.updateQuoteModel.quoteError,
    mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    currentMCStartDateIndex: state.wizardState.app.currentPageIndex,
    updatedMultiQuoteObject: state.updateMultiQuoteModel.updatedMultiQuoteObj,
    updateMultiQuoteError: state.updateMultiQuoteModel.multiQuoteError,
    updateMultiQuoteFlag: state.wizardState.app.updateMultiQuoteFlag,
    multiCarFlag: state.wizardState.app.multiCarFlag,
    isAddAnotherCar: state.wizardState.app.isAddAnotherCar,
    createMultiQuoteFlag: state.wizardState.app.createMultiQuoteFlag,
    multiQuoteObject: state.multiQuoteModel.multiQuoteObj,
    multiQuoteError: state.multiQuoteModel.multiQuoteError,
    getPriceNavigationFlag: state.getPriceNavigationFlag.data,
    isEditQuoteJourney: state.wizardState.app.isEditQuoteJourney,
    isEditFromCarComplete: state.wizardState.app.isEditFromCarComplete,
    isEditFromMilestonePage: state.wizardState.app.isEditFromMilestonePage,
    submissionVMBeforeEdit: state.getObjectBeforeEdit.data,
    wizardPagesState: state.wizardState.app.pages,
    multiFlagdisplay: state.monetateModel.resultData,
    mcEditedObjectForRetrieve: state.wizardState.app.MCSingalQuoteEditObject,
    MCSingalQuoteIDForSync: state.wizardState.app.MCSingalQuoteIDForSync,
    isEditedDataSynced: state.wizardState.app.isEditedDataSynced,
    isEditTriggered: state.wizardState.app.isEditTriggered,
    setmilestoneEdit: state.setmilestoneEdit,
    multicarAddresChanged: state.wizardState.app.multicarAddresChanged,
    hideGoBack: state.wizardState.app.hideGoBack,
    isShowHidePromotionalPage: state.wizardState.app.showHidePromotionalPage,
    finishEditingEnabled: state.wizardState.app.finishEditingEnabled,
    isEditQuoteJourneyDriver: state.wizardState.app.isEditQuoteJourneyDriver,
    renewalType: state.wizardState.app.renewalType,
    renewalMonth: state.wizardState.app.renewalMonth
});

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
        setSubmissionVM: setSubmissionVMAction,
        createSubmission: createSubmissionAction,
        createQuote: createQuoteAction,
        updateQuote: updateQuoteAction,
        setNavigation: setNavigationAction,
        incrementCurrentPageIndex: incrementCurrentPageIndexAction,
        decrementCurrentPageIndex: decrementCurrentPageIndexAction,
        updateMultiQuote: updateMultiQuoteAction,
        multiQuote: multiQuoteAction,
        clearLWRQuoteData: clearLWRQuoteDataAction,
        clearUpdateQuoteData: clearUpdateQuoteDataAction,
        setBackNavigationFlag: setBackNavigationFlagAction,
        createParam: createParamForMultiQuote,
        setErrorStatusCode: setErrorStatusCodeAction,
    }, dispatch),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(HDWizardRouter);
