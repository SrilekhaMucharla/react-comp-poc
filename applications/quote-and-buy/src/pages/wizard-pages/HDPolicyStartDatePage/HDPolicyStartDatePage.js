/* eslint-disable max-len */
/* eslint-disable no-empty */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { connect, useSelector, useDispatch } from 'react-redux';
import * as yup from 'hastings-components/yup';
import {
    HDForm, HDLabelRefactor
} from 'hastings-components';
import { Col, Row, Container } from 'react-bootstrap';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDatePicker as HDDatePicker,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDPolicyStartDate.messages';
import { availableValuesMonth } from '../../../common/submissionMappers/helpers';
import infotooltip from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import useToast from '../../Controls/Toast/useToast';
import { faultyClaims } from '../../../common/faultClaimsHelper';

const HDPolicyStartDatePage = (props) => {
    const {
        submissionVM, setNavigation, quoteObject, pageMetadata, homeMonthRenewal
    } = props;
    const [faultyClaimsFlag, setFaultyClaimsFlag] = useState(false);
    const [validationToggle, setValidationToggle] = useState(true);

    const homeValue = useSelector((state) => state.wizardState.app.homeMonthRenewal);
    const [homeRenewal, setHomeRenewal] = useState({ value: homeValue, label: homeValue });
    const renewalType = useSelector((state) => state.wizardState.app.renewalType);
    const renewalMonth = useSelector((state) => state.wizardState.app.renewalMonth);

    const translator = useContext(TranslatorContext);
    const location = useLocation();
    const [HDToast, addToast] = useToast();
    const dispatch = useDispatch();

    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';

    const baseDataPath = 'baseData';
    const policyStartDateFieldName = 'periodStartDate';
    const policyEndDateFieldName = 'periodEndDate';
    const policyStartDatePath = `${baseDataPath}.${policyStartDateFieldName}`;
    const insurancePaymentTypeFieldName = 'insurancePaymentType';
    const insurancePaymentTypePath = `${vehiclePath}.${insurancePaymentTypeFieldName}`;
    const ncdGrantedYearsFieldName = 'ncdgrantedYears';
    const ncdGrantedYearsPath = `${vehiclePath}.${'ncdProtection'}.${ncdGrantedYearsFieldName}`;
    const drivingExperienceFlagFieldName = 'drivingExperienceFlag';
    const drivingExperienceFlagPath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExperienceFlagFieldName}`;
    const drivingExperienceYearsFieldName = 'drivingExperienceYears';
    const drivingExperienceYearsPath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExperienceYearsFieldName}`;
    const drivingExpereinceTypeFieldName = 'drivingExperienceType';
    const drivingExpereinceTypePath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExpereinceTypeFieldName}`;
    const claimsDetailPath = 'lobData.privateCar.coverables.drivers.children[0].claimsAndConvictions.claimsDetailsCollection';
    const protectNcdFieldName = 'protectNCD';
    const protectNcdPath = `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${protectNcdFieldName}`;


    const resetDrivingExpType = (hdFormProps) => {
        _.set(submissionVM, `${drivingExpereinceTypePath}.value`, '');
        hdFormProps.setFieldValue(`${drivingExpereinceTypeFieldName}`, '');
        hdFormProps.setFieldTouched(`${drivingExpereinceTypeFieldName}`, false, false);
    };
    const handleDrivingExpYearsChange = (event, hdFormProps) => {
        if (event.target.value.value === '0') {
            resetDrivingExpType(hdFormProps);
        }
    };

    const showMore = (element) => {
        if (!element) return false;
        switch (element.value) {
            case '0': return true;
            default: return false;
        }
    };

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tickWhite',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
        setHomeRenewal(homeValue);
    }, []);

    const resetDrivingYears = (hdFormProps) => {
        _.set(submissionVM, `${drivingExperienceYearsPath}.value`, '');
        hdFormProps.setFieldValue(`${drivingExperienceYearsFieldName}`, '');
        hdFormProps.setFieldTouched(`${drivingExperienceYearsFieldName}`, false, false);
        resetDrivingExpType(hdFormProps);
    };

    const handleDriverExpChange = (event, hdFormProps) => {
        if (event.target.value === 'false') {
            resetDrivingYears(hdFormProps);
        }
    };

    const resetDrivingExpFlag = (hdFormProps) => {
        _.set(submissionVM, `${drivingExperienceFlagPath}.value`, '');
        hdFormProps.setFieldValue(`${drivingExperienceFlagFieldName}`, '');
        hdFormProps.setFieldTouched(`${drivingExperienceFlagFieldName}`, false, false);
        resetDrivingYears(hdFormProps);
    };

    const calculateFaultyClaims = () => {
        const claimsDetails = faultyClaims(submissionVM);
        if (claimsDetails && claimsDetails.length < 2) {
            setFaultyClaimsFlag(true);
        } else {
            setFaultyClaimsFlag(false);
            _.set(submissionVM, `${protectNcdPath}.value`, false);
        }
    };

    const handleNcdChange = (event, hdFormProps) => {
        if (event.target.value.value !== '0') {
            resetDrivingExpFlag(hdFormProps);
            calculateFaultyClaims();
        } else {
            hdFormProps.setFieldValue('protectNCD', '');
            _.set(submissionVM, `${protectNcdPath}.value`, '');
            hdFormProps.setFieldTouched(`${protectNcdFieldName}`, false, false);
            setFaultyClaimsFlag(false);
            setValidationToggle(!validationToggle);
        }
    };

    let pcStartDate = _.get(submissionVM, 'value.baseData.pccurrentDate');
    pcStartDate = new Date(pcStartDate);
    pcStartDate = Date.UTC(pcStartDate.getUTCFullYear(), pcStartDate.getUTCMonth(), pcStartDate.getUTCDate());
    const periodStartDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
    const pcDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
    const todayAtMidnight = new Date(pcDate.setHours(0, 0, 0, 0));
    const futureAtMidnight = new Date(pcDate.setHours(720, 0, 0, 0));
    const validationSchema = yup.object({
        [ncdGrantedYearsFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(ncdGrantedYearsPath, null, submissionVM),
        [insurancePaymentTypeFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(insurancePaymentTypePath, null, submissionVM),
        [policyStartDateFieldName]: yup.date()
            .required(messages.requiredFieldMessage)
            .typeError(messages.dateErrorMessage)
            .min(todayAtMidnight, messages.datePastErrorMessage)
            .max(futureAtMidnight, messages.dateErrorMessage)
            .VMValidation(policyStartDatePath, messages.dateErrorMessage, submissionVM),
        [drivingExperienceFlagFieldName]: yup.string()
            .when(`${ncdGrantedYearsFieldName}`, (value, schema) => {
                const ncd = _.get(submissionVM, `${ncdGrantedYearsPath}.value`) !== undefined ?
                    _.get(submissionVM, `${ncdGrantedYearsPath}.value`).code : '';
                return (ncd === '0') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExperienceFlagPath, null, submissionVM),
        [protectNcdFieldName]: yup.string()
            .when(`${ncdGrantedYearsFieldName}`, (value, schema) => {
                const ncd = _.get(submissionVM, `${ncdGrantedYearsPath}.value`) !== undefined ?
                    _.get(submissionVM, `${ncdGrantedYearsPath}.value`).code : '';
                return (ncd !== '0' && calculateFaultyClaims && faultyClaimsFlag) ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(protectNcdPath, null, submissionVM),
        [drivingExperienceYearsFieldName]: yup.string()
            .when(`${drivingExperienceFlagFieldName}`, (value, schema) => {
                return (value === 'true') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExperienceYearsPath, null, submissionVM),
        [drivingExpereinceTypeFieldName]: yup.string()
            .when(`${drivingExperienceYearsFieldName}`, (value, schema) => {
                const years = _.get(submissionVM, `${drivingExperienceYearsPath}.value`) !== undefined ?
                    _.get(submissionVM, `${drivingExperienceYearsPath}.value`).code : '';
                return (years !== '' && years !== '0') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExpereinceTypePath, null, submissionVM),
    });

    const availableValuesToggle = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const homeRenewalList = 'Select month';

    const handleHomeMonthRenewal = (e) => {
        let homeValueCheck = e.target.value.value;
        const getCurrentYear = new Date().getFullYear();
        const formatValue = homeValueCheck.concat('_', getCurrentYear);
        dispatch(setNavigation({
            homeMonthRenewal: e.target.value.value,
            renewalType: messages.renewalTypeHome,
            renewalMonth: formatValue
        }));
    };

    const dropDownOption =
        submissionVM ? _.get(submissionVM, `${vehiclePath}.${'ncdProtection'}.${ncdGrantedYearsFieldName}`)
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

    const drivingExpYearsOption =
        submissionVM ? _.get(submissionVM, `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExperienceYearsFieldName}`)
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

    const drivingExpTypeOption =
        submissionVM ? _.get(submissionVM, `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExpereinceTypeFieldName}`)
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

    const availableValues =
        submissionVM ? _.get(submissionVM, insurancePaymentTypePath)
            .aspects
            .availableValues
            .map((typeCode) => {
                return {
                    value: typeCode.code,
                    name: translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    })
                };
            }) : [];
    availableValues.reverse();

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canSkip: false, canForward: false, showForward: true });
        const ncdGrantedYears = _.get(submissionVM, `${ncdGrantedYearsPath}.value`);
        if (ncdGrantedYears && ncdGrantedYears.code !== '0') {
            calculateFaultyClaims();
        }
    }, []);

    if (!submissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        setNavigation({
            canSkip: false,
            canForward: isValid,
            callCreateQuote: true,
            triggerLWRAPICall: true
        });
    };

    const policyStartDateOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.policyStartLabel }}
            webAnalyticsEvent={{ event_action: messages.policyStartLabel }}
            id="policy-start-overlay"
            labelText={messages.policyStartLabel}
            overlayButtonIcon={(
                <img
                    src={infotooltip}
                    alt="tooltip" />
            )}
        >
            <HDLabelRefactor id="policy-start-overlay-body" Tag="p" text={messages.policyStartOverlayBody} />
        </HDOverlayPopup>
    );

    const driverExpOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.overlayHeading }}
            webAnalyticsEvent={{ event_action: messages.overlayHeading }}
            id="driver-exp-overlay"
            labelText={messages.overlayHeading}
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
        >
            <HDLabelRefactor id="driver-exp-overlay-body" Tag="p" text={messages.overlayBody} />
        </HDOverlayPopup>
    );

    const selectOverlay = (id) => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.claimDiscountMessage }}
            webAnalyticsEvent={{ event_action: messages.claimDiscountMessage }}
            id={id}
            labelText={messages.claimDiscountMessage}
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
        >
            <HDLabelRefactor id="claim-discount-overlay-body" Tag="p" text={messages.claimDiscountMessageOverlayBody} />
        </HDOverlayPopup>
    );

    const commonOverlay = (id) => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.overlayHeading }}
            webAnalyticsEvent={{ event_action: messages.overlayHeading }}
            id={id}
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
        >
            <div id="claim-discount-overlay-container" className="start-policy__claim-discount-overlay-container">
                <p id="claim-discount-overlay-header" className="start-policy__claim-discount-overlay-header">
                    {messages.overlayHeading}
                </p>
                <p id="claim-discount-overlay-body" className="start-policy__claim-discount-overlay-body">
                    {messages.overlayBody}
                </p>
            </div>
        </HDOverlayPopup>
    );

    return (
        <Container id="policy-start-main-container" className="policy-start__container">
            <HDForm submissionVM={submissionVM} validationSchema={validationSchema} onValidation={handleValidation}>
                {(hdFormProps) => {
                    return (
                        <>
                            <Row>
                                <Col>
                                    <HDDatePicker
                                        webAnalyticsEvent={{ event_action: messages.policyStartLabel }}
                                        id="policy-start-date-picker"
                                        className="policy-start__date-picker"
                                        path={policyStartDatePath}
                                        name={policyStartDateFieldName}
                                        minDate={0}
                                        maxDate={30} // max date is 30 as per PC
                                        initialDate={periodStartDate}
                                        label={{
                                            id: 'policy-start-date-picker-label',
                                            className: 'policy-start__date-picker__label',
                                            text: messages.policyStartLabel,
                                            Tag: 'h2',
                                            icon: policyStartDateOverlay,
                                            iconPosition: 'r'
                                        }}
                                        subLabel={{
                                            id: 'policy-start-date-picker-sublabel',
                                            className: 'policy-start__date-picker__sublabel',
                                            text: messages.choose30DaysMessage,
                                            Tag: 'p'
                                        }}
                                        inputCols={[
                                            { xs: 3 },
                                            { xs: 3 },
                                            { xs: 6 }
                                        ]}
                                        inputSectionCol={{ xs: 10, xl: 8 }} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: messages.usualPayment }}
                                        id="policy-start-pay-button-group"
                                        className="policy-start__pay-button-group"
                                        availableValues={availableValues}
                                        path={insurancePaymentTypePath}
                                        name={insurancePaymentTypeFieldName}
                                        label={{
                                            id: 'policy-start-pay-label',
                                            className: 'policy-start__pay-label',
                                            Tag: 'h2',
                                            text: messages.usualPayment
                                        }}
                                        btnGroupClassName="grid grid--col-2 grid--col-lg-2" />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-4">
                                <Col>
                                    <HDDropdownList
                                        webAnalyticsEvent={{ event_action: messages.claimDiscountMessage }}
                                        id="policy-start-claim-dropdown"
                                        className="policy-start__claim-dropdown"
                                        selectSize="md-8"
                                        options={dropDownOption}
                                        path={ncdGrantedYearsPath}
                                        name={ncdGrantedYearsFieldName}
                                        label={{
                                            id: 'policy-start-claim-label',
                                            className: 'policy-start__claim-label',
                                            Tag: 'h2',
                                            text: messages.claimDiscountMessage,
                                            icon: selectOverlay('policystartselectIconClick'),
                                            iconPosition: 'r'
                                        }}
                                        onChange={(e) => { handleNcdChange(e, hdFormProps); }}
                                        theme="blue"
                                        isSearchable={false}
                                        enableNative />
                                </Col>
                            </Row>
                            {showMore(hdFormProps.values[ncdGrantedYearsFieldName]) && (
                                <>
                                    <hr />
                                    <Row className="mb-4">
                                        <Col>
                                            <HDToggleButtonGroup
                                                webAnalyticsEvent={{ event_action: messages.driverExp }}
                                                id="policy-start-other-exp-button-group"
                                                className="policy-start__other-exp-button-group"
                                                availableValues={availableValuesToggle}
                                                path={drivingExperienceFlagPath}
                                                name={drivingExperienceFlagFieldName}
                                                onChange={(e) => { handleDriverExpChange(e, hdFormProps); }}
                                                label={{
                                                    id: 'policy-start-other-exp-label',
                                                    className: 'policy-start__other-exp-label',
                                                    Tag: 'h2',
                                                    text: messages.driverExp,
                                                }}
                                                btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                        </Col>
                                    </Row>
                                    {hdFormProps.values[drivingExperienceFlagFieldName] && hdFormProps.values[drivingExperienceFlagFieldName] === 'true' && (
                                        <>
                                            <hr className="hr-mob-small" />
                                            <Row className="mb-4">
                                                <Col>
                                                    <HDDropdownList
                                                        webAnalyticsEvent={{ event_action: messages.drivingExpYears }}
                                                        id="policy-start-driving-exp-dropdown"
                                                        selectSize="lg"
                                                        label={{
                                                            id: 'policy-start-driving-exp-label',
                                                            className: 'policy-start__driving-exp-label',
                                                            Tag: 'h2',
                                                            text: messages.drivingExpYears,
                                                        }}
                                                        options={drivingExpYearsOption}
                                                        path={drivingExperienceYearsPath}
                                                        name={drivingExperienceYearsFieldName}
                                                        onChange={(e) => { handleDrivingExpYearsChange(e, hdFormProps); }}
                                                        theme="blue" />
                                                </Col>
                                            </Row>
                                            {hdFormProps.values[drivingExperienceYearsFieldName]
                                                && hdFormProps.values[drivingExperienceYearsFieldName].value !== '0'
                                                && (
                                                    <>
                                                        <hr className="hr-mob-small" />
                                                        <Row className="mb-4">
                                                            <Col>
                                                                <HDDropdownList
                                                                    webAnalyticsEvent={{ event_action: messages.experienceType }}
                                                                    id="policy-start-type-of-exp-dropdown"
                                                                    className="policy-start__type-of-exp-dropdown"
                                                                    selectSize="lg"
                                                                    label={{
                                                                        id: 'policy-start-type-of-exp-label',
                                                                        className: 'policy-start__type-of-exp-label',
                                                                        Tag: 'h2',
                                                                        text: messages.experienceType,
                                                                    }}
                                                                    options={drivingExpTypeOption}
                                                                    path={drivingExpereinceTypePath}
                                                                    name={drivingExpereinceTypeFieldName}
                                                                    theme="blue" />
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                            {faultyClaimsFlag && (
                                <>
                                    <hr />
                                    <Row className="mb-5">
                                        <Col xs={12}>
                                            <HDLabelRefactor
                                                id="policy-start-no-claims-label"
                                                Tag="h2"
                                                text={messages.protectNcd} />
                                        </Col>
                                        <Col md={8} className="pr-md-1">
                                            <HDToggleButtonGroup
                                                webAnalyticsEvent={{ event_action: messages.protectNcd }}
                                                id="policy-start-no-claims-button-group"
                                                className="policy-start__no-claims-button-group"
                                                availableValues={availableValuesToggle}
                                                path={protectNcdPath}
                                                name={protectNcdFieldName}
                                                // onChange={(e) => { handleProtectedChange(e, hdFormProps); }}

                                                btnGroupClassName="grid grid--col-2" />
                                        </Col>
                                    </Row>
                                </>
                            )}
                            <>
                                <hr className="hr-mob-small" />
                                <Row className="mb-4">
                                    <Col>
                                        <HDDropdownList
                                            webAnalyticsEvent={{ event_action: messages.monthRenewal }}
                                            id="policy-start-driving-homeRenewal-dropdown"
                                            selectSize="lg"
                                            label={{
                                                id: 'policy-start-driving-homeRenewal-label',
                                                className: 'policy-start__driving-exp-label',
                                                Tag: 'h2',
                                                text: messages.monthRenewal,
                                            }}
                                            placeholder="Please select"
                                            options={availableValuesMonth}
                                            onChange={(e) => handleHomeMonthRenewal(e)}
                                            data={{ value: homeValue, label: homeValue }}
                                            name={homeRenewalList}
                                            theme="blue" />
                                    </Col>
                                </Row>
                            </>
                        </>
                    );
                }}
            </HDForm>
            {
                quoteObject && quoteObject.quoteError !== null && quoteObject.quoteError.error && quoteObject.quoteError.error.message && (
                    <p className="error">{quoteObject.quoteError.error.message}</p>
                )
            }

            {HDToast}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        quoteObject: state.createQuoteModel,
        homeMonthRenewal: state.wizardState.app.homeMonthRenewal
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDPolicyStartDatePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    quoteObject: PropTypes.shape({
        quoteObj: PropTypes.object,
        quoteError: PropTypes.string
    }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

HDPolicyStartDatePage.defaultProps = {
    quoteObject: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDPolicyStartDatePage);
