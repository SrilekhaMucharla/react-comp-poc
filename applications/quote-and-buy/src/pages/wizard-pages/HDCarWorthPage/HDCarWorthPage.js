/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
    HDLabelRefactor, HDInfoCardRefactor, HDForm
} from 'hastings-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import { AnalyticsHDTextInput as HDTextInput } from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDCarWorth.messages';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';

const HastingsCarWorth = (props) => {
    // eslint-disable-next-line no-unused-vars
    const infoTipText = [messages.infoTipText];
    const {
        submissionVM,
        setNavigation,
    } = props;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const trackerPath = `${vehiclePath}.tracker`;
    const vehicleWorth = 'vehicleWorth';
    const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;
    const [fieldValid, setFieldValid] = useState(true);
    const [lengthMaxValid, setLengthMaxValid] = useState(true);
    const [lengthMinValid, setLengthMinValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [validCharacter, setValidCharacter] = useState(true);
    const inputRef = useRef(null);

    const validationSchema = yup.object({
        [vehicleWorth]: yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(vehicleWorthPath, null, submissionVM),
    });

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid && fieldValid });
    };

    const validateCarWorth = (carWorth) => {
        if (carWorth !== '' && carWorth <= 999999 && carWorth >= 1 && !carWorth.toString().includes('.')) {
            setFieldValid(true);
            setLengthMaxValid(true);
            setLengthMinValid(true);
            setValidCharacter(true);
            setErrorMessage('');
        } else {
            if (carWorth > 999999) {
                setLengthMaxValid(false);
                setErrorMessage(messages.carWorthMaxError);
            } else {
                setLengthMaxValid(true);
            }
            if (carWorth && carWorth < 1 && carWorth !== '') {
                setLengthMinValid(false);
                setErrorMessage(messages.carWorthMinError);
            } else {
                setLengthMinValid(true);
            }
            if (carWorth.includes('.')) {
                setValidCharacter(false);
                setErrorMessage(messages.carValidCharError);
            } else {
                setValidCharacter(true);
            }
            setFieldValid(false);
        }
    };

    const onCarWorthChange = (carWorth, hdProps) => {
        validateCarWorth(carWorth.target.value, hdProps);
    };

    useEffect(() => {
        const carWorth = _.get(submissionVM, `${vehicleWorthPath}.value`);
        if (_.get(submissionVM, `${vehicleWorthPath}.value`) < messages.minValueForTracker
        && (_.get(submissionVM, `${trackerPath}.value`) === 'false' || _.get(submissionVM, `${trackerPath}.value`) === false)) {
            _.set(submissionVM, `${trackerPath}.value`, '');
        }
        if (carWorth && carWorth !== '') {
            validateCarWorth(carWorth, '');
        }
    }, []);

    useEffect(() => {
        setNavigation({
            canForward: false,
            showForward: true
        });
    }, []);

    return (
        <Container className="car-worth-container">
            <Row>
                <HDForm
                    submissionVM={submissionVM}
                    validationSchema={validationSchema}
                    onValidation={handleValidation}
                >
                    {' '}
                    {(hdProps) => {
                        return (
                            <Col>
                                <Row>
                                    <Col>
                                        <HDLabelRefactor
                                            id="car-worth-title"
                                            className="car-worth__label"
                                            text={messages.carWorthQuestion}
                                            Tag="h2" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} lg={7}>
                                        <HDTextInput
                                            reference={inputRef}
                                            webAnalyticsEvent={{ event_action: messages.carWorthQuestion }}
                                            id="car-worth-text-input"
                                            className="car-worth__text-input"
                                            onChange={(event) => onCarWorthChange(event, hdProps)}
                                            onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                    inputRef.current.blur();
                                                }
                                            }}
                                            placeholder={messages.inputPlaceHolder}
                                            type="currency"
                                            inputMode="numeric"
                                            icon="pound-sign"
                                            maxLength="11"
                                            path={vehicleWorthPath}
                                            name={vehicleWorth}
                                            thousandSeprator
                                            isInvalidCustom={!!errorMessage} />
                                        <div className="invalid-field margin-bottom-md" hidden={lengthMaxValid && lengthMinValid && validCharacter}>
                                            <div className="message carworth-error">{errorMessage}</div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <HDInfoCardRefactor
                                            id="car-worth-info-card"
                                            className="car-worth__info-card"
                                            image={tipCirclePurple}
                                            paragraphs={[messages.infoTipText]} />
                                    </Col>
                                </Row>
                            </Col>
                        );
                    }}
                </HDForm>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HastingsCarWorth.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsCarWorth);
