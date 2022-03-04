import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor,
    HDQuoteTable,
    HDQuoteInfoRefactor,
    HDQuoteDownloadRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import carIcon from '../../../assets/images/wizard-images/hastings-icons/icons/car.svg';
import * as messages from './HDMultiCarSubVehicle.messages';
import HDMCSubVehicleCarItem from './HDMCSubVehicleCarItem';
import * as helper from '../../../common/mcAncillaryHelpers';
import {
    updateMultiCustomQuoteCoverages, updateMcAncillaryJourney, getMCIpidDocument
} from '../../../redux-thunk/actions';
import {
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET
} from '../../../redux-thunk/action.types';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import formatRegNumber from '../../../common/formatRegNumber';
import { provisionalLicenceTypes } from '../../../constant/const';
import {
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';

const HDMultiCarSubVehicle = ({
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
    const [subvehicleSelection, setsubvehicleSelection] = useState([]);
    const [disabledContinue, setdisabledContinue] = useState(false);
    const [multicarData, setmulticarData] = useState([]);
    const [apiFlag, setapiFlag] = useState(false);
    const [ancillaryModalObject, setancillaryModalObject] = useState([]);
    const [apiAdvanceSV, setapiAdvanceSV] = useState(false);
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
    const [isProvisional, setIsProvisional] = useState([]);


    useEffect(() => {
        if (customMultiQuoteData && customMultiQuoteData.loading) {
            setLoading(true);
        } else {
            setLoading(false);
            if (apiAdvanceSV && customMultiQuoteData && !customMultiQuoteData.loading && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses
                && customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses.length > 0) {
                setapiFlag(false);
                const tempArrSV = [];
                const customDataTemp = customMultiQuoteData.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses;
                mcsubmissionVM.value.quotes.forEach((element1) => {
                    customDataTemp.forEach((element2) => {
                        if (element1.quoteID === element2.quoteID) {
                            tempArrSV.push(element2);
                        }
                    });
                });
                _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempArrSV);
                setmulticarData(tempArrSV);
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
                dispatch(updateMcAncillaryJourney(ancillaryModalObject, 'SUBSTITUTE_VEHICLE'));
                dispatch({
                    type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                    payload: {
                        quoteObj: {}
                    }
                });
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
                if (apiAdvanceSV) {
                    setapiAdvanceSV(false);
                    parentContinue(tempToast, '', 4);
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

    const updateSubVehicleAPICall = () => {
        const ancillaryModalObjectTemp = [];
        // eslint-disable-next-line no-unused-expressions
        subvehicleSelection.forEach((paObj, index) => {
            // eslint-disable-next-line no-unused-expressions
            multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes[index].coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                if (multiCustomizeSubmissionVM.value.customQuotes[index].quoteID === paObj.quoteId) {
                    ancillaryModalObjectTemp.push({
                        quoteID: paObj.quoteId,
                        substituteVehicle: true
                    });
                    setancillaryModalObject(ancillaryModalObjectTemp);
                    data.coverages.map((nestedData, index2) => {
                        if (nestedData.publicID === messages.ANCSubstituteVehicleCovExt) {
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
        setapiAdvanceSV(true);
        dispatch(updateMultiCustomQuoteCoverages(params));
    };

    const enableglobalContinue = (selectionData, provisionalLicences) => {
        const allClickedOrProvisional = selectionData.every((element, index) => {
            return element.interacted || provisionalLicences[index];
        });
        let selectedPrevious;
        if (ancillaryJourneyDataModel.substituteVehicle.length) {
            selectedPrevious = ancillaryJourneyDataModel.substituteVehicle.every((element) => {
                return element.substituteVehicle;
            });
        }
        if (allClickedOrProvisional || selectedPrevious) {
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
            updateSubVehicleAPICall();
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
            parentContinue(tempToast, null, 4);
        }
    };

    const getLicenceTypeForPolicyHolder = (MCSubmissionVM, quoteId) => {
        const quote = MCSubmissionVM.value.quotes.find((mcquote) => mcquote.quoteID === quoteId);
        const policyHolder = quote.lobData.privateCar.coverables.drivers.find((driver) => driver.isPolicyHolder);
        const { licenceType } = policyHolder;
        return licenceType;
    };

    const isLicenceProvisional = (licence) => provisionalLicenceTypes.includes(licence);

    useEffect(() => {
        if (multiCustomizeSubmissionVM
            && multiCustomizeSubmissionVM.value && multiCustomizeSubmissionVM.value.customQuotes && multiCustomizeSubmissionVM.value.customQuotes.length) {
            setmulticarData(multiCustomizeSubmissionVM.value.customQuotes);
            const subvehicleSelectionTmp = [...subvehicleSelection];
            const isProvisionalTmp = [...isProvisional];
            for (let i = 0; i < multiCustomizeSubmissionVM.value.customQuotes.length; i += 1) {
                const brandCover = multiCustomizeSubmissionVM.value.customQuotes[i].coverages.privateCar.ancillaryCoverages[0].coverages;
                const branchCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quote.branchCode`);
                const producerCode = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].producerCode`);
                const quoteId = _.get(multiCustomizeSubmissionVM, `value.customQuotes[${i}].quoteID`);
                const foundObj = brandCover.filter((item) => {
                    return item.name === messages.pageTitle;
                });

                subvehicleSelectionTmp[i] = {
                    selection: foundObj && foundObj.length ? foundObj[0].selected : false,
                    index: i,
                    interacted: false,
                    producerCode: producerCode,
                    branchCode: branchCode,
                    quoteId: quoteId
                };
                isProvisionalTmp[i] = isLicenceProvisional(getLicenceTypeForPolicyHolder(mcsubmissionVM, quoteId));
            }
            setsubvehicleSelection(subvehicleSelectionTmp);
            setIsProvisional(isProvisionalTmp);
            enableglobalContinue(subvehicleSelectionTmp, isProvisionalTmp);
        }
    }, [multiCustomizeSubmissionVM, mcsubmissionVM]);

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
            toastElement.id = 'mc-subtitute-vehicle-toast';
        });
        settoastMsg(toastDetail);
    };

    const subvehiclebuttonHandle = (selection, index, amount, reg, type) => {
        setapiFlag(true);
        const subvehicleSelectionTmp = [...subvehicleSelection];
        subvehicleSelectionTmp[index].interacted = true;
        const temptoastMsg = [...toastMsg];
        if (selection === messages.smallYes) {
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
            subvehicleSelectionTmp[index].selection = true;
        } else if (selection === messages.smallNo) {
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
            subvehicleSelectionTmp[index].selection = false;
        }
        setsubvehicleSelection(subvehicleSelectionTmp);
        enableglobalContinue(subvehicleSelectionTmp, isProvisional);
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

    const tableData = [
        {
            name: messages.providedWhenBeingRepaired,
            values: [
                {
                    value: true,
                    subheader: <span className="text-small">{messages.forDurationOfRepairs}</span>
                },
                false
            ]
        },
        {
            name: messages.providedStolenWrittenOff,
            values: [
                false,
                {
                    value: true,
                    subheader: <span className="text-small font-regular">{messages.forUpTo28Days}</span>
                }
            ]
        },
        {
            name: messages.providedIfCarCantBeRepaired,
            values: [
                false,
                {
                    value: true,
                    subheader: <span className="text-small font-regular">{messages.forUpTo28Days}</span>
                }
            ]
        },
        {
            name: (
                <>
                    {messages.carOfSimilarEngineSizeAndSeats}
                    <br />
                    {messages.upTo2000CCAnd7Seats}
                </>
            ),
            values: [false, true]
        },
        { name: messages.deliveredToYourHome, values: [false, true] }
    ];

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };

    const handleDownloadFile = () => {
        const data = {
            ancillaryJourneyDataModel: ancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            coverExt: messages.ANCSubstituteVehicleCovExt
        };
        const docParam = helper.getIPIDDownloadParams(data);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, messages.SUBSTITUTE_VEHICLE), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, messages.SUBSTITUTE_VEHICLE));
        }
    };

    const atLeastOnePriceAvailable = _.get(multiCustomizeSubmissionVM, 'value.customQuotes', []).some((cq) => {
        const brandCover = _.get(cq, 'coverages.privateCar.ancillaryCoverages[0].coverages');
        if (!brandCover) {
            return false;
        }
        const substituteVeh = brandCover.find((item) => item.name === messages.pageTitle);
        if (!substituteVeh) {
            return false;
        }
        return _.get(substituteVeh, 'amount.amount', null) !== null;
    });

    return (
        <Container>
            <Row className="mc-substitute-vehicle-container margin-bottom-lg pt-3">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.pageTitle}
                            icon={<img src={carIcon} alt="Substitute Vehicle Icon" />}
                            iconPosition="r"
                            className="mc-substitute-vehicle__title-label align-items-center mb-2"
                            id="mc-substitute-vehicle-title-label" />
                        <p className="mc-substitute-vehicle__main-text margin-bottom-lg">
                            {messages.pageParagraphFirst}
                            <span className="font-bold">{messages.pageParagraphSecond}</span>
                            {messages.pageParagraphThird}
                        </p>
                        <Row className="mt-3 mt-md-4">
                            <Col className="px-mobile-0">
                                <HDQuoteTable
                                    data={tableData}
                                    headerValues={messages.headerValues} />
                            </Col>
                        </Row>
                        <HDQuoteInfoRefactor>
                            <span>{messages.pageInfoTextFirst}</span>
                        </HDQuoteInfoRefactor>
                        <HDQuoteDownloadRefactor
                            linkText={messages.pageLinkText}
                            className="mc-substitute-vehicle__ipid-link"
                            onClick={handleDownloadFile}
                            onKeyDown={handleDownloadFile} />
                        <HDLabelRefactor Tag="h2" text={messages.pageAddSubstituteVehicleTitle} className="margin-bottom-md" />
                        {atLeastOnePriceAvailable && (
                            <HDQuoteInfoRefactor className="margin-bottom-md margin-bottom-lg-lg">
                                {messages.priceWarning}
                            </HDQuoteInfoRefactor>
                        )}
                        {mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length
                            && multiCustomizeSubmissionVM.value.customQuotes.map((mcObj, idx, arr) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <React.Fragment key={idx}>
                                    <HDMCSubVehicleCarItem
                                        isProvisional={isProvisional[idx]}
                                        mcObj={mcObj}
                                        invalidateImportantStuffPage={invalidateImportantStuffPage}
                                        mcsubmissionVM={mcsubmissionVM.value.quotes}
                                        index={idx}
                                        subvehiclebuttonHandle={subvehiclebuttonHandle}
                                        ancillaryJourneyDataModel={ancillaryJourneyDataModel} />
                                    {idx !== arr.length - 1 && <hr className="horizontal-line--bright-2" />}
                                </React.Fragment>
                            ))}
                        <Row className="margin-top-lg">
                            <Col md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.pageTitle}` }}
                                    id="mc-substitute-vehicle-continue-btn"
                                    size="lg"
                                    label="Continue"
                                    disabled={disabledContinue}
                                    onClick={handleContinueTriggerButton}
                                    className="w-100 theme-white" />
                            </Col>
                        </Row>
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

HDMultiCarSubVehicle.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    parentContinue: PropTypes.shape({ motorLegal: PropTypes.bool }),
    dispatch: PropTypes.shape({}),
    overallPrice: PropTypes.shape({
        price: PropTypes.string,
        text: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    ancillaryJourneyDataModel: PropTypes.shape({ substituteVehicle: PropTypes.bool }),
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

HDMultiCarSubVehicle.defaultProps = {
    multiCustomizeSubmissionVM: null,
    dispatch: null,
    parentContinue: null,
    ancillaryJourneyDataModel: null,
    mcPaymentScheduleModel: null
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

export default connect(mapStateToProps, mapDispatchToProps)(HDMultiCarSubVehicle);
