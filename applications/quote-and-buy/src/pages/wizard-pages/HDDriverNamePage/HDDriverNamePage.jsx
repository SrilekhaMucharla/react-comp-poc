import React, {
    useContext, useState, useEffect, useMemo, useRef
} from 'react';
import { connect, useSelector } from 'react-redux';
import * as yup from 'hastings-components/yup';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import {
    HDForm, HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import {
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDropdownList as HDDropdownList
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import { setNavigation as setNavigationAction, setWizardPagesState as setWizardPagesStateAction } from '../../../redux-thunk/actions';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
// import './HDDriverNamePage.scss';

import * as messages from './HDDriverNamePage.messages';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';

// eslint-disable-next-line react/prop-types
const HDDriverNamePage = ({
    submissionVM, setNavigation, setWizardPageState, location, multiCarFlag, mcsubmissionVM
}) => {
    let prefixes;
    const [titles, setTitles] = useState([]);
    const [gender, setGender] = useState([]);
    const [prefix, setPrefix] = useState(null);

    const translator = useContext(TranslatorContext);

    const inputRefName = useRef(null);
    const inputRefSurname = useRef(null);

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
    && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1 ? drivers.findIndex((driver) => driver.fixedId === driverFixedId) : driverIndex;
    const prefixCodes = ['003_Mr', '004', '005_Ms', '002'];
    const prefixDrCodes = ['003', '005'];
    const accountHolderPath = 'baseData.accountHolder';
    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    const firstNameFieldName = 'firstName';
    const firstNamePath = `${driverPath}.person.${firstNameFieldName}`;
    const lastNameFieldName = 'lastName';
    const lastNamePath = `${driverPath}.person.${lastNameFieldName}`;
    const prefixFieldName = 'prefix';
    const prefixPath = `${driverPath}.person.${prefixFieldName}`;
    const genderFieldName = 'gender';
    const genderPath = `${driverPath}.${genderFieldName}`;
    const relationToProposerFieldName = 'relationToProposer';
    const relationToProposerPath = `${driverPath}.${relationToProposerFieldName}`;
    const getAvailableValues = (prefixCodeArray) => prefixCodeArray.map((code) => {
        const singlePrefix = prefixes.find((element) => code === element.code);
        return {
            code: singlePrefix.code,
            name: translator({
                id: singlePrefix.name,
                defaultMessage: singlePrefix.name
            })
        };
    });
    const getDoctorGender = (fullGenderName) => {
        const genderSuffix = fullGenderName.split('-')[1];
        if (genderSuffix) {
            return genderSuffix.charAt(0).toUpperCase() + genderSuffix.slice(1);
        }
        return fullGenderName;
    };

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const getAvailableValuesToRelation = useMemo(() => _.head(
        _.head(submissionVM.lobData.privateCar.coverables.drivers.children[0].relationToProposer.aspects.availableValues).typelist.filters.filter(
            (el) => el.name === 'PrivateCar_Ext'
        )
    ).codes.map((typeCode) => {
        return {
            value: typeCode.code,
            label: translator({
                id: typeCode.name,
                defaultMessage: typeCode.name
            })
        };
    }));

    useEffect(() => {
        prefixes = _.get(submissionVM, 'baseData.accountHolder.prefix.aspects.availableValues');
        const currentPrefix = _.get(submissionVM, `${prefixPath}.value`);
        const drCode = currentPrefix && currentPrefix.code === '005' ? '005' : '003';
        setTitles([...getAvailableValues(prefixCodes), { name: messages.doctorFrefix, code: drCode }].map((el) => ({ name: el.name, value: el.code })));
        setGender(
            getAvailableValues(prefixDrCodes).map((el) => {
                const value = el.code === '003' ? 'M' : 'F';
                return ({ value, name: getDoctorGender(el.name) });
            })
        );
    }, [submissionVM]);

    const handleExistingPrefix = () => {
        const prefixValue = _.get(submissionVM, `${driverPath}.person.${prefixFieldName}.value.code`);
        if (prefixValue) {
            if (!prefixDrCodes.includes(prefixValue)) {
                const genderValue = prefixValue === '003_Mr' ? 'M' : 'F';
                _.set(submissionVM, genderPath, genderValue);
                if (!isAnotherDriver) {
                    _.set(submissionVM, `${accountHolderPath}.${genderFieldName}`, genderValue);
                }
            }
        }
    };

    useEffect(() => {
        handleExistingPrefix();
        setNavigation({ canForward: false, showForward: true, showWizardTooltip: false });
    }, []);

    const handleValidation = (isValid) => {
        if (drivers && drivers.length < 2 && isValid) {
            _.set(location, 'state.isPolicyHolder', true);
        }
        setNavigation({ canForward: isValid });
    };

    const handleGender = (event, hdProps) => {
        const { value } = event.target;
        const drCode = value === 'M' ? '003' : '005';
        hdProps.setFieldValue(`${prefixFieldName}`, drCode, false);
        prefixes = _.get(submissionVM, 'baseData.accountHolder.prefix.aspects.availableValues');
        _.set(submissionVM, `${driverPath}.person.${prefixFieldName}`, drCode);
        setTitles(
            titles.map((title) => {
                if (title.name === 'Dr') {
                    // eslint-disable-next-line no-param-reassign
                    title.value = drCode;
                }
                return title;
            })
        );
        if (!isAnotherDriver) {
            _.set(submissionVM, `${accountHolderPath}.${genderFieldName}`, value, false);
        }
    };

    const handlePrefix = (event, hdProps) => {
        const { value } = event.target;
        setPrefix(value);
        if (prefixDrCodes.includes(value)) {
            hdProps.setFieldValue(`${genderFieldName}`, '', true);
            if (!isAnotherDriver) {
                _.set(submissionVM, `${driverPath}.${genderFieldName}`, '');
                _.set(submissionVM, `${accountHolderPath}.${genderFieldName}`, '');
            }
        } else {
            const genderValue = value === '003_Mr' ? 'M' : 'F';
            hdProps.setFieldValue(`${genderFieldName}`, genderValue, true);
            _.set(submissionVM, genderPath, genderValue);
            if (!isAnotherDriver) {
                _.set(submissionVM, `${accountHolderPath}.${genderFieldName}`, genderValue);
            }
        }
    };

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const newDriversPageState = _.cloneDeep(driversPageState);

    const handleOnInputChange = (event) => {
        const { value, name } = event.target;
        if (!isAnotherDriver) {
            _.set(submissionVM, `${accountHolderPath}.${name}`, value);
        }

        // trigger DLN validation
        _.set(newDriversPageState, `${driverIndex}.licenceDataChanged`, true);

        setWizardPageState({ drivers: newDriversPageState });
    };

    const validationSchema = yup.object({
        [firstNameFieldName]: yup
            .string()
            .required(messages.requiredAnswer)
            .max(30, messages.generalErrorMessage)
            .matches(/^[^-\s]+([A-Za-z'\s-])*$/, messages.generalErrorMessage)
            .VMValidation(firstNamePath, null, submissionVM),
        [lastNameFieldName]: yup
            .string()
            .matches(/^[^-\s]+([A-Za-z'\s-])*$/, messages.generalErrorMessage)
            .max(30, messages.generalErrorMessage)
            .required(messages.requiredAnswer)
            .VMValidation(lastNamePath, null, submissionVM),
        [prefixFieldName]: yup
            .string()
            .required(messages.requiredAnswer)
            .VMValidation(prefixPath, null, submissionVM),
        [genderFieldName]: yup
            .string()
            .when(`${prefixFieldName}`, (value, schema) => {
                return prefixDrCodes.includes(value) ? schema.required(messages.requiredAnswer) : schema;
            })
            .VMValidation(genderPath, null, submissionVM)
    });

    const anotherDriverValidationSchema = validationSchema.concat(yup.object({
        [relationToProposerFieldName]: yup
            .string()
            .required(messages.requiredAnswer).VMValidation(relationToProposerPath, null, submissionVM)
    }));


    return (
        <Container id="driver-name-page" className="driver-name-page">
            <Row>
                <Col>
                    <HDLabelRefactor
                        id="page-driver-name-title"
                        className="page-driver-name__title"
                        Tag="h2"
                        text={messages.nameTitle(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)} />
                </Col>
            </Row>
            {(multiCarFlag && getMCSubmissionVM()) ? '' : !isAnotherDriver && (
                <HDInfoCardRefactor
                    id="page-driver-name-info-card"
                    image={exclamationIcon}
                    paragraphs={[messages.infoCardParagraph]} />
            )}
            <HDForm
                submissionVM={submissionVM}
                validationSchema={isAnotherDriver ? anotherDriverValidationSchema : validationSchema}
                onValidation={handleValidation}
            >
                {(hdProps) => {
                    return (
                        <>
                            <Row className="margin-top-md margin-top-lg-mobile">
                                <Col>
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: messages.nameTitle(isAnotherDriver) }}
                                        id="page-driver-name-select-titles"
                                        className="page-driver-name__select-titles"
                                        path={prefixPath}
                                        name={prefixFieldName}
                                        onChange={(event) => handlePrefix(event, hdProps)}
                                        availableValues={titles}
                                        btnGroupClassName="grid grid--col-3 grid--col-lg-6" />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={8} xs={12}>
                                    <HDTextInput
                                        reference={inputRefName}
                                        webAnalyticsEvent={{
                                            event_action: messages.nameTitle(isAnotherDriver)
                                        }}
                                        type="firstName"
                                        id="page-driver-name-first-name"
                                        className="page-driver-name__first-name"
                                        placeholder={messages.firstNamePlaceholder}
                                        name={firstNameFieldName}
                                        path={firstNamePath}
                                        size="lg"
                                        onChange={handleOnInputChange}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                inputRefName.current.blur();
                                            }
                                        }}
                                        tickIcon={!!hdProps.values[firstNameFieldName] && !hdProps.errors[firstNameFieldName]}
                                        isInvalidCustom={hdProps.touched[firstNameFieldName] && !!hdProps.errors[firstNameFieldName]} />
                                </Col>

                                <Col sm={8} xs={12}>
                                    <HDTextInput
                                        reference={inputRefSurname}
                                        webAnalyticsEvent={{
                                            event_action: messages.nameTitle(isAnotherDriver)
                                        }}
                                        type="lastName"
                                        id="page-driver-name-last-name"
                                        className="page-driver-name__last-name"
                                        placeholder={messages.lastNamePlaceholder}
                                        name={lastNameFieldName}
                                        path={lastNamePath}
                                        size="lg"
                                        onChange={handleOnInputChange}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                inputRefSurname.current.blur();
                                            }
                                        }}
                                        tickIcon={!!hdProps.values[lastNameFieldName] && !hdProps.errors[lastNameFieldName]}
                                        isInvalidCustom={hdProps.touched[lastNameFieldName] && !!hdProps.errors[lastNameFieldName]} />
                                </Col>
                            </Row>
                            {hdProps.values.prefix && prefixDrCodes.includes(hdProps.values.prefix) && (
                                <div className="gender-question-container">
                                    <hr />
                                    <Row className="margin-top-lg margin-top-lg-mobile">
                                        <Col>
                                            <HDLabelRefactor
                                                id="page-driver-name-gender"
                                                className="page-driver-name__gender"
                                                Tag="h2"
                                                text={messages.genderTitle(isAnotherDriver)} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <HDToggleButtonGroup
                                                webAnalyticsEvent={{ event_action: messages.genderTitle(isAnotherDriver) }}
                                                id="page-driver-name-dropdown-gender"
                                                className="page-driver-name__dropdown-gender"
                                                path={genderPath}
                                                name={genderFieldName}
                                                onChange={(event) => handleGender(event, hdProps)}
                                                availableValues={gender}
                                                btnGroupClassName="grid grid--col-2 grid--col-lg-3"
                                                tickIcon={hdProps.touched[lastNameFieldName] && !hdProps.errors[lastNameFieldName]} />
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {isAnotherDriver && (
                                <>
                                    <hr />
                                    <Row className="margin-top-lg">
                                        <Col>
                                            <HDLabelRefactor
                                                id="page-driver-name-driver-relationship"
                                                className="page-driver-name__driver-relationship label"
                                                Tag="h2"
                                                text={messages.driversRelationship} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={8} xs={12}>
                                            <HDDropdownList
                                                webAnalyticsEvent={{ event_action: messages.driversRelationship }}
                                                id="page-driver-name-dropdown-driver-relationship"
                                                className="page-driver-name__dropdown-driver-relationship"
                                                name={relationToProposerFieldName}
                                                path={relationToProposerPath}
                                                theme="blue"
                                                options={getAvailableValuesToRelation}
                                                placeholder={messages.driversSelectPlaceholder} />
                                        </Col>
                                    </Row>
                                </>
                            )}
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
        multiCarFlag: state.wizardState.app.multiCarFlag,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setWizardPageState: setWizardPagesStateAction
};

HDDriverNamePage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string
    }).isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverNamePage);
