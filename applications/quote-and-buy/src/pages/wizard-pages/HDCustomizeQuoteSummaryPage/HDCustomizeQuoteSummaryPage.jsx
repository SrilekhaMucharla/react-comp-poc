/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import classNames from 'classnames';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    HDForm,
    HDLabelRefactor, HDQuoteInfoRefactor,
    HDQuoteInfoWarning
} from 'hastings-components';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
    useContext, useEffect, useMemo, useRef, useState, useCallback
} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { connect, useSelector } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import HDQuoteService from '../../../api/HDQuoteService';
import arcTop from '../../../assets/images/background/top-arc.svg';
import driverIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Account.svg';
import carIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_1-car.svg';
import multicarInfoImageMobile from '../../../assets/images/wizard-images/multicar-info-image-mobile.png';
import formatRegNumber from '../../../common/formatRegNumber';
import getYoungAndInexperiencedExcess from '../../../common/getYoungAndInexperiencedExcess';
import * as monetateHelper from '../../../common/monetateHelper';
import { producerCodeList } from '../../../common/producerCodeHelper';

import {
    getAmount,
    getPriceWithCurrencySymbol,
    iPidMatchForAllAPIObject,
    setVehicleDetailsInCustomizeQuote
} from '../../../common/utils';
import {
    APR_RATE,
    HOMEPAGE, INTEREST_RATE, PAYMENT_TYPE_ANNUALLY_CODE, PAYMENT_TYPE_MONTHLY_CODE,
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE
} from '../../../constant/const';
import { CUSTOMISE_QUOTE } from '../../../customer/directintegrations/faq/epticaMapping';
import EventEmmiter from '../../../EventHandler/event';
import {
    clearLWRQuoteData as clearLWRQuoteDataAction,
    clearUpdateQuoteData as clearUpdateQuoteDataAction,
    getIpidMatchForAll,
    markRerateModalAsDisplayed as markRerateModalAsDisplayedAction,
    setCustomizeSubmissionVM as setCustomizeSubmissionVMAction,
    setNavigation as setNavigationAction,
    setObjectBeforeEdit as setObjectBeforeEditAction,
    setSubmissionVM as setSubmissionVMAction,
    updateCustomQuote, updateEpticaId as updateEpticaIdAction,
    setOfferedQuotesDetails as setOfferedQuotesDetailsAction
} from '../../../redux-thunk/actions';
import { ABOUT_MC_COVER } from '../../../routes/BaseRouter/RouteConst';
import MCCustomizeSubmissionVMInitial from '../../../routes/MCCustomizeSubmissionVMInitial';
import MCSubmissionVMInitial from '../../../routes/MCSubmissionVMInitial';
import {
    AnalyticsHDDatePicker as HDDatePicker, AnalyticsHDDropdownList as HDDropdownList, AnalyticsHDModal as HDModal,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDPolicySelect as HDPolicySelect,
} from '../../../web-analytics';
import { trackAPICallFail, trackAPICallSuccess } from '../../../web-analytics/trackAPICall';
import { trackEvent } from '../../../web-analytics/trackData';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import useToast from '../../Controls/Toast/useToast';
import HDCoverDetailsPage from '../HDCoverDetailsPage/HDCoverDetailsPage';
import ConnectedHDManualUpgradeDowngrade from '../HDManualUpgradeDowngrade/HDManualUpgradeDowngrade';
import { getPCWName } from '../HDMotorLegal/HastingsPCWHelper';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';
import HDVehicleDetailsPage from '../HDVehicleDetailsPage/HDVehicleDetailsPage';
import customSubmission from '../__helpers__/customizeSubmissionVMInitial';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../__helpers__/policyErrorCheck';
import ConnectedHDCarFinder from './HDCarFinder';
import * as messages from './HDCustomizeQuoteSummaryPage.messages';
// import './HDCustomizeQuoteSummaryPage.scss';
import HDStartDatePopup from './HDStartDatePopup';
import HDYourExcessPopup from './HDYourExcessPopup';
import trackQuoteData from '../../../web-analytics/trackQuoteData';


const MAX_EXCESS_VALUE = '500';
const CURRENCY = 'gbp';
const SHOW_RERATE_MODAL = 'SHOW_RERATE_MODAL';
const maxExcessLabel = getPriceWithCurrencySymbol({ amount: MAX_EXCESS_VALUE, currency: CURRENCY });
export const HDCustomizeQuoteSummaryPage = ({
    submissionVM,
    setSubmissionVM,
    vehicleDetails,
    setCustomizeSubmissionVM,
    rerateModal,
    toggleContinueElement,
    disableContinueElement,
    onUpgrade,
    onDowngrade,
    onUpgradeDowngradeCancellation,
    dispatch,
    offeredQuoteObject,
    customizeSubmissionVM,
    customQuoteData,
    ipidMatchForAllData,
    paymentType,
    onPaymentTypeChange,
    setNavigation,
    setObjectBeforeEdit,
    updateEpticaId,
    showManualUpgrade,
    setShowManualUpgrade,
    showManualDowngrade,
    setShowManualDowngrade,
    clearLWRQuoteData,
    clearUpdateQuoteData,
    ancillaryCoveragesObject,
    retrieveBlackBoxRequest,
    pageMetadata,
    isEditQuoteJourney,
    multiCarElements,
    ncdProtectionInd,
    mcsubmissionVM,
    multiCustomizeSubmissionVM,
    isEditQuoteJourneyFromSummmary,
    setOfferedQuotesDetails,
    actionType
}) => {
    const history = useHistory();
    const registrationNumber = (vehicleDetails.data) ? vehicleDetails.data.registrationsNumber || vehicleDetails.data.regNo : submissionVM.value.lobData.privateCar.coverables.vehicles[0].registrationsNumber;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const vehicleCoveragesPath = 'coverages.privateCar.vehicleCoverages';
    const offeredQuotesPath = 'quoteData.offeredQuotes';
    const baseDataPath = 'baseData';
    const insurerPath = 'baseData.insurer';
    const isEligibleForOnlineProduct = `${baseDataPath}.isEligibleForOnlineProduct`;
    const policyStartDateFieldName = 'periodStartDate';
    const policyStartDatePath = `baseData.${policyStartDateFieldName}`;
    const voluntaryExcessFieldName = 'voluntaryExcess';
    const voluntaryExcessPath = `${vehiclePath}.${voluntaryExcessFieldName}`;
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(submissionVM, driverPath));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];
    const quoteIDPath = 'value.quoteID';
    const annuallyPaymentObjectPath = 'value.quote.hastingsPremium.annuallyPayment';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const protectNcdFieldName = 'protectNCD';
    const protectNcdPath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${protectNcdFieldName}`;
    const isEligible = _.get(submissionVM, isEligibleForOnlineProduct).value || false;

    const displayAmount = (value) => `£${value}`;

    const submissionVoluntaryExcessValue = _.get(submissionVM, voluntaryExcessPath).value.code;

    const [isMaxExcessModalShown, setIsMaxExcessModalShown] = useState(false);
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);
    const [showRerateModal, setShowRerateModal] = useState(null);
    const [showMissingMonthlyPaymentsPopup, setShowMissingMonthlyPaymentsPopup] = useState(false);
    const [showMissingRegNumberPopup, setShowMissingRegNumberPopup] = useState(false);
    const [customizeSubmissionVMCreated, setCustomizeSubmissionVMCreated] = useState(!(_.get(customizeSubmissionVM, quoteIDPath) === undefined));
    const [annualAmount, setAnnualAmount] = useState(0);
    const [monthlyAmount, setMonthlyAmount] = useState(0);
    const [, setInitialPolicyStartDate] = useState(null);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [accidentalVehicleDamage, setAccidentalVehicleDamage] = useState([]);
    const [theftVehicleDamage, setTheftVehicleDamage] = useState([]);
    const [windScreenVehicleDamage, setWindScreenDamage] = useState([]);
    const location = useLocation();
    const [ipidAPITriggerPoint, setIpidAPITriggerPoint] = useState(false);
    const [HDToast, addToast] = useToast();
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);
    const [rerateTriggered, setRerateTriggered] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [protectNcd, setProtectNcd] = useState(false);
    const [compulsoryExcess, setCompulsoryExcess] = useState(0);
    const [isInavlidDate, setIsInvalidDate] = useState(false);
    const [offeredQuotes, setOfferedQuotes] = useState(submissionVM.quoteData.offeredQuotes.value);
    const isEditCancelled = useSelector((state) => state.wizardState.app.isEditCancelled);
    const [voluntaryExcessValue, setVoluntaryExcessValue] = useState({});
    const [accidentalVehicleExcess, setAccidentalVehicleExcess] = useState({});
    const [previousVehicleDetails, setPreviousVehicleDetails] = useState({ details: {}, vehicle: {} });
    const [cookies, setCookie] = useCookies(['']);
    const [showMultiCar, setShowMultiCar] = useState(false);
    const [stopPropgation, setStopPropgation] = useState(false);
    const [policySelected, setPolicySelected] = useState('online');
    const [canShowPolicySelection, setCanShowPolicySelection] = useState(false);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const findCarInputRef = useRef(null);
    const blackBoxRef = useRef(null);
    const onlineProduct = _.get(submissionVM, 'value.isOnlineProductType');


    const firstName = 'Ashley';
    const aprRate = '29.8';
    const interestRate = '14.8';
    const quoteNumber = '0023093754';
    const viewModelService = useContext(ViewModelServiceContext);
    const translator = useContext(TranslatorContext);

    const monthlyPaymentFirstInstalmentPath = 'value.quote.hastingsPremium.monthlyPayment.firstInstalment.amount';
    const monthlyPaymentFirstInstalmentValue = _.get(customizeSubmissionVM, monthlyPaymentFirstInstalmentPath, messages.monthlyPaymentFirstInstalmentPDefaultValue);

    useEffect(() => {
        return () => {
            const requestValue = blackBoxRef && blackBoxRef.current && blackBoxRef.current.value ? blackBoxRef.current.value : null;
            retrieveBlackBoxRequest(requestValue);
        };
    }, []);

    useEffect(() => {
        const getMultiToSingleCustomizeFlag = _.get(history, 'location.state.MultiToSingleCustomize', false);
        if (getMultiToSingleCustomizeFlag) {
            _.set(mcsubmissionVM, 'value', MCSubmissionVMInitial);
            _.set(multiCustomizeSubmissionVM, 'value', MCCustomizeSubmissionVMInitial);
        }
    }, [history]);

    useEffect(() => {
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
        const producerCode = _.get(submissionVM.value.baseData, 'producerCode', null);
        let producerCodeArray = monetateHelper.fetchCookieByName('mc.producerCode') && monetateHelper.fetchCookieByName('mc.producerCode');
        if (!producerCodeArray.includes(producerCode) && producerCode) {
            producerCodeArray = producerCodeArray.concat(producerCodeArray.length ? `,${producerCode}` : producerCode);
            setCookie('mc.producerCode', producerCodeArray, {
                path: '/'
            });
        }
        if (!cookies['mt.v'] && !!retrievedCookie) {
            setCookie('mt.v', retrievedCookie);
        }
    }, [multiCarElements]);
    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 10, offset: 1 }
    };

    const mainColPropsVehicleDetails = {
        xs: { span: 12, offset: 0 },
        md: { span: 6, offset: 3 }
    };

    const mainColPropsManuUpgrDowngr = {
        xs: { span: 12, offset: 0 }
    };

    const mainRowPropsManuUpgrDowngr = {
        className: 'mx-0'
    };

    if (viewModelService) {
        if (!customizeSubmissionVMCreated && _.get(customizeSubmissionVM, quoteIDPath) === undefined) {
            dispatch(setCustomizeSubmissionVM({
                customizeSubmissionVM: viewModelService.create(
                    customSubmission,
                    'pc',
                    'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
                ),
            }));
            setCustomizeSubmissionVMCreated(true);
        }
    }

    /**
     * Set value of policy type
     */
    const getPolicySelected = () => {
        const { getPolicyTypeBasedOnFlag } = messages;
        setPolicySelected(
            getPolicyTypeBasedOnFlag(
                _.get(submissionVM, 'value.isOnlineProductType')
            )
        );
    };

    const getAvailableQuotes = () => {
        const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE];
        let offerQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        offerQuotes = offerQuotes.value || [];
        return offerQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1))));
    };

    const filteredOfferedQuotes = getAvailableQuotes().filter((offeredQuotesObj) => {
        return offeredQuotesObj.branchCode === offeredQuoteObject.offeredQuotes[0].branchCode;
    });

    useEffect(() => {
        dispatch(setNavigation({
            isEditQuoteJourneyDriver: false,
            finishEditingEnabled: false
        }));
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tickWhite',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
        getPolicySelected();
    }, []);

    useEffect(() => {
        if (stopPropgation) {
            _.set(customizeSubmissionVM, quoteIDPath, undefined);
            trackPolicyEvent();
        }
        getPolicySelected();
    }, [stopPropgation]);


    let pcDate = _.get(submissionVM, 'value.baseData.pccurrentDate');
    pcDate = new Date(pcDate);
    pcDate = Date.UTC(pcDate.getUTCFullYear(), pcDate.getUTCMonth(), pcDate.getUTCDate());
    const pcCurrentDate = (pcDate) || new Date();
    const todayAtMidnight = new Date(new Date(pcCurrentDate).setHours(0, 0, 0, 0));
    const futureAtMidnight = new Date(new Date(pcCurrentDate).setHours(720, 0, 0, 0));
    const validationSchema = yup.object({
        [voluntaryExcessFieldName]: yup.string()
            .required(messages.voluntaryExcessRequired)
            .VMValidation(voluntaryExcessPath, messages.voluntaryExcessRequired, submissionVM),
        [policyStartDateFieldName]: yup.date()
            .required(messages.invalidDate)
            .typeError(messages.invalidDate)
            .min(todayAtMidnight, messages.policyStartDateInPast)
            .max(futureAtMidnight, messages.policyStartDate30Days)
            .VMValidation(policyStartDatePath, messages.invalidDate, submissionVM),
    });

    useEffect(() => {
        toggleContinueElement(true);
    }, [toggleContinueElement]);


    const setAnnualMonthlyAmount = () => {
        const premiumAnnualCost = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.annuallyPayment.premiumAnnualCost');
        if (premiumAnnualCost) {
            setAnnualAmount(premiumAnnualCost.amount);
        }

        const elevenMonthsInstalments = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments');
        if (elevenMonthsInstalments) {
            setMonthlyAmount(elevenMonthsInstalments.amount);
        }
    };

    const checkOfferedQuoteChange = () => {
        const offerPublicID = _.get(customizeSubmissionVM, 'value.quote.publicID');
        if (!offerPublicID) return false;
        return (isEditQuoteJourneyFromSummmary && !isEditCancelled);
    };

    const setVoluntaryExcess = (voluntaryExcess) => {
        const excessData = {
            label: `£${voluntaryExcess}`,
            value: voluntaryExcess
        };
        setVoluntaryExcessValue(excessData);
    };

    /**
     * Hide toggle option
     * when policy selection is online
     * and branchCode is YD
     */
    const canShowPolicyComp = () => {
        if (offeredQuoteObject && offeredQuoteObject.offeredQuotes.length) {
            const { branchCode } = offeredQuoteObject.offeredQuotes[0];
            setCanShowPolicySelection(branchCode === messages.YD && !(_.get(submissionVM, 'value.isOnlineProductType')));
        }
    };

    useEffect(() => {
        if ((customizeSubmissionVMCreated && customizeSubmissionVM && Object.keys(customizeSubmissionVM).length && _.get(customizeSubmissionVM, quoteIDPath) === undefined) || checkOfferedQuoteChange()) {
            if (offeredQuoteObject && offeredQuoteObject.offeredQuotes && offeredQuoteObject.offeredQuotes.length) {
                _.set(customizeSubmissionVM.value, 'quote', offeredQuoteObject.offeredQuotes[0]);
                _.set(customizeSubmissionVM.value, 'quoteID', submissionVM.value.quoteID);
                _.set(customizeSubmissionVM.value, 'sessionUUID', submissionVM.value.sessionUUID);
                _.set(customizeSubmissionVM.value, 'periodStartDate', submissionVM.value.baseData.periodStartDate);
                _.set(customizeSubmissionVM.value, 'periodEndDate', submissionVM.value.baseData.periodEndDate);
                _.set(customizeSubmissionVM.value, 'coverType', submissionVM.value.lobData.privateCar.coverables.vehicles[0].coverType);
                _.set(customizeSubmissionVM.value, 'voluntaryExcess', submissionVM.value.lobData.privateCar.coverables.vehicles[0].voluntaryExcess);
                _.set(customizeSubmissionVM.value, 'ncdgrantedYears', submissionVM.value.lobData.privateCar.coverables.vehicles[0].ncdProtection.ncdgrantedYears);

                _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount', submissionVM.value.lobData.privateCar.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);
                _.set(customizeSubmissionVM.value, 'producerCode', submissionVM.value.baseData.producerCode);
                _.set(customizeSubmissionVM.value, 'insurancePaymentType', submissionVM.value.baseData.affordablePaymentPlan);

                const racEssentials = {
                    isBreakdownEssential: false,
                    isEuropeEssential: false,
                    isHomeEssential: false,
                    isTransportEssential: false
                };
                for (let i = 0; i < submissionVM.value.lobData.privateCar.offerings.length; i += 1) {
                    if (submissionVM.value.lobData.privateCar.offerings[i].branchCode === offeredQuoteObject.offeredQuotes[0].branchCode) {
                        if (submissionVM.value.lobData.privateCar.offerings[i].coverages
                            && submissionVM.value.lobData.privateCar.offerings[i].coverages.ancillaryCoverages.length
                            && submissionVM.value.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages
                            && submissionVM.value.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages.length) {
                            submissionVM.value.lobData.privateCar.offerings[i].coverages.ancillaryCoverages[0].coverages.forEach((ancCoverage) => {
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
                _.set(customizeSubmissionVM.value, 'racEssentials', racEssentials);

                if (submissionVM.value.baseData.producerCode !== messages.producersCodeText
                    && (actionType !== messages.directText && !_.includes(producerCodeList, submissionVM.value.baseData.producerCode))) {
                    const pcwName = getPCWName(submissionVM.value.baseData.producerCode);
                    dispatch(setNavigation({
                        isPCWJourney: true,
                        pcwName: pcwName
                    }));
                }
                const otherOfferedData = [];
                const otherOfferedDataForUpgrade = [];
                submissionVM.value.quoteData.offeredQuotes.forEach((data) => {
                    if (data.branchCode !== offeredQuoteObject.offeredQuotes[0].branchCode) {
                        otherOfferedData.push(data);
                        const offeredQuoteDataForUpgrade = {};
                        offeredQuoteDataForUpgrade.branchCode = data.branchCode;
                        offeredQuoteDataForUpgrade.offeredQuote = data;
                        otherOfferedDataForUpgrade.push(offeredQuoteDataForUpgrade);
                    }
                });
                const covarageData = [];
                submissionVM.value.lobData.privateCar.offerings.forEach((data) => {
                    if (data.branchCode === offeredQuoteObject.offeredQuotes[0].branchCode) {
                        covarageData.push(data.coverages);
                    }
                    otherOfferedDataForUpgrade.forEach((offeredQuoteDataForUpgrade) => {
                        if (data.branchCode === offeredQuoteDataForUpgrade.branchCode) {
                            const privateCarCoverages = { privateCar: data.coverages };
                            offeredQuoteDataForUpgrade.coverages = privateCarCoverages;
                        }
                    });
                });
                if (otherOfferedData.length) {
                    _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', otherOfferedData);
                }
                if (covarageData.length) {
                    _.set(customizeSubmissionVM.value, 'coverages.privateCar', covarageData[0]);
                }
                if (otherOfferedDataForUpgrade.length) {
                    _.set(customizeSubmissionVM.value, 'otherOfferedDataForUpgrade', otherOfferedDataForUpgrade);
                }
                if (_.get(customizeSubmissionVM, 'ncdgrantedProtectionInd.value') === undefined) {
                    _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', submissionVM.value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD);
                    dispatch(setNavigation({
                        ncdProtectionInd: _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD')
                    }));
                }
                setVoluntaryExcess(_.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].voluntaryExcess'));
                canShowPolicyComp();
                setVehicleExcess();
            }
        } else {
            setAnnualMonthlyAmount();
        }
        if (isEditQuoteJourneyFromSummmary && !isEditCancelled) {
            _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', submissionVM.value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD);
            dispatch(setNavigation({
                ncdProtectionInd: _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD')
            }));
        }
        if (!ancillaryCoveragesObject) {
            if (customizeSubmissionVM && _.get(customizeSubmissionVM, quoteIDPath) !== undefined) {
                dispatch(setNavigation({
                    // eslint-disable-next-line react/prop-types
                    ancillaryCoveragesObject: _.cloneDeep(customizeSubmissionVM.coverages.privateCar.ancillaryCoverages.value[0].coverages)
                }));
            }
        }
        if (customizeSubmissionVM && customizeSubmissionVM.value) {
            const ncdValue = customizeSubmissionVM.value.ncdgrantedProtectionInd;
            if (ncdValue) {
                setProtectNcd(ncdValue);
            } else {
                setProtectNcd(false);
            }
        }
    }, [setSubmissionVM, submissionVM, customizeSubmissionVMCreated, customizeSubmissionVM, offeredQuoteObject]);

    useEffect(() => {
        const quoteID = _.get(customizeSubmissionVM, quoteIDPath);
        const ipiddSuccessObj = _.get(ipidMatchForAllData, 'ipidMatchForAllObj');
        if (quoteID && _.isEmpty(ipiddSuccessObj) && !ipidAPITriggerPoint) {
            setIpidAPITriggerPoint(true);
            const ipidObject = iPidMatchForAllAPIObject(submissionVM, customizeSubmissionVM);
            dispatch(getIpidMatchForAll(ipidObject));
        }
        const ipiddFailureObj = _.get(ipidMatchForAllData, 'ipidMatchForAllErrorObj.error');
        if (ipiddFailureObj) {
            // TODO: error handling for ipid match for all api call
        }
    }, [customizeSubmissionVM, ipidMatchForAllData]);

    useEffect(() => {
        // loader for custom Updated Quote api
        if (customQuoteData.loading) {
            showLoader();
        } else {
            hideLoader();
        }
        const hasQuoteErrors = isUWErrorPresent(offeredQuoteObject.offeredQuotes)
            || isGrayListErrorPresent(offeredQuoteObject.offeredQuotes)
            || isCueErrorPresent(offeredQuoteObject.offeredQuotes);
        if (hasQuoteErrors && rerateTriggered && !customQuoteData.loading) {
            setShowDeclineQuote(true);
            setRerateTriggered(false);
        }
        // save and replace the customQuoteData >> customizeSubmissionVM dto after update quote
        if (customizeSubmissionVM && Object.keys(customizeSubmissionVM.value).length > 0
            && !customQuoteData.loading && _.get(customQuoteData, 'customUpdatedQuoteObj.quoteID') && aPITriggerPoint) {
            const customQuoteObject = [_.get(customQuoteData, 'customUpdatedQuoteObj.quote', {})];
            const hasCustomQuoteErrors = isUWErrorPresent(customQuoteObject)
                || isGrayListErrorPresent(customQuoteObject)
                || isCueErrorPresent(customQuoteObject);
            if (hasCustomQuoteErrors && rerateTriggered) {
                setShowDeclineQuote(true);
                setRerateTriggered(false);
            }
            _.set(customizeSubmissionVM, 'value', customQuoteData.customUpdatedQuoteObj);
            _.set(customizeSubmissionVM, 'value.otherOfferedQuotes', customQuoteData.customUpdatedQuoteObj.otherQuotes);
            _.unset(customizeSubmissionVM, 'value.otherQuotes');
            _.set(submissionVM, 'value.lobData.privateCar.coverables', customQuoteData.customUpdatedQuoteObj.coverables);
            _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount', customQuoteData.customUpdatedQuoteObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);
            const voluntaryExcessUpdated = customQuoteData.customUpdatedQuoteObj.coverables.vehicles[0].voluntaryExcess;
            setVehicleExcess();
            setVoluntaryExcess(voluntaryExcessUpdated);
            if (customizeSubmissionVM && customizeSubmissionVM.value && customizeSubmissionVM.value.otherOfferedQuotes) {
                const offeredQuotesTmp = _.cloneDeep(customizeSubmissionVM.value.otherOfferedQuotes.map((quote) => quote.offeredQuote));
                offeredQuotesTmp.push(customQuoteData.customUpdatedQuoteObj.quote);
                setOfferedQuotes(offeredQuotesTmp);
            }

            setAPITriggerPoint(false);
            setAnnualMonthlyAmount();
            setCustomizeSubmissionVM({ customizeSubmissionVM: customizeSubmissionVM });
        } else if (rerateTriggered && !customQuoteData.loading) {
            setShowDeclineQuote(true);
            setRerateTriggered(false);
        }
        // api error handling
        if (!customQuoteData.loading && _.get(customQuoteData, 'customQuoteError')) {
            // TODO: On every date change api is calling two times due to HDDatePicker having bug related to this, once bug will be fixed we need to enable this line.
            // setAPITriggerPoint(false);
        }
    }, [customQuoteData, customizeSubmissionVM]);

    useEffect(() => {
        if (!_.get(customizeSubmissionVM, annuallyPaymentObjectPath)) {
            return;
        }
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
        const getPaymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === PAYMENT_TYPE_MONTHLY_CODE)
            ? PAYMENT_TYPE_MONTHLY_CODE : PAYMENT_TYPE_ANNUALLY_CODE;
        setAnnualMonthlyAmount();
        EventEmmiter.dispatch('change', getAmount(getPaymentType, annualAmount, monthlyAmount));
        toggleContinueElement(registrationNumber && !showVehicleDetails);
    }, [toggleContinueElement, registrationNumber, showVehicleDetails, paymentType, annualAmount, monthlyAmount, customizeSubmissionVM]);

    useEffect(() => {
        window.scroll(0, 0);
        driversList.sort((a, b) => {
            if (a.isPolicyHolder) return -1;
            if (b.isPolicyHolder) return 1;
            return 0;
        });

        if (!registrationNumber) {
            setShowMissingRegNumberPopup(true);
        }
        canShowPolicyComp();
    }, []);

    useEffect(() => {
        if (submissionVM) {
            setInitialPolicyStartDate(_.get(submissionVM, policyStartDatePath).value);
        }
    }, [submissionVM]);

    useEffect(() => {
        if (submissionVM.value && customizeSubmissionVM && customizeSubmissionVM.value
                && submissionVM.value.isOnlineProductType !== customizeSubmissionVM.value.isOnlineProductOffered) {
            dispatch(setOfferedQuotesDetails(filteredOfferedQuotes));
        }
    }, [submissionVM.value]);

    const setExcessChangeValue = (coverType, accidentalDamage, theftDamage) => {
        const productType = _.get(customizeSubmissionVM, 'value.quote.productType');

        if (coverType === messages.tpft) {
            const { standardLossFireTheftCovKey, onlineLossFireTheftCovKey } = messages;
            const getCoverKey = (productType === 'online') ? onlineLossFireTheftCovKey : standardLossFireTheftCovKey;
            const theftVehicleDamageList = theftDamage[0].terms.filter((amt) => amt.publicID === getCoverKey);
            const dv = _.has(theftVehicleDamageList[0], 'directValue') ? theftVehicleDamageList[0].directValue : 0;
            setCompulsoryExcess(dv);
        } else if (_.isArray(accidentalDamage) && accidentalDamage.length > 0) {
            const { onlineAccDmgExcessKey, accidentalDamageCompulsaryKey } = messages;
            const getCoverKey = (productType === 'online') ? onlineAccDmgExcessKey : accidentalDamageCompulsaryKey;

            const cmpAmountPathAccDamage = accidentalDamage[0].terms.filter((amt) => amt.publicID === getCoverKey);
            const cmpYAndIAccDamage = getYoungAndInexperiencedExcess(driversList);
            const dv = _.has(cmpAmountPathAccDamage[0], 'directValue') ? cmpAmountPathAccDamage[0].directValue : 0;
            setAccidentalVehicleExcess(dv);
            setCompulsoryExcess(dv + cmpYAndIAccDamage);
        }
    };

    const setVehicleExcess = () => {
        const excCoverages = _.get(customizeSubmissionVM, vehicleCoveragesPath);

        const accidentalDamage = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.accidentalDamage) : '';
        setAccidentalVehicleDamage(accidentalDamage);

        const theftDamage = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.fireAndTheft) : '';
        setTheftVehicleDamage(theftDamage);

        const windScreen = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.windScreenExcess) : '';
        setWindScreenDamage(windScreen);

        const coverType = _.get(customizeSubmissionVM, 'value.coverType');

        setExcessChangeValue(coverType, accidentalDamage, theftDamage);
    };

    useEffect(() => {
        if (customizeSubmissionVM) {
            setVehicleExcess();
            setVoluntaryExcess(_.get(customizeSubmissionVM, 'value.voluntaryExcess'));
        }
    }, [customizeSubmissionVM]);

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationNumber), [registrationNumber]);

    const availableVoluntaryExcessValues = submissionVM && (viewModelService) ? _.get(submissionVM, voluntaryExcessPath)
        .aspects
        .availableValues
        .map((excess) => ({
            value: excess.code,
            label: displayAmount(translator({
                id: excess.name,
                defaultMessage: excess.name
            }))
        })) : [];

    const callRerate = () => {
        _.set(customizeSubmissionVM.value, 'periodStartDate', submissionVM.value.baseData.periodStartDate);
        _.set(customizeSubmissionVM.value, 'voluntaryExcess', submissionVM.value.lobData.privateCar.coverables.vehicles[0].voluntaryExcess);
        const vrnVehicleDetails = _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0]', null);
        const vrnVehicleDetailsObject = {
            make: vrnVehicleDetails.make,
            registrationNumber: vrnVehicleDetails.registrationsNumber,
            importType: vrnVehicleDetails.importType,
            transmission: vrnVehicleDetails.transmission,
            numberOfSeats: vrnVehicleDetails.numberOfSeats,
            body: vrnVehicleDetails.body,
            bodyType: vrnVehicleDetails.bodyCode,
            year: vrnVehicleDetails.yearManufactured,
            engineSize: vrnVehicleDetails.engineSize,
            numberOfDoors: vrnVehicleDetails.numberOfDoors,
            AbiCode: vrnVehicleDetails.abiCode,
            model: vrnVehicleDetails.model
        };
        const isCustomizeDataAvailable = _.get(customizeSubmissionVM, quoteIDPath);

        if (customizeSubmissionVMCreated && isCustomizeDataAvailable) {
            setAPITriggerPoint(true);
            dispatch(updateCustomQuote(customizeSubmissionVM, vrnVehicleDetailsObject));
        }

        setRerateTriggered(true);
    };

    const displayRerateModal = () => {
        const newPolicyStartDate = _.get(submissionVM, policyStartDatePath).value;
        if (!newPolicyStartDate || !newPolicyStartDate.year || !(newPolicyStartDate.month || newPolicyStartDate.month === 0) || !newPolicyStartDate.day) {
            return;
        }

        if (!rerateModal.status) {
            dispatch(markRerateModalAsDisplayedAction());
            setShowRerateModal(SHOW_RERATE_MODAL);
        } else {
            callRerate();
        }
    };

    const displayRerateModalForStartDateSelected = (date) => {
        const newPolicyStartDate = _.get(submissionVM, `${policyStartDatePath}.value`);
        const currentDate = _.get(customizeSubmissionVM, 'value.periodStartDate');
        if (!_.isEqual(newPolicyStartDate, currentDate) && date !== undefined && isValidDate(date)) {
            displayRerateModal();
        }
    };

    const displayRerateModalForStartDate = (dayDate) => {
        const newPolicyStartDate = _.get(submissionVM, `${policyStartDatePath}.value`);
        const currentDate = _.get(customizeSubmissionVM, 'value.periodStartDate');

        if (newPolicyStartDate && newPolicyStartDate.year && newPolicyStartDate.day && (newPolicyStartDate.month || newPolicyStartDate.month === 0)) {
            const seletedDate = new Date(newPolicyStartDate.year, newPolicyStartDate.month, newPolicyStartDate.day);
            if (!_.isEqual(newPolicyStartDate, currentDate) && dayDate.target && dayDate.target.value !== undefined && isValidDate(seletedDate)) {
                if (dayDate.relatedTarget === null || (dayDate.relatedTarget.id !== 'hd-date-picker-date-input-month' && dayDate.relatedTarget.id !== 'hd-date-picker-date-input-year' && dayDate.relatedTarget.id !== 'hd-date-picker-date-input-day')) {
                    displayRerateModal(); // above condition to block api call on auto tab change
                }
            }
        }
    };

    const isValidDate = (genDate) => {
        if (genDate >= todayAtMidnight && genDate <= futureAtMidnight) {
            return true;
        }
        return false;
    };

    const handleExcessChange = ({ target: { value: selectedVoluntaryExcess } }, hdProps) => {
        const selectedVoluntaryExcessValue = selectedVoluntaryExcess.value;
        const previousFormValue = hdProps.values[voluntaryExcessFieldName].value;
        const isSameSelected = previousFormValue === selectedVoluntaryExcess.value;

        if (isSameSelected) {
            return;
        }

        if (selectedVoluntaryExcessValue > +MAX_EXCESS_VALUE) {
            setIsMaxExcessModalShown(true);
            hdProps.setFieldValue(voluntaryExcessFieldName, { value: MAX_EXCESS_VALUE, label: maxExcessLabel });
            setVoluntaryExcess(MAX_EXCESS_VALUE);
            _.set(submissionVM, voluntaryExcessPath, MAX_EXCESS_VALUE);

            if (previousFormValue !== MAX_EXCESS_VALUE) {
                displayRerateModal();
            }
            return;
        }

        setVoluntaryExcess(selectedVoluntaryExcess.value);
        _.set(submissionVM, voluntaryExcessPath, selectedVoluntaryExcess.value);
        hdProps.setFieldValue(voluntaryExcessFieldName, selectedVoluntaryExcess);
        displayRerateModal();
    };

    const handleMaxExcessConfirm = () => {
        setIsMaxExcessModalShown(false);
    };

    const goToMissingRegNumberSection = () => {
        findCarInputRef.current.focus();
    };

    const handleAddRegNumber = () => {
        setShowMissingRegNumberPopup(false);
        goToMissingRegNumberSection();
    };

    const handleNoRegPopupConfirmation = () => {
        setShowMissingRegNumberPopup(false);
        window.scroll(0, 0);
    };

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    const validateDateForErrorMsg = (date) => {
        if (date) {
            const selectedDate = new Date(date.year, date.month, date.day);
            return isValidDate(selectedDate);
        }
        return false;
    };

    /**
     * call api and save selected
     * policy type
     */

    const updateProduct = useCallback((policyType) => {
        const { toastForOnlie, toastForStandard } = messages;
        const updateProductRequest = {
            onlineSelection: policyType === 'online',
            quoteID: _.get(submissionVM, 'value.quoteID'),
            sessionUUID: _.get(submissionVM, 'value.sessionUUID'),
        };
        setStopPropgation(true);

        HDQuoteService.updateProduct(updateProductRequest)
            .then(({ result }) => {
                trackAPICallSuccess('updateProduct Quote');
                trackQuoteData(result, translator);
                hideLoader();
                _.set(submissionVM, 'value', result);
                addToast({
                    iconType: 'tickWhite',
                    bgColor: 'light',
                    content: policyType === 'online' ? toastForOnlie : toastForStandard
                });
                setStopPropgation(false);
            }).catch(() => {
                trackAPICallFail('updateProduct Quote', 'updateProduct Quote Failed');
                hideLoader();
                setStopPropgation(false);
            });
    }, []);

    /**
     * stopPropgation if multiple clicks
     * occurs
     * @param {*} event click event
     */
    const createPolicySelect = (event) => {
        if (stopPropgation) {
            return;
        }
        showLoader();
        const policyType = event.target.value;
        setPolicySelected(policyType);
        updateProduct(policyType);
    };

    const trackPolicyEvent = () => {
        trackEvent({
            event_value: policySelected === 'online' ? messages.eventValueOnline : messages.eventValueStandard,
            event_action: `${messages.customizeQuotePolicySupp}`,
            event_type: 'link',
            element_id: 'hd-customize-quote_cover-selection',
        });
    };

    /**
     * Get amount for policy pop-up
     * to display discount
     * @returns {number}
     */
    const getSaveValueForComm = () => {
        const stdComm = _.get(submissionVM, 'value.stdOfferCommissionIncermentalVal');
        if (stdComm) {
            return Math.abs(stdComm.amount).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return null;
    };

    const handleValidation = (isValid) => {
        const policyStartDate = _.get(submissionVM, policyStartDatePath);
        const isInavlidDateValue = (!isValid && (!submissionVoluntaryExcessValue || !policyStartDate || !policyStartDate.value)) || !validateDateForErrorMsg(policyStartDate.value);
        setIsInvalidDate(isInavlidDateValue);
        disableContinueElement(isInavlidDateValue);
    };

    const callRerateForCoverTypeChange = (data) => {
        _.set(customizeSubmissionVM.value, 'coverType', data.target.value.value);
        dispatch(updateCustomQuote(customizeSubmissionVM));
        setAPITriggerPoint(true);
        setRerateTriggered(true);
    };

    const childEventHandler = (event, data) => {
        if (!rerateModal.status) {
            dispatch(markRerateModalAsDisplayedAction());
            setShowRerateModal(data);
        } else {
            callRerateForCoverTypeChange(data);
        }
    };

    const callRerateAndClose = () => {
        if (showRerateModal === SHOW_RERATE_MODAL) {
            callRerate();
        } else {
            callRerateForCoverTypeChange(showRerateModal);
        }
        setShowRerateModal(null);
    };

    const driverListWithExcessDetails = () => {
        if (accidentalVehicleDamage.length > 0) {
            return driversList.map((driver) => ({
                name: driver.displayName,
                excesses:
                    { excessName: messages.accidentalDamageText, voluntaryAmount: +submissionVoluntaryExcessValue, compulsoryAmount: ((driver.youngInexperiencedDriverExcess ? driver.youngInexperiencedDriverExcess.amount : 0) + accidentalVehicleExcess) }
            }));
        }
        return [];
    };

    const windScreenExcessDetails = () => {
        const productType = _.get(customizeSubmissionVM, 'value.quote.productType');
        const { standardLossFireTheftCovKey, onlineLossFireTheftCovKey } = messages;
        const getCoverKey = (productType === 'online') ? onlineLossFireTheftCovKey : standardLossFireTheftCovKey;

        if (windScreenVehicleDamage.length > 0 && theftVehicleDamage.length > 0) {
            const fireAndTheftVal = theftVehicleDamage[0].terms.filter((amt) => amt.publicID === getCoverKey);
            const repairPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === 'PCGlassDmgWrepairdmgCT_Ext');
            const replacementPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === 'PCGlassDmgWreplacementdmgCT_Ext');
            return [
                {
                    excessName: messages.fireAndTheftText,
                    voluntaryAmount: +submissionVoluntaryExcessValue,
                    compulsoryAmount: _.has(fireAndTheftVal[0], 'directValue') ? fireAndTheftVal[0].directValue : 0
                },
                {
                    excessName: messages.windowGlassText,
                    voluntaryAmount: replacementPath[0].directValue,
                    compulsoryAmount: repairPath[0].directValue
                },
            ];
        } if (theftVehicleDamage.length > 0) {
            const fireAndTheftVal = theftVehicleDamage[0].terms.filter((amt) => amt.publicID === getCoverKey);
            return [
                {
                    excessName: messages.fireAndTheftText,
                    voluntaryAmount: +submissionVoluntaryExcessValue,
                    compulsoryAmount: _.has(fireAndTheftVal[0], 'directValue') ? fireAndTheftVal[0].directValue : 0
                },
            ];
        }
        return [];
    };

    const handlePaymentTypeChange = (event) => {
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        onPaymentTypeChange(event.target.value);
        if (isMonthlyPaymentAvailable) {
            _.set(customizeSubmissionVM, 'value.insurancePaymentType', event.target.value);
            setAPITriggerPoint(true);
        }
    };

    const goToAddAnotherCar = () => {
        trackEvent({
            event_value: messages.multicarPartLink,
            event_action: `${messages.customizeQuote} - ${messages.multicarPartLink}`,
            event_type: 'link_click',
            element_id: 'add-another-car-link',
        });
        EventEmmiter.dispatch('change', { price: null });
        history.push({
            pathname: ABOUT_MC_COVER,
            state: { fromPage: history.location.pathname }
        });
        if (submissionVM.value.baseData.producerCode !== messages.producersCodeText) {
            dispatch(setNavigation({
                isAddAnotherCar: true
            }));
        }
    };

    const handleCarFind = () => {
        setShowVehicleDetails(false);
        updateEpticaId(CUSTOMISE_QUOTE);
    };

    const findVehicleCallback = (vehicledata, regNO) => {
        const getVehicleDetailsToSet = setVehicleDetailsInCustomizeQuote(vehicledata, regNO, submissionVM);
        _.set(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0].value', getVehicleDetailsToSet);
    };
    const monthlyPayment = {
        value: PAYMENT_TYPE_MONTHLY_CODE,
        content: (
            <Row className="customize-quote-summary__payment-content theme-white">
                <Col>
                    <Row className="customize-quote-summary__payment-header">
                        <Col>
                            {messages.payMonthlyHeader}
                        </Col>
                    </Row>
                    <Row className="customize-quote-summary__payment-value">
                        <Col className="customize-quote-summary__payment-value--monthly">
                            <span className="customize-quote-summary__prefix">{messages.payMonthlyPrefix}</span>
                            &nbsp;&pound;
                            {(monthlyAmount ? monthlyAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '')}
                        </Col>
                    </Row>
                    <Row className="customize-quote-summary__payment-description-bottom">
                        <Col className="px-0">
                            {messages.prePayMonthlyInitalPaymentInfo}
                            &pound;
                            {monthlyPaymentFirstInstalmentValue && (typeof monthlyPaymentFirstInstalmentValue === 'number')
                                ? monthlyPaymentFirstInstalmentValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : monthlyPaymentFirstInstalmentValue
                            }
                            {messages.postPayMonthlyInitalPaymentInfo}
                        </Col>
                    </Row>
                    {paymentType === PAYMENT_TYPE_ANNUALLY_CODE && (
                        <Row>
                            <Col className="px-0">
                                <HDLabelRefactor
                                    className="customize-quote-summary__payment-summary-text"
                                    text={messages.payMonthlySummaryText}
                                    Tag="a" />
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>)
    };

    const annuallyPayment = {
        value: PAYMENT_TYPE_ANNUALLY_CODE,
        content: (
            <Row className="customize-quote-summary__payment-content">
                <Col>
                    <Row className="customize-quote-summary__payment-header">
                        <Col>
                            {messages.payAnnuallyHeader}
                        </Col>
                    </Row>
                    <Row className="customize-quote-summary__payment-value">
                        <Col>
                            &pound;
                            {annualAmount ? annualAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                        </Col>
                    </Row>
                    {!monthlyAmount && (
                        <Row>
                            <Col>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="customize-quote-summary__payment-explanation-link"
                                    onClick={() => setShowMissingMonthlyPaymentsPopup(true)}
                                    onKeyDown={() => setShowMissingMonthlyPaymentsPopup(true)}
                                >
                                    {messages.missingMonthlyPaymentExplanation}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>)
    };

    const getPaymentTypes = () => ((monthlyAmount) ? [monthlyPayment, annuallyPayment] : [annuallyPayment]);

    const handleUpgradeGoBack = () => {
        setShowManualUpgrade(false);
        onUpgradeDowngradeCancellation();
    };

    const handleDowngradeGoBack = () => {
        setShowManualDowngrade(false);
        onUpgradeDowngradeCancellation();
    };

    if (showVehicleDetails) {
        return (
            <Row className="cq-vehicle-details-container">
                <Col {...mainColPropsVehicleDetails}>
                    <HDVehicleDetailsPage
                        onFind={handleCarFind}
                        previousVehicleDetails={previousVehicleDetails}
                        displayRerateModal={displayRerateModal} />
                </Col>
            </Row>
        );
    }

    if (showManualDowngrade) {
        return (
            <Row {...mainRowPropsManuUpgrDowngr}>
                <Col {...mainColPropsManuUpgrDowngr}>
                    <ConnectedHDManualUpgradeDowngrade
                        isUpgrade={false}
                        isMonthlyPaymentAvailable={_.get(customizeSubmissionVM, monthlyPaymentObjectPath, false)}
                        paymentType={paymentType}
                        onGoBack={handleDowngradeGoBack}
                        onDowngrade={onDowngrade}
                        policySelected={policySelected}
                        onUpgrade={onUpgrade}
                        onUpgradeDowngradeCancellation={onUpgradeDowngradeCancellation} />
                </Col>
            </Row>
        );
    }

    if (showManualUpgrade) {
        return (
            <Row {...mainRowPropsManuUpgrDowngr}>
                <Col {...mainColPropsManuUpgrDowngr}>
                    <ConnectedHDManualUpgradeDowngrade
                        isUpgrade
                        isMonthlyPaymentAvailable={_.get(customizeSubmissionVM, monthlyPaymentObjectPath, false)}
                        paymentType={paymentType}
                        onGoBack={handleUpgradeGoBack}
                        policySelected={policySelected}
                        onUpgrade={onUpgrade}
                        onUpgradeDowngradeCancellation={onUpgradeDowngradeCancellation} />
                </Col>
            </Row>
        );
    }

    const monthlyPaymentPremiumAnnualCostPath = 'value.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount';
    const monthlyPaymentPremiumAnnualCostValue = _.get(customizeSubmissionVM, monthlyPaymentPremiumAnnualCostPath, messages.monthlyPaymentPremiumAnnualCostDefaultValue);

    const monthlyPaymentTotalAmountCreditPath = 'value.quote.hastingsPremium.monthlyPayment.totalAmountCredit';
    const monthlyPaymentTotalAmountCreditValue = _.get(customizeSubmissionVM, monthlyPaymentTotalAmountCreditPath, messages.monthlyPaymentTotalAmountCreditDefaultValue);

    const monthlyPaymentRepresentativeAPRPath = 'value.quote.hastingsPremium.monthlyPayment.representativeAPR';
    const monthlyPaymentRepresentativeAPRValue = _.get(customizeSubmissionVM, monthlyPaymentRepresentativeAPRPath, aprRate);

    const monthlyPaymentRateOfInterestPath = 'value.quote.hastingsPremium.monthlyPayment.rateOfInterest';
    const monthlyPaymentRateOfInterestValue = _.get(customizeSubmissionVM, monthlyPaymentRateOfInterestPath, interestRate);

    const monthlyPaymentElevenMonthsInstalmentsPath = 'value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentElevenMonthsInstalmentsValue = _.get(customizeSubmissionVM, monthlyPaymentElevenMonthsInstalmentsPath, messages.monthlyPaymentElevenMonthsInstalmentsDefaultValue);

    const VEHICLE_PATH = 'get-a-price/vehicle-details';
    const DRIVER_PATH = 'get-a-price/add-another-driver';

    const editDriverVehicle = (driverVehiclePath) => {
        dispatch(clearLWRQuoteData());
        trackEvent({
            event_value: driverVehiclePath === VEHICLE_PATH ? messages.viewOrEditCar : messages.viewOrEditDriver,
            event_action: `${messages.customizeQuote} - ${driverVehiclePath === VEHICLE_PATH ? messages.viewOrEditCar : messages.viewOrEditDriver}`,
            event_type: 'button_click',
            element_id: driverVehiclePath === VEHICLE_PATH ? 'edit-vehicle-button' : 'edit-drivers-button',
        });
        dispatch(setObjectBeforeEdit({
            data: {
                drivers: _.cloneDeep(submissionVM.lobData.privateCar.coverables.drivers.value),
                vehicle: _.cloneDeep(submissionVM.lobData.privateCar.coverables.vehicles.value),
                account: _.cloneDeep(submissionVM.baseData.value),
                submission: _.cloneDeep(submissionVM.value),
            }
        }));
        dispatch(setNavigation({
            isEditQuoteJourney: true,
            isEditQuoteJourneyDriver: true,
            isAppStartPoint: true,
            isEditCancelled: false,
            isEditQuoteJourneyFromSummmary: true,
            isAddAnotherCar: false,
            finishEditingEnabled: driverVehiclePath === VEHICLE_PATH
        }));
        history.push({
            pathname: driverVehiclePath
        });
    };

    // TODO SINISA {...}


    const getWebAnyalMess = () => (
        policySelected === 'online' ? messages.eventValueOnline : messages.eventValueStandard
    );

    return (
        <Container fluid>
            <div className="customize-quote-summary theme-white px-0">
                <div className="arc-header">
                    <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                </div>
                <Container>
                    <Row>
                        <Col {...mainColProps}>
                            <Row className="part customize-quote-summary__basic-info-header">
                                <Col className="customize-quote-summary__basic-info-part">
                                    <Row className="customize-quote-summary__header">
                                        <Col className="text-center">
                                            <HDLabelRefactor
                                                className="customize-quote-summary__your-quote-header"
                                                Tag="h2"
                                                text={messages.getYourQuoteHeader(submissionVM, registrationNumber, firstName)} />
                                            {(registrationNumber) ? (
                                                <HDLabelRefactor
                                                    className="customize-quote-summary__reg-number"
                                                    Tag="h2"
                                                    text={formattedRegNumber} />
                                            ) : (
                                                <HDLabelRefactor
                                                    className="customize-quote-summary__no-registration-number-link theme-white-override"
                                                    Tag="a"
                                                    text={messages.noRegistationNumberLink}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={goToMissingRegNumberSection}
                                                    onKeyDown={goToMissingRegNumberSection} />
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <HDToggleButtonGroup
                                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.paymentType}`, event_value: `Switch to ${paymentType === PAYMENT_TYPE_MONTHLY_CODE ? 'annualy' : 'monthly'} payment type` }}
                                                id="payment-type-button-group"
                                                customClassName={`customize-quote-summary__month-year-buttons ${classNames({ 'only-annually d-block text-center': !monthlyAmount })}`}
                                                availableValues={getPaymentTypes()}
                                                value={paymentType}
                                                onChange={handlePaymentTypeChange} />
                                            {paymentType === PAYMENT_TYPE_MONTHLY_CODE && monthlyAmount && (
                                                <Row className="customize-quote-summary__monthly-payments-description mx-0">
                                                    <Col>
                                                        <Row className="customize-quote-summary__line">
                                                            <Col>{messages.policyPriceLabel}</Col>
                                                            <Col className="text-right">
                                                                &pound;
                                                                {monthlyPaymentTotalAmountCreditValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </Col>
                                                        </Row>
                                                        <Row className="customize-quote-summary__line">
                                                            <Col>{messages.totalCreditChargeLabel}</Col>
                                                            <Col className="text-right">
                                                                &pound;
                                                                {(monthlyPaymentPremiumAnnualCostValue - monthlyPaymentTotalAmountCreditValue).toFixed(2)}
                                                            </Col>
                                                        </Row>
                                                        <Row className="customize-quote-summary__line">
                                                            <Col>{messages.totalAmountPayableLabel}</Col>
                                                            <Col className="text-right col-auto">
                                                                &pound;
                                                                {monthlyPaymentPremiumAnnualCostValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </Col>
                                                        </Row>
                                                        <Row className="customize-quote-summary__commented-line pl-3">
                                                            {messages.ratesComment.replace(APR_RATE, monthlyPaymentRepresentativeAPRValue).replace(INTEREST_RATE, monthlyPaymentRateOfInterestValue)}
                                                        </Row>
                                                        <Row className="customize-quote-summary__line">
                                                            <Col>{messages.initialPaymentLabel}</Col>
                                                            <Col className="text-right">
                                                                &pound;
                                                                {monthlyPaymentFirstInstalmentValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </Col>
                                                        </Row>
                                                        <Row className="customize-quote-summary__line">
                                                            <Col>{messages.elevenMonthlyPayment}</Col>
                                                            <Col className="text-right col-auto">
                                                                &pound;
                                                                {monthlyPaymentElevenMonthsInstalmentsValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row className="customize-quote-summary__quote-notice">
                                        <Col>
                                            <HDQuoteInfoRefactor className="customize-quote-summary__quote-notice__quote-info text-small">
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
                                    <Row className="customize-quote-summary__quote-info">
                                        <Col>
                                            <Row>
                                                <Col md={{ span: 6, offset: 3 }} className="text-center">
                                                    <HDLabelRefactor
                                                        className="customize-quote-summary__ref-label mr-1"
                                                        text={messages.quoteRefLabel}
                                                        Tag="p" />

                                                    <span className="customize-quote-summary__quote-ref">
                                                        {Object.keys(submissionVM).length && submissionVM.value.quoteID ? submissionVM.value.quoteID : quoteNumber}
                                                    </span>
                                                </Col>
                                            </Row>
                                            <Row className="customize-quote-summary__quote-info-con">
                                                <Col xs={12} md={{ span: 8, offset: 2 }} className="px-mobile-0">
                                                    <HDLabelRefactor
                                                        className="customize-quote-summary__quote-info-desc"
                                                        text={messages.quoteInfoDescription}
                                                        Tag="p" />
                                                </Col>
                                            </Row>
                                            <Row className="customize-quote-summary__edit-container">
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => editDriverVehicle(VEHICLE_PATH)}
                                                    onKeyDown={() => editDriverVehicle(VEHICLE_PATH)}
                                                    id="edit-vehicle-button"
                                                >
                                                    <img src={carIcon} alt="Car Icon" />
                                                    <HDLabelRefactor Tag="a" text={messages.viewOrEditCar} className="customize-quote-summary__text-style-edit ml-2 mr-3" />
                                                </div>
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => editDriverVehicle(DRIVER_PATH)}
                                                    onKeyDown={() => editDriverVehicle(DRIVER_PATH)}
                                                    id="edit-drivers-button"
                                                >
                                                    <img src={driverIcon} alt="Driver Icon" />
                                                    <HDLabelRefactor Tag="a" text={messages.viewOrEditDriver} className="customize-quote-summary__text-style-edit" />
                                                </div>
                                            </Row>
                                        </Col>

                                    </Row>
                                </Col>
                                <HDForm
                                    submissionVM={submissionVM}
                                    validationSchema={validationSchema}
                                    onValidation={handleValidation}
                                >
                                    {(hdProps) => (

                                        <>

                                            {
                                                !canShowPolicySelection && isEligible && (
                                                    <HDPolicySelect
                                                        pageMetadata={pageMetadata}
                                                        webAnalyticsView={{ ...pageMetadata, page_section: `${getWebAnyalMess()}` }}
                                                        webAnalyticsEvent={{ event_action: `${getWebAnyalMess()}` }}
                                                        onChange={createPolicySelect}
                                                        className="hd-your-quote__cover-selection"
                                                        selectedOption={policySelected}
                                                        canHideOnlineInfo
                                                        saveValue={getSaveValueForComm()} />
                                                )
                                            }
                                            <Row className="customize-quote-summary__sections mx-0">
                                                <Col className="customize-quote-summary__section">
                                                    <Row className="customize-quote-summary__section-header mb-3">
                                                        <Col className="pr-0">
                                                            <HDLabelRefactor
                                                                className="customize-quote-summary__section-excess-header text-left"
                                                                text={messages.yourExcessHeader}
                                                                Tag="h3" />
                                                        </Col>
                                                        <Col>
                                                            <Row>
                                                                <Col className="px-0 text-right mr-1">
                                                                    <HDLabelRefactor
                                                                        className="customize-quote-summary__info"
                                                                        text={messages.otherExcessesInfo}
                                                                        Tag="p" />
                                                                </Col>
                                                                <Col className="col-1 mr-4 px-0">
                                                                    <HDYourExcessPopup
                                                                        drivers={driverListWithExcessDetails()}
                                                                        globalExcesses={windScreenExcessDetails()}
                                                                        customizeSubmissionVM={customizeSubmissionVM}
                                                                        pcCurrentDate={pcCurrentDate} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="customize-quote-summary__excesses-section-content">
                                                        <Col className="customize-quote-summary__excess-value pr-0 col-3">
                                                            <HDLabelRefactor
                                                                className="customize-quote-summary__label mb-1 text-left"
                                                                text={messages.compulsoryExcessLabel}
                                                                Tag="p" />
                                                            <input disabled value={displayAmount(compulsoryExcess)} />
                                                        </Col>
                                                        <Col className="customize-quote-summary__excess-sign px-0 col-1">+</Col>
                                                        <Col className="customize-quote-summary__excess-value px-0">
                                                            <HDLabelRefactor
                                                                className="customize-quote-summary__label mb-1 text-left"
                                                                text={messages.voluntaryExcessLabel}
                                                                Tag="p" />
                                                            <HDDropdownList
                                                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.voluntaryExcess}` }}
                                                                id="voluntary-excess-dropdown"
                                                                customClassName="customize-quote-summary__voluntary-excess-sel"
                                                                path={voluntaryExcessPath}
                                                                name={voluntaryExcessFieldName}
                                                                data={voluntaryExcessValue}
                                                                onChange={(e) => handleExcessChange(e, hdProps)}
                                                                options={availableVoluntaryExcessValues} />
                                                        </Col>
                                                        <Col className="customize-quote-summary__excess-sign px-0 mr-1 col-1 text-right">=</Col>
                                                        <Col className="customize-quote-summary__excess-value pl-2 col-2">
                                                            <HDLabelRefactor
                                                                id="start-date-datepicker"
                                                                className="customize-quote-summary__label text-right mb-0 pr-2"
                                                                text={messages.totalExcessLabel}
                                                                Tag="p" />
                                                            <div className="customize-quote-summary__total text-right">{(submissionVoluntaryExcessValue != null) ? displayAmount(compulsoryExcess + +submissionVoluntaryExcessValue) : null}</div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col className="customize-quote-summary__section">
                                                    <Row className="customize-quote-summary__section-header">
                                                        <Col>
                                                            <HDLabelRefactor
                                                                className="customize-quote-summary__start-date-header text-left"
                                                                text={messages.startDateHeader}
                                                                Tag="h3" />
                                                        </Col>
                                                        <Col className="text-right">
                                                            <HDStartDatePopup />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <HDDatePicker
                                                                webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.startDate}` }}
                                                                id="start-date-datepicker"
                                                                customClassName="customize-quote-summary__date-picker"
                                                                path={policyStartDatePath}
                                                                name={policyStartDateFieldName}
                                                                onBlur={(e) => displayRerateModalForStartDate(e)}
                                                                onSelect={(e) => displayRerateModalForStartDateSelected(e)}
                                                                theme="blue"
                                                                initialDate={new Date(pcCurrentDate)}
                                                                minDate={0}
                                                                maxDate={30} // Max date is 30 from today as per PC
                                                                showFieldsNames
                                                                information={messages.policyStartDateInfo} />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                </HDForm>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-5 mb-md-0">
                        <Col {...mainColProps}>
                            <Row className="part cover-details">
                                <Col>
                                    {_.get(customizeSubmissionVM, quoteIDPath)
                                        && (
                                            <HDCoverDetailsPage
                                                onlineProduct={onlineProduct}
                                                pageMetadata={pageMetadata}
                                                customizeSubmissionVM={customizeSubmissionVM.value}
                                                offeredQuotes={offeredQuotes}
                                                handleParentEvent={childEventHandler}
                                                ancillaryCoveragesObject={ancillaryCoveragesObject}
                                                handleDowngrade={() => setShowManualDowngrade(true)}
                                                handleUpgrade={() => setShowManualUpgrade(true)}
                                                registrationNumber={registrationNumber}
                                                isInavlidDate={isInavlidDate}
                                                protectNcd={ncdProtectionInd}
                                                previousVehicleDetails={previousVehicleDetails} />
                                        )
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {(offeredQuoteObject.offeredQuotes[0].branchCode !== messages.YD && registrationNumber && showMultiCar) && (
                        <Row>
                            <Col {...mainColProps}>
                                <Row className="part customize-quote-summary__multicar">
                                    <Col className="customize-quote-summary__multicar-info" xs={{ order: 'last', span: 12 }} sm={{ order: 'last', span: 12 }} md={{ order: 'last', span: 12 }} lg={{ order: 'first', span: 7 }}>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="customize-quote-summary__multicar-label mb-3"
                                                    text={messages.multicarPartHeader}
                                                    Tag="h4" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="customize-quote-summary__multicar-content margin-bottom-tiny"
                                                    text={messages.multicarPartInfoLine}
                                                    Tag="p" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <a onClick={goToAddAnotherCar} onKeyDown={goToAddAnotherCar} className="decorated-blue-line decorated-blue-line--on-white customize-quote-summary__multicar-link pb-0">
                                                    {messages.multicarPartLink}
                                                </a>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="customize-quote-summary__multicar-bottomline-text"
                                                    text={messages.bottomlineText}
                                                    Tag="p" />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="customize-quote-summary__multicar-image px-0" xs={{ order: 'first', span: 12 }} sm={{ order: 'first', span: 12 }} md={{ order: 'first', span: 12 }} lg={{ order: 'last', span: 5 }}>
                                        <div className="customize-quote-summary__multicar-image-desktop" />
                                        <img className="customize-quote-summary__multicar-image-mobile" src={multicarInfoImageMobile} alt="" />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
                    {!registrationNumber && (
                        <Row className="mx-0">
                            <Col {...mainColProps} className="px-mobile-0">
                                <ConnectedHDCarFinder
                                    ref={findCarInputRef}
                                    onFind={setShowVehicleDetails}
                                    findVehicleCallback={findVehicleCallback}
                                    setPreviousVehicleDetails={setPreviousVehicleDetails} />
                            </Col>
                        </Row>
                    )}
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.rerate}` }}
                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.rerateModalHeader}` }}
                        id="rerate-modal"
                        customStyle="customize-quote"
                        show={!!showRerateModal}
                        headerText={messages.rerateModalHeader}
                        confirmLabel={messages.rerateModalConfirmLabel}
                        onConfirm={callRerateAndClose}
                        hideCancelButton
                        hideClose
                    >
                        <p>
                            {messages.rerateModalContent}
                        </p>
                    </HDModal>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.missingMonthlyPaymentsModalHeader}` }}
                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.missingMonthlyPaymentsModalHeader}` }}
                        id="missing-monthly-payment-modal"
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
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.missingRegNumberModalHeader}` }}
                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.missingRegNumberModalHeader}` }}
                        id="missing-reg-number-modal"
                        customStyle="footer-btns-w-100 rev-button-order"
                        className="missing-reg-number__modal"
                        show={showMissingRegNumberPopup}
                        headerText={messages.missingRegNumberModalHeader}
                        confirmLabel={messages.missingRegNumberModalConfirmLabel}
                        cancelLabel={messages.missingRegNumberModalCancelLabel}
                        onCancel={handleAddRegNumber}
                        onConfirm={handleNoRegPopupConfirmation}
                        hideClose
                    >
                        <div className="mb-n4">
                            {messages.missingRegNumberModalContent.map((paragraph, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <p key={i}>
                                    {paragraph}
                                </p>

                            ))}
                        </div>
                    </HDModal>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.homePage}` }}
                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.homePage}` }}
                        id="home-page-modal"
                        customStyle="customize-quote customize-quote-decline"
                        show={showDeclineQuote}
                        confirmLabel={messages.homePage}
                        onConfirm={declineQuote}
                        hideCancelButton
                        hideClose
                    >
                        <HDQuoteDeclinePage isDisplayedAsModal />
                    </HDModal>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.sorryCannotChooseThat}` }}
                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.sorryCannotChooseThat}` }}
                        id="max-excess-modal"
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
                        </p>
                    </HDModal>
                    {HDToast}
                    <input type="text" hidden id="qabBlackBoxRequest" ref={blackBoxRef} />
                </Container>
            </div>
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    offeredQuoteObject: state.offeredQuoteModel,
    vehicleDetails: state.vehicleDetails,
    customQuoteData: state.customQuoteModel,
    ipidMatchForAllData: state.ipidMatchForAllModel,
    rerateModal: state.rerateModal,
    ancillaryCoveragesObject: state.wizardState.app.ancillaryCoveragesObject,
    isEditQuoteJourney: state.wizardState.app.isEditQuoteJourney,
    isEditQuoteJourneyFromSummmary: state.wizardState.app.isEditQuoteJourneyFromSummmary,
    multiCarElements: state.monetateModel.resultData,
    ncdProtectionInd: state.wizardState.app.ncdProtectionInd,
    actionType: state.wizardState.app.actionType,
    mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
});

const mapDispatchToProps = (dispatch) => ({
    setSubmissionVM: setSubmissionVMAction,
    setCustomizeSubmissionVM: setCustomizeSubmissionVMAction,
    setObjectBeforeEdit: setObjectBeforeEditAction,
    setNavigation: setNavigationAction,
    updateCustomQuote,
    getIpidMatchForAll,
    updateEpticaId: updateEpticaIdAction,
    clearLWRQuoteData: clearLWRQuoteDataAction,
    clearUpdateQuoteData: clearUpdateQuoteDataAction,
    setOfferedQuotesDetails: setOfferedQuotesDetailsAction,
    dispatch
});

HDCustomizeQuoteSummaryPage.propTypes = {
    submissionVM: PropTypes.shape({
        lobData: PropTypes.object,
        value: PropTypes.object,
        baseData: PropTypes.object,
        quoteData: PropTypes.object,
        isOnlineProductType: PropTypes.bool,
        stdOfferCommissionIncermentalVal: PropTypes.shape({}),
    }).isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    setSubmissionVM: PropTypes.func.isRequired,
    setOfferedQuotesDetails: PropTypes.func.isRequired,
    vehicleDetails: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    toggleContinueElement: PropTypes.func,
    disableContinueElement: PropTypes.func,
    showManualUpgrade: PropTypes.bool.isRequired,
    setShowManualUpgrade: PropTypes.func.isRequired,
    showManualDowngrade: PropTypes.bool.isRequired,
    setShowManualDowngrade: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func,
    onDowngrade: PropTypes.func,
    onUpgradeDowngradeCancellation: PropTypes.func,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired,
    setCustomizeSubmissionVM: PropTypes.func.isRequired,
    multiCarElements: PropTypes.shape({}).isRequired,
    customQuoteData: PropTypes.shape({ loading: PropTypes.bool, customUpdatedQuoteObj: PropTypes.object }),
    ipidMatchForAllData: PropTypes.shape({}),
    rerateModal: PropTypes.shape({
        status: PropTypes.bool.isRequired,
    }).isRequired,
    dispatch: PropTypes.shape({}),
    paymentType: PropTypes.string.isRequired,
    onPaymentTypeChange: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    setObjectBeforeEdit: PropTypes.func.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    retrieveBlackBoxRequest: PropTypes.func.isRequired,
    ancillaryCoveragesObject: PropTypes.shape({}),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    setBackNavigationFlag: PropTypes.func.isRequired,
    isEditQuoteJourney: PropTypes.bool,
    isEditQuoteJourneyDriver: PropTypes.bool,
    ncdProtectionInd: PropTypes.bool,
    isEditQuoteJourneyFromSummmary: PropTypes.bool,
    actionType: PropTypes.string
};

HDCustomizeQuoteSummaryPage.defaultProps = {
    dispatch: null,
    customQuoteData: null,
    customizeSubmissionVM: null,
    ipidMatchForAllData: null,
    ancillaryCoveragesObject: null,
    toggleContinueElement: () => { },
    disableContinueElement: () => { },
    onUpgrade: () => { },
    onDowngrade: () => { },
    onUpgradeDowngradeCancellation: () => { },
    isEditQuoteJourney: false,
    isEditQuoteJourneyDriver: false,
    ncdProtectionInd: null,
    isEditQuoteJourneyFromSummmary: false,
    actionType: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDCustomizeQuoteSummaryPage));
