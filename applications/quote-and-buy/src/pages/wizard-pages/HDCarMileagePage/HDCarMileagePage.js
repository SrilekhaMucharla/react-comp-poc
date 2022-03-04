/* eslint-disable max-len */
import React, {
    useState, useEffect, useCallback, useRef
} from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import {
    HDForm, HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import * as messages from './HDCarMileage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';

const HDCarMileagePage = (props) => {
    // eslint-disable-next-line no-unused-vars
    const timeFrameData = [
        { value: 'year', name: 'year' },
        { value: 'week', name: 'week' }
    ];
    // eslint-disable-next-line no-unused-vars
    const distanceUnitData = [
        { value: 'miles', name: 'miles' },
        { value: 'kilometers', name: 'kilometers' }
    ];
    const { submissionVM, setNavigation, pageMetadata } = props;
    const [miles, setUnitOfLength] = useState(messages.miles);
    const [year, setTimeFrame] = useState(messages.year);
    // eslint-disable-next-line no-unused-vars
    const [distanceValue, setDistanceValue] = useState(0);
    const [traveldistance, setTraveldistance] = useState(0);
    const [timespan, setTimespan] = useState(messages.year);
    const inputRef = useRef(null);
    const labelRef = useRef(null);

    function daysOfAYear() {
        const currentYear = new Date().getFullYear();
        // eslint-disable-next-line no-use-before-define
        return leapYear(currentYear) ? 366 : 365;
    }

    function leapYear(yearObj) {
        return (yearObj % 4 === 0 && yearObj % 100 !== 0) || yearObj % 400 === 0;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function displayDistancefinalData() {
        const daysinayear = daysOfAYear();
        if (miles === messages.miles && year === messages.year) {
            setTraveldistance((distanceValue / daysinayear) * 7);
            setTimespan(messages.week);
        } else if (miles === messages.miles && year === messages.week) {
            setTraveldistance(distanceValue);
            setTimespan(messages.week);
        }
    }

    const fetchBusinessesFinalData = useCallback(() => {
        displayDistancefinalData();
    }, [displayDistancefinalData]);

    useEffect(() => {
        setUnitOfLength(messages.miles);
        setTimeFrame(messages.year);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        fetchBusinessesFinalData();
    }, [miles, year, distanceValue, fetchBusinessesFinalData]);

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canForward: false, showForward: true });
        if (
            Boolean(submissionVM)
            && Boolean(submissionVM.lobData)
            && Boolean(submissionVM.lobData.privateCar)
            && Boolean(submissionVM.lobData.privateCar.coverables)
            && Boolean(submissionVM.lobData.privateCar.coverables.vehicles)
            && Boolean(submissionVM.lobData.privateCar.coverables.vehicles.children.length)
            && Boolean(submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage)
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage.value !== undefined
        ) {
            setDistanceValue(submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage.value);
        }
    }, [submissionVM, submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage.value]);

    if (!submissionVM) {
        return ' ';
    }

    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const distanceFieldname = 'annualMileage';
    const distancePathame = `${vehiclePath}.${distanceFieldname}`;
    const validationSchema = yup.object({
        [distanceFieldname]: yup
            .number()
            .transform((value) => (Number.isNaN(value) ? undefined : value))
            .min(1, messages.distanceFieldValidationMinError)
            .max(999999, messages.distanceFieldValidationMaxError)
            .required(messages.distanceFieldValidationError)
            .VMValidation(distancePathame, null, submissionVM)
    });

    const formatDistanceValue = (value) => {
        const inputdigit = (value) ? value.toString().replace(/[^0-9.]/g, '') : '';
        return inputdigit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // eslint-disable-next-line no-unused-vars
    const handleEventChange = (event, hdProps) => {
        if (submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage.value) {
            // eslint-disable-next-line max-len
            setDistanceValue(submissionVM.lobData.privateCar.coverables.vehicles.children[0].annualMileage.value);
        }
    };

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const tooltipOverlay = () => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.carMileage}` }}
            webAnalyticsEvent={{ event_action: `${messages.carMileage} Info` }}
            id="carOverlayInformationToolTip"
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
            labelText={messages.overlayHeader}
        >
            <div>
                <p>{messages.overlayBodyParaOne}</p>
                <p>{messages.overlayBodyParaTwo}</p>
            </div>
        </HDOverlayPopup>
    );

    const onFocusInputHandler = (event) => {
        if (navigator.virtualKeyboard) {
            navigator.virtualKeyboard.overlaysContent = true;
            const { scrollWidth, scrollHeight } = inputRef.current;
            window.scroll(scrollWidth, scrollHeight * 3);
        }
    };
    const onBlurInputHandler = () => {
        if (navigator.virtualKeyboard) {
            navigator.virtualKeyboard.overlaysContent = false;
        }
    };

    return (
        <Container className="car-mileage-container">
            <Row>
                <Col>
                    <div ref={labelRef} />
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.textPart1}
                        icon={tooltipOverlay()}
                        iconPosition="r"
                        className=""
                        id="car-mileage-how-many-miles-label" />
                    <HDInfoCardRefactor
                        image={exclamationIcon}
                        paragraphs={[messages.infoTipText]}
                        className="margin-bottom-lg"
                        id="car-mileage-dont-know-info" />
                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        {(hdProps) => {
                            return (
                                <>
                                    <Row>
                                        <Col>
                                            <HDTextInput
                                                reference={inputRef}
                                                className="px-0 col-lg-8 col-xl-6"
                                                webAnalyticsEvent={{
                                                    event_action: messages.textPart1,
                                                    event_value: messages.enterDistance
                                                }}
                                                type="number"
                                                inputMode="numeric"
                                                maxLength="7"
                                                path={distancePathame}
                                                name={distanceFieldname}
                                                value={distanceValue}
                                                id="car-mileage-input"
                                                onKeyPress={(event) => {
                                                    if (event.key === 'Enter') {
                                                        inputRef.current.blur();
                                                    }
                                                }}
                                                onChange={(event) => handleEventChange(event, hdProps)}
                                                onFocus={onFocusInputHandler}
                                                onBlur={onBlurInputHandler}
                                                appendLabel={miles}
                                                thousandSeprator
                                                isInvalidCustom={hdProps.touched[distanceFieldname] && !!hdProps.errors[distanceFieldname]} />
                                        </Col>
                                    </Row>
                                </>
                            );
                        }}
                    </HDForm>
                    {distanceValue && miles === messages.miles && traveldistance ? (
                        <Row>
                            <Col className="margin-top-lg margin-top-lg-mobile">
                                <p className="mb-0">
                                    {`${messages.thatsAbout}`}
                                    {' '}
                                    <span className="font-bold">{`${formatDistanceValue(Math.ceil(traveldistance).toString())} ${messages.milesPer} ${timespan}`}</span>
                                    {' '}
                                    {`${messages.shownInYourDocOne}`}
                                    {' '}
                                    <span className="font-bold">{`${formatDistanceValue(distanceValue)} ${messages.milesA}`}</span>
                                    {' '}
                                    {`${messages.shownInYourDocTwo}.`}
                                </p>
                            </Col>
                        </Row>
                    ) : (
                        <span />
                    )}
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

HDCarMileagePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDCarMileagePage);
