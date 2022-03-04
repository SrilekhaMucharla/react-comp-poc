/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-extraneous-dependencies*/
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import { HastingsAccountService } from 'hastings-capability-account';
import PropTypes from 'prop-types';
import {
    HDLabelRefactor,
    HDInfoCardRefactor
} from 'hastings-components';
import { AnalyticsHDTextInput as HDTextInput, AnalyticsHDButton as HDButton } from '../../../web-analytics';
import eyeOff from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Eye-off.svg';
import eyeOn from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Eye-on.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import * as messages from './HDCreatePasswordPage.messages';

const HDCreatePasswordPage = ({
    toggleContinueElement,
    submissionVM,
    customizeSubmissionVM,
    onSetNewPassSuccess,
    multiCarFlag,
}) => {
    const [textInputScore, setTextInputScore] = useState();
    const [pswrdStrengthMessage, setPswrdStrengthMessage] = useState();
    const [pswrdStrengthDescription, setPswrdStrengthDescription] = useState();
    const [isContBtnDisable, setIsContBtnDisable] = useState(true);
    const [pswrd, setPswrd] = useState();
    const [error, setError] = useState(null);
    const pswrdToken = _.get(submissionVM, 'value.passwordToken', null);
    const [pswrdTokenValue, setPswrdTokenValue] = useState(null);
    const [isPasswordReveal, setPasswordReveal] = useState(false);
    const [blankSpacesInPassword, setBlankSpacesInPassword] = useState(false);

    useEffect(() => {
        toggleContinueElement(false);
    }, [toggleContinueElement]);

    useEffect(() => {
        if (!!pswrdToken && Object.keys(pswrdToken).length > 0 && pswrdToken.token.length > 0) {
            setPswrdTokenValue(pswrdToken.token);
        }
    }, [pswrdToken]);

    const handleChange = (event) => {
        const zxcvbn = require('zxcvbn');
        const { value } = event.target;
        if (value && value.length > 0) {
            if (value !== _.trim(value)) {
                setBlankSpacesInPassword(true);
                setIsContBtnDisable(true);
                setPswrdStrengthMessage();
                setPswrdStrengthDescription();
            } else {
                const result = (zxcvbn(value));
                setTextInputScore(result.score);
                setBlankSpacesInPassword(false);
                switch (result.score) {
                    case 0:
                        setPswrdStrengthMessage(messages.pswrdEasy);
                        setPswrdStrengthDescription(`${messages.pswrdEasyMessageOne}\n${messages.pswrdEasyMessageTwo}`);
                        setIsContBtnDisable(true);
                        break;
                    case 1:
                        setPswrdStrengthMessage(messages.pswrdEasy);
                        setPswrdStrengthDescription(`${messages.pswrdEasyMessageOne}\n${messages.pswrdEasyMessageTwo}`);
                        setIsContBtnDisable(true);
                        break;
                    case 2:
                        setPswrdStrengthMessage(messages.pswrdOk);
                        setPswrdStrengthDescription(messages.pswrdOkMessage);
                        setIsContBtnDisable(false);
                        break;
                    case 3:
                        setPswrdStrengthMessage(messages.pswrdStrong);
                        setPswrdStrengthDescription(messages.pswrdStrongMessage);
                        setIsContBtnDisable(false);
                        break;
                    case 4:
                        setPswrdStrengthMessage(messages.pswrdStrong);
                        setPswrdStrengthDescription(messages.pswrdStrongMessage);
                        setIsContBtnDisable(false);
                        break;
                    default:
                        setPswrdStrengthMessage();
                        setPswrdStrengthDescription();
                        break;
                }
            }
        } else {
            setBlankSpacesInPassword(false);
            setTextInputScore();
            setPswrdStrengthMessage();
            setPswrdStrengthDescription();
        }
        setPswrd(value);
    };


    const handleContinue = () => {
        if (multiCarFlag) {
            const parentPolicy = submissionVM.value.quotes.filter((qd) => qd.isParentPolicy)[0];
            const { passwordToken } = parentPolicy;
            const { accountHolder } = parentPolicy.baseData;
            const { dateOfBirth } = accountHolder;
            const { emailAddress1 } = accountHolder;
            const { quoteData } = parentPolicy;
            const brand = quoteData.offeredQuotes[0].branchCode;
            const request = {
                Brand: brand,
                DateOfBirth: `${dateOfBirth.day}/${dateOfBirth.month + 1}/${dateOfBirth.year}`,
                EmailAddress: emailAddress1,
                PasswordToken: passwordToken.token,
                NewPassword: pswrd,
                SetVerified: false
            };
            HastingsAccountService.setNewPassword(request)
                .then(() => {
                    onSetNewPassSuccess();
                })
                .catch(() => {
                    setError(messages.errorMessage);
                });
        } else {
            const dateObject = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers[0].dateOfBirth');
            const pswrdObj = {
                Brand: _.get(customizeSubmissionVM, 'value.quote.branchCode'),
                DateOfBirth: `${dateObject.day}/${dateObject.month + 1}/${dateObject.year}`,
                EmailAddress: _.get(submissionVM, 'value.baseData.accountHolder.emailAddress1'),
                PasswordToken: pswrdTokenValue,
                NewPassword: pswrd,
                SetVerified: false
            };
            HastingsAccountService.setNewPassword(pswrdObj)
                .then(() => {
                    onSetNewPassSuccess();
                })
                .catch(() => {
                    setError(messages.errorMessage);
                });
        }
    };

    return (
        <>
            <Row>
                <Col xs={12} className="wizard-head create-password-head">
                    <Container className="create-password-common-container">
                        <HDLabelRefactor Tag="h1" text={messages.pswrdHeader} />
                        <p className="mb-0">{messages.pswrdHeaderMessage}</p>
                    </Container>
                </Col>
            </Row>
            <Container className="password-contents create-password-common-container create-password-container">
                {error && (
                    <Row>
                        <Col>
                            <div className="error create-password__error">
                                {error}
                            </div>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col xs={12} md={7} className="px-mobile-0 create-password__password-col">
                        <div className="elevated-box create-password__password-wrapper">
                            <div className="create-password__password-wrapper__container">
                                <HDLabelRefactor
                                    Tag="h5"
                                    text={messages.createPswrd}
                                    id="create-password-password-header"
                                    className="create-password__password__header" />
                                <div className={
                                    `create-password__description ${textInputScore ? `create-password__description--${textInputScore}` : 'd-none'}`}
                                >
                                    <HDLabelRefactor
                                        Tag="span"
                                        text={pswrdStrengthDescription}
                                        className="font-medium" />
                                </div>
                                <HDTextInput
                                    webAnalyticsEvent={{ event_action: messages.summary, event_value: messages.newPswrd }}
                                    className="create-password__input"
                                    id="create-password-password-input"
                                    name="pass"
                                    type={isPasswordReveal ? 'text' : 'password'}
                                    appendContent={<img src={isPasswordReveal ? eyeOff : eyeOn} alt="" onClick={() => setPasswordReveal(!isPasswordReveal)} />}
                                    onChange={(event) => handleChange(event)}
                                    value={pswrd} />
                                <div className={
                                    `create-password__strength-bar create-password__strength-bar--set${textInputScore}${!textInputScore ? ' d-none' : ''}`}
                                >
                                    <div className={`create-password__current-strength create-password__current-strength--${textInputScore}`}>
                                        {pswrdStrengthMessage}
                                    </div>
                                </div>
                                {
                                    blankSpacesInPassword && (
                                        <div className="invalid-field margin-top-lg margin-top-lg-mobile mb-0">
                                            <div className="message">
                                                {messages.blankSpaces}
                                            </div>
                                        </div>
                                    )
                                }

                                <HDInfoCardRefactor
                                    id="create-password-info-card"
                                    image={tipCirclePurple}
                                    paragraphs={[
                                        messages.infoHeaderMessage,
                                        (
                                            <ul className="create-password__info-card__list mb-2">
                                                <li><span>{messages.infoMessageOne}</span></li>
                                                <li><span>{messages.infoMessageTwo}</span></li>
                                                <li><span>{messages.infoMessageThree}</span></li>
                                                <li><span>{messages.infoMessageFour}</span></li>
                                            </ul>
                                        )
                                    ]}
                                    theme="light"
                                    size="thin"
                                    className="create-password__info-card" />

                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                    id="create-password-continue-btn"
                                    className="theme-white margin-top-md create-password__continue-btn"
                                    label={messages.continueButtonText}
                                    disabled={isContBtnDisable}
                                    onClick={() => handleContinue()} />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={5} className="px-mobile-0 create-password__my-acc-col">
                        <div className="elevated-box create-password__my-acc-container">
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.myAccount}
                                id="create-password-my-acc-header"
                                className="mt-0 create-password__my-acc__header" />
                            <HDLabelRefactor
                                Tag="h5"
                                text={messages.tryTheApp}
                                id="create-password-my-acc-subheader"
                                className="create-password__my-acc__subheader" />
                            <HDLabelRefactor
                                Tag="h5"
                                text={messages.manageInsurance}
                                id="create-password-my-acc-subheader"
                                className="create-password__my-acc__subheader" />
                            <ul className="pad-inl-start-sm mb-0">
                                <li>{messages.policyChanges}</li>
                                <li>{messages.managePayments}</li>
                                <li>{messages.trackClaim}</li>
                                <li>{messages.downloadDocuments}</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => ({
    multiCarFlag: state.wizardState.app.multiCarFlag,
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
});

HDCreatePasswordPage.propTypes = {
    multiCarFlag: PropTypes.bool,
    toggleContinueElement: PropTypes.func,
    submissionVM: PropTypes.shape({ lobData: PropTypes.object, value: PropTypes.object }),
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    onSetNewPassSuccess: PropTypes.func
};

HDCreatePasswordPage.defaultProps = {
    multiCarFlag: false,
    toggleContinueElement: () => { },
    submissionVM: null,
    customizeSubmissionVM: null,
    onSetNewPassSuccess: () => { },
};

export default connect(mapStateToProps, null)(HDCreatePasswordPage);
