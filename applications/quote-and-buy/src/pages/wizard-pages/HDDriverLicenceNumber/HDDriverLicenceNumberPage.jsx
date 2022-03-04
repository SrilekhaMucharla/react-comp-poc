// react
import React, {
    useContext, useEffect, useMemo, useState, useRef
} from 'react';
import { connect, useSelector } from 'react-redux';

// Others
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

// GW
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';

// Hastings
import { HastingsValidationPopulatorService, HastingsValidationService } from 'hastings-capability-validation';
import {
    HDAlertRefactor, HDLabelRefactor, HDInfoCardRefactor, HDButtonRefactor
} from 'hastings-components';

import { useLocation } from 'react-router-dom';
import { AnalyticsHDTextInput as HDTextInput } from '../../../web-analytics';
import {
    setNavigation as setNavigationAction,
    setWizardPagesState as setWizardPagesStateAction,
    setErrorStatusCode as setErrorStatusCodeAction
} from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

import ukDrivingLicense from './UkDrivingLicenseGenerator';

// Resources
import licenceImage from '../../../assets/images/wizard-images/DLN_Image.png';
import discount from '../../../assets/images/wizard-images/discount.png';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import tipIcon from '../../../assets/images/icons/tip_circle_purple.svg';
// import styles from './HDDriverLicenceNumberPage.module.scss';
import * as messages from './HDDriverLicenceNumberPage.messages';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';

const HDDriverLicenceNumberPage = (props) => {
    const {
        submissionVM,
        setNavigation,
        setWizardPageState,
        setErrorStatusCode,
        multiCarFlag,
        mcsubmissionVM,
        handleForward
    } = props;

    const viewModelService = useContext(ViewModelServiceContext);

    const [drivingLicence, setDrivingLicence] = useState('');
    const [validationError, setValidationError] = useState(null);

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    // eslint-disable-next-line max-len
    const editDriverIndex = drivers && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1 ? drivers.findIndex((driver) => driver.fixedId === driverFixedId) : driverIndex;

    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;

    const lastNameFieldName = 'lastName';
    const lastNamePath = `${driverPath}.person.${lastNameFieldName}.value`;
    const firstNameFieldName = 'firstName';
    const firstNamePath = `${driverPath}.person.${firstNameFieldName}.value`;
    const genderPath = `${driverPath}.gender.value.code`;

    const driverBornDayPath = `${driverPath}.dateOfBirth.day.value`;
    const driverBornMonthPath = `${driverPath}.dateOfBirth.month.value`;
    const driverBornYearPath = `${driverPath}.dateOfBirth.year.value`;

    const displayName = `${_.get(submissionVM, firstNamePath)} ${_.get(submissionVM, lastNamePath)}`;
    const lastName = _.get(submissionVM, lastNamePath);
    const gender = _.get(submissionVM, genderPath);
    const birthYear = parseInt(_.get(submissionVM, driverBornYearPath), 10);
    // 0-11 month notation
    const birthMonth = parseInt(_.get(submissionVM, driverBornMonthPath), 10) + 1;
    const birthDay = parseInt(_.get(submissionVM, driverBornDayPath), 10);

    const licenceNumberFieldname = 'licenseNumber';
    const licenceNumberPath = `${driverPath}.${licenceNumberFieldname}`;

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const driverLicenceDetails = useSelector((state) => state.wizardState.app.driverLicenceDetails);
    const newDriversPageState = _.cloneDeep(driversPageState);

    const [disableContinueBtn, setDisableContinueBtn] = useState(false);

    const inputRef = useRef(null);

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const licenseRequest = useMemo(() => {
        return viewModelService.create(
            {},
            'pc',
            'com.hastings.edgev10.capabilities.validation.drivinglicense.dto.request.LicenseRequestDTO',
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const ukDrivingLicensePrefix = (() => {
        try {
            return ukDrivingLicense(lastName, birthYear, birthMonth, birthDay, gender);
        } catch (e) {
            setErrorStatusCode(503);
            return '';
        }
    })();

    const checkForward = () => {
        handleForward();
    };

    const validateDrivingLicense = (event) => {
        const fiveChars = event.target.value.replace(/_/g, '');
        licenseRequest.licenceNumber = ukDrivingLicensePrefix + fiveChars;

        _.set(newDriversPageState, `${driverIndex}.licenceSuccessfulValidated`, false);
        setWizardPageState({ drivers: newDriversPageState });

        if (fiveChars.length === 0) {
            // set submission
            _.set(submissionVM, `${licenceNumberPath}.value`, null);
            setValidationError(null);
            HastingsValidationPopulatorService.clearLicenseData(submissionVM, driverPath);
        }

        if (licenseRequest.licenceNumber.value.length === 11) {
            setNavigation({
                showForward: false
            });
            setDisableContinueBtn(false);
            return;
        }

        if (licenseRequest.licenceNumber.value.length !== 16 || !_.get(submissionVM, licenceNumberPath).aspects.subtreeValid) {
            setValidationError(messages.error);
            setDisableContinueBtn(true);

            setNavigation({
                showForward: false
            });

            return;
        }

        setValidationError(null);

        const licenceCode = _.get(submissionVM, `${driverPath}.licenceType.value.code`);
        const allowedLicencesForAPICall = ['F_FM', 'F_FP'];
        const isApiCallable = allowedLicencesForAPICall.includes(licenceCode);

        if (isApiCallable) {
            setDisableContinueBtn(true);
            setNavigation({
                showForward: false
            });

            HastingsValidationService.validateLicense(licenseRequest.value)
                .then((validationResponse) => {
                    if (validationResponse && validationResponse.result && validationResponse.result.errorCode) {
                        switch (validationResponse.result.errorCode) {
                            case '603':
                                setValidationError(messages.error);
                                trackAPICallFail(messages.validateLicence, messages.licenceNumberNotFound);
                                break;
                            default:
                                setValidationError(messages.error);
                                trackAPICallFail(messages.validateLicence, messages.licenceNumberNotFound);
                        }
                    } else if (validationResponse
                        && validationResponse.result
                        && validationResponse.result.drivingLicence
                        && validationResponse.result.drivingLicence.drivingLicenceNumber) {
                        if (!_.get(submissionVM, licenceNumberPath).aspects.subtreeValid) {
                            setValidationError(messages.error);
                            trackAPICallFail(messages.validateLicence, messages.licenceNumberNotFound);

                            return;
                        }
                        trackAPICallSuccess(messages.validateLicence);

                        // set submission
                        HastingsValidationPopulatorService.populateLicenseResponse(validationResponse, submissionVM, driverPath);

                        // ML lookup successful
                        setNavigation({
                            showForward: false
                        });
                        setDisableContinueBtn(false);
                        _.set(newDriversPageState, `${driverIndex}.licenceSuccessfulValidated`, true);
                        const driverLicenceDetail = {
                            displayName: displayName,
                            dob: new Date(birthYear, birthMonth - 1, birthDay),
                            licenceSuccessfulValidated: true
                        };
                        driverLicenceDetails.push(driverLicenceDetail);
                        setWizardPageState({ drivers: newDriversPageState });
                    }
                })
                .catch(() => {
                    setValidationError(messages.error);
                    trackAPICallFail(messages.validateLicence, messages.licenceNumberNotFound);
                });
        } else {
            _.set(submissionVM, `${licenceNumberPath}.value`, licenseRequest.licenceNumber.value);
            setDisableContinueBtn(false);
            setNavigation({
                showForward: false
            });
        }
    };

    useEffect(
        () => {
            const wizardTooltip = (
                <HDInfoCardRefactor
                    image={tipIcon}
                    paragraphs={[messages.wizardTooltip(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)]}
                    id="dln-saves-time-info" />
            );
            setDisableContinueBtn(false);

            setNavigation({
                showForward: false,
                showWizardTooltip: true,
                wizardTooltip: wizardTooltip
            });

            // restore driving license
            const licenseVM = _.get(submissionVM, `${licenceNumberPath}.value`);
            if (licenseVM && licenseVM.length === 16) {
                const secondPartOfLicense = licenseVM.substring(11);
                setDrivingLicence(secondPartOfLicense);
                validateDrivingLicense({ target: { value: secondPartOfLicense } });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const tooltipOverlay = (<img src={discount} alt="discount" className="mb-2" />);

    return (
        <Container className="dln-container margin-bottom-lg footer-button-large">
            <Row>
                <Col>
                    <HDLabelRefactor
                        className="dln__title"
                        text={messages.dlnLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}
                        additionalContent={<h3 className="d-inline">{messages.dlnOptionalLabel}</h3>}
                        Tag="h2"
                        icon={tooltipOverlay}
                        iconPosition="r"
                        id="dln-discount-label" />
                    <div className="text-small">{messages.basedOn}</div>
                    <HDInfoCardRefactor
                        image={exclamationIcon}
                        paragraphs={[
                            messages.tooltipContentLine1(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                            messages.tooltipContentLine2(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                        ]}
                        id="dln-parking-general-info"
                        className="margin-top-lg margin-bottom-lg" />
                    <div className="margin-bottom-lg">
                        <img className="img-fluid" src={licenceImage} alt="DLN" />
                    </div>
                    <HDLabelRefactor
                        text={messages.enter5chars}
                        Tag="h3"
                        id="dln-enter-dln-label" />

                    <Row>
                        <Col xs={7} md={4} className="pr-0 pr-sm-2">
                            <HDTextInput
                                id="partOne"
                                name="partOne"
                                type="alphanum"
                                value={ukDrivingLicensePrefix}
                                disabled
                                onChange={(e) => setDrivingLicence(e.target.value)}
                                className="font-bold dln-container__dln-prefix-input" />
                        </Col>
                        <Col xs={5} md={3}>
                            <HDTextInput
                                reference={inputRef}
                                // eslint-disable-next-line max-len
                                webAnalyticsEvent={{ event_action: messages.dlnLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver), event_value: messages.enter5chars }}
                                id="partTwo"
                                name="partTwo"
                                type="alphanum"
                                maxLength={5}
                                value={drivingLicence}
                                onChange={(e) => { setDrivingLicence(e.target.value); validateDrivingLicense(e); }}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        inputRef.current.blur();
                                    }
                                }}
                                className="dln-container__dln-input"
                                isInvalidCustom={!!validationError} />
                        </Col>
                        <Col xs={12}>
                            {<HDAlertRefactor className="margin-top-md mb-0" message={validationError} />}
                        </Col>
                        <div className="wizard-buttons-footer">
                            <Row>
                                <Col>
                                    <HDButtonRefactor
                                        webAnalyticsEvent={{ event_action: messages.dlnContinueAction, event_value: messages.continueBtn }}
                                        id="dln-continue-btn"
                                        variant="primary"
                                        label={messages.continueBtn}
                                        onClick={checkForward}
                                        disabled={disableContinueBtn}
                                        className="hd-btn-primary button-continue" />
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </Col>
            </Row>
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
    setNavigation: setNavigationAction,
    setWizardPageState: setWizardPagesStateAction,
    setErrorStatusCode: setErrorStatusCodeAction
};

HDDriverLicenceNumberPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    setErrorStatusCode: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired,
    handleForward: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverLicenceNumberPage);
