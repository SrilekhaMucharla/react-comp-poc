/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Row, Container } from 'react-bootstrap';
import _ from 'lodash';
import classNames from 'classnames';
import {
    HDForm,
    HDLabelRefactor,
    HDInfoCardRefactor,
    yup
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInputRefactor,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDCheckbox as HDCheckbox,
    AnalyticsHDModal as HDModal
} from '../../../web-analytics';
import {
    setNavigation as setNavigationAction,
    updateEmailSaveProgress as updateEmailSaveProgressAction
} from '../../../redux-thunk/actions';
import TipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import * as messages from './HDMCConfirmContactDetailsPage.messages';
import useScrollToTop from '../../../routes/common/useScrollToTop';
import InfoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage/HDQuoteDeclinePage';
import {
    HOMEPAGE
} from '../../../constant/const';


const HDMCConfirmContactDetailsPage = (props) => {
    const {
        dispatch,
        mcsubmissionVM,
        currentCCDIndex,
        updateEmailSaveProgress,
        checkbuttonDisabled,
        pageMetadata,
        toggleContinueElement,
        parentContinue,
        getCCDLabel,
        onGoBack,
        setapiFlag,
        showDeclineQuote
    } = props;
    const blackEmailsList = ['unknown@unknown.com', 'nospam@thevaninsurer.co.uk', 'nospam@thebikeinsurer.co.uk'];
    const driverPath = 'lobData.privateCar.coverables.drivers.children';
    const mobileField = 'cellNumber';
    const driversData = 'lobData.privateCar.coverables.drivers';
    const policyHolderEmail = 'emailAddress1';
    const emailFieldName = 'allowEmail';
    const emailPath = `baseData.marketingContacts.${emailFieldName}`;
    const phoneFieldName = 'allowTelephone';
    const phonePath = `baseData.marketingContacts.${phoneFieldName}`;
    const textFieldName = 'allowSMS';
    const textPath = `baseData.marketingContacts.${textFieldName}`;
    const postFieldName = 'allowPost';
    const postPath = `baseData.marketingContacts.${postFieldName}`;

    const [disabledContinue, setDisabledContinue] = useState(false);

    useScrollToTop(currentCCDIndex);
    const getSingleSubmissionVM = () => {
        if (mcsubmissionVM.quotes) {
            if (currentCCDIndex === 0) {
                return mcsubmissionVM.quotes.children[0];
            }
            return mcsubmissionVM.quotes.children[currentCCDIndex];
        }
        return {};
    };

    const getemailPath = () => {
        if (mcsubmissionVM.quotes) {
            const driversList = _.get(mcsubmissionVM.quotes.children[currentCCDIndex], driversData);
            let idx = 0;
            driversList.value.forEach((element, index) => {
                if (currentCCDIndex === 0 && element.person && element.person.accountHolder) {
                    idx = index;
                } else if (currentCCDIndex > 0 && element.isPolicyHolder) {
                    idx = index;
                }
            });
            return `${driverPath}.${idx}.person.emailAddress1`;
        }
        return '';
    };

    const getmobilePath = () => {
        if (mcsubmissionVM.quotes) {
            const driversList = _.get(mcsubmissionVM.quotes.children[currentCCDIndex], driversData);
            let idx = 0;
            driversList.value.forEach((element, index) => {
                if (currentCCDIndex === 0 && element.person && element.person.accountHolder) {
                    idx = index;
                } else if (currentCCDIndex > 0 && element.isPolicyHolder) {
                    idx = index;
                }
            });
            return `${driverPath}.${idx}.person.cellNumber`;
        }
        return '';
    };

    const getpreferenceemailPath = (type) => {
        switch (type) {
            case 'email':
                return emailPath;
            case 'phone':
                return phonePath;
            case 'text':
                return textPath;
            case 'post':
                return postPath;

            default:
                return '';
        }
    };


    const parentValidationSchema = yup.object({
        [policyHolderEmail]: yup.string()
            .required(messages.requiredField)
            .test('blackList', messages.invalidInputMessage, (emailAddress1) => !(blackEmailsList.includes(emailAddress1)))
            .email(messages.invalidInputMessage)
            .VMValidation(getemailPath(), messages.invalidInputMessage, getSingleSubmissionVM()),
        [mobileField]: yup.string()
            .required(messages.requiredField)
            .matches(/^[0-9]*$/, messages.invalidInputMessage)
            .min(10, messages.mobileNumberTooShort)
            .notMobileNumber(messages.provideMobileNumber)
            .max(11, messages.invalidInputMessage)
            .mobileNumber(messages.invalidInputMessage)
            .VMValidation(getmobilePath(), messages.invalidInputMessage, getSingleSubmissionVM()),
        [emailFieldName]: yup.bool()
            .VMValidation(getpreferenceemailPath('email'), null, getSingleSubmissionVM()),
        [phoneFieldName]: yup.bool()
            .VMValidation(getpreferenceemailPath('phone'), null, getSingleSubmissionVM()),
        [textFieldName]: yup.bool()
            .VMValidation(getpreferenceemailPath('text'), null, getSingleSubmissionVM()),
        [postFieldName]: yup.bool()
            .VMValidation(getpreferenceemailPath('post'), null, getSingleSubmissionVM()),
    });

    const childValidationSchema = yup.object({
        [policyHolderEmail]: yup.string()
            .required(messages.requiredField)
            .test('blackList', messages.invalidInputMessage, (emailAddress1) => !(blackEmailsList.includes(emailAddress1)))
            .email(messages.invalidInputMessage)
            .VMValidation(getemailPath(), messages.invalidInputMessage, getSingleSubmissionVM()),
        [mobileField]: yup.string()
            .required(messages.requiredField)
            .matches(/^[0-9]*$/, messages.invalidInputMessage)
            .min(10, messages.mobileNumberTooShort)
            .notMobileNumber(messages.provideMobileNumber)
            .max(11, messages.invalidInputMessage)
            .mobileNumber(messages.invalidInputMessage)
            .VMValidation(getmobilePath(), messages.invalidInputMessage, getSingleSubmissionVM()),
    });

    const handleValidation = (isValid) => {
        checkbuttonDisabled(isValid);
        setDisabledContinue(!isValid);
    };

    const updateEmail = ({
        touched,
        errors,
        values
    }) => {
        if (!!touched[policyHolderEmail] && !errors[policyHolderEmail]) {
            const submissionVM = getSingleSubmissionVM();
            const accountHolder = _.get(submissionVM, `${driverPath}[0].person.accountHolder.value`);
            if (accountHolder) {
                dispatch(updateEmailSaveProgress(values[policyHolderEmail]));
            }
        }
    };

    const getpolicyholderName = () => {
        const driversList = _.get(mcsubmissionVM.quotes.children[currentCCDIndex], driversData);
        let dpName = '';
        driversList.value.forEach((element) => {
            if (element.isPolicyHolder) {
                dpName = element.displayName;
            }
        });
        return messages.MCCPolicyHolderHeadText(dpName);
    };

    useEffect(() => {
        toggleContinueElement(false);
    }, [props]);

    const tooltipOverlay = (id, type) => {
        const labelText = type === messages.MCCCDEmailText ? messages.MCCCDEmailAddressText : messages.MCCCDPhoneText;
        return (
            <HDOverlayPopup
                webAnalyticsView={{ ...pageMetadata, page_section: labelText }}
                webAnalyticsEvent={{ event_action: labelText }}
                id={id}
                labelText={labelText}
                overlayButtonIcon={<img src={InfoCircleBlue} alt="info-circle" />}
            >
                {type === messages.MCCCDEmailText && (
                    <>
                        <p>{((currentCCDIndex === 0) ? messages.MCCDAHEmailFirstPara : messages.MCCDAHEmailParaPH)}</p>
                        <p>{((currentCCDIndex === 0) ? messages.MCCDAHEmailSecondPara : '')}</p>
                    </>
                )}
                {type === messages.MCCCDMobileText && (
                    <>
                        <p>{messages.MCCDAHPhoneFirstPara}</p>
                        <p>{messages.MCCDAHPhoneSecondPara}</p>
                    </>
                )}
            </HDOverlayPopup>
        );
    };

    const continueBtnClassNames = classNames(
        { 'margin-top-lg-lg': currentCCDIndex > 0 },
        { 'margin-top-lg': currentCCDIndex === 0 }
    );

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    return (
        <div className="confirm-contact-details__background">
            <Container className="confirm-contact-details__container">
                <Row>
                    <Col xs={12} md={{ span: 7, offset: 3 }}>
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
                                    className="margin-bottom-md"
                                    text={currentCCDIndex === 0 ? messages.MCCCDTitle : getpolicyholderName()} />
                            </Col>
                        </Row>
                        <HDForm
                            key={`MCCCD${currentCCDIndex}`}
                            passedKey={`MCCCD-K-${currentCCDIndex}`}
                            submissionVM={getSingleSubmissionVM()}
                            validationSchema={currentCCDIndex === 0 ? parentValidationSchema : childValidationSchema}
                            onValidation={handleValidation}
                        >
                            {(hdProps) => {
                                updateEmail(hdProps);
                                return (
                                    <Row>
                                        <Col>
                                            <Row className="margin-bottom-tiny">
                                                <Col>
                                                    <HDLabelRefactor
                                                        id="mc-confirm-contact-details-label-email"
                                                        className="mb-0"
                                                        text={messages.MCCCDEmailAddText}
                                                        Tag="h5"
                                                        icon={tooltipOverlay('email-overlay', messages.MCCCDEmailText)}
                                                        iconPosition="r" />
                                                </Col>
                                            </Row>
                                            <Row className="mc-confirm-contact-details__input-container">
                                                <Col>
                                                    <HDTextInputRefactor
                                                        webAnalyticsEvent={{ event_action: messages.MCCCDEmailAddText }}

                                                        id="email-input"
                                                        placeholder={messages.MCCCDEmailPlaceholder}
                                                        name={policyHolderEmail}
                                                        path={getemailPath()}
                                                        size="sm"
                                                        onChange={() => { setapiFlag(true); }}
                                                        tickIcon={!!hdProps.values[policyHolderEmail] && !hdProps.errors[policyHolderEmail]}
                                                        inputMode="email" />
                                                </Col>
                                            </Row>
                                            {currentCCDIndex === 0 && (
                                                <HDInfoCardRefactor
                                                    id="mc-confirm-contact-details-email-info"
                                                    className="margin-bottom-md"
                                                    image={TipCirclePurple}
                                                    paragraphs={[messages.MCCCDEmailHintText]} />
                                            )}
                                            <Row className="margin-bottom-tiny">
                                                <Col>
                                                    <HDLabelRefactor
                                                        id="mc-confirm-contact-details-label-mobile"
                                                        className="mb-0"
                                                        text={messages.MCCCDMobileNumText}
                                                        Tag="h5"
                                                        icon={tooltipOverlay('mobile-overlay', messages.MCCCDMobileText)}
                                                        iconPosition="r" />
                                                </Col>
                                            </Row>
                                            <Row className="mc-confirm-contact-details__input-container">
                                                <Col>
                                                    <HDTextInputRefactor
                                                        webAnalyticsEvent={{ event_action: messages.MCCCDMobileNumText }}

                                                        id="mobile-input"
                                                        placeholder={messages.MCCCDMobilePlaceholder}
                                                        name={mobileField}
                                                        path={getmobilePath()}
                                                        size="sm"
                                                        type="phone"
                                                        onChange={() => { setapiFlag(true); }}
                                                        tickIcon={!!hdProps.values[mobileField] && !hdProps.errors[mobileField]}
                                                        maxLength="11"
                                                        inputMode="numeric" />
                                                </Col>
                                            </Row>
                                            {currentCCDIndex === 0 && (
                                                <HDInfoCardRefactor
                                                    id="mc-confirm-contact-details-mobile-info"
                                                    image={TipCirclePurple}
                                                    paragraphs={[messages.MCCCDMobileHintText]} />
                                            )}
                                            {currentCCDIndex === 0 && (
                                                <>
                                                    <hr className="my-md-5" />
                                                    <HDLabelRefactor text={messages.MCCCDYourPreText} Tag="h2" className="margin-bottom-md" />
                                                    <p>{messages.MCCCDYourPreTextMsg}</p>
                                                    <HDLabelRefactor text={messages.MCCCDBestWayContactText} Tag="h5" className="margin-top-md mb-0" />
                                                    <Row className="confirm-contact-details__button-container">
                                                        <Col>
                                                            <HDCheckbox
                                                                webAnalyticsEvent={
                                                                    { event_action: `${messages.confirmContactDetails} - ${messages.MCCCDEmailText}` }}
                                                                id="mc-confirm-contact-details-email-checkbox"
                                                                path={getpreferenceemailPath('email')}
                                                                name={emailFieldName}
                                                                label={{ text: ' ' }}
                                                                text="Email"
                                                                onChange={() => { setapiFlag(true); }} />
                                                        </Col>
                                                        <Col>
                                                            <HDCheckbox
                                                                webAnalyticsEvent={
                                                                    { event_action: `${messages.confirmContactDetails} - ${messages.MCCCDPhoneText}` }}
                                                                id="mc-confirm-contact-details-phone-checkbox"
                                                                path={getpreferenceemailPath('phone')}
                                                                name={phoneFieldName}
                                                                label={{ text: ' ' }}
                                                                text="Phone"
                                                                onChange={() => { setapiFlag(true); }} />
                                                        </Col>
                                                        <Col>
                                                            <HDCheckbox
                                                                webAnalyticsEvent={
                                                                    { event_action: `${messages.confirmContactDetails} - ${messages.MCCCDTextText}` }}
                                                                id="mc-confirm-contact-details-text-checkbox"
                                                                path={getpreferenceemailPath('text')}
                                                                name={textFieldName}
                                                                label={{ text: ' ' }}
                                                                text="Text"
                                                                onChange={() => { setapiFlag(true); }} />
                                                        </Col>
                                                        <Col>
                                                            <HDCheckbox
                                                                webAnalyticsEvent={
                                                                    { event_action: `${messages.confirmContactDetails} - ${messages.MCCCDPostText}` }}
                                                                id="mc-confirm-contact-details-post-checkbox"
                                                                path={getpreferenceemailPath('post')}
                                                                name={postFieldName}
                                                                label={{ text: ' ' }}
                                                                text="Post"
                                                                onChange={() => { setapiFlag(true); }} />
                                                        </Col>
                                                    </Row>
                                                    <HDInfoCardRefactor
                                                        id="mc-confirm-contact-opt-out-info"
                                                        image={TipCirclePurple}
                                                        paragraphs={[messages.MCCCDOptOutHintMsg]} />
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                );
                            }}
                        </HDForm>
                        <Row className="mb-5">
                            <Col>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: 'Continue - Redirecting from HastingsMCConfirmContactDetailsPage' }}
                                    id="mc-confirm-contact-details-continue-button"
                                    size="md"
                                    label={getCCDLabel()}
                                    disabled={disabledContinue}
                                    onClick={parentContinue}
                                    className={continueBtnClassNames} />
                                {currentCCDIndex > 0 && (
                                    <HDInfoCardRefactor
                                        image={TipCirclePurple}
                                        paragraphs={[
                                            messages.MCCCDContactInfoFirstText,
                                            messages.MCCCDContactInfoSecondText,
                                        ]}
                                        id="mc-confirm-contact-details-emergency-contact-info"
                                        className="margin-top-md mt-md-5" />
                                )}
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
            </Container>
        </div>
    );
};

HDMCConfirmContactDetailsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired, value: PropTypes.object }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    currentCCDIndex: PropTypes.number.isRequired,
    setNavigation: PropTypes.func.isRequired,
    updateEmailSaveProgress: PropTypes.func,
    checkbuttonDisabled: PropTypes.func,
    dispatch: PropTypes.shape({}),
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
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    toggleContinueElement: PropTypes.func,
    parentContinue: PropTypes.func,
    getCCDLabel: PropTypes.func,
    onGoBack: PropTypes.func,
    setapiFlag: PropTypes.func,
};

HDMCConfirmContactDetailsPage.defaultProps = {
    dispatch: null,
    updateEmailSaveProgress: () => { },
    checkbuttonDisabled: () => { },
    toggleContinueElement: () => { },
    parentContinue: () => { },
    getCCDLabel: () => { },
    onGoBack: () => { },
    setapiFlag: () => { },
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        // currentCCDIndex: state.mcStartDatePageIndex.currentCCDIndex,
        setNavigation: setNavigationAction
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(HDMCConfirmContactDetailsPage);
