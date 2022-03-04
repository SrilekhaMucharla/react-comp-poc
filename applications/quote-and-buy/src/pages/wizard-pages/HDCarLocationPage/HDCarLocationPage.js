/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, {
    useState, useEffect, useCallback, useContext, useRef
} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
// import './HDCarLocationPage.scss';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import {
    HDForm, HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDCarLocation.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';

const firstLevelParkingValue = (element) => ['4', '3', 'H', '1', 'I'].includes(element.value);
const secondLevelParkingValue = (element) => ['7', 'F', 'E', '2', 'B'].includes(element.value);

const HDCarLocationPage = (props) => {
    const {
        submissionVM,
        // eslint-disable-next-line react/prop-types
        setNavigation,
        pageMetadata
    } = props;
    // eslint-disable-next-line no-unused-vars
    const [carParkingPostalCode, setCarParkingPostalCode] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [CarOverNight, setCarOverNight] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [carParkingLocation, setCarParkingLocation] = useState(null);
    const [carSelectedParkingLocation, setCarSelectedParkingLocation] = useState({});
    const [someWhereValue, setSomeWhereValue] = useState();
    const [resetValue, setResetValue] = useState();
    const [internalDataCheck, setInternalDataCheck] = useState();
    const [chekingPostcodeInProgress, setChekingPostcodeInProgress] = useState(false);
    const [postcodeErrorMessage, setPostcodeErrorMessage] = useState('');
    const [postcodeIsValid, setPostcodeIsValid] = useState(false);
    const inputRef = useRef(null);

    const translator = useContext(TranslatorContext);

    const showMore = useCallback(
        (element) => {
            if (!element) {
                return false;
            }

            // value is handled by two different components that stores this data in different way
            if (typeof element === 'object') {
                return true;
            }
            return (
                element === messages.someWhereElse ||
                element === '7' ||
                element === 'F' ||
                element === '2' ||
                element === 'E' ||
                element === 'B' ||
                element === 'false'
            );
        },
        [_.get(submissionVM, `${isCarHomeOvernightPath}.value`, `${usualParkingLocationPath}.value`, `${isCarHomeOvernightPath}.value`)]
    );

    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const isCarHomeOvernightFieldName = 'isOvernightLocationHome';
    const isCarHomeOvernightPath = `${vehiclePath}.${isCarHomeOvernightFieldName}`;
    const overNightPostalCodeFieldName = 'overnightLocationPostcode';
    const overNightPostalCodePath = `${vehiclePath}.${overNightPostalCodeFieldName}`;
    const usualParkingLocationFieldName = 'overnightParkingArrangements';
    const usualParkingLocationPath = `${vehiclePath}.${usualParkingLocationFieldName}`;

    const validationSchema = yup.object({
        [isCarHomeOvernightFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(isCarHomeOvernightPath, null, submissionVM),
        [overNightPostalCodeFieldName]: yup.string()
            .when(`${isCarHomeOvernightFieldName}`, (value, schema) => {
                return showMore(value) ? schema : schema.required(messages.postalCodeErrorMessage);
            })
            .max(10, messages.postalCodeErrorMessage)
            .VMValidation(overNightPostalCodePath, null, submissionVM),
        [usualParkingLocationFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(usualParkingLocationPath, null, submissionVM)
    });

    const availableValues = [{
        value: 'true',
        name: messages.yes
    }, {
        value: 'false',
        name: messages.no
    }];

    const dropDownLabel = { text: messages.where, Tag: 'h2' };
    // eslint-disable-next-line no-unused-vars
    const iconArray = ['car', 'car', 'car-side', 'car-crash', 'car-alt', 'car'];
    const availableFirstParkingLocationValues = submissionVM
        ? _.get(submissionVM, usualParkingLocationPath)
            .aspects
            .availableValues
            // eslint-disable-next-line no-unused-vars
            .map((typeCode, index) => {
                return {
                    value: typeCode.code,
                    name: translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    }),
                };
            }) : [];

    const availableParkingValues = _.filter(availableFirstParkingLocationValues, firstLevelParkingValue);
    availableParkingValues.push({
        value: messages.someWhereElse,
        name: messages.someWhereElse,
    });

    const dropDownOption = _.filter(availableFirstParkingLocationValues, secondLevelParkingValue)
        .map((element) => ({
            value: element.value,
            label: element.name
        }));

    const fetchBusinessesFinalData = useCallback(() => {
        const parkingLocationValue = _.get(submissionVM, `${usualParkingLocationPath}.value`);
        if (
            parkingLocationValue !== undefined &&
            (parkingLocationValue.code === '7' ||
                parkingLocationValue.code === 'F' ||
                parkingLocationValue.code === '2' ||
                parkingLocationValue.code === 'E' ||
                parkingLocationValue.code === 'B')
        ) {
            setSomeWhereValue(messages.someWhereElse);
        }
        const carOvernightValue = _.get(submissionVM, `${overNightPostalCodePath}.value`);
        if (carOvernightValue) {
            setResetValue(false);
        } else {
            _.set(submissionVM, `${overNightPostalCodePath}.value`, '');
            setResetValue(true);
        }
    }, [setCarParkingPostalCode]);

    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        fetchBusinessesFinalData();
    }, [fetchBusinessesFinalData]);

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({
            canForward: false,
            showForward: true
        });

        const postalCode = _.get(submissionVM, `${overNightPostalCodePath}.value`);
        if (postalCode) {
            setCarParkingPostalCode(postalCode.replace(/\s+/g, ''));
            setPostcodeIsValid(true);
        }
    }, []);

    useEffect(() => {
        const postalCode = _.get(submissionVM, `${overNightPostalCodePath}.value`);
        if (internalDataCheck && postalCode) {
            _.set(submissionVM, `${overNightPostalCodePath}.value`, postalCode.replace(/\s+/g, ''));
        }
    }, [internalDataCheck]);

    const makePostcodeApiCheck = () => {
        if (!carParkingPostalCode || carParkingPostalCode.length < 5) {
            setPostcodeErrorMessage(messages.postalCodeErrorMessage);
        } else if (!chekingPostcodeInProgress) {
            setChekingPostcodeInProgress(true);
            setPostcodeIsValid(false);
            setPostcodeErrorMessage('');
            HastingsAddressLookupService.lookupAddressByPostCode(carParkingPostalCode.replace(/\s+/g, ''))
                .then(() => {
                    setPostcodeErrorMessage('');
                    setPostcodeIsValid(true);
                })
                .catch((er) => {
                    if (er.error.data.appError === 'GW_ENTITY_NOT_FOUND_ERROR') {
                        setPostcodeErrorMessage(messages.postalCodeErrorMessage);
                    } else {
                        setPostcodeErrorMessage(messages.serviceDownErrorMessage);
                    }
                    setPostcodeIsValid(false);
                })
                .finally(() => {
                    setChekingPostcodeInProgress(false);
                });
        }
    };

    const handleValidation = (isValid) => {
        const carOvernightValueCheck = _.get(submissionVM, `${overNightPostalCodePath}.value`);
        const overnightLocationValueCheck = _.get(submissionVM, `${isCarHomeOvernightPath}.value`);
        const usualParkingLocationCheck = _.get(submissionVM, `${usualParkingLocationPath}.value`);
        setInternalDataCheck(true);

        if (chekingPostcodeInProgress) { setInternalDataCheck(false); }

        if (usualParkingLocationCheck === undefined) { setInternalDataCheck(false); }

        if (overnightLocationValueCheck &&
            overnightLocationValueCheck.toString() === 'false' &&
            !postcodeIsValid) {
            setInternalDataCheck(false);
        }

        if (overnightLocationValueCheck &&
            overnightLocationValueCheck.toString() === 'false' &&
            (carOvernightValueCheck === null || carOvernightValueCheck === undefined || carOvernightValueCheck === '')) {
            setInternalDataCheck(false);
        }

        if (overnightLocationValueCheck &&
            overnightLocationValueCheck.toString() === 'true' &&
            usualParkingLocationCheck !== undefined) {
            setNavigation({ canForward: internalDataCheck });
        } else {
            setNavigation({ canForward: isValid && internalDataCheck });
        }
    };
    const trackCarOvernightChange = (event) => {
        setCarOverNight(event.target.value);
        const carOvernightValue = _.get(submissionVM, `${overNightPostalCodePath}.value`);
        if (carOvernightValue && event.target.value === 'true') {
            _.set(submissionVM, `${overNightPostalCodePath}.value`, '');
            setCarParkingPostalCode('');
            setResetValue(true);
            setInternalDataCheck(true);
            setPostcodeErrorMessage('');
        }

        if (event.target.value === 'true') {
            setResetValue(true);
            setPostcodeErrorMessage('');
        } else {
            setResetValue(true);
        }
    };
    const handlePostalCodeEventChange = (event) => {
        setResetValue(false);
        setCarParkingPostalCode(event.target.value);
        setPostcodeErrorMessage('');
    };
    const trackParkingLocationChange = (event, hdProps) => {
        hdProps.setFieldTouched(`${usualParkingLocationFieldName}`, false, false);
        setSomeWhereValue(null);
        if (event.target.value === messages.someWhereElse) {
            setSomeWhereValue(messages.someWhereElse);
        }

        setCarParkingLocation(event.target.value);
        setCarSelectedParkingLocation({});
        if (event.target.value === messages.someWhereElse) {
            _.set(submissionVM, `${usualParkingLocationPath}.value`, '');
        } else {
            _.set(submissionVM, `${usualParkingLocationPath}.value`, event.target.value);
        }
    };
    const handleSelectEventChange = (event) => {
        setCarSelectedParkingLocation(event.target.value);
        _.set(submissionVM, `${usualParkingLocationPath}.value`, event.target.value.value);
    };

    const locationOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.carLocation} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.carLocation} Info` }}
            id="carLocationGeneralverlay"
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
            labelText={messages.overlayHeaderOne}
        >
            <p>{messages.overlayContentOne}</p>
        </HDOverlayPopup>
    );

    return (
        <Container className="car-location-container">
            <Row>
                <Col>
                    <HDForm submissionVM={submissionVM} validationSchema={validationSchema} onValidation={handleValidation}>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.homeOverNightHeaderText }}
                            id="car-home-overnight-button-group"
                            path={isCarHomeOvernightPath}
                            name={isCarHomeOvernightFieldName}
                            availableValues={availableValues}
                            label={{
                                Tag: 'h2',
                                text: messages.homeOverNightHeaderText,
                            }}
                            onChange={trackCarOvernightChange}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3"
                        >
                            <HDInfoCardRefactor
                                image={exclamationIcon}
                                paragraphs={[messages.infoCardBodyOne]}
                                id="car-location-parking-night-info"
                                className="car-location__info-card" />
                        </HDToggleButtonGroup>
                        <hr />
                        {(hdProps) => {
                            return (
                                <>
                                    {showMore(hdProps.values[isCarHomeOvernightFieldName]) && (
                                        <>
                                            <Row>
                                                <Col xs={12}>
                                                    <HDLabelRefactor
                                                        Tag="h2"
                                                        text={messages.postalCodeHeader}
                                                        className="margin-bottom-md"
                                                        id="car-location-postcode-label" />
                                                </Col>
                                            </Row>
                                            <div className="form-group">
                                                <Row className={`${hdProps.errors[overNightPostalCodeFieldName] || postcodeErrorMessage.length > 0
                                                    ? 'is-invalid'
                                                    : ''}`}
                                                >
                                                    <Col xs={12} xl={8} className="clear-child-margins">
                                                        <HDTextInput
                                                            reference={inputRef}
                                                            webAnalyticsEvent={{ event_action: messages.postalCodeHeader }}
                                                            type="postcode"
                                                            path={overNightPostalCodePath}
                                                            name={overNightPostalCodeFieldName}
                                                            id="car-location-postcode-input"
                                                            placeholder={messages.enterPostalCode}
                                                            maxLength="10"
                                                            reset={resetValue}
                                                            onChange={handlePostalCodeEventChange}
                                                            onBlur={makePostcodeApiCheck}
                                                            onKeyPress={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    inputRef.current.blur();
                                                                }
                                                            }}
                                                            noErrorMessage />
                                                    </Col>
                                                </Row>
                                                <div className="invalid-feedback">
                                                    {postcodeErrorMessage.length > 0
                                                        ? postcodeErrorMessage
                                                        : messages.postalCodeErrorMessage}

                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    )}
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: messages.usualParkingHeader }}
                                        id="car-parking-location-button-group"
                                        path={usualParkingLocationPath}
                                        name={usualParkingLocationFieldName}
                                        availableValues={availableParkingValues}
                                        data={someWhereValue}
                                        label={{
                                            Tag: 'h2',
                                            text: messages.usualParkingHeader,
                                            icon: locationOverlay,
                                            iconPosition: 'r'
                                        }}
                                        onChange={(event) => trackParkingLocationChange(event, hdProps)}
                                        customClassName="no-feedback btn-mid-height"
                                        btnGroupClassName="capitalized-first-letter grid grid--col-2 grid--col-lg-3" />
                                    {showMore(hdProps.values[usualParkingLocationFieldName]) && (
                                        <>
                                            <hr />
                                            <HDDropdownList
                                                webAnalyticsEvent={{ event_action: messages.where }}
                                                selectSize="lg"
                                                path={usualParkingLocationPath}
                                                name={usualParkingLocationFieldName}
                                                id="car-location-where-parking-loc"
                                                className="capitalized-first-letter"
                                                label={dropDownLabel}
                                                theme={messages.dropdownTheme}
                                                options={dropDownOption}
                                                onChange={handleSelectEventChange}
                                                value={carSelectedParkingLocation} />
                                        </>
                                    )}
                                </>
                            );
                        }}
                    </HDForm>
                </Col>
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

HDCarLocationPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDCarLocationPage);
