/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
import React, {
    useEffect, useState, useContext, useCallback, useRef
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import {
    HDForm, HDInteractiveCardRefactor, HDLabelRefactor
} from 'hastings-components';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
// import './HDDriverClaimsPage.scss';
import { useLocation } from 'react-router-dom';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDModal as HDModal,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { trackEvent } from '../../../web-analytics/trackData';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDDriverClaimsPage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import trashImage from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Trash.svg';
import editImage from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Edit.svg';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

const HDDriverClaimsPage = (props) => {
    const {
        submissionVM,
        setNavigation,
        pageMetadata,
        multiCarFlag,
        mcsubmissionVM
    } = props;
    const translator = useContext(TranslatorContext);
    const [showPopup, setShowPopup] = useState(false);
    const [showClaimPopup, setShowClaimPopup] = useState(false);
    const [anyClaimsValue, setAnyClaimsValue] = useState(false);
    const [cancelledVoidedOrSpecialTermsSelected, setCancelledVoidedOrSpecialTermsSelected] = useState(false);
    const [claim, setClaim] = useState({
        accidentDate: '',
        accidentTypeSelect: null,
        accidentType: '',
        wasItMyFault: '',
        wasNoClaimsDiscountAffected: '',
        wereTheirInjuries: ''
    });
    const [isNewClaim, setIsNewClaim] = useState(true);
    const [initialClaim, setInitialClaim] = useState(claim);
    const [accidentDateMonth, setAccidentDateMonth] = useState(null);
    const [accidentDateYear, setAccidentDateYear] = useState(null);
    const [accidentDate, setAccidentDate] = useState();
    const [confirmClicked, setConfirmClicked] = useState(false);
    const [anyClaimsReset, setAnyClaimsReset] = useState(false);
    const [policyCancelledReset, setPolicyCancelledReset] = useState(false);
    const [policyVoidedReset, setPolicyVoidedReset] = useState(false);
    const [dateInputValueError, setDateInputValueError] = useState(false);
    const [policyWithSpecialTermsReset, setPolicyWithSpecialTermsReset] = useState(false);
    const yearInputRef = useRef();
    const claimMonthRef = useRef(null);
    const claimYearRef = useRef(null);
    const newClaim = {
        accidentDate: '',
        accidentTypeSelect: null,
        accidentType: '',
        wasItMyFault: '',
        wasNoClaimsDiscountAffected: '',
        wereTheirInjuries: ''
    };

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
        && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;


    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}.previousPoliciesInformation`;
    const claimsAndConvictionsPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}.claimsAndConvictions`;
    const claimsDetailPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}.claimsAndConvictions.claimsDetailsCollection`;
    const isCancelledVoidedOrSpecialTerms = 'hadInsurancePolicyDeclinedCancelledVoidedOrSpecialTerms';
    const isCancelledVoidedOrSpecialTermsPath = `${driverPath}.${isCancelledVoidedOrSpecialTerms}`;
    const policyCancelledOrDeclinedName = 'hadInsurancePolicyCancelledOrDeclined';
    const policyCancelledOrDeclinedPath = `${driverPath}.${policyCancelledOrDeclinedName}`;
    const insurancePolicyVoidedName = 'hadInsurancePolicyVoided';
    const insurancePolicyVoidedPath = `${driverPath}.${insurancePolicyVoidedName}`;
    const insurancePolicyWithSpecialTermsName = 'hadInsurancePolicyWithSpecialTerms';
    const insurancePolicyWithSpecialTermsPath = `${driverPath}.${insurancePolicyWithSpecialTermsName}`;
    const anyClaimsName = 'anyClaims';
    const anyClaimsPath = `${claimsAndConvictionsPath}.${anyClaimsName}`;

    const viewModelService = useContext(ViewModelServiceContext);

    const claimDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.policyjob.lob.privatecar.coverables.dto.ClaimDTO'
    );

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const handleTouched = ({ target: { name, value } }) => {
        if (!touchedFields[name]) {
            setTouchedFields((prevState) => {
                return {
                    ...prevState,
                    [name]: true
                };
            });
        }
        if (name === 'month') {
            if (value && value.length === 1) {
                // eslint-disable-next-line prefer-template
                const tempMonth = '0' + value;
                setAccidentDateMonth(tempMonth);
            }
        }
    };

    let policyCancelledOrDeclinedValue = _.get(submissionVM, `${policyCancelledOrDeclinedPath}.value`);
    let insurancePolicyVoidedValue = _.get(submissionVM, `${insurancePolicyVoidedPath}.value`);
    let insurancePolicyWithSpecialTermsValue = _.get(submissionVM, `${insurancePolicyWithSpecialTermsPath}.value`);
    const isFieldsValid = () => {
        const isCancelledVoidedOrSpecialTermsValue = _.get(submissionVM, `${isCancelledVoidedOrSpecialTermsPath}.value`);
        return (
            cancelledVoidedOrSpecialTermsSelected
            && (isCancelledVoidedOrSpecialTermsValue === messages.falseValue || ((!policyCancelledReset && !policyVoidedReset && !policyWithSpecialTermsReset)
                && (policyCancelledOrDeclinedValue != null && insurancePolicyVoidedValue != null && insurancePolicyWithSpecialTermsValue != null)))
            && !anyClaimsReset
        );
    };

    const handleChange = ({
        target: {
            name,
            value
        }
    }) => {
        setClaim({
            ...claim,
            [name]: value
        });
    };

    const accidentTypeAvailableValues = claimDTO ? _.get(claimDTO, messages.accidentTypeName)
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

    const filteredAccidentTypeValues = accidentTypeAvailableValues.filter((item) => !((messages.accidentTypeToRemove).includes(item.value)));


    const overlayAccidentTypeValue = () => {
        return (claim.accidentTypeSelect) ? claim.accidentTypeSelect : filteredAccidentTypeValues.find((el) => el.value === claim.accidentType);
    };

    const handleAccidentDateMonth = (event) => {
        setAccidentDateMonth(event.target.value);
        if (event.target.value && accidentDateYear) {
            setAccidentDate(new Date(accidentDateYear, event.target.value - 1));
        }
        if (event.target.value.length === 2) yearInputRef.current.focus();
    };
    const handleAccidentDateYear = (event) => {
        setAccidentDateYear(event.target.value);
        if (event.target.value && accidentDateMonth) {
            setAccidentDate(new Date(event.target.value, accidentDateMonth - 1));
        }
    };

    const validate = ({
        accidentType,
        accidentTypeSelect,
        wasItMyFault,
        wasNoClaimsDiscountAffected,
        wereTheirInjuries
    }, accidentDateMonthObj, accidentDateYearObj, accidentDateObj) => {
        const nextErrors = {};
        const currentDate = new Date();
        const dateToComparePast = new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), 1);
        const dateToCompareFuture = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        if (!(dateToComparePast <= accidentDateObj && accidentDateObj <= dateToCompareFuture)) {
            nextErrors.accidentDate = messages.dateLessThanFiveYearsMessage;
            setDateInputValueError(false);
        }
        if (!accidentDateObj || accidentDateObj === '' || accidentDateMonthObj === '' || accidentDateYearObj === '') {
            nextErrors.accidentDate = messages.requiredFieldMessage;
            setDateInputValueError(false);
        }
        if (accidentDateMonthObj && accidentDateMonthObj !== '' && !(accidentDateMonthObj >= 1 && accidentDateMonthObj <= 12)) {
            nextErrors.accidentDate = messages.invalidDateMessage;
            setDateInputValueError(true);
        }
        if ((accidentDateMonthObj && accidentDateMonthObj !== '' && !Number.isFinite(Number(accidentDateMonthObj)))
            || (accidentDateYearObj && accidentDateYearObj !== '' && !Number.isFinite(Number(accidentDateYearObj)))) {
            nextErrors.accidentDate = messages.invalidDateMessage;
            setDateInputValueError(true);
        }
        if (!(accidentType || accidentTypeSelect)) {
            nextErrors.accidentTypeSelect = messages.requiredFieldMessage;
        }
        if (!wasItMyFault.toString()) {
            nextErrors.wasItMyFault = messages.requiredFieldMessage;
        }
        if (!wasNoClaimsDiscountAffected.toString()) {
            nextErrors.wasNoClaimsDiscountAffected = messages.requiredFieldMessage;
        }
        if (!wereTheirInjuries.toString()) {
            nextErrors.wereTheirInjuries = messages.requiredFieldMessage;
        }
        setErrors(nextErrors);
    };

    const debouncedValidate = useCallback(_.debounce(validate, 200), []);

    useEffect(() => {
        const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
        if (claimsDetails && claimsDetails.length > 0) {
            setAnyClaimsValue(true);
        }
    }, []);

    useEffect(() => {
        debouncedValidate(claim, accidentDateMonth, accidentDateYear, accidentDate);
    }, [claim, accidentDateMonth, accidentDateYear, accidentDate, debouncedValidate]);

    useEffect(() => {
        setNavigation({
            canForward: false,
            showForward: true,
            canSkip: false,
            updateQuoteFlag: false,
            showWizardTooltip: false
        });
    }, []);

    const handleValidation = (isValid) => {
        setNavigation({
            canForward: isValid && isFieldsValid(),
            showForward: true
        });
    };

    const availableValues = [
        {
            value: messages.trueValue,
            name: messages.yes
        },
        {
            value: messages.falseValue,
            name: messages.no
        }
    ];


    const validationSchema = yup.object({
        [isCancelledVoidedOrSpecialTerms]: yup
            .string()
            .required(messages.typeValidationRequired)
            .VMValidation(isCancelledVoidedOrSpecialTermsPath, messages.typeValidationVM, submissionVM),
        [policyCancelledOrDeclinedName]: yup
            .string()
            .when(`${isCancelledVoidedOrSpecialTerms}`, (value, schema) => {
                return value === messages.trueValue ? schema.required(messages.typeValidationRequired) : schema;
            })
            .VMValidation(policyCancelledOrDeclinedPath, messages.typeValidationVM, submissionVM),
        [insurancePolicyVoidedName]: yup
            .string()
            .when(`${isCancelledVoidedOrSpecialTerms}`, (value, schema) => {
                return value === messages.trueValue ? schema.required(messages.typeValidationRequired) : schema;
            })
            .VMValidation(insurancePolicyVoidedPath, messages.typeValidationVM, submissionVM),
        [insurancePolicyWithSpecialTermsName]: yup
            .string()
            .when(`${isCancelledVoidedOrSpecialTerms}`, (value, schema) => {
                return value === messages.trueValue ? schema.required(messages.typeValidationRequired) : schema;
            })
            .VMValidation(insurancePolicyWithSpecialTermsPath, messages.typeValidationVM, submissionVM),
        [anyClaimsName]: yup.string()
            .required(messages.typeValidationRequired)
            .VMValidation(anyClaimsPath, messages.typeValidationVM, submissionVM)
    });

    const tooltipOverlay = (id, message, header) => (
        <HDOverlayPopup
            className="driver-claims__overlay"
            webAnalyticsView={{ ...pageMetadata, page_section: messages.claimsInfo }}
            webAnalyticsEvent={{ event_action: messages.claimsInfo }}
            id={id}
            showButtons={false}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
            labelText={header}
        >
            {message}
        </HDOverlayPopup>
    );

    const addDriverClaims = (claimObj) => {
        const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
        claimObj.accidentType = claimObj.accidentTypeSelect.value;
        claimsDetails.push(claimObj);
        setShowClaimPopup(false);
    };

    const updateDriverClaims = (claimObj, initilalClaim) => {
        initilalClaim.accidentDate = claimObj.accidentDate;
        initilalClaim.accidentTypeSelect = claimObj.accidentTypeSelect;
        initilalClaim.accidentType = (claimObj.accidentTypeSelect) ? claimObj.accidentTypeSelect.value : claimObj.accidentType;
        initilalClaim.wasItMyFault = claimObj.wasItMyFault;
        initilalClaim.wasNoClaimsDiscountAffected = claimObj.wasNoClaimsDiscountAffected;
        initilalClaim.wereTheirInjuries = claimObj.wereTheirInjuries;
        setShowClaimPopup(false);
    };

    const disabledConfirmButton = () => {
        return Object.keys(errors).length > 0;
    };

    const handlCancelledVoidedOrSpecialTermsChange = (event) => {
        if (event.target.value === messages.falseValue) {
            _.set(submissionVM, policyCancelledOrDeclinedPath, messages.falseValue);
            _.set(submissionVM, insurancePolicyVoidedPath, messages.falseValue);
            _.set(submissionVM, insurancePolicyWithSpecialTermsPath, messages.falseValue);
        } else if (event.target.value === messages.trueValue) {
            _.set(submissionVM, policyCancelledOrDeclinedPath, null);
            _.set(submissionVM, insurancePolicyVoidedPath, null);
            _.set(submissionVM, insurancePolicyWithSpecialTermsPath, null);
        }
        setPolicyCancelledReset(true);
        setPolicyVoidedReset(true);
        setPolicyWithSpecialTermsReset(true);
    };

    const handleConfirm = () => {
        setConfirmClicked(true);
        if (!disabledConfirmButton()) {
            claim.accidentDate = accidentDate;
            if (isNewClaim) {
                addDriverClaims(claim);
            } else { updateDriverClaims(claim, initialClaim); }
            setAnyClaimsValue(true);
        }
    };

    const handleDeleteClaim = () => {
        const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
        _.remove(claimsDetails, initialClaim);
        if (claimsDetails.length < 1) {
            _.set(submissionVM, `${anyClaimsPath}.value`, null);
            setAnyClaimsValue(null);
            setAnyClaimsReset(true);
        }
        setShowPopup(false);
    };

    const handleCancelAddClaim = () => {
        const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
        if (claimsDetails.length < 1) {
            _.set(submissionVM, `${anyClaimsPath}.value`, null);
            setAnyClaimsValue(null);
            setAnyClaimsReset(true);
        }
        setShowClaimPopup(false);
    };

    const beforeAddOrUpdateNewClaim = (isNew, displayClaim) => {
        if (!isNew) {
            trackEvent({
                event_value: messages.edit,
                event_action: messages.incident,
                event_type: 'icon_click',
                element_id: 'edit-claim',
            });
        }
        setErrors({});
        setTouchedFields({});
        setIsNewClaim(isNew);
        setConfirmClicked(false);
        if (isNew) {
            setAccidentDateMonth();
            setAccidentDateYear();
            setAccidentDate();
            setClaim(newClaim);
        } else {
            const dateInClaim = new Date(displayClaim.accidentDate);
            setClaim(displayClaim);
            setInitialClaim(displayClaim);
            setAccidentDateMonth(dateInClaim.getMonth() + 1);
            setAccidentDateYear(dateInClaim.getFullYear());
            setAccidentDate(new Date(dateInClaim.getFullYear(), dateInClaim.getMonth()));
        }
        setShowClaimPopup(true);
    };

    const handleAnyClaimsChange = (event) => {
        setAnyClaimsReset(false);
        if (event.target.value === messages.falseValue) {
            const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
            _.remove(claimsDetails);
            setShowClaimPopup(false);
            setAnyClaimsValue(false);
        } else {
            beforeAddOrUpdateNewClaim(true);
        }
    };

    const showDeletePopup = (displayClaim) => {
        trackEvent({
            event_value: messages.remove,
            event_action: messages.incident,
            event_type: 'icon_click',
            element_id: 'delete-claim',
        });
        setInitialClaim(displayClaim);
        setShowPopup(true);
    };

    const handleCancelledVoidedOrSpecialTermsChanged = (hdProps) => {
        // eslint-disable-next-line no-unused-expressions, no-nested-ternary
        (hdProps.values[isCancelledVoidedOrSpecialTerms] === messages.falseValue) ? setCancelledVoidedOrSpecialTermsSelected(true)
            : ((hdProps.values[policyCancelledOrDeclinedName] === messages.trueValue
                || hdProps.values[insurancePolicyVoidedName] === messages.trueValue
                || hdProps.values[insurancePolicyWithSpecialTermsName] === messages.trueValue) ? setCancelledVoidedOrSpecialTermsSelected(true)
                : setCancelledVoidedOrSpecialTermsSelected(false));
    };

    const accidentDateMonthDisplay = (dateMonth) => {
        return `0${(dateMonth + 1)}`;
    };

    const renderClaimsCard = () => {
        const claimsDetails = _.get(submissionVM, `${claimsDetailPath}.value`);
        const claimListDiv = claimsDetails.map((displayClaim) => {
            const {
                // eslint-disable-next-line no-shadow
                accidentDate,
                accidentType,
                wasItMyFault,
                wasNoClaimsDiscountAffected,
                wereTheirInjuries
            } = displayClaim;
            return (
                <HDInteractiveCardRefactor
                    className="margin-top-md mt-5"
                    icons={(
                        <>
                            <img
                                src={editImage}
                                id="edit-claim"
                                className="mr-2"
                                alt="edit-claim"
                                onClick={() => {
                                    beforeAddOrUpdateNewClaim(false, displayClaim);
                                }} />
                            <img
                                src={trashImage}
                                id="delete-claim"
                                alt="delete-claim"
                                onClick={() => showDeletePopup(displayClaim)} />
                        </>
                    )}
                    header={(
                        <>
                            {accidentType !== undefined && filteredAccidentTypeValues.find((el) => el.value === accidentType).label}
                            {accidentDate
                                && ` ${(accidentDateMonthDisplay(new Date(accidentDate).getMonth())).slice(-2)}/${new Date(accidentDate).getFullYear()}`}
                        </>
                    )}
                    text={(
                        <>
                            {(wasItMyFault === messages.trueValue || wasItMyFault === true)
                                ? messages.cardFaultMessage : messages.cardNoFaultMessage}
                            {(wasNoClaimsDiscountAffected === messages.trueValue || wasNoClaimsDiscountAffected === true)
                                ? messages.cardNcdAffectedMessage : messages.cardNcdNotAffectedMessage}
                            {(wereTheirInjuries === messages.trueValue || wereTheirInjuries === true)
                                ? messages.cardInjuriesMessage : messages.cardNoInjuriesMessage}
                        </>
                    )} />
            );
        });
        return claimListDiv && claimListDiv.length ? (
            <>
                {claimListDiv}
            </>
        ) : [];
    };

    const handleFocus = (event) => {
        window.scroll(0, 0);
        event.preventDefault();
        event.target.select();
    };

    const isIncidentDateInvalid = errors.accidentDate
        && ((touchedFields[messages.accidentMonthField] && touchedFields[messages.accidentYearField]) || confirmClicked
        || (dateInputValueError && (touchedFields[messages.accidentMonthField] || touchedFields[messages.accidentYearField])));

    const claimMonthKeyPressHandler = (event) => {
        if (event.key === 'Enter') {
            claimMonthRef.current.blur();
        }
    };
    const claimYearKeyPressHandler = (event) => {
        if (event.key === 'Enter') {
            yearInputRef.current.blur();
        }
    };

    return (
        <Container className="driver-claims-container">
            <Row>
                <Col>
                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        <HDToggleButtonGroup
                            className="driver-claimsJ__declined-toggle-group"
                            webAnalyticsEvent={{ event_action: messages.declinedOrCancelledMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            id="insurance-button-group"
                            path={isCancelledVoidedOrSpecialTermsPath}
                            name={isCancelledVoidedOrSpecialTerms}
                            label={{
                                text: messages.declinedOrCancelledMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                Tag: 'h2',
                                icon: tooltipOverlay('claim-terms', messages.cancelledTermsOverlayMessage, messages.declinedOrCancelledMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)),
                                iconPosition: 'r'
                            }}
                            availableValues={availableValues}
                            onChange={handlCancelledVoidedOrSpecialTermsChange}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                        {(hdProps) => {
                            handleCancelledVoidedOrSpecialTermsChanged(hdProps);
                            policyCancelledOrDeclinedValue = _.get(submissionVM, `${policyCancelledOrDeclinedPath}.value`);
                            insurancePolicyVoidedValue = _.get(submissionVM, `${insurancePolicyVoidedPath}.value`);
                            insurancePolicyWithSpecialTermsValue = _.get(submissionVM, `${insurancePolicyWithSpecialTermsPath}.value`);
                            return (
                                hdProps.values[isCancelledVoidedOrSpecialTerms] === messages.trueValue && (
                                    <div>
                                        <div
                                            className="invalid-field"
                                            hidden={
                                                !(
                                                    hdProps.values[policyCancelledOrDeclinedName] === messages.falseValue
                                                        && policyCancelledOrDeclinedValue === messages.falseValue
                                                        && hdProps.values[insurancePolicyVoidedName] === messages.falseValue
                                                        && insurancePolicyVoidedValue === messages.falseValue
                                                        && hdProps.values[insurancePolicyWithSpecialTermsName] === messages.falseValue
                                                        && insurancePolicyWithSpecialTermsValue === messages.falseValue
                                                        && (!policyCancelledReset && !policyVoidedReset && !policyWithSpecialTermsReset)
                                                )
                                            }
                                        >
                                            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                                            <span>{messages.declinedOrCancelledErrorMessage}</span>
                                        </div>
                                        <HDToggleButtonGroup
                                            webAnalyticsEvent={{ event_action: messages.declinedOrCancelledConfirm }}
                                            id="declined-or-cancelled-button-group"
                                            path={policyCancelledOrDeclinedPath}
                                            name={policyCancelledOrDeclinedName}
                                            label={{
                                                text: messages.declinedOrCancelledConfirm,
                                                Tag: 'h2'
                                            }}
                                            availableValues={availableValues}
                                            doReset={policyCancelledReset || policyCancelledOrDeclinedValue === null}
                                            onChange={() => setPolicyCancelledReset(false)}
                                            customClassName="margin-top-xl"
                                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                        <HDToggleButtonGroup
                                            webAnalyticsEvent={{ event_action: messages.insuranceVoidedConfirm }}
                                            id="voided-button-group"
                                            path={insurancePolicyVoidedPath}
                                            name={insurancePolicyVoidedName}
                                            label={{
                                                text: messages.insuranceVoidedConfirm,
                                                Tag: 'h2'
                                            }}
                                            availableValues={availableValues}
                                            doReset={policyVoidedReset || insurancePolicyVoidedValue === null}
                                            onChange={() => setPolicyVoidedReset(false)}
                                            customClassName="margin-top-xl"
                                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                        <HDToggleButtonGroup
                                            webAnalyticsEvent={{ event_action: messages.specialTermsConfirm }}
                                            id="special-terms-button-group"
                                            path={insurancePolicyWithSpecialTermsPath}
                                            name={insurancePolicyWithSpecialTermsName}
                                            label={{
                                                text: messages.specialTermsConfirm,
                                                Tag: 'h2'
                                            }}
                                            availableValues={availableValues}
                                            doReset={policyWithSpecialTermsReset || insurancePolicyWithSpecialTermsValue === null}
                                            onChange={() => setPolicyWithSpecialTermsReset(false)}
                                            customClassName="margin-top-xl"
                                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                    </div>
                                )
                            );
                        }}
                        <hr />
                        <HDToggleButtonGroup
                            className="driver-claimsJ__declined-toggle-group"
                            webAnalyticsEvent={{ event_action: messages.anyClaimsMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            id="claims-button-group"
                            path={anyClaimsPath}
                            name={anyClaimsName}
                            label={{
                                text: messages.anyClaimsMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                Tag: 'h2'
                            }}
                            availableValues={availableValues}
                            doReset={anyClaimsReset}
                            onChange={handleAnyClaimsChange}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3"
                        >
                            <ul className="pad-inl-start-beg margin-bottom-md margin-top-md margin-top-lg-lg margin-bottom-lg-lg">
                                <li key="any-claims-messageOne">{messages.anyClaimsSubMessageOne}</li>
                                <li key="any-claims-messageTwo">{messages.anyClaimsSubMessageTwo}</li>
                            </ul>
                        </HDToggleButtonGroup>
                        <hr className="mb-3 mb-md-1" />
                        {renderClaimsCard()}
                        {anyClaimsValue && (
                            <HDButtonDashed
                                webAnalyticsEvent={{ event_action: messages.addIncidentButton }}
                                id="driver-claims-add-another-button"
                                className="margin-top-lg-bold margin-bottom-sm"
                                icon
                                label={messages.addIncidentButton}
                                onClick={() => beforeAddOrUpdateNewClaim(true)} />
                        )}
                    </HDForm>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.remove} ${messages.incident}` }}
                        webAnalyticsEvent={{ event_action: `${messages.remove} ${messages.incident}` }}
                        id="delete-claims-popup"
                        customStyle="driverClaims"
                        headerText={messages.deleteHeader}
                        confirmLabel={messages.deleteConfirmMessage}
                        cancelLabel={messages.deleteCancelMessage}
                        onConfirm={() => { handleDeleteClaim(); }}
                        onCancel={() => setShowPopup(false)}
                        onClose={() => setShowPopup(false)}
                        show={showPopup}
                    >
                        <p>{messages.deleteInfoMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}</p>
                    </HDModal>

                    <HDModal
                        className="driver-claims__claims-modal"
                        webAnalyticsView={{ ...pageMetadata, page_section: `${isNewClaim ? messages.add : messages.edit} ${messages.incident}` }}
                        webAnalyticsEvent={{ event_action: `${isNewClaim ? messages.add : messages.edit} ${messages.incident}` }}
                        id="driver-claims-popup"
                        customStyle="wide"
                        confirmLabel={isNewClaim ? messages.add : messages.update}
                        cancelLabel={messages.cancel}
                        onConfirm={() => handleConfirm()}
                        onCancel={handleCancelAddClaim}
                        onClose={handleCancelAddClaim}
                        show={showClaimPopup}
                    >
                        <HDLabelRefactor Tag="h2" text={messages.incident} className="driver-claims__incident-label mb-4 my-0" />
                        <HDLabelRefactor
                            text={messages.incidentDateMessage}
                            Tag="h5"
                            icon={tooltipOverlay('accident-date', messages.incidentDateOverlayMessage, messages.incidentDateMessage)}
                            iconPosition="r"
                            adjustImagePosition={false}
                            className="driver-claims__incident-date-label my-3" />
                        <Row>
                            <Col xs={5} md={4} className="pr-0">
                                <HDTextInput
                                    reference={claimMonthRef}
                                    webAnalyticsEvent={{ event_action: messages.incidentDateMessage }}
                                    placeholder="MM"
                                    type="number"
                                    onBlur={handleTouched}
                                    name={messages.accidentMonthField}
                                    id="accMonth"
                                    className="input-group--on-white"
                                    value={accidentDateMonth}
                                    onChange={handleAccidentDateMonth}
                                    onFocus={handleFocus}
                                    onKeyPress={claimMonthKeyPressHandler}
                                    maxLength="2"
                                    allowLeadingZero
                                    isInvalidCustom={isIncidentDateInvalid} />
                            </Col>
                            <Col xs={7} md={5}>
                                <HDTextInput
                                    reference={claimYearRef}
                                    webAnalyticsEvent={{ event_action: messages.incidentDateMessage }}
                                    placeholder="YYYY"
                                    type="number"
                                    id="accYear"
                                    ref={yearInputRef}
                                    className="input-group--on-white"
                                    onBlur={handleTouched}
                                    name={messages.accidentYearField}
                                    value={accidentDateYear}
                                    onChange={handleAccidentDateYear}
                                    onFocus={handleFocus}
                                    onKeyPress={claimYearKeyPressHandler}
                                    isInvalidCustom={isIncidentDateInvalid} />
                            </Col>
                        </Row>
                        {isIncidentDateInvalid && (
                            <div className="error">{errors.accidentDate}</div>
                        )}
                        <hr />
                        <HDDropdownList
                            webAnalyticsEvent={{ event_action: messages.accidentTypeMessage }}
                            id="accident-type-dropdown"
                            name="accidentTypeSelect"
                            label={{
                                text: messages.accidentTypeMessage,
                                Tag: 'h5'
                            }}
                            options={filteredAccidentTypeValues}
                            value={overlayAccidentTypeValue}
                            onChange={handleChange}
                            className="dropdown-list w-100" />
                        {errors.accidentTypeSelect && confirmClicked && (
                            <div className="error">
                                {errors.accidentTypeSelect}
                            </div>
                        )}
                        <hr />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.wasItFaultMessage }}
                            id="fault-button-group"
                            name={messages.wasItMyFaultName}
                            label={{
                                text: messages.wasItFaultMessage,
                                Tag: 'h5'
                            }}
                            availableValues={availableValues}
                            className="driver-claims-toggle"
                            value={(claim.wasItMyFault).toString()}
                            onChange={handleChange}
                            btnGroupClassName="grid grid--col-3 grid--col-md-4" />
                        {errors.wasItMyFault && confirmClicked && (
                            <div className="error">
                                {errors.wasItMyFault}
                            </div>
                        )}
                        <hr />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.affectNcdMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            id="claims-discount-affect-button-group"
                            name={messages.wasNoClaimsDiscountAffectedName}
                            label={{
                                text: messages.affectNcdMessage(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                Tag: 'h5'
                            }}
                            availableValues={availableValues}
                            className="driver-claims-toggle"
                            value={(claim.wasNoClaimsDiscountAffected).toString()}
                            onChange={handleChange}
                            btnGroupClassName="grid grid--col-3 grid--col-md-4" />
                        {errors.wasNoClaimsDiscountAffected && confirmClicked && (
                            <div className="error">
                                {errors.wasNoClaimsDiscountAffected}
                            </div>
                        )}
                        <hr />
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.anyInjuriesMessage }}
                            id="injuries-button-group"
                            name={messages.wereTheirInjuriesName}
                            label={{
                                text: messages.anyInjuriesMessage,
                                Tag: 'h5'
                            }}
                            availableValues={availableValues}
                            className="driver-claims-toggle"
                            value={(claim.wereTheirInjuries).toString()}
                            onChange={handleChange}
                            btnGroupClassName="grid grid--col-3 grid--col-md-4" />
                        {errors.wereTheirInjuries && confirmClicked && (
                            <div className="error">
                                {errors.wereTheirInjuries}
                            </div>
                        )}
                    </HDModal>
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
    setNavigation: setNavigationAction
};

HDDriverClaimsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverClaimsPage);
