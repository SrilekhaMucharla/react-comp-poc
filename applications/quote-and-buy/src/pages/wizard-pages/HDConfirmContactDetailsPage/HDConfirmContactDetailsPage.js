/* eslint-disable max-len */
import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    HDForm,
    HDInfoCardRefactor,
    HDLabelRefactor,
    yup
} from 'hastings-components';
import _ from 'lodash';
import { Container, Col, Row } from 'react-bootstrap';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDButton as HDButton,
    AnalyticsHDCheckbox as HDCheckbox,
    AnalyticsHDModal as HDModal,

} from '../../../web-analytics';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import * as messages from './HDConfirmContactDetailsPage.messages';
import InfoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
// import './HDConfirmContactDetailsPage.scss';
import {
    setNavigation as setNavigationAction,
    updateMarketingPreference,
    setOfferedQuotesDetails,
    setSubmissionVM,
    clearMarketingPreference,
    updateEmailSaveProgress as updateEmailSaveProgressAction,
} from '../../../redux-thunk/actions';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../__helpers__/policyErrorCheck';
import {
    HOMEPAGE
} from '../../../constant/const';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';


const HDConfirmContactDetailsPage = (props) => {
    // eslint-disable-next-line react/prop-types
    const {
        submissionVM,
        customizeSubmissionVM,
        dispatch,
        updateMarketingPreferencesData,
        onMarketingPreferencesSuccess,
        onGoBack,
        updateEmailSaveProgress,
        pageMetadata
    } = props;

    // disable parent continue button
    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const translator = useContext(TranslatorContext);


    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [disabledContinue, setDisabledContinue] = useState(false);

    const blackEmailsList = ['unknown@unknown.com', 'nospam@thevaninsurer.co.uk', 'nospam@thebikeinsurer.co.uk'];
    const accountHolder = 'baseData.accountHolder';
    const emailField = 'emailAddress1';
    const mobileField = 'cellNumber';
    const driverEmailPath = `${accountHolder}.${emailField}`;
    const driverMobilePath = `${accountHolder}.${mobileField}`;

    const emailFieldName = 'allowEmail';
    const emailPath = `baseData.marketingContacts.${emailFieldName}`;
    const phoneFieldName = 'allowTelephone';
    const phonePath = `baseData.marketingContacts.${phoneFieldName}`;
    const textFieldName = 'allowSMS';
    const textPath = `baseData.marketingContacts.${textFieldName}`;
    const postFieldName = 'allowPost';
    const postPath = `baseData.marketingContacts.${postFieldName}`;
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);

    const validationSchema = yup.object({
        [emailField]: yup.string()
            .required(messages.requiredField)
            .test('blackList', messages.invalidInputMessage, (emailAddress1) => !(blackEmailsList.includes(emailAddress1)))
            .email(messages.invalidInputMessage)
            .VMValidation(driverEmailPath, messages.invalidInputMessage, submissionVM),
        [mobileField]: yup.string()
            .required(messages.requiredField)
            .matches(/^[0-9]*$/, messages.invalidInputMessage)
            .min(10, messages.mobileNumberTooShort)
            .notMobileNumber(messages.provideMobileNumber)
            .max(11, messages.invalidInputMessage)
            .mobileNumber(messages.invalidInputMessage)
            .VMValidation(driverMobilePath, messages.invalidInputMessage, submissionVM),
        [emailFieldName]: yup.bool()
            .VMValidation(emailPath, null, submissionVM),
        [phoneFieldName]: yup.bool()
            .VMValidation(phonePath, null, submissionVM),
        [textFieldName]: yup.bool()
            .VMValidation(textPath, null, submissionVM),
        [postFieldName]: yup.bool()
            .VMValidation(postPath, null, submissionVM),
    });

    const handleValidation = (isValid) => {
        dispatch(
            setNavigationAction({ canForward: isValid })
        );
        setDisabledContinue(!isValid);
    };

    // api trigger
    const handleContinueTriggerButton = () => {
        setAPITriggerPoint(true);
        showLoader(true);
        dispatch(updateMarketingPreference(submissionVM, translator));
    };

    const getChosenQuote = () => {
        const chosenQuoteID = _.get(submissionVM, 'value.bindData.chosenQuote', null);
        return submissionVM.value.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
    };

    // data update: offered quote and submissionVM
    useEffect(() => {
        if (aPITriggerPoint && !_.isEmpty(updateMarketingPreferencesData.marketingUpdatedObj)) {
            hideLoader();
            _.set(submissionVM, 'value', updateMarketingPreferencesData.marketingUpdatedObj);
            const chosenQuote = getChosenQuote();
            if (chosenQuote && chosenQuote.publicID) {
                _.set(customizeSubmissionVM, 'value.quote', chosenQuote);
            }
            dispatch(setSubmissionVM({ submissionVM: submissionVM }));
            const customQuoteObject = [_.get(customizeSubmissionVM, 'value.quote', {})];
            const hasCustomQuoteErrors = isUWErrorPresent(customQuoteObject)
            || isGrayListErrorPresent(customQuoteObject)
            || isCueErrorPresent(customQuoteObject);
            if (hasCustomQuoteErrors) {
                setShowDeclineQuote(true);
                return;
            }
        }
        if (aPITriggerPoint && !_.isEmpty(updateMarketingPreferencesData.marketingUpdatedObj)) {
            onMarketingPreferencesSuccess();
        }
        const marketingPreferencesFailureObj = _.get(updateMarketingPreferencesData, 'marketingUpdatedError.error');
        if (marketingPreferencesFailureObj) {
            hideLoader();
            // TODO: error handeling for marketing Preferences Failure api call
        }
    }, [updateMarketingPreferencesData]);

    // clear marketing preferences
    useEffect(() => {
        dispatch(clearMarketingPreference());
    }, []);

    const updateEmail = ({
        touched,
        errors,
        values
    }) => {
        if (!!touched[emailField] && !errors[emailField]) {
            dispatch(updateEmailSaveProgress(values[emailField]));
        }
    };

    const tooltipOverlayEmail = () => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDEmailAddText} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDEmailAddText} Info` }}
            id="email-info-overlay"
            overlayButtonIcon={<img src={InfoCircleBlue} alt="info_circle" />}
            labelText={messages.CCDEmailAddText}
        >
            <div>
                <p>{messages.CCDEmailAddOverlayText}</p>
            </div>
        </HDOverlayPopup>
    );

    const tooltipOverlayMobile = () => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDMobileNumText} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDMobileNumText} Info` }}
            id="mobile-number-info-overlay"
            overlayButtonIcon={<img src={InfoCircleBlue} alt="info_circle" />}
            labelText={messages.CCDMobileText}
        >
            <div>
                <p>{messages.CCDMobileOverlayText}</p>
            </div>
        </HDOverlayPopup>
    );

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    return (
        <div className="confirm-contact-details__background">
            <Container className="confirm-contact-details__container">
                <Row className="confirm-contact-details__main-row">
                    <Col xs={{ span: 12, offset: 0 }} md={{ span: 7, offset: 3 }}>
                        <Row>
                            <Col>
                                <BackNavigation
                                    id="backNavMainWizard"
                                    className="confirm-contact-details__back-button"
                                    onClick={onGoBack}
                                    onKeyPress={onGoBack} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    Tag="h2"
                                    className="confirm-contact-details__header"
                                    text={messages.CCDTitle} />
                            </Col>
                        </Row>
                        <HDForm
                            submissionVM={submissionVM}
                            validationSchema={validationSchema}
                            onValidation={handleValidation}
                        >
                            {(hdProps) => {
                                updateEmail(hdProps);
                                return (
                                    <>
                                        <Row className="confirm-contact-details__form-field-container mb-2">
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="p"
                                                    text={messages.CCDEmailAddText}
                                                    icon={tooltipOverlayEmail()}
                                                    iconPosition="r"
                                                    id="confirm-contact-details-label-email"
                                                    className="confirm-contact-details__label-text" />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__input-container">
                                            <Col>
                                                <HDTextInput
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails}`, event_value: messages.CCDEmailAddText }}
                                                    id="email-input"
                                                    placeholder={messages.CCDEmailPlaceholder}
                                                    name={emailField}
                                                    path={driverEmailPath}
                                                    size="sm"
                                                    tickIcon={!!hdProps.values[emailField] && !hdProps.errors[emailField]}
                                                    inputMode="email" />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__info-tip-container mb-4">
                                            <Col>
                                                <HDInfoCardRefactor
                                                    id="email-info-card"
                                                    className="confirm-contact-details__info-card-email"
                                                    image={tipCirclePurple}
                                                    paragraphs={[messages.CCDEmailHintText]} />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__label-container mb-2">
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="p"
                                                    text={messages.CCDMobileNumText}
                                                    icon={tooltipOverlayMobile()}
                                                    iconPosition="r"
                                                    id="confirm-contact-details-label-mobile"
                                                    className="confirm-contact-details__label-text" />

                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__input-container">
                                            <Col>
                                                <HDTextInput
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails}`, event_value: messages.CCDMobileNumText }}
                                                    id="mobile-input"
                                                    placeholder={messages.CCDMobilePlaceholder}
                                                    name={mobileField}
                                                    path={driverMobilePath}
                                                    size="sm"
                                                    type="phone"
                                                    inputMode="numeric"
                                                    tickIcon={!!hdProps.values[mobileField] && !hdProps.errors[mobileField]}
                                                    maxLength="11" />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__info-tip-container mb-5">
                                            <Col>
                                                <HDInfoCardRefactor
                                                    id="confirm-contact-details"
                                                    className="confirm-contact-details__info-card-mobile"
                                                    image={tipCirclePurple}
                                                    paragraphs={[messages.CCDMobileHintText]} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row className="confirm-contact-details__your-pref-lable-text">
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="h2"
                                                    text={messages.CCDYourPreText}
                                                    size="lg" />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__your-pref-lable-text-msg mb-1">
                                            <Col>
                                                <p>{messages.CCDYourPreTextMsg}</p>
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__label-container">
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="p"
                                                    className="confirm-contact-details__label-text"
                                                    text={messages.CCDBestWayContactText} />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__button-container">
                                            <Col>
                                                <HDCheckbox
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDEmailText}` }}
                                                    id="confirm-contact-details-email-checkbox"
                                                    path={emailPath}
                                                    name={emailFieldName}
                                                    text={messages.CCDEmailText}
                                                    // empty label to maintain proper distance between buttons, do not remove
                                                    label={{ text: ' ' }} />
                                            </Col>
                                            <Col>
                                                <HDCheckbox
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDPhoneText}` }}
                                                    id="confirm-contact-details-phone-checkbox"
                                                    path={phonePath}
                                                    name={phoneFieldName}
                                                    text={messages.CCDPhoneText}
                                                    // empty label to maintain proper distance between buttons, do not remove
                                                    label={{ text: ' ' }} />
                                            </Col>
                                            <Col>
                                                <HDCheckbox
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDTextText}` }}
                                                    id="confirm-contact-details-text-checkbox"
                                                    path={textPath}
                                                    name={textFieldName}
                                                    text={messages.CCDTextText}
                                                    // empty label to maintain proper distance between buttons, do not remove
                                                    label={{ text: ' ' }} />
                                            </Col>
                                            <Col>
                                                <HDCheckbox
                                                    webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.confirmContactDetails} - ${messages.CCDPostText}` }}
                                                    id="confirm-contact-details-post-checkbox"
                                                    path={postPath}
                                                    name={postFieldName}
                                                    text={messages.CCDPostText}
                                                    // empty label to maintain proper distance between buttons, do not remove
                                                    label={{ text: ' ' }} />
                                            </Col>
                                        </Row>
                                        <Row className="confirm-contact-details__form-field-container">
                                            <Col className="confirm-contact-details__info-tip-container confirm-contact-details__ccdOptOutHint">
                                                <HDInfoCardRefactor
                                                    id="confirm-contact-details-info-card-opt-out"
                                                    className="confirm-contact-details__info-card-opt-out"
                                                    image={tipCirclePurple}
                                                    paragraphs={[messages.CCDOptOutHintMsg]} />
                                            </Col>
                                        </Row>
                                    </>
                                );
                            }}
                        </HDForm>
                        <Row className="confirm-contact-details__inner-navigation mb-5">
                            <Col>
                                <HDButton
                                    id="continue-to-payment-button"
                                    webAnalyticsEvent={{ event_action: `Continue - Redirecting from ${pageMetadata.page_name}` }}
                                    size="lg"
                                    label={messages.continueToPayment}
                                    disabled={disabledContinue}
                                    onClick={handleContinueTriggerButton} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <HDModal
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
                {HDFullscreenLoader}
            </Container>
        </div>
    );
};

HDConfirmContactDetailsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired, value: PropTypes.object }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    toggleContinueElement: PropTypes.func,
    onMarketingPreferencesSuccess: PropTypes.func,
    updateMarketingPreferencesData: PropTypes.shape({
        marketingUpdatedObj: PropTypes.shape({
            quoteData: PropTypes.shape({
                offeredQuotes: PropTypes.shape({})
            }),
            baseData: PropTypes.shape({
                brandCode: PropTypes.string
            })
        })
    }).isRequired,
    dispatch: PropTypes.shape({}),
    onGoBack: PropTypes.func,
    updateEmailSaveProgress: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

HDConfirmContactDetailsPage.defaultProps = {
    toggleContinueElement: () => {},
    onMarketingPreferencesSuccess: () => {},
    updateEmailSaveProgress: () => {},
    onGoBack: () => { },
    dispatch: null,
    customizeSubmissionVM: null,
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        updateMarketingPreferencesData: state.updateMarketingPreferencesModel,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateMarketingPreference,
    setOfferedQuotesDetails,
    setSubmissionVM,
    clearMarketingPreference,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(HDConfirmContactDetailsPage);
