/* eslint-disable max-len */
import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as yup from 'hastings-components/yup';
// import './HDDriverEmployement.scss';
import {
    HDForm, HDInfoCardRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
// eslint-disable-next-line import/no-unresolved
import productMetadata from 'product-metadata';
import { useLocation } from 'react-router-dom';
import { AnalyticsHDDropdownList as HDDropdownList, AnalyticsHDAsyncSelect as HDAsyncSelect, AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import * as messages from './HDDriverEmployement.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import InfoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import TipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import useAnotherDriver from '../__helpers__/useAnotherDriver';

const HDPrimaryEmployementInfoPage = (props) => {
    const { multiCarFlag, mcsubmissionVM } = props;
    const translator = useContext(TranslatorContext);
    const { submissionVM, setNavigation, pageMetadata } = props;
    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1 ? drivers.findIndex((driver) => driver.fixedId === driverFixedId) : driverIndex;

    const personPrefixPath = 'person.prefix.value.code';
    const driverVMPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    // eslint-disable-next-line no-unused-vars
    const driverId = _.get(submissionVM, `${driverVMPath}.tempID.value`);
    const driverVM = _.get(submissionVM, driverVMPath);
    const fullTimeOccValues = _.clone(driverVM.occupationFull.aspects.availableValues);
    const occupdationfilter = productMetadata.pc && productMetadata.pc['typekey.OccupationType_Ext'].value.filters;
    const empStatFieldName = 'fullEmpStatus';
    const empStatPath = `${driverVMPath}.${empStatFieldName}`;
    const occupationFullFieldName = 'occupationFull';
    const occupationFullPath = `${driverVMPath}.${occupationFullFieldName}`;
    const businessTypeFieldName = 'businessTypeFull';
    const businessTypePath = `${driverVMPath}.${businessTypeFieldName}`;
    const prefix = _.get(submissionVM, `${driverVMPath}.${personPrefixPath}`);
    const [emplStatus, setEmplStatus] = useState(driverVM.fullEmpStatus.value !== undefined ? driverVM.fullEmpStatus.value.code : '');
    const [occupationTypeOptions, setOccupationTypeOptions] = useState([]);
    const [isEmplStatusClick, setIsEmplStatusClick] = useState(true);
    const businessOption = {
        label: messages.noneHouseHoldDuties,
        value: messages.noneHouseHoldDutiesCode
    };

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const filterOccupations = (inputValue) => {
        if (occupationTypeOptions.length === 0) {
            const options = fullTimeOccValues.map((typekey) => {
                const option = {};
                option.value = typekey.code;
                option.label = translator(
                    {
                        id: typekey.name,
                        defaultMessage: typekey.name
                    }
                );
                return option;
            });
            setOccupationTypeOptions(options);
            return options.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
        }
        return occupationTypeOptions.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const handleInputChangeBusiness = (newValue) => {
        return newValue;
    };

    const filterBusinessTypes = (inputValue) => {
        const options = driverVM
            .businessTypeFull
            .aspects
            .availableValues.map((typekey) => {
                const option = {};
                option.value = typekey.code;
                option.label = translator(
                    {
                        id: typekey.name,
                        defaultMessage: typekey.name
                    }
                );
                return option;
            });
        return options.filter((item) => item.label.toLowerCase()
            .includes(inputValue.toLowerCase()));
    };
    const filterBusinessTypesForHouseholdDuties = (inputValue) => {
        const options = driverVM
            .businessTypeFull
            .aspects
            .availableValues.filter((tc) => tc.code === '948').map((typekey) => {
                const option = {};
                option.value = typekey.code;
                option.label = translator(
                    {
                        id: typekey.name,
                        defaultMessage: typekey.name
                    }
                );
                return option;
            });
        return options.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
    };
    const loadBusinessOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterBusinessTypes(inputValue));
        }, 1000);
    };

    const loadBusinessOptionsForHouseholdDuties = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterBusinessTypesForHouseholdDuties(inputValue));
        }, 1000);
    };

    const loadOccupationOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOccupations(inputValue));
        }, 1000);
    };

    const handleInputChangeOccupation = (newValue) => {
        if (driverVM.occupationFull.value === '' || !driverVM.occupationFull.value || newValue) {
            driverVM.businessTypeFull.value = '';
        }
        return newValue;
    };


    const handleValidation = () => {
        let vmValid = false;
        if (driverVM.fullEmpStatus.aspects.valid && driverVM.occupationFull.aspects.valid && driverVM.businessTypeFull.aspects.valid) {
            vmValid = true;
        }

        setNavigation({ canForward: vmValid });
    };

    useEffect(() => {
        const filterOccupationBasedOnFilterName = (name) => {
            const typeCodes = occupdationfilter.find((filter) => filter.name === name).includedCodes;
            if (typeCodes) {
                const typeValues = fullTimeOccValues.filter((value) => typeCodes.includes(value.code));
                return typeValues;
            }
            return null;
        };
        const setPrimaryEmplDetails = () => {
            if (!emplStatus) return;

            if (emplStatus === 'I') {
                driverVM.occupationFull.value = messages.independentMeansCode;
                driverVM.businessTypeFull.value = messages.notInEmployementCode;
            }
            if (emplStatus === 'N') {
                driverVM.occupationFull.value = messages.notEmployedDisabilityCode;
                driverVM.businessTypeFull.value = messages.noneUnemployedDueToDisabilityCode;
            }
            if (emplStatus === 'U') {
                driverVM.occupationFull.value = messages.unemployedCode;
                driverVM.businessTypeFull.value = messages.noneUnemployedCode;
            }
            if (emplStatus === 'R') {
                driverVM.occupationFull.value = messages.retiredCode;
                driverVM.businessTypeFull.value = messages.noneRetired;
            }
        };

        const handleEmplStatusChange = () => {
            if (!emplStatus) return;
            let typekeyOccupation = [];
            let options = {};
            switch (emplStatus) {
                case 'F':
                    typekeyOccupation = filterOccupationBasedOnFilterName(messages.studentFilter);
                    driverVM.businessTypeFull.value = '950';
                    break;
                case 'H':
                    if (prefix === '003_Mr') {
                        typekeyOccupation = filterOccupationBasedOnFilterName(messages.houseHoldDutiesMaleFilter);
                    } else if (prefix === '004') {
                        typekeyOccupation = filterOccupationBasedOnFilterName(messages.houseHoldDutiesFemaleFilter);
                    }
                    break;
                case 'E':
                case 'S':
                case 'V':
                    typekeyOccupation = [];
                    break;
                case 'R':
                case 'I':
                case 'N':
                case 'U':
                    setPrimaryEmplDetails();
                    break;
                default:
            }
            options = typekeyOccupation.map((typekey) => {
                const option = {};
                option.value = typekey.code;
                option.label = translator(
                    {
                        id: typekey.name,
                        defaultMessage: typekey.name
                    }
                );
                return option;
            });
            if (isEmplStatusClick) {
                setOccupationTypeOptions(options);
                setIsEmplStatusClick(false);
            }
        };
        if (isEmplStatusClick) {
            handleEmplStatusChange();
        }
    }, [emplStatus,
        translator,
        prefix,
        fullTimeOccValues,
        isEmplStatusClick,
        driverVM.occupationFull.value,
        driverVM.businessTypeFull.value,
        occupdationfilter]);

    const resetPrimaryEmployementDetails = () => {
        driverVM.occupationFull.value = null;
        driverVM.businessTypeFull.value = null;
    };

    const emplStatusHandler = (event, hdProps) => {
        const selectedEmpltStatus = event.target.value.value;
        if (selectedEmpltStatus === emplStatus) return;

        setEmplStatus(event.target.value.value);
        setIsEmplStatusClick(true);
        // reset values in form
        if (hdProps.values.occupationFull) {
            // eslint-disable-next-line no-param-reassign
            hdProps.setFieldValue(`${occupationFullFieldName}`, null, true);
        }
        if (hdProps.values.businessTypeFull) {
            // eslint-disable-next-line no-param-reassign
            hdProps.setFieldValue(`${businessTypeFieldName}`, null, true);
        }
        // this will clear off any prior validations messages on the fields
        hdProps.setFieldTouched(`${occupationFullFieldName}`, false, false);
        hdProps.setFieldTouched(`${businessTypeFieldName}`, false, false);
        resetPrimaryEmployementDetails();
        // input value in form fields if employement status is Hosehold duties
        if (event.target.value.value === 'H') {
            if (prefix === '003_Mr' || prefix === '003') {
                hdProps.setFieldValue(`${occupationFullFieldName}`, { label: 'Househusband', value: '163' }, true);
                driverVM.occupationFull.value = '163';
            } else if (prefix === '004' || prefix === '002' || prefix === '005_Ms' || prefix === '005') {
                hdProps.setFieldValue(`${occupationFullFieldName}`, { label: 'Housewife', value: 'H09' }, true);
                driverVM.occupationFull.value = 'H09';
            }
            hdProps.setFieldValue(`${businessTypeFieldName}`, businessOption, false);
            driverVM.businessTypeFull.value = messages.noneHouseHoldDutiesCode;
        }
    };

    const empStatusAvailValues = driverVM.fullEmpStatus.aspects.availableValues.map((typekey) => {
        const option = {};
        option.value = typekey.code;
        option.label = translator(
            {
                id: typekey.name,
                defaultMessage: typekey.name
            }
        );
        return option;
    });
    const validationSchema = yup.object({
        [empStatFieldName]: yup.object().required(messages.required).nullable().VMValidation(empStatPath, null, submissionVM),
        [occupationFullFieldName]: yup
            .object()
            .nullable()
            .VMValidation(occupationFullPath, messages.errorMessage, submissionVM),
        [businessTypeFieldName]: yup
            .object()
            .nullable()
            .VMValidation(businessTypePath, messages.errorMessage, submissionVM)
    });
    const tooltipOverlay = (id, messageTitle, messageBody) => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.employmentStatusLabel} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.employmentStatusLabel} Info` }}
            id={id}
            labelText={messageTitle}
            overlayButtonIcon={<img src={InfoCircleBlue} alt="info_circle" />}
        >
            <p>{messageBody}</p>
        </HDOverlayPopup>
    );

    const occupationLabel = {
        text: emplStatus === 'F' ? messages.typeOfStudent(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) : messages.occupation(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
        Tag: 'h2',
        id: 'primary-empl-occupation-label'
    };
    const empStatusLabel = {
        text: messages.employmentStatus(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
        Tag: 'h2',
        icon: tooltipOverlay('primary-empl-status-overlay', messages.employmentStatusToolTipsHeader(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver), messages.employmentStatusToolTipsBody(isAnotherDriver ? isAnotherDriverMulti : !isAnotherDriverMulti)),
        iconPosition: 'r',
        id: 'primary-empl-status-label'
    };
    const whatIndustyYouWorkIn = {
        text: messages.industry,
        Tag: 'h2',
        id: 'primary-empl-industry-label'
    };

    return (
        <Container className="primary-empl-container">
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
                                    <HDDropdownList
                                        webAnalyticsEvent={{ event_action: empStatusLabel.text }}
                                        id="primary-empl-status"
                                        name={empStatFieldName}
                                        path={empStatPath}
                                        options={empStatusAvailValues}
                                        label={empStatusLabel}
                                        theme={messages.dropdownTheme}
                                        onChange={(e) => emplStatusHandler(e, hdProps)}
                                        selectSize="md-8" />
                                </>
                            );
                        }}
                        {emplStatus && (emplStatus === 'S' || emplStatus === 'E' || emplStatus === 'V') && (
                            <>
                                <hr />
                                <HDAsyncSelect
                                    webAnalyticsEvent={{ event_action: occupationLabel.text }}
                                    id="primary-empl-occupation"
                                    selectSize="md-8"
                                    name={occupationFullFieldName}
                                    path={occupationFullPath}
                                    placeholder={messages.genericInputPlaceholder}
                                    label={occupationLabel}
                                    cacheOptions
                                    loadOptions={loadOccupationOptions}
                                    onInputChange={handleInputChangeOccupation} />
                            </>
                        )}
                        {emplStatus && emplStatus === 'F' && (
                            <>
                                <hr />
                                <HDDropdownList
                                    webAnalyticsEvent={{ event_action: occupationLabel.text }}
                                    id="primary-empl-occupation"
                                    name={occupationFullFieldName}
                                    path={occupationFullPath}
                                    label={occupationLabel}
                                    theme={messages.dropdownTheme}
                                    options={occupationTypeOptions}
                                    selectSize="md-8" />
                            </>
                        )}
                        {emplStatus && emplStatus === 'H' && (
                            <>
                                <HDAsyncSelect
                                    webAnalyticsEvent={{ event_action: occupationLabel.text }}
                                    id="primary-empl-occupation"
                                    selectSize="md-8"
                                    onInputChange={handleInputChangeOccupation}
                                    name={occupationFullFieldName}
                                    path={occupationFullPath}
                                    label={occupationLabel}
                                    placeholder=" "
                                    loadOptions={loadOccupationOptions} />
                            </>
                        )}
                        {emplStatus && (emplStatus === 'S' || emplStatus === 'E' || emplStatus === 'V' || emplStatus === 'H') && (
                            <>
                                <HDInfoCardRefactor
                                    image={TipCirclePurple}
                                    paragraphs={[messages.infocardBody(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)]}
                                    className=""
                                    id="primary-empl-exact-job-info" />
                                <hr />
                            </>
                        )}
                        {emplStatus && (emplStatus === 'S' || emplStatus === 'E' || emplStatus === 'V' || emplStatus === 'H') && (
                            <>
                                {emplStatus === 'H' ? (
                                    <HDAsyncSelect
                                        webAnalyticsEvent={{ event_action: whatIndustyYouWorkIn.text }}
                                        id="primary-empl-business"
                                        selectSize="md-8"
                                        name={businessTypeFieldName}
                                        path={businessTypePath}
                                        cacheOptions
                                        label={whatIndustyYouWorkIn}
                                        onInputChange={handleInputChangeBusiness}
                                        placeholder=" "
                                        loadOptions={loadBusinessOptionsForHouseholdDuties} />
                                ) : (
                                    <HDAsyncSelect
                                        webAnalyticsEvent={{ event_action: whatIndustyYouWorkIn.text }}
                                        id="primary-empl-business"
                                        selectSize="md-8"
                                        placeholder={messages.genericInputPlaceholder}
                                        name={businessTypeFieldName}
                                        path={businessTypePath}
                                        cacheOptions
                                        label={whatIndustyYouWorkIn}
                                        loadOptions={loadBusinessOptions}
                                        onInputChange={handleInputChangeBusiness} />
                                )}
                            </>
                        )}
                    </HDForm>
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
    setNavigation: setNavigationAction,
};

HDPrimaryEmployementInfoPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HDPrimaryEmployementInfoPage);
