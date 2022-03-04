import React, { useEffect, useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDForm, HDInfoCardRefactor, HDLabelRefactor, yup
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import {
    setNavigation as setNavigationAction,
    updateEmailSaveProgress as updateEmailSaveProgressAction
} from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

import * as messages from './HDDriverEmailPage.messages';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';

const HDDriverEmailPage = (props) => {
    const {
        submissionVM, setNavigation, updateEmailSaveProgress, mcsubmissionVM, multiCarFlag, handleForward, pageMetadata
    } = props;
    const blackEmailsList = ['unknown@unknown.com', 'nospam@thevaninsurer.co.uk', 'nospam@thebikeinsurer.co.uk'];
    const [disableContinueBtn, setDisableContinueBtn] = useState(true);
    const driverPath = 'lobData.privateCar.coverables.drivers.children';

    const inputRef = useRef(null);

    useEffect(() => {
        setNavigation({ canForward: false, showForward: false });
    }, []);

    const [isAnotherDriver, isAnotherDriverMulti] = useAnotherDriver(useLocation());
    const emailAddress = useSelector((state) => {
        const submVm = state.wizardState.data.submissionVM;
        return (submVm) ? submVm.baseData.accountHolder.emailAddress1.value : null;
    });

    if (!submissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
        if (isValid) {
            const accountHolder = _.get(submissionVM, `${driverPath}[0].person.accountHolder.value`);
            if (multiCarFlag && mcsubmissionVM && mcsubmissionVM.value.accountHolder
                && mcsubmissionVM.value.accountHolder.emailAddress1 && mcsubmissionVM.value.accountHolder.emailAddress1.length && !accountHolder) {
                updateEmailSaveProgress(mcsubmissionVM.value.accountHolder.emailAddress1);
            } else {
                updateEmailSaveProgress(emailAddress);
            }
        }
        setDisableContinueBtn(!isValid);
    };

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const accountHolder = 'baseData.accountHolder';
    const emailField = 'emailAddress1';
    const driverEmailPath = `${accountHolder}.${emailField}`;

    const validationSchema = yup.object({
        [emailField]: yup
            .string()
            .required(messages.requiredField)
            .test('blackList', messages.invalidEmailMessage, (emailAddress1) => !blackEmailsList.includes(emailAddress1))
            .email(messages.invalidEmailMessage)
            .VMValidation(driverEmailPath, messages.invalidEmailMessage, submissionVM)
    });

    const attemptForward = () => {
        const mcQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
        const isPolicyHolder = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers[0].isPolicyHolder', false);
        const isAccountHolder = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers[0].person.accountHolder', false);
        if (mcQuotes.length >= 1 && isPolicyHolder && !isAccountHolder) {
            handleForward({ isChildCarPH: true });
        } else { handleForward(); }
    };

    const handleInputChange = (event) => {
        const { value, name } = event.target;
        _.set(submissionVM, 'value.lobData.privateCar.coverables.drivers[0].person.emailAddress1', value);
    };
    return (
        <Container className="driver-email-container">
            <Row>
                <Col>
                    <HDLabelRefactor
                        id="driver-email-label"
                        Tag="h2"
                        text={messages.emailTitle(multiCarFlag && getMCSubmissionVM() ? !isAnotherDriverMulti : isAnotherDriver)} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        <div />
                        <Row>
                            <Col xs={12} md={8}>
                                <HDTextInput
                                    reference={inputRef}
                                    webAnalyticsEvent={{
                                        event_action: messages.emailTitle(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)
                                    }}
                                    id="driver-email-text-input"
                                    placeholder={messages.emailPlaceholder}
                                    name={emailField}
                                    path={driverEmailPath}
                                    inputMode="email"
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            inputRef.current.blur();
                                        }
                                    }}
                                    onChange={handleInputChange} />
                            </Col>
                        </Row>
                    </HDForm>
                    {(!getMCSubmissionVM() && (
                        <HDInfoCardRefactor
                            id="driver-email-info-card"
                            image={tipCirclePurple}
                            paragraphs={[
                                messages.infoFirstParagraph,
                                (
                                    <ul className="pad-inl-start-beg m-0">
                                        {messages.infoSecondParagraphList.map((el, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <li key={i}><span>{el}</span></li>
                                        ))}
                                    </ul>
                                ),
                                messages.infoThirdParagraph
                            ]} />
                    )
                    )}
                </Col>
            </Row>
            <HDButton
                webAnalyticsEvent={{ event_action: 'Continue - Redirecting from: HastingsPersonalDetails_Email' }}
                variant="primary"
                id="continue-button"
                label={messages.continueLabel}
                disabled={disableContinueBtn}
                onClick={() => attemptForward()}
                className="margin-top-xl"
                size="md" />
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    updateEmailSaveProgress: updateEmailSaveProgressAction
};

HDDriverEmailPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    updateEmailSaveProgress: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    handleForward: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverEmailPage);
