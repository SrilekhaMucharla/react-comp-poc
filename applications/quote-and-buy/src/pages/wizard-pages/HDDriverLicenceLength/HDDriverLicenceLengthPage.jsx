// react
import React, {
    useContext, useEffect, useMemo, useState
} from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
// Other
import _ from 'lodash';
import dayjs from 'dayjs';
// Hastings
import * as yup from 'hastings-components/yup';
import {
    HDForm
} from 'hastings-components';
import { useLocation } from 'react-router-dom';
import {
    AnalyticsHDDatePicker as HDDatePicker,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
// import styles from './HDDriverLicenceLengthPage.module.scss';
import * as messages from './HDDriverLicenceLengthPage.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';

const HDDriverLicenceLengthPage = (props) => {
    const {
        submissionVM, setNavigation, pageMetadata, multiCarFlag, mcsubmissionVM
    } = props;
    const [driverIndex, isAnotherDriver, isAnotherDriverMulti, driverFixedId] = useAnotherDriver(useLocation());
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    // eslint-disable-next-line max-len
    const editDriverIndex = drivers && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1 ? drivers.findIndex((driver) => driver.fixedId === driverFixedId) : driverIndex;

    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState(new Date());
    const [licenceHeldForYears, setLicenceHeldForYears] = useState(0);
    const driverPath = `lobData.privateCar.coverables.drivers.children.${editDriverIndex}`;

    const licenceHeldForFieldname = 'licenceHeldFor';
    const licenceHeldForPath = `${driverPath}.${licenceHeldForFieldname}`;

    const licenceObtainedField = 'licenceObtainedDate';
    const licenceObtainedPath = `${driverPath}.${licenceObtainedField}`;

    const translator = useContext(TranslatorContext);

    const getMCSubmissionVM = () => {
        return (_.get(mcsubmissionVM, 'value.quotes', []).length) >= 1;
    };

    // eslint-disable-next-line max-len
    const licenceHeldFor = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.drivers.children[editDriverIndex].licenceHeldFor.value);

    useEffect(() => {
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: true
        });
    }, [setNavigation]);

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const showMore = (element) => {
        if (!element) { return false; }

        return element.value <= 2;
    };

    const clearObtainedDate = (hdFormProps) => {
        if (_.get(submissionVM, `${licenceHeldForPath}.value.code`) > 2 && hdFormProps) {
            _.set(submissionVM, licenceObtainedPath, null);
            hdFormProps.setFieldValue(licenceObtainedField, '');
            hdFormProps.setFieldTouched(`${licenceObtainedField}`, false, false);
        }
    };

    useEffect(() => {
        const memoHeldFor = Number((!!licenceHeldFor && licenceHeldFor.code) ? licenceHeldFor.code : 0) + 1;

        const memoMinDate = dayjs().subtract(memoHeldFor, 'y').toDate();

        const memoMaxDate = dayjs().subtract(memoHeldFor - 1, 'y').toDate();

        setLicenceHeldForYears(memoHeldFor);
        setMinDate(memoMinDate);
        setMaxDate(memoMaxDate);
    }, [licenceHeldFor]);

    const validationSchema = useMemo(() => {
        return yup.object({
            [licenceHeldForFieldname]: yup.object({ value: yup.number() })
                .required(messages.validationRequired)
                .nullable()
                .VMValidation(licenceHeldForPath, 'Wrong value', submissionVM),
            [licenceObtainedField]: yup.date()
                .when(`${licenceHeldForFieldname}`, (years, schema) => {
                    return showMore(years)
                        ? schema
                            .required(messages.validationRequired)
                            .typeError(messages.validationWrongDate)
                            .min(minDate, messages.validationMinDate)
                            .max(maxDate, messages.validationMaxDate)
                            .notInTheFuture(messages.validationFutureDate)
                        : schema;
                })
                .VMValidation(licenceObtainedPath, 'VM Validation error', submissionVM),
        });
    }, [licenceHeldForYears]);

    const howLongOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.drivingLicenceLengthInfo }}
            webAnalyticsEvent={{ event_action: messages.drivingLicenceLengthInfo }}
            labelText={messages.howLongLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver)}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <p>{messages.howLongOverlayMessage(isAnotherDriver ? isAnotherDriverMulti : !isAnotherDriverMulti)}</p>
        </HDOverlayPopup>
    );

    const yearLicensedAvailableValues = _.get(submissionVM, licenceHeldForPath)
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
        });

    return (
        <Container className="dll-container">
            <HDForm
                submissionVM={submissionVM}
                validationSchema={validationSchema}
                onValidation={handleValidation}
            >
                {(hdFormProps) => {
                    return (
                        <>
                            <Row>
                                <Col>
                                    <HDDropdownList
                                        // eslint-disable-next-line max-len
                                        webAnalyticsEvent={{ event_action: messages.howLongLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                        id="driving-licence-length-dropdown"
                                        path={licenceHeldForPath}
                                        name={licenceHeldForFieldname}
                                        label={{
                                            text: messages.howLongLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                            Tag: 'h2',
                                            iconPosition: 'r',
                                            icon: howLongOverlay,
                                            id: 'dll-how-long-label'
                                        }}
                                        options={yearLicensedAvailableValues}
                                        selectSize="md-8"
                                        theme="blue"
                                        onChange={() => { clearObtainedDate(hdFormProps); }}
                                        isSearchable={false}
                                        enableNative />
                                </Col>
                            </Row>
                            {showMore(hdFormProps.values[licenceHeldForFieldname]) && (
                                <>
                                    <hr />
                                    <Row>
                                        <Col>
                                            <HDDatePicker
                                                // eslint-disable-next-line max-len
                                                webAnalyticsEvent={{ event_action: messages.whenLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver) }}
                                                id="dob-date-picker"
                                                path={licenceObtainedPath}
                                                name={licenceObtainedField}
                                                hidePicker
                                                label={{
                                                    Tag: 'h2',
                                                    text: messages.whenLabel(multiCarFlag && getMCSubmissionVM() ? isAnotherDriverMulti : isAnotherDriver),
                                                    id: 'dll-when-label'
                                                }}
                                                inputCols={[
                                                    { xs: 3 },
                                                    { xs: 3 },
                                                    { xs: 6 }
                                                ]}
                                                inputSectionCol={{ xs: 12, md: 8, xl: 8 }} />
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
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDDriverLicenceLengthPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverLicenceLengthPage);
