/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import {
    HDAlertRefactor, HDQuoteInfoRefactor, HDQuoteDownloadRefactor, HDLabelRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroupRefactor,
    AnalyticsHDButton as HDButtonRefactor,
    AnalyticsHDModal as HDModal,
    AnalyticsHDTable as HDTable
} from '../../../web-analytics';
import * as messages from './HDCustomizeQuoteBreakDownCoverPage.messages';
import {
    updateQuoteCoverages, updateAncillaryJourney, getIpidDocumnet, setNavigation as setNavigationAction
} from '../../../redux-thunk/actions';
import * as helper from './HDCustomizeQuoteBreakDownCoverHelper';
import HDCustomizeQuoteBreakDownCoverOverlay from './HDCustomizeQuoteBreakDownCoverOverlay';
import EventEmmiter from '../../../EventHandler/event';
import RACImage from '../../../assets/images/wizard-images/RAC.png';
import {
    getAmount, iPidAncillaryAPIObject,
    isSafariAndiOS, generateDownloadableLink
} from '../../../common/utils';
import { BREAKDOWN, BREAKDOWN_PRESELECT } from '../../../constant/const';
import useToast from '../../Controls/Toast/useToast';
import { getPCWName } from '../HDMotorLegal/HastingsPCWHelper';
import iconDownload from '../../../assets/images/wizard-images/hastings-icons/icons/hd-download.svg';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import { producerCodeList } from '../../../common/producerCodeHelper';

const HDCustomizeQuoteBreakDownCoverPage = (props) => {
    const {
        customizeSubmissionVM, updateQuoteCoveragesData, dispatch, location, ancillaryJourneyDataModel, setNavigation, pageMetadata
    } = props;
    const [showCover, setCover] = useState('true');
    const [brand, setBrand] = useState(null);
    const [isSelected, setSelected] = useState(false);
    const [canContinue, setCanContinue] = useState(false);
    const [screenFrom, setScreenFrom] = useState(null);
    const [modalContent, setModalContent] = useState({});
    const [coverNeeded, setCoverNeeded] = useState(true);
    const [breakDownCover, setBreakdownCover] = useState(null);
    const [selectedHeaderIndex, setSelectedHeaderIndex] = useState(-1);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [includeExpensesCover, setIncludeExpensesCover] = useState(null);
    const [initialBreakDownValue, setInitialBreakdownValue] = useState(null);
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const [oneTimeHPSelectedValue, setOneTimeHPSelectedValue] = useState(false);
    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();
    const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const branchCodePath = 'quote.branchCode';
    const ancDataPath = 'coverages.privateCar.ancillaryCoverages';
    const ancData = _.get(customizeSubmissionVM, `${ancDataPath}.value`);
    const [preSelectedValue, setPreselectedValue] = useState(true);
    const [preSelectedValFromPCW, setPreSelectedValFromPCW] = useState(true);
    const [fireEventOnSelection, setFireEventOnSelection] = useState(true);
    const [fireToastSelection, setFireToastOnSelection] = useState(true);
    const [goToNextRoute, setGoToNextRoute] = useState(false);
    const isBreakDownChosen = useSelector((state) => state.wizardState.app.breakDownCoverChosen);
    const isPcwBreakdownChosen = useSelector((state) => state.wizardState.app.pcwBreakdownChosen);
    const preSelectedTerms = useSelector((state) => state.wizardState.app.chosenAncillaryTerms);
    const canShowContinue = useSelector((state) => state.wizardState.app.showContinueOnRAC);
    // to set the toggle value
    const availableValues = [{
        value: 'true',
        name: messages.yes
    }, {
        value: 'false',
        name: messages.no
    }];

    // set table index based on defaultPrimaryHeaderName
    const setPreAndSelectedHeaderIndex = () => {
        const { producerCode } = customizeSubmissionVM;
        const racEssentials = _.get(customizeSubmissionVM, 'value.racEssentials', {});
        customizeSubmissionVM && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data, index1) => {
            data.coverages.map((nestedData, index2) => {
                if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    const isTermAvailable = _.get(customizeSubmissionVM, `value.coverages.privateCar.ancillaryCoverages[${index1}].coverages[${index2}].terms`);
                    if (isTermAvailable.length) {
                        isTermAvailable.map((termObject) => {
                            const selectedTermindexes = termObject.options.reduce((r, item, i) => (item.code.includes(termObject.chosenTerm) ? (r.push(i), r) : r), []);
                            if ((_.get(customizeSubmissionVM, `${branchCodePath}.value`) === messages.HP)
                            || (location && location.state && location.state.PCWJourney && isPcwBreakdownChosen)
                            || ((producerCode && producerCode.value !== 'Default' && (producerCode.value !== messages.directText && !_.includes(producerCodeList, producerCode)) && producerCode.value !== 'ClearScore' && isPcwBreakdownChosen))
                            || (racEssentials.isBreakdownEssential || racEssentials.isEuropeEssential || racEssentials.isHomeEssential || racEssentials.isTransportEssential)) {
                                setSelectedHeaderIndex(selectedTermindexes[0]);
                                setBrand(helper.defaultPrimaryHeaderName[selectedTermindexes[0]]);
                            }
                        });
                    } else {
                        // remove the table index if term object is not available
                        setSelectedHeaderIndex(-1);
                    }
                }
                return null;
            });
            return null;
        });
    };

    // to set the toggle value dynamically
    const setBreakDown = (coverStr) => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                        setInitialBreakdownValue(nestedData && nestedData.selected && nestedData.terms && nestedData.terms.length
                            ? nestedData.terms[0].chosenTermValue : false);
                        if ((messages.pcwRoute === coverStr && nestedData.selected)
                            || (messages.pcwRoute === coverStr && nestedData.selected && ancillaryJourneyDataModel.breakdownPreselect)) {
                            setBreakdownCover(messages.trueString);
                            setOneTimeSelectedValue(messages.trueString);
                            setPreselectedValue(false);
                        } else if (messages.pcwRoute === coverStr && ancillaryJourneyDataModel.breakdown) {
                            setBreakdownCover(nestedData.selected ? messages.trueString : messages.falseString);
                            setOneTimeSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            dispatch(setNavigation({ showContinueOnRAC: true }));
                        } else if (messages.premierRoute === coverStr) {
                            // set preselected value in case of PCW and HP
                            setBreakdownCover(nestedData.selected ? messages.trueString : messages.falseString);
                            setOneTimeSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            // set value to restrict the api first call for HP
                            messages.premierRoute === coverStr ? setOneTimeHPSelectedValue(true) : setOneTimeHPSelectedValue(false);
                        } else if (messages.directRoute === coverStr && nestedData.selected) {
                            // set breakdown value true in case of direct route and user selected and navigated back
                            setBreakdownCover(messages.trueString);
                            setOneTimeSelectedValue(messages.trueString);
                        } else if (messages.directRoute === coverStr && !nestedData.selected) {
                            if (ancillaryJourneyDataModel.breakdown) {
                                setBreakdownCover(nestedData.selected ? messages.trueString : messages.falseString);
                                dispatch(setNavigation({ showContinueOnRAC: true }));
                            } else {
                                setBreakdownCover(null);
                            }
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };
    // to set the breakdown amount
    const setCoverExpense = () => {
        const isTruthy = (breakDownCover === messages.trueString || breakDownCover === messages.smallYes);
        const isFalsy = (breakDownCover === messages.falseString || breakDownCover === messages.smallNo);
        let breakdownVal; let roadsideAmount; let roadSideBreakdown;
        customizeSubmissionVM
            && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                        setInitialBreakdownValue(nestedData && nestedData.selected && nestedData.terms && nestedData.terms.length
                            ? nestedData.terms[0].chosenTermValue : false);
                        nestedData.terms.map((termsObj) => {
                            roadsideAmount = termsObj.options && termsObj.options.filter((option) => option.name === 'Roadside');
                            if (screenFrom === messages.premierRoute) {
                                roadSideBreakdown = roadsideAmount && roadsideAmount[0].amount && roadsideAmount[0].amount.amount;
                                breakdownVal = (nestedData.amount.amount - roadSideBreakdown).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            } else {
                                breakdownVal = getAmountAsTwoDecimalDigit(nestedData.amount.amount);
                            }
                        });
                        if (brand || isFalsy) {
                            addToast({
                                id: 'breakdown-cover-toast',
                                webAnalyticsEvent: { event_action: messages.ancillaries, event_value: `${isTruthy === messages.trueString ? messages.add : messages.remove} ${messages.breakDownCoverHeader}` },
                                webAnalyticsView: { ...pageMetadata, page_section: `${messages.ancillaries} - ${isTruthy ? messages.add : messages.remove} ${messages.breakDownCoverHeader}` },
                                iconType: isTruthy ? 'tick' : 'cross',
                                bgColor: 'main',
                                content: isTruthy ? messages.popupMessage(breakdownVal || messages.defaultAmount) : messages.removedPopupMessage
                            });
                        }
                    }
                });
            });
    };
    // to set the table based on cover
    useEffect(() => {
        const { producerCode } = customizeSubmissionVM;
        if (_.get(customizeSubmissionVM, `${branchCodePath}.value`) === messages.HP) {
            setScreenFrom(messages.premierRoute);
            setBreakDown(messages.premierRoute);
            setCover(messages.trueString);
        } else if ((location && location.state && location.state.PCWJourney)
            || (producerCode && producerCode.value !== 'Default' && producerCode.value !== 'ClearScore')) {
            setScreenFrom(messages.pcwRoute);
            setBreakDown(messages.pcwRoute);
            setCover(messages.trueString);
        } else {
            setScreenFrom(messages.directRoute);
            setBreakDown(messages.directRoute);
            setCover(messages.trueString);
        }
        setPreAndSelectedHeaderIndex();
    }, [customizeSubmissionVM]);

    useEffect(() => {
        // to update the customizeSubmissionVM after each api call
        if (customizeSubmissionVM
            && updateQuoteCoveragesData
            && (_.get(updateQuoteCoveragesData, 'quoteCoveragesObj')
                && Object.keys(updateQuoteCoveragesData.quoteCoveragesObj).length > 0)
            && aPITriggerPoint) {
            setLoading(false);
            _.set(customizeSubmissionVM.value, 'coverages', updateQuoteCoveragesData.quoteCoveragesObj.coverages);
            if (preSelectedTerms === null) {
                dispatch(setNavigation({ chosenAncillaryTerms: updateQuoteCoveragesData.quoteCoveragesObj.coverages.privateCar.ancillaryCoverages }));
            }
            _.set(customizeSubmissionVM.value, 'quote', updateQuoteCoveragesData.quoteCoveragesObj.quote);
            _.set(customizeSubmissionVM.value, 'quoteID', updateQuoteCoveragesData.quoteCoveragesObj.quoteID);
            _.set(customizeSubmissionVM.value, 'sessionUUID', updateQuoteCoveragesData.quoteCoveragesObj.sessionUUID);
            _.set(customizeSubmissionVM.value, 'periodStartDate', updateQuoteCoveragesData.quoteCoveragesObj.periodStartDate);
            _.set(customizeSubmissionVM.value, 'periodEndDate', updateQuoteCoveragesData.quoteCoveragesObj.periodEndDate);
            _.set(customizeSubmissionVM.value, 'coverType', updateQuoteCoveragesData.quoteCoveragesObj.coverType);
            _.set(customizeSubmissionVM.value, 'voluntaryExcess', updateQuoteCoveragesData.quoteCoveragesObj.voluntaryExcess);
            _.set(customizeSubmissionVM.value, 'ncdgrantedYears', updateQuoteCoveragesData.quoteCoveragesObj.ncdgrantedYears);
            _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', updateQuoteCoveragesData.quoteCoveragesObj.ncdgrantedProtectionInd);
            _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount', updateQuoteCoveragesData.quoteCoveragesObj.coverables
                ? updateQuoteCoveragesData.quoteCoveragesObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount : 0);
            _.set(customizeSubmissionVM.value, 'producerCode', updateQuoteCoveragesData.quoteCoveragesObj.producerCode);
            _.set(customizeSubmissionVM.value, 'insurancePaymentType', updateQuoteCoveragesData.quoteCoveragesObj.insurancePaymentType);
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', updateQuoteCoveragesData.quoteCoveragesObj.otherQuotes);
            setAPITriggerPoint(false);
            if (!preSelectedValue) {
                setIncludeExpensesCover(true);
                dispatch(updateAncillaryJourney(BREAKDOWN));
                setCoverExpense();
            }
            if (goToNextRoute) {
                setGoToNextRoute(false);
                dispatch(setNavigation({ breakDownCoverChosen: true }));
                props.navigate(true);
            }
        }
        // api error handling
        if (updateQuoteCoveragesData
            && updateQuoteCoveragesData.quoteCoveragesError
            && aPITriggerPoint) {
            setLoading(false);
            setPreAndSelectedHeaderIndex();
            setAPITriggerPoint(false);
            setIncludeExpensesCover(null);
        }
        // to update the monthly or annual price
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        const annualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const monthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        if (!preSelectedValue) {
            EventEmmiter.dispatch('change', getAmount(paymentType, annualAmount, monthlyAmount));
        }
    }, [updateQuoteCoveragesData, customizeSubmissionVM]);

    // to handle the ipid doc success and error
    useEffect(() => {
        const ipiddFailureObj = _.get(ancillaryJourneyDataModel, 'ipidDocError.error');
        if (ipiddFailureObj) {
            // TODO: error handeling for ipid match for all api call
        }
    }, [ancillaryJourneyDataModel]);

    // update quote api call
    const updateBreakdownAPICall = (eventValue, apiCallFlag) => {
        const isFalsy = (eventValue === messages.falseString || eventValue === messages.smallNo);
        const isTruthy = (eventValue === messages.trueString || eventValue === messages.smallYes);
        let brekdownPostResponse = null;
        customizeSubmissionVM && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data, index1) => {
            data.coverages.map((nestedData, index2) => {
                if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    brekdownPostResponse = nestedData && nestedData.selected && nestedData.terms && nestedData.terms.length
                        ? nestedData.terms[0].chosenTermValue : false;
                    const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                    _.set(covaragePath, 'selected', eventValue === messages.trueString);
                    _.set(covaragePath, 'updated', eventValue === messages.trueString);
                    // call api in case of breakdown value is Yes / preselected No and selecting Yes
                    if ((apiCallFlag && isFalsy)
                        || (apiCallFlag && isTruthy && brekdownPostResponse !== initialBreakDownValue)
                        || (apiCallFlag && isTruthy && !brekdownPostResponse)) {
                        dispatch(updateQuoteCoverages(customizeSubmissionVM));
                        setLoading(true);
                        setAPITriggerPoint(true);
                    } else {
                        setIncludeExpensesCover(true);
                        dispatch(updateAncillaryJourney(BREAKDOWN));
                        if (goToNextRoute || (isTruthy && brekdownPostResponse && brand)) {
                            if (fireToastSelection) {
                                setFireToastOnSelection(false);
                                setCoverExpense();
                            }
                            setGoToNextRoute(false);
                            dispatch(setNavigation({ breakDownCoverChosen: true }));
                            props.navigate(true);
                        }
                    }
                }
                return null;
            });
            return null;
        });
    };
    // breakdown onchange method
    const trackBreakDownCover = (event) => {
        setCover(event.target.value);
        setBreakdownCover(event.target.value);
        dispatch(setNavigation({ breakDownCoverChosen: false }));
        if (event.target.value !== messages.trueString) {
            setBrand(null);
            setSelectedHeaderIndex(-1);
            const racEssentials = {
                isBreakdownEssential: false,
                isEuropeEssential: false,
                isHomeEssential: false,
                isTransportEssential: false
            };
            _.set(customizeSubmissionVM, 'value.racEssentials', racEssentials);
        }
        const isTrue = (event.target.value === messages.trueString || event.target.value === messages.smallYes
            || event.target.getAttribute('previousvalue') === messages.trueString || event.target.getAttribute('previousvalue') === messages.smallYes);
        if (isTrue && !ancillaryJourneyDataModel.breakdownPreselect && fireEventOnSelection) {
            setFireEventOnSelection(false);
            updateBreakdownAPICall(event.target.value, true);
            dispatch(setNavigation({ breakDownCoverChosen: false }));
        } else if (event.target.value === messages.falseString && !preSelectedValue) {
            setGoToNextRoute(true);
            updateBreakdownAPICall(event.target.value, true);
            dispatch(setNavigation({ breakDownCoverChosen: false }));
        } else if (event.target.value === messages.falseString && preSelectedValue) {
            dispatch(updateAncillaryJourney(BREAKDOWN));
            props.navigate(true);
            dispatch(setNavigation({ breakDownCoverChosen: true }));
        } else {
            dispatch(setNavigation({ breakDownCoverChosen: false }));
            updateBreakdownAPICall(event.target.value, false);
        }
        setPreselectedValue(false);
        setPreSelectedValFromPCW(false);
    };
    // set breakdown term based on table value selection
    const setBreakdownTerm = (selectedVal) => {
        const selectedIndexNumber = helper.defaultPrimaryHeaderName.indexOf(selectedVal);
        setSelectedHeaderIndex(selectedIndexNumber);
        ancData.map((coveragesObj, index1) => {
            coveragesObj.coverages.map((coveragesChildObj, index2) => {
                if (coveragesChildObj.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    if (coveragesChildObj.terms && coveragesChildObj.terms.length) {
                        coveragesChildObj.terms.map((termsObj, index3) => {
                            termsObj.options.map((optionsObj, index4) => {
                                if (selectedIndexNumber === index4) {
                                    const setValuePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3];
                                    const chosenTermPath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].code;
                                    const chosenTermValuePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].name;
                                    _.set(setValuePath, 'chosenTerm', chosenTermPath);
                                    _.set(setValuePath, 'chosenTermValue', chosenTermValuePath);
                                    _.set(setValuePath, 'updated', true);
                                }
                            });
                        });
                    }
                    if (_.isEmpty(coveragesChildObj.terms)) {
                        getTermsFromStore(selectedIndexNumber);
                    }
                }
            });
        });
    };
    const getTermsFromStore = (brandIndex) => {
        preSelectedTerms.map((coveragesObj, index1) => {
            coveragesObj.coverages.map((coveragesChildObj, index2) => {
                if (coveragesChildObj.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    coveragesChildObj.terms.map((termsObj, index3) => {
                        termsObj.options.map((optionsObj, index4) => {
                            if (brandIndex === index4) {
                                _.set(customizeSubmissionVM.value, 'coverages.privateCar.ancillaryCoverages', preSelectedTerms);
                                const setValuePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3];
                                const chosenTermPath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].code;
                                const chosenTermValuePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].name;
                                _.set(setValuePath, 'chosenTerm', chosenTermPath);
                                _.set(setValuePath, 'chosenTermValue', chosenTermValuePath);
                                _.set(setValuePath, 'updated', true);
                            }
                        });
                    });
                }
            });
        });
    };
    const checkHPSelectedValue = () => {
        if (customizeSubmissionVM && _.get(customizeSubmissionVM, `${branchCodePath}.value`) === messages.HP && brand === messages.roadside && oneTimeHPSelectedValue === true) {
            updateBreakdownAPICall(messages.trueString, false);
            setOneTimeHPSelectedValue(false);
            dispatch(setNavigation({ breakDownCoverChosen: true }));
            props.navigate(true);
        } else {
            updateBreakdownAPICall(messages.trueString, true);
            setGoToNextRoute(true);
        }
    };

    // table value change
    const trackBrand = (event) => {
        dispatch(updateAncillaryJourney(BREAKDOWN_PRESELECT));
        setPreselectedValue(false);
        setPreSelectedValFromPCW(false);
        setCanContinue(false);
        setBrand(event.target.value);
        setBreakdownTerm(event.target.value);
        setOneTimeHPSelectedValue(false);
        if (event.target.value === messages.roadside) {
            _.set(customizeSubmissionVM.value, 'racEssentials.isBreakdownEssential', true);
            _.set(customizeSubmissionVM.value, 'racEssentials.isEuropeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isHomeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecoveryHomeEuropean) {
            _.set(customizeSubmissionVM.value, 'racEssentials.isBreakdownEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isEuropeEssential', true);
            _.set(customizeSubmissionVM.value, 'racEssentials.isHomeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecoveryHome) {
            _.set(customizeSubmissionVM.value, 'racEssentials.isBreakdownEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isEuropeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isHomeEssential', true);
            _.set(customizeSubmissionVM.value, 'racEssentials.isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecovery) {
            _.set(customizeSubmissionVM.value, 'racEssentials.isBreakdownEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isEuropeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isHomeEssential', false);
            _.set(customizeSubmissionVM.value, 'racEssentials.isTransportEssential', true);
        }
    };

    // Continue with RAC cover
    const continueAction = () => {
        setCoverNeeded(true);
        const modal = helper.getModalContent(brand);
        setModalContent(modal);
        setSelected(true);
    };
    const confirmModal = () => {
        setSelected(false);
        setCanContinue(true);
        // props.navigate(true);
        checkHPSelectedValue();
    };
    const closeModal = () => {
        setSelected(false);
    };

    // Continue with no RAC cover - preselected
    const noCoverNeededPreselected = () => {
        dispatch(setNavigation({ breakDownCoverChosen: true }));
        props.navigate(true);
    };

    // Continue with no RAC cover
    const noCoverNeeded = () => {
        const isFalsy = (breakDownCover === messages.falseString || breakDownCover === messages.smallNo);
        if (isFalsy) {
            noConfirmModal();
        } else {
            setCoverNeeded(false);
            const modal = helper.getModalContent('');
            setModalContent(modal);
        }
    };
    const noConfirmModal = () => {
        setCoverNeeded(true);
        // props.navigate(true);
        setBreakdownCover(messages.falseString);
        setSelectedHeaderIndex(-1);
        setBrand(null);
        updateBreakdownAPICall(messages.falseString, true);
        setGoToNextRoute(true);
    };
    const noCloseModal = () => {
        setCoverNeeded(true);
    };

    const getPcwText = () => {
        const { producerCode } = customizeSubmissionVM;
        let producerIconKey = '';
        if (producerCode.value !== 'Default' && producerCode.value !== 'ClearScore') {
            producerIconKey = getPCWName(producerCode.value);
        }
        return (producerIconKey);
    };

    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props, screenFrom]);

    useEffect(() => {
        if (includeExpensesCover != null) {
            setIncludeExpensesCover(null);
        }
    }, [brand, canContinue, props, showCover, screenFrom, includeExpensesCover]);

    const callIPIDDocumnetAPI = (data, pageID) => {
        const docParam = iPidAncillaryAPIObject(data, customizeSubmissionVM);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, pageID), '_blank');
        } else {
            dispatch(getIpidDocumnet(docParam, pageID));
        }
    };

    // download the ipid document
    const handleDownloadFile = (pageid) => {
        const ipiddata = _.get(ancillaryJourneyDataModel, 'ipidsInfo', []);
        if (ipiddata.length) {
            ipiddata.forEach((data) => {
                const isAncillaryCode = data.ancillaryCode || '';
                if (isAncillaryCode === messages.ipidRoadside && pageid === messages.ipidRoadside) {
                    callIPIDDocumnetAPI(data, isAncillaryCode);
                }
                if (isAncillaryCode === messages.ipidRoadsideAndRecovery && pageid === messages.ipidRoadsideAndRecovery) {
                    callIPIDDocumnetAPI(data, isAncillaryCode);
                }
                if (isAncillaryCode === messages.ipidHomestart && pageid === messages.ipidHomestart) {
                    callIPIDDocumnetAPI(data, isAncillaryCode);
                }
                if (isAncillaryCode === messages.ipidEuropean && pageid === messages.ipidEuropean) {
                    callIPIDDocumnetAPI(data, isAncillaryCode);
                }
            });
        } else {
            // TODO : Error handeling if documnet is not available
        }
    };

    const regularColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };

    const tableColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 10, offset: 1 },
        lg: { span: 8, offset: 2 }
    };

    const setBreakdownVal = (breakDownCover === messages.yes) || (breakDownCover === 'true');
    const isFalsy = (breakDownCover === messages.falseString || breakDownCover === messages.smallNo);
    return (
        <Container>
            <Row className="break-down-cover-container theme-white padding-top-xl padding-bottom-xl">
                <Col>
                    <Row>
                        <Col {...regularColProps}>
                            <div className="container--anc text-md-center">
                                <img
                                    className="break-down-cover__header-image mb-4"
                                    src={RACImage}
                                    alt="RAC" />
                                {screenFrom !== messages.premierRoute
                                    ? (
                                        <Row>
                                            <Col>
                                                <HDToggleButtonGroupRefactor
                                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover}` }}
                                                    id="breakdown-cover-button-group"
                                                    name="breakdowncover"
                                                    availableValues={availableValues}
                                                    label={{
                                                        Tag: 'h2',
                                                        text: messages.breakDownCoverQuestion,
                                                        className: 'margin-bottom-md',
                                                        id: 'break-down-cover-do-you-need-label'
                                                    }}
                                                    value={breakDownCover}
                                                    className="break-down-cover__toggle-btn-group mb-3"
                                                    onChange={trackBreakDownCover}
                                                    btnGroupClassName="grid grid--col-2 gap-md col-lg-8 offset-lg-2 px-0"
                                                    btnClassName="theme-white" />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <HDLabelRefactor
                                            Tag="h2"
                                            text={(
                                                <>
                                                    {messages.racBreakdown}
                                                    <br />
                                                    {messages.alreadyIncluded}
                                                </>
                                            )}
                                            id="break-down-cover-rac-label" />
                                    )}
                                {screenFrom === messages.pcwRoute && setBreakdownVal && isPcwBreakdownChosen && preSelectedValFromPCW && (
                                    <HDQuoteInfoRefactor className="mt-4">
                                        <span>{messages.preSelectText}</span>
                                        <span className="font-bold">
                                            {getPcwText()}
                                        </span>
                                    </HDQuoteInfoRefactor>
                                )}
                                {screenFrom === messages.premierRoute && (
                                    <HDQuoteInfoRefactor className="mt-4">
                                        <span>{messages.affirmationTextPremier}</span>
                                    </HDQuoteInfoRefactor>
                                )}
                                <HDCustomizeQuoteBreakDownCoverOverlay
                                    trigger={(
                                        <HDLabelRefactor
                                            Tag="a"
                                            text={screenFrom === messages.directRoute ? messages.whatIsIncluded : messages.whatIsIncludedPremier}
                                            className="mb-3" />
                                    )} />
                            </div>
                        </Col>
                    </Row>
                    {setBreakdownVal && (
                        <Row>
                            <Col className="text-md-center" {...regularColProps}>
                                <HDLabelRefactor
                                    Tag="h5"
                                    text={messages.coverOptions}
                                    id="break-down-cover-options-label"
                                    className="margin-bottom-lg mt-3" />
                            </Col>
                        </Row>
                    )}
                    {setBreakdownVal && (
                        <Row>
                            <Col className="px-mobile-0" {...tableColProps}>
                                <HDTable
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.coverOptions}` }}
                                    id="rac-brakedown-table"
                                    className="break-down-cover__table elevated-box"
                                    name="brandCode"
                                    selectedHeaderValue={brand}
                                    onSelect={trackBrand}
                                    headerValues={helper.getHeaderValues(screenFrom, customizeSubmissionVM)}
                                    data={helper.coverageValues}
                                    defaultIndex={selectedHeaderIndex}
                                    moreDetailsLabel={messages.documentReadLabel}
                                    moreDetailsPopups={[
                                        <HDLabelRefactor
                                            Tag="a"
                                            icon={<img src={iconDownload} alt="download icon" />}
                                            iconPosition="l"
                                            text={messages.read}
                                            onClick={() => handleDownloadFile(messages.ipidRoadside)}
                                            id="break-down-cover-roadside-link" />,
                                        <HDLabelRefactor
                                            Tag="a"
                                            icon={<img src={iconDownload} alt="download icon" />}
                                            iconPosition="l"
                                            text={messages.read}
                                            onClick={() => handleDownloadFile(messages.ipidRoadsideAndRecovery)}
                                            id="break-down-cover-roadside-recovery-link" />,
                                        <HDLabelRefactor
                                            Tag="a"
                                            icon={<img src={iconDownload} alt="download icon" />}
                                            iconPosition="l"
                                            text={messages.read}
                                            onClick={() => handleDownloadFile(messages.ipidHomestart)}
                                            id="break-down-cover-home-link" />,
                                        <HDLabelRefactor
                                            Tag="a"
                                            icon={<img src={iconDownload} alt="download icon" />}
                                            iconPosition="l"
                                            text={messages.read}
                                            onClick={() => handleDownloadFile(messages.ipidEuropean)}
                                            id="break-down-cover-european-link" />,
                                    ]} />
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col {...regularColProps} className="text-center">
                            <HDModal
                                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.ancillaries} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                                id="confirm-cover-modal"
                                className="confirm-cover-modal__btn-margin-top"
                                customStyle="rev-button-order"
                                show={isSelected}
                                headerText={modalContent && modalContent.modalHeader}
                                confirmLabel={coverNeeded ? messages.coverageContinue : messages.noCoverageContinueText}
                                cancelLabel={messages.coverageGoBack}
                                onCancel={closeModal}
                                onConfirm={confirmModal}
                                hideClose
                            >
                                <>
                                    <HDLabelRefactor
                                        Tag="h5"
                                        text={messages.youveToldUs}
                                        id="break-down-cover-you-told-us-label"
                                        className="my-3" />
                                    {modalContent && modalContent.listItems && modalContent.listItems.length && (
                                        <ul className="pad-inl-start-sm">
                                            {modalContent.listItems.map((item) => (
                                                <li>{item.item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <HDLabelRefactor
                                        Tag="h5"
                                        text={messages.isThatRight}
                                        id="break-down-cover-is-that-right-label"
                                        className="mt-3" />
                                </>
                            </HDModal>
                            <HDModal
                                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.ancillaries} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                                id="confirm-cover-modal"
                                customStyle="rev-button-order"
                                show={!coverNeeded}
                                headerText={modalContent && modalContent.modalHeader}
                                confirmLabel={messages.noCoverageContinueText}
                                cancelLabel={messages.coverageGoBack}
                                onCancel={noCloseModal}
                                onConfirm={noConfirmModal}
                                hideClose
                            >
                                {modalContent && modalContent.listItems && modalContent.listItems.length
                                    && modalContent.listItems.map((item) => (
                                        <div>{item.item}</div>
                                    ))}
                            </HDModal>
                            {setBreakdownVal && (
                                <HDButtonRefactor
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover}` }}
                                    id="breakdown-cover-button-group"
                                    className="hd-button-narrow theme-white mx-auto margin-top-lg margin-bottom-lg btn-continue-lg-lg break-down-cover__continue-button"
                                    label={!brand ? messages.continueButtonDisabledText : messages.continueButtonText}
                                    disabled={!brand || breakDownCover === 'false'}
                                    onClick={continueAction} />
                            )}
                            {setBreakdownVal && screenFrom !== messages.premierRoute && (
                                <HDLabelRefactor
                                    Tag="a"
                                    text={messages.noCoverText}
                                    onClick={noCoverNeeded}
                                    className="break-down-cover__no-cov-needed-link-btn"
                                    id="break-down-cover-no-cov-needed-link" />
                            )}
                            {screenFrom !== messages.premierRoute && !setBreakdownVal && canShowContinue && (
                                <HDButtonRefactor
                                    id="break-down-cover-no-cov-needed-link"
                                    className="hd-button-narrow theme-white mx-auto margin-top-lg margin-bottom-lg btn-continue-lg-lg break-down-cover__continue-button"
                                    label={messages.noCoverText}
                                    disabled={breakDownCover === null}
                                    onClick={() => noCoverNeededPreselected()} />
                            )}
                        </Col>
                    </Row>
                    {_.get(updateQuoteCoveragesData, 'quoteCoveragesError.error.message') && <HDAlertRefactor message={messages.customErrorMessage} />}
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
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        updateQuoteCoveragesData: state.updateQuoteCoveragesModel,
        ancillaryJourneyDataModel: state.ancillaryJourneyModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation: setNavigationAction
});

HDCustomizeQuoteBreakDownCoverPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({ search: PropTypes.string, state: PropTypes.shape({ PCWJourney: PropTypes.bool }) }).isRequired,
    customizeSubmissionVM: PropTypes.shape(
        {
            value: PropTypes.object,
            producerCode: PropTypes.string,
        }
    ).isRequired,
    updateQuoteCoveragesData: PropTypes.shape({
        quoteCoveragesObj: PropTypes.shape({
            quote: PropTypes.shape({}),
            quoteID: PropTypes.string,
            sessionUUID: PropTypes.string,
            periodStartDate: PropTypes.string,
            periodEndDate: PropTypes.string,
            coverType: PropTypes.string,
            voluntaryExcess: PropTypes.string,
            ncdgrantedYears: PropTypes.string,
            ncdgrantedProtectionInd: PropTypes.bool,
            producerCode: PropTypes.string,
            insurancePaymentType: PropTypes.string,
            otherQuotes: PropTypes.shape({}),
            coverages: PropTypes.shape({}),
            coverables: PropTypes.shape({ vehicles: PropTypes.array })
        }),
        quoteCoveragesError: PropTypes.shape({})
    }),
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({ breakdown: PropTypes.bool }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HDCustomizeQuoteBreakDownCoverPage.defaultProps = {
    toggleContinueElement: () => { },
    navigate: () => { },
    updateQuoteCoveragesData: null,
    ancillaryJourneyDataModel: null
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDCustomizeQuoteBreakDownCoverPage));
