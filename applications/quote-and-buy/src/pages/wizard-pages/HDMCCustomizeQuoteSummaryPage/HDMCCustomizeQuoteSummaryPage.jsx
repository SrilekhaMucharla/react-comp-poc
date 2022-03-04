/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
    useState, useContext, useEffect
} from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { withRouter, useHistory } from 'react-router-dom';
import {
    HDQuoteInfoRefactor,
    HDAlert,
    HDQuoteInfoWarning
} from 'hastings-components';
import classNames from 'classnames';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { HastingsPaymentService } from 'hastings-capability-payment';
import {
    AnalyticsHDLabel as HDLabelRefactor,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroupRefactor,
    AnalyticsHDModal as HDModal,
    AnalyticsHDQuoteDownload as HDQuoteDownloadRefactor
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import * as messages from './HDMCCustomizeQuoteSummaryPage.messages';
import useToast from '../../Controls/Toast/useToast';
import HDCoverDetailsPage from '../HDCoverDetailsPage/HDCoverDetailsPage';
import carIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_1-car.svg';
import driverIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Account.svg';
import HDMCCQSPCardForm from './HDMCCQSPCardForm';
import HDMCCQSPMonthlyBreakdown from './HDMCCQSPMonthlyBreakdown';
import {
    CUE_ERROR_CODE, PAYMENT_TYPE_ANNUALLY_CODE, PAYMENT_TYPE_MONTHLY_CODE, HOMEPAGE, QUOTE_RATE_ERROR_CODE, OPENING_HOURS, UW_ERROR_CODE, GREY_LIST_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE
} from '../../../constant/const';
import arcTop from '../../../assets/images/background/top-arc.svg';
import twoWords from '../__helpers__/twoWords';

import {
    setMultiCarSubmissionVM,
    setMultiCustomizeSubmissionVM as setMultiCustomizeSubmissionVMAction,
    setCustomizeSubmissionVM as setCustomizeSubmissionVMAction,
    markRerateModalAsDisplayed as markRerateModalAsDisplayedAction,
    markNoDDModalAsDisplayed as markNoDDModalAsDisplayedAction,
    updateMultiCustomQuote,
    getMCIpidMatchForAll,
    setNavigation as setNavigationAction,
    setSubmissionVM,
    setErrorStatusCode,
    setVehicleDetails,
    setOfferedQuotesDetails,
    setWizardPagesState as setWizardPagesStateAction,
    updateEmailSaveProgress as updateEmailSaveProgressAction,
    retrievemulticarQuote,
    resetMultiCustomUpdateQuote,
    resetCurrentPageIndex as resetCurrentPageIndexAction,
    mcGetPaymentSchedule as mcGetPaymentScheduleAction,
} from '../../../redux-thunk/actions';

import { CUSTOMIZE_QUOTE_WIZARD } from '../../../routes/BaseRouter/RouteConst';

import formatRegNumber from '../../../common/formatRegNumber';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { checkHastingsErrorFromHastingErrorObj } from '../__helpers__/policyErrorCheck';
import routes from '../../../routes/WizardRouter/RouteConst';
import { getDateFromParts } from '../../../common/dateHelpers';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';
import HDChildsQuoteDecline from './HDChildsQuoteDecline';

import HDQuoteService from '../../../api/HDQuoteService';
import { getDataForMultiQuote } from '../../../redux-thunk/actions/multiQuote.action';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import multiSubmission from '../__helpers__/multiCustomizeSubmissionVMInitial';
import { getDataForMultiQuoteAPICall } from '../../../common/submissionMappers';
import trackQuoteData from '../../../web-analytics/trackQuoteData';

/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
    getPriceWithCurrencySymbol,
    mcIpidMatchForAllAPIObject,
    getNumberAsString,
    getMultiToSingleParam,
    returnIsMonthlyAvailableForMCSubmissionVM,
    returnIsMonthlyAvailableForMCCustomizeSubmissionVM,
    returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM,
    returnIsMonthlyPaymentAvailable
} from '../../../common/utils';
import { pageMetadataPropTypes } from '../../../constant/propTypes';

const CAR_NUMBERS = 'CAR_NUMBERS';
const INITIAL_PAYMENT_AMOUNT = 'INITIAL_PAYMENT_AMOUNT';
const MAX_EXCESS_VALUE = '500';
const CURRENCY = 'gbp';
const maxExcessLabel = getPriceWithCurrencySymbol({ amount: MAX_EXCESS_VALUE, currency: CURRENCY });

// to trigger update as changing submissionVM doesn't do that which causes it's children to keep old values
const useForceUpdate = () => {
    const [updateValue, setUpdateValue] = useState(false);

    return () => setUpdateValue(!updateValue);
};

const HDMCCustomizeQuoteSummaryPage = ({
    mcsubmissionVM,
    submissionVM,
    setMultiCustomizeSubmissionVM,
    multiCustomizeSubmissionVM,
    rerateModal,
    customMultiQuoteData,
    noDDModal,
    setTotalPrice,
    mcPaymentScheduleModel,
    setNavigation,
    shouldPNCDShow,
    updateEmailSaveProgress,
    location,
    setWizardPageState,
    pageMetadata,
    MCQuoteRetrieved,
    isDiscountApplied,
    ancillaryCoveragesObject,
    ncdProtectionInd,
    checkbuttonDisabled,
    resetCurrentPageIndex,
    mcGetPaymentSchedule,
}) => {
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const voluntaryExcessFieldName = 'voluntaryExcess';
    const voluntaryExcessPath = `${vehiclePath}.${voluntaryExcessFieldName}`;
    const dispatch = useDispatch();
    const annualCostArray = [];
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);
    const [showChildsDeclineQuote, setShowChildsDeclineQuote] = useState(false);
    const [childsQuoteDeclinedErrorCount, setChildsQuoteDeclinedErrorCount] = useState(0);
    const viewModelService = useContext(ViewModelServiceContext);
    const translator = useContext(TranslatorContext);

    const [multicarsubmissionVMCreated, setmulticarSubmissionVMCreated] = useState(false);
    const [monthlyAmount, setMonthlyAmount] = useState(0);
    const [monthlyIntialPayment, setMonthlyInitialPayment] = useState(0);
    const [monthlyElevenCombinedPayment, setMonthlyElevenCombinedPayment] = useState(0);
    const [monthlyTotalAmountCredit, setMonthlyTotalAmountCredit] = useState(0);
    const [paymentType, setPaymentType] = useState(null);
    const [initialPolicyStartDate, setInitialPolicyStartDate] = useState([]);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [aprRate, setAprRate] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const history = useHistory();

    const [annualAmount, setAnnualAmount] = useState(0);
    const [showRerateModal, setShowRerateModal] = useState(false);
    const [showNoDDModal, setShowNoDDModal] = useState(false);
    const [showMissingMonthlyPaymentsPopup, setShowMissingMonthlyPaymentsPopup] = useState(false);
    const [showWrongVoluntaryExcess, setShowWrongVoluntaryExcess] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [multiCustomizeSubmissionVMCreated, setMultiCustomizeSubmissionVMCreated] = useState(false);
    const [quoteStatus, setQuoteStatus] = useState(null);
    const [fetchedQuoteData, setFetchedQuoteData] = useState(false);
    const [deferredCase] = useState(false);
    const [HDToast, addToast] = useToast();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const forceUpdate = useForceUpdate();
    const ERROR_MESSAGE = messages.errorMessage;
    const displayAmount = (value) => `£${value}`;
    const errorObject = { parentError: true, errorCode: CUE_ERROR_CODE };
    const [isMaxExcessModalShown, setIsMaxExcessModalShown] = useState(false);
    const [updateExcessesCounter, setUpdateExcessesCounter] = useState(0);
    const [dateTriggerObject, setDateTriggerObject] = useState({ quoteID: null, triggerCounter: 0 });

    const [totalDiscount, setTotalDiscount] = useState(0);
    const [deleteVehicle, setDeleteVehicle] = useState(null);
    const [removeVehicle, setRemoveVehicle] = useState(false); // Remove vehicle if any error during rerate
    const [deletedVehicleQuoteID, setDeletedVehicleQuoteID] = useState();
    const onDelete = (qID) => {
        setDeletedVehicleQuoteID(qID);
        setDeleteVehicle(true);
    };

    const hideDeleteModal = () => setDeleteVehicle(false);

    // For calculating total mc discount
    const getMultiCarDiscount = () => {
        const totalMPDiscount = _.get(mcsubmissionVM, 'value.totalMPDiscount', 0);
        return Math.abs(totalMPDiscount.toFixed(2));
    };

    const getChosenQuote = (quote) => {
        const chosenQuoteID = quote.bindData.chosenQuote;

        return quote.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
    };

    const returnIsMonthlyPaymentAvailableForAllQuotes = () => {
        let selectedOfferedQuotes;
        let checkInnerMonthlyPaymentType = {};
        const mcQuotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
        for (let i = 0; i < mcQuotesArray.length; i++) {
            selectedOfferedQuotes = getChosenQuote(mcQuotesArray[i]);
            checkInnerMonthlyPaymentType = _.get(selectedOfferedQuotes, 'hastingsPremium.monthlyPayment', {});
            if (Object.entries(checkInnerMonthlyPaymentType).length === 0) {
                break; // breaks the loop after matching the affordability plan
            }
        }
        return Object.entries(checkInnerMonthlyPaymentType).length === 0;
    };

    const createMCCustomizeSubVM = () => {
        const PaymentTypeVar = returnIsMonthlyAvailableForMCSubmissionVM(mcsubmissionVM);
        if (mcsubmissionVM.value.paymentScheduleResponseMP) {
            _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', mcsubmissionVM.value.paymentScheduleResponseMP);
        } else {
            _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
        }

        const tempMultiCustomizeSubmisssionVM = [];
        const mcQuotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
        setPaymentType(returnIsMonthlyAvailableForMCSubmissionVM(mcsubmissionVM));
        let monthlyAmountAfterDelete = 0;
        let monthlyElevenCombinedPaymentAfterDelete = 0;
        let monthlyInitialPaymentAfterDelete = 0;
        let monthlyTotalAmountCreditAfterDelete = 0;
        let annuallyAmountAfterDelete = 0;
        mcQuotesArray.forEach((quote) => {
            const newCustomizeSubmissionVM = {
                quote: getChosenQuote(quote),
                quoteID: quote.quoteID,
                sessionUUID: mcsubmissionVM.value.sessionUUID,
                periodStartDate: quote.baseData.periodStartDate,
                periodEndDate: quote.baseData.periodEndDate,
                isParentPolicy: quote.isParentPolicy,
                coverType: quote.lobData.privateCar.coverables.vehicles[0].coverType,
                voluntaryExcess: quote.lobData.privateCar.coverables.vehicles[0].voluntaryExcess,
                ncdgrantedYears: quote.lobData.privateCar.coverables.vehicles[0].ncdProtection.ncdgrantedYears,
                ncdgrantedProtectionInd: quote.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD,
                producerCode: quote.baseData.producerCode,
                insurancePaymentType: PaymentTypeVar,
                otherOfferedQuotes: quote.quoteData.offeredQuotes,
                coverages: {
                    privateCar: null
                }
            };
            const otherOfferedData = [];
            quote.quoteData.offeredQuotes.forEach((data) => {
                if (data.publicID !== getChosenQuote(quote).publicID) {
                    otherOfferedData.push(data);
                }
            });
            if (otherOfferedData.length) {
                newCustomizeSubmissionVM.otherOfferedQuotes = otherOfferedData;
            }
            const coverageData = [];
            const racEssentials = {
                isBreakdownEssential: false,
                isEuropeEssential: false,
                isHomeEssential: false,
                isTransportEssential: false
            };
            for (let i = 0; i < quote.lobData.privateCar.offerings.length; i += 1) {
                if (quote.lobData.privateCar.offerings[i].branchCode === getChosenQuote(quote).branchCode) {
                    coverageData.push(quote.lobData.privateCar.offerings[i].coverages);
                    if (quote.lobData.privateCar.offerings[i].coverages
                        && quote.lobData.privateCar.offerings[i].coverages.ancillaryCoverages.length
                        && quote.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages
                        && quote.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages.length) {
                        quote.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages.forEach((ancCoverage) => {
                            if (ancCoverage.name === messages.Breakdown && ancCoverage.publicID === messages.ANCBREAKDOWNCOV_EXT && ancCoverage.selected) {
                                if (ancCoverage.terms && ancCoverage.terms.length) {
                                    ancCoverage.terms.forEach((chosenancillaryTerm) => {
                                        if (chosenancillaryTerm.chosenTermValue === messages.roadside) {
                                            racEssentials.isBreakdownEssential = true;
                                        } else if (chosenancillaryTerm.chosenTermValue === messages.roadsideRecoveryCase) {
                                            racEssentials.isTransportEssential = true;
                                        } else if (chosenancillaryTerm.chosenTermValue === messages.homestart) {
                                            racEssentials.isHomeEssential = true;
                                        } else if (chosenancillaryTerm.chosenTermValue === messages.european) {
                                            racEssentials.isEuropeEssential = true;
                                        }
                                    });
                                }
                            }
                        });
                    }
                    break;
                }
            }
            newCustomizeSubmissionVM.racEssentials = racEssentials;
            if (coverageData.length) {
                // eslint-disable-next-line prefer-destructuring
                newCustomizeSubmissionVM.coverages.privateCar = coverageData[0];
            }
            const annualCost = {
                quoteID: quote.quoteID,
                annualQuoteAmount: getChosenQuote(quote).hastingsPremium.annuallyPayment.premiumAnnualCost.amount
            };
            annuallyAmountAfterDelete += getChosenQuote(quote).hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
            annualCostArray.push(annualCost);
            if (quote.isParentPolicy) {
                if (getChosenQuote(quote).hastingsPremium.monthlyPayment === undefined) {
                    setMonthlyAmount(0);
                    if (!noDDModal.status) {
                        setShowNoDDModal(false);
                    }
                } else {
                    setAprRate(getChosenQuote(quote).hastingsPremium.monthlyPayment.representativeAPR);
                    setInterestRate(getChosenQuote(quote).hastingsPremium.monthlyPayment.rateOfInterest);
                }
                setPaymentType(PaymentTypeVar);
                _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', PaymentTypeVar);
            }
            if (!returnIsMonthlyPaymentAvailableForAllQuotes()
            // || (getChosenQuote(quote).hastingsPremium.monthlyPayment !== undefined && mcPaymentScheduleObject)
            ) {
                monthlyAmountAfterDelete += getChosenQuote(quote).hastingsPremium.monthlyPayment.premiumAnnualCost.amount;
                monthlyInitialPaymentAfterDelete += getChosenQuote(quote).hastingsPremium.monthlyPayment.firstInstalment.amount;
                monthlyElevenCombinedPaymentAfterDelete += getChosenQuote(quote).hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount;
                monthlyTotalAmountCreditAfterDelete += getChosenQuote(quote).hastingsPremium.monthlyPayment.totalAmountCredit;
            }

            const policyInitialStartDate = {
                quoteID: quote.quoteID,
                initialStartDate: quote.baseData.periodStartDate,
                isParentPolicyDate: quote.isParentPolicy
            };

            setInitialPolicyStartDate((prevState) => {
                return [...prevState, policyInitialStartDate];
            });
            tempMultiCustomizeSubmisssionVM.push(newCustomizeSubmissionVM);

            return null;
        });
        setMonthlyAmount(monthlyAmountAfterDelete);
        setMonthlyInitialPayment(monthlyInitialPaymentAfterDelete);
        setMonthlyElevenCombinedPayment(monthlyElevenCombinedPaymentAfterDelete);
        setMonthlyTotalAmountCredit(monthlyTotalAmountCreditAfterDelete);
        setAnnualAmount(annuallyAmountAfterDelete);
        _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempMultiCustomizeSubmisssionVM);
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperNumber', mcsubmissionVM.value.mpwrapperNumber);
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperJobNumber', mcsubmissionVM.value.mpwrapperJobNumber);
        _.set(multiCustomizeSubmissionVM.value, 'sessionUUID', mcsubmissionVM.value.sessionUUID);
        hideLoader();
        shouldPNCDShow(multiCustomizeSubmissionVM);
    };

    // applyDiscountOnMulticar API to update the discount
    const applyDiscountAPITriggerPoint = () => {
        HDQuoteService.applyDiscountOnMulticar(getDataForMultiQuoteAPICall(mcsubmissionVM))
            .then(({ result }) => {
                trackAPICallSuccess('applyDiscountOnMulticar');
                setTotalDiscount(result.totalMPDiscount.toFixed(2));
                _.set(mcsubmissionVM, 'value', result);
                createMCCustomizeSubVM();
                hideLoader();
            }).catch((error) => {
                trackAPICallFail('applyDiscountOnMulticar', 'applyDiscountOnMulticar Failed');
                hideLoader();
                setErrorStatusCode(error.status);
            });
    };
    let paramvalues;

    const onDeleteVehicleConfirm = () => {
        if (!deleteVehicle) return;
        const mcsubmissionVMCloned = _.cloneDeep(mcsubmissionVM);
        if (mcsubmissionVMCloned.value.quotes.length > 2) {
            showLoader();
            HDQuoteService.multiQuote(getDataForMultiQuote(mcsubmissionVMCloned, deletedVehicleQuoteID, false))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    applyDiscountAPITriggerPoint();
                    setRemoveVehicle(false);
                    trackQuoteData(result, translator);
                    trackAPICallSuccess('Multi Quote');
                    hideDeleteModal();
                    window.scroll(0, 0);
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    hideLoader();
                    window.scroll(0, 0);
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    hideDeleteModal();
                });
        } else {
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    const retrieveQuoteObject = result;
                    if (result) {
                        _.set(submissionVM, 'value', result);
                        // reset car index dispatch
                        dispatch(resetCurrentPageIndex());
                        // checking for cover
                        let offeredQuotes = retrieveQuoteObject.quoteData.offeredQuotes || [];
                        offeredQuotes = offeredQuotes || [];

                        const filteredOfferedQuotes = offeredQuotes.filter((offeredQuotesObj) => {
                            return offeredQuotesObj.publicID === retrieveQuoteObject.bindData.chosenQuote;
                        });
                        dispatch(setNavigation({ multiCarFlag: false }));
                        dispatch(
                            setOfferedQuotesDetails(filteredOfferedQuotes),
                        );
                        // create drivers states for wizard
                        const drivers = _.get(submissionVM.value, 'lobData.privateCar.coverables.drivers', []);
                        const driversState = [];
                        drivers.forEach((driver) => {
                            driversState.push({ licenceSuccessfulScanned: false, licenceSuccessfulValidated: true, licenceDataChanged: false });
                        });

                        dispatch(setWizardPageState({ drivers: driversState }));
                        dispatch(
                            updateEmailSaveProgress(_.get(result, 'baseData.accountHolder.emailAddress1', '')),
                        );
                        hideLoader();
                        hideDeleteModal();
                        dispatch(setVehicleDetails({}));
                        setRemoveVehicle(false);
                        trackAPICallSuccess('Multi To Single Quote');
                        history.push({
                            pathname: CUSTOMIZE_QUOTE_WIZARD,
                            state: { PCWJourney: true, MultiToSingleCustomize: true }
                        });
                    }
                }).catch((error) => {
                    hideLoader();
                    hideDeleteModal();
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail('Multi To Single Quote', 'Multi To Single Quote Failed');
                });
            showLoader();
        }
    };

    if (viewModelService) {
        if (!multicarsubmissionVMCreated && _.get(mcsubmissionVM, 'value.accountNumber') === undefined) {
            dispatch(setMultiCarSubmissionVM({
                mcsubmissionVM: viewModelService.create(
                    {},
                    'pc',
                    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
                ),
            }));
            setmulticarSubmissionVMCreated(true);
        }
    }

    if (viewModelService) {
        if (!multiCustomizeSubmissionVMCreated && _.get(multiCustomizeSubmissionVM, 'value.customQuotes') === undefined) {
            dispatch(setMultiCustomizeSubmissionVM({
                multiCustomizeSubmissionVM: viewModelService.create(
                    {},
                    'pc',
                    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiCustomQuoteDTO'
                ),
            }));
            setMultiCustomizeSubmissionVMCreated(true);
        }
    }

    useEffect(() => {
        setTotalDiscount(getMultiCarDiscount());
        if (isDiscountApplied && multiCustomizeSubmissionVM) {
            createMCCustomizeSubVM();
            dispatch(setNavigation({
                isDiscountApplied: false
            }));
            setMultiCustomizeSubmissionVMCreated(true);
        }
    }, []);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalue = location.state;
            if (paramvalue && paramvalue.SaveAndReturn) {
                addToast({
                    iconType: 'tick',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

    useEffect(() => {
        if (fetchedQuoteData && !_.get(multiCustomizeSubmissionVM.value, 'mpwrapperNumber', null)) {
            createMCCustomizeSubVM();
            dispatch(setNavigation({
                isDiscountApplied: false
            }));
        }
    }, [fetchedQuoteData]);

    const getParentQuoteID = () => {
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) { return mcsubmissionVM.value.quotes[i].quoteID; }
        }
        return '';
    };

    // To handle the edit/back functionality
    useEffect(() => {
        const isMCCreated = _.get(multiCustomizeSubmissionVM, 'value', null);
        const isMCWrapperCreated = _.get(multiCustomizeSubmissionVM, 'value.mpwrapperNumber', null);
        if (isMCCreated && isMCWrapperCreated && !isDiscountApplied) {
            const checkInnerPaymentType = returnIsMonthlyAvailableForMCCustomizeSubmissionVM(multiCustomizeSubmissionVM);
            const CheckIsMonthlyPaymentAvailable = returnIsMonthlyPaymentAvailable(multiCustomizeSubmissionVM);
            multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuoteObj) => {
                if (customQuoteObj.quote.hastingsPremium.monthlyPayment === undefined) {
                    _.set(customQuoteObj, 'insurancePaymentType', checkInnerPaymentType);
                }
                const annualCost = {
                    quoteID: customQuoteObj.quoteID,
                    annualQuoteAmount: customQuoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount
                };
                setAnnualAmount((prevState) => {
                    return prevState + customQuoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
                });
                annualCostArray.push(annualCost);
                if (customQuoteObj.quoteID === getParentQuoteID()) {
                    if (customQuoteObj.quote.hastingsPremium.monthlyPayment === undefined) {
                        setMonthlyAmount(0);
                        if (!noDDModal.status) {
                            setShowNoDDModal(false);
                        }
                    } else {
                        setAprRate(customQuoteObj.quote.hastingsPremium.monthlyPayment.representativeAPR);
                        setInterestRate(customQuoteObj.quote.hastingsPremium.monthlyPayment.rateOfInterest);
                    }
                    setPaymentType(CheckIsMonthlyPaymentAvailable ? PAYMENT_TYPE_ANNUALLY_CODE : checkInnerPaymentType);
                }

                // restricted if monthly payment is not available
                if (customQuoteObj.quote.hastingsPremium.monthlyPayment !== undefined && !CheckIsMonthlyPaymentAvailable) {
                    setMonthlyAmount((prevState) => {
                        return prevState + customQuoteObj.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount;
                    });
                    setMonthlyInitialPayment((prevState) => {
                        return prevState + customQuoteObj.quote.hastingsPremium.monthlyPayment.firstInstalment.amount;
                    });
                    setMonthlyElevenCombinedPayment((prevState) => {
                        return prevState + customQuoteObj.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount;
                    });
                    setMonthlyTotalAmountCredit((prevState) => {
                        return prevState + customQuoteObj.quote.hastingsPremium.monthlyPayment.totalAmountCredit;
                    });
                }

                const policyInitialStartDate = {
                    quoteID: customQuoteObj.quoteID,
                    initialStartDate: customQuoteObj.periodStartDate,
                    isParentPolicyDate: customQuoteObj.quoteID === getParentQuoteID()
                };

                setInitialPolicyStartDate((prevState) => {
                    return [...prevState, policyInitialStartDate];
                });
                return null;
            });
            setMultiCustomizeSubmissionVMCreated(true);
        }
    }, []);

    const setStartDateVoluntaryExcess = () => {
        const initialStartDateArray = [];
        const excessValueArray = [];
        mcsubmissionVM.quotes.children.map((quoteObj) => {
            const policyInitialStartDate = {
                quoteID: quoteObj.value.quoteID,
                initialStartDate: quoteObj.value.baseData.periodStartDate,
                isParentPolicyDate: quoteObj.value.isParentPolicy
            };
            initialStartDateArray.push(policyInitialStartDate);
            const excessValue = quoteObj.value.lobData.privateCar.coverables.vehicles[0].voluntaryExcess;
            if (excessValue) {
                excessValueArray.push({
                    quoteID: quoteObj.value.quoteID,
                    excessValue: +excessValue
                });
                return +excessValue;
            }
            return null;
        });
        setInitialPolicyStartDate(initialStartDateArray);
    };

    const setMultiCustomizeSubmissionVMRerate = (customUpdatedQuote) => {
        multiCustomizeSubmissionVM.customQuotes.children.map((customQuote) => {
            if (customQuote.value.quoteID === customUpdatedQuote.quoteID) {
                _.set(customQuote, 'value', customUpdatedQuote);
            }
            return null;
        });
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperNumber', mcsubmissionVM.value.mpwrapperNumber);
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperJobNumber', mcsubmissionVM.value.mpwrapperJobNumber);
        _.set(multiCustomizeSubmissionVM.value, 'sessionUUID', mcsubmissionVM.value.sessionUUID);
        const checkInnerPaymentType = returnIsMonthlyAvailableForMCCustomizeSubmissionVM(multiCustomizeSubmissionVM);
        const CheckIsMonthlyPaymentAvailable = returnIsMonthlyPaymentAvailable(multiCustomizeSubmissionVM);
        // check if all the hasting premium object does not have the monthly premium
        if (CheckIsMonthlyPaymentAvailable) {
            // check if all the insurancePaymentType is same or not
            if (checkInnerPaymentType === PAYMENT_TYPE_ANNUALLY_CODE) {
                for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i++) {
                    _.set(multiCustomizeSubmissionVM.value.customQuotes[i], 'insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
                }
                _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
                setPaymentType(PAYMENT_TYPE_ANNUALLY_CODE);
            }
        }
        shouldPNCDShow(multiCustomizeSubmissionVM);
    };

    useEffect(() => {
        const customMultiQuotesResponses = _.get(customMultiQuoteData, 'multiCustomUpdatedQuoteObj.customQuotesResponses', []);
        if (!customMultiQuoteData.loading && customMultiQuotesResponses.length > 0) {
            const customDataTemp = customMultiQuotesResponses;
            let rerateMonthlyAmount = 0;
            let rerateMonthlyElevenCombinedPayment = 0;
            let rerateMonthlyInitialPayment = 0;
            let rerateMonthlyTotalAmountCredit = 0;
            let rerateAnnuallyAmount = 0;
            let childQuoteDeclinedErrorCount = 0;
            let checkMonthlyPaymentAvailable = {};
            for (let i = 0; i < customDataTemp.length; i++) {
                checkMonthlyPaymentAvailable = _.get(customDataTemp[i], 'quote.hastingsPremium.monthlyPayment', {});
                if (Object.entries(checkMonthlyPaymentAvailable).length === 0) {
                    break; // breaks the loop after matching the affordability plan
                }
            }
            customDataTemp.map((customUpdatedQuote) => {
                // for setting voluntary Excess and periodStartDate in mcsubmissionVM from the rerate response
                mcsubmissionVM.quotes.children.map((quoteObj) => {
                    if (quoteObj.value.quoteID === customUpdatedQuote.quoteID) {
                        _.set(quoteObj, 'lobData.privateCar.coverables', customUpdatedQuote.coverables);
                        _.set(quoteObj, 'baseData.periodStartDate.value', customUpdatedQuote.periodStartDate);
                        _.set(quoteObj, 'baseData.periodEndDate.value', customUpdatedQuote.periodEndDate);

                        // check affordability
                        const customMonthlyPayment = _.get(customUpdatedQuote, 'quote.hastingsPremium.monthlyPayment', undefined);
                        if (quoteObj.value.isParentPolicy && customMonthlyPayment === undefined) {
                            setMonthlyAmount(0);
                            if (!noDDModal.status) {
                                setShowNoDDModal(false);
                            }
                        }
                        const customHastingsErrors = _.get(customUpdatedQuote, 'quote.hastingsErrors', []);
                        if (customHastingsErrors.length) {
                            const hasError = checkHastingsErrorFromHastingErrorObj(customHastingsErrors);
                            if (hasError.errorCode && quoteObj.value.isParentPolicy) {
                                setShowDeclineQuote(true);
                            } else if (hasError.errorCode === QUOTE_RATE_ERROR_CODE) {
                                setShowDeclineQuote(true);
                            } else if (hasError.errorCode) {
                                setDeletedVehicleQuoteID(quoteObj.value.quoteID);
                                childQuoteDeclinedErrorCount += 1;
                            }
                        }
                    }
                    return null;
                });
                setStartDateVoluntaryExcess();
                // set monthly breakdown data from rerate response
                const customMonthlyPayment = _.get(customUpdatedQuote, 'quote.hastingsPremium.monthlyPayment', undefined);
                // restricted if monthly data is not available
                if (customMonthlyPayment !== undefined && !(Object.entries(checkMonthlyPaymentAvailable).length === 0)) {
                    rerateMonthlyAmount += customMonthlyPayment.premiumAnnualCost.amount;
                    rerateMonthlyInitialPayment += customMonthlyPayment.firstInstalment.amount;
                    rerateMonthlyElevenCombinedPayment += customMonthlyPayment.elevenMonthsInstalments.amount;
                    rerateMonthlyTotalAmountCredit += customMonthlyPayment.totalAmountCredit;
                }

                const customAnnuallyPayment = _.get(customUpdatedQuote, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
                rerateAnnuallyAmount += customAnnuallyPayment;

                setMultiCustomizeSubmissionVMRerate(customUpdatedQuote);
                return null;
            });
            if (customMultiQuoteData.multiCustomUpdatedQuoteObj.paymentScheduleResponseMP) {
                _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', customMultiQuoteData.multiCustomUpdatedQuoteObj.paymentScheduleResponseMP);
            } else {
                _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
            }
            if (childQuoteDeclinedErrorCount > 0) {
                const result = customDataTemp.length - childQuoteDeclinedErrorCount;
                setChildsQuoteDeclinedErrorCount(result);
                setShowChildsDeclineQuote(true);
            }
            dispatch(resetMultiCustomUpdateQuote());
            setAPITriggerPoint(false);
            setMonthlyAmount(rerateMonthlyAmount);
            setMonthlyInitialPayment(rerateMonthlyInitialPayment);
            setMonthlyElevenCombinedPayment(rerateMonthlyElevenCombinedPayment);
            setMonthlyTotalAmountCredit(rerateMonthlyTotalAmountCredit);
            setAnnualAmount(rerateAnnuallyAmount);
            setUpdateExcessesCounter((prevState) => {
                return prevState + 1;
            });
            hideLoader();
        }
        if (!customMultiQuoteData.loading && _.get(customMultiQuoteData, 'multiCustomQuoteError')) {
            setAPITriggerPoint(false);
            hideLoader();
        }
        window.scroll(0, 0);
    }, [customMultiQuoteData]);

    useEffect(() => {
        dispatch(setNavigation({
            isEditQuoteJourneyDriver: false,
            finishEditingEnabled: false
        }));
        setQuoteStatus(null);
        const ipidObject = mcIpidMatchForAllAPIObject(mcsubmissionVM);
        dispatch(getMCIpidMatchForAll(ipidObject));
        setFetchedQuoteData(true);
        dispatch(resetCurrentPageIndex());
    }, []);

    useEffect(() => {
        if (fetchedQuoteData) {
            const data = (paymentType === PAYMENT_TYPE_ANNUALLY_CODE)
                ? {
                    price: annualAmount,
                    text: `Total price for ${mcsubmissionVM.value.quotes.length} cars\nPay in full`,
                    currency: '£'
                }
                : {
                    price: monthlyAmount,
                    text: `Total amount for ${mcsubmissionVM.value.quotes.length} cars\nPay monthly`,
                    currency: '£'
                };
            setTotalPrice(data);
        }
    }, [fetchedQuoteData, annualAmount, monthlyAmount, paymentType]);

    const getPCStartDate = () => {
        let pcStartDate = _.get(mcsubmissionVM.value.quotes[0], 'baseData.pccurrentDate', new Date());
        pcStartDate = new Date(pcStartDate);
        pcStartDate = Date.UTC(pcStartDate.getUTCFullYear(), pcStartDate.getUTCMonth(), pcStartDate.getUTCDate());
        const pcStartDateObject = (pcStartDate) ? new Date(pcStartDate) : new Date();
        pcStartDateObject.setHours(0, 0, 0, 0);
        return pcStartDateObject;
    };

    const checkTwoCarDefCaseFromDate = () => {
        let scndQuoteStartDate = null;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            if (customQuoteObj.quoteID !== getParentQuoteID()) {
                scndQuoteStartDate = customQuoteObj.periodStartDate;
            }
            return null;
        });
        const pcDate = dayjs(getPCStartDate());
        const scndStartDate = dayjs(`${_.get(scndQuoteStartDate, 'year')}-${1 + _.get(scndQuoteStartDate, 'month')}-${_.get(scndQuoteStartDate, 'day')}`);
        return scndStartDate.diff(pcDate, 'day') > 30;
    };

    const checkTwoCarDefferedCase = () => {
        if (!mcPaymentScheduleModel.mcPaymentScheduleObject) {
            return checkTwoCarDefCaseFromDate();
        }
        if (mcPaymentScheduleModel && mcPaymentScheduleModel.mcPaymentScheduleObject.length > 1) {
            return mcPaymentScheduleModel.mcPaymentScheduleObject[0].paymentSchedule.length
                !== mcPaymentScheduleModel.mcPaymentScheduleObject[1].paymentSchedule.length;
        }
        return false;
    };

    const generateButtonBreakdownData = () => {
        const carInstalments = {
            parentCarInstalments: null,
            childCarInstalments: null
        };
        if (mcPaymentScheduleModel && _.get(mcPaymentScheduleModel, 'mcPaymentScheduleObject', []).length > 1) {
            if (mcPaymentScheduleModel.mcPaymentScheduleObject[0].paymentSchedule.length
                > mcPaymentScheduleModel.mcPaymentScheduleObject[1].paymentSchedule.length) {
                carInstalments.parentCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[0];
                carInstalments.childCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[1];
            } else {
                carInstalments.parentCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[1];
                carInstalments.childCarInstalments = mcPaymentScheduleModel.mcPaymentScheduleObject[0];
            }
        }
        return carInstalments;
    };

    const getMonthlyButtonContent = () => {
        if (fetchedQuoteData && mcsubmissionVM.value.quotes.length > 2) {
            return (
                <Row className="mc-customize-quote-summary__payment-content">
                    <Col className="mc-customize-quote-summary__btn-col">
                        <HDLabelRefactor className="pay-monthly-three font-bold" Tag="p" text={messages.payMonthlyHeader} />
                        <HDLabelRefactor
                            className="total-price-n-cars"
                            Tag="h2"
                            text={messages.totalPriceForNCars.replace(CAR_NUMBERS, mcsubmissionVM.value.quotes.length)} />
                        <HDLabelRefactor
                            className="total-price-n-cars-amount"
                            Tag="h1"
                            text={displayAmount((monthlyAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} />
                        {paymentType === PAYMENT_TYPE_ANNUALLY_CODE && (
                            <HDLabelRefactor
                                className="mc-customize-quote-summary__payment-summary-text decorated-blue-line theme-white"
                                text={messages.payMonthlySummaryText}
                                Tag="a" />
                        )}
                    </Col>
                </Row>
            );
        }
        if (fetchedQuoteData && mcsubmissionVM.value.quotes.length < 3 && checkTwoCarDefferedCase()) {
            const carInstalments = generateButtonBreakdownData();
            let firstInitialPayment = 0;
            const carInstalmentsParentCar = _.get(carInstalments, 'parentCarInstalments.paymentSchedule[0].paymentAmount.amount', 0);
            const carInstalmentsChildCar = _.get(carInstalments, 'childCarInstalments.paymentSchedule[0].paymentAmount.amount', 0);
            if (!checkTwoCarDefCaseFromDate()) {
                firstInitialPayment = carInstalmentsParentCar + carInstalmentsChildCar;
            } else {
                firstInitialPayment = carInstalmentsParentCar;
            }
            return (
                carInstalments.parentCarInstalments && carInstalments.childCarInstalments && (
                    <Row className="mc-customize-quote-summary__payment-content">
                        <Col className="mc-customize-quote-summary__btn-col">
                            <HDLabelRefactor className="payment-header text-regular-1 font-bold" Tag="p" text={messages.payMonthlyHeader} />
                            <Row className="payment-value-def font-bold">
                                <Col>
                                    <span className="prefix">
                                        {carInstalments.parentCarInstalments && carInstalments.parentCarInstalments.paymentSchedule && carInstalments.childCarInstalments
                                        && carInstalments.childCarInstalments.paymentSchedule && messages.payMonthlyPrefix.replace(
                                            '11', carInstalments.parentCarInstalments.paymentSchedule.length - carInstalments.childCarInstalments.paymentSchedule.length
                                        )}
                                    </span>
                                    {displayAmount((_.get(carInstalments, 'parentCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                                </Col>
                            </Row>
                            <HDLabelRefactor
                                className="payment-description-bottom"
                                Tag="p"
                                text={messages.payMonthlyInitalPaymentInfo.replace(INITIAL_PAYMENT_AMOUNT,
                                    displayAmount((firstInitialPayment).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })))} />
                            <Row className="payment-value-def payment-value-scnd font-bold">
                                <Col>
                                    <span className="prefix">{messages.payMonthlyPrefix.replace('11', carInstalments.childCarInstalments.paymentSchedule.length - 1)}</span>
                                    {displayAmount((_.get(carInstalments, 'parentCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)
                                    + _.get(carInstalments, 'childCarInstalments.paymentSchedule[1].paymentAmount.amount', 0)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                                </Col>
                            </Row>
                            {checkTwoCarDefCaseFromDate() && carInstalments.childCarInstalments ? (
                                <HDLabelRefactor
                                    className="payment-description-bottom"
                                    Tag="p"
                                    text={messages.payMonthlyInitalPaymentInfo.replace(INITIAL_PAYMENT_AMOUNT,
                                        displayAmount((_.get(carInstalments, 'childCarInstalments.paymentSchedule[0].paymentAmount.amount', 0)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })))} />
                            ) : null}
                            {paymentType === PAYMENT_TYPE_ANNUALLY_CODE && (
                                <HDLabelRefactor
                                    className="mc-customize-quote-summary__payment-summary-text decorated-blue-line theme-white"
                                    text={messages.payMonthlySummaryText}
                                    Tag="a" />
                            )}
                        </Col>
                    </Row>
                ));
        } if (fetchedQuoteData && mcsubmissionVM.value.quotes.length < 3 && !checkTwoCarDefferedCase()) {
            return (
                <Row className="mc-customize-quote-summary__payment-content">
                    <Col className="mc-customize-quote-summary__btn-col">
                        <HDLabelRefactor
                            className="mc-customize-quote-summary__payment-header text-regular-1 font-bold"
                            Tag="h4"
                            text={messages.payMonthlyHeader} />
                        <Row className="mc-customize-quote-summary__payment-value font-bold">
                            <Col className="mc-customize-quote-summary__payment-value--monthly">
                                <span className="mc-customize-quote-summary__prefix">{messages.payMonthlyPrefix}</span>
                                {displayAmount((monthlyElevenCombinedPayment).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                            </Col>
                        </Row>
                        <HDLabelRefactor
                            className="mc-customize-quote-summary__payment-description-bottom mb-1"
                            Tag="p"
                            text={messages.payMonthlyInitalPaymentInfo.replace(INITIAL_PAYMENT_AMOUNT, displayAmount((monthlyIntialPayment).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })))} />
                        {paymentType === PAYMENT_TYPE_ANNUALLY_CODE && (
                            <Row>
                                <Col className="px-0">
                                    <HDLabelRefactor
                                        className="mc-customize-quote-summary__payment-summary-text decorated-blue-line theme-white"
                                        text={messages.payMonthlySummaryText}
                                        Tag="a" />
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            );
        }
        return null;
    };
    const loadData = () => {
        if (fetchedQuoteData && multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes
            && multiCustomizeSubmissionVM.value.customQuotes.length === mcsubmissionVM.value.quotes.length) {
            return true;
        }
        return false;
    };
    const monthlyPayment = {
        value: PAYMENT_TYPE_MONTHLY_CODE,
        content: loadData() && monthlyAmount ? getMonthlyButtonContent() : null,
        name: messages.payMonthlyHeader
    };

    const getMissingMonthlyExplanation = () => {
        return (
            <div
                role="button"
                tabIndex={0}
                className="payment-explanation-link mt-3"
                onClick={() => setShowMissingMonthlyPaymentsPopup(true)}
                onKeyDown={() => setShowMissingMonthlyPaymentsPopup(true)}
            >
                {messages.missingMonthlyPaymentExplanation}
            </div>
        );
    };

    const getAnnuallyButtonContent = () => {
        if (fetchedQuoteData && mcsubmissionVM.value.quotes.length > 2) {
            return (
                <Row className="mc-customize-quote-summary__payment-content">
                    <Col className="mc-customize-quote-summary__btn-col">
                        <HDLabelRefactor className="pay-monthly-three font-bold" Tag="p" text={messages.payAnnuallyHeader} />
                        <HDLabelRefactor
                            className="total-price-n-cars"
                            Tag="h2"
                            text={messages.totalPriceForNCars.replace(CAR_NUMBERS, mcsubmissionVM.value.quotes.length)} />
                        <HDLabelRefactor
                            className="total-price-n-cars-amount"
                            Tag="h1"
                            text={displayAmount((annualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} />
                        {!monthlyAmount && getMissingMonthlyExplanation()}
                    </Col>
                </Row>
            );
        }
        if (fetchedQuoteData && mcsubmissionVM.value.quotes.length < 3 && checkTwoCarDefCaseFromDate()) {
            let parentAnnualAmount;
            let childAnnualAmount;
            const parentQuoteID = getParentQuoteID();
            multiCustomizeSubmissionVM.value.customQuotes.map((quoteObject) => {
                if (quoteObject.quoteID === parentQuoteID) {
                    parentAnnualAmount = _.get(quoteObject, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', null);
                } else {
                    childAnnualAmount = _.get(quoteObject, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', null);
                }
                return null;
            });
            return (
                <Row className="mc-customize-quote-summary__payment-content">
                    <Col className="mc-customize-quote-summary__btn-col">
                        <HDLabelRefactor className="payment-header text-regular-1 font-bold" Tag="p" text={messages.payAnnuallyHeader} />
                        <Row className={`payment-value-def font-bold${!monthlyAmount ? ' pay-value-height' : ''}`}>
                            <Col>
                                <span className="prefix">{messages.payAnnuallyPrefix}</span>
                                {parentAnnualAmount && displayAmount((parentAnnualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                                {!monthlyAmount && <HDLabelRefactor className="pay-today-later text-regular-1" Tag="p" text={messages.payToday} />}
                            </Col>
                        </Row>
                        <Row className={`payment-value-def font-bold${!monthlyAmount ? ' pay-value-height' : ''}
                        ${!monthlyAmount ? ' payment-value-ann-scnd-nodd' : ' payment-value-ann-scnd'}`}
                        >
                            <Col>
                                <span className="prefix">{messages.payAnnuallyPrefix}</span>
                                {childAnnualAmount && displayAmount((childAnnualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                                {!monthlyAmount && <HDLabelRefactor className="pay-today-later text-regular-1" Tag="p" text={messages.payLater} />}
                            </Col>
                        </Row>
                        {!monthlyAmount && getMissingMonthlyExplanation()}
                    </Col>
                </Row>
            );
        }
        if (fetchedQuoteData && mcsubmissionVM.value.quotes.length < 3 && !checkTwoCarDefCaseFromDate()) {
            return (
                <Row className="mc-customize-quote-summary__payment-content">
                    <Col className="mc-customize-quote-summary__btn-col">
                        <HDLabelRefactor
                            className="mc-customize-quote-summary__payment-header text-regular-1 font-bold"
                            Tag="h4"
                            text={messages.payAnnuallyHeader} />
                        <Row className="mc-customize-quote-summary__payment-value font-bold">
                            <Col className="mc-customize-quote-summary__payment-value--monthly">
                                {displayAmount((annualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                            </Col>
                        </Row>
                        {!monthlyAmount && (
                            <Row>
                                <Col>
                                    <HDLabelRefactor className={`${(!monthlyAmount) ? 'annual-only__bold' : ''}`} Tag="p" text={getMissingMonthlyExplanation()} />
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            );
        }
        return null;
    };

    const annuallyPayment = {
        value: PAYMENT_TYPE_ANNUALLY_CODE,
        content: loadData() ? getAnnuallyButtonContent() : null,
        name: messages.payAnnuallyHeader
    };
    const getPaymentTypes = () => (monthlyAmount ? [monthlyPayment, annuallyPayment] : [annuallyPayment]);

    const validateStartDates = (quote) => {
        const pcDate = dayjs(getPCStartDate());
        const mcQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
        const parentCarStartDate = mcQuotes.find((date) => date.isParentPolicy).baseData.periodStartDate;
        if (quote.baseData.periodStartDate && parentCarStartDate) {
            const startDate = dayjs(getDateFromParts(quote.baseData.periodStartDate));
            const parentPolicyStartDate = dayjs(getDateFromParts(parentCarStartDate));
            if (quote.isParentPolicy) {
                return startDate.isAfter(pcDate.subtract(1, 'day')) && startDate.isBefore(pcDate.add(31, 'day'));
            }
            if (!quote.isParentPolicy) {
                return startDate.isAfter(pcDate.subtract(1, 'day'))
                    && startDate.isAfter(parentPolicyStartDate.subtract(1, 'day')) && startDate.isBefore(pcDate.add(335, 'day'));
            }
        }
        return false;
    };

    const customeContinueValidation = () => {
        let isAnyDateInValid = false;
        const mcQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
        mcQuotes.forEach((quoteObject) => {
            const checkFieldValidationOfDate = validateStartDates(quoteObject);
            if (!checkFieldValidationOfDate) isAnyDateInValid = true;
        });
        checkbuttonDisabled(!isAnyDateInValid);
    };

    const displayRerateModal = (quote) => {
        setDateTriggerObject((prevState) => {
            return {
                ...prevState,
                quoteID: quote.quoteID,
                triggerCounter: prevState.triggerCounter + 1
            };
        });
        if (multiCustomizeSubmissionVMCreated && validateStartDates(quote)) {
            let paramCustomSubVM = null;
            multiCustomizeSubmissionVM.value.customQuotes.map((customSubmissionVM) => {
                if (customSubmissionVM.quoteID === quote.quoteID) {
                    paramCustomSubVM = _.cloneDeep(customSubmissionVM);
                    _.set(paramCustomSubVM, 'periodStartDate', quote.baseData.periodStartDate);
                    const params = {
                        sessionUUID: mcsubmissionVM.value.sessionUUID,
                        mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
                        mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
                        customQuotes: [paramCustomSubVM]
                    };
                    setAPITriggerPoint(true);
                    dispatch(updateMultiCustomQuote(params));
                }
                return null;
            });
            if (!rerateModal.status) {
                dispatch(markRerateModalAsDisplayedAction());
                setShowRerateModal(true);
            }
        }
    };

    // useEffect for showing loader, created a different useEffect because of dependency on some local states
    useEffect(() => {
        if (customMultiQuoteData.loading && !showRerateModal && !isMaxExcessModalShown) {
            showLoader();
        }
    }, [customMultiQuoteData, showRerateModal, isMaxExcessModalShown]);

    const displayRerateModalForStartDateSelected = (event, quote) => {
        const newPolicyStartDate = quote.baseData.periodStartDate;
        let initialStartDateCheck;
        initialPolicyStartDate.map((policy) => {
            if (policy.quoteID === quote.quoteID) {
                initialStartDateCheck = policy.initialStartDate;
            }
            return null;
        });
        if (!_.isEqual(newPolicyStartDate, initialStartDateCheck)) {
            displayRerateModal(quote);
        }
    };

    const displayRerateModalForStartDate = (event, quote) => {
        const newPolicyStartDate = quote.baseData.periodStartDate;
        let initialStartDateCheck;
        initialPolicyStartDate.map((policy) => {
            if (policy.quoteID === quote.quoteID) {
                initialStartDateCheck = policy.initialStartDate;
            }
            return null;
        });

        if (newPolicyStartDate && newPolicyStartDate.year && (newPolicyStartDate.month || newPolicyStartDate.month === 0) && newPolicyStartDate.day) {
            const seletedDate = new Date(newPolicyStartDate.year, newPolicyStartDate.month, newPolicyStartDate.day);
            if (!_.isEqual(newPolicyStartDate, initialStartDateCheck) && event.target && event.target.value !== undefined) {
                if (event.relatedTarget === null || (event.relatedTarget.id !== 'hd-date-picker-date-input-month' && event.relatedTarget.id !== 'hd-date-picker-date-input-year' && event.relatedTarget.id !== 'hd-date-picker-date-input-day')) {
                    displayRerateModal(quote); // above condition to block api call on auto tab change
                }
            }
        }
        // trigger below custom validation on change event to validate using updated input values
        // customeContinueValidation();
    };

    const closeReratePopup = () => {
        setShowRerateModal(false);
    };

    const noDDModalPayInFull = () => {
        setShowNoDDModal(false);
        if (!noDDModal.status) {
            dispatch(markNoDDModalAsDisplayedAction());
        }
    };

    const noDDModalContinueOriginalQuote = () => {
        setShowNoDDModal(false);
        if (!noDDModal.status) {
            dispatch(markNoDDModalAsDisplayedAction());
        }
    };

    const handleExcessChange = ({ target: { value: selectedVoluntaryExcess } }, quoteObj, hdProps) => {
        const previousFormValue = hdProps.values[voluntaryExcessFieldName].value;
        const isSameSelected = previousFormValue === selectedVoluntaryExcess.value;

        if (isSameSelected) {
            return;
        }

        if (selectedVoluntaryExcess.value > +MAX_EXCESS_VALUE) {
            setIsMaxExcessModalShown(true);
            hdProps.setFieldValue(voluntaryExcessFieldName, { value: MAX_EXCESS_VALUE, label: maxExcessLabel });
            const quoteId = quoteObj.value.quoteID;
            const customSubmissionVM = multiCustomizeSubmissionVM.value.customQuotes.find((cQuote) => cQuote.quoteID === quoteId);
            _.set(customSubmissionVM, voluntaryExcessFieldName, MAX_EXCESS_VALUE);
            _.set(quoteObj, voluntaryExcessPath, MAX_EXCESS_VALUE);
            if (previousFormValue !== MAX_EXCESS_VALUE) {
                displayRerateModal(quoteObj.value, true);
            }
            return;
        }

        const quoteId = quoteObj.value.quoteID;
        const customSubmissionVM = multiCustomizeSubmissionVM.value.customQuotes.find((cQuote) => cQuote.quoteID === quoteId);
        _.set(customSubmissionVM, voluntaryExcessFieldName, selectedVoluntaryExcess.value);
        _.set(quoteObj, voluntaryExcessPath, selectedVoluntaryExcess.value);
        hdProps.setFieldValue(voluntaryExcessFieldName, selectedVoluntaryExcess);
        forceUpdate();

        displayRerateModal(quoteObj.value);
    };

    const handleMaxExcessConfirm = () => {
        setIsMaxExcessModalShown(false);
    };

    const handleValidation = (isValid) => { };

    const getAvailableVoluntaryExcessValues = (quoteVM) => {
        return _.get(quoteVM, voluntaryExcessPath)
            .aspects
            .availableValues
            .map((excess) => ({
                value: excess.code,
                label: displayAmount(translator({
                    id: excess.name,
                    defaultMessage: excess.name
                }))
            }));
    };

    const childEventHandler = (event, data, quoteID) => {
        for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i += 1) {
            if (multiCustomizeSubmissionVM.value.customQuotes[i].quoteID === quoteID) {
                _.set(multiCustomizeSubmissionVM.value.customQuotes[i], 'coverType', data.target.value.value);
                const customQuoteParam = _.cloneDeep(multiCustomizeSubmissionVM.value.customQuotes[i]);
                _.set(customQuoteParam, 'coverages.privateCar.ancillaryCoverages', []);
                _.set(customQuoteParam, 'coverages.privateCar.vehicleCoverages', []);
                const params = {
                    sessionUUID: mcsubmissionVM.value.sessionUUID,
                    mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
                    mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
                    customQuotes: [customQuoteParam]
                };
                setAPITriggerPoint(true);
                dispatch(updateMultiCustomQuote(params));
                if (!rerateModal.status) {
                    dispatch(markRerateModalAsDisplayedAction());
                    setShowRerateModal(true);
                }
                break;
            }
        }
    };

    const VEHICLE_PATH = routes.VEHICLE_DETAILS;
    const DRIVER_PATH = routes.MC_MILESTONE;
    const editDriverVehicle = (driverVehiclePath, quoteObj) => {
        // filter the data which selected for edit
        const filterSubmissionFromMCSubmissionVM = mcsubmissionVM.value.quotes.filter((item) => {
            return quoteObj.value.quoteID === item.quoteID;
        });
        const initData = _.cloneDeep(filterSubmissionFromMCSubmissionVM);
        const mcsubmissionVMBeforeEdit = _.get(mcsubmissionVM, 'value');
        if (driverVehiclePath === VEHICLE_PATH) {
            const quoteObject = _.cloneDeep(quoteObj.value);
            _.set(submissionVM, 'value', quoteObject);
            dispatch(setNavigation({
                isEditedDataSynced: false,
                MCSingalQuoteEditObject: initData[0],
                MCSingalQuoteIDForSync: quoteObj.value.quoteID,
                isEditTriggered: true,
                mcsubmissionVMBeforeEdit: mcsubmissionVMBeforeEdit,
                vehicleEdited: true,
                finishEditingEnabled: true
            }));
        } else {
            dispatch(setNavigation({
                isEditedDataSynced: false,
                MCSingalQuoteIDForSync: null,
                MCSingalQuoteEditObject: null,
            }));
        }
        dispatch(setNavigation({
            isAppStartPoint: true,
            isEditQuoteJourney: true,
            multiCarFlag: true,
            isAddAnotherCar: false,
            isEditQuoteJourneyDriver: true
        }));
        history.push({
            pathname: driverVehiclePath,
            state: {
                fromPage: history.location.pathname
            }
        });
    };

    const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE, QUOTE_RATE_ERROR_CODE];
    const hasHastingsErrors = (offeredQuote) => {
        return offeredQuote && (offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1));
    };

    const getHastingsPremiumCSVM = (submissionVMID) => {
        let hastingsPremiumObj = null;
        multiCustomizeSubmissionVM.value.customQuotes.map((customizeSVMObj) => {
            if (customizeSVMObj.quoteID === submissionVMID) { hastingsPremiumObj = customizeSVMObj.quote.hastingsPremium; }
            return null;
        });
        return hastingsPremiumObj;
    };

    const getQuoteCards = (multicarSubmissionVM) => multicarSubmissionVM.quotes.children.map((quoteObj) => {
        const submission = quoteObj.value;

        const {
            lobData: { privateCar: { coverables: { vehicles } } },
            quoteData: { offeredQuotes },
            quoteID,
            isParentPolicy,
        } = submission;

        const {
            registrationsNumber, make, model, voluntaryExcess
        } = vehicles[0];

        const hastingsPremium = getHastingsPremiumCSVM(quoteID);

        const isAnualAmount = _.get(hastingsPremium, 'annuallyPayment.premiumAnnualCost', 0);
        const isMonthlyAmount = _.get(hastingsPremium, 'monthlyPayment.premiumAnnualCost', 0);

        const quoteAmount = paymentType === PAYMENT_TYPE_ANNUALLY_CODE
            ? isAnualAmount
            : isMonthlyAmount;
        const defaultQuoteAmount = { amount: 0, currency: 'gbp' };

        const availableVoluntaryValues = getAvailableVoluntaryExcessValues(quoteObj);
        const getNcdProtectionInd = _.get(quoteObj, 'value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD', false);

        return (
            <Row className="mc-customize-quote-summary__quote-card mc-customize-quote-summary__part theme-white" key={`quoteCard${quoteID}`}>
                <Col className="px-0">
                    <Row className="mc-customize-quote-summary__quote-header">
                        <Col>
                            <Row>
                                <Col className="mc-customize-quote-summary__car-reg-number-container">
                                    <span className="mc-customize-quote-summary__car-reg-number">
                                        {formatRegNumber(registrationsNumber)}
                                    </span>
                                </Col>
                                <Col className="text-right">
                                    {!isParentPolicy
                                        ? (
                                            <span
                                                role="button"
                                                tabIndex={0}
                                                className="mc-customize-quote-summary__remove-car"
                                                onClick={() => onDelete(quoteID)}
                                                onKeyDown={onDelete}
                                            >
                                                Remove Car
                                            </span>
                                        ) : null}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mc-customize-quote-summary__car-details">
                        <Col>
                            <Row className="mc-customize-quote-summary__car-name mb-3">
                                <Col className="d-flex flex-row">
                                    <HDLabelRefactor
                                        className="mc-customize-quote-summary__label-text"
                                        Tag="h3"
                                        size="xs"
                                        text={make.toLowerCase()} />
                                    <HDLabelRefactor
                                        className="mc-customize-quote-summary__label-text pl-2"
                                        Tag="h3"
                                        size="xs"
                                        text={twoWords(model.toLowerCase())} />
                                </Col>
                            </Row>
                            <Row className="mc-customize-quote-summary__car-info">
                                <Col xs={12} sm="auto" className="mc-customize-quote-summary__car-info-one pr-lg-4 mb-1 mb-sm-0">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => editDriverVehicle(VEHICLE_PATH, quoteObj)}
                                        onKeyDown={() => editDriverVehicle(VEHICLE_PATH, quoteObj)}
                                        id="edit-vehicle-button"
                                    >
                                        <img src={carIcon} alt="Car Icon" width="40" />
                                        <HDLabelRefactor
                                            webAnalyticsEvent={{ event_action: messages.quoteSummary }}
                                            id="view-edit-car-button-link"
                                            Tag="a"
                                            text={messages.viewEditCar}
                                            className="customize-quote-summary__text-style-edit ml-2 mr-3" />
                                    </div>
                                </Col>
                                <Col xs="auto" className="mc-customize-quote-summary__edit-driver">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => editDriverVehicle(DRIVER_PATH, quoteObj)}
                                        onKeyDown={() => editDriverVehicle(DRIVER_PATH, quoteObj)}
                                        id="edit-drivers-button"
                                    >
                                        <img src={driverIcon} alt="Driver Icon" width="40" />
                                        <HDLabelRefactor
                                            id="view-edit-driver-button-link"
                                            webAnalyticsEvent={{ event_action: messages.quoteSummary }}
                                            Tag="a"
                                            text={messages.viewEditDrivers}
                                            className="customize-quote-summary__text-style-edit ml-2 ml-sm-0" />
                                    </div>
                                </Col>
                                <Col className="mc-customize-quote-summary__car-info-two">
                                    <HDLabelRefactor
                                        className="mc-customize-quote-summary__quote-amount mb-0"
                                        Tag="p"
                                        text={getPriceWithCurrencySymbol(quoteAmount || defaultQuoteAmount)} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    { initialPolicyStartDate.length && (
                        <HDMCCQSPCardForm
                            submissionVM={quoteObj}
                            handleValidation={handleValidation}
                            handleExcessChange={handleExcessChange}
                            displayRerateModalForStartDate={displayRerateModalForStartDate}
                            voluntaryExcess={+voluntaryExcess}
                            availableVoluntaryExcessValues={availableVoluntaryValues}
                            initialPolicyStartDate={initialPolicyStartDate}
                            pageMetadata={pageMetadata}
                            aPITriggerPoint={aPITriggerPoint}
                            displayRerateModalForStartDateSelected={displayRerateModalForStartDateSelected}
                            updateExcessesCounter={updateExcessesCounter}
                            dateTriggerObject={dateTriggerObject}
                            triggerOnChange={customeContinueValidation} />
                    )}
                    <Row className="cover-details mx-0">
                        <Col>
                            <HDCoverDetailsPage
                                multiCarFlag
                                offeredQuotes={!hasHastingsErrors(multiCustomizeSubmissionVM.value.customQuotes.find((cQuote) => cQuote.quoteID === quoteID).quote)
                                    ? [multiCustomizeSubmissionVM.value.customQuotes.find((cQuote) => cQuote.quoteID === quoteID).quote]
                                    : []}
                                customizeSubmissionVM={multiCustomizeSubmissionVM.value.customQuotes.find(
                                    (cQuote) => cQuote.quoteID === quoteID
                                )}
                                registrationNumber={registrationsNumber}
                                pageMetadata={pageMetadata}
                                handleParentEvent={(event, data) => childEventHandler(event, data, quoteID)}
                                ancillaryCoveragesObject={ancillaryCoveragesObject}
                                protectNcd={getNcdProtectionInd} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    });

    const getMonthlyPaymentBreakdown = () => {
        return (
            <HDMCCQSPMonthlyBreakdown
                deferredCase={deferredCase}
                aprRate={aprRate}
                interestRate={interestRate}
                monthlyAmount={monthlyAmount}
                monthlyElevenCombinedPayment={monthlyElevenCombinedPayment}
                monthlyIntialPayment={monthlyIntialPayment}
                monthlyTotalAmountCredit={monthlyTotalAmountCredit}
                multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                mcsubmissionVM={mcsubmissionVM}
                mcPaymentScheduleModel={mcPaymentScheduleModel} />
        );
    };

    const getBasicInfoClass = () => {
        if (mcsubmissionVM.value.quotes.length < 3 && checkTwoCarDefferedCase()) {
            if (monthlyAmount) {
                return 'deferred-btn';
            }
            return 'deferred-btn-ann';
        } if (mcsubmissionVM.value.quotes.length < 3) {
            if (monthlyAmount) {
                return null;
            }
            return 'default-ann';
        }
        if (monthlyAmount) {
            return 'n-cars-button';
        }
        return 'n-cars-button-ann';
    };

    const handlePaymentTypeChange = (event) => {
        setPaymentType(event.target.value);
        if (monthlyAmount) {
            multiCustomizeSubmissionVM.value.customQuotes.map((customQuote) => {
                _.set(customQuote, 'insurancePaymentType', event.target.value);
                return null;
            });
            _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', event.target.value);
        }
    };

    const getErrorModalHeader = () => {
        if (errorObject.parentError) {
            if (errorObject.errorCode === CUE_ERROR_CODE) {
                return messages.referralErrorModalHeader;
            }
            return messages.homePageModalHeader;
        }
        return messages.noQuoteForCarModalHeader;
    };

    const getErrorModalContent = () => {
        if (errorObject.errorCode === CUE_ERROR_CODE && errorObject.parentError) {
            return (
                <div>
                    <div>{messages.referralErrorModalBodyOne}</div>
                    <div className="gen-hrs-msg">{messages.generalHoursMessage}</div>
                    <div className="gen-hrs-container">
                        <div className="gen-hrs-row">
                            <div className="gen-hrs-left">{OPENING_HOURS[0].days}</div>
                            <div>{OPENING_HOURS[0].hours}</div>
                        </div>
                        <div className="gen-hrs-row">
                            <div className="gen-hrs-left">{OPENING_HOURS[1].days}</div>
                            <div>{OPENING_HOURS[1].hours}</div>
                        </div>
                        <div className="gen-hrs-row">
                            <div className="gen-hrs-left">{OPENING_HOURS[2].days}</div>
                            <div>{OPENING_HOURS[2].hours}</div>
                        </div>
                    </div>
                    <div>{messages.referralErrorModalBodyTwo}</div>
                </div>
            );
        }
        if (!errorObject.parentError) {
            return (
                <div>
                    <div>
                        <span className="error-modal-vrn">AV12 BGE</span>
                    </div>
                    <div className="error-modal-car-name">
                        Land Rover Discovery Sport
                    </div>
                    <div>
                        {errorObject.errorCode === CUE_ERROR_CODE ? messages.referralErrorChildContent : messages.noQuoteForCarModalBody}
                    </div>
                </div>
            );
        }
        return messages.homePageModalBody;
    };

    const getErrorModalContinueLabel = () => {
        if (errorObject.parentError) {
            return messages.homePageButtonContent;
        }
        return messages.noQuoteForCarButtonContent;
    };

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    useEffect(() => {
        if (removeVehicle) {
            onDeleteVehicleConfirm();
        }
    }, [removeVehicle]);

    const childsDeclineQuote = () => {
        setShowChildsDeclineQuote(false);
        setDeleteVehicle(true);
        setRemoveVehicle(true);
    };

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 10, offset: 1 }
    };

    return (
        <>
            {loadData() ? (
                <Container fluid>
                    <div className="mc-customize-quote-summary">
                        <div className="arc-header">
                            <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                        </div>
                        <Container>
                            <Row>
                                <Col {...mainColProps}>
                                    <Row className="mc-customize-quote-summary__part">
                                        <Col className={`mc-customize-quote-summary__basic-info-part ${getBasicInfoClass()}`}>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Col>
                                                            <HDLabelRefactor
                                                                className="mc-customize-quote-summary__your-quote-header text-center mt-5 mb-5"
                                                                Tag="h1"
                                                                text={messages.yourQuoteHeader} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className="text-center">
                                                            <HDToggleButtonGroupRefactor
                                                                webAnalyticsEvent={{ event_action: messages.selectPaymentType }}
                                                                id="payment-type-button-group"
                                                                className={`customize-quote-summary__month-year-buttons mc-customize-quote-summary__month-year-buttons
                                                                        ${classNames({ 'only-annually d-inline-flex flex-column': !monthlyAmount })}`}
                                                                availableValues={getPaymentTypes()}
                                                                value={paymentType}
                                                                onChange={(event) => handlePaymentTypeChange(event)} />

                                                            {paymentType === PAYMENT_TYPE_MONTHLY_CODE && getMonthlyPaymentBreakdown()}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mc-customize-quote-summary__quote-notice mb-3">
                                                        <Col>
                                                            <HDQuoteInfoRefactor
                                                                className="mc-customize-quote-summary__quote-notice__quote-info text-small"
                                                            >
                                                                <span>
                                                                    {messages.priceInfo}
                                                                </span>
                                                            </HDQuoteInfoRefactor>
                                                        </Col>
                                                    </Row>
                                                    {paymentType === PAYMENT_TYPE_MONTHLY_CODE && (
                                                        <Row>
                                                            <Col>
                                                                <HDQuoteInfoWarning className="customize-quote-summary__quote-notice__quote-info text-small">
                                                                    <span>
                                                                        {messages.warningInfo}
                                                                    </span>
                                                                </HDQuoteInfoWarning>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    <Row className="mc-customize-quote-summary__quote-info mb-1">
                                                        <Col md={{ span: 6 }} className="mc-customize-quote-summary__quote-info-col">
                                                            <HDLabelRefactor
                                                                className="mc-customize-quote-summary__ref-label mb-0 mr-1"
                                                                text={messages.quoteRefLabel}
                                                                Tag="p" />
                                                            <span className="mc-customize-quote-summary__quote-ref">
                                                                {mcsubmissionVM.value.mpwrapperNumber}
                                                            </span>
                                                        </Col>
                                                    </Row>

                                                    <Row className="mc-customize-quote-summary__quote-info-con">
                                                        <Col xs={12} md={{ span: 8 }} className="px-mobile-0">
                                                            <HDLabelRefactor
                                                                className="mc-customize-quote-summary__quote-info-desc text-center"
                                                                text={messages.quoteInfoDescription}
                                                                Tag="p" />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                    {getQuoteCards(mcsubmissionVM)}
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: getErrorModalHeader() }}
                                        webAnalyticsEvent={{ event_action: getErrorModalHeader() }}
                                        id="unable-to-quote-modal"
                                        customStyle="customize-quote-error"
                                        show={showErrorModal}
                                        headerText={getErrorModalHeader()}
                                        confirmLabel={getErrorModalContinueLabel()}
                                        onConfirm={() => setShowErrorModal(false)}
                                        hideCancelButton
                                        hideClose
                                    >
                                        {getErrorModalContent()}
                                    </HDModal>
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.cantOfferQuote }}
                                        webAnalyticsEvent={{ event_action: messages.cantOfferQuote }}
                                        id="home-page-modal"
                                        customStyle="customize-quote customize-quote-decline"
                                        show={showDeclineQuote}
                                        confirmLabel={messages.homePageButtonContent}
                                        onConfirm={declineQuote}
                                        hideCancelButton
                                        hideClose
                                    >
                                        <HDQuoteDeclinePage showHomepageButton={false} isDisplayedAsModal />
                                    </HDModal>
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.cannotContinueUW }}
                                        webAnalyticsEvent={{ event_action: messages.cannotContinueUW }}
                                        id="child-quote-declined-modal"
                                        customStyle="customize-quote customize-quote-decline"
                                        show={showChildsDeclineQuote}
                                        confirmLabel={messages.childsQuoteDeclinedButtonLabel(getNumberAsString(childsQuoteDeclinedErrorCount))}
                                        onConfirm={childsDeclineQuote}
                                        hideCancelButton
                                        hideClose
                                    >
                                        <HDChildsQuoteDecline
                                            mcsubmissionVM={mcsubmissionVM}
                                            multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                                            quoteCount={childsQuoteDeclinedErrorCount} />
                                    </HDModal>
                                    <HDModal
                                        id="rerate-modal"
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.rerateModalHeader }}
                                        webAnalyticsEvent={{ event_action: messages.rerateModalHeader }}
                                        customStyle="customize-quote"
                                        show={showRerateModal}
                                        headerText={messages.rerateModalHeader}
                                        confirmLabel={messages.rerateModalConfirmLabel}
                                        onConfirm={closeReratePopup}
                                        hideCancelButton
                                        hideClose
                                    >
                                        <p>
                                            {messages.rerateModalContent}
                                        </p>
                                    </HDModal>
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.missingMonthlyPaymentsModalHeader }}
                                        webAnalyticsEvent={{ event_action: messages.missingMonthlyPaymentsModalHeader }}
                                        id="pay-in-full-modal"
                                        customStyle="customize-quote"
                                        show={showMissingMonthlyPaymentsPopup}
                                        headerText={messages.missingMonthlyPaymentsModalHeader}
                                        confirmLabel={messages.missingMonthlyPaymentsModalConfirmLabel}
                                        onConfirm={() => setShowMissingMonthlyPaymentsPopup(false)}
                                        hideCancelButton
                                        hideClose
                                    >
                                        {messages.missingMonthlyPaymentsModalContent.map((paragraph, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <p key={i}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </HDModal>
                                    <HDModal
                                        id="remove-car-modal"
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.areYouSure }}
                                        webAnalyticsEvent={{ event_action: messages.areYouSure }}
                                        customStyle="customize-quote rev-button-order"
                                        show={!!deleteVehicle && !removeVehicle}
                                        headerText={messages.areYouSure}
                                        cancelLabel={messages.noRemoveCar}
                                        confirmLabel={messages.yesRemoveCar}
                                        onCancel={hideDeleteModal}
                                        onConfirm={() => onDeleteVehicleConfirm()}
                                        hideClose
                                    >
                                        <span>
                                            {messages.removeCarModalContent}
                                        </span>
                                    </HDModal>
                                    <HDModal
                                        id="wrong-voluntary-excess-modal"
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.wrongVolExcessHeader }}
                                        webAnalyticsEvent={{ event_action: messages.wrongVolExcessHeader }}
                                        customStyle="customize-quote"
                                        show={showWrongVoluntaryExcess}
                                        headerText={messages.wrongVolExcessHeader}
                                        confirmLabel={messages.wrongVolExcessOK}
                                        onConfirm={() => setShowWrongVoluntaryExcess(false)}
                                        hideCancelButton
                                        hideClose
                                    >
                                        <span>
                                            {messages.wrongVolExcessModalContent}
                                        </span>
                                    </HDModal>
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: messages.missingMonthlyPaymentsModalHeader }}
                                        webAnalyticsEvent={{ event_action: messages.missingMonthlyPaymentsModalHeader }}
                                        id="pay-in-full-modal"
                                        customStyle="customize-quote rev-button-order"
                                        show={showNoDDModal}
                                        headerText={messages.missingMonthlyPaymentsModalHeader}
                                        cancelLabel={messages.ddContinueOriginalQuote}
                                        confirmLabel={messages.ddContinuePayInFull}
                                        onConfirm={noDDModalPayInFull}
                                        onCancel={noDDModalContinueOriginalQuote}
                                        hideClose
                                    >
                                        <p>
                                            {messages.noDDModalContentOne}
                                        </p>
                                        <div className="no-dd-modal-subhead">{messages.noDDModalYouCan}</div>
                                        <p>
                                            {messages.noDDModalContentTwo}
                                        </p>
                                    </HDModal>
                                    <HDModal
                                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.mcCustomizeQuote} - ${messages.sorryCannotChooseThat}` }}
                                        webAnalyticsEvent={{ event_action: `${messages.mcCustomizeQuote} - ${messages.sorryCannotChooseThat}` }}
                                        id="mc-max-excess-modal"
                                        customStyle="customize-quote"
                                        show={isMaxExcessModalShown}
                                        headerText={messages.sorryCannotChooseThat}
                                        confirmLabel={messages.ok}
                                        onConfirm={handleMaxExcessConfirm}
                                        hideCancelButton
                                        hideClose
                                    >
                                        <p>
                                            {messages.maxExcess}
                                            &nbsp;
                                            {maxExcessLabel}
                                            .
                                        </p>
                                    </HDModal>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Container>
            ) : null}
            {quoteStatus !== null && <HDAlert message={quoteStatus} />}
            {HDToast}
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        MCQuoteRetrieved: state.retrievemulticarQuoteModel,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        submissionVM: state.wizardState.data.submissionVM,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        rerateModal: state.rerateModal,
        customMultiQuoteData: state.customMultiQuoteModel,
        noDDModal: state.noDDModal,
        ipidMultiCarMatchForAllData: state.ipidMultiCarMatchForAllModel,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel,
        isDiscountApplied: state.wizardState.app.isDiscountApplied,
        ancillaryCoveragesObject: state.wizardState.app.ancillaryCoveragesObject,
        ncdProtectionInd: state.wizardState.app.ncdProtectionInd
    };
};

const mapDispatchToProps = (dispatch) => ({
    setMultiCustomizeSubmissionVM: setMultiCustomizeSubmissionVMAction,
    setCustomizeSubmissionVM: setCustomizeSubmissionVMAction,
    updateMultiCustomQuote,
    getMCIpidMatchForAll,
    setNavigation: setNavigationAction,
    setErrorStatusCode,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
    setWizardPageState: setWizardPagesStateAction,
    resetMultiCustomUpdateQuote,
    resetCurrentPageIndex: resetCurrentPageIndexAction,
    mcGetPaymentSchedule: mcGetPaymentScheduleAction,
    dispatch
});

HDMCCustomizeQuoteSummaryPage.propTypes = {
    MCQuoteRetrieved: PropTypes.shape(
        {
            retrievemulticarQuoteObj: PropTypes.shape(
                {
                    quoteObj: PropTypes.shape(
                        {
                            quotes: PropTypes.array,
                            accountHolder: PropTypes.string,
                            accountNumber: PropTypes.string,
                            mpwrapperJobNumber: PropTypes.string,
                            mpwrapperNumber: PropTypes.string,
                            sessionUUID: PropTypes.string,
                            paymentScheduleResponseMP: PropTypes.shape([])
                        }
                    )
                }

            ),
            retrievemulticarQuoteError: PropTypes.shape({
                error: PropTypes.shape({
                    message: PropTypes.string,
                }),
            })
        }
    ).isRequired,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    submissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    setMultiCustomizeSubmissionVM: PropTypes.func.isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }),
    dispatch: PropTypes.shape({}),
    rerateModal: PropTypes.shape({
        status: PropTypes.bool.isRequired,
    }).isRequired,
    noDDModal: PropTypes.shape({
        status: PropTypes.bool.isRequired,
    }).isRequired,
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        multiCustomUpdatedQuoteObj: PropTypes.object
    }).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    ipidMultiCarMatchForAllData: PropTypes.shape({}),
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }),
    setNavigation: PropTypes.func.isRequired,
    shouldPNCDShow: PropTypes.func,
    updateEmailSaveProgress: PropTypes.func.isRequired,
    location: PropTypes.shape({ search: PropTypes.string, state: PropTypes.shape({ SaveAndReturn: PropTypes.bool }) }).isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    isDiscountApplied: PropTypes.bool,
    ancillaryCoveragesObject: PropTypes.shape({}),
    ncdProtectionInd: PropTypes.bool,
    checkbuttonDisabled: PropTypes.func,
    resetCurrentPageIndex: PropTypes.func.isRequired,
    isEditQuoteJourneyDriver: PropTypes.bool,
    mcGetPaymentSchedule: PropTypes.func.isRequired,
};
HDMCCustomizeQuoteSummaryPage.defaultProps = {
    dispatch: null,
    multiCustomizeSubmissionVM: null,
    ipidMultiCarMatchForAllData: null,
    mcPaymentScheduleModel: null,
    shouldPNCDShow: () => { },
    isDiscountApplied: false,
    ancillaryCoveragesObject: null,
    ncdProtectionInd: false,
    checkbuttonDisabled: () => { },
    isEditQuoteJourneyDriver: false
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDMCCustomizeQuoteSummaryPage));
