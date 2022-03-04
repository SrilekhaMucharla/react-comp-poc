/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDQuoteInfoRefactor,
    HDLabelRefactor,
    HDRibbon
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import { HastingsNCDService } from 'hastings-capability-ncd';
import HDHeader from './HDHeader';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDModal as HDModal
} from '../../../web-analytics';
import EventEmmiter from '../../../EventHandler/event';
import HDMCPNCDCostQuestionPage from './HDMCPNCDCostQuestionPage';
import * as messages from './HDMCPNCDPage.messages';
import {
    updateMultiCustomQuote, resetMultiCustomUpdateQuote, setErrorStatusCode, setOfferedQuotesDetails,
    resetCurrentPageIndex as resetCurrentPageIndexAction,
    setNavigation as setNavigationAction,
    updateEmailSaveProgress as updateEmailSaveProgressAction,
    setWizardPagesState as setWizardPagesStateAction,
    setVehicleDetails,
    markNoDDModalAsDisplayed as markNoDDModalAsDisplayedAction,
} from '../../../redux-thunk/actions';
import pncdIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_Noclaims.svg';
import useToast from '../../Controls/Toast/useToast';
import {
    getMCAmount, getMultiToSingleParam, getNumberAsString, returnIsMonthlyAvailableForMCSubmissionVM
} from '../../../common/utils';
import HDMCPNCDTable from './HDMCPNCDTable';
import HDNotEligible from './HDNotEligible';
import arcTop from '../../../assets/images/background/top-arc.svg';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import formatRegNumber from '../../../common/formatRegNumber';
import getSingleSubmission from '../__helpers__/getSingleSubmission';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { trackView } from '../../../web-analytics/trackData';
import { producerCodeList } from '../../../common/producerCodeHelper';

import { checkHastingsErrorFromHastingErrorObj } from '../__helpers__/policyErrorCheck';
import { QUOTE_RATE_ERROR_CODE, HOMEPAGE } from '../../../constant/const';
import HDQuoteService from '../../../api/HDQuoteService';
import { getDataForMultiQuote } from '../../../redux-thunk/actions/multiQuote.action';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';
import HDChildsQuoteDecline from '../HDMCCustomizeQuoteSummaryPage/HDChildsQuoteDecline';
import { CUSTOMIZE_QUOTE_WIZARD } from '../../../routes/BaseRouter/RouteConst';
import { getDataForMultiQuoteAPICall } from '../../../common/submissionMappers';

const HDMCPNCDPage = ({
    multiCustomizeSubmissionVM,
    dispatch,
    customMultiQuoteData,
    mcPaymentScheduleModel,
    triggerNextRoute,
    mcsubmissionVM,
    toggleContinueElement,
    onGoBack,
    pageMetadata,
    initialCurrentCar,
    actionType,
    resetCurrentPageIndex,
    setNavigation,
    setWizardPageState,
    updateEmailSaveProgress,
    submissionVM,
    noDDModal
}) => {
    const vehicleinfo = (index, param) => `quotes.children[${index}].lobData.privateCar.coverables.vehicles.children[0].${param}`;
    const [ncdData, setNCDData] = useState(null);
    const [ncdStepBackCollection, setNCDStepBackCollection] = useState(null);
    const [ncdProtectSelection, setNCDProtectSelection] = useState(false);
    const [pncdAncillaryState, setPncdAncillaryState] = useState(false);
    const [ncdProtectionAvailed, setNCDProtectionAvailed] = useState('no');

    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();
    const [apiTriggerPoint, setAPITriggerPoint] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [stepBackTableData, setStepBackTableData] = useState(null);
    const [directSelectionFromPCW, setDirectSelectionFromPCW] = useState(true);
    const [ncdAdditionalCost, setNcdAdditionalCost] = useState(0);
    const [producerCode, setProducerCode] = useState(0);
    const [regNumber, setRegNumber] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [iscarEligible, setIscarEligible] = useState(true);
    const [currentCarIndex, setCurrentCarIndex] = useState(initialCurrentCar);
    const [insurerNameValue, setInsurerNameValue] = useState('');
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);
    const [showChildsDeclineQuote, setShowChildsDeclineQuote] = useState(false);
    const [childsQuoteDeclinedErrorCount, setChildsQuoteDeclinedErrorCount] = useState(0);
    const [deletedVehicleQuoteID, setDeletedVehicleQuoteID] = useState();
    const [removeVehicle, setRemoveVehicle] = useState(false);
    const [showNoDDModal, setShowNoDDModal] = useState(false);
    const [vehicleDeleted, setVehicleDeleted] = useState(false);
    const history = useHistory();

    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    const getChosenQuote = (quote) => {
        const chosenQuoteID = quote.bindData.chosenQuote;

        return quote.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
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

    const createMCCustomizeSubVM = () => {
        const PaymentTypeVar = returnIsMonthlyAvailableForMCSubmissionVM(mcsubmissionVM);
        if (mcsubmissionVM.value.paymentScheduleResponseMP) {
            _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', mcsubmissionVM.value.paymentScheduleResponseMP);
        } else {
            _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
        }
        const tempMultiCustomizeSubmisssionVM = [];
        const mcQuotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
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
            if (quote.isParentPolicy) {
                if (getChosenQuote(quote).hastingsPremium.monthlyPayment === undefined) {
                    if (!noDDModal.status) {
                        setShowNoDDModal(false);
                    }
                }
                _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', PaymentTypeVar);
            }

            tempMultiCustomizeSubmisssionVM.push(newCustomizeSubmissionVM);

            return null;
        });
        _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempMultiCustomizeSubmisssionVM);
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperNumber', mcsubmissionVM.value.mpwrapperNumber);
        _.set(multiCustomizeSubmissionVM.value, 'mpwrapperJobNumber', mcsubmissionVM.value.mpwrapperJobNumber);
        _.set(multiCustomizeSubmissionVM.value, 'sessionUUID', mcsubmissionVM.value.sessionUUID);
        setLoading(false);
    };

    const applyDiscountAPITriggerPoint = () => {
        HDQuoteService.applyDiscountOnMulticar(getDataForMultiQuoteAPICall(mcsubmissionVM))
            .then(({ result }) => {
                trackAPICallSuccess('applyDiscountOnMulticar');
                _.set(mcsubmissionVM, 'value', result);
                createMCCustomizeSubVM();
                updateMonthlyAnnualPrice();
                setRemoveVehicle(false);
                setLoading(false);
                setVehicleDeleted(true);
                const carIndexChanged = currentCarIndex - 1;
                setCurrentCarIndex(carIndexChanged);
            }).catch((error) => {
                trackAPICallFail('applyDiscountOnMulticar', 'applyDiscountOnMulticar Failed');
                setLoading(false);
                setErrorStatusCode(error.status);
            });
    };

    useEffect(() => {
        if (vehicleDeleted) {
            setVehicleDeleted(false);
            goForward();
        }
    }, [currentCarIndex]);

    const onDeleteVehicleConfirm = () => {
        const mcsubmissionVMCloned = _.cloneDeep(mcsubmissionVM);
        if (mcsubmissionVMCloned.value.quotes.length > 2) {
            setLoading(true);
            HDQuoteService.multiQuote(getDataForMultiQuote(mcsubmissionVMCloned, deletedVehicleQuoteID, false))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    applyDiscountAPITriggerPoint();
                    trackAPICallSuccess('Multi Quote');
                    window.scroll(0, 0);
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    setLoading(false);
                    window.scroll(0, 0);
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
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
                        // eslint-disable-next-line no-unused-vars
                        drivers.forEach((driver) => {
                            driversState.push({ licenceSuccessfulScanned: false, licenceSuccessfulValidated: true, licenceDataChanged: false });
                        });

                        dispatch(setWizardPageState({ drivers: driversState }));
                        dispatch(
                            updateEmailSaveProgress(_.get(result, 'baseData.accountHolder.emailAddress1', '')),
                        );
                        setLoading(false);
                        dispatch(setVehicleDetails({}));
                        setRemoveVehicle(false);
                        trackAPICallSuccess('Multi To Single Quote');
                        history.push({
                            pathname: CUSTOMIZE_QUOTE_WIZARD,
                            state: { PCWJourney: true, MultiToSingleCustomize: true }
                        });
                    }
                }).catch((error) => {
                    setLoading(false);
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail('Multi To Single Quote', 'Multi To Single Quote Failed');
                });
            setLoading(true);
        }
    };


    useEffect(() => {
        if (removeVehicle) {
            onDeleteVehicleConfirm();
        }
    }, [removeVehicle]);

    const goForward = () => {
        const numverOfVehicles = _.get(multiCustomizeSubmissionVM, 'customQuotes.value').length;
        if (currentCarIndex < numverOfVehicles - 1) {
            trackView({
                ...pageMetadata,
                page_section: 'Page'
            });
            setCurrentCarIndex((prevState) => {
                return prevState + 1;
            });
            window.scrollTo(0, 0);
        } else {
            triggerNextRoute();
        }
    };

    const moveBack = () => {
        if (currentCarIndex > 0) {
            trackView({
                ...pageMetadata,
                page_section: 'Page'
            });
            setCurrentCarIndex((prevState) => {
                return prevState - 1;
            });
        } else {
            toggleContinueElement(true);
            onGoBack();
        }
    };

    const getPCWProducerCodeValue = () => {
        let producerCodeValue = '';
        switch (producerCode) {
            case messages.compareTheMarket: producerCodeValue = messages.compareTheMarketValue; break;
            case messages.moneySupmarket: producerCodeValue = messages.moneySupmarketValue; break;
            case messages.confusedCom: producerCodeValue = messages.confusedComValue; break;
            case messages.goCompare: producerCodeValue = messages.goCompareValue; break;
            case messages.quoteZone: producerCodeValue = messages.quoteZoneValue; break;
            case messages.uSwitch: producerCodeValue = messages.uSwitchValue; break;
            case messages.insurerGroup: producerCodeValue = messages.insurerGroupValue; break;
            case messages.experian: producerCodeValue = messages.experianValue; break;
            default: producerCodeValue = messages.compareTheMarketValue; break;
        }
        return producerCodeValue;
    };

    const updateMonthlyAnnualPrice = () => {
        const isMonthlyPaymentAvailable = _.get(multiCustomizeSubmissionVM,
            `customQuotes.value[${currentCarIndex}].quote.hastingsPremium.monthlyPayment`, false);
        const isInsurancePaymentType = _.get(multiCustomizeSubmissionVM, 'value.insurancePaymentType', messages.PAYMENT_TYPE_ANNUALLY_CODE);
        let annualAmount = 0;
        let monthlyAmount = 0;

        // const mcsubmissionVMQuoteList = _.get(mcsubmissionVM, 'quotes.value');
        const multiCustomizeSubmissionVMQuoteList = _.get(multiCustomizeSubmissionVM, 'customQuotes.value');
        if (multiCustomizeSubmissionVMQuoteList && multiCustomizeSubmissionVMQuoteList.length > 0) {
            multiCustomizeSubmissionVMQuoteList.forEach((quote) => {
                if (quote.quote && quote.quote.hastingsPremium) {
                    if (quote.quote.hastingsPremium.annuallyPayment) {
                        annualAmount += quote.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
                    }
                    if (quote.quote.hastingsPremium.monthlyPayment) {
                        monthlyAmount += quote.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount;
                    }
                }
            });
            const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
                ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
            EventEmmiter.dispatch('change', getMCAmount(paymentType, annualAmount, monthlyAmount, mcsubmissionVM));
        }
    };

    const modifyStepBacktable = (data) => {
        data.shift();
        setStepBackTableData(data);
    };

    const getNCDData = (currentCarQuoteID) => {
        HastingsNCDService.fetchNCDData(currentCarQuoteID)
            .then(({ result: data }) => {
                setNCDData(data);
                modifyStepBacktable(data.averageDiscountCollection.averageDiscount);
                setNCDStepBackCollection(data.ncdstepBackCollection.vehicleStepBack[0]);
                trackAPICallSuccess(messages.fetchPncdData);
            })
            .catch((err) => {
                console.log(err);
                trackAPICallFail(messages.fetchPncdData, messages.fetchPncdDataFailed);
            });
    };

    const checkIsCarEligible = () => {
        const ncdYears = _.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].ncdgrantedYears`);
        const claimsDetails = _.get(mcsubmissionVM,
            `value.quotes[${currentCarIndex}].lobData.privateCar.coverables.drivers[0].claimsAndConvictions.claimsDetailsCollection`);
        const validationDate = new Date(new Date().getFullYear() - 4, new Date().getMonth(), 1);
        const faultyClaims = claimsDetails.filter((claim) => claim.wasItMyFault === true && validationDate <= new Date(claim.accidentDate));
        if (ncdYears >= 1 && faultyClaims.length < 2) {
            setIscarEligible(true);
        } else {
            setIscarEligible(false);
        }
    };

    const generateCurrentCarData = () => {
        const quoteID = _.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].quoteID`);
        const vehicleMake = _.get(mcsubmissionVM, vehicleinfo(currentCarIndex, 'make.value'));
        const vehicleModel = _.get(mcsubmissionVM, vehicleinfo(currentCarIndex, 'model.value'));
        setProducerCode(_.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].producerCode`));
        let vehiclePncdAmount;
        if (multiCustomizeSubmissionVM.value && multiCustomizeSubmissionVM.value.customQuotes[currentCarIndex].coverables) {
            vehiclePncdAmount = multiCustomizeSubmissionVM.value.customQuotes[currentCarIndex].coverables
                .vehicles[0].ncdProtection.ncdProtectionAdditionalAmount;
        } else {
            vehiclePncdAmount = _.get(mcsubmissionVM,
                `quotes.value[${currentCarIndex}].lobData.privateCar.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount`);
        }
        setNcdAdditionalCost(vehiclePncdAmount);
        setRegNumber(_.get(mcsubmissionVM, vehicleinfo(currentCarIndex, 'license.value')));
        setVehicleName(`${vehicleMake} ${vehicleModel}`);
        const ncdProtectValue = _.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].ncdgrantedProtectionInd`);
        getNCDData(quoteID);

        setNCDProtectSelection(ncdProtectValue);
        checkIsCarEligible();
        if (ncdProtectValue) {
            setPncdAncillaryState(true);
            setNCDProtectionAvailed('yes');
        } else {
            setPncdAncillaryState(false);
            setNCDProtectionAvailed('no');
        }
        const insurerName = _.get(mcsubmissionVM, `value.quotes[${currentCarIndex}].baseData.insurerName`, '');
        setInsurerNameValue(insurerName);
    };

    const formattedRegNumber = useMemo(() => formatRegNumber(regNumber), [regNumber]);

    useEffect(() => {
        toggleContinueElement(false);
        generateCurrentCarData();
    }, []);

    useEffect(() => {
        const preSelectedNCD = _.get(mcsubmissionVM, vehicleinfo(currentCarIndex, 'ncdProtection.drivingExperience.protectNCD.value'));
        const ncdProtectValue = _.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].ncdgrantedProtectionInd`);
        if (preSelectedNCD && !ncdProtectValue) {
            setPncdAncillaryState(true);
            setNCDProtectionAvailed('no');
        }
        if (!preSelectedNCD) {
            setDirectSelectionFromPCW(false);
        }
        updateMonthlyAnnualPrice();
    }, [mcsubmissionVM]);

    const childsDeclineQuote = () => {
        setShowChildsDeclineQuote(false);
        setRemoveVehicle(true);
    };

    useEffect(() => {
        if (!customMultiQuoteData.loading && customMultiQuoteData && apiTriggerPoint) {
            let childQuoteDeclinedErrorCount = 0;
            const customUpdatedQuotes = (_.get(customMultiQuoteData, 'multiCustomUpdatedQuoteObj.customQuotesResponses', []));
            customUpdatedQuotes.map((customUpdatedQuote) => {
                mcsubmissionVM.quotes.children.map((quoteObj) => {
                    if (quoteObj.value.quoteID === customUpdatedQuote.quoteID) {
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
                return null;
            });
            if (childQuoteDeclinedErrorCount > 0) {
                const result = customUpdatedQuotes.length - childQuoteDeclinedErrorCount;
                setChildsQuoteDeclinedErrorCount(result);
                setShowChildsDeclineQuote(true);
            }
            _.set(multiCustomizeSubmissionVM.value, 'customQuotes', customMultiQuoteData.multiCustomUpdatedQuoteObj.customQuotesResponses);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[currentCarIndex],
                'ncdProtectionAdditionalAmount',
                customMultiQuoteData.multiCustomUpdatedQuoteObj
                    .customQuotesResponses[currentCarIndex].coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);

            setNCDProtectionAvailed('yes');
            const ncdAdditionAmount = multiCustomizeSubmissionVM.value.customQuotes[currentCarIndex].ncdProtectionAdditionalAmount;
            setNcdAdditionalCost(ncdAdditionAmount);
            setLoading(false);
            if (_.get(multiCustomizeSubmissionVM, `customQuotes.value[${currentCarIndex}].ncdgrantedProtectionInd`)) {
                setPncdAncillaryState(true);
            } else {
                setPncdAncillaryState(false);
                setNCDProtectSelection(false);
            }
            addToast(
                {
                    webAnalyticsEvent: {
                        event_action: `${messages.ancillariesNCD}`,
                        event_value: `${selectedValue === 'yes' ? messages.add : messages.remove} ${messages.pageTitle(messages.vehiclePlaceholder)}`
                    },
                    webAnalyticsView: {
                        ...pageMetadata,
                        page_section: `${messages.ancillaries} - ${selectedValue === 'yes'
                            ? messages.add
                            : messages.remove} ${messages.pageTitle(messages.vehiclePlaceholder)}`
                    },
                    id: 'mc-pncd-toast',
                    iconType: selectedValue === 'yes' ? 'tick' : 'cross',
                    bgColor: 'main',
                    content: selectedValue === 'yes' ? (
                        <span>
                            {messages.ncdAddedToastMsg1}
                            <span className="car-reg-tile ml-1">{formattedRegNumber}</span>
                            {messages.ncdAddedToastMsg2}
                            {ncdAdditionAmount.toFixed(2)}
                        </span>
                    ) : (
                        <span>
                            {messages.mcNcdRemoverToastMsg1}
                            <span className="car-reg-tile ml-1">{formattedRegNumber}</span>
                            {messages.mcNcdRemoverToastMsg2}
                        </span>
                    )
                }
            );
            updateMonthlyAnnualPrice();
            if (customMultiQuoteData.multiCustomUpdatedQuoteObj.paymentScheduleResponseMP) {
                _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', customMultiQuoteData.multiCustomUpdatedQuoteObj.paymentScheduleResponseMP);
            } else {
                _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
            }
            dispatch(resetMultiCustomUpdateQuote());
            setAPITriggerPoint(false);
        }
    }, [customMultiQuoteData]);

    useEffect(() => {
        generateCurrentCarData();
        checkIsCarEligible();
    }, [currentCarIndex]);

    const getNCDDetailsOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.ancillariesNCD }}
            webAnalyticsEvent={{ event_action: messages.ancillariesNCD }}
            id="mc-pncd-details-overlay"
            className="pncd__details-overlay"
            showButtons={false}
            overlayButtonIcon={(
                <div className="mb-2">
                    <HDLabelRefactor
                        Tag="a"
                        className="pncd__details-overlay__link decorated-blue-line decorated-blue-line--on-white mulitline-text"
                        text={messages.importantInfo} />
                </div>
            )}
        >
            {ncdData && ncdStepBackCollection
                && (
                    <div className="pncd-overlay">
                        <div className="mb-5">
                            <HDLabelRefactor
                                icon={<img src={pncdIcon} alt="PNCD Icon" />}
                                Tag="h2"
                                iconPosition="r"
                                text={messages.overlayHeader}
                                adjustImagePosition={false}
                                className="pncd__title-label mt-1 mb-4"
                                id="pncd-title-label" />
                            <p>{messages.overlayBodyOne}</p>
                            <p>{messages.overlayBodyTwo}</p>
                            <p>{messages.overlayBodyThree(ncdAdditionalCost, ncdStepBackCollection.yearsNCD, insurerNameValue)}</p>
                        </div>
                        <HDMCPNCDTable ncdData={stepBackTableData} ncdStepBackCollection={ncdStepBackCollection} />
                        <p className="pncd_overlay__renewal-date-info">
                            {messages.ncdProtectionTableTitle}
                            <strong><u>{messages.withoutText}</u></strong>
                            {messages.ncdProtectionTableTitleOne}
                        </p>
                        <HDLabelRefactor
                            Tag="h5"
                            text={`${ncdStepBackCollection.yearsNCD}${messages.yearsNCD(ncdStepBackCollection.yearsNCD)}`}
                            className="step-back-tab__text" />
                        <table className="ncd-protection-table">
                            <thead className="ncd-protection-table__head">
                                <tr className="ncd-protection-table__head__row">
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeaderOne(1, 12)}</th>
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeader(2, 12)}</th>
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeader(3, 12)}</th>
                                </tr>
                            </thead>
                            <tbody className="ncd-protection-table__body">
                                <tr className="ncd-protection-table__body__row">
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterOneClaim}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterOneClaim)}
                                    </td>
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterTwoClaims}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterTwoClaims)}
                                    </td>
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterThreeClaims}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withoutNCDProtection.yearsNCDAfterThreeClaims)}

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="pncd_overlay__renewal-date-info">
                            {messages.ncdProtectionTableTitle}
                            <strong><u>{messages.withText}</u></strong>
                            {messages.ncdProtectionTableTitleOne}
                        </p>
                        <HDLabelRefactor
                            Tag="h5"
                            text={`${ncdStepBackCollection.yearsNCD}${messages.yearsNCD(ncdStepBackCollection.yearsNCD)}`}
                            className="step-back-tab__text" />
                        <table className="ncd-protection-table">
                            <thead className="ncd-protection-table__head">
                                <tr className="ncd-protection-table__head__row">
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeaderOne(1, 36)}</th>
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeader(2, 36)}</th>
                                    <th className="ncd-protection-table__head__row__th">{messages.ncdProtectionTableHeader(3, 36)}</th>
                                </tr>
                            </thead>
                            <tbody className="ncd-protection-table__body">
                                <tr className="ncd-protection-table__body__row">
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterOneClaim}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterOneClaim)}
                                    </td>
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterTwoClaims}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterTwoClaims)}

                                    </td>
                                    <td className="ncd-protection-table__body__row__td">
                                        {ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterThreeClaims}
                                        {messages.years(ncdStepBackCollection.ncdstepBack.withNCDProtection.yearsNCDAfterThreeClaims)}

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
        </HDOverlayPopup>
    );

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };

    const updateAPICall = (data) => {
        const payloadObj = {
            ...multiCustomizeSubmissionVM.value,
            customQuotes: multiCustomizeSubmissionVM.value.customQuotes.filter((value, index) => { return index === currentCarIndex; })
        };
        setLoading(true);
        setAPITriggerPoint(true);
        _.set(payloadObj.customQuotes[0], 'ncdgrantedProtectionInd', data);
        dispatch(updateMultiCustomQuote(payloadObj));
    };

    const handleNCDAvailTrigger = (event) => {
        setSelectedValue(event.target.value);
        setDirectSelectionFromPCW(false);
        if (event.target.value === 'no') {
            _.set(mcsubmissionVM,
                `quotes.value[${currentCarIndex}].lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD`, false);
            setSelectedValue('no');
            updateAPICall(false);
        } else {
            _.set(mcsubmissionVM,
                `quotes.value[${currentCarIndex}].lobData.privateCar.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD`, true);
            setSelectedValue('yes');
            updateAPICall(true);
        }
    };

    return (
        <>
            <HDRibbon text={formattedRegNumber} className="vehicle-ribbon vehicle-ribbon--cq" />
            <Container fluid>
                <Row>
                    <Col xs={12} className={`wizard-head mc-important-stuff__head arc-header pt-0 ${currentCarIndex > 0 && 'pncd_no_header'}`}>
                        {currentCarIndex < 1 && <img className="arc-header_arc" alt="arc-header" src={arcTop} />}
                        <Row>
                            <Col {...mainColProps}>
                                <Row>
                                    <Col xs={12}>
                                        <BackNavigation
                                            id="backNavMainWizard"
                                            className="mb-0 mt-4"
                                            onClick={moveBack}
                                            onKeyPress={moveBack} />
                                    </Col>
                                </Row>
                                {currentCarIndex < 1 && (
                                    <Row className="margin-top-md">
                                        <Col xs={12}>
                                            <HDHeader
                                                multicarReference=""
                                                messages={{ title: messages.pageHeaderTitle, paragraphText: messages.pageHeaderParagraph }} />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className={`pt-4 pncd__reg-num${(currentCarIndex === 0) ? ' additional-margin' : ''}`}>
                    <Col {...mainColProps}>
                        <span className="car-reg-tile">{formattedRegNumber}</span>
                    </Col>
                </Row>
                {!iscarEligible && <HDNotEligible mainColProps={mainColProps} message={messages.notEligibleTitle(vehicleName)} goForward={goForward} />}

                {iscarEligible && !ncdProtectSelection && !pncdAncillaryState && (
                    <Row className="pncd-container padding-bottom-xl pt-4">
                        <Col {...mainColProps}>
                            <HDMCPNCDCostQuestionPage
                                ncdAvailedValue={ncdProtectSelection}
                                onContinueHandler={goForward}
                                displayNCDCostPage={handleNCDAvailTrigger}
                                vehicleName={vehicleName} />
                        </Col>
                        <Row>
                            {loading ? (
                                <Col>
                                    <LoadingOverlay
                                        active={loading}
                                        spinner={loading}
                                        text={messages.spinnerText} />
                                </Col>
                            ) : null}
                        </Row>
                        {HDToast}
                    </Row>
                )}

                {iscarEligible && pncdAncillaryState && getSingleSubmission(mcsubmissionVM, currentCarIndex).value && (
                    <Row className="pncd-container padding-bottom-xl pt-4">
                        <Col {...mainColProps}>
                            <div className="container--anc">
                                <HDLabelRefactor
                                    icon={<img src={pncdIcon} alt="PNCD Icon" />}
                                    Tag="h2"
                                    iconPosition="r"
                                    adjustImagePosition={false}
                                    text={messages.pageTitle(vehicleName)}

                                    className="pncd__title-label mb-3 mt-0"
                                    id="pncd-title-label" />
                                {ncdStepBackCollection && (
                                    <div>
                                        <h3>
                                            {
                                                getSingleSubmission(mcsubmissionVM, currentCarIndex).value.isParentPolicy
                                                    ? messages.ncdProtectText(ncdStepBackCollection.yearsNCD)
                                                    : messages.childNcdProtectText(ncdStepBackCollection.yearsNCD)
                                            }
                                            {(producerCode !== messages.defaultText
                                                && producerCode !== messages.clearScore
                                                && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode))
                                                && directSelectionFromPCW)
                                                && <span>{messages.PCW(getPCWProducerCodeValue())}</span>}
                                        </h3>
                                    </div>
                                )}
                                <p>
                                    {
                                        getSingleSubmission(mcsubmissionVM, currentCarIndex).value.isParentPolicy
                                            ? messages.pncdDescriptionOne
                                            : messages.childPncdDescriptionOne
                                    }
                                    <strong>
                                        {
                                            getSingleSubmission(mcsubmissionVM, currentCarIndex).value.isParentPolicy
                                                ? messages.pncdDescriptionCostTwo
                                                : messages.childPncdDescriptionCostTwo
                                        }
                                    </strong>
                                    {
                                        getSingleSubmission(mcsubmissionVM, currentCarIndex).value.isParentPolicy
                                            ? messages.pncdDescriptionThree
                                            : messages.childPncdDescriptionThree
                                    }
                                </p>

                                <HDQuoteInfoRefactor>
                                    <span>
                                        {messages.ncdCostText}
                                        <span className="font-bold">
                                            {messages.ncdCostAmount(ncdAdditionalCost)}
                                        </span>
                                        <span>{messages.alreadyIncluded}</span>
                                    </span>
                                    {getNCDDetailsOverlay}
                                </HDQuoteInfoRefactor>

                                <HDToggleButtonGroup
                                    webAnalyticsEvent={{ event_action: `${messages.ancillariesNCD} - ${messages.pncdQuestion}` }}
                                    id="mc-pncd-protect-pncd-button-group"
                                    availableValues={availableValues}
                                    label={{
                                        Tag: 'h4',
                                        text: getSingleSubmission(mcsubmissionVM, currentCarIndex).value.isParentPolicy
                                            ? messages.pncdQuestion
                                            : messages.childPncdQuestion,
                                        className: 'pncd__protect-q-header mb-3'
                                    }}
                                    name="pncd-cover"
                                    value={ncdProtectionAvailed}
                                    onChange={handleNCDAvailTrigger}
                                    btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                                    btnClassName="theme-white" />
                                {(producerCode !== messages.defaultText && producerCode !== messages.clearScore
                                && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode)) && directSelectionFromPCW) && (
                                    <HDQuoteInfoRefactor className="pncd__preselected-on-info mb-0">
                                        <span>
                                            {messages.preselectedText}
                                            <strong>{getPCWProducerCodeValue()}</strong>
                                        </span>
                                    </HDQuoteInfoRefactor>
                                )}
                                <Row>
                                    <Col md={6}>
                                        <HDButton
                                            webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                            id="continue-button"
                                            size="lg"
                                            className="pncd__continue-btn w-100 theme-white"
                                            label={messages.continueMessage}
                                            onClick={goForward} />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Row>
                            {loading ? (
                                <Col>
                                    <LoadingOverlay
                                        active={loading}
                                        spinner={loading}
                                        text={messages.spinnerText} />
                                </Col>
                            ) : null}
                        </Row>
                        {HDToast}
                    </Row>
                )}
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
            </Container>
        </>
    );
};


const mapStateToProps = (state) => ({
    multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
    mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    customMultiQuoteData: state.customMultiQuoteModel,
    mcPaymentScheduleModel: state.mcPaymentScheduleModel,
    actionType: state.wizardState.app.actionType,
    submissionVM: state.wizardState.data.submissionVM,
    noDDModal: state.noDDModal,
});

const mapDispatchToProps = (dispatch) => ({
    updateMultiCustomQuote,
    resetMultiCustomUpdateQuote,
    setErrorStatusCode,
    resetCurrentPageIndex: resetCurrentPageIndexAction,
    setNavigation: setNavigationAction,
    setWizardPageState: setWizardPagesStateAction,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
    dispatch
});

HDMCPNCDPage.propTypes = {
    multiCustomizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }),
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }),
    toggleContinueElement: PropTypes.func.isRequired,
    dispatch: PropTypes.shape({}),
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        customUpdatedQuoteObj: PropTypes.object,
        multiCustomUpdatedQuoteObj: PropTypes.shape({
            customQuotesResponses: PropTypes.array,
            paymentScheduleResponseMP: PropTypes.array
        })
    }),
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }),
    triggerNextRoute: PropTypes.func,
    onGoBack: PropTypes.func,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    initialCurrentCar: PropTypes.number.isRequired,
    actionType: PropTypes.string,
    resetCurrentPageIndex: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    updateEmailSaveProgress: PropTypes.func.isRequired,
    submissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    noDDModal: PropTypes.shape({
        status: PropTypes.bool.isRequired,
    }).isRequired,
};

HDMCPNCDPage.defaultProps = {
    multiCustomizeSubmissionVM: null,
    mcsubmissionVM: null,
    dispatch: null,
    customMultiQuoteData: null,
    mcPaymentScheduleModel: null,
    triggerNextRoute: () => { },
    onGoBack: () => { },
    actionType: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDMCPNCDPage));
