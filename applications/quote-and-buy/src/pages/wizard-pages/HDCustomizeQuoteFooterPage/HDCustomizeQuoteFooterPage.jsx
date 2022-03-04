import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import {
    HDLabelRefactor, HDForm
} from 'hastings-components';
import { AnalyticsHDButton as HDButton, AnalyticsHDTextInput as HDTextInputRefactor } from '../../../web-analytics';
import { updateEmailSaveProgress as updateEmailSaveProgressAction } from '../../../redux-thunk/actions';
import HDQuoteService from '../../../api/HDQuoteService';
import useToast from '../../Controls/Toast/useToast';
import * as textMessages from '../../Controls/Control.messages';
// import './HDCustomizeQuoteFooterPage.scss';
import {
    BLACK_EMAIL_LIST, MOTOR_LEGAL_ANC, RAC_ANC, PERSONAL_ACCIDENT_ANC, SUBSTITUTE_VEHICLE_ANC, KEY_COVER_ANC
} from '../../../constant/const';
import arc from './svg/bottom-arc.svg';

const HDCustomizeQuoteFooterPage = ({
    emailSaveProgress,
    pageId,
    quoteID,
    brand,
    updateEmailSaveProgress,
    submissionVM
}) => {
    const [emailVal, setEmailVal] = useState(emailSaveProgress);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [emailSent, setEmailSent] = useState(true);
    const [showEmailText, setShowEmailText] = useState(false);
    const [HDToast, addToast] = useToast();
    const ancillaryJourneyModel = useSelector((state) => (state.ancillaryJourneyModel));
    const mcancillaryJourneyModel = useSelector((state) => (state.mcancillaryJourneyModel) || {});
    const multiCarFlag = useSelector((state) => (state.wizardState.app.multiCarFlag));
    useEffect(() => {
        setEmailSent(true);
    }, [pageId]);

    useEffect(() => {
        setEmailVal(emailSaveProgress);
    }, [emailSaveProgress]);

    const dataObject = {
        page: pageId,
        referenceNumber: quoteID,
        emailAddress: emailVal,
    };

    if (brand) {
        dataObject.brand = brand;
    }

    useEffect(() => {
        const validateEmail = (emailAddress) => {
            const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.]+[A-Za-z]{2,6}/;
            return (emailRegex.test(emailAddress) && !(BLACK_EMAIL_LIST.includes(emailAddress)));
        };
        const isValid = validateEmail(emailVal);

        setEmailValid(isValid);
        if (isValid) {
            updateEmailSaveProgress(emailVal);
        }
    }, [emailVal]);

    const addSelectedAncillaries = () => {
        let ancillariesSelected = '';
        const commaSeparation = ',';
        if (ancillaryJourneyModel.motorLegal) {
            ancillariesSelected = ancillariesSelected + MOTOR_LEGAL_ANC + commaSeparation;
        }
        if (ancillaryJourneyModel.breakdown) {
            ancillariesSelected = ancillariesSelected + RAC_ANC + commaSeparation;
        }
        if (ancillaryJourneyModel.personalAccident) {
            ancillariesSelected = ancillariesSelected + PERSONAL_ACCIDENT_ANC + commaSeparation;
        }
        if (ancillaryJourneyModel.substituteVehicle) {
            ancillariesSelected = ancillariesSelected + SUBSTITUTE_VEHICLE_ANC + commaSeparation;
        }
        if (ancillaryJourneyModel.keyCover) {
            ancillariesSelected = ancillariesSelected + KEY_COVER_ANC + commaSeparation;
        }
        dataObject.selectedAncillaries = ancillariesSelected.slice(0, -1);
    };
    const addSelectedAncillariesForMC = () => {
        let ancillariesSelected = '';
        const commaSeparation = ',';
        if (mcancillaryJourneyModel.motorLegal.some((item) => item.motorLegal === true)) {
            ancillariesSelected = ancillariesSelected + MOTOR_LEGAL_ANC + commaSeparation;
        }
        if (mcancillaryJourneyModel.breakdown.some((item) => item.breakdown === true)) {
            ancillariesSelected = ancillariesSelected + RAC_ANC + commaSeparation;
        }
        if (mcancillaryJourneyModel.personalAccident.some((item) => item.personalAccident === true)) {
            ancillariesSelected = ancillariesSelected + PERSONAL_ACCIDENT_ANC + commaSeparation;
        }
        if (mcancillaryJourneyModel.substituteVehicle.some((item) => item.substituteVehicle === true)) {
            ancillariesSelected = ancillariesSelected + SUBSTITUTE_VEHICLE_ANC + commaSeparation;
        }
        if (mcancillaryJourneyModel.keyCover) {
            ancillariesSelected = ancillariesSelected + KEY_COVER_ANC + commaSeparation;
        }
        dataObject.selectedAncillaries = ancillariesSelected.slice(0, -1);
    };

    const progressAction = () => {
        if (emailValid) {
            if (multiCarFlag) {
                addSelectedAncillariesForMC();
            } else {
                addSelectedAncillaries();
            }
            setShowEmailText(true);
            HDQuoteService.sendEmailNotification(dataObject)
                .then(() => {
                    setEmailSent(true);
                    addToast({
                        iconType: 'tickWhite',
                        bgColor: 'light',
                        content: textMessages.emailSentMessage
                    });
                    setShowEmailText(false);
                })
                .catch(() => {
                    setEmailSent(false);
                    setEmailErrorMessage(textMessages.emailSentFailedMessage);
                    setShowEmailText(false);
                });
        } else {
            setEmailSent(false);
            setEmailErrorMessage(textMessages.emailInvalidMessage);
            setShowEmailText(false);
        }
    };
    const handleInputChange = (event) => {
        const { value } = event.target;
        setEmailVal(value);
    };
    return (
        <>
            <Row className="mt-2 mx-0">
                <Col className="px-0">
                    <img className="email-progress__arc" alt="arc-footer" src={arc} />
                </Col>
            </Row>
            <Container fluid className="email-progress">
                <Container>
                    <Row>
                        <Col sm={12} md={{ span: 10, offset: 1 }}>
                            <Row>
                                <Col>
                                    <HDLabelRefactor Tag="h5" text={textMessages.footerTitleText} className="margin-bottom-tiny" />
                                    <HDLabelRefactor Tag="p" text={textMessages.footerDescription} className="progress-description" />
                                </Col>
                            </Row>
                            <div className={`progress-form ${!emailSent ? 'sent-failed' : ''}`}>
                                <HDForm submissionVM={submissionVM}>
                                    <Row>
                                        <Col xs={12} md={8}>
                                            <HDTextInputRefactor
                                                webAnalyticsEvent={{ event_action: textMessages.footerTitleText }}
                                                className="progress-input"
                                                id="footer-progress-input"
                                                placeholder={textMessages.emailPlaceHolder}
                                                name="emailAddress1"
                                                inputMode="email"
                                                onChange={(event) => { handleInputChange(event); }}
                                                data={emailVal}
                                            />
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <HDButton
                                                webAnalyticsEvent={{ event_action: textMessages.footerTitleText }}
                                                id="progress-button"
                                                onClick={() => {
                                                    progressAction();
                                                }}
                                                label={showEmailText ? textMessages.emailButtonTextChange : textMessages.emailButtonText}
                                                disabled={showEmailText}
                                                className="btn-block email-progress__send-btn"
                                                variant="secondary" />
                                        </Col>
                                    </Row>
                                </HDForm>
                                <Row>
                                    <Col xs={12}>
                                        {!emailSent
                                            && (
                                                <div className="invalid-field">
                                                    <div className="message">
                                                        {emailErrorMessage}
                                                    </div>
                                                </div>
                                            )}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            {HDToast}
        </>
    );
};

const mapStateToProps = (state) => ({
    emailSaveProgress: state.emailSaveProgress
});

const mapDispatchToProps = {
    updateEmailSaveProgress: updateEmailSaveProgressAction
};

HDCustomizeQuoteFooterPage.propTypes = {
    emailSaveProgress: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    quoteID: PropTypes.string.isRequired,
    brand: PropTypes.string,
    updateEmailSaveProgress: PropTypes.func.isRequired,
};

HDCustomizeQuoteFooterPage.defaultProps = {
    brand: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDCustomizeQuoteFooterPage);
