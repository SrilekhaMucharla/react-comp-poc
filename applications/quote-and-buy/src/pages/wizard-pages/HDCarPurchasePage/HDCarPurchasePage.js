import React, {
    useState, useEffect, useContext, useRef
} from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import {
    HDLabelRefactor, HDInfoCardRefactor, HDForm
} from 'hastings-components';
import { connect, useSelector } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroupRefactor,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { trackEvent } from '../../../web-analytics/trackData';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDCarPurchasePage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import { mcSubmissionPropTypes } from '../../../constant/propTypes';

const HastingsDirectCarPurchasePage = (props) => {
    const [isKeeperAndOwnerSame, setIsKeeperAndOwnerSame] = useState(null);
    const handleKeeperAndOwner = (e) => {
        // eslint-disable-next-line no-unused-expressions
        e ? setIsKeeperAndOwnerSame(true) : setIsKeeperAndOwnerSame(false);
    };
    const translator = useContext(TranslatorContext);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [dateDisabled, setDateDisabled] = useState(false);
    const [ownerKeeperList, setOwnerKeeperList] = useState([]);
    const [dateValid, setDateValid] = useState(false);
    const [ownerValid, setOwnerValid] = useState(false);
    const [keeperValid, setKeeperValid] = useState(false);
    const [futureDate, setFutureDate] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [invalidMonth, setInvalidMonth] = useState(false);
    const [ownerDefaultValue, setOwnerDefaultValue] = useState(null);
    const [keeperDefaultValue, setKeeperDefaultValue] = useState(null);
    const [keeperValue, setKeeperValue] = useState();
    const [isPageValid, setIsPageValid] = useState(false);
    const yearInputRef = useRef();

    const {
        submissionVM,
        mcsubmissionVM,
        setNavigation,
        pageMetadata
    } = props;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const legalOwnerName = 'legalOwner';
    const legalOwnerPath = `${vehiclePath}.${legalOwnerName}`;
    const registeredKeeperName = 'registeredKeeper';
    const registeredKeeperPath = `${vehiclePath}.${registeredKeeperName}`;
    const purchaseDateName = 'purchaseDate';
    const purchaseDatePath = `${vehiclePath}.${purchaseDateName}`;
    const legalOwnerOrKeeperName = 'isRegisteredKeeperAndLegalOwner';
    const legalOwnerOrKeeperPath = `${vehiclePath}.${legalOwnerOrKeeperName}`;
    const isVehicleBoughtName = 'isVehicleBought';
    const isVehicleBoughtPath = `${vehiclePath}.${isVehicleBoughtName}`;
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const mcSingalQuoteEditObject = useSelector((state) => state.wizardState.app.MCSingalQuoteEditObject);
    const getmcsubmissionVMQuote = _.get(mcsubmissionVM, 'value.quotes', []);
    const keeper = 'keeper';
    const owner = 'owner';

    const ownerKeeperTypeList = submissionVM && _.get(submissionVM, legalOwnerPath) !== undefined
        ? _.head(_.head(submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            .legalOwner
            .aspects
            .availableValues)
            .typelist
            .filters
            .filter((el) => el.name === 'PrivateCar_Ext_Keeper'))
            .codes
            .map((typeCode) => {
                return {
                    value: typeCode.code,
                    name: translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    }),
                };
            }) : [];

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const isParentCar = !_.get(mcsubmissionVM, 'value.quotes.length', 0);

    const selectOwner = (selectedOwner) => {
        setOwnerDefaultValue(null);
        const ownerVal = selectedOwner.target.value.value;
        _.set(submissionVM, `${legalOwnerPath}.value`, ownerVal);
        setOwnerValid(true);
    };

    const selectKeeper = (selectedKeeper) => {
        setKeeperDefaultValue(null);
        const keeperVal = selectedKeeper.target.value.value;
        _.set(submissionVM, `${registeredKeeperPath}.value`, keeperVal);
        setKeeperValid(true);
    };

    const keeperAndOwnerPopulate = (isKeeperAndOwner, hdProps) => {
        setKeeperValue(null);
        setOwnerDefaultValue([]);
        setKeeperDefaultValue([]);
        hdProps.setFieldTouched(`${owner}`, false, false);
        hdProps.setFieldTouched(`${keeper}`, false, false);
        _.set(submissionVM, `${legalOwnerPath}.value`, '');
        _.set(submissionVM, `${registeredKeeperPath}.value`, '');
        if (isKeeperAndOwner.target.value === 'true') {
            _.set(submissionVM, `${legalOwnerOrKeeperPath}.value`, 'true');
            handleKeeperAndOwner(true);
            _.set(submissionVM, `${legalOwnerPath}.value`, '1_PR');
            _.set(submissionVM, `${registeredKeeperPath}.value`, '1_PR');
            setOwnerValid(true);
            setKeeperValid(true);
            setKeeperValue('true');
        } else {
            handleKeeperAndOwner(false);
            _.set(submissionVM, `${legalOwnerOrKeeperPath}.value`, 'false');
            const ownerKeeper = ownerKeeperTypeList.map((item) => {
                return {
                    value: item.value,
                    label: item.name
                };
            });
            setOwnerKeeperList(ownerKeeper);
            setOwnerValid(false);
            setKeeperValid(false);
            setKeeperValue('false');
        }
    };

    const validationSchema = yup.object({
        [purchaseDateName]: yup.date(),
        [legalOwnerOrKeeperName]: yup.string(),
        [keeper]: (!isKeeperAndOwnerSame) && yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(registeredKeeperPath, null, submissionVM),
        [owner]: (!isKeeperAndOwnerSame) && yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(legalOwnerPath, null, submissionVM)
    });

    const handleValidation = (isValid) => {
        setIsPageValid(dateValid && isValid && ownerValid && keeperValid);
    };

    useEffect(() => {
        setNavigation({
            canForward: isPageValid
        });
    }, [isPageValid]);

    const getLabelforCode = (code) => {
        const label = _.head(_.head(submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            .legalOwner
            .aspects
            .availableValues)
            .typelist
            .filters
            .filter((el) => el.name === 'PrivateCar_Ext_Keeper'))
            .codes
            .map((typeCode) => {
                return {
                    value: typeCode.code,
                    name: translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    })
                };
            })
            .filter((owners) => owners.value === code)[0].name;
        return label;
    };

    useEffect(() => {
        let purchaseDateValue = _.get(submissionVM, `${purchaseDatePath}.value`);
        if (purchaseDateValue !== undefined) {
            purchaseDateValue = new Date(purchaseDateValue);
            const defMonth = purchaseDateValue && purchaseDateValue.getMonth() + 1;
            const defYear = purchaseDateValue && purchaseDateValue.getFullYear();
            setMonth(defMonth);
            setYear(defYear);
            const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            if (currentDate.getTime() === purchaseDateValue.getTime()
                && (_.get(submissionVM, `${isVehicleBoughtPath}.value`).toString() === 'false')) {
                document.getElementById('nbyCheckBox').checked = true;
                setDateDisabled(true);
            }
            setDateValid(true);
        }

        const legalOwnerVal = _.get(submissionVM, `${legalOwnerPath}.value`);
        const registeredKeeperVal = _.get(submissionVM, `${registeredKeeperPath}.value`);
        const legalOwnerOrKeeper = _.get(submissionVM, `${legalOwnerOrKeeperPath}.value`);

        if (legalOwnerVal !== undefined && registeredKeeperVal !== undefined) {
            if (legalOwnerOrKeeper && legalOwnerOrKeeper.toString() === 'true') {
                setKeeperValue('true');
                setIsKeeperAndOwnerSame(true);
            } else {
                setKeeperValue('false');
                setIsKeeperAndOwnerSame(false);
                const ownerKeeper = ownerKeeperTypeList.map((item) => {
                    return {
                        value: item.value,
                        label: item.name
                    };
                });
                setOwnerKeeperList(ownerKeeper);
                setOwnerDefaultValue({
                    value: legalOwnerVal.code,
                    label: getLabelforCode(legalOwnerVal.code)
                });
                setKeeperDefaultValue({
                    value: registeredKeeperVal.code,
                    label: getLabelforCode(registeredKeeperVal.code)
                });
            }
            setOwnerValid(true);
            setKeeperValid(true);
        }

        const vehicleBoughtValue = _.get(submissionVM, `${isVehicleBoughtPath}.value`) && _.get(submissionVM, `${isVehicleBoughtPath}.value`).toString();
        if (vehicleBoughtValue !== undefined && vehicleBoughtValue.toString() === 'false') {
            document.getElementById('nbyCheckBox').checked = true;
            setDateDisabled(true);
        }
        setNavigation({
            canForward: false,
            showForward: true
        });
    }, []);

    const onNotBoughtYet = () => {
        trackEvent({
            event_value: isParentCar ? messages.carPurchasedLabel : messages.otherCarPurchasedLabel,
            event_action: messages.carPurchaseDate,
            event_type: 'checkbox_click',
            element_id: 'nbyCheckBox',
        });
        if (document.getElementById('nbyCheckBox').checked) {
            _.set(submissionVM, `${isVehicleBoughtPath}.value`, 'false');
            const date = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
            const monthTemp = date.getMonth() + 1;
            const yearTemp = date.getFullYear();
            setMonth(String(monthTemp).padStart(2, '0'));
            setYear(yearTemp);
            setDateDisabled(true);
            setDateValid(true);
            setFutureDate(false);
            setInvalidMonth(false);
            _.set(submissionVM, `${purchaseDatePath}.value`, date);
        } else {
            _.set(submissionVM, `${isVehicleBoughtPath}.value`, 'true');
            setMonth(null);
            setYear(null);
            setDateDisabled(false);
            setDateValid(false);
            _.set(submissionVM, `${purchaseDatePath}.value`, undefined);
        }
    };

    const composeDate = () => {
        if (month !== '' && (month > 12 || month < 0)) {
            setInvalidMonth(true);
            setErrorMsg(messages.invalidMonth);
            setDateValid(false);
        } else if (month && month !== '' && year && year !== '' && year.toString().length === 4) {
            setInvalidMonth(false);
            const purchaseDate = new Date(Date.UTC(year, month - 1, 1));
            const currentDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
            if (purchaseDate <= currentDate) {
                _.set(submissionVM, `${purchaseDatePath}.value`, purchaseDate);
                setDateValid(true);
                setFutureDate(false);
                setErrorMsg('');
                _.set(submissionVM, `${isVehicleBoughtPath}.value`, 'true');
            } else {
                setFutureDate(true);
                setErrorMsg(messages.futureDateErrMsg);
                setDateValid(false);
            }
        } else {
            setInvalidMonth(false);
            setFutureDate(false);
            setDateValid(false);
        }
    };

    const composeMonth = (e) => {
        const { value } = e.target;
        setMonth(value);
        if (value === '') {
            _.set(submissionVM, `${purchaseDatePath}.value`, undefined);
        }
        if (value.length === 2) yearInputRef.current.focus();
    };

    const validateYear = () => {
        if (month && month !== '' && year && year !== '' && (month === '0' || month === '00' || year.toString().length < 4)) {
            setInvalidMonth(true);
            setErrorMsg(messages.invalidMonth);
        } else {
            composeDate();
        }
    };

    const validateMonth = ({ target: { value } }) => {
        if (value && value !== '' && year && year !== '' && (value === '0' || value === '00')) {
            setInvalidMonth(true);
            setErrorMsg(messages.invalidMonth);
        } else {
            composeDate();
        }

        if (value) {
            const str = String(value);
            setMonth(str.padStart(2, '0'));
        }
    };

    const composeYear = (e) => {
        const { value } = e.target;
        setYear(value);
        if (value === '') {
            _.set(submissionVM, `${purchaseDatePath}.value`, undefined);
        }
    };

    let isChildCar = false;
    if (getmcsubmissionVMQuote.length) {
        isChildCar = true;
    } else if (isEditQuoteJourney && submissionVM.value) {
        const isParentCarSubmission = submissionVM.value.isParentPolicy;
        isChildCar = !isParentCarSubmission;
    } else if (mcSingalQuoteEditObject && mcSingalQuoteEditObject.isParentPolicy) {
        const isParentCarEditObject = mcSingalQuoteEditObject.isParentPolicy;
        isChildCar = !isParentCarEditObject;
    }

    const legalOwnerLabelChange = () => {
        if (isChildCar) {
            return messages.legalOwnerChild;
        }
        return messages.legalOwner;
    };

    const areYouLegalOwnerOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.legalOwnerLabel} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.legalOwnerLabel} Info` }}
            id="legal-owner-info-overaly"
            labelText={legalOwnerLabelChange()}
            showButtons={false}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <p>{messages.overlayMessageOne}</p>
            <p>{messages.overlayMessageTwo}</p>
        </HDOverlayPopup>
    );

    const handleFocus = (event) => event.target.select();

    return (
        <Container className="car-purchase-container">
            <Row>
                <Col>
                    <HDLabelRefactor
                        text={messages.carPurchaseDate}
                        Tag="h2" />
                </Col>
            </Row>
            <Row>
                <Col xs={6} md={4} className="pr-xs-mobile">
                    <HDTextInput
                        webAnalyticsEvent={{
                            event_action: messages.carPurchaseDate
                        }}
                        onChange={composeMonth}
                        id="carPurchaseMonth"
                        type="numberOnly"
                        inputMode="numeric"
                        value={month}
                        name="month"
                        className="carpurchase-month"
                        placeholder="MM"
                        data={month}
                        onBlur={validateMonth}
                        onFocus={handleFocus}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                yearInputRef.current.focus();
                            }
                        }}
                        disabled={dateDisabled}
                        maxLength="2"
                        allowLeadingZero
                        isInvalidCustom={futureDate || invalidMonth} />
                </Col>
                <Col xs={6} md={4} className="pl-xs-mobile">
                    <HDTextInput
                        reference={yearInputRef}
                        webAnalyticsEvent={{
                            event_action: messages.carPurchaseDate
                        }}
                        onChange={composeYear}
                        id="carPurchaseYear"
                        type="numberOnly"
                        inputMode="numeric"
                        value={year}
                        name="year"
                        data={year}
                        className="carpurchase-year"
                        placeholder="YYYY"
                        onBlur={validateYear}
                        onFocus={handleFocus}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                yearInputRef.current.blur();
                            }
                        }}
                        disabled={dateDisabled}
                        maxLength="4"
                        isInvalidCustom={futureDate || invalidMonth} />
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={8}>
                    <div className="invalid-field margin-top-md" hidden={!futureDate && !invalidMonth}>
                        <div className="message car-purchase-date-error">{errorMsg}</div>
                    </div>
                </Col>
            </Row>
            <Row className="car-purchase-container__checkbox">
                <Col>
                    <div className="hd-checkbox">
                        <input type="checkbox" className="hd-checkbox" onClick={onNotBoughtYet} id="nbyCheckBox" />
                        <label htmlFor="nbyCheckBox">{isParentCar ? messages.carPurchasedLabel : messages.otherCarPurchasedLabel}</label>
                    </div>
                </Col>
            </Row>
            <Row className="car-purchase-container__info-box">
                <Col>
                    <HDInfoCardRefactor image={tipCirclePurple} paragraphs={[messages.infoTipText]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
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
                                    <HDToggleButtonGroupRefactor
                                        webAnalyticsEvent={{ event_action: messages.legalOwner }}
                                        id="legal-owner-button-group"
                                        className="car-purchase-container__legal-owner"
                                        availableValues={availableValues}
                                        label={{
                                            text: legalOwnerLabelChange(),
                                            Tag: 'h2',
                                            icon: areYouLegalOwnerOverlay,
                                            iconPosition: 'r'
                                        }}
                                        path={legalOwnerOrKeeperPath}
                                        name={legalOwnerOrKeeperName}
                                        data={keeperValue}
                                        onChange={(e) => keeperAndOwnerPopulate(e, hdProps)}
                                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                </Col>
                            </Row>
                            <div className="car-purchase__owner-keeper" hidden={isKeeperAndOwnerSame || (isKeeperAndOwnerSame === null)}>
                                <hr />
                                <Row>
                                    <Col>
                                        <HDDropdownList
                                            webAnalyticsEvent={{ event_action: messages.ownerSelectLabel }}
                                            id="car-owner-dropdown"
                                            name={owner}
                                            path={legalOwnerPath}
                                            label={{
                                                text: messages.ownerSelectLabel,
                                                Tag: 'h2'
                                            }}
                                            theme={messages.dropdownTheme}
                                            options={ownerKeeperList}
                                            data={ownerDefaultValue}
                                            selectSize="md-8"
                                            onChange={selectOwner} />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col>
                                        <HDDropdownList
                                            webAnalyticsEvent={{ event_action: messages.keeperSelectLabel }}
                                            id="registered-keeper-dropdown"
                                            name={keeper}
                                            path={registeredKeeperPath}
                                            label={{
                                                text: messages.keeperSelectLabel,
                                                Tag: 'h2'
                                            }}
                                            theme={messages.dropdownTheme}
                                            options={ownerKeeperList}
                                            data={keeperDefaultValue}
                                            selectSize="md-8"
                                            onChange={selectKeeper} />
                                    </Col>
                                </Row>
                            </div>
                        </>
                    );
                }}
            </HDForm>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HastingsDirectCarPurchasePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired, value: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    mcsubmissionVM: PropTypes.shape(mcSubmissionPropTypes),
};

HastingsDirectCarPurchasePage.defaultProps = {
    mcsubmissionVM: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsDirectCarPurchasePage);
