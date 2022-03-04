import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    HDQuoteTable,
    HDLabelRefactor,
    HDQuoteDownloadRefactor,
    HDQuoteInfoRefactor,
    HDInfoCardRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton,
} from '../../../web-analytics';

import './HDMCKeyCoverAncillaryPage.scss';
import * as messages from './HDMCKeyCoverAncillaryPage.messages';
import {
    updateMultiCustomQuoteCoverages,
    updateMcAncillaryJourney,
    getMCIpidDocument
} from '../../../redux-thunk/actions';
import {
    MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET
} from '../../../redux-thunk/action.types';
import useToast from '../../Controls/Toast/useToast';
import { KEY_COVER } from '../../../constant/const';
import * as helper from '../../../common/mcAncillaryHelpers';
import keyIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Key.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import { trackEvent } from '../../../web-analytics/trackData';
import { ancillaryDataOnly } from '../../../web-analytics/trackQuoteData/common';
import {
    isSafariAndiOS,
    generateDownloadableLink
} from '../../../common/utils';


const HDMCKeyCoverAncillaryPage = (props) => {
    const {
        dispatch,
        customMultiQuoteCoveragesModel,
        mcancillaryJourneyDataModel,
        ancillaryJourneyDataModel,
        multiCustomizeSubmissionVM,
        mcsubmissionVM,
        overallPrice,
        setTotalPrice,
        parentContinue,
        pageMetadata,
        invalidateImportantStuffPage,
        mcPaymentScheduleModel
    } = props;
    const [selectedValue, setSelectedValue] = useState(null);
    const [keyCoverExpense, setKeyCoverExpense] = useState(0);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [toastRequired, setToastRequired] = useState(false);
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];


    const isParentPolicy = (quoteID) => {
        const quote = mcsubmissionVM.value.quotes.find((quoteObj) => quoteObj.quoteID === quoteID);
        return quote.isParentPolicy;
    };

    // to set the toggle value and amount
    useEffect(() => {
        if (multiCustomizeSubmissionVM && multiCustomizeSubmissionVM.value.customQuotes) {
            let selectedCnt = 0;
            multiCustomizeSubmissionVM.value.customQuotes.map((quotes) => {
                if (isParentPolicy(quotes.quoteID)) {
                    quotes.coverages.privateCar.ancillaryCoverages.map((data) => {
                        data.coverages.map((nestedData) => {
                            if (nestedData.publicID === messages.ANCKeyCoverCovExt) {
                                if (nestedData.selected) {
                                    selectedCnt += 1;
                                }
                                setKeyCoverExpense(nestedData.amount.amount);
                            }
                            return null;
                        });
                        return null;
                    });
                }
                return null;
            });
            if (selectedCnt > 0 && !ancillaryJourneyDataModel.keyCover) {
                setSelectedValue(null);
            } else if (ancillaryJourneyDataModel.keyCover) {
                setSelectedValue(selectedCnt > 0 ? messages.trueString : messages.falseString);
                setOneTimeSelectedValue(selectedCnt > 0 ? messages.trueString : messages.falseString);
            } else {
                setSelectedValue(null);
            }
            dispatch(updateMcAncillaryJourney(KEY_COVER));
        }
    }, [multiCustomizeSubmissionVM]);

    // handle the api call and update the premium
    useEffect(() => {
        if (customMultiQuoteCoveragesModel && customMultiQuoteCoveragesModel.loading) {
            setLoading(true);
        } else if (multiCustomizeSubmissionVM
                && customMultiQuoteCoveragesModel
                && (_.get(customMultiQuoteCoveragesModel, 'multiCustomUpdatedQuoteCoverageObj')
                    && Object.keys(customMultiQuoteCoveragesModel.multiCustomUpdatedQuoteCoverageObj).length > 0)
                && aPITriggerPoint) {
            setLoading(false);
            // for updating mcPaymentSchedhuleModel
            if (customMultiQuoteCoveragesModel.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP) {
                _.set(mcPaymentScheduleModel,
                    'mcPaymentScheduleObject', customMultiQuoteCoveragesModel.multiCustomUpdatedQuoteCoverageObj.paymentScheduleResponseMP);
            } else {
                _.set(mcPaymentScheduleModel, 'mcPaymentScheduleObject', null);
            }
            const tempMultiCustomizeSubmisssionVM = [];
            customMultiQuoteCoveragesModel.multiCustomUpdatedQuoteCoverageObj.customQuotesResponses.map((quote) => {
                const newCustomizeSubmissionVM = {
                    quote: quote.quote,
                    coverables: quote.coverables ? quote.coverables : {},
                    insurerName: quote.insurerName ? quote.insurerName : '',
                    quoteID: quote.quoteID,
                    sessionUUID: mcsubmissionVM.value.sessionUUID,
                    periodStartDate: quote.periodStartDate,
                    periodEndDate: quote.periodEndDate,
                    coverType: quote.coverables.vehicles[0].coverType,
                    voluntaryExcess: quote.coverables.vehicles[0].voluntaryExcess,
                    ncdgrantedYears: quote.coverables.vehicles[0].ncdProtection.ncdgrantedYears,
                    ncdgrantedProtectionInd: quote.coverables.vehicles[0].ncdProtection.drivingExperience.protectNCD,
                    producerCode: quote.producerCode,
                    insurancePaymentType: quote.insurancePaymentType,
                    otherOfferedQuotes: quote.coverables.otherOfferedQuotes,
                    coverages: quote.coverages,
                    racEssentials: quote.racEssentials
                };
                tempMultiCustomizeSubmisssionVM.push(newCustomizeSubmissionVM);
                return null;
            });
            _.set(multiCustomizeSubmissionVM.value, 'customQuotes', tempMultiCustomizeSubmisssionVM);
            setAPITriggerPoint(false);
            const dataObj = {};
            dispatch(updateMcAncillaryJourney(dataObj, KEY_COVER));
            dispatch({
                type: MULTI_CUSTOM_UPDATE_QUOTE_COVERAGE_RESET,
                payload: {
                    quoteObj: {}
                }
            });
            let price = 0;
            let premiumAmount = 0;
            let toast = [];
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
            if (toastRequired) {
                toast = [{
                    selection: selectedValue === 'true' ? 'yes' : 'no',
                    count: 0,
                    message: selectedValue === 'true'
                        ? messages.popupMessage(keyCoverExpense || messages.keyCoverAmount)
                        : messages.removedPopupMessage,
                    details: [''],
                    webAnalyticsEvent: {
                        event_action: `${messages.ancillaries} - ${messages.keyReplacement}`,
                        event_value: `${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.keyReplacement}`
                    },
                    webAnalyticsView: {
                        ...pageMetadata,
                        page_section: `${messages.ancillaries} - ${selectedValue === messages.trueString
                            ? messages.add
                            : messages.remove} ${messages.keyReplacement}`
                    },
                    id: 'mc-key-cover-toast'
                }];
            } else {
                toast = [{
                    selection: 'no',
                    count: 0,
                    message: '',
                    details: []
                }];
            }
            parentContinue(toast, '', null);
        } else {
            setLoading(false);
        }
        if (customMultiQuoteCoveragesModel && customMultiQuoteCoveragesModel.quoteCoveragesError && aPITriggerPoint) {
            setLoading(false);
            setAPITriggerPoint(false);
        }
    }, [customMultiQuoteCoveragesModel, multiCustomizeSubmissionVM]);


    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const callUpdateQuoteCoveragesAPI = (targetValue) => {
        if (multiCustomizeSubmissionVM) {
            multiCustomizeSubmissionVM.value.customQuotes.map((value, index1) => {
                if (isParentPolicy(value.quoteID)) {
                    value.coverages.privateCar.ancillaryCoverages.map((data, index2) => {
                        data.coverages.map((nestedData, index3) => {
                            if (nestedData.publicID === messages.ANCKeyCoverCovExt) {
                                // eslint-disable-next-line max-len
                                const covaragePath = multiCustomizeSubmissionVM.value.customQuotes[index1].coverages.privateCar.ancillaryCoverages[index2].coverages[index3];
                                _.set(covaragePath, 'selected', targetValue === messages.trueString);
                                _.set(covaragePath, 'updated', targetValue === messages.trueString);
                            }
                            return null;
                        });
                        return null;
                    });
                }
                return null;
            });
            const params = {
                sessionUUID: mcsubmissionVM.value.sessionUUID,
                mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
                mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
                customQuotes: multiCustomizeSubmissionVM.value.customQuotes
            };
            setAPITriggerPoint(true);
            dispatch(updateMultiCustomQuoteCoverages(params));
            trackEvent({ ...ancillaryDataOnly(params.customQuotes) });
        }
    };

    const updateCoverage = (event) => {
        setToastRequired(true);
        invalidateImportantStuffPage();
        setSelectedValue(event.target.value);
    };

    const handleClickContinue = () => {
        callUpdateQuoteCoveragesAPI(selectedValue, true);
    };

    const tableData = [
        { name: messages.reimbursementLimit, values: ['£300', '£1,500'] },
        { name: messages.reimbursementLimitHD, values: ['£500', '£1,500'] },
        { name: messages.typeOfKey, values: [messages.carOnly, messages.homeOfficeAndCar] },
        { name: messages.stolenKeyCover, values: [true, true] },
        { name: messages.lostKeyCover, values: [false, true] },
        { name: messages.brokenInLockCover, values: [false, true] },
        { name: messages.noExcess, values: [false, true] },
        {
            name: messages.fullFamilyCover,
            values: [
                false,
                {
                    value: true,
                    subheader: <span className="text-small font-regular">{messages.forUpTo28Days}</span>
                }
            ]
        }
    ];

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 6, offset: 3 }
    };

    const handleDownloadFile = () => {
        const data = {
            ancillaryJourneyDataModel: mcancillaryJourneyDataModel,
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM,
            coverExt: messages.ANCKeyCoverCovExt
        };
        const docParam = helper.getIPIDDownloadParams(data);
        if (isSafariAndiOS()) {
            // Open new window to download the file
            window.open(generateDownloadableLink(docParam, messages.KEY_COVER), '_blank');
        } else {
            dispatch(getMCIpidDocument(docParam, messages.KEY_COVER));
        }
    };

    return (
        <Container>
            <Row className="mc-key-cover-container margin-bottom-lg pt-4">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.keyCoverHeading}
                            icon={<img src={keyIcon} alt="Key Cover Icon" />}
                            iconPosition="r"
                            className="key-cover__title-label align-items-center mb-3"
                            id="key-cover-title-label" />
                        <p>{messages.keyCoverLabelText}</p>
                        <p>{messages.tableDescription}</p>
                        <Row className="mt-3 mt-md-4">
                            <Col className="px-mobile-0">
                                <HDQuoteTable
                                    data={tableData}
                                    headerValues={[{
                                        value: messages.columnOneHeader,
                                    }, {
                                        topLabel: messages.keyCoverPrefix,
                                        value: messages.keyCoverHeading,
                                    }]} />
                            </Col>
                        </Row>
                        <div className="mc-keycover-section">
                            <p className="margin-top-lg">{messages.damagedOutsideLock}</p>
                            <p>{messages.reportToPolice}</p>
                            <HDQuoteDownloadRefactor
                                linkText={messages.documentLink}
                                className="my-3 my-md-4"
                                onClick={handleDownloadFile}
                                onKeyDown={handleDownloadFile} />
                            <HDToggleButtonGroup
                                webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.keyReplacement}` }}
                                id="mc-key-cover-button-group"
                                name="keyCoverSelection"
                                availableValues={availableValues}
                                label={{
                                    text: messages.needKeyProtection(keyCoverExpense || messages.keyCoverAmount),
                                    Tag: 'h2',
                                    id: 'key-cover-do-you-need-label',
                                    className: 'mb-3'
                                }}
                                value={selectedValue}
                                onChange={updateCoverage}
                                btnGroupClassName="grid grid--col-2 grid--col-lg-3"
                                btnClassName="theme-white"
                            >
                                <HDQuoteInfoRefactor className="my-4">
                                    <span>{messages.needKeyProtectionInfo}</span>
                                </HDQuoteInfoRefactor>
                            </HDToggleButtonGroup>
                        </div>
                        {(selectedValue === messages.trueString || selectedValue === messages.falseString) && (
                            <Row className="my-3 my-md-4">
                                <Col md={6}>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.keyReplacement}` }}
                                        id="mc-key-cover-continue-btn"
                                        size="lg"
                                        label="Continue"
                                        onClick={handleClickContinue}
                                        className="w-100 theme-white" />
                                </Col>
                            </Row>
                        )}
                        <HDInfoCardRefactor
                            id="key-cover-make-sure-info-card"
                            image={tipCirclePurple}
                            paragraphs={[messages.keyCoverFooterMessage]}
                            theme="light"
                            size="thin"
                            className="mt-3 mt-md-4 mb-5" />
                    </div>
                    {HDToast}
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
        customMultiQuoteCoveragesModel: state.customMultiQuoteCoveragesModel,
        ancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        mcancillaryJourneyDataModel: state.mcancillaryJourneyModel,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateMultiCustomQuoteCoverages,
    updateMcAncillaryJourney,

});

HDMCKeyCoverAncillaryPage.propTypes = {
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    dispatch: PropTypes.func.isRequired,
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
    customMultiQuoteCoveragesModel: PropTypes.shape({
        multiCustomUpdatedQuoteCoverageObj: PropTypes.shape({
            customQuotesResponses: PropTypes.object,
            paymentScheduleResponseMP: PropTypes.object
        }),
        loading: PropTypes.bool,
        multiCustomQuoteCoverageError: PropTypes.shape({})
    }),
    ancillaryJourneyDataModel: PropTypes.shape({ keyCover: PropTypes.bool }),
    mcancillaryJourneyDataModel: PropTypes.shape({ keyCover: PropTypes.bool }),
    overallPrice: PropTypes.shape({
        price: PropTypes.string,
        text: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    parentContinue: PropTypes.func.isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    invalidateImportantStuffPage: PropTypes.func.isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    })
};

HDMCKeyCoverAncillaryPage.defaultProps = {
    toggleContinueElement: () => { },
    navigate: () => { },
    customMultiQuoteCoveragesModel: null,
    mcancillaryJourneyDataModel: null,
    multiCustomizeSubmissionVM: null,
    mcsubmissionVM: null,
    ancillaryJourneyDataModel: null,
    mcPaymentScheduleModel: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDMCKeyCoverAncillaryPage));
