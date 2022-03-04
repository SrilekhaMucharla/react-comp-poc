/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import {
    HDForm, HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDropdownList as HDDropdownList
} from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';

import useAnotherDriver from '../__helpers__/useAnotherDriver';
import * as messages from './HDDriverMaritalStatusPage.messages';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';

const HDDriverMaritalStatusPage = (props) => {
    const {
        submissionVM, setNavigation, pageId, multiCarFlag, mcsubmissionVM
    } = props;
    // eslint-disable-next-line no-unused-vars
    const [, setchildrenUnder16] = useState('');
    const [maritalStatusValue, setMaritalStatusValue] = useState(null);
    const translator = useContext(TranslatorContext);

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1 ? drivers.findIndex((driver) => driver.fixedId === driverFixedId) : driverIndex;

    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    const driverId = _.get(submissionVM, `${driverPath}.tempID.value`);
    const anyChildrenUnder16 = 'anyChildrenUnder16';
    const anyChildrenUnder16Path = `${driverPath}.${anyChildrenUnder16}`;
    const maritalStatus = 'maritalStatus';
    const maritalStatusPath = `${driverPath}.${maritalStatus}`;
    const accessToOtherVehicles = 'accessToOtherVehicles';
    const accessToOtherVehiclesPath = `${driverPath}.${accessToOtherVehicles}`;
    const driverVM = _.get(submissionVM, driverPath);
    const personPrefixPath = 'person.prefix.value.code';
    const prefix = _.get(submissionVM, `${driverPath}.${personPrefixPath}`);
    const occupationFullFieldName = 'occupationFull';
    const occupationFullPath = `${driverPath}.${occupationFullFieldName}`;

    useEffect(() => {
        setNavigation({ canForward: false, showForward: true });
    }, []);

    useEffect(() => {
        if (driverVM.fullEmpStatus.value && driverVM.fullEmpStatus.value.code === 'H') {
            if (prefix === '003_Mr' || prefix === '003') {
                _.set(submissionVM, occupationFullPath, '163');
                driverVM.occupationFull.value = '163';
            } else if (prefix === '004' || prefix === '002' || prefix === '005_Ms' || prefix === '005') {
                _.set(submissionVM, occupationFullPath, 'H09');
                driverVM.occupationFull.value = 'H09';
            }
        }
    }, []);

    if (!submissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const handleChildrenUnder16Change = (event) => {
        setchildrenUnder16(event.target.value);
    };

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const baseValidationSchema = yup.object({
        [maritalStatus]: yup
            .string()
            .required(messages.required)
            .VMValidation(maritalStatusPath, null, submissionVM)
    });

    const validationSchema = baseValidationSchema.concat(yup.object({
        [anyChildrenUnder16]: yup
            .string()
            .required(messages.required)
            .VMValidation(anyChildrenUnder16Path, null, submissionVM)
    }));

    const anotherDriverValidationSchema = baseValidationSchema.concat(yup.object({
        [accessToOtherVehicles]: yup
            .string()
            .required(messages.required)
            .VMValidation(accessToOtherVehiclesPath, null, submissionVM)
    }));


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

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const availablemaritalStatusValues = _.head(
        _.head(submissionVM.lobData.privateCar.coverables.drivers.children[0].maritalStatus.aspects.availableValues).typelist.filters.filter(
            (el) => el.name === 'FilterMaritalStatus'
        )
    ).codes.map((typeCode) => {
        return {
            value: typeCode.code,
            label: translator({
                id: typeCode.name,
                defaultMessage: typeCode.name
            })
        };
    });

    const maritalStatusChange = (event) => {
        setMaritalStatusValue(event.target.value);
    };

    return (
        <Container className="marital-status__container">
            <HDForm
                context={{ fieldName: pageId, fieldValue: driverId }}
                submissionVM={submissionVM}
                validationSchema={isAnotherDriver ? anotherDriverValidationSchema : validationSchema}
                onValidation={handleValidation}
            >
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="marital-status-label"
                                className="marital-status__label"
                                Tag="h2"
                                text={messages.maritalStatus(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: messages.maritalStatus(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                id="marital-status-dropdown"
                                className="marital-status__dropdown"
                                path={maritalStatusPath}
                                name={maritalStatus}
                                value={maritalStatusValue}
                                selectSize="md-8"
                                onChange={maritalStatusChange}
                                options={availablemaritalStatusValues}
                                theme="blue" />
                        </Col>
                    </Row>
                    <hr />
                </>
                {!isAnotherDriver && (
                    <>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="marital-status-another-driver-label"
                                    className="marital-status__another-driver__label"
                                    Tag="h2"
                                    text={messages.childrenUnder16(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDToggleButtonGroup
                                    webAnalyticsEvent={{ event_action: messages.childrenUnder16(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                    id="marital-status-another-driver-buttons"
                                    className="marital-status__another-driver__buttons"
                                    path={anyChildrenUnder16Path}
                                    name={anyChildrenUnder16}
                                    availableValues={availableValues}
                                    onChange={handleChildrenUnder16Change}
                                    btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                            </Col>
                        </Row>
                        <hr />
                    </>
                )}
                {isAnotherDriver && (
                    <>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="marital-status-another-vehicle-label"
                                    className="marital-status__another-vehicle__label"
                                    Tag="h2"
                                    text={messages.othervehicle} />
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                <HDInfoCardRefactor
                                    id="marital-status-another-vehicle-info-card"
                                    className="marital-status__another-vehicle__info-card"
                                    image={exclamationIcon}
                                    paragraphs={[messages.content]} />
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                <HDDropdownList
                                    webAnalyticsEvent={{ event_action: messages.othervehicle }}
                                    id="marital-status-access-to-other-vehicles"
                                    className="marital-status__another-vehicle__dropdown"
                                    selectSize="md-8"
                                    path={accessToOtherVehiclesPath}
                                    name={accessToOtherVehicles}
                                    options={availableAccessToOtherVehiclesValues}
                                    theme="blue" />
                            </Col>
                        </Row>
                    </>
                )}
            </HDForm>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDDriverMaritalStatusPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageId: PropTypes.string,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

HDDriverMaritalStatusPage.defaultProps = {
    pageId: ''
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverMaritalStatusPage);
