import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDQuoteInfoRefactor,
    HDLabelRefactor,
} from 'hastings-components';
import LoadingOverlay from 'react-loading-overlay';
import {
    HastingsNCDService,
} from 'hastings-capability-ncd';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDModal as HDModal,
} from '../../../web-analytics';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../__helpers__/policyErrorCheck';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';
import EventEmmiter from '../../../EventHandler/event';
import HDPNCDCostQuestionPage from './HDPNCDCostQuestionPage';
import * as messages from './HDPNCDPage.messages';
import { updateCustomQuote } from '../../../redux-thunk/actions';
import pncdIcon from '../../../assets/images/wizard-images/hastings-icons/icons/Illustrations_Noclaims.svg';
import useToast from '../../Controls/Toast/useToast';
import {
    getAmount
} from '../../../common/utils';
import { HOMEPAGE } from '../../../constant/const';
import HDPNCDTable from './HDPNCDTable';
import { producerCodeList } from '../../../common/producerCodeHelper';


const HDPNCDPage = (props) => {
    const [ncdData, setNCDData] = useState(null);
    const [ncdStepBackCollection, setNCDStepBackCollection] = useState(null);
    const [ncdProtectSelection, setNCDProtectSelection] = useState(false);
    const [pncdAncillaryState, setPncdAncillaryState] = useState(false);
    const [ncdProtectionAvailed, setNCDProtectionAvailed] = useState('no');
    const {
        pageMetadata, customizeSubmissionVM, dispatch, customQuoteData, triggerNextRoute, submissionVM, ncdProtectionInd, actionType
    } = props;
    const [loading, setLoading] = useState(false);
    const [HDToast, addToast] = useToast();
    const [apiTriggerPoint, setAPITriggerPoint] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [stepBackTableData, setStepBackTableData] = useState(null);
    const [directSelectionFromPCW, setDirectSelectionFromPCW] = useState(true);
    const [ncdAdditionalCost, setNcdAdditionalCost] = useState(0);
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);

    const availableValues = [{
        value: 'yes',
        name: messages.yes,
    }, {
        value: 'no',
        name: messages.no,
    }];

    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';

    const quoteID = _.get(customizeSubmissionVM, 'quoteID.value');
    const producerCode = _.get(customizeSubmissionVM, 'producerCode.value');
    const ncdProtectValue = _.get(customizeSubmissionVM, 'ncdgrantedProtectionInd.value');
    const ncdAdditionalCostValue = _.get(customizeSubmissionVM, 'value.ncdProtectionAdditionalAmount');
    const insurerNameValue = _.get(submissionVM, 'value.baseData.insurerName', '');

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
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
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType', messages.PAYMENT_TYPE_ANNUALLY_CODE);
        const paymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        const annualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const monthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        EventEmmiter.dispatch('change', getAmount(paymentType, annualAmount, monthlyAmount));
    };

    const modifyStepBacktable = (data) => {
        data.shift();
        setStepBackTableData(data);
    };

    useEffect(() => {
        HastingsNCDService.fetchNCDData(quoteID)
            .then(({ result: data }) => {
                setNCDData(data);
                modifyStepBacktable(data.averageDiscountCollection.averageDiscount);
                setNCDStepBackCollection(data.ncdstepBackCollection.vehicleStepBack[0]);
            })
            .catch(() => {

            });
        setNcdAdditionalCost(ncdAdditionalCostValue);
        setNCDProtectSelection(ncdProtectValue);
        updateMonthlyAnnualPrice();
    }, []);

    useEffect(() => {
        if (ncdProtectValue) {
            setPncdAncillaryState(true);
            setNCDProtectionAvailed('yes');
        }

        props.toggleContinueElement(false);
    }, []);

    useEffect(() => {
        const preSelectedNCD = ncdProtectionInd;
        if (!preSelectedNCD) {
            setDirectSelectionFromPCW(false);
        }
    }, [submissionVM]);

    useEffect(() => {
        if (!customQuoteData.loading && customQuoteData && apiTriggerPoint) {
            const customQuoteObject = [_.get(customQuoteData, 'customUpdatedQuoteObj.quote', {})];
            const hasCustomQuoteErrors = isUWErrorPresent(customQuoteObject)
                || isGrayListErrorPresent(customQuoteObject)
                || isCueErrorPresent(customQuoteObject);
            if (hasCustomQuoteErrors) {
                setShowDeclineQuote(true);
            }

            _.set(customizeSubmissionVM.value, 'ncdgrantedYears', customQuoteData.customUpdatedQuoteObj.ncdgrantedYears);
            _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', customQuoteData.customUpdatedQuoteObj.ncdgrantedProtectionInd);
            _.set(customizeSubmissionVM.value, 'producerCode', customQuoteData.customUpdatedQuoteObj.producerCode);
            _.set(customizeSubmissionVM.value, 'insurancePaymentType', customQuoteData.customUpdatedQuoteObj.insurancePaymentType);
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', customQuoteData.customUpdatedQuoteObj.otherQuotes);
            _.set(customizeSubmissionVM.value, 'coverages', customQuoteData.customUpdatedQuoteObj.coverages);
            _.set(customizeSubmissionVM.value, 'quote', customQuoteData.customUpdatedQuoteObj.quote);
            _.set(customizeSubmissionVM.value, 'quoteID', customQuoteData.customUpdatedQuoteObj.quoteID);
            _.set(submissionVM, 'value.lobData.privateCar.coverables', customQuoteData.customUpdatedQuoteObj.coverables);
            _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount',
                customQuoteData.customUpdatedQuoteObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);
            setNCDProtectionAvailed('yes');
            const ncdCostAfterUpdate = customizeSubmissionVM.value.ncdProtectionAdditionalAmount;
            setNcdAdditionalCost(ncdCostAfterUpdate);
            setLoading(false);
            if (_.get(customizeSubmissionVM, 'ncdgrantedProtectionInd.value')) {
                setPncdAncillaryState(true);
            } else {
                setPncdAncillaryState(false);
                setNCDProtectSelection(false);
            }
            addToast(
                {
                    webAnalyticsEvent: {
                        event_action: `${messages.ancillaries} - ${messages.summary}`,
                        event_value: `${selectedValue === 'yes' ? messages.add : messages.remove} ${messages.pageTitle}`
                    },
                    webAnalyticsView:
                    {
                        ...pageMetadata,
                        page_section: `${messages.ancillaries} - ${messages.summary} - ${selectedValue === 'yes'
                            ? messages.add
                            : messages.remove} ${messages.pageTitle}`
                    },
                    id: 'pncd-toast',
                    iconType: selectedValue === 'yes' ? 'tick' : 'cross',
                    bgColor: 'main',
                    content: selectedValue === 'yes' ? messages.ncdAddedToastMsg(ncdCostAfterUpdate) : messages.ncdRemoverToastMsg
                }
            );
            updateMonthlyAnnualPrice();
        }
    }, [customQuoteData]);

    const getNCDDetailsOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.ancillariesNCD }}
            webAnalyticsEvent={{ event_action: messages.ancillariesNCD }}
            id="pncd-details-overlay"
            className="pncd__details-overlay"
            showButtons={false}
            overlayButtonIcon={(
                <div className="mb-2">
                    <HDLabelRefactor
                        Tag="a"
                        className="pncd__details-overlay__link"
                        text={messages.importantInfo} />
                </div>
            )}
        >
            { ncdData && ncdStepBackCollection
                && (
                    <div className="pncd-overlay">
                        <div>
                            <HDLabelRefactor
                                icon={<img src={pncdIcon} alt="PNCD Icon" />}
                                Tag="h2"
                                iconPosition="r"
                                text={messages.overlayHeader}
                                adjustImagePosition={false}
                                className="pncd__title-label mb-2 mb-md-0"
                                id="pncd-title-label" />
                            <p>{messages.overlayBodyOne}</p>
                            <p>{messages.overlayBodyTwo}</p>
                            <p>{messages.overlayBodyThree(ncdAdditionalCost, ncdStepBackCollection.yearsNCD, insurerNameValue)}</p>
                        </div>
                        <HDPNCDTable ncdData={stepBackTableData} ncdStepBackCollection={ncdStepBackCollection} />
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
        lg: { span: 8, offset: 2 }
    };

    const updateAPICall = (data) => {
        setLoading(true);
        setAPITriggerPoint(true);
        _.set(customizeSubmissionVM.value, 'ncdgrantedProtectionInd', data);
        dispatch(updateCustomQuote(customizeSubmissionVM));
    };

    const displayNCDCostPage = () => {
        setDirectSelectionFromPCW(false);
        setSelectedValue('yes');
        updateAPICall(true);
    };

    const handleNCDAvailTrigger = (event) => {
        setSelectedValue(event.target.value);
        setDirectSelectionFromPCW(false);
        if (event.target.value === 'no') {
            updateAPICall(false);
        } else {
            updateAPICall(true);
        }
    };

    return (
        <Container>
            {!ncdProtectSelection && !pncdAncillaryState && (
                <Row className="pncd-container padding-bottom-xl pt-4 mt-5 mt-md-4">
                    <Col {...mainColProps}>
                        <HDPNCDCostQuestionPage
                            ncdAvailedValue={ncdProtectSelection}
                            triggerNextRoute={triggerNextRoute}
                            displayNCDCostPage={displayNCDCostPage} />
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

            {pncdAncillaryState && (
                <Row className="pncd-container padding-bottom-xl pt-4">
                    <Col {...mainColProps}>
                        <div className="container--anc mt-5">
                            <HDLabelRefactor
                                icon={<img src={pncdIcon} alt="PNCD Icon" />}
                                Tag="h2"
                                iconPosition="r"
                                adjustImagePosition={false}
                                text={messages.pageTitle}

                                className="pncd__title-label mb-3 mb-lg-0"
                                id="pncd-title-label" />
                            {ncdStepBackCollection && (
                                <div>
                                    <h3>
                                        {messages.ncdProtectText(ncdStepBackCollection.yearsNCD)}
                                        {(producerCode !== messages.defaultText
                                        && producerCode !== messages.clearScore
                                        && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode))
                                        && directSelectionFromPCW)
                                        && <span>{messages.PCW(getPCWProducerCodeValue())}</span>}
                                    </h3>
                                </div>
                            )}
                            <p>
                                {messages.pncdDescriptionOne}
                                <strong>{messages.pncdDescriptionCostTwo}</strong>
                                {messages.pncdDescriptionThree}
                            </p>

                            <HDQuoteInfoRefactor>
                                <span>
                                    {messages.ncdCostText}
                                    <span className="font-bold">
                                        { messages.ncdCostAmount(ncdAdditionalCost)}
                                    </span>
                                    <span>{messages.alreadyIncluded}</span>
                                </span>
                                {getNCDDetailsOverlay}
                            </HDQuoteInfoRefactor>
                            <HDToggleButtonGroup
                                webAnalyticsEvent={{ event_action: messages.ancillariesNCD }}
                                id="pncd-button-group"
                                availableValues={availableValues}
                                label={{
                                    Tag: 'h4',
                                    text: messages.pncdQuestion,
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
                                        onClick={triggerNextRoute} />
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
                    {HDToast}
                </Row>
            )}
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
        </Container>
    );
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    customQuoteData: state.customQuoteModel,
    ncdProtectionInd: state.wizardState.app.ncdProtectionInd,
    actionType: state.wizardState.app.actionType,

});

// const mapStateToProps = (state) => {
//     console.log('test');
//     return {
//         submissionVM: state.wizardState.data.submissionVM,
//         customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
//         customQuoteData: state.customQuoteModel
//     }
// };

HDPNCDPage.propTypes = {
    customizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }),
    submissionVM: PropTypes.shape({
    }),
    toggleContinueElement: PropTypes.func,
    dispatch: PropTypes.shape({}),
    customQuoteData: PropTypes.shape({ loading: PropTypes.bool, customUpdatedQuoteObj: PropTypes.object }),
    triggerNextRoute: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    ncdProtectionInd: PropTypes.bool,
    actionType: PropTypes.string
};

HDPNCDPage.defaultProps = {
    submissionVM: null,
    customizeSubmissionVM: null,
    toggleContinueElement: () => { },
    dispatch: null,
    customQuoteData: null,
    triggerNextRoute: () => { },
    ncdProtectionInd: null,
    actionType: null
};

export default withRouter(connect(mapStateToProps)(HDPNCDPage));
