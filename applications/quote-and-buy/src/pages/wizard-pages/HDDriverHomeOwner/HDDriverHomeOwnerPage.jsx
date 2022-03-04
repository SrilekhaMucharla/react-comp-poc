/* eslint-disable max-len */
import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
// import './HDDriverHomeOwnerPage.scss';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import {
    HDForm, HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDropdownList as HDDropdownList
} from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import * as messages from './HDDriverHomeOwnerPage.messages';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import EventEmmiter from '../../../EventHandler/event';

const HDDriverHomeOwnerPage = (props) => {
    const {
        submissionVM, setNavigation, createSubmissionError, multiCarFlag, mcsubmissionVM
    } = props;
    const [isAnotherDriver, isAnotherDriverMulti, isMultiCarFlag] = useAnotherDriver(useLocation());
    // eslint-disable-next-line no-unused-vars
    const [ownHome, setOwnHome] = useState('');
    const [isKeyboardOpen, setKeyboardOpen] = useState(false);
    const translator = useContext(TranslatorContext);
    const inputRef = useRef(null);

    useEffect(() => {
        setNavigation({ canForward: false, showForward: true });
    }, []);

    if (!submissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        let endpointErrorCheck = false;
        if (createSubmissionError
            && createSubmissionError !== null
            && createSubmissionError.error
            && createSubmissionError.error.message) {
            endpointErrorCheck = true;
        } else {
            endpointErrorCheck = false;
        }
        setNavigation({ canForward: isValid && !endpointErrorCheck });
    };

    const handleOwnHomeChange = (event) => {
        setOwnHome(event.target.value);
    };

    const baseDataPath = 'baseData';
    const numberOfCarsOnHousehold = 'numberOfCarsOnHousehold';
    const numberOfCarsOnHouseholdPath = `${baseDataPath}.${numberOfCarsOnHousehold}`;
    const driversPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const ownYourHome = 'ownYourHome';
    const ownYourHomePath = `${driversPath}.${ownYourHome}`;
    const accessToOtherVehicles = 'accessToOtherVehicles';
    const accessToOtherVehiclesPath = `${driversPath}.${accessToOtherVehicles}`;

    const childValidationSchema = yup.object({
        [ownYourHome]: yup.string()
            .required(messages.required)
            .VMValidation(ownYourHomePath, null, submissionVM),
        [accessToOtherVehicles]: yup.string()
            .required(messages.required)
            .VMValidation(accessToOtherVehiclesPath, null, submissionVM)
    });

    const parentValidationSchema = childValidationSchema.concat(yup.object({
        [numberOfCarsOnHousehold]: yup.string()
            .required(messages.required)
            .VMValidation(numberOfCarsOnHouseholdPath, null, submissionVM)
    }));

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];
    const availableAccessToOtherVehiclesValues = _.get(submissionVM, accessToOtherVehiclesPath)
        .aspects
        .availableValues
        .map((typeCode) => {
            return {
                value: typeCode.code,
                label: translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                })
            };
        });

    const numberOfCarsOnHouseholdAvailableValues = [
        {
            value: '1',
            label: '1'
        },
        {
            value: '2',
            label: '2'
        },
        {
            value: '3',
            label: '3'
        },
        {
            value: '4',
            label: '4'
        },
        {
            value: '5',
            label: '5'
        },
        {
            value: '6',
            label: '6'
        },
        {
            value: '7',
            label: '7'
        },
        {
            value: '8',
            label: '8'
        },
        {
            value: '9',
            label: '9+'
        }
    ];

    const onFocusInputHandler = () => {
        if (navigator.virtualKeyboard && navigator.userAgentData.mobile) {
            navigator.virtualKeyboard.overlaysContent = true;
            setKeyboardOpen(true);
            EventEmmiter.dispatch('change', { hide: true });
            window.scroll(0, 700);
        }
    };
    const onBlurInputHandler = () => {
        if (navigator.virtualKeyboard && navigator.userAgentData.mobile) {
            navigator.virtualKeyboard.overlaysContent = false;
            setKeyboardOpen(false);
            EventEmmiter.dispatch('change', { hide: false });
        }
    };

    const mobileMarginSetDropdown = () => {
        if (isKeyboardOpen) return 'home-owner__keyboard-anim-dropdown';
        return 'margin-top-lg margin-top-lg-mobile';
    };

    const mobileMarginSetLabel = () => {
        if (isKeyboardOpen) return 'home-owner__other-vehicle-label home-owner__keyboard-anim-label';
        return 'home-owner__other-vehicle-label';
    };

    return (
        <Container id="home-owner-container" className="home-owner__container">
            <HDForm
                id="home-owner-form"
                className="home-owner__form"
                submissionVM={submissionVM}
                validationSchema={getMCSubmissionVM() ? childValidationSchema : parentValidationSchema}
                onValidation={handleValidation}
            >
                <Row>
                    <Col>
                        <HDLabelRefactor
                            id="home-owner-homeowner-label"
                            className="home-owner__homeowner-label"
                            Tag="h2"
                            text={messages.areyouahomeowner(multiCarFlag && getMCSubmissionVM() ? !isAnotherDriverMulti : isAnotherDriver)} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.areyouahomeowner(isMultiCarFlag && getMCSubmissionVM() ? !isAnotherDriverMulti : isAnotherDriver) }}
                            id="home-owner-homeowner-button-group"
                            className="home-owner__homeowner-button-group"
                            path={ownYourHomePath}
                            name={ownYourHome}
                            availableValues={availableValues}
                            onChange={handleOwnHomeChange}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                    </Col>
                </Row>
                <hr />
                {getMCSubmissionVM() ? '' : (
                    <>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="home-owner-how-many-cars-label"
                                    className="home-owner__how-many-cars-label"
                                    Tag="h2"
                                    text={messages.howmanycars} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDDropdownList
                                    webAnalyticsEvent={{ event_action: messages.howmanycars }}
                                    id="home-owner-how-many-cars-dropdown"
                                    className="home-owner__how-many-cars-dropdown"
                                    selectSize="md-8"
                                    path={numberOfCarsOnHouseholdPath}
                                    name={numberOfCarsOnHousehold}
                                    options={numberOfCarsOnHouseholdAvailableValues}
                                    theme="blue"
                                    isSearchable={false}
                                    enableNative />
                            </Col>
                        </Row>
                        <hr />
                    </>
                )}
                <Row>
                    <Col>
                        <div ref={inputRef} />
                        <HDLabelRefactor
                            id="home-owner-other-vehicle-label"
                            className={mobileMarginSetLabel()}
                            Tag="h2"
                            text={messages.othervehicle(multiCarFlag && getMCSubmissionVM() ? !isAnotherDriverMulti : isAnotherDriver)} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDInfoCardRefactor
                            id="home-owner-info-card"
                            className="home-owner__info-card"
                            image={exclamationIcon}
                            paragraphs={[messages.content(multiCarFlag && getMCSubmissionVM() ? !isAnotherDriverMulti : isAnotherDriver)]} />
                    </Col>
                </Row>
                <Row className={mobileMarginSetDropdown()}>
                    <Col>
                        <HDDropdownList
                            webAnalyticsEvent={{ event_action: messages.othervehicle(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            id="home-owner-access-to-vehicle-dropdown"
                            className="home-owner__access-to-vehicle-dropdown"
                            selectSize="md-8"
                            path={accessToOtherVehiclesPath}
                            name={accessToOtherVehicles}
                            options={availableAccessToOtherVehiclesValues}
                            onFocus={onFocusInputHandler}
                            onBlur={onBlurInputHandler}
                            isSearchable={false}
                            theme="blue" />
                    </Col>
                </Row>
                <div className="infocardstyle" />
            </HDForm>
            {createSubmissionError && createSubmissionError !== null && createSubmissionError.error && createSubmissionError.error.message && (
                <p className="error">{createSubmissionError.error.message}</p>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        createSubmissionError: state.wizardState.app.submissionErrorObject
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDDriverHomeOwnerPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    createSubmissionError: PropTypes.shape({ error: PropTypes.object }),
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

HDDriverHomeOwnerPage.defaultProps = {
    createSubmissionError: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverHomeOwnerPage);
