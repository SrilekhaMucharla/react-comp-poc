import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor, HDQuoteTable, HDQuoteDownloadRefactor, HDInfoCardRefactor, HDQuoteInfoRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import * as messages from './HDMCPersonalAccident.messages';
import HDMCPersonalAccidentCarItem from './HDMCPersonalAccidentCarItem';
import {
    updateMultiCustomQuoteCoverages, updateMcAncillaryJourney, getMCIpidDocument
} from '../../../redux-thunk/actions';
import * as helper from '../../../common/mcAncillaryHelpers';
import {
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET
} from '../../../redux-thunk/action.types';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import personalAccidentIcon from '../../../assets/images/wizard-images/hastings-icons/icons/personal-accident.svg';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import formatRegNumber from '../../../common/formatRegNumber';
import getDataforTable from './getTableData';
import {
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';


const HDMCPersonalAccident = ({
    mcsubmissionVM,
    multiCustomizeSubmissionVM,
    customMultiQuoteData,
    ancillaryJourneyDataModel,
    parentContinue,
    overallPrice,
    setTotalPrice,
    dispatch,
    pageMetadata,
    invalidateImportantStuffPage,
    mcPaymentScheduleModel
}) => {
    const [multicarData, setmulticarData] = useState([]);
    const [personalaccidentSelection, setpersonalaccidentSelection] = useState([]);
    const [allsameCover, setallsameCover] = useState(false);
    const [disabledContinue, setdisabledContinue] = useState(false);
    const [apiFlag, setapiFlag] = useState(false);
    const [ancillaryModalObject, setancillaryModalObject] = useState([]);
    const [samecoverType, setsamecoverType] = useState('');
    const [apiAdvancePA, setapiAdvancePA] = useState(false);
    const [ageoverTotalCnt, setageoverTotalCnt] = useState(0);
    const [toastMsg, settoastMsg] = useState([{
        selection: 'yes',
        count: 0,
        message: '',
        details: []
    }, {
        selection: 'no',
        count: 0,
        message: '',
        details: []
    }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customMultiQuoteData && customMultiQuoteData.loading) {
            setLoading(true);
        } else {
            setLoading(false);
            if (apiAdvancePA && customMultiQuoteData && !customMultiQuoteData.loading && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses.length > 0) {
                setapiFlag(false);
                const tempArrPA = [];
                const customDataTemp = customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses;
                mcsubmissionVM.value.quotes.forEach((element1) => {
                    customDataTemp.forEach((element2) => {
                        if (element1.quoteID === element2.quoteID) {
                            tempArrPA.push(element2);
                        }
                    });
                });
                _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempArrPA);
                setmulticarData(tempArrPA);
                const tempToast = [...toastMsg];
                settoastMsg([{
                    selection: 'yes',
                    count: 0,
                    message: '',
                    details: []
                }, {
                    selection: 'no',
                    count: 0,
                    message: '',
                    details: []
                }]);
                let price = 0;
                let premiumAmount = 0;
                multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
                    if (multiCustomizeSubmissionVM.value.insurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE) {
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
                dispatch(updateMcAncillaryJourney(ancillaryModalObject, 'PERSONAL_ACCIDENT'));
                dispatch({
                    type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                    payload: {
                        quoteObj: {}
                    }
                });
                if (apiAdvancePA) {
                    setapiAdvancePA(false);
                    parentContinue(tempToast, '', 3);
                }
                // for updating mcPaymentSchedhuleModel
                if (customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP) {
                    _.set(mcPaymentScheduleModel,
                        'mcPaymentScheduleObject', customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP);
                } else {
                    _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
                }
            }
        }
    }, [customMultiQuoteData]);

    const updatePersonalAccidentAPICall = () => {
        const ancillaryModalObjectTemp = [];
        // eslint-disable-next-line no-unused-expressions
        personalaccidentSelection.forEach((paObj, index) => {
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                if (multiCustomizeSubmissionVM.value.customQuotes[index].quoteID === paObj.quoteId) {
                    ancillaryModalObjectTemp.push({
                        quoteID: paObj.quoteId,
                        personalAccident: true
                    });
                    setancillaryModalObject(ancillaryModalObjectTemp);
                    data.coverages.map((nestedData, index2) => {
                        if (nestedData.publicID === messages.ANCMotorPersonalAccidentCovExt) {
                            // eslint-disable-next-line max-len
                            const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                            _.set(covaragePath, 'selected', paObj.selection);
                            _.set(covaragePath, 'updated', paObj.selection);
                        }
                        return null;
                    });
                }
                return null;
            });
        });
        // call api in case of breakdown value is Yes / preselected No and selecting Yes
        const params = {
            sessionUUID: mcsubmissionVM.value.sessionUUID,
            mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
            mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
            customQuotes: multiCustomizeSubmissionVM.value.customQuotes
        };
        setapiAdvancePA(true);
        dispatch(updateMultiCustomQuoteCoverages(params));
    };

    const enableglobalContinue = (selectionData) => {
        const allClicked = selectionData.every((element) => {
            return element.interacted;
        });
        let selectedPrevious;
        if (ancillaryJourneyDataModel && ancillaryJourneyDataModel.personalAccident.length) {
            selectedPrevious = ancillaryJourneyDataModel.personalAccident.every((element) => {
                return element.personalAccident;
            });
        }
        if (allClicked || selectedPrevious) {
            setdisabledContinue(false);
        } else {
            setdisabledContinue(true);
        }
    };

    const handleContinueTriggerButton = () => {
        if (apiFlag) {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                payload: {
                    quoteObj: {}
                }
            });
            updatePersonalAccidentAPICall();
        } else {
            const tempToast = [{
                selection: 'yes',
                count: 0,
                message: '',
                details: []
            }, {
                selection: 'no',
                count: 0,
                message: '',
                details: []
            }];
            parentContinue(tempToast, '', 3);
        }
    };

    useEffect(() => {
        if (multiCustomizeSubmissionVM
            && multiCustomizeSubmissionVM.value && multiCustomizeSubmissionVM.value.customQuotes && multiCustomizeSubmissionVM.value.customQuotes.length) {
            setmulticarData(multiCustomizeSubmissionVM.value.customQuotes);
            const personalaccidentSelectionTmp = [...personalaccidentSelection];
            let comprehensiveCnt = 0;
            let tpftCnt = 0;
            let heCount = 0;
            let dateStr;
            let dateofBirth;
            let tempageoverTotalCnt = 0;
            for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i += 1) {
                const brandCover = multiCustomizeSubmissionVM.value.customQuotes[i].coverages.privateCar.ancillaryCoverages[0].coverages;
                const branchCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quote.branchCode`);
                const quoteId = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quoteID`);
                const dobTemp = _.get(mcsubmissionVM, `value.quotes[${i}].lobData.privateCar.coverables.drivers[0].dateOfBirth`);
                if (dobTemp && dobTemp.year && (dobTemp.month || dobTemp.month === 0) && dobTemp.day) {
                    dateStr = `${dobTemp.year}-${dobTemp.month}-${dobTemp.day}`;
                    dateofBirth = Math.floor((new Date() - new Date(dateStr).getTime())
                        / (365.25 * 24 * 60 * 60 * 1000));
                    if (dateofBirth >= messages.cutoffAge) {
                        tempageoverTotalCnt += 1;
                    }
                }


                const coverType = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].coverType`);
                if (coverType === messages.comprehensive) {
                    comprehensiveCnt += 1;
                } else if (coverType === messages.tpft) {
                    tpftCnt += 1;
                }
                if (branchCode === messages.HE) {
                    heCount += 1;
                }
                const foundObj = brandCover.filter((item) => {
                    return item.name === messages.pageTitleCheck;
                });
                personalaccidentSelectionTmp.push({
                    selection: foundObj && foundObj.length ? foundObj[0].selected : false,
                    index: i,
                    interacted: dateofBirth >= messages.cutoffAge,
                    quoteId: quoteId
                });
            }
            setageoverTotalCnt(tempageoverTotalCnt);
            if (heCount === multiCustomizeSubmissionVM.value.customQuotes.length) {
                setallsameCover(true);
                setsamecoverType(messages.HE);
            } else if (heCount > 0) {
                setallsameCover(false);
            } else if ((comprehensiveCnt === multiCustomizeSubmissionVM.value.customQuotes.length)
                || (tpftCnt === multiCustomizeSubmissionVM.value.customQuotes.length)) {
                setallsameCover(true);
                const indexcoverType = _.get(multiCustomizeSubmissionVM, 'value.customQuotes[0].coverType');
                setsamecoverType(indexcoverType);
            } else {
                setallsameCover(false);
            }
            setpersonalaccidentSelection(personalaccidentSelectionTmp);
            enableglobalContinue(personalaccidentSelectionTmp);
        }
    }, [mcsubmissionVM, multiCustomizeSubmissionVM]);

    const gettoastMessages = (toastDetail) => {
        toastDetail.forEach((toastElement) => {
            if (toastElement.count > 0 && toastElement.selection === 'yes') {
                let initialMsg = '';
                toastElement.details.forEach((element, idxEl) => {
                    if (idxEl !== 0 && (toastElement.details.length - 1) !== idxEl) {
                        initialMsg += ` , <span class="reg-num--toast">${formatRegNumber(element.reg)}</span> at ${element.amount}`;
                    } else if (idxEl !== 0 && (toastElement.details.length - 1) === idxEl) {
                        initialMsg += ` and for <span class="reg-num--toast">${formatRegNumber(element.reg)}</span> at ${element.amount}`;
                    } else if (idxEl === 0) {
                        initialMsg += `<span class="reg-num--toast">${formatRegNumber(element.reg)}</span> at ${element.amount}`;
                    }
                });
                // eslint-disable-next-line no-param-reassign
                toastElement.message = `${messages.ToastAdded} ${initialMsg}.`;
            } else if (toastElement.count > 0 && toastElement.selection === 'no') {
                let initialMsg = '';
                toastElement.details.forEach((element, idxEl) => {
                    if (idxEl !== 0 && (toastElement.details.length - 1) !== idxEl) {
                        initialMsg += ` , <span class="reg-num--toast">${formatRegNumber(element.reg)}</span> `;
                    } else if (idxEl !== 0 && (toastElement.details.length - 1) === idxEl) {
                        initialMsg += ` and <span class="reg-num--toast">${formatRegNumber(element.reg)}</span>`;
                    } else if (idxEl === 0) {
                        initialMsg += `<span class="reg-num--toast">${formatRegNumber(element.reg)}</span>`;
                    }
                });
                // eslint-disable-next-line no-param-reassign
                toastElement.message = `${messages.ToastRemovalFirst} ${initialMsg} ${messages.ToastRemovalSecond}`;
            }
            // eslint-disable-next-line no-param-reassign
            toastElement.webAnalyticsEvent = {
                event_action: `${messages.ancillaries} - ${messages.pageTitle}`,
                event_value: `${toastElement.selection === 'yes' ? messages.add : messages.remove} ${messages.pageTitle}`
            };
            // eslint-disable-next-line no-param-reassign
            toastElement.webAnalyticsView = {
                ...pageMetadata,
                page_section: `${messages.ancillaries} - ${toastElement.selection === 'yes'
                    ? messages.add
                    : messages.remove} ${messages.pageTitle}`
            };
            // eslint-disable-next-line no-param-reassign
            toastElement.id = 'mc-personal-accident-cover-toast';
        });
        settoastMsg(toastDetail);
    };

    const pabuttonHandle = (selection, index, amount, reg, type) => {
        setapiFlag(true);
        const personalaccidentSelectionTmp = [...personalaccidentSelection];
        personalaccidentSelectionTmp[index].interacted = true;
        const temptoastMsg = [...toastMsg];
        if (selection === 'yes') {
            temptoastMsg[0].count += 1;
            temptoastMsg[0].details.push({
                amount: amount,
                reg: reg,
                type: type
            });
            temptoastMsg[1].details.forEach((detail, idx) => {
                if (detail.reg.trim() === reg.trim()) {
                    temptoastMsg[1].details.splice(idx, 1);
                }
            });
            temptoastMsg[1].count = temptoastMsg[1].count > 0 ? temptoastMsg[1].count - 1 : 0;
            personalaccidentSelectionTmp[index].selection = true;
        } else if (selection === 'no') {
            temptoastMsg[1].count += 1;
            temptoastMsg[1].details.push({
                amount: amount,
                reg: reg,
                type: type
            });
            temptoastMsg[0].details.forEach((detail, idx) => {
                if (detail.reg.trim() === reg.trim()) {
                    temptoastMsg[0].details.splice(idx, 1);
                }
            });
            temptoastMsg[0].count = temptoastMsg[0].count > 0 ? temptoastMsg[0].count - 1 : 0;
            personalaccidentSelectionTmp[index].selection = false;
        }
        setpersonalaccidentSelection(personalaccidentSelectionTmp);
        enableglobalContinue(personalaccidentSelectionTmp);
        gettoastMessages(temptoastMsg);
        multiCustomizeSubmissionVM.value.customQuotes.map((customSubmissionVM) => {
            if (customSubmissionVM.quoteID === multicarData[index].quoteID) {
                const coveragesTemp = _.get(customSubmissionVM, 'coverages.privateCar.ancillaryCoverages[0].coverages');
                coveragesTemp.forEach((coverage) => {
                    if (coverage.name === messages.pageTitleCheck) {
                        if (selection === messages.smallNo) {
                            // eslint-disable-next-line no-param-reassign
                            coverage.selected = false;
                        } else {
                            // eslint-disable-next-line no-param-reassign
                            coverage.selected = true;
                        }
                    }
                });
                _.set(customSubmissionVM, 'coverages.privateCar.ancillaryCoverages[0].coverages', coveragesTemp);
            }
            return null;
        });
    };

    const atLeastOnePriceAvailable = _.get(multiCustomizeSubmissionVM, 'value.customQuotes', []).some((cq) => {
        const brandCover = _.get(cq, 'coverages.privateCar.ancillaryCoverages[0].coverages');
        if (!brandCover) {
            return false;
        }
        const personalAcc = brandCover.find((item) => item.name === messages.pageTitle);
        if (!personalAcc) {
            return false;
        }
        return _.get(personalAcc, 'amount.amount', null) !== null;
    });

    const getcoverageQuestion = () => {
        return (
            <>
                <HDLabelRefactor
                    Tag="h2"
                    text={allsameCover ? messages.pageInfoTopSameCover : messages.pageInfoTopDifferentCover}
                    className="margin-bottom-md" />
                {atLeastOnePriceAvailable && (
                    <HDQuoteInfoRefactor className="margin-bottom-lg">
                        <span>{messages.agewarningMessage}</span>
                    </HDQuoteInfoRefactor>
                )}
            </>
        );
    };


    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };

    const handleDownloadFile = () => {
        const data = {
            ancillaryJourneyDataModel: ancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            coverExt: messages.ANCMotorPersonalAccidentCovExt
        };
        const docParam = helper.getIPIDDownloadParams(data);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, messages.PERSONAL_ACCIDENT), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, messages.PERSONAL_ACCIDENT));
        }
    };


    return (
        <Container>
            <Row className="mc-personal-accidents-container padding-bottom-xl pt-4">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.pageTitle}
                            icon={<img src={personalAccidentIcon} alt="Personal Accident Icon" />}
                            iconPosition="r"
                            className="mc-personal-accidents__title-label align-items-center mb-3"
                            id="personal-accidents-title-label" />
                        <p>{messages.pageInfoCover}</p>
                        {!allsameCover ? (
                            <>
                                <HDLabelRefactor
                                    Tag="h2"
                                    text={messages.pageInfoTopDifferentCover}
                                    className="margin-bottom-md" />
                                <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                                    {messages.priceWarning}
                                </HDQuoteInfoRefactor>
                            </>
                        ) : ''}
                        <p>{messages.pageInfoBottom}</p>
                        {allsameCover && (
                            <>
                                <p>{messages.levelscompareText}</p>
                                <Row className="mt-3 mt-md-4">
                                    <Col className="px-mobile-0">
                                        <HDQuoteTable
                                            headerValues={[{
                                                topLabel: null,
                                                value: samecoverType === messages.tpft ? messages.thirdpartyText : messages.alreadyIncluded,
                                            }, {
                                                topLabel: samecoverType === messages.tpft ? '' : messages.pageTitleBefore,
                                                value: messages.patext,
                                            }]}
                                            data={getDataforTable(samecoverType)} />
                                    </Col>
                                </Row>
                                <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                                    {messages.ageWarning}
                                </HDQuoteInfoRefactor>
                                <HDQuoteDownloadRefactor
                                    linkText={messages.readDocumentMessage}
                                    className="my-3 my-md-4"
                                    onClick={handleDownloadFile}
                                    onKeyDown={handleDownloadFile} />
                                {getcoverageQuestion()}
                                {allsameCover ? (
                                    <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                                        {messages.priceWarning}
                                    </HDQuoteInfoRefactor>
                                ) : ''}
                            </>
                        )}
                        {mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length
                            && multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes.map((mcObj, idx, arr) => (
                            // eslint-disable-next-line react/no-array-index-key
                            // eslint-disable-next-line react/jsx-indent
                            <React.Fragment key={idx}>
                                <HDMCPersonalAccidentCarItem
                                    mcObj={mcObj}
                                    allsameCover={allsameCover}
                                    invalidateImportantStuffPage={invalidateImportantStuffPage}
                                    mcsubmissionVM={mcsubmissionVM.value.quotes}
                                    index={idx}
                                    pabuttonHandle={pabuttonHandle}
                                    handleDownloadFile={handleDownloadFile}
                                    ancillaryJourneyDataModel={ancillaryJourneyDataModel} />
                                {idx !== arr.length - 1 && <hr className="horizontal-line--bright-2" />}
                            </React.Fragment>
                        ))}
                        <Row className="my-3 my-md-4">
                            <Col md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                                    id="mc-personal-accidents-continue-btn"
                                    size="lg"
                                    label="Continue"
                                    className="w-100 theme-white"
                                    disabled={disabledContinue}
                                    onClick={handleContinueTriggerButton} />
                            </Col>
                        </Row>
                        <HDInfoCardRefactor
                            id="personal-accidents-make-sure-info-card"
                            image={tipCirclePurple}
                            paragraphs={[messages.coveredAlreadyCoveredPersonMessage]}
                            theme="light"
                            size="thin"
                            className="mt-3 mt-md-4" />
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
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        ancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        customMultiQuoteData: state.customMultiQuoteCoveragesModel,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateMultiCustomQuoteCoverages
});

HDMCPersonalAccident.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    ancillaryJourneyDataModel: PropTypes.shape({ personalAccident: PropTypes.bool }),
    parentContinue: PropTypes.func.isRequired,
    dispatch: PropTypes.shape({}),
    overallPrice: PropTypes.shape({
        price: PropTypes.string,
        text: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        multiCustomUpdatedQuoteCoverageObj: PropTypes.object
    }).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    invalidateImportantStuffPage: PropTypes.func.isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    })
};

HDMCPersonalAccident.defaultProps = {
    multiCustomizeSubmissionVM: null,
    dispatch: null,
    ancillaryJourneyDataModel: null,
    mcPaymentScheduleModel: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCPersonalAccident);
