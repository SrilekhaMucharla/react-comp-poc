/* eslint-disable no-use-before-define */
/* eslint-disable indent */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    HDQuoteInfoRefactor,
    HDQuoteDownloadRefactor,
    HDLabelRefactor,
    HDRibbon
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDLabel as HDLabel,
    AnalyticsHDModal as HDModal,
    AnalyticsHDTable as HDTable,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import {
    updateMultiCustomQuoteCoverages, updateMcAncillaryJourney, getMCIpidDocument
} from '../../../redux-thunk/actions';
import * as helper from '../../../common/mcAncillaryHelpers';
import HDCustomizeQuoteBreakDownCoverOverlay from '../HDCustomizeQuoteBreakDownCoverPage/HDCustomizeQuoteBreakDownCoverOverlay';
import * as messages from './HDMCRACBreakDownPage.messages';
import RACImage from '../../../assets/images/wizard-images/RAC.png';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import formatRegNumber from '../../../common/formatRegNumber';
import { getPCWName } from '../HDMotorLegal/HastingsPCWHelper';
import { producerCodeList } from '../../../common/producerCodeHelper';
import {
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';


const HDMCRACBreakDownPage = (props) => {
    const {
        multiCustomizeSubmissionVM,
        mcsubmissionVM,
        parentContinue,
        racToast,
        customMultiQuoteData,
        ancillaryJourneyDataModel,
        dispatch,
        pageMetadata,
        overallPrice,
        setTotalPrice,
        invalidateImportantStuffPage,
        gobackEnabled,
        resetgobackEnabled,
        subrouteFinished,
        mcPaymentScheduleModel,
        indexArray,
        racIndexArrayFn,
        actionType
    } = props;
    const [screenFrom, setScreenFrom] = useState([]);
    const branchCodePath = 'quote.branchCode';
    const [brand, setBrand] = useState([]);
    const [modalContent, setModalContent] = useState({});
    const [repeatremoveOverlay, setrepeatremoveOverlay] = useState(false);
    const [coverNeeded, setCoverNeeded] = useState(true);
    const [breakDownCover, setBreakdownCover] = useState([]);
    const [showCover, setCover] = useState([]);
    const [elemRefs, setElemRefs] = useState([]);
    const [nextIndex, setnextIndex] = useState(0);
    const [isSelected, setSelected] = useState(false);
    const [fromRAC, setfromRAC] = useState(false);
    const [selectedHeaderIndex, setSelectedHeaderIndex] = useState([]);
    const [completedRAC, setcompletedRAC] = useState([]);
    const [continuebuttonTexts, setcontinuebuttonTexts] = useState([]);
    const [booleanClicked, setbooleanClicked] = useState('');
    const [trackbreakDown, settrackbreakDown] = useState(null);
    const [planbreakDown, setplanbreakDown] = useState(null);
    const [currentIndex, setcurrentIndex] = useState(null);
    const [planChanged, setplanChanged] = useState(false);
    const [PCWpreselection, setPCWpreselection] = useState(false);
    const [ancillaryModalObject, setancillaryModalObject] = useState([]);
    const [loading, setLoading] = useState(false);
    const producercodePath = 'producerCode';
    useEffect(() => {
        const tmpElRefs = mcsubmissionVM.value.quotes.map(() => createRef());
        setElemRefs((tmpElRefs));
    }, [indexArray]);

    useEffect(() => {
        if (customMultiQuoteData && customMultiQuoteData.loading) {
            setLoading(true);
        } else {
            setLoading(false);
            if (fromRAC && customMultiQuoteData && !customMultiQuoteData.loading && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses.length > 0) {
                // for updating mcPaymentSchedhuleModel
                if (customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP) {
                    _.set(mcPaymentScheduleModel,
                        'mcPaymentScheduleObject', customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP);
                } else {
                    _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
                }
                const tempArrRAC = [];
                const customDataTemp = customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses;
                mcsubmissionVM.value.quotes.forEach((element1) => {
                    customDataTemp.forEach((element2) => {
                        if (element1.quoteID === element2.quoteID) {
                            tempArrRAC.push(element2);
                        }
                    });
                });
                _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempArrRAC);
                let price = 0;
                let premiumAmount = 0;
                multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
                    if (multiCustomizeSubmissionVM.value.insurancePaymentType === '3') {
                        premiumAmount = _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
                    } else {
                        premiumAmount = _.get(customQuote, 'quote.hastingsPremium.annuallyPayment.changeInPremium.amount', 0);
                    }
                    price += premiumAmount;
                });
                if (price > 0) {
                    const overallPriceTemp = { ...overallPrice };
                    overallPriceTemp.price = price.toFixed(2);
                    setTotalPrice(overallPriceTemp);
                }
                dispatch(updateMcAncillaryJourney(ancillaryModalObject, 'BREAKDOWN'));
                setfromRAC(false);
                if ((booleanClicked === messages.falseString && trackbreakDown) || !booleanClicked) {
                    setbooleanClicked('');
                    settrackbreakDown(null);
                    // eslint-disable-next-line no-use-before-define
                    forwardtonextRAC(currentIndex);
                } else if (booleanClicked === messages.trueString && trackbreakDown) {
                    const selectedHeaderIndexCpy = [...selectedHeaderIndex];
                    const brandCpy = [...brand];
                    // eslint-disable-next-line no-use-before-define
                    setbooleanClicked('');
                    setPreAndSelectedHeaderIndex(currentIndex, selectedHeaderIndexCpy, brandCpy);
                }
                if (planbreakDown && planChanged) {
                    setbooleanClicked('');
                    setplanbreakDown(null);
                    // eslint-disable-next-line no-use-before-define
                    forwardtonextRAC(currentIndex);
                }
            }
        }
    }, [customMultiQuoteData]);
    // update quote api call
    const updateBreakdownAPICall = (eventValue, index) => {
        const ancillaryModalObjectTemp = [...ancillaryJourneyDataModel.breakdown];
        // eslint-disable-next-line no-unused-expressions
        multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
            if (!ancillaryModalObjectTemp.some((o) => o.quoteID === multiCustomizeSubmissionVM.value.customQuotes[index].quoteID)) {
                ancillaryModalObjectTemp.push({
                    quoteID: multiCustomizeSubmissionVM.value.customQuotes[index].quoteID,
                    breakdown: true,
                    button: eventValue
                });
            }

            setancillaryModalObject(ancillaryModalObjectTemp);
            data.coverages.map((nestedData, index2) => {
                if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                    _.set(covaragePath, 'selected', eventValue === messages.trueString);
                    _.set(covaragePath, 'updated', eventValue === messages.trueString);
                    setfromRAC(true);
                    // call api in case of breakdown value is Yes / preselected No and selecting Yes
                }
                return null;
            });
            return null;
        });
        const params = {
            sessionUUID: mcsubmissionVM.value.sessionUUID,
            mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
            mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
            customQuotes: multiCustomizeSubmissionVM.value.customQuotes
        };
        dispatch(updateMultiCustomQuoteCoverages(params));
    };
    const setBreakDown = (index, coverStr, breakdowncoverCpy, showcoverCpy) => {
        if (multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index]) {
            multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                        if (messages.premierRoute === coverStr || messages.pcwRoute === coverStr) {
                            if (nestedData.selected) {
                                setPCWpreselection(true);
                            } else {
                                setPCWpreselection(false);
                            }
                            // set preselected value in case of PCW and HP
                            breakdowncoverCpy[index] = messages.premierRoute === coverStr ? messages.trueString
                                : (nestedData.selected ? messages.trueString : messages.falseString);
                            // eslint-disable-next-line no-nested-ternary
                            showcoverCpy[index] = messages.premierRoute === coverStr ? messages.trueString
                                : (nestedData.selected ? messages.trueString : messages.falseString);
                            // set value to restrict the api first call for HP
                        } else if ((messages.directRoute === coverStr || messages.HE === coverStr) && nestedData.selected) {
                            // set breakdown value true in case of direct route and user selected and navigated back
                            breakdowncoverCpy[index] = messages.trueString;
                            showcoverCpy[index] = messages.trueString;
                            // setCover(showcoverCpy);
                        } else if ((messages.directRoute === coverStr || messages.HE === coverStr) && !nestedData.selected && !ancillaryJourneyDataModel.breakdown.length) {
                            breakdowncoverCpy[index] = null;
                            showcoverCpy[index] = messages.falseString;
                        } else if ((messages.directRoute === coverStr || messages.HE === coverStr) && !nestedData.selected && ancillaryJourneyDataModel.breakdown.length) {
                            breakdowncoverCpy[index] = messages.falseString;
                            showcoverCpy[index] = messages.falseString;
                        }
                    }
                    return null;
                });
                return null;
            });
            setCover(showcoverCpy);
            setBreakdownCover(breakdowncoverCpy);
        }
    };

    const setPreAndSelectedHeaderIndex = (index, selectedHeaderIndexCpy, brandCpy, selectedBrand) => {
        if (selectedBrand === messages.premierRoute) {
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index] && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                        const isTermAvailable = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${index}].coverages.privateCar.ancillaryCoverages[${index1}].coverages[${index2}].terms`);
                        if (isTermAvailable.length) {
                            isTermAvailable.map((termObject) => {
                                const selectedTermindexes = termObject.options.reduce((r, item, i) => (item.code.includes(termObject.chosenTerm) ? (r.push(i), r) : r), []);
                                selectedHeaderIndexCpy[index] = selectedTermindexes[0];
                                brandCpy[index] = helper.defaultPrimaryHeaderName[selectedTermindexes[0]];
                            });
                        }
                    }
                    return null;
                });
                return null;
            });
        } else if (multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index] && multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials) {
                if (multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials.isBreakdownEssential) {
                    brandCpy[index] = messages.roadside;
                    selectedHeaderIndexCpy[index] = 0;
                } else if (multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials.isEuropeEssential) {
                    brandCpy[index] = messages.roadsideRecoveryHomeEuropean;
                    selectedHeaderIndexCpy[index] = 3;
                } else if (multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials.isHomeEssential) {
                    brandCpy[index] = messages.roadsideRecoveryHome;
                    selectedHeaderIndexCpy[index] = 2;
                } else if (multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials.isTransportEssential) {
                    brandCpy[index] = messages.roadsideRecovery;
                    selectedHeaderIndexCpy[index] = 1;
                }
            }
        setSelectedHeaderIndex(selectedHeaderIndexCpy);
        setBrand(brandCpy);
    };

    useEffect(() => {
        const mcQuotes = _.get(multiCustomizeSubmissionVM, 'value.customQuotes', null);
        const tempArrRAC = [];
        mcsubmissionVM.value.quotes.forEach((element1) => {
            mcQuotes.forEach((element2) => {
                if (element1.quoteID === element2.quoteID) {
                    tempArrRAC.push(element2);
                }
            });
        });
        _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempArrRAC);
        const screenFromCpy = [...screenFrom];
        const breakdowncoverCpy = [...breakDownCover];
        const showcoverCpy = [...showCover];
        const selectedHeaderIndexCpy = [...selectedHeaderIndex];
        const brandCpy = [...brand];
        const completedRACCpy = [...completedRAC];
        const continuebuttonTextsCpy = [...continuebuttonTexts];
        mcQuotes.forEach((mcQuote, index) => {
            if (_.get(mcQuote, `${branchCodePath}`) === messages.HP) {
                screenFromCpy[index] = messages.premierRoute;
                setBreakDown(index, messages.premierRoute, breakdowncoverCpy, showcoverCpy);
            } else if (_.get(mcQuote, producercodePath) !== messages.defaultCode
            && _.get(mcQuote, producercodePath) !== messages.ClearScore
            && (actionType !== messages.directText && !_.includes(producerCodeList, _.get(mcQuote, producercodePath)))) {
                screenFromCpy[index] = messages.pcwRoute;
                setBreakDown(index, messages.pcwRoute, breakdowncoverCpy, showcoverCpy);
            } else if (_.get(mcQuote, `${branchCodePath}`) === messages.HE) {
                screenFromCpy[index] = messages.HE;
                setBreakDown(index, messages.HE, breakdowncoverCpy, showcoverCpy);
            } else {
                screenFromCpy[index] = messages.HD;
                setBreakDown(index, messages.HD, breakdowncoverCpy, showcoverCpy);
            }
            setPreAndSelectedHeaderIndex(index, selectedHeaderIndexCpy, brandCpy, screenFromCpy[index]);
            completedRACCpy[index] = false;
            setcompletedRAC(completedRACCpy);
            continuebuttonTextsCpy[index] = messages.confirmRACselection;
            setcontinuebuttonTexts(continuebuttonTextsCpy);
        });
        const indexArrayTemp = [...indexArray];
        if (!indexArrayTemp.length && !subrouteFinished) {
            indexArrayTemp.push({ indx: 0, quoteID: mcQuotes[0].quoteID });
            const dataa = _.uniqBy(indexArrayTemp, 'quoteID');
            racIndexArrayFn(dataa);
        }
        setScreenFrom(screenFromCpy);
    }, [multiCustomizeSubmissionVM, mcsubmissionVM]);

    useEffect(() => {
        if (elemRefs[nextIndex] && elemRefs[nextIndex].current && !gobackEnabled) {
            elemRefs[nextIndex].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, [elemRefs]);

    const trackBreakDownCover = (event, index, apiflag) => {
        const showCoverCpy = [...showCover];
        showCoverCpy[index] = event;
        setTimeout(() => {
            setCover(showCoverCpy);
        }, 100);
        setbooleanClicked(event);
        settrackbreakDown(true);
        if ((!ancillaryJourneyDataModel.breakdown[index]) && event === 'false') {
            const ancillaryModalObjectTemp = [...ancillaryJourneyDataModel.breakdown];
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                if (!ancillaryModalObjectTemp.some((o) => o.quoteID === multiCustomizeSubmissionVM.value.customQuotes[index].quoteID)) {
                    ancillaryModalObjectTemp.push({
                        quoteID: multiCustomizeSubmissionVM.value.customQuotes[index].quoteID,
                        breakdown: true,
                        button: event
                    });
                }
                setancillaryModalObject(ancillaryModalObjectTemp);
            });
            const breakdowncoverCpy = [...breakDownCover];
            breakdowncoverCpy[index] = event;
            setBreakdownCover(breakdowncoverCpy);
            dispatch(updateMcAncillaryJourney(ancillaryModalObjectTemp, 'BREAKDOWN'));
            forwardtonextRAC(index);
        } else if (!apiflag) {
            const breakdowncoverCpy = [...breakDownCover];
            breakdowncoverCpy[index] = event;
            setBreakdownCover(breakdowncoverCpy);
            updateBreakdownAPICall(event, index);
        }
    };

    const checkforOverlay = (event, index) => {
        invalidateImportantStuffPage();
        setfromRAC(true);
        setcurrentIndex(index);
        resetgobackEnabled();
        if (breakDownCover[index] === messages.trueString && event === messages.falseString) {
            const breakdowncoverCpy = [...breakDownCover];
            breakdowncoverCpy[index] = event;
            setBreakdownCover(breakdowncoverCpy);
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                        const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                        _.set(covaragePath, 'selected', false);
                    }
                    return null;
                });
                return null;
            });
            const modal = helper.getremoveOverlay();
            setModalContent(modal);
            setrepeatremoveOverlay(true);
        } else {
            trackBreakDownCover(event, index);
        }
    };

    const oncloseremoveOverlay = () => {
        setrepeatremoveOverlay(false);
        // eslint-disable-next-line no-unused-expressions
        multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[currentIndex].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
            data.coverages.map((nestedData, index2) => {
                if (nestedData.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[currentIndex].coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                    _.set(covaragePath, 'selected', true);
                }
                return null;
            });
            return null;
        });
        const breakdowncoverCpy = [...breakDownCover];
        breakdowncoverCpy[currentIndex] = messages.trueString;
        setBreakdownCover(breakdowncoverCpy);
    };
    const onconfirmremoveOverlay = () => {
        setrepeatremoveOverlay(false);
        const pCode = _.get(multiCustomizeSubmissionVM.value.customQuotes[currentIndex], 'producerCode');
        if ((pCode !== messages.defaultCode || pCode !== messages.ClearScore)
        && (actionType !== messages.directText && !_.includes(producerCodeList, pCode))) {
            setPCWpreselection(false);
        }
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isBreakdownEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isEuropeEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isHomeEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isTransportEssential', false);
        const brandCpy = [...brand];
        brandCpy[currentIndex] = null;
        setBrand(brandCpy);
        const selectedHeaderIndexCpy = [...selectedHeaderIndex];
        selectedHeaderIndexCpy[currentIndex] = null;
        setSelectedHeaderIndex(selectedHeaderIndexCpy);
        trackBreakDownCover(messages.falseString, currentIndex);
    };

    // download the ipid document
    const handleDownloadFile = (pageid) => {
        const data = {
            pageid: pageid,
            ancillaryJourneyDataModel: ancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
        };
        const docParam = helper.getRACIPIDDownloadParams(data);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, pageid), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, pageid));
        }
    };

    const setBreakdownTerm = (index, selectedVal) => {
        const ancDataPath = 'coverages.privateCar.ancillaryCoverages';
        const ancData = _.get(multiCustomizeSubmissionVM.value.customQuotes[index], `${ancDataPath}`);
        const selectedIndexNumber = helper.defaultPrimaryHeaderName.indexOf(selectedVal);
        const selectedHeaderIndexCpy = [...selectedHeaderIndex];
        selectedHeaderIndexCpy[index] = selectedIndexNumber;
        setSelectedHeaderIndex(selectedHeaderIndexCpy);
        ancData.map((coveragesObj, index1) => {
            coveragesObj.coverages.map((coveragesChildObj, index2) => {
                if (coveragesChildObj.publicID === messages.ANCBREAKDOWNCOV_EXT) {
                    coveragesChildObj.terms.map((termsObj, index3) => {
                        termsObj.options.map((optionsObj, index4) => {
                            if (selectedIndexNumber === index4) {
                                const setValuePath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3];
                                const chosenTermPath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].code;
                                const chosenTermValuePath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[index3].options[index4].name;
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
    // RAC Plan selected on radio button
    const trackBrand = (event, index) => {
        const continuebuttonTextsCpy = [...continuebuttonTexts];
        continuebuttonTextsCpy[index] = messages.confirmRACselection;
        setcontinuebuttonTexts(continuebuttonTextsCpy);
        setplanChanged(true);
        if (event.target.value === messages.roadside) {
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isBreakdownEssential', true);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isEuropeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isHomeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecoveryHomeEuropean) {
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isBreakdownEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isEuropeEssential', true);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isHomeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecoveryHome) {
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isBreakdownEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isEuropeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isHomeEssential', true);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isTransportEssential', false);
        } else if (event.target.value === messages.roadsideRecovery) {
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isBreakdownEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isEuropeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isHomeEssential', false);
            _.set(multiCustomizeSubmissionVM.value.customQuotes[index].racEssentials, 'isTransportEssential', true);
        }
        const brandCpy = [...brand];
        brandCpy[index] = event.target.value;
        setBrand(brandCpy);
        setBreakdownTerm(index, event.target.value);
    };
    // Advance to next RAC section
    const forwardtonextRAC = (index, noCover) => {
        const toastMsgObj = {
            msg: '',
            icon: '',
            regNum: '',
            msgSecondPart: '',
            at: '',
            coverAmount: ''
        };
        let breakDownCoverage;
        const subVm = mcsubmissionVM.value.quotes.find((submissionVM) => submissionVM.quoteID === multiCustomizeSubmissionVM.value.customQuotes[index].quoteID);
        const branchCode = _.get(subVm, 'baseData.brandCode', null);
        let regNum = _.get(subVm, 'lobData.privateCar.coverables.vehicles[0].license', null);
        let roadsideAmount = [];
        if (multiCustomizeSubmissionVM.value.customQuotes[index]) {
            breakDownCoverage = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[0].coverages.filter((ancCoverData) => ancCoverData.name === 'Breakdown');
            if (_.get(breakDownCoverage[0], 'terms')) {
                breakDownCoverage[0].terms.map((termsObj) => {
                    roadsideAmount = termsObj.options && termsObj.options.filter((option) => option.name === messages.ipidRoadside);
                 });
            }
        }
        const chosenTermVal = _.get(breakDownCoverage[0], 'terms[0].chosenTermValue', null);
        const roadsideAmountVal = _.get(roadsideAmount[0], 'amount.amount', 0);
        regNum = formatRegNumber(regNum);
        if (breakDownCover[index] === messages.trueString) {
            toastMsgObj.msg = messages.coverselectedToast;
            toastMsgObj.coverAmount = breakDownCoverage[0].amount.amount;
            if (branchCode === messages.premierRoute && breakDownCoverage.length && chosenTermVal === messages.ipidRoadside) {
                toastMsgObj.msg = messages.ToastAlreadyAdded;
            } else if (branchCode === messages.premierRoute && breakDownCoverage.length && chosenTermVal !== messages.ipidRoadside) {
                toastMsgObj.coverAmount = breakDownCoverage[0].amount.amount - roadsideAmountVal > 0 ? (breakDownCoverage[0].amount.amount - roadsideAmountVal) : breakDownCoverage[0].amount.amount;
                toastMsgObj.coverAmount = toastMsgObj.coverAmount.toFixed(2);
            }
            toastMsgObj.regNum = regNum;
            toastMsgObj.icon = messages.tick;
            toastMsgObj.at = messages.atText;
            toastMsgObj.branchCode = branchCode;
            toastMsgObj.chosenTermVal = chosenTermVal;
        } else {
            toastMsgObj.msg = messages.coverunselectedToastPartOne;
            toastMsgObj.regNum = regNum;
            toastMsgObj.msgSecondPart = messages.coverunselectedToastPartTwo;
            toastMsgObj.icon = messages.cross;
            toastMsgObj.branchCode = branchCode;
            toastMsgObj.chosenTermVal = chosenTermVal;
        }
        toastMsgObj.webAnalyticsEvent = {
            event_action: `${messages.ancillaries} - ${messages.breakdownCover}`,
            event_value: `${breakDownCover[index] === messages.trueString ? messages.add : messages.remove} ${messages.breakdownCover}`
        };
        toastMsgObj.webAnalyticsView = {
            ...pageMetadata,
            page_section: `${messages.ancillaries} - ${breakDownCover[index] === messages.trueString ? messages.add : messages.remove} ${messages.breakdownCover}`
        };
        racToast(toastMsgObj);
        const indexArrayTemp = [...indexArray];
        const nextIndexTemp = index + 1;
        const completedRACCpy = [...completedRAC];
        completedRACCpy[index] = true;
        const continuebuttonTextsCpy = [...continuebuttonTexts];
        continuebuttonTextsCpy[index] = messages.confirmRACselection;
        setcontinuebuttonTexts(continuebuttonTextsCpy);
        setcompletedRAC(completedRACCpy);
        setnextIndex(nextIndexTemp);

        if (((nextIndexTemp) < mcsubmissionVM.value.quotes.length && indexArrayTemp.indexOf((nextIndexTemp)) === -1)) {
            const customDataTemp = multiCustomizeSubmissionVM.value.customQuotes;
            mcsubmissionVM.value.quotes.forEach((element1) => {
                customDataTemp.forEach((element2) => {
                    if (element1.quoteID === element2.quoteID) {
                        indexArrayTemp.push({ indx: nextIndexTemp, quoteID: mcsubmissionVM.value.quotes[nextIndexTemp].quoteID });
                    }
                });
            });
        } else if ((nextIndexTemp) >= mcsubmissionVM.value.quotes.length) {
            parentContinue(null, null, 2);
        }
        const indexArrayUniq = _.uniqBy(indexArrayTemp, 'quoteID');
        racIndexArrayFn(indexArrayUniq);
        if (noCover) {
            const showCoverCpy = [...showCover];
            showCoverCpy[currentIndex] = messages.falseString;
            setTimeout(() => {
                setCover(showCoverCpy);
            }, 10);
        }
    };
    // opens Continue with chose RAC Modal
    const continueAction = (index) => {
        setcurrentIndex(index);
        setCoverNeeded(true);
        resetgobackEnabled();
        const modal = helper.getRACModalContent(brand[index]);
        setModalContent(modal);
        setSelected(true);
    };
    // opens Continue without any breakdown cover Modal
    const noCoverNeeded = (index) => {
        setcurrentIndex(index);
        // setrepeatremoveOverlay(true);
        setCoverNeeded(false);
        const modal = helper.getRACModalContent('');
        setModalContent(modal);
    };
    // Continue without any breakdown modal cancel clicked
    const noCloseModal = () => {
        setCoverNeeded(true);
    };
    // Continue without any breakdown cover modal confirm clicked
    const noConfirmModal = () => {
        setCoverNeeded(true);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isBreakdownEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isEuropeEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isHomeEssential', false);
        _.set(multiCustomizeSubmissionVM.value.customQuotes[currentIndex].racEssentials, 'isTransportEssential', false);
        const brandCpy = [...brand];
        brandCpy[currentIndex] = null;
        setBrand(brandCpy);
        const selectedHeaderIndexCpy = [...selectedHeaderIndex];
        selectedHeaderIndexCpy[currentIndex] = null;
        setSelectedHeaderIndex(selectedHeaderIndexCpy);
        trackBreakDownCover(messages.falseString, currentIndex);
    };
    // Continue with chose RAC Modal confirm clicked
    const confirmModal = () => {
        setSelected(false);
        setplanbreakDown(true);
        if (!planChanged) {
            forwardtonextRAC(currentIndex);
        } else {
            setplanChanged(false);
            updateBreakdownAPICall(messages.trueString, currentIndex);
        }
    };
    // Continue with chose RAC Modal cancel clicked
    const closeModal = () => {
        setSelected(false);
    };

    const getPCWProducerCode = (mcObj) => {
        const producerCode = _.get(mcObj, producercodePath);
        let producerIconKey = '';
        if (producerCode && producerCode !== messages.defaultCode && producerCode !== messages.ClearScore
            && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode))) {
            producerIconKey = getPCWName(producerCode);
            return producerIconKey;
        }
    };

    const getrefactorMessage = (screenFromVal, breakDownCoverVal, mcObj) => {
        if (screenFromVal === messages.premierRoute) {
            return true;
        } else if ((screenFromVal === messages.pcwRoute && PCWpreselection && breakDownCoverVal === messages.trueString)
            || (screenFromVal === messages.pcwRoute && PCWpreselection && helper.displayRACBreakDownToggle(mcObj, ancillaryJourneyDataModel) === messages.trueString)) {
                return true;
        } else {
            return false;
        }
    };

    const getindexVal = (ind) => {
        const val = breakDownCover[ind];
        const coverTemp = multiCustomizeSubmissionVM.value.customQuotes[ind].producerCode;
        if (!trackbreakDown && breakDownCover[ind] === 'false' && (coverTemp !== messages.defaultCode || coverTemp !== messages.ClearScore)) {
            return null;
        }
        return val;
    };

    return (
        <div className="padding-bottom-xl">
            {multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value && multiCustomizeSubmissionVM.value.customQuotes
                && multiCustomizeSubmissionVM.value.customQuotes.length && multiCustomizeSubmissionVM.value.customQuotes.map(((mcObj, ind) => {
                    return (
                        helper.checkRACDisplayEligibility(mcObj, ancillaryJourneyDataModel, indexArray, multiCustomizeSubmissionVM.value.customQuotes.length) ? (
                            <div className={`mc-rac-container-row row-${ind}`} key={ind} ref={elemRefs[ind]}>
                                <HDRibbon text={helper.getregNumber(ind, mcsubmissionVM, mcObj)} className="vehicle-ribbon vehicle-ribbon--cq" />
                                <Col className="mc-rac-container-col">
                                    <div className="container--anc text-md-center">
                                        <img
                                            className="break-down-cover__header-image mb-4"
                                            src={RACImage}
                                            alt="RAC" />
                                        <div className="licence-plate-container">
                                            <div className="licence-plate">{helper.getregNumber(ind, mcsubmissionVM, mcObj)}</div>
                                        </div>
                                        {screenFrom[ind] !== messages.premierRoute
                                            ? (
                                                <Row>
                                                    <Col>
                                                        <HDToggleButtonGroup
                                                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover}` }}
                                                            id="mc-breakdown-cover-button-group"
                                                            name={`breakdowncover-${ind}`}
                                                            availableValues={helper.availableValues}
                                                            label={{
                                                                Tag: 'h2',
                                                                text: helper.getbreakdownText(ind, mcsubmissionVM, multiCustomizeSubmissionVM, branchCodePath),
                                                                className: 'margin-bottom-md',
                                                                id: 'break-down-cover-do-you-need-label'
                                                            }}
                                                            value={helper.displayRACBreakDownToggle(mcObj, ancillaryJourneyDataModel)}
                                                            className="break-down-cover__toggle-btn-group"
                                                            onChange={(e) => { checkforOverlay(e.target.value, ind); }}
                                                            btnGroupClassName="grid grid--col-2 col-lg-8 offset-lg-2 px-0"
                                                            btnClassName="theme-white" />
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <HDLabelRefactor
                                                    Tag="h2"
                                                    text={(
                                                        <>
                                                            {helper.getbreakdownText(ind, mcsubmissionVM, multiCustomizeSubmissionVM, branchCodePath)}
                                                        </>
                                                    )}
                                                    id="break-down-cover-rac-label" />
                                            )}
                                        {(getrefactorMessage(screenFrom[ind], breakDownCover[ind], mcObj) && (
                                            <HDQuoteInfoRefactor className="mt-4">
                                                <span>
                                                    {screenFrom[ind] === messages.HP ? messages.affirmationTextPremier : messages.preSelectText}
                                                </span>
                                                {screenFrom[ind] === messages.pcwRoute && screenFrom[ind] !== messages.HP && (
                                                    <b>{getPCWProducerCode(mcObj)}</b>
                                                )}
                                            </HDQuoteInfoRefactor>
                                        ))}
                                        <HDCustomizeQuoteBreakDownCoverOverlay
                                            pageMetadata={pageMetadata}
                                            trigger={(
                                                <HDLabelRefactor
                                                    Tag="a"
                                                    text={screenFrom[ind] === messages.directRoute ? messages.whatIsIncluded : messages.whatIsIncludedPremier}
                                                    className="theme-white" />
                                            )}
                                            className="mt-4" />
                                    </div>
                                    {showCover[ind] === messages.trueString && (
                                        <React.Fragment>
                                            <Row className="my-4">
                                                <Col className="text-md-center" {...helper.regularColProps}>
                                                    <HDLabelRefactor
                                                        Tag="h5"
                                                        text={messages.coverOptions}
                                                        id="break-down-cover-options-label" />
                                                </Col>
                                            </Row>
                                            {(breakDownCover[ind] || breakDownCover[ind] === 'true') && (
                                                <Row>
                                                    <Col className="px-mobile-0 custom-rac-table" {...helper.tableColProps}>
                                                        <HDTable
                                                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.coverOptionsEventLabel}` }}
                                                            id="mc-rac-brakedown-table"
                                                            name="brandCode"
                                                            selectedHeaderValue={brand[ind]}
                                                            onSelect={(e) => { trackBrand(e, ind); }}
                                                            headerValues={helper.getRACHeaderValues(screenFrom[ind], multiCustomizeSubmissionVM.value.customQuotes[ind])}
                                                            data={helper.coverageRACValues}
                                                            defaultIndex={selectedHeaderIndex[ind]}
                                                            moreDetailsLabel={messages.documentReadLabel}
                                                            moreDetailsPopups={[
                                                                <HDQuoteDownloadRefactor
                                                                    showIcon
                                                                    linkText={messages.read}
                                                                    onClick={() => handleDownloadFile(messages.ipidRoadside)}
                                                                    className="justify-content-center"
                                                                    id="break-down-cover-roadside-link" />,
                                                                <HDQuoteDownloadRefactor
                                                                    showIcon
                                                                    linkText={messages.read}
                                                                    onClick={() => handleDownloadFile(messages.ipidRoadsideAndRecovery)}
                                                                    className="justify-content-center"
                                                                    id="break-down-cover-roadside-recovery-link" />,
                                                                <HDQuoteDownloadRefactor
                                                                    showIcon
                                                                    linkText={messages.read}
                                                                    onClick={() => handleDownloadFile(messages.ipidHomestart)}
                                                                    className="justify-content-center"
                                                                    id="break-down-cover-home-link" />,
                                                                <HDQuoteDownloadRefactor
                                                                    showIcon
                                                                    linkText={messages.read}
                                                                    onClick={() => handleDownloadFile(messages.ipidEuropean)}
                                                                    className="justify-content-center"
                                                                    id="break-down-cover-european-link" />,
                                                            ]} />
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row>
                                                <Col {...helper.regularColProps} className="text-center">
                                                    <HDButton
                                                        webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover}` }}
                                                        id="mc-breakdown-cover-button-group"
                                                        className="theme-white mx-auto margin-top-lg margin-bottom-lg"
                                                        label={continuebuttonTexts[ind]}
                                                        disabled={!brand[ind] || breakDownCover[ind] === 'false'}
                                                        onClick={() => { continueAction(ind); }} />
                                                    {screenFrom[ind] !== messages.premierRoute && (
                                                        <HDLabel
                                                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover}` }}
                                                            Tag="a"
                                                            text={messages.noCoverText}
                                                            onClick={() => { noCoverNeeded(ind); }}
                                                            className="break-down-cover__no-cov-needed-link-btn theme-white"
                                                            id="mc-break-down-cover-no-cov-needed-link" />
                                                    )}
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )}
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
                                </Col>
                            </div>
                        ) : ''
                    );
                }))}
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.breakdownCover} - ${messages.confirmRACselection}` }}
                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover} - ${messages.confirmRACselection}` }}
                id="mc-confirm-cover-modal"
                customStyle="break-down-popup rev-button-order"
                show={isSelected}
                headerText={modalContent && modalContent.modalHeader}
                confirmLabel={coverNeeded ? messages.coverageContinue : messages.noCoverageContinueText}
                cancelLabel={messages.coverageGoBack}
                onCancel={closeModal}
                onConfirm={() => { confirmModal(); }}
                hideClose
            >
                <>
                    <HDLabelRefactor
                        Tag="h5"
                        text={messages.youveToldUs}
                        id="mc-break-down-cover-you-told-us-label"
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
                        id="mc-break-down-cover-is-that-right-label"
                        className="mt-3" />
                </>
            </HDModal>
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.breakdownCover} - ${messages.removeCoverEventLabel}` }}
                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover} - ${messages.removeCoverEventLabel}` }}
                id="mc-confirm-no-cover-modal"
                customStyle="break-down-popup rev-button-order"
                show={!coverNeeded}
                headerText={modalContent && modalContent.modalHeader}
                confirmLabel={messages.coverageContinue}
                cancelLabel={messages.coverageGoBack}
                onCancel={noCloseModal}
                onConfirm={() => { noConfirmModal(); }}
                hideClose
            >
                {modalContent && modalContent.listItems && modalContent.listItems.length
                    && modalContent.listItems.map((item) => (
                        <div>{item.item}</div>
                    ))}
            </HDModal>
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.breakdownCover} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.breakdownCover} - ${modalContent ? modalContent.modalHeader : 'modal header'}` }}
                id="mc-confirm-repeat-no-cover-modal"
                customStyle="break-down-popup rev-button-order"
                show={repeatremoveOverlay}
                headerText={modalContent && modalContent.modalHeader}
                confirmLabel={messages.coverageContinue}
                cancelLabel={messages.coverageGoBack}
                onCancel={oncloseremoveOverlay}
                onConfirm={onconfirmremoveOverlay}
                hideClose
            >
                <HDLabelRefactor
                    Tag="h5"
                    text={messages.reConfirm}
                    id="break-down-cover-you-told-us-label"
                    className="my-3" />
            </HDModal>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        customMultiQuoteData: state.customMultiQuoteCoveragesModel,
        ancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel,
        actionType: state.wizardState.app.actionType
    };
};

HDMCRACBreakDownPage.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    parentContinue: PropTypes.func.isRequired,
    racToast: PropTypes.func.isRequired,
    dispatch: PropTypes.shape({}),
    overallPrice: PropTypes.shape({
        price: PropTypes.string,
        text: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        multiCustomUpdatedQuoteCoverageObj: PropTypes.object
    }).isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({
        breakdown: PropTypes.object
    }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    invalidateImportantStuffPage: PropTypes.func.isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }),
    gobackEnabled: PropTypes.bool,
    resetgobackEnabled: PropTypes.func.isRequired,
    subrouteFinished: PropTypes.bool,
    indexArray: PropTypes.shape({}),
    racIndexArrayFn: PropTypes.func.isRequired,
    actionType: PropTypes.string
};

HDMCRACBreakDownPage.defaultProps = {
    multiCustomizeSubmissionVM: null,
    dispatch: null,
    ancillaryJourneyDataModel: null,
    mcPaymentScheduleModel: null,
    gobackEnabled: false,
    indexArray: null,
    subrouteFinished: false,
    actionType: null
};


const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateMultiCustomQuoteCoverages
});

export default connect(mapStateToProps, mapDispatchToProps)(HDMCRACBreakDownPage);
