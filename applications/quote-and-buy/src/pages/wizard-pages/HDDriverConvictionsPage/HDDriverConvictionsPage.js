/* eslint-disable max-len */
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef
} from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import * as yup from 'hastings-components/yup';
import {
    HDForm,
    HDLabelRefactor,
    HDInteractiveCardRefactor
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import _ from 'lodash';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDModal as HDModal,
    AnalyticsHDButtonDashed as HDButtonDashed
} from '../../../web-analytics';
import { trackEvent } from '../../../web-analytics/trackData';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import * as messages from './HDDriverConvictionsPage.messages';
import { setNavigation as setNavigationAction, } from '../../../redux-thunk/actions';
import trashImage from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Trash.svg';
import editImage from '../../../assets/images/wizard-images/hastings-icons/icons/Icons_Edit.svg';

const HDDriverConvictionsPage = (
    props
) => {
    const viewModelService = useContext(ViewModelServiceContext);
    const {
        submissionVM,
        setNavigation,
        pageId,
        pageMetadata,
        MCsubmissionVM,
        multiCarFlag,
        mcsubmissionVM
    } = props;
    const translator = useContext(TranslatorContext);

    useEffect(() => {
        const MCsubmissionVMQuote = _.get(MCsubmissionVM, 'value.quotes', []);
        if (MCsubmissionVMQuote.length && multiCarFlag) {
            setNavigation({
                canForward: false,
                showForward: true,
                triggerLWRAPICall: false,
                updateQuoteFlag: false
            });
        } else {
            setNavigation({
                canForward: false,
                showForward: true,
                updateQuoteFlag: true,
                triggerLWRAPICall: true
            });
        }
    }, [setNavigation]);

    const availableDefaultValues = [{
        value: 'true',
        name: 'Yes'
    }, {
        value: 'false',
        name: 'No'
    }];

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
    && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;
    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    const isAnyCriminalConvictionExistsFieldName = 'unspentNonMotorConvictions';
    const claimsAndConvictionsPath = `${driverPath}.claimsAndConvictions`;
    const convictionsCollectionPath = `${claimsAndConvictionsPath}.convictionsCollection`;
    const anyConvictionsName = 'anyConvictions';
    const anyConvictionsPath = `${claimsAndConvictionsPath}.${anyConvictionsName}`;
    const anyConvictionString = _.get(submissionVM, anyConvictionsPath.concat('.value'));
    const [anyConviction, setAnyConviction] = useState(anyConvictionString === 'true');
    const isAnyCriminalConvictionExistsPath = `${claimsAndConvictionsPath}.${isAnyCriminalConvictionExistsFieldName}`;
    const availableConvictionCodeValuesName = 'convictionCode';
    const availableConvictionCodeTypesName = 'convictionCodeType';
    const convictionDateName = 'convictionDate';
    const convictionDateYearName = 'convictionDateYear';
    const convictionDateMonthName = 'convictionDateMonth';
    const penaltyPointsName = 'penaltyPoints';
    const isThereBanForDrivingName = 'isThereBanForDriving';
    const drivingBanMonthsName = 'drivingBanMonths';
    const [showConvictionModal, setShowConvictionModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [anyConvictionsReset, setAnyConvictionsReset] = useState(false);
    const [convictionList, setConvictionList] = useState([]);
    const [convictionIndex, setConvictionIndex] = useState(null);
    const [editedConviction, setEditedConviction] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isModalAlreadyOpen, setIsModalAlreadyOpen] = useState(false);
    const [convictionMonth, setConvictionMonth] = useState('');
    const [convictionYear, setConvictionYear] = useState('');
    const [convictionCodeValue, setConvictionCodeValue] = useState(null);
    const yearInputRef = useRef();
    const availableConvictionCodesTypes = [
        {
            value: 'speedlimits',
            label: 'SP-Speed limits',
        }, {
            value: 'constructionanduseoffences',
            label: 'CU-Construction and use offences',
        }, {
            value: 'trafficdirectionandsigns',
            label: 'TS-Traffic direction and signs',
        }, {
            value: 'drinkordrugs',
            label: 'DR-Drink or drugs',
        }, {
            value: 'insuranceoffences',
            label: 'IN-Insurance offences',
        }, {
            value: 'carelessdriving',
            label: 'CD-Careless driving',
        }, {
            value: 'licenceoffences',
            label: 'LC-Licence offences',
        }, {
            value: 'miscellaneousoffences',
            label: 'MS_Miscellaneous Offences',
        }, {
            value: 'pedestriancrossings',
            label: 'PC-Pedestrain crossings',
        }, {
            value: 'specialcode',
            label: 'TT-Special code',
        }, {
            value: 'accidentoffences',
            label: 'AC-Accident offences',
        }, {
            value: 'recklessdangerousdriving',
            label: 'DD-Reckless/dangerous driving',
        }, {
            value: 'motorwayoffences',
            label: 'MW-Motorway offences',
        }, {
            value: 'disqualifieddriver',
            label: 'BA-Disqualified driver',
        }, {
            value: 'provisionallicenceoffences',
            label: 'PL-Provisional licence offences',
        }, {
            value: 'theftorunauthorisedtaking',
            label: 'UT-Theft or unauthorised taking',
        }];
    const [availableConvictionCodeValues, setAvailableConvictionCodeValues] = useState([]);

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const licenceSuccessfulValidated = _.get(driversPageState, `${driverIndex}.licenceSuccessfulValidated`, false);

    const showConvictions = !licenceSuccessfulValidated;

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const convictionVM = useMemo(() => {
        return viewModelService.create(
            editedConviction,
            'pc',
            'com.hastings.edgev10.capabilities.policyjob.lob.privatecar.coverables.dto.ConvictionDTO'
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedConviction]);

    useEffect(() => {
        const list = _.get(submissionVM, `${convictionsCollectionPath}.value`) || [];
        setConvictionList(list);
    }, [setConvictionList, submissionVM, convictionsCollectionPath]);

    const resetConvictionIndex = () => {
        setConvictionIndex(null);
    };

    const getConvictionType = (e, { setFieldValue }) => {
        const currentCodes = _.head(_.head(
            convictionVM
            && convictionVM.convictionCode
            && convictionVM.convictionCode.aspects
            && convictionVM.convictionCode.aspects.availableValues
        )
            .typelist
            .filters
            .filter((el) => el.name === e.target.value.value))
            .codes
            .map((typeCode) => {
                const label = translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                });
                return {
                    value: typeCode.code,
                    label: label
                };
            });
        setAvailableConvictionCodeValues(currentCodes);
        setFieldValue('convictionCode', '');
    };

    const getConvictionCodeValues = (value) => {
        return _.head(_.head(convictionVM.convictionCode.aspects.availableValues)
            .typelist
            .filters
            .filter((el) => el.name === value))
            .codes
            .map((typeCode) => {
                const label = translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                });
                return {
                    value: typeCode.code,
                    label: label
                };
            });
    };

    const onBeforeDeleteConviction = (index) => {
        trackEvent({
            event_value: messages.removeLabel,
            event_action: messages.conviction,
            event_type: 'icon_click',
            element_id: 'delete-conviciton',
        });
        setConvictionIndex(index);
        setShowDeleteModal(true);
    };

    const restoreType = (codeType, code) => {
        if (codeType) {
            return _.head(availableConvictionCodesTypes.filter((e) => e.value === codeType));
        }

        const prefix = code.substring(0, 2);
        return _.head(availableConvictionCodesTypes.filter((e) => e.label.substring(0, 2) === prefix));
    };

    const onBeforeUpdateConviction = (index) => {
        trackEvent({
            event_value: messages.edit,
            event_action: messages.conviction,
            event_type: 'icon_click',
            element_id: 'update-conviciton',
        });
        const conviction = convictionList[index];

        // restore
        const convictionCodeType = restoreType(conviction.convictionCodeType, conviction.convictionCode);
        const convictionDate = new Date(conviction.convictionDate);
        const isThereBanForDriving = conviction.isThereBanForDriving ? conviction.isThereBanForDriving : Boolean(conviction.drivingBanMonths).toString();
        const convictionDateMonth = (`0${conviction.convictionDateMonth ? conviction.convictionDateMonth : convictionDate.getMonth() + 1}`).slice(-2);
        const convictionDateYear = conviction.convictionDateYear ? conviction.convictionDateYear : convictionDate.getFullYear();

        setEditedConviction({
            ...conviction, convictionCodeType, isThereBanForDriving, convictionDateMonth, convictionDateYear
        });
        setConvictionIndex(index);
        setIsEditMode(true);
        setShowConvictionModal(true);
    };

    const availablePenaltyPointsValues = useMemo(
        () => {
            return convictionVM
                && convictionVM.penaltyPoints
                && convictionVM.penaltyPoints.aspects
                && convictionVM.penaltyPoints.aspects.availableValues
                    .map((typeCode) => {
                        return {
                            value: typeCode.code,
                            label: translator({
                                id: typeCode.name,
                                defaultMessage: typeCode.name
                            })
                        };
                    });
        }, [convictionVM, translator]
    );

    const fiveYearsAgo = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDay());

    const getConfirmLabel = () => {
        return isEditMode
            ? messages.updateConvictionButtonLabel
            : messages.addConvictionButtonLabel;
    };

    const showMore = useCallback(
        (element) => {
            if (!element) { return false; }
            switch (element) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return false;
            }
        }, []
    );

    const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));

    const validationSchema = yup.object({
        [anyConvictionsName]: yup.string()
            .required(messages.requiredField)
            .VMValidation(anyConvictionsPath, messages.requiredField, submissionVM),
        [isAnyCriminalConvictionExistsFieldName]: yup.string()
            .required(messages.requiredField)
            .VMValidation(isAnyCriminalConvictionExistsPath, messages.requiredField, submissionVM),
    });

    const convictionValidationSchema = yup.object({
        [convictionDateMonthName]: yup.string(),
        [convictionDateYearName]: yup.string(),
        [availableConvictionCodeValuesName]: yup.string()
            .required(messages.requiredField),
        [availableConvictionCodeTypesName]: yup.string()
            .required(messages.requiredField),
        [convictionDateName]: yup.date()
            .when([convictionDateMonthName, convictionDateYearName], (month, year, schema) => {
                if (month && (!(+month > 0) || !(+month < 13))) {
                    return schema.required(messages.dateRequiredMessage);
                }

                return ((month && (+month > 0) && (+month < 13)) && (year && (year.length === 4)))
                    ? (schema
                        .required(messages.requiredField)
                        .min(fiveYearsAgo, messages.dateLessThanFiveYearsMessage)
                        .max(todayAtMidnight, messages.dateLessThanFiveYearsMessage))
                    : schema.required(messages.requiredField);
            }),
        [penaltyPointsName]: yup.string()
            .required(messages.requiredField),
        [isThereBanForDrivingName]: yup.string()
            .required(messages.requiredField),
        [drivingBanMonthsName]: yup.string()
            .when(`${isThereBanForDrivingName}`, (ban, schema) => {
                return showMore(ban) ? schema.required(messages.requiredField) : schema;
            })
    });

    function isValidDate(date) {
        return date instanceof Date && !_.isNaN(date);
    }

    const getConvictionValueByCode = (code) => {
        return _.head(
            convictionVM.convictionCode.aspects.availableValues
                .filter((e) => e.code === code)
                .map((typeCode) => {
                    return translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    });
                })
        );
    };

    const getDate = (date) => {
        return (`${new Date(date).getMonth() + 1}/`).padStart(3, '0') + new Date(date).getFullYear();
    };

    const getConvictionList = (convictions) => {
        return convictions.map((conviction, index) => {
            return (
                <HDInteractiveCardRefactor
                    id="driver-conv-conviction-card"
                    className="margin-top-md"
                    icons={(
                        <>
                            <button
                                type="button"
                                className="btn-transparent"
                                id="update-conviction"
                                onClick={() => { onBeforeUpdateConviction(index); }}
                            >
                                <img src={editImage} alt="edit-conviction" />
                            </button>
                            <button
                                type="button"
                                className="btn-transparent"
                                id="delete-conviction"
                                onClick={() => { onBeforeDeleteConviction(index); }}
                            >
                                <img src={trashImage} alt="delete-conviction" />
                            </button>
                        </>
                    )}
                    header={(
                        <>
                            {getConvictionValueByCode(conviction.convictionCode)}
                            {' '}
                            {getDate(conviction.convictionDate)}
                        </>
                    )}
                    text={(
                        <>
                            {!+conviction.penaltyPoints
                                ? 'no points'
                                : `${conviction.penaltyPoints} points,`}
                            {!+conviction.drivingBanMonths
                                ? ' no driving ban'
                                : ` driving ban - ${conviction.drivingBanMonths} months`}
                        </>
                    )} />
            );
        });
    };

    const onBeforeAddConviction = () => {
        setEditedConviction({});
        setAnyConvictionsReset(false);
        setIsEditMode(false);
        setShowConvictionModal(true);
    };

    const validateYear = (year) => {
        return year
            && (
                (_.isNumber(year) && year > 1000 && year < 9999) || (year.length === 4)
            );
    };

    const handleConvictionDateMonth = (e, { setFieldTouched, setFieldValue, values }) => {
        const month = e.target.value;
        setConvictionMonth(month);
        if (month && (month > 0 && month < 13)) {
            const year = values.convictionDateYear;
            if (validateYear(year)) {
                const date = new Date(year, month - 1, 1, 0, 0, 0, 0);
                if (_.isDate(date) && isValidDate(date)) {
                    setFieldValue(convictionDateName, date.toISOString());
                    setFieldTouched(convictionDateName);
                }
            } else {
                setFieldValue(convictionDateName, '');
            }
        } else {
            setFieldValue(convictionDateName, '');
        }
        if (e.target.value.length === 2) yearInputRef.current.focus();
    };

    const handleConvictionDateYear = (e, { setFieldTouched, setFieldValue, values }) => {
        const year = e.target.value;
        const month = values.convictionDateMonth;
        setConvictionYear(year);

        if (validateYear(year)) {
            if (month && (month > 0 && month < 13)) {
                const date = new Date(year, month - 1, 1, 0, 0, 0, 0);
                if (_.isDate(date) && isValidDate(date)) {
                    setFieldValue(convictionDateName, date.toISOString());
                    setFieldTouched(convictionDateName);
                }
            } else {
                setFieldValue(convictionDateName, '');
            }
        } else {
            setFieldValue(convictionDateName, '');
        }
    };

    const dateMonthFieldUpdate = ({ target: { value } }, { setFieldTouched, values }) => {
        const month = values.convictionDateMonth;

        if (value && (value.length > 0 || value > 0)) {
            setConvictionMonth((`0${value}`).slice(-2));
        }

        if (!(month && (month > 0) && (month < 13))) {
            setFieldTouched(convictionDateName);
        }
    };

    const dateYearFieldUpdate = ({ setFieldTouched, values }) => {
        const year = values.convictionDateYear;
        if (!(year && (year.length === 4))) {
            setFieldTouched(convictionDateName);
        }
    };

    const handleValidation = (isValid) => {
        let valid;
        const MCsubmissionVMQuote = _.get(MCsubmissionVM, 'value.quotes', []);
        if (isValid) {
            if (anyConviction) {
                valid = convictionList.length > 0;
            } else {
                valid = true;
            }
        } else {
            valid = false;
        }
        if (MCsubmissionVMQuote.length && multiCarFlag) {
            setNavigation({
                canForward: valid,
                showForward: true,
                triggerLWRAPICall: false,
                updateQuoteFlag: false
            });
        } else {
            setNavigation({
                canForward: valid,
                showForward: true,
                triggerLWRAPICall: true,
                updateQuoteFlag: valid
            });
        }
    };

    useEffect(() => {
        if (!showConvictionModal && isModalAlreadyOpen) {
            setAvailableConvictionCodeValues([]);
            if (convictionList.length === 0) {
                _.set(submissionVM, anyConvictionsPath, null);
                setAnyConvictionsReset(true);
            }
        } else {
            setIsModalAlreadyOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConvictionModal]);

    const handleDeleteConviction = () => {
        const convictions = [...convictionList];
        convictions.splice(+convictionIndex, 1);
        if (convictions.length === 0) {
            _.set(submissionVM, anyConvictionsPath, null);
            setAnyConvictionsReset(true);
        }
        setConvictionList(convictions);
        _.set(submissionVM, convictionsCollectionPath, convictions);
        setShowDeleteModal(false);
        resetConvictionIndex();
    };

    const handleUpdateDriverConviction = (conviction) => {
        const convictions = [...convictionList];
        convictions[convictionIndex] = { ...conviction };
        setConvictionList(convictions);
        _.set(submissionVM, convictionsCollectionPath, convictions);
        setShowConvictionModal(false);
        resetConvictionIndex();
    };

    const handleAddDriverConviction = (convictionData) => {
        const currentList = [...convictionList];
        currentList.push({ ...convictionData });
        setConvictionList(currentList);
        _.set(submissionVM, convictionsCollectionPath, currentList);
        setShowConvictionModal(false);
    };

    const onBeforeAddOrUpdateConviction = (formProps) => {
        const { isValid } = formProps;

        if (isValid) {
            const {
                convictionCodeType,
                convictionCode,
                convictionDate,
                convictionDateMonth,
                convictionDateYear,
                penaltyPoints,
                isThereBanForDriving,
                drivingBanMonths
            } = formProps.values;

            const conviction = {
                convictionCodeType: convictionCodeType.value,
                convictionCode: convictionCode.value,
                convictionDate: convictionDate,
                convictionDateMonth: (`0${convictionDateMonth}`).slice(-2),
                convictionDateYear: convictionDateYear,
                penaltyPoints: penaltyPoints.value,
                isThereBanForDriving: isThereBanForDriving,
                drivingBanMonths: drivingBanMonths,
            };
            if (isEditMode) {
                handleUpdateDriverConviction(conviction);
            } else {
                setEditedConviction({});
                handleAddDriverConviction(conviction);
            }
            setConvictionMonth('');
        }
    };

    const handleDeleteAllConvictions = () => {
        setConvictionList([]);
        _.set(submissionVM, convictionsCollectionPath, []);
    };

    const handleAnyConvictionsChange = (e) => {
        const { value } = e.target;
        setAnyConvictionsReset(false);
        switch (value) {
            case 'true':
                setEditedConviction({});
                setShowConvictionModal(true);
                setIsEditMode(false);
                setAnyConviction(true);
                break;
            case 'false':
                setShowConvictionModal(false);
                handleDeleteAllConvictions();
                setAnyConviction(false);
                break;
            default:
                setShowConvictionModal(false);
        }
    };

    const getAvailableConvictionCodeValues = (formProps) => {
        if (isEditMode && formProps.values.convictionCodeType) {
            const codeType = formProps.values.convictionCodeType.value
                ? formProps.values.convictionCodeType.value
                : formProps.values.convictionCodeType;
            return getConvictionCodeValues(codeType);
        }
        return availableConvictionCodeValues;
    };
    const handleBanForDrivingChange = (e, formProps) => {
        const { value } = e.target;
        const {
            setFieldValue,
            setFieldTouched
        } = formProps;

        if (value === 'true') {
            setFieldValue('drivingBanMonths', '');
            setFieldTouched('drivingBanMonths', false);
        }
        if (value === 'false') {
            setFieldValue('drivingBanMonths', '0');
        }
    };

    const handleFocus = (event) => {
        event.preventDefault();
        window.scroll(event.target.scrollWidth, event.target.scrollHeight);
        event.target.select();
    };

    const convictionCodeChange = (event) => {
        setConvictionCodeValue(event.target.value);
    };

    const convictionForm = (formProps) => {
        // const { convictionDateMonth } = formProps.values;
        return (
            <>
                <HDDropdownList
                    webAnalyticsEvent={{ event_action: messages.convictionMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                    id="conviction-type-dropdown"
                    path="convictionCodeType"
                    options={availableConvictionCodesTypes}
                    name={availableConvictionCodeTypesName}
                    label={{
                        text: messages.convictionMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                        Tag: 'h5',
                        id: 'driver-conv-what-for-label',
                        className: 'my-3'
                    }}
                    onChange={(e) => {
                        getConvictionType(e, formProps);
                    }} />

                <hr />

                <HDDropdownList
                    webAnalyticsEvent={{ event_action: messages.convictionKindMsg }}
                    id="conviction-code-dropdown"
                    path="convictionCode"
                    options={getAvailableConvictionCodeValues(formProps)}
                    name={availableConvictionCodeValuesName}
                    value={convictionCodeValue}
                    onChange={convictionCodeChange}
                    label={{
                        text: messages.convictionKindMsg,
                        Tag: 'h5',
                        id: 'driver-conv-what-type-label'
                    }} />
                <hr />

                <HDLabelRefactor
                    Tag="h5"
                    text={messages.convictionDateMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}
                    id="driver-conv-date-label" />
                <HDLabelRefactor
                    Tag="p"
                    text={messages.convictionFiveYearsMsg}
                    id="driver-conv-date-reminder-label" />
                <Row className="margin-top-lg">
                    <Col xs={5} className="pr-xs-all">
                        <HDTextInput
                            webAnalyticsEvent={{ event_action: messages.convictionDateMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            maxLength="2"
                            allowLeadingZero
                            placeholder="MM"
                            type="number"
                            id={convictionDateMonthName}
                            className="input-group--on-white"
                            name={convictionDateMonthName}
                            data={convictionMonth}
                            value={convictionMonth}
                            onBlur={(e) => { dateMonthFieldUpdate(e, formProps); }}
                            onChange={(e) => { handleConvictionDateMonth(e, formProps); }}
                            onFocus={handleFocus}
                            isInvalidCustom={!!formProps.errors[convictionDateName] && formProps.touched[convictionDateName]} />
                    </Col>
                    <Col xs={7}>
                        <HDTextInput
                            webAnalyticsEvent={{ event_action: messages.convictionDateMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            maxLength="4"
                            type="number"
                            id={convictionDateYearName}
                            innerRef={yearInputRef}
                            className="input-group--on-white"
                            placeholder="YYYY"
                            name={convictionDateYearName}
                            value={convictionYear}
                            onBlur={() => { dateYearFieldUpdate(formProps); }}
                            onChange={(e) => { handleConvictionDateYear(e, formProps); }}
                            onFocus={handleFocus}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    yearInputRef.current.blur();
                                }
                            }}
                            isInvalidCustom={!!formProps.errors[convictionDateName] && formProps.touched[convictionDateName]} />
                    </Col>
                </Row>
                <HDTextInput
                    webAnalyticsEvent={{ event_action: messages.convictionFiveYearsMsg }}
                    id="convictionDateInput"
                    customClassName="d-none"
                    path={convictionDateName}
                    name={convictionDateName} />

                <hr />
                <HDDropdownList
                    webAnalyticsEvent={{ event_action: messages.convictionPenaltyPointsMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                    id="penalty-points-dropdown"
                    path="penaltyPoints"
                    options={availablePenaltyPointsValues}
                    name={penaltyPointsName}
                    label={{
                        text: messages.convictionPenaltyPointsMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                        Tag: 'h5',
                        id: 'driver-conv-penalty-points-label'
                    }}
                    isSearchable={false}
                    enableNative />
                <hr />
                <HDToggleButtonGroup
                    className="driver-convicions__banned-toggle-group"
                    webAnalyticsEvent={{ event_action: messages.convictionDrivingBannedMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                    id="driving-banned-button-group"
                    name={isThereBanForDrivingName}
                    label={{
                        text: messages.convictionDrivingBannedMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                        Tag: 'h5',
                        id: 'driver-conv-banned-label',
                        className: 'margin-bottom-md'
                    }}
                    availableValues={availableDefaultValues}
                    onChange={(e) => { handleBanForDrivingChange(e, formProps); }}
                    btnGroupClassName="grid grid--col-3 theme-white"
                    btnClassName="theme-white" />
                {showMore(formProps.values[isThereBanForDrivingName]) && (
                    <>
                        <HDLabelRefactor
                            text={messages.bannedMonthsLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}
                            Tag="h5"
                            className="mt-4"
                            id="driver-conv-banned-how-long-label" />
                        <HDTextInput
                            webAnalyticsEvent={{ event_action: messages.bannedMonthsLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            maxLength="2"
                            allowLeadingZero
                            type="numberOnly"
                            id={drivingBanMonthsName}
                            name={drivingBanMonthsName}
                            path={drivingBanMonthsName}
                            placeholder="Enter months" />
                    </>
                )}
                <Row className="margin-top-lg">
                    <Col xs={12} sm={6} className="pr-xs">
                        <HDButton
                            webAnalyticsEvent={{ event_action: `${isEditMode ? 'Edit' : 'Add'} ${messages.conviction}` }}
                            id="confirm-add-conviction-button"
                            type="submit"
                            variant="primary"
                            className="theme-white btn-block mb-2 mb-md-0"
                            label={getConfirmLabel()}
                            onClick={() => {
                                onBeforeAddOrUpdateConviction(formProps);
                            }}
                            data-testid="confirm-button" />

                    </Col>
                    <Col xs={12} sm={6} className="pl-xs pt-2 pt-sm-0">
                        <HDButton
                            webAnalyticsEvent={{ event_action: `${isEditMode ? 'Edit' : 'Add'} ${messages.conviction}` }}
                            id="cancel-add-conviction-button"
                            variant="secondary"
                            className="theme-white btn-block"
                            label="Cancel"
                            onClick={() => {
                                setShowConvictionModal(false);
                                setConvictionMonth('');
                            }}
                            data-testid="cancel-button" />
                    </Col>
                </Row>
            </>
        );
    };

    return (
        <Container className="driver-conv-container">
            <Row>
                <Col>
                    <HDModal
                        webAnalyticsEvent={{ event_action: `${isEditMode ? 'Edit' : 'Add'} ${messages.conviction}` }}
                        webAnalyticsView={{ ...pageMetadata, page_section: `${isEditMode ? 'Edit' : 'Add'} ${messages.conviction}` }}
                        id="convictions-modal"
                        customStyle="wide"
                        hideFooter
                        onClose={() => {
                            setShowConvictionModal(false);
                            setConvictionMonth('');
                        }}
                        onConfirm={() => { }}
                        onCancel={() => { }}
                        show={showConvictionModal}
                    >
                        <HDLabelRefactor Tag="h2" text={messages.convictionsLabel} className="my-0" />
                        <HDForm
                            id="driver-conv-conviction-form"
                            validationSchema={convictionValidationSchema}
                            submissionVM={{
                                ...convictionVM,
                                lobData: {}
                            }}
                            initValues={editedConviction}
                        >
                            {convictionForm}
                        </HDForm>
                    </HDModal>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: `${messages.removeLabel} ${messages.conviction}` }}
                        webAnalyticsEvent={{ event_action: `Remove ${messages.conviction}` }}
                        id="delete-conviction-modal"
                        headerText={messages.deleteHeader}
                        confirmLabel={messages.deleteConfirmMessage}
                        cancelLabel={messages.deleteCancelMessage}
                        onConfirm={() => {
                            handleDeleteConviction();
                        }}
                        onCancel={() => setShowDeleteModal(false)}
                        onClose={() => setShowDeleteModal(false)}
                        show={showDeleteModal}
                    >
                        <p>
                            {messages.deleteInfoMessage}
                        </p>
                    </HDModal>

                    <HDForm
                        submissionVM={submissionVM}
                        validationSchema={validationSchema}
                        onValidation={handleValidation}
                    >
                        { /* Do not show when license is scanned and you are allowed to skip convictions */}
                        {showConvictions && (
                            <>
                                <HDToggleButtonGroup
                                    webAnalyticsEvent={{ event_action: messages.convictionFormMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                    id="convictions-button-group"
                                    path={anyConvictionsPath}
                                    name={anyConvictionsName}
                                    label={{
                                        text: messages.convictionFormMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                        Tag: 'h2',
                                        className: '',
                                        id: 'driver-conv-last-yrs'
                                    }}
                                    doReset={anyConvictionsReset}
                                    availableValues={availableDefaultValues}
                                    onChange={handleAnyConvictionsChange}
                                    btnGroupClassName="grid grid--col-2 grid--col-lg-3"
                                >
                                    <ul className="pad-inl-start-beg margin-bottom-lg">
                                        <li>{messages.convictionsLabel}</li>
                                        <li>{messages.endorsementsLabel}</li>
                                        <li>{messages.fixedPenaltiesLabel}</li>
                                        <li>{messages.disqualificationsOrBansLabel}</li>
                                    </ul>
                                </HDToggleButtonGroup>
                                {getConvictionList([...convictionList])}
                                {!!convictionList.length && (
                                    <HDButtonDashed
                                        webAnalyticsEvent={{ event_action: messages.addAnotherConviction }}
                                        id="driver-conv-add-another-button"
                                        className="margin-top-md"
                                        icon
                                        label={messages.addAnotherConviction}
                                        onClick={() => { onBeforeAddConviction(convictionList); }} />
                                )}
                                <hr />
                            </>
                        )}
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.convictionFormCriminalMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                            id="criminal-convictions-button-group"
                            path={isAnyCriminalConvictionExistsPath}
                            name={isAnyCriminalConvictionExistsFieldName}
                            label={{
                                text: messages.convictionFormCriminalMsg(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                Tag: 'h2',
                                id: 'driver-conv-criminal-convs'
                            }}
                            availableValues={availableDefaultValues}
                            btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                    </HDForm>
                    <hr className="mt-5 mb-3" />
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    MCsubmissionVM: state.wizardState.data.mcsubmissionVM,
    multiCarFlag: state.wizardState.app.multiCarFlag,
    mcsubmissionVM: state.wizardState.data.mcsubmissionVM
});

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDDriverConvictionsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverConvictionsPage);
