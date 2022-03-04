import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as yup from 'hastings-components/yup';
// import './HDDriverEmployement.scss';
import {
    HDForm
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDAsyncSelect as HDAsyncSelect
} from '../../../web-analytics';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import * as messages from './HDDriverEmployement.messages';

const HDSecondaryEmployementInfoPage = (props) => {
    const translator = useContext(TranslatorContext);
    const {
        submissionVM, setNavigation, multiCarFlag, mcsubmissionVM
    } = props;
    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
        && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;

    const driverVMPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;
    // eslint-disable-next-line no-unused-vars
    const driverId = _.get(submissionVM, `${driverVMPath}.tempID.value`);
    const driverVM = _.get(submissionVM, driverVMPath);
    const hasPartTimeEmpFieldName = 'hasPartTimeEmp';
    const hasPartTimeEmpPath = `${driverVMPath}.${hasPartTimeEmpFieldName}`;
    const occupationPartFieldName = 'occupationPart';
    const occupationPartPath = `${driverVMPath}.${occupationPartFieldName}`;
    const businessTypeFieldName = 'businessTypePart';
    const businessTypePath = `${driverVMPath}.${businessTypeFieldName}`;

    const [partTimeEmpl, setPartTimeEmpl] = useState(_.get(submissionVM, driverVMPath).hasPartTimeEmp.value);
    const hasPartTimeEmpAvailValues = [{
        value: messages.trueVal,
        name: messages.yes
    }, {
        value: messages.falseVal,
        name: messages.no
    }];

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canForward: false });
    }, []);

    if (!submissionVM) {
        return ' ';
    }

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const hasPartTimeEmpChangeHandler = (event, hdProps) => {
        hdProps.setFieldTouched(`${occupationPartFieldName}`, false, false);
        hdProps.setFieldTouched(`${businessTypeFieldName}`, false, false);
        if (event && event.target && event.target.value) {
            setPartTimeEmpl(event.target.value);
            if (event.target.value === 'false') {
                // set secondary employment status to Employed
                driverVM.partEmpStatus.value = null;
                if (!_.isNil(_.get(submissionVM, `${occupationPartPath}`).value)) {
                    driverVM.occupationPart.value = null;
                }
                if (hdProps.values.occupationPart) {
                    // eslint-disable-next-line no-param-reassign
                    hdProps.setFieldValue(`${occupationPartFieldName}`, null, true);
                }

                if (!_.isNil(_.get(submissionVM, `${businessTypePath}`).value)) {
                    driverVM.businessTypePart.value = null;
                }
                if (hdProps.values.businessTypePart) {
                    // eslint-disable-next-line no-param-reassign
                    hdProps.setFieldValue(`${businessTypeFieldName}`, null, true);
                }
            } else {
                // set secondary employment status to Employed
                driverVM.partEmpStatus.value = messages.employedCode;
            }
        }
    };

    const validationSchema = yup.object({
        [hasPartTimeEmpFieldName]: yup.string()
            .required(messages.required)
            .VMValidation(hasPartTimeEmpPath, null, submissionVM),
        [occupationPartFieldName]: yup.object()
            .nullable().VMValidation(occupationPartPath, messages.errorMessage, submissionVM),

        [businessTypeFieldName]: yup.object()
            .nullable().VMValidation(businessTypePath, messages.errorMessage, submissionVM)

    });

    const filterOccupations = (inputValue) => {
        const options = driverVM.occupationPart.aspects.availableValues.map((typekey) => {
            const option = {};
            option.value = typekey.code;
            option.label = translator({
                id: typekey.name,
                defaultMessage: typekey.name
            });
            return option;
        });
        return options.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const loadOccupationOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOccupations(inputValue));
        }, 1000);
    };

    const handleInputChangeOccupation = (newValue) => {
        if (driverVM.occupationPart.value === '' || !driverVM.occupationPart.value || newValue) {
            driverVM.businessTypePart.value = '';
        }
        return newValue;
    };

    const filterBusiness = (inputValue) => {
        const options = driverVM.businessTypePart.aspects.availableValues.map((typekey) => {
            const option = {};
            option.value = typekey.code;
            option.label = translator({
                id: typekey.name,
                defaultMessage: typekey.name
            });
            return option;
        });
        return options.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const loadBusinessOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterBusiness(inputValue));
        }, 1000);
    };

    const handleInputChangeBusiness = (newValue) => {
        return newValue;
    };


    return (
        <Container className="secondary-empl-container">
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
                                    <HDToggleButtonGroup
                                        webAnalyticsEvent={{ event_action: messages.anotherJob(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                        id="another-job-button-group"
                                        path={hasPartTimeEmpPath}
                                        name={hasPartTimeEmpFieldName}
                                        availableValues={hasPartTimeEmpAvailValues}
                                        label={{
                                            text: messages.anotherJob(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                            Tag: 'h2',
                                            id: 'secondary-empl-another-job-label'
                                        }}
                                        onChange={(e) => hasPartTimeEmpChangeHandler(e, hdProps)}
                                        customClassName=""
                                        btnGroupClassName="grid grid--col-2 grid--col-lg-3" />
                                    <hr />
                                </>
                            );
                        }}
                        {partTimeEmpl && partTimeEmpl.toString() === 'true' && (
                            <>
                                <HDAsyncSelect
                                    webAnalyticsEvent={{ event_action: messages.whatIsIt }}
                                    id="secondary-empl-occupation"
                                    selectSize="md-8"
                                    name={occupationPartFieldName}
                                    path={occupationPartPath}
                                    placeholder={messages.genericInputPlaceholder}
                                    label={{
                                        text: messages.whatIsIt,
                                        Tag: 'h2',
                                        id: 'secondary-empl-what-job-label'
                                    }}
                                    cacheOptions
                                    loadOptions={loadOccupationOptions}
                                    onInputChange={handleInputChangeOccupation} />
                                <hr />
                                <HDAsyncSelect
                                    webAnalyticsEvent={{ event_action: messages.industry }}
                                    id="secondary-empl-business"
                                    selectSize="md-8"
                                    name={businessTypeFieldName}
                                    path={businessTypePath}
                                    placeholder={messages.genericInputPlaceholder}
                                    label={{
                                        text: messages.industry,
                                        Tag: 'h2',
                                        id: 'secondary-empl-industry-label'
                                    }}
                                    cacheOptions
                                    loadOptions={loadBusinessOptions}
                                    onInputChange={handleInputChangeBusiness} />
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
    setNavigation: setNavigationAction
};

HDSecondaryEmployementInfoPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDSecondaryEmployementInfoPage);
