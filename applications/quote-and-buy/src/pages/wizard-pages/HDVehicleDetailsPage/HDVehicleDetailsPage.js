/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as yup from 'hastings-components/yup';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Container } from 'react-bootstrap';
import {
    HDForm,
    HDDataCard,
    HDLabelRefactor,
    HDInfoCardRefactor,
    HDModal
} from 'hastings-components';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    setNavigation as setNavigationAction,
    setVehicleDetails as setVehicleDetailsAction,
    multiQuote as multiQuoteAction
} from '../../../redux-thunk/actions';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDButton as HDButton,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../web-analytics';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { HastingsVehicleInfoLookupService } from '../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import fuelTypes from '../../../constant/fuelTypes';
import * as messages from './HDVehicleDetails.messages';
import exclamation from '../../../assets/images/icons/circle-exclamation.svg';
import seats from '../../../assets/images/icons/seats.svg';
import steeringWheel from '../../../assets/images/icons/steering-wheel.svg';
import alarm from '../../../assets/images/icons/alarm.svg';
import imported from '../../../assets/images/icons/imported.svg';
import formatRegNumber from '../../../common/formatRegNumber';
import * as messagesTwo from '../HDCustomizeQuoteSummaryPage/HDCustomizeQuoteSummaryPage.messages';
import wizardRoutes from '../../../routes/WizardRouter/RouteConst';
import { isUWErrorPresent, isGrayListErrorPresent, isCueErrorPresent } from '../__helpers__/policyErrorCheck';


const HDVehicleDetailsPage = (props) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [localVehicleData, setLocalVehicleData] = useState();
    const [alarmImmobilizers, setAlarmImmobilizers] = useState([]);
    const [importTypes, setImportTypes] = useState([]);
    const [seatsList, setSeatsList] = useState([]);
    const [navigationFlag, setNavigationFlag] = useState(false);
    const translator = useContext(TranslatorContext);
    const [isEnabled, setEnabled] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [showRerateModal, setShowRerateModal] = useState(false);
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const {
        handleForward,
        handleBackward,
        submissionVM,
        previousVehicleDetails,
        setNavigation,
        setVehicleDetails,
        onFind,
        displayRerateModal,
        getPriceNavigationFlag,
        mcsubmissionVM,
        multiQuote,
        multiQuoteObject,
        multiQuoteError,
        savingsPageRerateModal,
        history,
        setmilestoneEdit,
        hideGoBack
    } = props;
    let alarmImmobilizerDefaultValue;
    const getVehicleData = (vehicleData, drivingSideVal) => {
        if (vehicleData) {
            const vehicle = _.get(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0]').value;
            vehicleData.drivingSide = drivingSideVal;
            vehicleData.alarmImmobilizer = alarmImmobilizerDefaultValue;
            vehicleData.importType = vehicleData.imported ? 'yes_uk_import' : 'no';
            vehicleData.registrationsNumber = vehicleData.regNo;
            vehicleData.yearManufactured = vehicleData.year;
            vehicleData.body = vehicleData.body;
            if (vehicleData.transmission && vehicleData.transmission.toLowerCase() === 'automatic') {
                vehicleData.transmission = '001';
            } else if (vehicleData.transmission && vehicleData.transmission.toLowerCase() === 'manual') {
                vehicleData.transmission = '002';
            } else {
                vehicleData.transmission = vehicle.transmission === '001' || vehicle.transmission === '002' ? vehicle.transmission : '';
            }
            vehicleData.numberOfSeats = vehicleData.numberOfSeats ? vehicleData.numberOfSeats.toString() : '5';
            vehicleData.numberOfSeats += '';
            delete vehicleData.imported; // Removing and remapping variables from API with viewmodel
            delete vehicleData.regNo; // Removing and remapping variables from API with viewmodel
            const fuelObject = vehicleData ? _.head(fuelTypes.filter((el) => el.value === vehicleData.fuelType)) : '';
            vehicleData.fuelType = fuelObject ? fuelObject.label : vehicleData.fuelType;
            const newVehicle = { ...vehicle, ...vehicleData };
            _.set(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0].value', newVehicle);
            setLocalVehicleData(vehicleData);
        }
    };
    const sortDrivers = (driverA, driverB) => {
        if (!driverA.relationToProposer) {
            return -1;
        } if (!driverB.relationToProposer) {
            return 1;
        } return parseInt(driverA.fixedId, 10) - parseInt(driverB.fixedId, 10);
    };
    useEffect(() => {
        document.body.classList.remove('hd-modal-open');
        window.scroll(0, 0);
        const sortedArray = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
        const drivers = (sortedArray.length) > 1 ? sortedArray.sort(sortDrivers) : sortedArray;
        _.set(submissionVM, 'lobData.privateCar.coverables.drivers.value', drivers);
        setNavigation({
            showForward: false,
            canForward: false
        });
    }, []);
    useEffect(() => {
        const alarmImmobilizersList = _.head(
            _.head(submissionVM.lobData.privateCar.coverables.vehicles.children[0]
                .alarmImmobilizer
                .aspects
                .availableValues)
                .typelist
                .filters
                .filter((el) => el.name === 'PrivateCar_Ext')
        )
            .codes
            .map((element) => ({
                value: element.code,
                label: translator({
                    id: element.name,
                    defaultMessage: element.name
                }),
            }));
        setAlarmImmobilizers(alarmImmobilizersList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        alarmImmobilizerDefaultValue = _.head(alarmImmobilizersList.filter((el) => el.value === '93'));
        alarmImmobilizerDefaultValue = alarmImmobilizerDefaultValue.value;
        const importTypeList = [
            { value: 'no', label: 'Not imported' },
            { value: 'yes_uk_import', label: 'Imported' }

        ];
        setImportTypes(importTypeList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const drivingSides = submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            .drivingSide
            .aspects
            .availableValues
            .map((element) => ({
                value: element.code,
                label: translator({
                    id: element.name,
                    defaultMessage: element.name
                })
            }));

        let drivingSideDefaultValue = _.head(drivingSides.filter((el) => el.value === 'R'));
        drivingSideDefaultValue = drivingSideDefaultValue.value;

        const availableSeatsNumberValues = [...Array(9)
            .keys()]
            .map((x) => {
                const seatNum = x + 1;
                return {
                    value: (seatNum).toString(),
                    label: (seatNum).toString() === '1' ? '1 seat' : `${(seatNum).toString()}${' '}${'seats'}`
                };
            });
        setSeatsList(availableSeatsNumberValues);

        const vehicleData = props.vehicleDetails;
        const regno = submissionVM.lobData.privateCar.coverables.vehicles.children[0].value.registrationsNumber;
        const vehicleFuelType = submissionVM.lobData.privateCar.coverables.vehicles.children[0].value.fuelType;
        const vehicleNumberOfDoors = submissionVM.lobData.privateCar.coverables.vehicles.children[0].value.numberOfDoors;
        setNavigationFlag(getPriceNavigationFlag);
        if (!submissionVM.lobData.privateCar.coverables.vehicles.children[0].value.make
            || (history.location.state && history.location.state.fromPage === wizardRoutes.MC_SAVINGS_PAGE)) {
            getVehicleData(props.vehicleDetails, drivingSideDefaultValue);
        } else if (regno && vehicleData && vehicleData.regNo
            && vehicleData.regNo !== regno) {
            getVehicleData(props.vehicleDetails, drivingSideDefaultValue);
        } else if (regno && getPriceNavigationFlag && !vehicleFuelType && !vehicleNumberOfDoors) {
            const responseData = submissionVM.lobData.privateCar.coverables.vehicles.children[0].value;
            const regNo = responseData && responseData.registrationsNumber && responseData.registrationsNumber.replace(/\s+/g, '');
            const dataObject = [{ registrationNumber: regNo }];
            setError(null);
            if (regNo) {
                showLoader();
                HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN(dataObject)
                    .then((vehicleInfo) => {
                        if ((!vehicleInfo.result && !vehicleInfo.result.abiCode) || vehicleInfo.result.type === undefined) {
                            setError(messages.carNotFoundErrorMsg);
                            trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.invalidVRN);
                        } else if (vehicleInfo.result.type === messages.motorcycleExt) {
                            setError(messages.bikeRegErrorMsg);
                            trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.incorrectVRNBike);
                        } else {
                            vehicleInfo.result.regNo = regNo;
                            getVehicleData(vehicleInfo.result, drivingSideDefaultValue);
                            trackAPICallSuccess(messages.retrieveVehicleDataBasedOnVRN);
                        }
                    })
                    .catch(() => {
                        setError(messages.carNotFoundErrorMsg);
                        trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.notFoundVRN);
                    })
                    .finally(() => {
                        hideLoader();
                    });
            }
        } else {
            const responseData = submissionVM.lobData.privateCar.coverables.vehicles.children[0].value;
            const fuelType = vehicleData ? _.head(fuelTypes.filter((el) => el.value === vehicleData.fuelType)) : '';
            // eslint-disable-next-line no-nested-ternary
            responseData.fuelType = fuelType ? fuelType.label : vehicleData && vehicleData.fuelType ? vehicleData.fuelType : '';
            responseData.numberOfSeats = responseData.numberOfSeats ? responseData.numberOfSeats.toString() : '';
            responseData.transmission = responseData.transmission ? responseData.transmission : '';
            responseData.numberOfSeats += '';
            _.set(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0].value', responseData);
            setLocalVehicleData(responseData);
        }
    }, []);

    const navigateToSavingsPage = () => {
        const tempSubmissionVM = _.cloneDeep(submissionVM.value);
        _.set(tempSubmissionVM, 'isQuoteToBeUpdated', true);
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].quoteID === tempSubmissionVM.quoteID) {
                _.set(mcsubmissionVM.value.quotes[i] = tempSubmissionVM);
                break;
            }
        }
        multiQuote(mcsubmissionVM, undefined, false, translator);
        setAPITriggerPoint(true);
        if (!savingsPageRerateModal) {
            setShowRerateModal(true);
        } else {
            showLoader();
        }
    };

    const hideRerateModal = () => {
        showLoader();
        setNavigation({ savingsPageRerateModal: true });
        setShowRerateModal(false);
    };

    useEffect(() => {
        if (multiQuoteError && _.get(multiQuoteError, 'error.message') && aPITriggerPoint) {
            hideLoader();
            history.push(wizardRoutes.MC_QUOTE_DECLINE);
        }
        if (multiQuoteObject && multiQuoteObject.accountNumber && aPITriggerPoint) {
            _.set(mcsubmissionVM, 'value', multiQuoteObject);
            hideLoader();
            let isParentCarQuotable = true;
            multiQuoteObject.quotes.forEach((quote) => {
                const offeredQuotes = [...quote.quoteData.offeredQuotes];
                if (isParentCarQuotable) {
                    if (quote.isParentPolicy
                        && (isUWErrorPresent(offeredQuotes) || isGrayListErrorPresent(offeredQuotes) || isCueErrorPresent(offeredQuotes))) {
                        _.set(submissionVM, 'value', quote);
                        // _.set(submissionVM, 'value.quoteData', {});
                        isParentCarQuotable = false;
                    }
                }
            });
            if (!isParentCarQuotable) {
                history.push({ pathname: wizardRoutes.QUOTE_DECLINE });
            } else {
                history.push({ pathname: wizardRoutes.MC_SAVINGS_PAGE });
            }
        }
    }, [multiQuoteObject, multiQuoteError]);

    const rightLeftToggleValues = [{
        value: 'L',
        name: 'Left'
    }, {
        value: 'R',
        name: 'Right'
    }];
    const transmissionTypeValues = [{
        value: '001',
        name: 'Automatic'
    }, {
        value: '002',
        name: 'Manual'
    }];

    const handleEditMode = (e) => {
        if (e) {
            setIsInEditMode(true);
        } else {
            setIsInEditMode(false);
            if (typeof onFind === 'function') {
                onFind();
                displayRerateModal();
            } else if (history.location.state && history.location.state.fromPage === wizardRoutes.MC_SAVINGS_PAGE) {
                navigateToSavingsPage();
            } else {
                handleForward();
            }
        }
    };

    const handleWrongCarLinkClick = () => {
        if (typeof onFind === 'function') {
            const { details, vehicle } = previousVehicleDetails;
            setVehicleDetails((details) ? { data: details } : {});
            _.set(submissionVM, 'lobData.privateCar.coverables.vehicles.children[0].value', vehicle);
            onFind();
        } else {
            handleBackward();
        }
    };

    const validationSchema = yup.object({
        drivingSide: yup.string()
            .VMValidation('lobData.privateCar.coverables.vehicles.children[0].drivingSide', null, submissionVM),
        alarmImmobilizer: yup.string()
            .VMValidation('lobData.privateCar.coverables.vehicles.children[0].alarmImmobilizer', null, submissionVM),
        importType: yup.string()
            .VMValidation('lobData.privateCar.coverables.vehicles.children[0].importType', null, submissionVM),
        numberOfSeats: yup.string()
            .VMValidation('lobData.privateCar.coverables.vehicles.children[0].numberOfSeats', null, submissionVM),
        transmission: yup.string()
            .VMValidation('lobData.privateCar.coverables.vehicles.children[0].transmission', null, submissionVM),
    });

    const handleValidation = (isValid) => {
        setEnabled(isValid);
    };

    const getToggleText = (id, type) => {
        const isAlarm = (type === 'alarm');
        const returnText = ((isAlarm ? alarmImmobilizers : rightLeftToggleValues)
            .filter((val) => val.value === id)[0]);
        return isAlarm ? returnText.label : returnText.name;
    };
    return (
        <Container className="vehicle-details-container">
            {error && (
                <div className="customize-quote-car-finder__error-box">
                    <span>{error}</span>
                </div>
            )}
            {localVehicleData ? (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor id="page-vehicle-details-title" text={messages.headerMessage} Tag="h1" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDDataCard
                                className="mt-0"
                                title={formatRegNumber(localVehicleData.registrationsNumber)}
                                description={`${localVehicleData.make} ${localVehicleData.model}`}
                                data={{
                                    engine: localVehicleData.engineSize,
                                    fuel: localVehicleData.fuelType,
                                    doors: localVehicleData.numberOfDoors
                                }}
                                onLinkClick={handleWrongCarLinkClick}
                                linkText={!navigationFlag && !setmilestoneEdit.trigger && messages.wrongCarLink}
                                hideGoBack={hideGoBack} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {!localVehicleData.registrationsNumber && (
                                <div className="info-div margin-top-lg-desktop-md-mobile">
                                    <HDInfoCardRefactor id="page-vehicle-details-info-card">
                                        <img src={exclamation} alt="info" />
                                        <p>{messages.noRegInfo}</p>
                                    </HDInfoCardRefactor>
                                </div>
                            )}
                        </Col>
                    </Row>
                    <Row className="margin-top-md">
                        <Col xs={12} md={8}>
                            <HDLabelRefactor
                                id="page-vehicle-details-car-transmition"
                                text={messages.carTransmission}
                                Tag="h2" />

                            {((localVehicleData.transmission && !isInEditMode && !isEditQuoteJourney)
                                ? (
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.transmission}` }}
                                        id="transmission_button_group"
                                        className=""
                                        availableValues={[{
                                            value: '',
                                            name: localVehicleData.transmission === '001' ? 'Automatic' : 'Manual'
                                        }]}
                                        name="availableTransmission"
                                        path="lobData.privateCar.coverables.vehicles.children[0].transmission"
                                        btnGroupClassName="grid grid--col-2" />
                                )
                                : (
                                    <HDForm submissionVM={submissionVM} validationSchema={validationSchema} onValidation={handleValidation}>
                                        <HDToggleButtonGroup
                                            webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.transmission}` }}
                                            id="transmission_button_group"
                                            path="lobData.privateCar.coverables.vehicles.children[0].transmission"
                                            name="transmission"
                                            availableValues={transmissionTypeValues}
                                            btnGroupClassName="grid grid--col-2" />
                                    </HDForm>
                                ))}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <HDLabelRefactor id="page-vehicle-details-info-msg" text={messages.verifyInformationMessage} Tag="h2" />
                        </Col>
                    </Row>
                    <div className="vehicle-details__information-section" hidden={isInEditMode}>
                        <Row className="margin-bottom-lg">
                            <Col>
                                <HDLabelRefactor
                                    id="page-vehicle-details-hand-drive"
                                    className="margin-bottom-sm icon-small"
                                    text={`${getToggleText(localVehicleData.drivingSide, 'side')}-hand drive`}
                                    iconPosition="l"
                                    Tag="p"
                                    icon={<img src={steeringWheel} alt="steering" />} />
                                <HDLabelRefactor
                                    id="page-vehicle-details-alarm"
                                    className="margin-bottom-sm icon-small"
                                    text={getToggleText(localVehicleData.alarmImmobilizer, 'alarm')}
                                    iconPosition="l"
                                    Tag="p"
                                    icon={<img src={alarm} alt="alarm" />} />
                                <HDLabelRefactor
                                    id="page-vehicle-details-imported"
                                    className="margin-bottom-sm icon-small"
                                    text={localVehicleData.importType === 'no' ? 'Not imported' : 'Imported'}
                                    iconPosition="l"
                                    Tag="p"
                                    icon={<img src={imported} alt="import" />} />
                                <HDLabelRefactor
                                    id="page-vehicle-details-seats"
                                    className="margin-bottom-sm icon-small"
                                    text={localVehicleData.numberOfSeats && localVehicleData.numberOfSeats ? localVehicleData.numberOfSeats
                                        + (localVehicleData.numberOfSeats === '1' ? ' seat' : ' seats') : ''}
                                    iconPosition="l"
                                    Tag="p"
                                    icon={<img src={seats} alt="seat" />} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} md={4}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.informationCorrect }}
                                    id="page-vehicle-details-edit-yes"
                                    label="Yes"
                                    variant="default"
                                    disabled={!isEnabled && localVehicleData.transmission === ''}
                                    className="vehicle-details__yes-button btn-block"
                                    onClick={() => handleEditMode(false)} />
                            </Col>
                            <Col xs={6} md={4}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.informationCorrect }}
                                    id="page-vehicle-details-edit-no"
                                    label="No"
                                    variant="default"
                                    className="vehicle-details__no-button btn-block"
                                    onClick={() => handleEditMode(true)} />
                            </Col>
                        </Row>
                    </div>
                    <div className="vehicle-details__edit" hidden={!isInEditMode}>
                        <HDForm submissionVM={submissionVM} validationSchema={validationSchema}>
                            <Row>
                                <Col xs={12} md={8}>
                                    <HDLabelRefactor
                                        id="page-vehicle-details-edit-hand-side"
                                        className="margin-bottom-sm icon-small"
                                        text="Left or right hand drive"
                                        iconPosition="l"
                                        Tag="h5"
                                        icon={<img src={steeringWheel} alt="steering" />} />
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.rightLeft}` }}
                                        id="driving-side-button-group"
                                        path="lobData.privateCar.coverables.vehicles.children[0].drivingSide"
                                        name="drivingSide"
                                        availableValues={rightLeftToggleValues}
                                        btnGroupClassName="grid grid--col-2" />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={8}>
                                    <HDLabelRefactor
                                        id="page-vehicle-details-edit-security"
                                        className="margin-bottom-sm margin-top-md icon-small"
                                        text="Security"
                                        iconPosition="l"
                                        Tag="h5"
                                        icon={<img src={alarm} alt="alarm" />} />
                                    <HDDropdownList
                                        webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.security}` }}
                                        id="security-dropdown-list"
                                        path="lobData.privateCar.coverables.vehicles.children[0].alarmImmobilizer"
                                        name="alarmImmobilizer"
                                        options={alarmImmobilizers}
                                        theme="blue" />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={8}>
                                    <HDLabelRefactor
                                        id="page-vehicle-details-edit-imported"
                                        className="margin-bottom-sm margin-top-md icon-small"
                                        text="Imported"
                                        iconPosition="l"
                                        Tag="h5"
                                        icon={<img src={imported} alt="imported" />} />
                                    <HDDropdownList
                                        webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.imported}` }}
                                        id="imported-dropdown-list"
                                        path="lobData.privateCar.coverables.vehicles.children[0].importType"
                                        name="importType"
                                        options={importTypes}
                                        theme="blue"
                                        isSearchable={false} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={8}>
                                    <HDLabelRefactor
                                        id="page-vehicle-details-edit-seats"
                                        className="margin-bottom-sm margin-top-md icon-small"
                                        text="Seats"
                                        iconPosition="l"
                                        Tag="h5"
                                        icon={<img src={seats} alt="seats" />} />
                                    <HDDropdownList
                                        webAnalyticsEvent={{ event_action: `${messages.informationCorrect} - ${messages.seats}` }}
                                        id="seats-dropdown-list"
                                        path="lobData.privateCar.coverables.vehicles.children[0].numberOfSeats"
                                        name="numberOfSeats"
                                        options={seatsList}
                                        theme="blue"
                                        isSearchable={false}
                                        enableNative />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.informationCorrect }}
                                        id="page-vehicle-details-edit-confirm"
                                        className="vehicle-details__edit__confirm-button margin-top-md"
                                        onClick={() => handleEditMode(false)}
                                        disabled={!isEnabled && localVehicleData.transmission === ''}
                                        label="Confirm"
                                        variant="primary" />
                                </Col>
                            </Row>
                        </HDForm>
                    </div>
                    <HDModal
                        customStyle="customize-quote"
                        show={showRerateModal}
                        headerText={messagesTwo.rerateModalHeader}
                        confirmLabel={messagesTwo.rerateModalConfirmLabel}
                        onConfirm={hideRerateModal}
                        hideCancelButton
                        hideClose
                    >
                        <p>
                            {messagesTwo.rerateModalContent}
                        </p>
                    </HDModal>
                </>
            )
                : (
                    <>
                        {HDFullscreenLoader}
                    </>
                )
            }
            {HDFullscreenLoader}
        </Container>
    );
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    multiQuote: multiQuoteAction,
    setVehicleDetails: setVehicleDetailsAction,
};

const mapStateToProps = (state) => {
    return {
        vehicleDetails: state.vehicleDetails.data,
        getPriceNavigationFlag: state.wizardState.app.isEditQuoteJourney,
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiQuoteObject: state.multiQuoteModel.multiQuoteObj,
        multiQuoteError: state.multiQuoteModel.multiQuoteError,
        savingsPageRerateModal: state.wizardState.app.savingsPageRerateModal,
        setmilestoneEdit: state.setmilestoneEdit,
        hideGoBack: state.wizardState.app.hideGoBack
    };
};

HDVehicleDetailsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    vehicleDetails: PropTypes.shape({}).isRequired,
    previousVehicleDetails: PropTypes.shape({ details: PropTypes.shape({}).isRequired, vehilce: PropTypes.shape({}).isRequired }),
    onFind: PropTypes.func,
    handleForward: PropTypes.func.isRequired,
    handleBackward: PropTypes.func.isRequired,
    displayRerateModal: PropTypes.func,
    multiQuoteObject: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        accountNumber: PropTypes.string,
        quotes: PropTypes.array,
        mpwrapperJobNumber: PropTypes.string,
        mpwrapperNumber: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    multiQuoteError: PropTypes.shape({}),
    savingsPageRerateModal: PropTypes.bool,
    history: PropTypes.shape({
        push: PropTypes.func,
        location: PropTypes.object
    }).isRequired,
    setVehicleDetails: PropTypes.func.isRequired,
};

HDVehicleDetailsPage.defaultProps = {
    previousVehicleDetails: { details: {}, vehicle: {} },
    onFind: null,
    displayRerateModal: () => { },
    multiQuoteObject: null,
    multiQuoteError: null,
    savingsPageRerateModal: false
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDVehicleDetailsPage));
