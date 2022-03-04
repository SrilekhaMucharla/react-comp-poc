import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
// Hastings
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Col, Row, Container } from 'react-bootstrap';
import { HDForm } from 'hastings-components';
import { useLocation } from 'react-router-dom';
import { AnalyticsHDDatePicker as HDDatePicker } from '../../../web-analytics';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import { setNavigation as setNavigationAction, setWizardPagesState as setWizardPagesStateAction } from '../../../redux-thunk/actions';
import * as messages from './HDDriverDOBPage.messages';

const HDDriverDOBPage = (props) => {
    const {
        submissionVM, setNavigation, setWizardPageState, multiCarFlag, mcsubmissionVM
    } = props;
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: true
        });
    }, []);

    const handleValidation = (isFormValid) => {
        setIsValid(isFormValid);
    };

    useEffect(() => {
        setNavigation({
            canForward: isValid
        });
    }, [isValid]);

    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;
    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    const driverResidingField = 'residingInUKSince';
    const driverResidingPath = `${driverPath}.${driverResidingField}`;

    const driverBornField = 'dateOfBirth';
    const driverBornPath = `${driverPath}.${driverBornField}`;
    const accountHolderDOBPath = `baseData.accountHolder.${driverBornField}`;

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 17);
    maxDate.setDate(maxDate.getDate() + 30);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 99);

    const validationSchema = yup.object({
        [driverBornField]: yup.date()
            .required(messages.REQUIRED_ERROR_MESSAGE)
            .typeError(messages.GENERAL_ERROR_MESSAGE)
            .min(minDate, messages.OLDER_THAN_99_ERROR_MESSAGE)
            .before17thBirthday(messages.YOUNGER_THAN_17_ERROR_MESSAGE)
            .notInTheFuture(messages.FUTURE_ERROR_MESSAGE)
            .VMValidation(driverBornPath, messages.GENERAL_ERROR_MESSAGE, submissionVM),
        [driverResidingField]: yup.date()
            .required(messages.REQUIRED_ERROR_MESSAGE)
            .typeError(messages.GENERAL_ERROR_MESSAGE)
            .max(todayAtMidnight, messages.FUTURE_ERROR_MESSAGE)
            .when('dateOfBirth', (dateOfBirth, schema) => dateOfBirth
                && schema.minOrEqual(dateOfBirth || new Date(), messages.BEFORE_DATE_OF_BIRTH_ERROR_MESSAGE))
            .VMValidation(driverResidingPath, messages.GENERAL_ERROR_MESSAGE, submissionVM),
    });

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const newDriversPageState = _.cloneDeep(driversPageState);

    const handleChangeResidenceInUK = (event, hdFormProps) => {
        const date = event.target.value;
        let driverDateOfBirth = '';

        if (_.isDate(date)) {
            driverDateOfBirth = { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
            hdFormProps.setFieldValue(`${driverResidingField}`, date, true);
        }



        if (!isAnotherDriver) {
            _.set(submissionVM, accountHolderDOBPath, driverDateOfBirth);
        }

        // trigger DLN validation
        _.set(newDriversPageState, `${driverIndex}.licenceDataChanged`, true);

        setWizardPageState({ drivers: newDriversPageState });
    };

    return (
        <Container className="hd-driver-dob__container">
            <HDForm
                submissionVM={submissionVM}
                validationSchema={validationSchema}
                onValidation={handleValidation}
            >
                {(hdFormProps) => (
                    <>
                        <Row>
                            <Col>
                                <HDDatePicker
                                    webAnalyticsEvent={{ event_action: messages.dateOfBirthTitle(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                    id="hd-driver-dob-dob"
                                    className="hd-driver-dob__dob-picker"
                                    path={driverBornPath}
                                    name={driverBornField}
                                    hidePicker
                                    onChange={(event) => handleChangeResidenceInUK(event, hdFormProps)}
                                    label={{
                                        Tag: 'h2',
                                        text: messages.dateOfBirthTitle(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                    }}
                                    inputCols={[
                                        { xs: 3 },
                                        { xs: 3 },
                                        { xs: 6 }
                                    ]}
                                    inputSectionCol={{
                                        xs: 12, sm: 10, md: 12, lg: 10, xl: 8
                                    }} />
                            </Col>
                        </Row>
                        <hr />
                        <Row className="mb-4">
                            <Col>
                                <HDDatePicker
                                    webAnalyticsEvent={{ event_action: messages.dateOfUKResidence(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                    id="hd-driver-dob-residency"
                                    className="hd-driver-dob__residency-picker"
                                    path={driverResidingPath}
                                    name={driverResidingField}
                                    hidePicker
                                    label={{
                                        Tag: 'h2',
                                        text: messages.dateOfUKResidence(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                    }}
                                    inputCols={[
                                        { xs: 3 },
                                        { xs: 3 },
                                        { xs: 6 }
                                    ]}
                                    inputSectionCol={{
                                        xs: 12, sm: 10, md: 12, lg: 10, xl: 8
                                    }} />
                            </Col>
                        </Row>
                    </>
                )}
            </HDForm>
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
    setWizardPageState: setWizardPagesStateAction
};

HDDriverDOBPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverDOBPage);
