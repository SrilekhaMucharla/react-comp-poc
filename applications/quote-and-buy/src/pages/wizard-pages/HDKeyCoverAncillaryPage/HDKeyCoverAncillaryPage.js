import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    HDQuoteTable, HDLabelRefactor, HDQuoteDownloadRefactor, HDQuoteInfoRefactor, HDInfoCardRefactor
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import EventEmmiter from '../../../EventHandler/event';
import * as messages from './HDKeyCoverAncillaryPage.messages';
import {
    updateQuoteCoverages,
    updateAncillaryJourney,
    getIpidDocumnet,
    setNavigation
} from '../../../redux-thunk/actions';
import {
    generateDownloadableLink,
    getAmount,
    iPidAncillaryAPIObject,
    isSafariAndiOS
} from '../../../common/utils';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton,
} from '../../../web-analytics';
import useToast from '../../Controls/Toast/useToast';
import { KEY_COVER } from '../../../constant/const';
import keyIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Key.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import handlePolicyBookletDownloadFile from '../../../common/downloadFile/handlePolicyBookletDownloadFile';
import iconDownload from '../../../assets/images/wizard-images/hastings-icons/icons/hd-download.svg';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';

const HDKeyCoverAncillaryPage = (props) => {
    const {
        pageMetadata, dispatch, customizeSubmissionVM, updateQuoteCoveragesData, ancillaryJourneyDataModel
    } = props;
    const [selectedValue, setSelectedValue] = useState(null);
    const [keyCoverExpense, setKeyCoverExpense] = useState(0);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [keyCoverReimbursementAmount, setKeyCoverReimbursementAmount] = useState(0);
    const [oneTimeSelectedValue, setOneTimeSelectedValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const isBreakDownChosen = useSelector((state) => state.wizardState.app.breakDownCoverChosen);
    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    // to set the toggle value and amount
    useEffect(() => {
        if (customizeSubmissionVM) {
            setKeyCoverReimbursementAmount((customizeSubmissionVM.value.quote.branchCode === messages.HE) ? messages.ThreeHundred : messages.fiveHundred);
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.ANCKeyCoverCovExt) {
                        if (nestedData.selected) {
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                            setOneTimeSelectedValue(messages.trueString);
                            dispatch(updateAncillaryJourney(KEY_COVER));
                        } else if (ancillaryJourneyDataModel.keyCover) {
                            setSelectedValue(nestedData.selected ? messages.trueString : messages.falseString);
                        } else {
                            setSelectedValue(null);
                        }
                        setKeyCoverExpense(getAmountAsTwoDecimalDigit(nestedData.amount.amount));
                    }
                    return null;
                });
                return null;
            });
        }
    }, [customizeSubmissionVM]);
    // to handle the ipid doc api error
    useEffect(() => {
        const ipiddFailureObj = _.get(ancillaryJourneyDataModel, 'ipidDocError.error');
        if (ipiddFailureObj) {
            // TODO: error handeling for ipid match for all api call
        }
    }, [ancillaryJourneyDataModel]);

    // handle the api call and update the premium
    useEffect(() => {
        if (customizeSubmissionVM
            && updateQuoteCoveragesData
            && (_.get(updateQuoteCoveragesData, 'quoteCoveragesObj')
                && Object.keys(updateQuoteCoveragesData.quoteCoveragesObj).length > 0)
            && aPITriggerPoint) {
            setLoading(false);
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
            _.set(customizeSubmissionVM.value, 'coverages', updateQuoteCoveragesData.quoteCoveragesObj.coverages);
            setAPITriggerPoint(false);
            addToast({
                id: 'key-replacement-toast',
                webAnalyticsEvent: { event_action: `${messages.ancillaries} - ${messages.summary}`, event_value: `${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.keyReplacement}` },
                webAnalyticsView: { ...pageMetadata, page_section: `${messages.ancillaries} - ${messages.summary} - ${selectedValue === messages.trueString ? messages.add : messages.remove} ${messages.keyReplacement}` },
                iconType: selectedValue === messages.trueString ? 'tick' : 'cross',
                bgColor: 'main',
                content: selectedValue === 'true'
                    ? messages.popupMessage(keyCoverExpense || messages.keyCoverAmount)
                    : messages.removedPopupMessage
            });
            dispatch(updateAncillaryJourney(KEY_COVER));
        }

        if (updateQuoteCoveragesData && updateQuoteCoveragesData.quoteCoveragesError && aPITriggerPoint) {
            setLoading(false);
            setAPITriggerPoint(false);
        }

        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        const annualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const monthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        EventEmmiter.dispatch('change', getAmount(paymentType, annualAmount, monthlyAmount));
    }, [updateQuoteCoveragesData, customizeSubmissionVM]);

    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const callUpdateQuoteCoveragesAPI = (targetValue, apiCallFlag) => {
        if (customizeSubmissionVM) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data, index1) => {
                data.coverages.map((nestedData, index2) => {
                    if (nestedData.publicID === messages.ANCKeyCoverCovExt) {
                        const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                        _.set(covaragePath, 'selected', targetValue === messages.trueString);
                        _.set(covaragePath, 'updated', targetValue === messages.trueString);
                        if (apiCallFlag) {
                            setAPITriggerPoint(true);
                            setLoading(true);
                            dispatch(updateQuoteCoverages(customizeSubmissionVM));
                        } else {
                            dispatch(updateAncillaryJourney(KEY_COVER));
                        }
                    }
                    return null;
                });
                return null;
            });
        }
    };

    const updateCoverage = (event) => {
        setSelectedValue(event.target.value);
        if (event.target.value === messages.trueString
            || event.target.value === messages.smallYes
            || event.target.getAttribute('previousvalue') === messages.trueString
            || event.target.getAttribute('previousvalue') === messages.smallYes) {
            callUpdateQuoteCoveragesAPI(event.target.value, true);
        } else if (event.target.value === messages.falseString && oneTimeSelectedValue === messages.trueString) {
            callUpdateQuoteCoveragesAPI(event.target.value, true);
        } else {
            callUpdateQuoteCoveragesAPI(event.target.value, false);
        }
    };

    // continue button event
    const handleClickContinue = () => {
        dispatch(updateAncillaryJourney(KEY_COVER));
        dispatch(setNavigation({
            showContinueOnML: true,
            showContinueOnPAC: true,
            showContinueOnSV: true,
            showContinueOnRAC: true
        }));
        props.navigate(true);
    };

    // handle file download
    const handleDownloadFile = () => {
        const ipiddata = _.get(ancillaryJourneyDataModel, 'ipidsInfo', []);
        if (ipiddata.length) {
            ipiddata.forEach((data) => {
                const isAncillaryCode = data.ancillaryCode || '';
                if (isAncillaryCode === messages.ANCKeyCoverCovExt) {
                    const docParam = iPidAncillaryAPIObject(data, customizeSubmissionVM);
                    if (isSafariAndiOS()) {
                        // Open new window to download the file
                        window.open(generateDownloadableLink(docParam, KEY_COVER), '_blank');
                    } else {
                        dispatch(getIpidDocumnet(docParam, KEY_COVER));
                    }
                }
            });
        } else {
            // TODO : Error handeling if documnet is not available
        }
    };

    const tableData = [
        { name: messages.reimbursementLimit, values: [keyCoverReimbursementAmount, '£1,500'] },
        { name: messages.typeOfKey, values: [messages.carOnly, messages.homeOfficeAndCar] },
        { name: messages.stolenKeyCover, values: [true, true] },
        { name: messages.lostKeyCover, values: [false, true] },
        { name: messages.brokenInLockCover, values: [false, true] },
        { name: messages.noExcess, values: [false, true] },
        { name: messages.fullFamilyCover, values: [false, true] }
    ];

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 8, offset: 2 }
    };

    return (
        <Container>
            <Row className="key-cover-container theme-white pt-4 margin-bottom-lg">
                <Col {...mainColProps}>
                    <div className="container--anc">
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.keyCoverHeading}
                            icon={<img src={keyIcon} alt="Key Cover Icon" />}
                            iconPosition="r"
                            className="key-cover__title-label align-items-center mb-3"
                            id="key-cover-title-label" />
                        <p>{messages.keyCoverLabelText(keyCoverReimbursementAmount)}</p>
                        <p>{messages.tableDescription}</p>
                        <Row className="mt-3 mt-md-4">
                            <Col className="px-mobile-0">
                                <HDQuoteTable
                                    data={tableData}
                                    headerValues={[{
                                        value: messages.columnOneHeader,
                                    }, {
                                        topLabel: customizeSubmissionVM.value.quote.branchCode !== messages.HE ? messages.keyCoverPrefix : '',
                                        value: messages.keyCoverHeading,
                                    }]} />
                            </Col>
                        </Row>
                        <p className="margin-top-lg">{messages.damagedOutsideLock}</p>
                        <p>{messages.reportToPolice}</p>
                        <HDLabelRefactor
                            className="my-3 my-md-4"
                            Tag="a"
                            text={messages.documentLink}
                            onClick={handleDownloadFile} />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.keyReplacement}` }}
                            id="key-cover-button-group"
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
                            btnGroupClassName="grid grid--col-2 grid--col-md-3 gap-md"
                            btnClassName="theme-white"
                        >
                            <HDQuoteInfoRefactor className="my-4">
                                <span>{messages.needKeyProtectionInfo}</span>
                            </HDQuoteInfoRefactor>
                        </HDToggleButtonGroup>
                        <Row className="my-3 my-md-4">
                            <Col md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: `${messages.ancillaries} - ${messages.keyReplacement}` }}
                                    id="key-cover-continue-btn"
                                    size="lg"
                                    label="Continue"
                                    onClick={handleClickContinue}
                                    disabled={!ancillaryJourneyDataModel.keyCover || !isBreakDownChosen}
                                    className="w-100 theme-white" />
                            </Col>
                        </Row>
                        <HDInfoCardRefactor
                            id="key-cover-make-sure-info-card"
                            image={tipCirclePurple}
                            paragraphs={[messages.keyCoverFooterMessage]}
                            theme="light"
                            size="thin"
                            className="mt-3 mt-md-4" />
                    </div>
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
    setNavigation
});

HDKeyCoverAncillaryPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired,
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
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
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    ancillaryJourneyDataModel: PropTypes.shape({ keyCover: PropTypes.bool }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

HDKeyCoverAncillaryPage.defaultProps = {
    toggleContinueElement: () => { },
    navigate: () => { },
    updateQuoteCoveragesData: null,
    customizeSubmissionVM: null,
    ancillaryJourneyDataModel: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDKeyCoverAncillaryPage));
