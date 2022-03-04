/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo
} from 'react';
import PropType from 'prop-types';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsVehicleInfoLookupService } from 'hastings-capability-vehicleinfolookup';
import { AnalyticsHDDropdownList as HDDropdownList, AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../web-analytics';
import fuelTypes from '../../constant/fuelTypes';
import {
    getNumberOfDoors, getYears, MAKE, MODEL, FUEL, REGISTRATION_YEAR,
    TRANSMISSION, NUMBER_OF_DOORS, ENGINE_SIZE, BODY_TYPE
}

    from './HDSearchVehicleHelper';
import { TranslatorContext } from '../../integration/TranslatorContext';
import {
    findCar,
    MAKE_SERVICE_ERROR,
    MODEL_SERVICE_ERROR,
    VEHICLE_DATE_ERROR,
    REQUIRED_FIELD_ERROR,
    confirmText,
    cancelText,
    placeholderText
} from './HDSearchVehiclePage.messages';
// import './HDSearchVehiclePage.scss';
import * as messages from './HDSearchVehiclePage.messages';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';

const HDSearchVehiclePage = ({
    trigger,
    onConfirm,
    submissionVM,
    pageMetadata
}) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [engineSize, setEngineSize] = useState([]);
    const [transmission, setTransmission] = useState([]);
    const [makeOptions, setMakeOptions] = useState([]);
    const [bodyTypeValues, setBodyTypeValues] = useState([]);
    const [isLoading, setLoader] = useState([false]);
    const [errorMessages, setError] = useState({});
    const [makeServiceError, setMakeError] = useState(false);
    const [modelServiceError, setModelError] = useState(false);
    const [vehicleDataError, setVehicleDataError] = useState(false);
    const [confirmClicked, setConfirmClicked] = useState(false);
    const [vehicleLookup, setVehicle] = useState({
        make: '',
        model: '',
        year: '',
        engineSize: '',
        fuelType: '',
        transmission: '',
        numberOfDoors: '',
        body: ''
    });
    const [touchedFields, setTouchedFields] = useState({});
    const handleTouched = ({ target: { name } }) => {
        if (!touchedFields[name]) {
            setTouchedFields({ ...touchedFields, [name]: true });
        }
    };
    const translator = useContext(TranslatorContext);
    const viewModelService = useContext(ViewModelServiceContext);
    const bodyTypeDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.vehicleinfo.dto.response.HastingsVehicleInfoLookupResultDTO'
    );
    const getbodyTypes = bodyTypeDTO ? _.get(bodyTypeDTO, 'vehicleBodyType')
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
        }) : [];
    const PRIVATE_CAR = 'PrivateCar_Ext';

    function getMakes() {
        setMakeError('');
        HastingsVehicleInfoLookupService.retrieveManufacturers([{ productCodeType: PRIVATE_CAR }])
            .then((manufacturers) => {
                if (manufacturers.result === undefined) {
                    setLoader(false);
                    setMakeError(MAKE_SERVICE_ERROR);
                    trackAPICallFail(messages.retrieveManufacturers, MAKE_SERVICE_ERROR);
                } else {
                    setMakeOptions(manufacturers.result.map((manufacturer) => ({
                        value: manufacturer, label: manufacturer
                    })));
                    setLoader(false);
                    trackAPICallSuccess(messages.retrieveManufacturers);
                }
            })
            .catch((error) => {
                setLoader(false);
                setMakeError(MAKE_SERVICE_ERROR);
                trackAPICallFail(messages.retrieveManufacturers, MAKE_SERVICE_ERROR);
            })
            .finally(() => {
            });
    }

    useEffect(() => {
        getMakes();
    }, []);

    function getModels(makeOption) {
        setModelError('');
        HastingsVehicleInfoLookupService.retrieveModels(
            [{ productCodeType: PRIVATE_CAR, manufacturerName: makeOption.toLowerCase() }]
        )
            .then((modelInfo) => {
                if (modelInfo && modelInfo.result === undefined) {
                    setModelError(MODEL_SERVICE_ERROR);
                    trackAPICallFail(messages.retrieveModels, MODEL_SERVICE_ERROR);
                } else {
                    setModels(modelInfo.result.map((modelValue) => ({
                        value: modelValue.toLowerCase(), label: modelValue
                    })));
                    trackAPICallSuccess(messages.retrieveModels);
                }
            })
            .catch((error) => {
                setModelError(MODEL_SERVICE_ERROR);
                trackAPICallFail(messages.retrieveModels, MODEL_SERVICE_ERROR);
            })
            .finally(() => {
            });
    }

    function getDetailsFromModel(modelOption) {
        setVehicleDataError('');
        HastingsVehicleInfoLookupService.retrieveVehicleData(
            [{ productCodeType: PRIVATE_CAR, manufacturerName: make.toUpperCase(), modelName: modelOption.toUpperCase() }]
        )
            .then((vehicleInfo) => {
                // eslint-disable-next-line no-empty
                if (vehicleInfo && vehicleInfo.result === undefined) {
                    setVehicleDataError(VEHICLE_DATE_ERROR);
                    trackAPICallFail(messages.retrieveVehicleData, VEHICLE_DATE_ERROR);
                } else {
                    setBodyTypeValues(getbodyTypes);
                    setYears(getYears(vehicleInfo.result[0].startYear, vehicleInfo.result[0].endYear));
                    setEngineSize([{ value: vehicleInfo.result[0].engineSize, label: vehicleInfo.result[0].engineSize }]);
                    setTransmission([{
                        value: vehicleInfo.result[0].transmission,
                        label: vehicleInfo.result[0].transmission
                    }]);
                    trackAPICallSuccess(messages.retrieveVehicleData);
                }
            })
            .catch(() => {
                setVehicleDataError(VEHICLE_DATE_ERROR);
                trackAPICallFail(messages.retrieveVehicleData, VEHICLE_DATE_ERROR);
            })
            .finally(() => {
            });
    }

    const makeFieldname = 'make';
    const modelFieldName = 'model';
    const fuelFieldName = 'fuelType';
    const registrationYearFieldName = 'year';
    const doorFieldName = 'numberOfDoors';
    const engineSizeName = 'engineSize';
    const transmissionName = 'transmission';
    const bodyTypeName = 'body';
    const handleChange = ({ target: { name, value } }) => {
        setVehicle({ ...vehicleLookup, [name]: value });
        if (name === makeFieldname) {
            setMake(value.value);
            setModel('');
            setModels([]);
            setEngineSize([]);
            setTransmission([]);
            setYears([]);
            setBodyTypeValues([]);
            setVehicle({
                make: value,
                model: '',
                year: '',
                numberOfDoors: '',
                fuelType: '',
                transmission: '',
                engineSize: '',
                body: ''
            });
            getModels(value.value);
        }
        if (name === modelFieldName) {
            setModel(value.value);
            setEngineSize([]);
            setTransmission([]);
            setYears([]);
            setBodyTypeValues([]);
            setVehicle({
                ...vehicleLookup,
                model: value,
                year: '',
                numberOfDoors: '',
                fuelType: '',
                transmission: '',
                engineSize: '',
                body: ''
            });
            getDetailsFromModel(value.value);
        }
    };

    const validate = ({
        make,
        model,
        year,
        numberOfDoors,
        fuelType,
        engineSize,
        transmission,
        body
    }) => {
        const nextErrors = {};
        if (!make || make === '') {
            nextErrors.make = REQUIRED_FIELD_ERROR;
        }
        if (!model && model === '') {
            nextErrors.model = REQUIRED_FIELD_ERROR;
        }
        if (!numberOfDoors || numberOfDoors === '') {
            nextErrors.numberOfDoors = REQUIRED_FIELD_ERROR;
        }
        if (!transmission || transmission === '') {
            nextErrors.transmission = REQUIRED_FIELD_ERROR;
        }
        if (!fuelType || fuelType === '') {
            nextErrors.fuelType = REQUIRED_FIELD_ERROR;
        }
        if (!year || year === '') {
            nextErrors.year = REQUIRED_FIELD_ERROR;
        }
        if (!engineSize || engineSize === '') {
            nextErrors.engineSize = REQUIRED_FIELD_ERROR;
        }
        if (!body || body === '') {
            nextErrors.body = REQUIRED_FIELD_ERROR;
        }
        setError(nextErrors);
        setConfirmClicked(false);
    };
    const debouncedValidate = useCallback(_.debounce(validate, 200), []);
    const disabledConfirmButton = () => {
        return Object.keys(errorMessages).length > 0;
    };
    const addVehicleToStore = () => {
        setConfirmClicked(true);
        if (!disabledConfirmButton()) {
            onConfirm({
                make: vehicleLookup.make.value,
                model: vehicleLookup.model.value,
                year: vehicleLookup.year.value,
                engineSize: vehicleLookup.engineSize.value,
                transmission: vehicleLookup.transmission.value,
                numberOfDoors: vehicleLookup.numberOfDoors.value,
                fuelType: vehicleLookup.fuelType.value,
                body: vehicleLookup.body.label
            });
        }
    };
    const onBeforeOpen = () => {
        setMake(undefined);
        setModel(undefined);
        setError({});
        setVehicle({});
        setConfirmClicked(false);
    };

    useEffect(() => {
        debouncedValidate(vehicleLookup);
    }, [vehicleLookup, debouncedValidate]);
    return (
        <div className="vrn-search-modal-wrapper">
            <HDOverlayPopup
                webAnalyticsEvent={{ event_action: messages.makeModelSearch }}
                webAnalyticsView={{ ...pageMetadata, page_section: messages.makeModelSearch }}
                id="mvl-overlay-popup"
                confirmButton={confirmText}
                cancelButton={cancelText}
                labelText={findCar}
                className="overlayContainer"
                onConfirm={addVehicleToStore}
                overlayButtonIcon={trigger}
                onBeforeOpen={onBeforeOpen}
                hideOnConfirm={!disabledConfirmButton()}
                showButtons
            >
                <div className="fitContent">
                    <HDDropdownList
                        webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.MAKE_LABEL}` }}
                        id="make_select_lookup"
                        name={makeFieldname}
                        label={MAKE}
                        className="drop_down"
                        options={makeOptions}
                        value={vehicleLookup.make}
                        onBlur={handleTouched}
                        placeholder={placeholderText}
                        onChange={handleChange} />
                    {makeServiceError && <div className="error">{makeServiceError}</div>}
                    {errorMessages.make && confirmClicked && (
                        <div className="error">
                            {errorMessages.make}
                        </div>
                    )}
                    {make && (
                        <HDDropdownList
                            webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.MODEL_LABEL}` }}
                            id="model_select"
                            label={MODEL}
                            name={modelFieldName}
                            options={models}
                            value={vehicleLookup.model}
                            onBlur={handleTouched}
                            placeholder={placeholderText}
                            className="drop_down"
                            onChange={handleChange} />
                    )}
                    {modelServiceError && <div className="error">{modelServiceError}</div>}
                    {errorMessages.model && confirmClicked && (
                        <div className="error">
                            {errorMessages.model}
                        </div>
                    )}
                    {model && (
                        <>
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.BODY_TYPE_LABEL}` }}
                                id="body_type_select"
                                name={bodyTypeName}
                                label={BODY_TYPE}
                                className="drop_down"
                                value={vehicleLookup.body}
                                options={bodyTypeValues}
                                onChange={handleChange}
                                onBlur={handleTouched} />
                            {errorMessages.body && confirmClicked && (
                                <div className="error">
                                    {errorMessages.body}
                                </div>
                            )}
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.FUEL_LABEL}` }}
                                id="fuel_select"
                                name={fuelFieldName}
                                label={FUEL}
                                value={vehicleLookup.fuelType}
                                options={fuelTypes}
                                className="drop_down"
                                onChange={handleChange}
                                onBlur={handleTouched} />
                            {errorMessages.fuelType && confirmClicked && (
                                <div className="error">
                                    {errorMessages.fuelType}
                                </div>
                            )}
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.YEAR_LABEL}` }}
                                id="registration_year_select"
                                name={registrationYearFieldName}
                                label={REGISTRATION_YEAR}
                                value={vehicleLookup.year}
                                onBlur={handleTouched}
                                onChange={handleChange}
                                className="drop_down"
                                options={years} />
                            {errorMessages.year && confirmClicked && (
                                <div className="error">
                                    {errorMessages.year}
                                </div>
                            )}
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.DOOR_LABEL}` }}
                                id="doors_number_select"
                                name={doorFieldName}
                                label={NUMBER_OF_DOORS}
                                onChange={handleChange}
                                onBlur={handleTouched}
                                className="drop_down"
                                value={vehicleLookup.numberOfDoors}
                                options={getNumberOfDoors} />
                            {errorMessages.numberOfDoors && confirmClicked && (
                                <div className="error">
                                    {errorMessages.numberOfDoors}
                                </div>
                            )}
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.TRANSMISSION_LABEL}` }}
                                id="transmission_select"
                                name={transmissionName}
                                label={TRANSMISSION}
                                onChange={handleChange}
                                onBlur={handleTouched}
                                className="drop_down"
                                value={vehicleLookup.transmission}
                                options={transmission} />
                            {errorMessages.transmission && confirmClicked && (
                                <div className="error">
                                    {errorMessages.transmission}
                                </div>
                            )}
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.makeModelSearch} - ${messages.ENGINE_LABEL}` }}
                                id="engine_size_select"
                                name={engineSizeName}
                                onChange={handleChange}
                                label={ENGINE_SIZE}
                                className="drop_down"
                                value={vehicleLookup.engineSize}
                                onBlur={handleTouched}
                                options={engineSize} />
                            {errorMessages.engineSize && confirmClicked && (
                                <div className="error">
                                    {errorMessages.engineSize}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {vehicleDataError && <div className="error">{vehicleDataError}</div>}
            </HDOverlayPopup>
        </div>
    );
};
HDSearchVehiclePage.PropType = {
    history: PropType.shape({
        push: PropType.func
    }).isRequired,
    dispatch: PropType.func.isRequired,
    trigger: PropType.node.isRequired,
    onConfirm: PropType.func.isRequired,
    pageMetadata: PropType.shape({
        page_name: PropType.string.isRequired,
        page_type: PropType.string.isRequired,
        sales_journey_type: PropType.string.isRequired
    }).isRequired,
};
export default HDSearchVehiclePage;
