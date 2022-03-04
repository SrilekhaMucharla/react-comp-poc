/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import {
    HDForm, HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as yup from 'hastings-components/yup';
import {
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDDatePicker as HDDatePicker
} from '../../../web-analytics';
import HDStartDatePopup from '../HDCustomizeQuoteSummaryPage/HDStartDatePopup';
import * as messages from './HDMCCustomizeQuoteSummaryPage.messages';
import { submissionPropTypes, pageMetadataPropTypes } from '../../../constant/propTypes';
import { getDateFromParts } from '../../../common/dateHelpers';
import HDMCYourExcessPopup from './HDMCYourExcessPopup';
import getYoungAndInexperiencedExcess from '../../../common/getYoungAndInexperiencedExcess';

const HDMCForm = ({
    submissionVM,
    voluntaryExcess,
    handleExcessChange,
    displayRerateModalForStartDate,
    initialPolicyStartDate,
    handleValidation,
    availableVoluntaryExcessValues,
    pageMetadata,
    displayRerateModalForStartDateSelected,
    multiCustomizeSubmissionVM,
    customMultiQuoteData,
    updateExcessesCounter,
    dateTriggerObject,
    triggerOnChange
}) => {
    const displayAmount = (value) => `£${value}`;
    const [compulsoryExcess, setCompulsoryExcess] = useState(0);
    const [accidentalVehicleExcess, setAccidentalVehicleExcess] = useState({});
    const [accidentalVehicleDamage, setAccidentalVehicleDamage] = useState([]);
    const [theftVehicleDamage, setTheftVehicleDamage] = useState([]);
    const [windScreenVehicleDamage, setWindScreenDamage] = useState([]);
    const [loadData, setLoadData] = useState(false);
    const [localExcessUpdateCounter, setLocalExcessUpdateCounter] = useState(0);
    const [localDateValidationCounter, setLocalDateValidationCounter] = useState(0);
    const pcCurrentDate = _.get(submissionVM, 'baseData.pccurrentDate.value', new Date());

    const vehicleCoveragesPath = 'coverages.privateCar.vehicleCoverages';
    const voluntaryExcessKey = 'voluntaryExcess';
    const voluntaryExcessPath = `lobData.privateCar.coverables.vehicles.children[0].${voluntaryExcessKey}`;
    const policyStartDateKey = 'periodStartDate';
    const policyStartDatePath = `baseData.${policyStartDateKey}`;
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(submissionVM, driverPath));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];
    const submissionVoluntaryExcessValue = _.get(submissionVM, voluntaryExcessPath).value.code;
    let hdPropsVar = null;

    const getCustomSubVMObject = () => {
        for (let i = 0; i < multiCustomizeSubmissionVM.customQuotes.length; i += 1) {
            if (multiCustomizeSubmissionVM.customQuotes.children[i].quoteID.value === submissionVM.value.quoteID) {
                return multiCustomizeSubmissionVM.customQuotes.children[i];
            }
        }
        return {};
    };

    const customizeSubmissionVMObject = getCustomSubVMObject();

    const {
        lobData: { privateCar: { coverables: { vehicles } } }
    } = submissionVM.value;

    const registrationNumber = vehicles[0].registrationsNumber;
    const branchCode = _.get(submissionVM, 'value.baseData.brandCode', 'HD');
    const periodStartDate = _.get(submissionVM, 'value.baseData.periodStartDate', '');

    const driverListWithExcessDetails = () => {
        if (accidentalVehicleDamage.length > 0) {
            return driversList.map((driver) => ({
                name: driver.displayName,
                excesses:
                       { excessName: messages.accidentalDamageText, voluntaryAmount: +submissionVoluntaryExcessValue, compulsoryAmount: ((driver.youngInexperiencedDriverExcess ? driver.youngInexperiencedDriverExcess.amount : 0) + accidentalVehicleExcess) }
            }));
        }
        return [];
    };

    const setExcessChangeValue = (coverType, accidentalDamage, theftDamage) => {
        if (coverType === messages.tpft) {
            const theftVehicleDamageList = theftDamage[0].terms.filter((amt) => amt.publicID === messages.theftCompulsaryKey);
            setCompulsoryExcess(theftVehicleDamageList[0].directValue);
        } else if (_.isArray(accidentalDamage) && accidentalDamage.length > 0) {
            const cmpAmountPathAccDamage = accidentalDamage[0].terms.filter((amt) => amt.publicID === messages.accidentalDamageCompulsaryKey);
            const cmpYAndIAccDamage = getYoungAndInexperiencedExcess(driversList);
            setAccidentalVehicleExcess(cmpAmountPathAccDamage[0].directValue);
            setCompulsoryExcess(cmpAmountPathAccDamage[0].directValue + cmpYAndIAccDamage);
        }
        setLocalExcessUpdateCounter(updateExcessesCounter);
        setLoadData(true);
    };

    const setVehicleExcess = () => {
        const excCoverages = _.get(customizeSubmissionVMObject, vehicleCoveragesPath);
        const accidentalDamage = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.accidentalDamage) : '';
        setAccidentalVehicleDamage(accidentalDamage);
        const theftDamage = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.fireAndTheft) : '';
        setTheftVehicleDamage(theftDamage);
        const windScreen = excCoverages ? excCoverages.value[0].coverages.filter((cover) => cover.publicID === messages.windScreenExcess) : '';
        setWindScreenDamage(windScreen);
        const coverType = _.get(customizeSubmissionVMObject, 'value.coverType');

        setExcessChangeValue(coverType, accidentalDamage, theftDamage);
    };

    const windScreenExcessDetails = () => {
        if (windScreenVehicleDamage.length > 0 && theftVehicleDamage.length > 0) {
            const repairPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === 'PCGlassDmgWrepairdmgCT_Ext');
            const replacementPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === 'PCGlassDmgWreplacementdmgCT_Ext');
            const fireAndTheftVal = theftVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.theftCompulsaryKey);
            return [
                { excessName: messages.fireAndTheftText, voluntaryAmount: +submissionVoluntaryExcessValue, compulsoryAmount: fireAndTheftVal[0].directValue },
                { excessName: messages.windowGlassText, voluntaryAmount: replacementPath[0].directValue, compulsoryAmount: repairPath[0].directValue },
            ];
        } if (theftVehicleDamage.length > 0) {
            const fireAndTheftVal = theftVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.theftCompulsaryKey);
            return [

                { excessName: messages.fireAndTheftText, voluntaryAmount: +submissionVoluntaryExcessValue, compulsoryAmount: fireAndTheftVal[0].directValue },
            ];
        }
        return [];
    };

    // for sorting drivers
    useEffect(() => {
        driversList.sort((a, b) => {
            if (a.isPolicyHolder) return -1;
            if (b.isPolicyHolder) return 1;
            return 0;
        });
    }, []);

    // for populating data
    useEffect(() => {
        if (_.get(multiCustomizeSubmissionVM, 'value.mpwrapperNumber', false)) {
            setVehicleExcess();
        }
    }, [multiCustomizeSubmissionVM]);

    // for updating excess values after rerate
    useEffect(() => {
        const customMultiQuotesResponses = _.get(customMultiQuoteData, 'multiCustomUpdatedQuoteObj.customQuotesResponses', []);
        if (!customMultiQuoteData.loading && customMultiQuotesResponses.length > 0) {
            setVehicleExcess();
        }
    }, [customMultiQuoteData]);

    useEffect(() => {
        if (updateExcessesCounter !== localExcessUpdateCounter) {
            setVehicleExcess();
        }
    }, [updateExcessesCounter]);

    // returns date of parent car/policy
    const getParentPolicyStartDate = () => {
        let parentPolicyStartDate;
        initialPolicyStartDate.map((startDateObjects) => {
            if (startDateObjects.isParentPolicyDate) {
                parentPolicyStartDate = getDateFromParts(startDateObjects.initialStartDate);
            }
            return null;
        });
        return parentPolicyStartDate;
    };

    const getPCStartDate = () => {
        let pcStartDate = _.get(submissionVM.value, 'baseData.pccurrentDate', new Date());
        pcStartDate = new Date(pcStartDate);
        pcStartDate = Date.UTC(pcStartDate.getUTCFullYear(), pcStartDate.getUTCMonth(), pcStartDate.getUTCDate());
        const pcStartDateObject = (pcStartDate) ? new Date(pcStartDate) : new Date();
        pcStartDateObject.setHours(0, 0, 0, 0);
        return pcStartDateObject;
    };

    const getChildMinDate = () => {
        const presentDate = getParentPolicyStartDate();
        presentDate.setHours(0, 0, 0, 0);
        return ((presentDate.getTime() - getParentPolicyStartDate().getTime()) / (1000 * 3600 * 24));
    };

    const getChildMaxDate = () => {
        const presentDate = getPCStartDate();
        return ((presentDate.getTime() - getParentPolicyStartDate().getTime()) / (1000 * 3600 * 24));
    };

    const createValidationSchema = (quote) => {
        const now = dayjs(getPCStartDate());
        let minDate;
        let maxDate;
        if (quote.value.isParentPolicy) {
            minDate = getPCStartDate();
            maxDate = getDateFromParts({ year: now.add(30, 'day').get('year'), month: now.add(30, 'day').get('month'), day: now.add(30, 'day').get('date') });
        } else {
            minDate = getParentPolicyStartDate();
            maxDate = getDateFromParts({
                year: now.add(334, 'day').get('year'),
                month: now.add(334, 'day').get('month'),
                day: now.add(334, 'day').get('date')
            });
        }

        // will use this conditional error message once we get it (childPolicyStartDateInPast) from business
        // const pastDateError = quote.value.isParentPolicy ? messages.policyStartDateInPast : messages.childPolicyStartDateInPast;
        const pastDateError = messages.policyStartDateInPast;

        const validationSchema = yup.object({
            [voluntaryExcessKey]: yup.string()
                .required(messages.voluntaryExcessRequired)
                .VMValidation(voluntaryExcessPath, messages.voluntaryExcessRequired, quote),
            [policyStartDateKey]: yup.date()
                .required(messages.invalidDate)
                .typeError(messages.invalidDate)
                .min(minDate, pastDateError)
                .max(maxDate, messages.policyStartDate30Days)
                .VMValidation(policyStartDatePath, messages.invalidDate, quote),
        });

        return validationSchema;
    };

    const getVoluntaryExcess = () => {
        return {
            label: `£${voluntaryExcess}`,
            value: voluntaryExcess
        };
    };

    // for triggering date validation for showing error if parent car starts after child car
    const triggerDateValidation = () => {
        hdPropsVar.setFieldTouched(`${policyStartDateKey}`, true, true);
        setLocalDateValidationCounter(dateTriggerObject.triggerCounter);
    };

    useEffect(() => {
        if (dateTriggerObject.quoteID !== submissionVM.value.quoteID && dateTriggerObject.triggerCounter !== localDateValidationCounter && hdPropsVar) {
            triggerDateValidation();
        }
    }, [dateTriggerObject]);

    return (
        <>
            {loadData ? (
                <HDForm
                    passedKey={`MCCQSPForm${submissionVM.value.quoteID}`}
                    className="hd-mc-form"
                    submissionVM={submissionVM}
                    validationSchema={createValidationSchema(submissionVM)}
                    onValidation={handleValidation}
                >
                    {(hdProps) => {
                        hdPropsVar = _.cloneDeep(hdProps);
                        return (
                            <Row className="hd-mc-form__sections">
                                <Col className="hd-mc-form__section">
                                    <Row className="hd-mc-form__section-header">
                                        <Col><h3>{messages.yourExcessHeader}</h3></Col>
                                        <Col className="col-auto text-right pr-0"><div className="hd-mc-form__info">{messages.otherExcessesInfo}</div></Col>
                                        <Col className="col-auto pl-1">
                                            <HDMCYourExcessPopup
                                                drivers={driverListWithExcessDetails()}
                                                globalExcesses={windScreenExcessDetails()}
                                                registrationNumber={registrationNumber}
                                                periodStartDate={periodStartDate}
                                                branchCode={branchCode}
                                                pcCurrentDate={pcCurrentDate}
                                                pageMetadata={pageMetadata}
                                                className="hd-mc-form__info-popup" />
                                        </Col>
                                    </Row>
                                    <Row className="hd-mc-form__excesses-section-content">
                                        <Col className="hd-mc-form__excess-value col-auto pr-0">
                                            <div className="hd-mc-form__label mb-1">{messages.compulsoryExcessLabel}</div>
                                            <input
                                                className="hd-mc-form__com-excess-input"
                                                disabled
                                                value={displayAmount(compulsoryExcess)} />
                                        </Col>
                                        <Col className="hd-mc-form__excess-sign customize-quote-summary__excess-sign col-auto px-0">+</Col>
                                        <Col className="hd-mc-form__excess-value px-0">
                                            <div className="hd-mc-form__label mb-1">{messages.voluntaryExcessLabel}</div>
                                            <HDDropdownList
                                                id="voluntary-excess-dropdown"
                                                webAnalyticsEvent={{ event_action: messages.voluntaryExcessLabel }}
                                                className="customize-quote-summary__voluntary-excess-sel"
                                                name={voluntaryExcessKey}
                                                path={voluntaryExcessPath}
                                                data={getVoluntaryExcess()}
                                                onChange={(event) => handleExcessChange(event, submissionVM, hdProps)}
                                                options={availableVoluntaryExcessValues} />
                                        </Col>
                                        <Col className="hd-mc-form__excess-sign col-auto px-0">=</Col>
                                        <Col className="hd-mc-form__excess-value col-auto pl-0">
                                            <div className="hd-mc-form__label mb-1">{messages.totalExcessLabel}</div>
                                            <div className="hd-mc-form__total">
                                                {displayAmount(compulsoryExcess + voluntaryExcess)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="hd-mc-form__section">
                                    <Row className="customize-quote-summary__section-header">
                                        <Col>
                                            <HDLabelRefactor
                                                className="customize-quote-summary__start-date-header text-left"
                                                text={messages.startDateHeader}
                                                Tag="h3" />
                                        </Col>
                                        <Col xs="auto">
                                            <HDStartDatePopup
                                                className="hd-mc-form__info-popup"
                                                pageMetadata={pageMetadata} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <HDDatePicker
                                                webAnalyticsEvent={{ event_action: messages.startDateHeader }}
                                                id={`datePicker${submissionVM.value.quoteID}`}
                                                className="customize-quote-summary__date-picker"
                                                name={policyStartDateKey}
                                                path={policyStartDatePath}
                                                onBlur={(e) => displayRerateModalForStartDate(e, submissionVM.value)}
                                                onSelect={(e) => displayRerateModalForStartDateSelected(e, submissionVM.value)}
                                                theme="blue"
                                                minDate={submissionVM.value.isParentPolicy ? 0 : getChildMinDate()}
                                                maxDate={submissionVM.value.isParentPolicy ? 30 : 334 - (-1 * getChildMaxDate())}
                                                initialDate={submissionVM.value.isParentPolicy ? getPCStartDate() : getParentPolicyStartDate()}
                                                showFieldsNames
                                                information={messages.policyStartDateInfo}
                                                onChange={triggerOnChange} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        );
                    }}
                </HDForm>
            ) : null}
        </>
    );
};

HDMCForm.propTypes = {
    submissionVM: PropTypes.shape(submissionPropTypes).isRequired,
    handleExcessChange: PropTypes.func.isRequired,
    displayRerateModalForStartDate: PropTypes.func.isRequired,
    availableVoluntaryExcessValues: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })).isRequired,
    handleValidation: PropTypes.func.isRequired,
    voluntaryExcess: PropTypes.number.isRequired,
    initialPolicyStartDate: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    displayRerateModalForStartDateSelected: PropTypes.func.isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({
        customQuotes: PropTypes.object
    }).isRequired,
    customMultiQuoteData: PropTypes.shape({
        loading: PropTypes.bool,
        multiCustomUpdatedQuoteObj: PropTypes.object
    }).isRequired,
    updateExcessesCounter: PropTypes.number.isRequired,
    dateTriggerObject: PropTypes.number.isRequired,
    triggerOnChange: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        customMultiQuoteData: state.customMultiQuoteModel
    };
};

export default connect(mapStateToProps)(HDMCForm);
