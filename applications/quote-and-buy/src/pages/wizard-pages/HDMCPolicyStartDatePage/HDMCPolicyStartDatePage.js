import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Col, Row, Container } from 'react-bootstrap';
import * as yup from 'hastings-components/yup';
import {
    HDForm, HDLabelRefactor,
    HDInfoCardRefactor,
} from 'hastings-components';
import dayjs from 'dayjs';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDOverlayPopup as HDOverlayPopup,
    AnalyticsHDButton as HDButton,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo,
    AnalyticsHDDatePicker as HDDatePicker
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setErrorStatusCode, setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import * as messages from './HDMCPolicyStartDate.messages';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import infotooltip from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import useToast from '../../Controls/Toast/useToast';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import useScrollToTop from '../../../routes/common/useScrollToTop';
import HDQuoteService from '../../../api/HDQuoteService';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { getDataForUpdateMultiQuoteAPICall, getDataForMultiQuoteAPICallWithUpdatedFlag } from '../../../common/submissionMappers';
import formatRegNumber from '../../../common/formatRegNumber';
import { getLatestQuoteByInceptionDate } from '../../../common/dateHelpers';
import trackQuoteData from '../../../web-analytics/trackQuoteData';
import { PAYMENT_TYPE_ANNUALLY_CODE } from '../../../constant/const';
import { availableValuesMonth } from '../../../common/submissionMappers/helpers';
import homeRenewalEventTracking from '../../../web-analytics/homeRenewalEventTracking';

const HDMCPolicyStartDatePage = (props) => {
    const {
        submissionVM,
        setNavigation,
        mcsubmissionVM,
        currentPageIndex,
        updateMultiQuoteError,
        multiQuoteError,
        handleForward,
        pageMetadata,
        homeMonthRenewal
    } = props;
    const [faultyClaimsFlag, setFaultyClaimsFlag] = useState(false);
    const [validationToggle, setValidationToggle] = useState(true);
    const translator = useContext(TranslatorContext);
    const location = useLocation();
    const [HDToast, addToast] = useToast();
    const dispatch = useDispatch();
    const [isValidContinue, setIsValidContinue] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const currentCarIndex = useSelector((state) => state.wizardState.app.currentPageIndex);
    const isParentCar = useSelector((state) => state.wizardState.data.mcsubmissionVM.quotes.children[currentCarIndex].isParentPolicy.value);
    const homeValue = useSelector((state) => state.wizardState.app.homeMonthRenewal);
    const renewalType = useSelector((state) => state.wizardState.app.renewalType);
    const renewalMonth = useSelector((state) => state.wizardState.app.renewalMonth);
    const [homeRenewal, setHomeRenewal] = useState({ value: homeValue, label: homeValue });
    const [displayHomeRenewal, setDisplayHomeRenewal] = useState(false);

    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';

    const baseDataPath = 'baseData';
    const policyStartDateFieldName = 'periodStartDate';
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
    const voluntaryExcessFieldName = 'voluntaryExcess';
    const voluntaryExcessPath = `${vehiclePath}.${voluntaryExcessFieldName}`;
    const coverTypeFieldName = 'coverType';
    const coverTypePath = `${vehiclePath}.${coverTypeFieldName}`;
    const [defaultValues, setDefaultValues] = useState(false);

    useScrollToTop(currentPageIndex);

    const getSingleSubmissionVM = () => {
        return mcsubmissionVM.quotes.children[currentPageIndex] || {};
    };

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

    const sendHomeRenewalWebAnalyticsEvent = (args) => {
        homeRenewalEventTracking({
            ...args,
            renewal_type: renewalType,
            renewal_month: renewalMonth
        });
    };

    const displayAmount = (value) => `£${value}`;

    const displayCover = (value) => `${value}`;

    const setDefaultVolExcessCoverType = () => {
        mcsubmissionVM.quotes.children.map((quote) => {
            const localvoluntaryExcessValue = _.get(quote, `${voluntaryExcessPath}.value`, null);
            const localCoverTypeValue = _.get(quote, `${voluntaryExcessPath}.value`, null);
            if (localvoluntaryExcessValue === null) _.set(quote, `${voluntaryExcessPath}.value`, '250');
            if (localCoverTypeValue === null) _.set(quote, `${coverTypePath}.value`, 'comprehensive');
            return null;
        });
    };

    const setPaymentType = (paymentType) => {
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            _.set(mcsubmissionVM.value.quotes[i].lobData.privateCar.coverables.vehicles[0], 'insurancePaymentType', paymentType);
        }
    };

    useEffect(() => {
        if (!isEditQuoteJourney) {
            setDefaultVolExcessCoverType();
        }

        setDefaultValues(true);
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            const quoteObject = mcsubmissionVM.quotes.children[i];
            if (quoteObject.value.isParentPolicy && quoteObject.value.lobData.privateCar.coverables.vehicles[0].insurancePaymentType) {
                setPaymentType(quoteObject.value.lobData.privateCar.coverables.vehicles[0].insurancePaymentType);
                break;
            }
        }
    }, []);

    const resetDrivingExpType = (hdFormProps) => {
        _.set(getSingleSubmissionVM(), `${drivingExpereinceTypePath}.value`, '');
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
                    iconType: 'tick',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

    const resetDrivingYears = (hdFormProps) => {
        _.set(getSingleSubmissionVM(), `${drivingExperienceYearsPath}.value`, '');
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
        _.set(getSingleSubmissionVM(), `${drivingExperienceFlagPath}.value`, '');
        hdFormProps.setFieldValue(`${drivingExperienceFlagFieldName}`, '');
        hdFormProps.setFieldTouched(`${drivingExperienceFlagFieldName}`, false, false);
        resetDrivingYears(hdFormProps);
    };

    const faultyClaimsList = () => {
        const claimsDetails = _.get(getSingleSubmissionVM(), `${claimsDetailPath}.value`);
        const validationDate = new Date(new Date().getFullYear() - 4, new Date().getMonth(), 1);
        return claimsDetails.filter((claim) => claim.wasItMyFault === true && validationDate <= new Date(claim.accidentDate));
    };

    const calculateFaultyClaims = () => {
        const faultyClaims = faultyClaimsList();
        if (faultyClaims.length < 2) {
            setFaultyClaimsFlag(true);
        } else {
            setFaultyClaimsFlag(false);
        }
    };

    const handleNcdChange = (event, hdFormProps) => {
        if (event.target.value.value !== '0') {
            resetDrivingExpFlag(hdFormProps);
            calculateFaultyClaims();

            if (faultyClaimsList().length >= 2) {
                // Default value of protectNCD is expected as string for child car
                // Rating error will be thrown instead
                _.set(getSingleSubmissionVM(), `${protectNcdPath}.value`, 'false');
            }
        } else {
            hdFormProps.setFieldValue('protectNCD', '');
            _.set(getSingleSubmissionVM(), `${protectNcdPath}.value`, '');
            hdFormProps.setFieldTouched(`${protectNcdFieldName}`, false, false);
            setFaultyClaimsFlag(false);
            setValidationToggle(!validationToggle);
        }
    };

    const handleVolExcessChange = (event, hdFormProps) => { };

    const handleCoverTypeChange = (event, hdFormProps) => { };

    const handlePayment = (event) => {
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            _.set(mcsubmissionVM.value.quotes[i].lobData.privateCar.coverables.vehicles[0], 'insurancePaymentType', event.target.value);
        }
    };

    // returns date of parent car or policy
    const getParentPolicyStartDate = () => {
        let initialParentPolicyStartDate;
        for (let i = 0; i < mcsubmissionVM.quotes.children.length; i += 1) {
            if (mcsubmissionVM.quotes.children[i].isParentPolicy.value) {
                if (!mcsubmissionVM.quotes.children[i].value.baseData.periodStartDate) {
                    const pcStartDate = _.get(mcsubmissionVM.quotes.children[i], 'value.baseData.pccurrentDate', null);
                    initialParentPolicyStartDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
                    const periodEndDate = _.get(mcsubmissionVM.quotes.children[i], 'baseData.periodEndDate', null);
                    const formatedPeriodEndDate = new Date(`${1 + periodEndDate.month.value}/${periodEndDate.day.value}/${periodEndDate.year.value}`);
                    const patOneYearFromInceptionDate = new Date(new Date(formatedPeriodEndDate)
                        .setFullYear(new Date(formatedPeriodEndDate).getFullYear() - 1));
                    _.set(mcsubmissionVM.quotes.children[i], 'baseData.periodStartDate', {
                        year: patOneYearFromInceptionDate.getFullYear(),
                        month: patOneYearFromInceptionDate.getMonth() + 1,
                        day: patOneYearFromInceptionDate.getDate()
                    });
                }
                const { month, day, year } = mcsubmissionVM.quotes.children[i].baseData.periodStartDate.value;
                const parentPolicyStartDateString = `${1 + month}/${day}/${year}`;
                initialParentPolicyStartDate = new Date(parentPolicyStartDateString);
                break;
            }
        }
        return initialParentPolicyStartDate;
    };

    const getChildMinDate = () => {
        const presentDate = getParentPolicyStartDate();
        presentDate.setHours(0, 0, 0, 0);
        return ((presentDate.getTime() - getParentPolicyStartDate().getTime()) / (1000 * 3600 * 24));
    };

    const getChildMaxDate = (getPCStartDate) => {
        const presentDate = getPCStartDate;
        presentDate.setHours(0, 0, 0, 0);
        return ((presentDate.getTime() - getParentPolicyStartDate().getTime()) / (1000 * 3600 * 24));
    };

    const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
    const futureAtMidnight = new Date(new Date().setHours(720, 0, 0, 0)); // change hour to 744 after PC date change

    // for changing date range for child car
    if (!getSingleSubmissionVM().value.isParentPolicy) {
        const pcStartDate = _.get(getSingleSubmissionVM().value, 'baseData.pccurrentDate', new Date());
        const pcDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
        todayAtMidnight.setTime(getParentPolicyStartDate().getTime());
        futureAtMidnight.setTime(pcDate.getTime() + 334 * 86400000);
    } else {
        let pcStartDate = _.get(getSingleSubmissionVM().value, 'baseData.pccurrentDate', new Date());
        pcStartDate = new Date(pcStartDate);
        pcStartDate = Date.UTC(pcStartDate.getUTCFullYear(), pcStartDate.getUTCMonth(), pcStartDate.getUTCDate());
        const pcDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
        todayAtMidnight.setTime(new Date(pcDate.setHours(0, 0, 0, 0)));
        futureAtMidnight.setTime(new Date(pcDate.setHours(720, 0, 0, 0)));
    }

    const childValidationSchema = yup.object({
        [coverTypeFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(coverTypePath, null, getSingleSubmissionVM()),
        [voluntaryExcessFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(voluntaryExcessPath, null, getSingleSubmissionVM()),
        [ncdGrantedYearsFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(ncdGrantedYearsPath, null, getSingleSubmissionVM()),
        [policyStartDateFieldName]: yup.date()
            .required(messages.requiredFieldMessage)
            .typeError(messages.dateErrorMessage)
            .min(todayAtMidnight, messages.datePastErrorMessage)
            .max(futureAtMidnight, messages.dateErrorMessage)
            .VMValidation(policyStartDatePath, messages.dateErrorMessage, getSingleSubmissionVM()),
        [drivingExperienceFlagFieldName]: yup.string()
            .when(`${ncdGrantedYearsFieldName}`, (value, schema) => {
                const ncd = _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`) !== undefined
                    ? _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`).code : '';
                return (ncd === '0') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExperienceFlagPath, null, getSingleSubmissionVM()),
        [protectNcdFieldName]: yup.string()
            .when(`${ncdGrantedYearsFieldName}`, (value, schema) => {
                const ncd = _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`) !== undefined
                    ? _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`).code : '';
                return (ncd !== '0' && calculateFaultyClaims && faultyClaimsFlag) ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(protectNcdPath, null, getSingleSubmissionVM()),
        [drivingExperienceYearsFieldName]: yup.string()
            .when(`${drivingExperienceFlagFieldName}`, (value, schema) => {
                return (value === 'true') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExperienceYearsPath, null, getSingleSubmissionVM()),
        [drivingExpereinceTypeFieldName]: yup.string()
            .when(`${drivingExperienceYearsFieldName}`, (value, schema) => {
                const years = _.get(getSingleSubmissionVM(), `${drivingExperienceYearsPath}.value`) !== undefined
                    ? _.get(getSingleSubmissionVM(), `${drivingExperienceYearsPath}.value`).code : '';
                return (years !== '' && years !== '0') ? schema.required(messages.requiredFieldMessage) : schema;
            })
            .VMValidation(drivingExpereinceTypePath, null, getSingleSubmissionVM()),
    });

    const parentValidationSchema = childValidationSchema.concat(yup.object({
        [insurancePaymentTypeFieldName]: yup.string()
            .required(messages.requiredFieldMessage)
            .VMValidation(insurancePaymentTypePath, null, getSingleSubmissionVM())
    }));

    const availableValuesToggle = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];

    const dropDownOption = mcsubmissionVM ? _.get(getSingleSubmissionVM(), `${vehiclePath}.${'ncdProtection'}.${ncdGrantedYearsFieldName}`)
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

    const voluntaryExcessOptions = mcsubmissionVM ? _.get(getSingleSubmissionVM(), voluntaryExcessPath)
        .aspects
        .availableValues
        .map((typeCode) => {
            return {
                value: typeCode.code,
                label: displayAmount(translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                }))
            };
        }) : [];

    const coverTypeOptions = mcsubmissionVM ? _.get(getSingleSubmissionVM(), coverTypePath)
        .aspects
        .availableValues
        .map((typeCode) => {
            return {
                value: typeCode.code,
                label: displayCover(translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                }))
            };
        }).filter((obj) => obj.value === 'comprehensive' || obj.value === 'tpft') : [];

    const drivingExpYearsOption = mcsubmissionVM
        ? _.get(getSingleSubmissionVM(), `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExperienceYearsFieldName}`)
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

    const drivingExpTypeOption = mcsubmissionVM
        ? _.get(getSingleSubmissionVM(), `${vehiclePath}.${'ncdProtection'}.${'drivingExperience'}.${drivingExpereinceTypeFieldName}`)
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

    const availableValues = mcsubmissionVM ? _.get(getSingleSubmissionVM(), insurancePaymentTypePath)
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

    const fillPolicyStartDate = () => {
        if (!isEditQuoteJourney && mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes) {
            const parentOject = mcsubmissionVM.value.quotes.find((quoteObj) => quoteObj && quoteObj.isParentPolicy);
            const parentStartDate = _.get(parentOject, policyStartDatePath, undefined);
            if (parentStartDate) {
                _.set(getSingleSubmissionVM(), `${policyStartDatePath}.value`, parentStartDate);
                mcsubmissionVM.value.quotes.map((quoteObj) => {
                    if (!quoteObj.isParentPolicy) {
                        _.set(quoteObj, policyStartDatePath, parentStartDate);
                    }
                    return null;
                });
            }
        }
    };

    const handleDateChange = () => {
        // Change child cars date when there is change for parent car
        if (getSingleSubmissionVM().value.isParentPolicy) {
            fillPolicyStartDate();
        }
    };

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canSkip: false, canForward: false, showForward: true });
        const ncdGrantedYears = _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`);
        if (ncdGrantedYears && ncdGrantedYears.code !== '0') {
            calculateFaultyClaims();
        }
        // To handle hard sell and soft sell
        if (!getSingleSubmissionVM().value.isParentPolicy) {
            fillPolicyStartDate();
        }
    }, []);

    // calculate after car changes
    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canSkip: false, canForward: false, showForward: true });
        const ncdGrantedYears = _.get(getSingleSubmissionVM(), `${ncdGrantedYearsPath}.value`);
        if (ncdGrantedYears && ncdGrantedYears.code !== '0') {
            calculateFaultyClaims();
        } else {
            setFaultyClaimsFlag(false);
        }
        if (getSingleSubmissionVM().value.isParentPolicy) {
            fillPolicyStartDate();
        }
        if (isParentCar) {
            setDisplayHomeRenewal(true);
        } else {
            setDisplayHomeRenewal(false);
        }
        setHomeRenewal(homeValue);
    }, [currentPageIndex]);

    if (!mcsubmissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        setIsValidContinue(isValid);
        if (currentPageIndex === mcsubmissionVM.quotes.children.length - 1) {
            setNavigation({
                canSkip: false,
                canForward: isValid,
                showForward: false,
                updateMultiQuoteFlag: false,
                createMultiQuoteFlag: true,
                triggerLWRAPICall: true
            });
        } else {
            setNavigation({
                canSkip: false,
                canForward: isValid,
                showForward: false,
                updateMultiQuoteFlag: true,
                createMultiQuoteFlag: false,
                triggerLWRAPICall: true
            });
        }
    };

    const setChildInsurancePaymentType = () => {
        let parentPaymentType = PAYMENT_TYPE_ANNUALLY_CODE;
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) {
                parentPaymentType = _.get(mcsubmissionVM.value.quotes[i],
                    'lobData.privateCar.coverables.vehicles[0].insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
                break;
            }
        }
        mcsubmissionVM.value.quotes.map((quoteObj) => {
            if (!quoteObj.isParentPolicy) {
                _.set(quoteObj, 'lobData.privateCar.coverables.vehicles[0].insurancePaymentType', parentPaymentType);
            }
            return null;
        });
    };

    const attemptForward = () => {
        showLoader();
        const confirmEventData = {
            event_value: messages.eventValue,
            event_action: messages.monthRenewal,
            event_label: renewalMonth,
            element_id: messages.elementId,
        };
        _.set(mcsubmissionVM.value, `quotes[${currentPageIndex}].isQuoteToBeUpdated`, true);
        if (currentPageIndex === mcsubmissionVM.quotes.children.length - 1) {
            HDQuoteService.multiQuote(getDataForMultiQuoteAPICallWithUpdatedFlag(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(result.quotes));
                    handleForward();
                    hideLoader();
                    trackQuoteData(result, translator);
                    trackAPICallSuccess('Multi Quote');
                    sendHomeRenewalWebAnalyticsEvent(confirmEventData);
                }).catch((error) => {
                    hideLoader();
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    dispatch(setErrorStatusCode(error && error.error && error.error.data && error.error.data.appErrorCode ? error.error.data.appErrorCode : error.status));
                    handleForward();
                });
        } else {
            HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(result.quotes));
                    setChildInsurancePaymentType();
                    handleForward();
                    hideLoader();
                    trackAPICallSuccess('Multi Quote');
                }).catch((error) => {
                    hideLoader();
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    dispatch(setErrorStatusCode(error && error.error && error.error.data && error.error.data.appErrorCode ? error.error.data.appErrorCode : error.status));
                    handleForward();
                });
        }
    };

    const voluntaryExcessOverlay = (
        <HDOverlayPopup
            webAnalyticsEvent={{ event_action: messages.overlayHeaderOne }}
            id="mc-policy-start-popup-your-excess"
            webAnalyticsView={{ ...pageMetadata, page_section: messages.overlayHeaderOne }}
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
            labelText={messages.overlayHeaderOne}
        >
            <p>
                {messages.overlayBodyOne}
                {messages.overlayBodyTwo}
                {messages.overlayBodyThree}
            </p>
            <HDLabelRefactor className="mt-5" Tag="h3" text={messages.overlayHeaderTwo} />
            <p>{messages.overlayBodyVoluntaryExcess}</p>
            <HDLabelRefactor className="mt-5" Tag="h3" text={messages.overlayHeaderThree} />
            <p>{messages.overBodyCompulsoryExcess}</p>
            <HDLabelRefactor className="mt-5" Tag="h3" text={messages.overlayHeaderFour} />
            <p>{messages.overBodyDesc}</p>
        </HDOverlayPopup>
    );

    const policyStartDateOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.policyStartLabel }}
            webAnalyticsEvent={{ event_action: messages.policyStartLabel }}
            id="mc-policy-start-policy-start-overlay"
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
            labelText={messages.policyStartLabel}
        >
            <p>{messages.policyStartOverlayBody}</p>
        </HDOverlayPopup>
    );

    const selectOverlay = (id) => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.claimDiscountMessage }}
            webAnalyticsEvent={{ event_action: messages.claimDiscountMessage }}
            id={id}
            overlayButtonIcon={<img src={infotooltip} alt="tooltip" />}
            labelText={getSingleSubmissionVM().value.isParentPolicy
                ? messages.claimDiscountMessage : messages.childClaimDiscountOverlayMessage}
        >
            <p>
                {getSingleSubmissionVM().value.isParentPolicy
                    ? messages.claimDiscountMessageOverlayBody : messages.childClaimDiscountMessageOverlayBody}
            </p>
        </HDOverlayPopup>
    );

    const getVehicleDetails = (details, type) => {
        if (type === 'regno' && details) {
            return formatRegNumber(details.license) || '';
        } if (type === 'year' && details) {
            return details.yearManufactured || '';
        } if (type === 'make' && details) {
            return details.make || '';
        }
        return '';
    };

    const getChildCarMaxDateText = (getPCStartDate) => {
        return dayjs(getPCStartDate).add(334, 'day').format('DD/MM/YYYY');
    };

    return (
        <>
            {defaultValues ? (
                <Container className="mc-policy-start-container">
                    <Row>
                        <Col>
                            <HDForm
                                key={`MCStartdateForm${currentPageIndex}`}
                                passedKey={`MCStartdateFormik${currentPageIndex}`}
                                submissionVM={getSingleSubmissionVM()}
                                validationSchema={getSingleSubmissionVM().value.isParentPolicy ? parentValidationSchema : childValidationSchema}
                                onValidation={handleValidation}
                            >
                                {(hdFormProps) => {
                                    let pcStartDate = _.get(getSingleSubmissionVM().value, 'baseData.pccurrentDate', new Date());
                                    pcStartDate = new Date(pcStartDate);
                                    pcStartDate = Date.UTC(pcStartDate.getUTCFullYear(), pcStartDate.getUTCMonth(), pcStartDate.getUTCDate());
                                    const getPCStartDate = (pcStartDate) ? new Date(pcStartDate) : new Date();
                                    return (
                                        <>
                                            <HDLabelRefactor
                                                Tag="h1"
                                                text={getSingleSubmissionVM().value.isParentPolicy ? messages.parentHeader : messages.childHeader}
                                                id="mc-policy-start-header-label" />
                                            <div className="container--milestone-cards ml-0 margin-bottom-lg">
                                                <div className="horizontal-line--bright" />
                                                <HDCompletedCardInfo
                                                    text={getVehicleDetails(getSingleSubmissionVM().value.lobData.privateCar.coverables.vehicles[0], 'regno')}
                                                    variant="car"
                                                    additionalText={
                                                        `${_.get(getSingleSubmissionVM().value.lobData.privateCar.coverables.vehicles[0], 'yearManufactured')}
                                                    ${_.get(getSingleSubmissionVM().value.lobData.privateCar.coverables.vehicles[0], 'make')}
                                                    ${_.get(getSingleSubmissionVM().value.lobData.privateCar.coverables.vehicles[0], 'model')}`} />
                                                <div className="horizontal-line--bright" />
                                            </div>
                                            <HDDropdownList
                                                webAnalyticsEvent={{ event_action: messages.voluntaryExcessQuestion }}
                                                id={`mc-policy-start-voluntary-Excess-dropdown${currentPageIndex}`}
                                                selectSize="lg"
                                                label={{
                                                    text: messages.voluntaryExcessQuestion,
                                                    Tag: 'h2',
                                                    id: 'mc-policy-start-vol-excess-label',
                                                    icon: voluntaryExcessOverlay,
                                                    iconPosition: 'r'
                                                }}
                                                options={voluntaryExcessOptions}
                                                path={voluntaryExcessPath}
                                                name={voluntaryExcessFieldName}
                                                onChange={(e) => { handleVolExcessChange(e, hdFormProps); }}
                                                theme="blue" />
                                            <hr className="mt-5" />
                                            <HDDatePicker
                                                webAnalyticsEvent={{ event_action: messages.policyStartLabel }}
                                                id={`policy-start-date-picker${currentPageIndex}`}
                                                className="mc-policy-start__date--picker mb-3"
                                                path={policyStartDatePath}
                                                name={policyStartDateFieldName}
                                                minDate={getSingleSubmissionVM().value.isParentPolicy ? 0 : getChildMinDate()}
                                                maxDate={getSingleSubmissionVM().value.isParentPolicy ? 30 : 334 - (-1 * getChildMaxDate(getPCStartDate))}
                                                initialDate={getSingleSubmissionVM().value.isParentPolicy ? getPCStartDate : getParentPolicyStartDate()}
                                                label={{
                                                    text: messages.policyStartLabel,
                                                    Tag: 'h2',
                                                    icon: policyStartDateOverlay,
                                                    iconPosition: 'r',
                                                    className: 'mc-policy-start__date-picker__label'
                                                }}
                                                subLabel={{
                                                    text: `${getSingleSubmissionVM().value.isParentPolicy
                                                        ? messages.choose30DaysMessage : messages.choose330DaysMessage(getChildCarMaxDateText(getPCStartDate))}`,
                                                    Tag: 'p',
                                                    className: 'mc-policy-start__date-picker__sublabel'
                                                }}
                                                onChange={handleDateChange}
                                                inputCols={[
                                                    { xs: 3 },
                                                    { xs: 3 },
                                                    { xs: 6 }
                                                ]}
                                                inputSectionCol={{ xs: 10, xl: 8 }} />
                                            <HDInfoCardRefactor
                                                image={tipCirclePurple}
                                                paragraphs={getSingleSubmissionVM().value.isParentPolicy
                                                    ? [messages.startDateNote] : [messages.childStartDateNote]}
                                                size="thin"
                                                className="margin-top-xl" />
                                            <hr className="mt-5" />
                                            <HDDropdownList
                                                webAnalyticsEvent={{ event_action: messages.coverTypeQestion }}
                                                id={`mc-policy-start-cover-type-dropdown${currentPageIndex}`}
                                                selectSize="lg"
                                                label={{
                                                    text: messages.coverTypeQestion,
                                                    Tag: 'h2',
                                                    id: 'mc-policy-start-cover-type-q-label'
                                                }}
                                                options={coverTypeOptions}
                                                path={coverTypePath}
                                                name={coverTypeFieldName}
                                                onChange={(e) => { handleCoverTypeChange(e, hdFormProps); }}
                                                theme="blue" />
                                            <hr className="mt-5" />
                                            {getSingleSubmissionVM().value.isParentPolicy ? (
                                                <div id="policyStartToggleContainer" className="policystarttoggle pb-3">
                                                    <HDToggleButtonGroup
                                                        webAnalyticsEvent={{ event_action: messages.usualPayment }}
                                                        id={`mc-policy-start-payment-frequency-button-group${currentPageIndex}`}
                                                        availableValues={availableValues}
                                                        path={insurancePaymentTypePath}
                                                        name={insurancePaymentTypeFieldName}
                                                        label={{
                                                            text: messages.usualPayment,
                                                            Tag: 'h2',
                                                            id: 'mc-policy-start-payment-q-label'
                                                        }}
                                                        onChange={(e) => { handlePayment(e, hdFormProps); }}
                                                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                                </div>
                                            ) : null}
                                            {getSingleSubmissionVM().value.isParentPolicy ? <hr /> : null}
                                            <HDLabelRefactor
                                                id="mc-policy-start-no-claims-q-label"
                                                className=""
                                                text={getSingleSubmissionVM().value.isParentPolicy
                                                    ? messages.claimDiscountMessage : messages.childClaimDiscountMessage}
                                                Tag="h2"
                                                icon={selectOverlay('policystartselectIconClick')}
                                                iconPosition="r" />
                                            <HDInfoCardRefactor
                                                image={exclamationIcon}
                                                paragraphs={getSingleSubmissionVM().value.isParentPolicy ? [messages.ncdNote] : [messages.childNcdNote]}
                                                size="thin"
                                                className="mb-4" />
                                            <HDDropdownList
                                                webAnalyticsEvent={{ event_action: messages.claimDiscountMessage }}
                                                className="mc-policy-start__ncd-dropdown mb-4 margin-top-md"
                                                id={`mc-policy-start-claim-discount-dropdown${currentPageIndex}`}
                                                selectSize="lg"
                                                options={dropDownOption}
                                                path={ncdGrantedYearsPath}
                                                name={ncdGrantedYearsFieldName}
                                                onChange={(e) => { handleNcdChange(e, hdFormProps); }}
                                                theme="blue"
                                                isSearchable={false}
                                                enableNative />
                                            {/* <hr className="mt-5" /> */}
                                            {showMore(hdFormProps.values[ncdGrantedYearsFieldName]) && (
                                                <>
                                                    <hr className="mt-5" />
                                                    <HDToggleButtonGroup
                                                        webAnalyticsEvent={{ event_action: messages.driverExp }}
                                                        id={`mc-policy-start-driving-exp-button-group${currentPageIndex}`}
                                                        availableValues={availableValuesToggle}
                                                        path={drivingExperienceFlagPath}
                                                        name={drivingExperienceFlagFieldName}
                                                        onChange={(e) => { handleDriverExpChange(e, hdFormProps); }}
                                                        label={{
                                                            text: messages.driverExp,
                                                            Tag: 'h2',
                                                            id: 'mc-policy-start-other-exp-label'
                                                        }}
                                                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                                    {hdFormProps.values[drivingExperienceFlagFieldName]
                                                    && hdFormProps.values[drivingExperienceFlagFieldName] === 'true' && (
                                                        <>
                                                            <hr className="mt-5" />
                                                            <HDDropdownList
                                                                webAnalyticsEvent={{ event_action: messages.drivingExpYears }}
                                                                id={`mc-policy-start-driving-exp-years${currentPageIndex}`}
                                                                selectSize="lg"
                                                                label={{
                                                                    text: messages.drivingExpYears,
                                                                    Tag: 'h2',
                                                                    id: 'mc-policy-start-driving-exp-label'
                                                                }}
                                                                options={drivingExpYearsOption}
                                                                path={drivingExperienceYearsPath}
                                                                name={drivingExperienceYearsFieldName}
                                                                onChange={(e) => { handleDrivingExpYearsChange(e, hdFormProps); }}
                                                                theme="blue" />
                                                            {hdFormProps.values[drivingExperienceYearsFieldName]
                                                                && hdFormProps.values[drivingExperienceYearsFieldName].value !== '0' && (
                                                                <>
                                                                    <hr className="mt-5" />
                                                                    <HDDropdownList
                                                                        webAnalyticsEvent={{ event_action: messages.experienceType }}
                                                                        id={`mc-policy-start-driving-exp-type${currentPageIndex}`}
                                                                        selectSize="lg"
                                                                        label={{
                                                                            text: messages.experienceType,
                                                                            Tag: 'h2',
                                                                            id: 'mc-policy-start-no-claims-label'
                                                                        }}
                                                                        options={drivingExpTypeOption}
                                                                        path={drivingExpereinceTypePath}
                                                                        name={drivingExpereinceTypeFieldName}
                                                                        theme="blue"
                                                                        onChange={(e) => { handleCoverTypeChange(e, hdFormProps); }} />
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {faultyClaimsFlag && (
                                                <>
                                                    <hr className="hr-mob-small" />
                                                    <HDToggleButtonGroup
                                                        webAnalyticsEvent={{ event_action: messages.protectNcd }}
                                                        id={`mc-policy-start-protect-ncd-button-group${currentPageIndex}`}
                                                        availableValues={availableValuesToggle}
                                                        path={protectNcdPath}
                                                        name={protectNcdFieldName}
                                                        // onChange={(e) => { handleProtectedChange(e, hdFormProps); }}
                                                        label={{
                                                            text: getSingleSubmissionVM().value.isParentPolicy
                                                                ? messages.protectNcd : messages.childProtectNcd,
                                                            Tag: 'h2',
                                                            id: 'mc-policy-start-no-claims-label'
                                                        }}
                                                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                                </>
                                            )}
                                            {displayHomeRenewal && (
                                                <>
                                                    <hr className="hr-mob-small" />
                                                    <Row className="mb-4">
                                                        <Col>
                                                            <HDDropdownList
                                                                webAnalyticsEvent={{ event_action: messages.monthRenewal }}
                                                                id="MC-policy-start-driving-homeRenewal-dropdown"
                                                                selectSize="lg"
                                                                label={{
                                                                    id: 'MC-policy-start-driving-homeRenewal-label',
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
                                            )}
                                        </>
                                    );
                                }}
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.continueLabel }}
                                    id="mc-policy-start-continue-button"
                                    variant="primary"
                                    label={messages.continueLabel}
                                    onClick={() => attemptForward()}
                                    disabled={!isValidContinue}
                                    className="margin-top-xl"
                                    size="md" />
                            </HDForm>
                            {updateMultiQuoteError && (
                                <p className="error">{updateMultiQuoteError.status}</p>
                            )}
                            {multiQuoteError && (
                                <p className="error">{multiQuoteError.status}</p>
                            )}
                            {HDToast}
                        </Col>
                    </Row>
                </Container>
            )
                : null}
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        currentPageIndex: state.wizardState.app.currentPageIndex,
        updateMultiQuoteError: state.updateMultiQuoteModel.multiQuoteError,
        multiQuoteError: state.multiQuoteModel.multiQuoteError,
        updateMultiQuoteFlag: state.wizardState.app.updateMultiQuoteFlag,
        createMultiQuoteFlag: state.wizardState.app.createMultiQuoteFlag,
        homeMonthRenewal: state.wizardState.app.homeMonthRenewal
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCPolicyStartDatePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object,
    }).isRequired,
    currentPageIndex: PropTypes.number.isRequired,
    updateMultiQuoteError: PropTypes.shape({
        status: PropTypes.number
    }).isRequired,
    multiQuoteError: PropTypes.shape({
        error: PropTypes.shape({
            message: PropTypes.string
        }),
        status: PropTypes.number
    }).isRequired,
    handleForward: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCPolicyStartDatePage);
