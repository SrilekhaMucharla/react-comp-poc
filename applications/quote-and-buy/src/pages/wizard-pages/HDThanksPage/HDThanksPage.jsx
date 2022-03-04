import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { HDLabelRefactor, HDPaymentBreakdown, HDModal } from 'hastings-components';
import { deployment } from 'app-config';
import {
    HastingsRenewalOptionService,
} from 'hastings-capability-renewaloptions';
import {
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import {
    setNavigation
} from '../../../redux-thunk/actions';
import * as messages from './HDThanksPage.messages';

import { getYearlyPaymentBreakDownData, getMonthlyPaymentBreakDownData } from './PaymentBreakDownData';
import getCarName from '../../../common/getCarName';
// import './HDThanksPage.scss';
import appleStoreImage from '../../../assets/images/background/static-apple-store-download-button.svg';
import playStoreImage from '../../../assets/images/background/static-google-play-download-button.svg';
import mobileHandImage from '../../../assets/images/background/static-mobile-hands-001.jpg';
import youDriveTabKeyImage from '../../../assets/images/background/static-youdrive-tab-keyfob-001.png';
import youDriveTabBackgroundImage from '../../../assets/images/background/yd_banner_dt.png';
import formatRegNumber from '../../../common/formatRegNumber';
import arcTop from '../../../assets/images/background/top-arc.svg';
import HDRenewalPreference from '../HDRenewalPreferenceOverlay/HDRenewalPreferenceOverlay';
import useToast from '../../Controls/Toast/useToast';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { trackEvent } from '../../../web-analytics/trackData';
import * as helper from '../HDRenewalPreferenceOverlay/HDRenewalPreferenceHelper';
import customEventTracking from '../../../web-analytics/customEventTracking';

const PAYMENT_TYPE_YEARLY = '1';

const HDThanksPage = ({ toggleContinueElement, pageMetadata }) => {
    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const offeredQuotes = useSelector((state) => state.offeredQuoteModel.offeredQuotes);
    const policyNumber = useSelector((state) => {
        if (state.wizardState.data.submissionVM.bindData.policyNumber.value) return state.wizardState.data.submissionVM.bindData.policyNumber.value;
        return '';// update this code once policyNumber is integrated with bind data
    });
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader(0);
    const prefPaymentDay = useSelector((state) => state.wizardState.app.paymentDay);
    const periodStartDate = useSelector((state) => state.wizardState.data.submissionVM.baseData.periodStartDate.value);
    const periodEndDate = useSelector((state) => state.wizardState.data.submissionVM.baseData.periodEndDate.value);
    const insurancePaymentType = useSelector((state) => state.wizardState.data.customizeSubmissionVM.value.insurancePaymentType);
    const elevenMonthAmount = useSelector((state) => {
        if (state.wizardState.data.customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment) {
            return state.wizardState.data.customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount;
        }
        return '';
    });
    const yearlyAmount = useSelector((state) => {
        return state.wizardState.data.customizeSubmissionVM.value.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
    });
    const initialPaymentAmount = useSelector((state) => {
        if (state.wizardState.data.customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment) {
            return state.wizardState.data.customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.firstInstalment.amount;
        }
        return '';
    });
    const scPaymentScheduleData = useSelector((state) => state.wizardState.app.scPaymentSchedule);
    const [carName, setCarName] = useState('MERCEDES-BENZ');
    const [displayOptOutModal, setDisplayOptOutModal] = useState(false);
    const [optOutSuccess, setOptOutSuccess] = useState(false);
    const [isReasonSelected, setIsReasonSelected] = useState(false);
    const [HDToast, addToast] = useToast();
    const [optOutReasonCode, setOptOutReasonCode] = useState('');
    const [apiFailure, setApiFailure] = useState(false);
    const { make, registrationsNumber, model } = vehicle;
    const { branchCode } = offeredQuotes[0];
    const { branchName } = offeredQuotes[0];
    const periodStartDay = periodStartDate.day;
    const quoteID = useSelector((state) => state.wizardState.data.customizeSubmissionVM.value.quoteID);
    const sessionUUID = useSelector((state) => state.wizardState.data.customizeSubmissionVM.value.sessionUUID);
    const dispatch = useDispatch();
    let prefStartDate = '';
    // set the preferred monthly payment
    if (prefPaymentDay && scPaymentScheduleData) {
        if (scPaymentScheduleData.length > 1) {
            scPaymentScheduleData.forEach((paymentShedule, index) => {
                if (index === 1) {
                    prefStartDate = `${paymentShedule.paymentDate.day}/${paymentShedule.paymentDate.month + 1}/${paymentShedule.paymentDate.year}`;
                }
            });
        } else {
            // in case of error, show the inception date as preferred payment data.
            prefStartDate = `${periodStartDay}/${periodStartDate.month + 1}/${periodStartDate.year}`;
        }
    }
    let header = '';
    let steps = [];
    let checkText = '';
    let mainHeaderText = '';
    if (branchCode && branchCode === 'YD') {
        header = messages.youDriveHeader;
        steps = messages.youDriveSteps;
        checkText = messages.youDriveCheckText;
        mainHeaderText = messages.youDriveMainHeaderText;
    } else {
        header = messages.topHeader;
        steps = [...messages.steps];
        checkText = messages.documentCheckText;
        mainHeaderText = messages.stepsMainHeaderText;
    }

    const paymentBreakDownData = insurancePaymentType === PAYMENT_TYPE_YEARLY
        ? getYearlyPaymentBreakDownData(yearlyAmount, periodStartDate, periodEndDate, formatRegNumber(registrationsNumber), pageMetadata)
        : getMonthlyPaymentBreakDownData(
            initialPaymentAmount, elevenMonthAmount, periodStartDate, periodEndDate, prefStartDate, formatRegNumber(registrationsNumber), pageMetadata
        );
    useEffect(() => {
        toggleContinueElement(false);
        const carMakeModel = getCarName(make, model);
        setCarName(carMakeModel);
        dispatch(setNavigation({
            showHidePromotionalPage: false
        }));
    }, [toggleContinueElement, carName]);

    const parseUrl = (url) => {
        const urlOut = new URL(url);
        return `${urlOut.protocol}//${urlOut.host}`;
    };

    const targetUrl = parseUrl(deployment.url);

    const onLoginMyAccount = () => {
        window.open(`${targetUrl}${messages.myAccountLoginLink}`, '_blank');
    };

    const redirectToMobileApp = () => {
        window.open(`${messages.appLoginLink}`, '_blank');
    };

    const sendCustomWebAnalyticsEvent = (args) => {
        customEventTracking({
            ...args,
            customer_id: policyNumber,
            insurance_product: branchCode,
            product_option: branchName,
            product_option_code: branchCode,
            sales_journey_type: 'single_car',
            event_category: 'NEWBUS Car',
            journey_type: 'Car'
        });
    };

    const confirmOptOut = () => {
        const data = {
            sessionUUID: sessionUUID,
            policyNumber: policyNumber,
            foreignID: quoteID,
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
            event_action: 'Renewal preferences'
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

    return (
        <Container className="thanks-page">
            <div className="arc-header">
                <img className="arc-header_arc" alt="arc-header" src={arcTop} />
            </div>
            <Row className="mx-0">
                <Col className="thanks-page__container-header">
                    <Row className="thanks-page__header-icon">
                        <Col>
                            <i className="fas fa-check fa-2x" />
                        </Col>
                    </Row>
                    <Row className="thanks-page__header">
                        <Col>
                            <HDLabelRefactor Tag="h1" text={header} />
                        </Col>
                    </Row>
                    <Row className="thanks-page__sub-header">
                        <Col>
                            <HDLabelRefactor Tag="h5" text={messages.subHeader} />
                        </Col>
                    </Row>
                    <Row className="thanks-page__container-car-info p-3">
                        <Col className="thanks-page__container-registration">
                            <Row className="thanks-page__container-registration-policy-text">
                                <Col>
                                    <div className="thanks-page__car-registration">{registrationsNumber && formatRegNumber(registrationsNumber)}</div>
                                </Col>
                                <Col className="pl-0">
                                    <div className="ml-3 thanks-page__car-policy-text">{messages.policyNumber}</div>
                                </Col>
                            </Row>
                            <Row className="thanks-page__container-registration-car-model-policy-number">
                                <Col className="pr-0">
                                    <div className="thanks-page__car-modal-info">
                                        {carName && carName}
                                    </div>
                                </Col>
                                <Col>
                                    <div className="ml-3 thanks-page__car-policy-number">{`XA${policyNumber}`}</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="thanks-page__body mx-0">
                <Col className="thanks-page__body-left">
                    {branchCode && branchCode === 'YD' && (
                        <Row className="thanks-page__you-drive-logo-container">
                            <Col>
                                <img className="thanks-page__you-drive-logo" src={youDriveTabBackgroundImage} alt="youDriveTabBackgroundImage" />
                            </Col>
                        </Row>
                    )}
                    <Row className="thanks-page__body-left__header mb-3">
                        <Col>
                            <HDLabelRefactor Tag="h4" text={checkText} />
                        </Col>
                    </Row>
                    <Row className="thanks-page__left-subheader mb-3">
                        <Col>
                            <HDLabelRefactor Tag="h4" text={mainHeaderText} />
                        </Col>
                    </Row>
                    {
                        steps.map((step, index) => (
                            <Row key={`${step.header}`} className="thanks-page__container-left-steps mb-3">
                                <Col>
                                    <Row className="px-3 thanks-page__container-left-steps-column">
                                        <Col sm={1} className="px-0">
                                            <div className="thanks-page__step-number">
                                                {index + 1}
                                            </div>
                                        </Col>
                                        <Col className="thanks-page__step-header-hint">
                                            <Row>
                                                <Col>
                                                    <HDLabelRefactor Tag="h5" className="thanks-page__step-header" text={step.header} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="pr-0">
                                                    <Row className="mb-3">
                                                        <Col>
                                                            <HDLabelRefactor
                                                                Tag="span"
                                                                className="thanks-page__step-hint"
                                                                text={step.hint} />
                                                            {branchCode && branchCode !== 'YD' && ((index + 1) === 2)
                                                            && (
                                                                <>
                                                                    <HDLabelRefactor
                                                                        Tag="a"
                                                                        text={messages.myAccountText}
                                                                        className="thanks-page__my-account"
                                                                        onClick={onLoginMyAccount}
                                                                        onKeyDown={onLoginMyAccount}
                                                                        role="button"
                                                                        tabIndex={0} />
                                                                    .
                                                                </>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    {step.header === messages.steps[0].header && (
                                                        <Row className="thanks-page__store-images">
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
                                        {branchCode && branchCode !== 'YD' && index + 1 === 1 && (
                                            <Col sm={12} md={4} className="thanks-page__mobile-hand-image text-right px-0">
                                                <img src={mobileHandImage} alt="mobileHandImage" />
                                            </Col>
                                        )}
                                        {branchCode && branchCode === 'YD' && index + 1 === 4 && (
                                            <Col sm={12} md={4} className="thanks-page__youdrivetabkey-image text-right">
                                                <img src={youDriveTabKeyImage} alt="youDriveTabKeyImage" />
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        ))
                    }
                    <Row>
                        <Col className="px-0">
                            <Row>
                                <Col className="px-0 thanks-page__container-left-steps-line">
                                    <hr />
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    <Row className="thanks-page__container-managepolicy mb-0">
                        <Col>
                            <Row>
                                <Col>
                                    <HDLabelRefactor Tag="h4" className="thanks-page__managepolicy-header" text={messages.manageYourPolicyText} />
                                </Col>
                            </Row>
                            {messages.manageYourPolicyCheckText.map((step) => {
                                return (
                                    <Row key={`${step}`} className="thanks-page__managepolicy-steps">
                                        <Col className="thanks-page__step-check-icon col-auto ml-3">
                                            <i className="fas fa-check fa-xs" />
                                        </Col>
                                        <Col className="thanks-page__managepolicy-step">
                                            <HDLabelRefactor className="font-medium" Tag="h5" text={step} />
                                        </Col>
                                    </Row>
                                );
                            })}
                            <Row className="thanks-page__managepolicy-button">
                                <Col>
                                    <HDButton
                                        className="thanks-page__log-in-button theme-white"
                                        webAnalyticsEvent={{ event_action: messages.confirmation }}
                                        id="login-button"
                                        variant="primary"
                                        size="sm"
                                        label={messages.loginToYrAccText}
                                        onClick={onLoginMyAccount} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-0">
                            <Row>
                                <Col className="px-0 thanks-page__container-left-steps-line">
                                    <hr />
                                </Col>

                            </Row>
                        </Col>
                    </Row>
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
                                     <div className="mb-3 thanks-page__renewal-preference__header">{messages.preferenceTextOne('policy')}</div>
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
                                            {messages.optoutRenewalPreferenceText(messages.policyText, messages.yourText)}
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
                            ) }
                            <Row />
                        </Col>
                    </Row>
                </Col>
                <Col className="thanks-page__body-right thanks-page__body-right-payment-breakdown mt-5 mt-md-0 px-0">
                    <HDPaymentBreakdown
                        title={(
                            <div className="thanks-page__body-right__header">{messages.paymentBreakTitle}</div>
                        )}
                        steps={paymentBreakDownData} />
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
                    isMultiCar={false}
                    headerText={messages.policyText} />
            </HDModal>
            {HDToast}
            {HDFullscreenLoader}
        </Container>
    );
};

HDThanksPage.propTypes = {
    toggleContinueElement: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

HDThanksPage.defaultProps = {
    toggleContinueElement: () => { },
};

export default HDThanksPage;
