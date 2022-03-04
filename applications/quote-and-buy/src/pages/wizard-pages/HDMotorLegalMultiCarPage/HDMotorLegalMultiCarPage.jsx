import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor,
    HDQuoteInfoRefactor,
    HDQuoteDownloadRefactor,
    HDInfoCardRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import BlueTick from '../../../assets/images/icons/blue-tick-icon.svg';
import motorLegalIcon from '../../../assets/images/icons/legal.svg';
import * as messages from './HDMotorLegalMultiCarPage.messages';
import HDMotorLegalCarItem from './HDMotorLegalCarItem';
import TipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import * as helper from '../../../common/mcAncillaryHelpers';
import {
    updateMultiCustomQuoteCoverages, updateMcAncillaryJourney, getMCIpidDocument,
} from '../../../redux-thunk/actions';
import {
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET
} from '../../../redux-thunk/action.types';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import formatRegNumber from '../../../common/formatRegNumber';
import { defaqtoSrc } from '../../../constant/const';
import { producerCodeList } from '../../../common/producerCodeHelper';
import {
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';


const HDMotorLegalMultiCarPage = ({
    mcsubmissionVM,
    multiCustomizeSubmissionVM,
    customMultiQuoteData,
    ancillaryJourneyDataModel,
    parentContinue,
    overallPrice,
    setTotalPrice,
    onGoBack,
    mcancillaryJourneyDataModel,
    dispatch,
    pageMetadata,
    mcPaymentScheduleModel,
    actionType
}) => {
    const [multicarData, setmulticarData] = useState([]);
    const [disabledContinue, setdisabledContinue] = useState(false);
    const [apiAdvanceML, setapiAdvanceML] = useState(false);
    const [motorlegalSelection, setmotorlegalSelection] = useState([]);
    const [toastadditionalMessage, settoastadditionalMessage] = useState('');
    const [apiFlag, setapiFlag] = useState(false);
    const [parentpolicy, setparentpolicy] = useState('');
    const [ancillaryModalObject, setancillaryModalObject] = useState([]);
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
            if (apiAdvanceML && customMultiQuoteData && !customMultiQuoteData.loading && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses.length > 0) {
                setapiFlag(false);
                const tempArrML = [];
                const customDataTemp = customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses;
                mcsubmissionVM.value.quotes.forEach((element1) => {
                    customDataTemp.forEach((element2) => {
                        if (element1.quoteID === element2.quoteID) {
                            tempArrML.push(element2);
                        }
                    });
                });
                _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempArrML);
                setmulticarData(customDataTemp);
                const tempToast = [...toastMsg];
                const tempadditionalMessage = toastadditionalMessage;
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
                settoastadditionalMessage('');
                dispatch(updateMcAncillaryJourney(ancillaryModalObject, 'MOTOR_LEGAL'));
                dispatch({
                    type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                    payload: {
                        quoteObj: {}
                    }
                });
                if (apiAdvanceML) {
                    setapiAdvanceML(false);
                    parentContinue(tempToast, tempadditionalMessage, 1);
                }
                // for updating mcPaymentSchedhuleModel
                if (customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP) {
                    _.set(mcPaymentScheduleModel,
                        'mcPaymentScheduleObject', customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP);
                } else {
                    _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
                }
            }
            let price = 0;
            let premiumAmount = 0;
            if (multiCustomizeSubmissionVM) {
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
            }
        }
    }, [customMultiQuoteData]);

    const updateMotorLegalAPICall = () => {
        const ancillaryModalObjectTemp = [];
        // eslint-disable-next-line no-unused-expressions
        motorlegalSelection.forEach((motorlegalObj, index) => {
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                if (multiCustomizeSubmissionVM.value.customQuotes[index].quoteID === motorlegalObj.quoteId) {
                    ancillaryModalObjectTemp.push({
                        quoteID: motorlegalObj.quoteId,
                        motorLegal: true
                    });
                    setancillaryModalObject(ancillaryModalObjectTemp);
                    data.coverages.map((nestedData, index2) => {
                        if (nestedData.publicID === messages.ANCMotorLegalExpensesCovExt) {
                            const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[index]
                                .coverages
                                .privateCar
                                .ancillaryCoverages[index1]
                                .coverages[index2];
                            _.set(covaragePath, 'selected', motorlegalObj.selection);
                            _.set(covaragePath, 'updated', motorlegalObj.selection);
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
        setapiAdvanceML(true);
        dispatch(updateMultiCustomQuoteCoverages(params));
    };

    const handleContinueTriggerButton = () => {
        if (apiFlag) {
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                payload: {
                    quoteObj: {}
                }
            });
            updateMotorLegalAPICall();
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
            parentContinue(tempToast, '', 1);
        }
    };

    const enableglobalContinue = (selectionData) => {
        const allClicked = selectionData.every((element) => {
            return element.interacted;
        });
        let selectedPrevious;
        if (ancillaryJourneyDataModel.motorLegal.length) {
            selectedPrevious = ancillaryJourneyDataModel.motorLegal.every((element) => {
                return element.motorLegal;
            });
        }
        if (allClicked || selectedPrevious) {
            setdisabledContinue(false);
        } else {
            setdisabledContinue(true);
        }
    };

    useEffect(() => {
        if (multiCustomizeSubmissionVM
            && multiCustomizeSubmissionVM.value && multiCustomizeSubmissionVM.value.customQuotes && multiCustomizeSubmissionVM.value.customQuotes.length) {
            setmulticarData(multiCustomizeSubmissionVM.value.customQuotes);
            const parentplc = mcsubmissionVM.value.quotes.find((submissionVM) => submissionVM.isParentPolicy);
            setparentpolicy(parentplc);
            const motorlegalSelectionTmp = [...motorlegalSelection];
            let hpTotalCnt = 0;
            let pcwTotalCnt = 0;
            for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i += 1) {
                const brandCover = multiCustomizeSubmissionVM.value.customQuotes[i].coverages.privateCar.ancillaryCoverages[0].coverages;
                const branchCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quote.branchCode`);
                const producerCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].producerCode`);
                const quoteId = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quoteID`);
                const foundObj = brandCover.filter((item) => {
                    return item.name === messages.pageTitle;
                });
                motorlegalSelectionTmp.push({
                    selection: foundObj[0].selected,
                    index: i,
                    interacted: ((branchCode === messages.HP)
                        || (producerCode !== messages.defaultCode && producerCode !== 'ClearScore' && foundObj[0].selected
                        && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode)))),
                    producerCode: producerCode,
                    branchCode: branchCode,
                    quoteId: quoteId
                });
            }
            multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote, index) => {
                if (_.get(multiCustomizeSubmissionVM, `value.customQuotes[${index}].quote.branchCode`) === messages.HP) {
                    hpTotalCnt += 1;
                }
                if (_.get(multiCustomizeSubmissionVM, `value.customQuotes[${index}].producerCode`) !== messages.defaultCode
                    && _.get(multiCustomizeSubmissionVM, `value.customQuotes[${index}].producerCode`) !== 'ClearScore'
                    && (actionType !== messages.directText && !_.includes(producerCodeList, _.get(multiCustomizeSubmissionVM, `value.customQuotes[${index}].producerCode`)))) {
                    pcwTotalCnt += 1;
                }
            });
            setmotorlegalSelection(motorlegalSelectionTmp);
            enableglobalContinue(motorlegalSelectionTmp);
            if (mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length) {
                let tempToastMsg = '';
                let tempMsg = '';
                if (hpTotalCnt === mcsubmissionVM.value.quotes.length) {
                    setapiFlag(true);
                }
                if (pcwTotalCnt === mcsubmissionVM.value.quotes.length) {
                    setapiFlag(true);
                }
                if ((pcwTotalCnt + hpTotalCnt) === mcsubmissionVM.value.quotes.length) {
                    setapiFlag(true);
                }
                let hpCnt = 0;
                for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
                    if (_.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quote.branchCode`) === messages.HP) {
                        hpCnt += 1;
                        const regNum = mcsubmissionVM.value.quotes[i].lobData.privateCar.coverables.vehicles[0].license;
                        if (hpCnt > 1 && hpTotalCnt === hpCnt) {
                            tempMsg = ` and <span class="reg-num--toast">${formatRegNumber(regNum)}</span>`;
                        } else if (hpCnt > 1 && hpTotalCnt !== hpCnt) {
                            tempMsg = ` , <span class="reg-num--toast">${formatRegNumber(regNum)}</span>`;
                        } else {
                            tempMsg = `<span class="reg-num--toast">${formatRegNumber(regNum)}</span>`;
                        }
                        tempToastMsg += tempMsg;
                    }
                }
                if (tempToastMsg) {
                    settoastadditionalMessage(tempToastMsg + messages.ToastAlreadyAdded);
                } else {
                    settoastadditionalMessage('');
                }
            }
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
            toastElement.id = 'mc-motor-legal-toast';
        });
        settoastMsg(toastDetail);
    };
    useEffect(() => {
        if (mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length) {
            const temptoastMsg = [...toastMsg];
            let pcwCount = 0;
            for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
                const producerCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].producerCode`);
                const brandCover = multiCustomizeSubmissionVM.value.customQuotes[i].coverages.privateCar.ancillaryCoverages[0].coverages;
                const foundObj = brandCover.filter((item) => {
                    return item.name === messages.pageTitle;
                });
                const branchCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quote.branchCode`);
                if (producerCode !== messages.defaultCode && producerCode !== 'ClearScore' && foundObj[0].selected && branchCode !== messages.HP) {
                    pcwCount += 1;
                    let regNum = mcsubmissionVM.value.quotes[i].lobData.privateCar.coverables.vehicles[0].license;
                    regNum = `${regNum.substring(0, 4)} ${regNum.substring(4, regNum.length)}`;
                    const amount = _.get(foundObj[0].amount, 'amount', 0);
                    temptoastMsg[0].count += 1;
                    temptoastMsg[0].details.push({
                        amount: amount,
                        reg: regNum,
                        type: messages.PCW
                    });
                    temptoastMsg[1].count = temptoastMsg[1].count > 0 ? temptoastMsg[1].count - 1 : 0;
                }
            }
            if (pcwCount > 0) {
                gettoastMessages(temptoastMsg);
            }
        }
    }, []);

    const motorlegalbuttonHandle = (selection, index, amount, reg, type) => {
        const motorlegalSelectionTmp = [...motorlegalSelection];
        motorlegalSelectionTmp[index].interacted = true;
        setapiFlag(true);
        const temptoastMsg = [...toastMsg];
        if (selection === messages.SMALL_YES) {
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
            motorlegalSelectionTmp[index].selection = true;
        } else if (selection === messages.SMALL_NO) {
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
            motorlegalSelectionTmp[index].selection = false;
        }
        setmotorlegalSelection(motorlegalSelectionTmp);
        enableglobalContinue(motorlegalSelectionTmp);
        gettoastMessages(temptoastMsg);

        multiCustomizeSubmissionVM.value.customQuotes.map((customSubmissionVM) => {
            if (customSubmissionVM.quoteID === multicarData[index].quoteID) {
                const coveragesTemp = _.get(customSubmissionVM, 'coverages.privateCar.ancillaryCoverages[0].coverages');
                coveragesTemp.forEach((coverage) => {
                    if (coverage.name === messages.pageTitle) {
                        if (selection === messages.SMALL_NO) {
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

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 7, offset: 3 }
    };

    const handleDownloadFile = () => {
        const data = {
            ancillaryJourneyDataModel: mcancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            coverExt: messages.ANCMotorLegalExpensesCovExt
        };
        const docParam = helper.getIPIDDownloadParams(data);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, messages.MOTOR_LEGAL), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, messages.MOTOR_LEGAL));
        }
    };

    return (
        <Container>
            <Row className="mc-motor-legal-container padding-bottom-xl mb-5 pt-4">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <div className="back-navigation-motor-legal">
                            <BackNavigation
                                id="backNavMainWizard"
                                className="back-button"
                                onClick={onGoBack}
                                onKeyPress={onGoBack} />
                        </div>
                        <HDLabelRefactor
                            icon={<img src={motorLegalIcon} alt="Motor Legal Icon" />}
                            Tag="h2"
                            iconPosition="r"
                            adjustImagePosition={false}
                            text={messages.pageTitle}
                            className="mc-motor-legal__title-label mb-3"
                            id="mc-motor-legal-title-label" />
                        <p id="motor-legal-intro-text-label">
                            {messages.pageParagraphFirst}
                        </p>
                        <div>
                            <div className="mc-motor-legal__details mt-3">
                                <div className="mc-motor-legal__details__list-items pr-sm-3 flex-grow-1 mb-3">
                                    {messages.motorLegalExpensesItems.map((item) => (
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={item}
                                            icon={<img src={BlueTick} alt={messages.tick} />}
                                            iconPosition="l"
                                            className="mb-2" />
                                    ))}
                                </div>
                                <div className="mc-motor-legal__details__img-wrapper">
                                    <img src={defaqtoSrc} alt="defaqto" className="mc-motor-legal__details__img-wrapper__defaqto-img mt-1 mt-sm-0" />
                                </div>
                                <div className="mc-motor-legal__details__paragraphs pr-3 pr-sm-0">
                                    <p>{messages.pageInfoTextFirst}</p>
                                </div>
                            </div>
                            <p>{messages.pageInfoTextSecond}</p>
                        </div>
                        <HDQuoteDownloadRefactor
                            linkText={messages.pageLinkText}
                            className="mc-motor-legal__pageLinkText my-3 my-md-4"
                            onClick={handleDownloadFile}
                            onKeyDown={handleDownloadFile} />
                        <HDLabelRefactor Tag="h2" text={messages.multiCarNeedThisCover} />
                        <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                            {messages.multiCarInfo}
                        </HDQuoteInfoRefactor>
                        {mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length
                            && multiCustomizeSubmissionVM.value.customQuotes.map((mcObj, idx, arr) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <React.Fragment key={idx}>
                                    <HDMotorLegalCarItem
                                        mcObj={mcObj}
                                        mcsubmissionVM={mcsubmissionVM.value.quotes}
                                        index={idx}
                                        motorlegalbuttonHandle={motorlegalbuttonHandle}
                                        ancillaryJourneyDataModel={ancillaryJourneyDataModel}
                                        motorlegalSelection={motorlegalSelection} />
                                    {idx !== arr.length - 1 && <hr className="horizontal-line--bright-2" />}
                                </React.Fragment>
                            ))}
                        <Row className="my-3 my-md-4">
                            <Col md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                                    id="continue-button"
                                    size="lg"
                                    label="Continue"
                                    disabled={disabledContinue}
                                    className="w-100 theme-white"
                                    onClick={handleContinueTriggerButton} />
                            </Col>
                        </Row>
                        <HDInfoCardRefactor
                            id="mc-motor-legal-make-sure-info-card"
                            image={TipCirclePurple}
                            paragraphs={[messages.coveredAlreadyCoveredPersonMessage]}
                            theme="light"
                            size="thin"
                            className="mt-3 mt-md-4" />
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
        mcancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel,
        actionType: state.wizardState.app.actionType
    };
};

HDMotorLegalMultiCarPage.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    ancillaryJourneyDataModel: PropTypes.shape({ motorLegal: PropTypes.bool }),
    parentContinue: PropTypes.func.isRequired,
    dispatch: PropTypes.shape({}),
    overallPrice: PropTypes.shape({
        price: PropTypes.string,
        text: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    onGoBack: PropTypes.func,
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        multiCustomUpdatedQuoteCoverageObj: PropTypes.object
    }).isRequired,
    mcancillaryJourneyDataModel: PropTypes.shape({ motorLegal: PropTypes.bool }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }),
    actionType: PropTypes.string
};

HDMotorLegalMultiCarPage.defaultProps = {
    multiCustomizeSubmissionVM: null,
    dispatch: null,
    ancillaryJourneyDataModel: null,
    mcancillaryJourneyDataModel: null,
    onGoBack: () => { },
    mcPaymentScheduleModel: null,
    actionType: null
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateMultiCustomQuoteCoverages,
    getMCIpidDocument
});


export default connect(mapStateToProps, mapDispatchToProps)(HDMotorLegalMultiCarPage);
