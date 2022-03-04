import React, { useEffect, useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HDLabelRefactor, HDPaymentBreakdown, HDModal } from 'hastings-components';
import { deployment } from 'app-config';

import {
    HastingsRenewalOptionService,
} from 'hastings-capability-renewaloptions';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDLabel as HDLabel
} from '../../../web-analytics';
import {
    setNavigation
} from '../../../redux-thunk/actions';
import * as messages from '../HDThanksPage/HDThanksPage.messages';
import { getMCYearlyPaymentBreakDownData, getMCMonthlyPaymentBreakDownData } from './MCPaymentBreakdownData';
import appleStoreImage from '../../../assets/images/background/static-apple-store-download-button.svg';
import playStoreImage from '../../../assets/images/background/static-google-play-download-button.svg';
import mobileHandImage from '../../../assets/images/background/static-mobile-hands-001.jpg';
import formatRegNumber from '../../../common/formatRegNumber';
import EventEmmiter from '../../../EventHandler/event';
import { PAYMENT_TYPE_ANNUALLY_CODE } from '../../../constant/const';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import HDRenewalPreference from '../HDRenewalPreferenceOverlay/HDRenewalPreferenceOverlay';
import useToast from '../../Controls/Toast/useToast';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { trackEvent } from '../../../web-analytics/trackData';
import * as helper from '../HDRenewalPreferenceOverlay/HDRenewalPreferenceHelper';
import customEventTracking from '../../../web-analytics/customEventTracking';

const HDMCThanksPage = (props) => {
    const {
        toggleContinueElement,
        mcsubmissionVM,
        mcPaymentScheduleObject,
        pageMetadata,
        multiCustomizeSubmissionVM
    } = props;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles[0]';
    const paymentType = _.get(multiCustomizeSubmissionVM, 'value.insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
    const dispatch = useDispatch();
    const getPaymentBreakDownData = () => {
        if (paymentType === PAYMENT_TYPE_ANNUALLY_CODE) {
            return getMCYearlyPaymentBreakDownData(mcsubmissionVM.value.quotes, multiCustomizeSubmissionVM.value.customQuotes, true, pageMetadata);
        }
        return getMCMonthlyPaymentBreakDownData(mcsubmissionVM.value.quotes, multiCustomizeSubmissionVM.value.customQuotes,
            mcPaymentScheduleObject, true, pageMetadata);
    };
    const mpwrapperNumber = _.get(mcsubmissionVM, 'value.mpwrapperNumber', '');
    const sessionUUID = useSelector((state) => state.wizardState.data.multiCustomizeSubmissionVM.value.sessionUUID);
    const parentCarQuoteID = _.get(mcsubmissionVM, 'value.quotes[0].bindData.policyNumber', '');

    const [paymentBreakDownData] = useState(getPaymentBreakDownData());
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader(0);
    const header = messages.topHeader;
    const steps = [...messages.steps];
    const checkText = messages.documentCheckText;
    const mainHeaderText = messages.stepsMainHeaderText;
    const [displayOptOutModal, setDisplayOptOutModal] = useState(false);
    const [optOutSuccess, setOptOutSuccess] = useState(false);
    const [isReasonSelected, setIsReasonSelected] = useState(false);
    const [HDToast, addToast] = useToast();
    const [apiFailure, setApiFailure] = useState(false);
    const [optOutReasonCode, setOptOutReasonCode] = useState('');
    const [policyEventNotSent, setPolicyEventNotSent] = useState(false);

    useEffect(() => {
        EventEmmiter.dispatch('change', { price: null });
        dispatch(setNavigation({
            showHidePromotionalPage: false
        }));
    }, []);

    useEffect(() => {
        toggleContinueElement(false);
    }, [toggleContinueElement]);


    const parseUrl = (url) => {
        const urlOut = new URL(url);
        return `${urlOut.protocol}//${urlOut.host}`;
    };

    const targetUrl = parseUrl(deployment.url);

    const onLoginMyAccount = () => {
        window.open(`${targetUrl}${messages.myAccountLoginLink}`, '_blank');
    };

    const getpolicyNumber = (quote) => {
        const policyNumber = _.get(quote, 'bindData.policyNumber', '');
        return `XA${policyNumber}`;
    };

    const getReferenceNumber = () => {
        const referenceNum = _.get(mcsubmissionVM, 'value.mpwrapperNumber', '');
        return `XA${referenceNum}`;
    };

    const getCarModel = (model) => {
        const modelStrArray = model.split(' ');
        let tempModel = modelStrArray[0];
        if (modelStrArray.length >= 2) {
            tempModel = `${modelStrArray[0]} ${modelStrArray[1]}`;
        }
        return `${tempModel}`;
    };

    const redirectToMobileApp = () => {
        window.open(`${messages.appLoginLink}`, '_blank');
    };

    const getPolicyNumbersAsString = (quotes) => {
        const policies = [];
        quotes.forEach((quote) => {
            policies.push(getpolicyNumber(quote));
        });
        return policies.join(',');
    };

    const getBranchNamesFromQuotes = () => {
        const branchNames = [];
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            branchNames.push(customQuote.quote.branchName);
        });
        return branchNames.join(',');
    };

    const getBranchCodesFromQuotes = () => {
        const branchCodes = [];
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            branchCodes.push(customQuote.quote.branchCode);
        });
        return branchCodes.join(',');
    };

    const sendCustomWebAnalyticsEvent = (args) => {
        customEventTracking({
            ...args,
            customer_id: getPolicyNumbersAsString(mcsubmissionVM.value.quotes),
            insurance_product: getBranchCodesFromQuotes(),
            product_option: getBranchNamesFromQuotes(),
            product_option_code: getBranchCodesFromQuotes(),
            sales_journey_type: 'multi_car',
            event_category: 'NEWBUS Car',
            journey_type: 'Car'
        });
    };

    const confirmOptOut = () => {
        const data = {
            sessionUUID: sessionUUID,
            policyNumber: parentCarQuoteID,
            foreignID: mpwrapperNumber
        };
        const confirmEventData = {
            event_value: 'Confirm',
            event_action: 'Opting out',
            event_type: 'modal_confirm',
            element_id: 'gipp-nb-auto-rn-opt-out-confirm',
            optOutReasonCode: helper.optOutReasonList[Number(optOutReasonCode) - 1].label
        };
        showLoader();
        HastingsRenewalOptionService.setRenewalOption(data)
            .then(({ result: val }) => {
                if (val.resultFlag) {
                    sendCustomWebAnalyticsEvent(confirmEventData);
                    setOptOutSuccess(true);
                    setDisplayOptOutModal(false);
                    addToast(
                        {
                            id: 'renewal-preference-toast',
                            iconType: 'cross',
                            bgColor: 'light',
                            content: messages.removeRenewalToastMsg
                        }
                    );
                    setApiFailure(false);
                } else {
                    setApiFailure(true);
                }
                hideLoader();
            })
            .catch(() => {
                setApiFailure(true);
                hideLoader();
            });
    };

    const cancelOptOut = () => {
        sendCustomWebAnalyticsEvent({
            event_value: 'Cancel',
            event_action: 'Opting out',
            event_type: 'modal_cancel',
            element_id: 'gipp-nb-auto-rn-opt-out-cancel'
        });
        setDisplayOptOutModal(false);
        setIsReasonSelected(false);
        setApiFailure(false);
    };

    const closeOptOut = () => {
        sendCustomWebAnalyticsEvent({
            event_value: 'close',
            event_action: 'Opting out',
            event_type: 'modal_close',
            element_id: 'gipp-nb-auto-rn-opt-out-close'
        });
        setDisplayOptOutModal(false);
        setIsReasonSelected(false);
        setApiFailure(false);
    };

    const showOptOutModal = () => {
        sendCustomWebAnalyticsEvent({
            event_value: 'Change preference',
            event_type: 'label_click',
            element_id: 'gipp-nb-auto-rn-change-preference',
            event_action: 'Renewal preferences',
            journey_type: 'Car'
        });
        setDisplayOptOutModal(true);
    };

    const selectedOptOutReason = (event) => {
        setOptOutReasonCode(event);
        sendCustomWebAnalyticsEvent({
            event_value: helper.optOutReasonList[Number(event) - 1].label,
            event_type: 'dropdown_change',
            element_id: 'gipp-nb-auto-rn-opt-out-dropdown',
            event_action: messages.optingOutReason
        });
        if (event !== '04') {
            setIsReasonSelected(true);
            setApiFailure(false);
        } else {
            setIsReasonSelected(false);
        }
    };

    const validateOtherReason = (event) => {
        if (event === 'true') {
            setIsReasonSelected(true);
        } else {
            setIsReasonSelected(false);
        }
    };

    const mappedData = {
        element_id: 'mc-thanks-page-policy-number',
        event_action: 'Policy Number',
        event_type: 'policy-number',
        event_value: 'MC Policy Number and Order reference',
        sales_journey_type: 'multi_car',
        policy_number: getPolicyNumbersAsString(mcsubmissionVM.value.quotes),
        order_reference_number: getReferenceNumber()
    };

    if (policyEventNotSent) {
        trackEvent(mappedData);
        setPolicyEventNotSent(true);
    }

    return (
        <div>
            {paymentBreakDownData.length > 0 ? (
                <Container className="mc-thanks-page">
                    <div className="mc-thanks-page__arc-header" />
                    <Row className="mc-thanks-page__container-header">
                        <Col>
                            <Row>
                                <Col>
                                    <div className="mc-thanks-page__header-icon">
                                        <i className="fas fa-check fa-2x" />
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mc-thanks-page__header">
                                <Col className="text-center">
                                    <HDLabelRefactor Tag="h1" text={header} />
                                </Col>
                            </Row>
                            <Row className="mc-thanks-page__sub-header">
                                <Col>
                                    <HDLabelRefactor Tag="p" text={messages.subHeader} />
                                </Col>
                            </Row>
                            <Row className="mc-thanks-page__container-car-info p-3">
                                <Row className="mc-thanks-page__container-mc-ref mc-thanks-page__centered-row font-bold">
                                    <div>
                                        {messages.mcRefNumberText}
                                    </div>
                                    <div className="mc-thanks-page__mc-ref-number">
                                        {getReferenceNumber()}
                                    </div>
                                </Row>
                                {mcsubmissionVM.value.quotes.reverse().map((quote, index) => {
                                    return (
                                        <div key={`key0${index + 1}`}>
                                            <hr className="mc-thanks-page__car-info-hr-line" />
                                            <Row className="mc-thanks-page__container-single-car-info">
                                                <Col className="mc-thanks-page__container-registration">
                                                    <div className="mc-thanks-page__car-registration">
                                                        {formatRegNumber(_.get(quote, `${vehiclePath}.registrationsNumber`, 'XXXXXXX'))}
                                                    </div>
                                                    <div className="mc-thanks-page__car-model-info font-bold">
                                                        {`${_.get(
                                                            quote,
                                                            `${vehiclePath}.make`, 'XXXX XXXX'
                                                        )} ${getCarModel(_.get(
                                                            quote,
                                                            `${vehiclePath}.model`, 'XXXX XXXX'
                                                        ))}`}
                                                    </div>
                                                </Col>
                                                <Col className="text-left mc-thanks-page__centered-row mc-thanks-page__container-policy">
                                                    <div className="mc-thanks-page__car-policy-text">{messages.policyNumber}</div>
                                                    <div className="mc-thanks-page__car-policy-number">{getpolicyNumber(quote)}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    );
                                })}
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mc-thanks-page__body">
                        <Col className="mc-thanks-page__body-left">
                            <Row className="mc-thanks-page__left-header mb-3 mt-3">
                                <Col>
                                    <HDLabelRefactor Tag="h4" text={checkText} />
                                </Col>
                            </Row>
                            <Row className="mc-thanks-page__left-subheader mb-3">
                                <Col>
                                    <HDLabelRefactor Tag="h4" text={mainHeaderText} />
                                </Col>
                            </Row>
                            {
                                steps.map((step, index) => (
                                    <Row key={`${step.header}`} className="mc-thanks-page__container-left-steps mb-3">
                                        <Col>
                                            <Row className="px-3 mc-thanks-page__container-left-steps-column">
                                                <Col className="mc-thanks-page__step-number col-auto">
                                                    {index + 1}
                                                </Col>
                                                <Col className="mc-thanks-page__step-header-hint">
                                                    <Row>
                                                        <Col>
                                                            <HDLabelRefactor Tag="h5" className="mc-thanks-page__step-header" text={step.header} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className="pr-0">
                                                            <Row className="mb-3">
                                                                <Col className="col-10 col-md-auto">
                                                                    <HDLabelRefactor
                                                                        Tag="span"
                                                                        className="mc-thanks-page__step-hint"
                                                                        text={step.hint} />
                                                                    {((index + 1) === 2) && (
                                                                        <>
                                                                            <HDLabel
                                                                                webAnalyticsEvent={{ event_action: messages.confirmation }}
                                                                                id="mc-thanks-page-my-account-link"
                                                                                Tag="a"
                                                                                text={messages.myAccountText}
                                                                                className="mc-thanks-page__my-account decorated-blue-line"
                                                                                onClick={onLoginMyAccount} />
                                                                            .
                                                                        </>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                            {step.header === messages.steps[0].header && (
                                                                <Row className="mc-thanks-page__store-images">
                                                                    <Col className="pr-0">
                                                                        <img src={appleStoreImage} alt="appleStoreImage" />
                                                                    </Col>
                                                                    <Col className="pl-0">
                                                                        <img src={playStoreImage} alt="playStoreImage" />
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {index + 1 === 1 && (
                                                    <Col className="mc-thanks-page__mobile-hand-image col-auto text-right px-0">
                                                        <img src={mobileHandImage} alt="mobileHandImage" />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Col>
                                    </Row>
                                ))
                            }
                            <hr />
                            <Row className="mc-thanks-page__container-managepolicy mb-0">
                                <Col>
                                    <Row>
                                        <Col>
                                            <HDLabelRefactor Tag="h4" className="mc-thanks-page__managepolicy-header" text={messages.manageYourPolicyText} />
                                        </Col>
                                    </Row>
                                    {messages.manageYourPolicyCheckText.map((step) => {
                                        return (
                                            <Row key={`${step}`} className="mc-thanks-page__managepolicy-steps">
                                                <Col className="mc-thanks-page__step-check-icon col-auto ml-3">
                                                    <i className="fas fa-check fa-xs" />
                                                </Col>
                                                <Col className="mc-thanks-page__managepolicy-step">
                                                    <HDLabelRefactor className="font-medium" Tag="h5" text={step} />
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                    <Row className="mc-thanks-page__managepolicy-button">
                                        <Col>
                                            <HDButton
                                                className="mc-thanks-page__log-in-button theme-white"
                                                webAnalyticsEvent={{ event_action: messages.confirmation }}
                                                id="mc-thanks-page-login-button"
                                                variant="secondary"
                                                size="sm"
                                                label={messages.loginToYrAccText}
                                                onClick={onLoginMyAccount} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <HDLabelRefactor Tag="h4" className="thanks-page__renewalpreference-header" text={messages.renewalPreferenceText} />
                                        </Col>
                                    </Row>
                                    {!optOutSuccess
                                        && (
                                            <Row>
                                                <Col>
                                                    <div className="mb-3 thanks-page__renewal-preference__header">{messages.preferenceTextOne('policies')}</div>
                                                    <div className="mb-3">
                                                        {messages.preferenceTextTwo}
                                                    </div>
                                                    <div className="mb-3">
                                                        <HDLabelRefactor
                                                            Tag="a"
                                                            text={messages.changePreferenceText}
                                                            className="thanks-page__opt-out-link"
                                                            onClick={showOptOutModal}
                                                            role="button"
                                                            tabIndex={0} />

                                                    </div>
                                                    <div className="mb-3">{messages.preferenceTextThree}</div>
                                                    <div className="mb-3">
                                                        {messages.preferenceTextFour}
                                                    </div>
                                                    <div className="mb-3">
                                                        {messages.preferenceTextFive}
                                                        <HDLabelRefactor
                                                            Tag="a"
                                                            text={messages.appText}
                                                            className="thanks-page__my-account"
                                                            onClick={redirectToMobileApp}
                                                            onKeyDown={redirectToMobileApp}
                                                            role="button"
                                                            tabIndex={0} />
                                                        {messages.orText}
                                                        <HDLabelRefactor
                                                            Tag="a"
                                                            text={messages.myAccountText}
                                                            className="thanks-page__my-account"
                                                            onClick={onLoginMyAccount}
                                                            onKeyDown={onLoginMyAccount}
                                                            role="button"
                                                            tabIndex={0} />
                                                    </div>
                                                </Col>

                                            </Row>
                                        )}
                                    {optOutSuccess && (
                                        <Row>
                                            <Col>
                                                <div className="mb-3 thanks-page__renewal-preference__header">
                                                    {messages.optoutRenewalPreferenceText(messages.policiesText, messages.theirText)}
                                                </div>
                                                <div className="mb-3">{messages.optoutRenewalPreferenceTextone}</div>
                                                <div className="mb-3">
                                                    <HDLabelRefactor
                                                        Tag="a"
                                                        text={messages.myAccountLinkText}
                                                        className="thanks-page__my-account"
                                                        onClick={onLoginMyAccount}
                                                        onKeyDown={onLoginMyAccount}
                                                        role="button"
                                                        tabIndex={0} />
                                                </div>

                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                        <Col className="mc-thanks-page__body-right mc-thanks-page__body-right-payment-breakdown mt-5 mt-md-0 px-0">
                            <HDPaymentBreakdown title={messages.paymentBreakTitle} steps={paymentBreakDownData} />
                        </Col>
                    </Row>

                    <HDModal
                        id="renewal-preference-overlay"
                        className="renewal__preference-overlay"
                        show={displayOptOutModal}
                        headerText={messages.preferenceHeader}
                        confirmLabel="Confirm"
                        onConfirm={confirmOptOut}
                        onClose={closeOptOut}
                        onCancel={cancelOptOut}
                        customStyle={messages.wide}
                        disableConfirm={!isReasonSelected}
                    >
                        <HDRenewalPreference
                            apiFailure={apiFailure}
                            onOptOutReasonSelect={selectedOptOutReason}
                            otherReasonValidated={validateOtherReason}
                            isMultiCar
                            headerText={messages.policiesText} />
                    </HDModal>
                    {HDToast}
                    {HDFullscreenLoader}

                </Container>
            ) : null}
        </div>
    );
};

HDMCThanksPage.propTypes = {
    toggleContinueElement: PropTypes.func,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object,
    }).isRequired,
    mcPaymentScheduleObject: PropTypes.shape([]).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object,
    }).isRequired
};

HDMCThanksPage.defaultProps = {
    toggleContinueElement: () => { },
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        mcPaymentScheduleObject: state.mcPaymentScheduleModel.mcPaymentScheduleObject,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM
    };
};

export default connect(mapStateToProps)(HDMCThanksPage);
