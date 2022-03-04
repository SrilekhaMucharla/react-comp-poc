// react
import React, {
    useCallback, useContext, useEffect, useMemo
} from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
// GW
// Other
import _ from 'lodash';
// Hastings
import { HastingsValidationPopulatorService, HastingsValidationService } from 'hastings-capability-validation';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import * as yup from 'hastings-components/yup';
import {
    HDForm
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import {
    AnalyticsHDDropdownList as HDDropdownList, AnalyticsHDToggleButtonGroup as HDToggleButtonGroup, AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction, setWizardPagesState as setWizardPagesStateAction } from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import * as messages from './HDDriverLicenceTypePage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';

const firstLevelAllowedTypes = (element) => ['F_FM', 'F_FA', 'P_PU'].includes(element.value);
const secondLevelAllowedTypes = (element) => ['F_FP', 'F_FI', 'O_PE', 'U_PN', '0_PW', 'E_FE', 'H_FN', 'N_FW'].includes(element.value);

const HDDriverLicenceTypePage = (props) => {
    const {
        submissionVM, setNavigation, setWizardPageState, pageMetadata, multiCarFlag, mcsubmissionVM
    } = props;
    const translator = useContext(TranslatorContext);
    const viewModelService = useContext(ViewModelServiceContext);
    // ML service call
    const allowedLicencesForAPICall = ['F_FM', 'F_FP'];

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };
    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
        && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;
    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    const licenceTypeFieldname = 'licenceType';
    const licenceTypePath = `${driverPath}.${licenceTypeFieldname}`;

    const licenceNumberFieldname = 'licenseNumber';
    const licenceNumberPath = `${driverPath}.${licenceNumberFieldname}`;

    const licenceType = _.get(submissionVM, `${licenceTypePath}.value.code`);

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const newDriversPageState = _.cloneDeep(driversPageState);

    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();

    const licenseRequest = useMemo(() => {
        return viewModelService.create(
            {},
            'pc',
            'com.hastings.edgev10.capabilities.validation.drivinglicense.dto.request.LicenseRequestDTO',
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const licensesAvailableValues = submissionVM ? _.get(submissionVM, licenceTypePath)
        .aspects
        .availableValues
        .map((typeCode) => {
            if (typeCode.name === 'typekey.LicenceType_Ext.P_PU') {
                return {
                    value: typeCode.code,
                    name: messages.P_PU
                };
            }

            const translation = translator({
                id: typeCode.name,
                defaultMessage: typeCode.name
            });

            const finalTranslation = translation ? translation.replace(' - ', ' ') : translation;

            return {
                value: typeCode.code,
                name: finalTranslation
            };
        }) : [];

    const setSuccessfulValidatedState = (value) => {
        _.set(newDriversPageState, `${driverIndex}.licenceSuccessfulValidated`, value);
        setWizardPageState({ drivers: newDriversPageState });
    };

    const validateDrivingLicense = () => {
        if (driversPageState[driverIndex].licenceSuccessfulScanned
        && !driversPageState[driverIndex].licenceDataChanged) {
            showLoader();

            licenseRequest.licenceNumber = _.get(submissionVM, `${licenceNumberPath}.value`);

            setSuccessfulValidatedState(false);
            setNavigation({ canForward: false });

            HastingsValidationService.validateLicense(licenseRequest.value)
                .then((validationResponse) => {
                    if (validationResponse
                        && validationResponse.result
                        && validationResponse.result.drivingLicence) {
                        HastingsValidationPopulatorService.populateLicenseResponse(validationResponse, submissionVM, driverPath);

                        setSuccessfulValidatedState(true);
                        setNavigation({ canForward: true });
                    }
                })
                .catch(() => {
                    setSuccessfulValidatedState(false);
                    setNavigation({ canForward: true });
                })
                .finally(() => {
                    hideLoader();
                });
        }
    };

    useEffect(() => {
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: true
        });

        setSuccessfulValidatedState(false);

        if (allowedLicencesForAPICall.includes(licenceType)) {
            validateDrivingLicense();
        }
    }, []);

    const validationSchema = yup.object({
        [licenceTypeFieldname]: yup.string()
            .required(messages.typeValidationRequired)
            .VMValidation(licenceTypePath, messages.typeValidationVM, submissionVM),
    });

    const mainList = _.filter(licensesAvailableValues, firstLevelAllowedTypes);

    const secoundLevelList = _.filter(licensesAvailableValues, secondLevelAllowedTypes).map((element) => ({
        value: element.value,
        label: element.name
    }));

    if (secondLevelAllowedTypes({ value: licenceType })) {
        mainList.push({
            value: licenceType,
            name: 'Other'
        });
    } else {
        mainList.push({
            value: 'other',
            name: 'Other'
        });
    }

    const showMore = useCallback((element) => {
        if (!element) { return false; }

        return element === 'other'
                || secondLevelAllowedTypes({ value: element })
                || secondLevelAllowedTypes(element);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    const typeOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.drivingLicenceTypeInfo }}
            webAnalyticsEvent={{ event_action: messages.drivingLicenceTypeInfo }}
            id="driver-licence-type-overlay"
            labelText={messages.typeLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <p>{messages.typeOverlayMessage1(isAnotherDriver ? isAnotherDriverMulti : !isAnotherDriverMulti)}</p>
            <p>{messages.typeOverlayMessage2(isAnotherDriver ? isAnotherDriverMulti : !isAnotherDriverMulti)}</p>
        </HDOverlayPopup>
    );

    const licenseTypeHandler = (e, hdProps) => {
        const newType = e.target.value.value ? e.target.value.value : e.target.value;
        hdProps.setFieldTouched(`${licenceTypeFieldname}`, false, false);
        // Clear data
        HastingsValidationPopulatorService.clearLicenseData(submissionVM, driverPath);
        setSuccessfulValidatedState(false);
        if (allowedLicencesForAPICall.includes(newType)) {
            validateDrivingLicense();
        }
    };

    // workaround for blue tick on "Other" button
    function updateOtherValue(e) {
        mainList.forEach((element) => {
            if (element.name === 'Other') {
                // eslint-disable-next-line no-param-reassign
                element.value = e.target.value.value;
            }
        });
    }

    return (
        <Container className="driver-licence-type-container">
            <Row>
                <Col>
                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        {(hdProps) => {
                            return (
                                <>
                                    <HDToggleButtonGroup
                                        // eslint-disable-next-line max-len
                                        webAnalyticsEvent={{ event_action: messages.typeLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                        id="licence-type-button-group"
                                        className="mb-5"
                                        path={licenceTypePath}
                                        name={licenceTypeFieldname}
                                        label={{
                                            text: messages.typeLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                            Tag: 'h2',
                                            icon: typeOverlay,
                                            iconPosition: 'r'
                                        }}
                                        availableValues={mainList}
                                        btnGroupClassName="grid grid--col-lg-2"
                                        onChange={(e) => licenseTypeHandler(e, hdProps)}
                                        displayValidationMessage={!showMore(hdProps.values[licenceTypeFieldname])} />
                                    <hr />

                                    {showMore(hdProps.values[licenceTypeFieldname]) && (
                                        <HDDropdownList
                                            webAnalyticsEvent={{ event_action: messages.otherLabel }}
                                            id="other-licence-type-dropdown"
                                            path={licenceTypePath}
                                            name={licenceTypeFieldname}
                                            options={secoundLevelList}
                                            label={{
                                                text: messages.otherLabel,
                                                Tag: 'h2',
                                                id: 'driver-licence-other-label'
                                            }}
                                            selectSize="md-8"
                                            displayValidationMessage={showMore(hdProps.values[licenceTypeFieldname])}
                                            theme="blue"
                                            onChange={(e) => { licenseTypeHandler(e, hdProps); updateOtherValue(e); }} />
                                    )}
                                </>
                            );
                        }}
                    </HDForm>
                </Col>
            </Row>
            {HDFullscreenLoader}
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
};

HDDriverLicenceTypePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverLicenceTypePage);
