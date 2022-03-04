/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    HDQuoteInfoRefactor,
    HDPlaceholderWithHeader,
    HDLabelRefactor,
    HDQuoteInfoWarning
} from 'hastings-components';
import dayjs from 'dayjs';
import {
    getIpidMatchForAll
} from '../../../redux-thunk/actions';
import EventEmmiter from '../../../EventHandler/event';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import * as messages from './HDImportantStuffPage.messages';
import HDCoverSummary from './HDCoverSummary';
import HDDriverDetails from './HDDriverDetails';
import HDPolicyHolderDetails from './HDPolicyHolderDetails';
import HDQuotePolicyDetails from './HDQuotePolicyDetails';
import HDYourExcessFees from './HDYourExcessFees';
import driverAddedIcon from './Driver-added.svg';
import HDOurFees from './HDOurFees';
import HDOtherThings from './HDOtherThings';
import getCarName from '../../../common/getCarName';
import HDIpidDocumentPage from './HDIpidDocumentPage';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDModal as HDModal
} from '../../../web-analytics';
import { getAmount, iPidMatchForAllAPIObject } from '../../../common/utils';
import arcTop from '../../../assets/images/background/top-arc.svg';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import Amendments from './Amendments/Amendments';
import { faultyClaims } from '../../../common/faultClaimsHelper';

const PAYMENT_TYPE_ANNUALLY_CODE = '1';
const PAYMENT_TYPE_MONTHLY_CODE = '3';
const APR_RATE = 'APR_RATE';
const INTEREST_RATE = 'INTEREST_RATE';


const HDImportantStuffPage = (props) => {
    const {
        submissionVM,
        customizeSubmissionVM,
        paymentType,
        onPaymentTypeChange,
        onGoBack,
        wizardPagesState,
        pageMetadata,
        ipidMatchForAllData,
        dispatch
    } = props;
    const isMonthlyPaymentAvailable = () => {
        return _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments');
    };

    const [monthlyVal, setMonthlyVal] = useState({});
    const [annualVal, setAnnualVal] = useState(0);
    const [coverages, setCoverages] = useState([]);
    const [hpCoverages, setHPCoverages] = useState([]);
    const [accVehicleDamage, setAccidentalVehicleDamage] = useState([]);
    const [theftVehicleDamage, setTheftVehicleDamage] = useState([]);
    const [windScreenVehicleDamage, setWindScreenDamage] = useState([]);
    const [brand, setBrand] = useState('Hastings Direct');
    const [brandCode, setBrandCode] = useState('HD');
    const [coverType, setCoverType] = useState('comprehensive');
    const [isNCD, setIsNCD] = useState(false);
    const [showMissingMonthlyPaymentsPopup, setShowMissingMonthlyPaymentsPopup] = useState(false);
    const [showBreakDown, setShowBreakDown] = useState(false);
    const [ipidAPITriggerPoint, setIpidAPITriggerPoint] = useState(false);
    const [breakDownAmountForHP, setBreakDownAmountForHP] = useState(0);
    const [isOnlineProductType, SetOnlineProductType] = useState(false);

    const monthlyPath = 'result.quote.hastingsPremium.monthlyPayment';
    const annuallyPath = 'result.quote.hastingsPremium.annuallyPayment';
    const ancCoveragesPath = 'result.coverages.privateCar.ancillaryCoverages';
    const vehicleCoveragesPath = 'result.coverages.privateCar.vehicleCoverages';
    const branchNamePath = 'result.quote.branchName';
    const branchCodePath = 'result.quote.branchCode';
    const coverTypePath = 'result.coverType';
    const ncdPath = 'result.ncdgrantedProtectionInd';

    const customizeSubmission = { result: customizeSubmissionVM };
    const submission = { result: submissionVM };
    const accountHolderPath = 'result.baseData.accountHolder';
    const driverPath = 'result.lobData.privateCar.coverables.drivers';
    const insurerPath = 'result.baseData.insurer';
    const pcCurrentDate = _.get(submissionVM, 'baseData.pccurrentDate.value', new Date());
    const insurer = (_.get(submission, insurerPath));
    const accountHolderDetails = _.get(submission, accountHolderPath);
    const driversListFromSubmission = (_.get(submission, driverPath));
    const vehicleDetailsFromSubmission = (_.get(submissionVM, 'lobData.privateCar.coverables.vehicles'));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];
    const vehicleDetails = (vehicleDetailsFromSubmission && vehicleDetailsFromSubmission.value) ? vehicleDetailsFromSubmission.value[0] : {};
    const policyHolderDetails = driversList.filter((driver) => (driver.isPolicyHolder))[0];
    const namedDrivers = driversList.filter((driver) => !(driver.isPolicyHolder));
    const namedDriversList = () => {
        const namedDriversDisplay = [];
        namedDrivers.forEach((driver) => {
            namedDriversDisplay.push(driver.displayName);
        });
        return namedDriversDisplay;
    };
    const policyHolder = {
        registrationNumber: vehicleDetails.registrationsNumber,
        car: getCarName(vehicleDetails.make, vehicleDetails.model),
        policyHolder: policyHolderDetails.displayName,
        yearsNoClaims: vehicleDetails.ncdProtection.ncdgrantedYears,
        address: accountHolderDetails.primaryAddress.displayName.value,
        namedDrivers: namedDriversList()
    };

    const dateValue = (dateField) => {
        return (`0${dateField}`).slice(-2);
    };

    const periodStartDate = customizeSubmission.result.periodStartDate.value;
    const periodStartDateFormatted = `${dateValue(periodStartDate.day)}/${dateValue(periodStartDate.month + 1)}/${periodStartDate.year}`;
    const periodEndDate = customizeSubmission.result.periodEndDate.value;
    const claimsDetailPath = 'lobData.privateCar.coverables.drivers.children[0].claimsAndConvictions.claimsDetailsCollection';

    const periodEndDateFormatted = `${dateValue(periodEndDate.day)}/${dateValue(periodEndDate.month + 1)}/${periodEndDate.year}`;
    const tableTitle = `Starts on ${periodStartDateFormatted}`;

    const viewModelService = useContext(ViewModelServiceContext);
    const translator = useContext(TranslatorContext);

    const driverDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.policyjob.lob.privatecar.coverables.dto.DriverDTO'
    );

    const baseDataDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'edgev10.capabilities.quote.submission.base.dto.QuoteBaseDataDTO'
    );

    const getSelectedTypeList = (dto, typeListName, selectedTypeCode) => {
        const selectedTypeList = _.get(dto, typeListName).aspects.availableValues.filter((typeListEntry) => (typeListEntry.code === selectedTypeCode));
        return translator({
            id: selectedTypeList[0].name,
            defaultMessage: selectedTypeList[0].name
        });
    };

    const driversListDisplay = [];

    driversList.forEach((driver, driverIndex) => {
        const driverDOB = driver.dateOfBirth;
        const licenceTypeLabel = getSelectedTypeList(driverDTO, 'licenceType', driver.licenceType);
        const fullTimeOccupation = getSelectedTypeList(driverDTO, 'occupationFull', driver.occupationFull);
        const claimsCollections = driver.claimsAndConvictions.claimsDetailsCollection;
        const convictionsCollections = driver.claimsAndConvictions.convictionsCollection;
        const { licenceSuccessfulValidated } = wizardPagesState.drivers[driverIndex];
        const driverDisplay = {
            displayName: driver.displayName,
            isPolicyHolder: driver.isPolicyHolder,
            dateOfBirth: `${dateValue(driverDOB.day)}/${dateValue(driverDOB.month + 1)}/${driverDOB.year}`,
            occupation: fullTimeOccupation,
            drivingLicence: licenceSuccessfulValidated
                ? licenceTypeLabel
                : `${licenceTypeLabel}, held for ${driver.licenceHeldFor} year${+driver.licenceHeldFor !== 1 ? 's' : ''}`,
            accidence: `${claimsCollections.length} in the last 5 years`,
            youngAndInExpExcess: driver.youngInexperiencedDriverExcess ? driver.youngInexperiencedDriverExcess.amount : 0,
            // eslint-disable-next-line no-nested-ternary
            convictions: licenceSuccessfulValidated
                ? null
                : (convictionsCollections.length > 0) ? `${convictionsCollections.length} in the last 5 years` : 'None'
        };

        driversListDisplay.push(driverDisplay);
    });

    driversListDisplay.sort((a, b) => {
        if (a.isPolicyHolder) return -1;
        if (b.isPolicyHolder) return 1;
        return 0;
    });

    const startDate = new Date(periodStartDate.year, periodStartDate.month, periodStartDate.day);
    const endDate = new Date(periodEndDate.year, periodEndDate.month, periodEndDate.day);
    const diffDays = (startDate && endDate) && parseInt((endDate - startDate) / (1000 * 60 * 60 * 24), 10);

    const isSameDay = () => {
        const currentDate = new Date(submission.result.baseData.pccurrentDate.value);
        if (dayjs(startDate).isSame(currentDate, 'day') && dayjs(startDate).isSame(currentDate, 'month')) {
            return messages.immediatelyMsg;
        }
        return '';
    };

    const policyDetailsItems = [
        { key: messages.quoteReference, value: submission.result.quoteID.value },
        { key: messages.lengthOfPolicy, value: `${diffDays + 1} days` },
        { key: messages.starts, value: `${periodStartDateFormatted} ${isSameDay()}` },
        { key: messages.ends, value: `${periodEndDateFormatted} 23:59` },
        { key: messages.insurer, value: ((insurer) ? (getSelectedTypeList(baseDataDTO, 'insurer', (insurer && insurer.value.code))) : '') },
    ];


    useEffect(() => {
        props.toggleContinueElement(true);
    }, [props]);

    useEffect(() => {
        if (isMonthlyPaymentAvailable()) {
            const monthValue = {
                elevenMonth: _.get(customizeSubmission, `${monthlyPath}.elevenMonthsInstalments.amount`).value,
                initialPayment: _.get(customizeSubmission, `${monthlyPath}.firstInstalment.amount`).value,
                APR: _.get(customizeSubmission, `${monthlyPath}.representativeAPR`).value,
                interestRate: _.get(customizeSubmission, `${monthlyPath}.rateOfInterest`).value,
                creditCharge: _.get(customizeSubmission, `${monthlyPath}.totalAmountCredit`).value,
                amountPayable: _.get(customizeSubmission, `${monthlyPath}.value.premiumAnnualCost.amount`),
            };
            setMonthlyVal(monthValue);
        }
        const yearValue = _.get(customizeSubmission, `${annuallyPath}.value.premiumAnnualCost.amount`);
        setAnnualVal(yearValue);
        const ancCoverages = _.get(customizeSubmission, ancCoveragesPath);
        const ancCoveragesPredefOrder = {
            ANCMotorLegalExpensesCov_Ext: null,
            ANCBreakdownCov_Ext: null,
            ANCMotorPersonalAccidentCov_Ext: null,
            ANCSubstituteVehicleCov_Ext: null,
            ANCKeyCoverCov_Ext: null
        };
        ancCoverages.value[0].coverages.forEach((anc) => {
            if (anc.selected) ancCoveragesPredefOrder[anc.publicID] = anc;
        });
        const selectedAncCoverages = Object.values(ancCoveragesPredefOrder).filter((cov) => !!cov);
        setCoverages(selectedAncCoverages);
        if (selectedAncCoverages && selectedAncCoverages.length > 0) {
            setShowBreakDown(true);
        }
        const excCoverages = _.get(customizeSubmission, vehicleCoveragesPath);
        const excCoveragesList = (excCoverages.value && excCoverages.value[0].coverages) ? excCoverages.value[0].coverages : [];
        excCoveragesList.forEach((cover) => {
            switch (cover.publicID) {
                case messages.accidentalDamage:
                    (cover) ? setAccidentalVehicleDamage(cover.terms) : setAccidentalVehicleDamage([]);
                    break;
                case messages.fireAndTheft:
                    (cover) ? setTheftVehicleDamage(cover.terms) : setTheftVehicleDamage([]);
                    break;
                case messages.windScreenExcess:
                    (cover) ? setWindScreenDamage(cover.terms) : setWindScreenDamage([]);
                    break;
                default:
                    break;
            }
        });
        const branchName = _.get(customizeSubmission, branchNamePath);
        setBrand(branchName);
        const branchCode = _.get(customizeSubmission, branchCodePath);
        setBrandCode(branchCode.value);
        const cType = _.get(customizeSubmission, coverTypePath);
        setCoverType(cType.value.code);
        const ncdVal = _.get(customizeSubmission, ncdPath);
        const claimsDetails = faultyClaims(submissionVM, claimsDetailPath);
        if (claimsDetails && claimsDetails.length < 2) {
            setIsNCD(ncdVal.value);
        } else {
            setIsNCD(false);
        }


        if (branchCode.value === messages.HP) {
            let roadsideAmount = [];
            let selectedBreakDownAmnt = '';
            ancCoverages.value[0].coverages.map((cov) => {
                if (cov.publicID === messages.BreakdownKey) {
                    selectedBreakDownAmnt = cov.amount.amount;
                    cov.terms.map((termsObj) => {
                        roadsideAmount = termsObj.options && termsObj.options.filter((option) => option.name === messages.roadside);
                    });
                }
            });

            const diffAmount = (selectedBreakDownAmnt - roadsideAmount[0].amount.amount);
            setBreakDownAmountForHP(diffAmount);

            const hpAncCoveragesPredefOrder = {};
            ancCoverages.value[0].coverages.forEach((anc) => {
                if (anc.selected && anc.publicID !== messages.BreakdownKey && anc.publicID !== messages.MotorLegalKey) hpAncCoveragesPredefOrder[anc.publicID] = anc;
            });
            const selectedHpAncCoverages = Object.values(hpAncCoveragesPredefOrder).filter((cov) => !!cov);
            setHPCoverages(selectedHpAncCoverages);
        }

        SetOnlineProductType(
            _.get(submissionVM, 'value.isOnlineProductType')
        );
    }, []);


    useEffect(() => {
        const quoteIDPath = 'value.quoteID';
        const quoteID = _.get(customizeSubmissionVM, quoteIDPath);
        if (quoteID && !ipidAPITriggerPoint) {
            setIpidAPITriggerPoint(true);
            const ipidObject = iPidMatchForAllAPIObject(submissionVM, customizeSubmissionVM);
            dispatch(getIpidMatchForAll(ipidObject));
        }
        const ipiddFailureObj = _.get(ipidMatchForAllData, 'ipidMatchForAllErrorObj.error');
        if (ipiddFailureObj) {
            // TODO: error handling for ipid match for all api call
        }
    }, [customizeSubmissionVM, ipidMatchForAllData]);

    const descriptionForBreakdown = (cov) => {
        const choosenTerm = cov.terms[0].chosenTermValue;
        const optionalExtra = {};
        switch (choosenTerm) {
            case messages.roadside:
                optionalExtra.name = `${messages.roadsideHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceEsssential}</span></li>
                        <li><span>{messages.recoveryAwayHomeNotEsential}</span></li>
                        <li><span>{messages.homeCoverNotEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.roadsideAndRecovery:
                optionalExtra.name = `${messages.roadsideAndRecoveryHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceAwayHomeEssential}</span></li>
                        <li><span>{messages.homeCoverNotEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.homestart:
                optionalExtra.name = `${messages.homestartHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.roadsideAssistanceAwayHomeEssential}</span></li>
                        <li><span>{messages.homeCoverEssential}</span></li>
                        <li><span>{messages.europeCoverNotEssential}</span></li>
                    </ul>
                );
                break;
            case messages.european:
                optionalExtra.name = `${messages.europeanHeader} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = (
                    <ul className="pad-inl-start-sm mt-3 mb-0">
                        <li><span>{messages.europeCoverEssential}</span></li>
                    </ul>
                );
                break;
            default:
                optionalExtra.name = '';
                optionalExtra.description = '';
                break;
        }
        return optionalExtra;
    };

    const ancillariesDescription = (cov) => {
        let optionalExtra = {};
        switch (cov.name) {
            case messages.breakdown:
                if (cov.terms.length > 0) {
                    optionalExtra = descriptionForBreakdown(cov);
                }

                break;
            case messages.motorLegalExpenses:
                optionalExtra.name = `${messages.motorLegalExpensesLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.motorLegalExpensesDescription;
                break;
            case messages.personalAccident:
                optionalExtra.name = `${messages.personalAccidentLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.personalAccidentDescription;
                break;
            case messages.substituteVehicle:
                optionalExtra.name = `${messages.substituteVehicleLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.substituteVehicleDesription;
                break;
            case messages.keyCover:
                optionalExtra.name = `${messages.keyCoverLabel} - £${getAmountAsTwoDecimalDigit(cov.amount.amount)}`;
                optionalExtra.description = messages.keyCoverDescription;
                break;
            default:
                optionalExtra.name = '';
                optionalExtra.description = '';
                break;
        }
        return optionalExtra;
    };

    const theftDamageList = () => {
        let theftDamage = [];
        if (theftVehicleDamage.length > 0) {
            const cmpAmountPath = theftVehicleDamage.filter((amt) => amt.publicID === messages.fireAndTheftCompulsory);
            const voluntartAmountPath = theftVehicleDamage.filter((amt) => amt.publicID === messages.fireAndTheftVoluntary);
            theftDamage = [{
                excessName: messages.allDrivers,
                compulsoryAmount: cmpAmountPath[0].directValue,
                voluntaryAmount: voluntartAmountPath[0].directValue
            }];
        }

        return theftDamage;
    };

    const accidentalDamageList = () => {
        let accidentalDamageVal = [];
        if (accVehicleDamage.length > 0) {
            const cmpAmountPath = accVehicleDamage.filter((amt) => amt.publicID === messages.accidentalDamageCompulsaryKey);
            const voluntartAmountPath = accVehicleDamage.filter((amt) => amt.publicID === messages.accidentalDamageVoluntaryKey);
            accidentalDamageVal = [{
                compulsoryAmount: cmpAmountPath[0].directValue,
                voluntaryAmount: voluntartAmountPath[0].directValue
            }];
        }
        return accidentalDamageVal;
    };

    const windScreenDamageList = () => {
        let windScreenDamageVal = [];
        if (windScreenVehicleDamage.length > 0) {
            const repairPath = windScreenVehicleDamage.filter((amt) => amt.publicID === messages.windScreenExcessRepairKey);
            const replacementPath = windScreenVehicleDamage.filter((amt) => amt.publicID === messages.windScreenExcessReplacementKey);
            windScreenDamageVal = [{
                excessName: messages.allDrivers,
                compulsoryAmount: repairPath[0].directValue,
                voluntaryAmount: replacementPath[0].directValue
            }];
        }
        return windScreenDamageVal;
    };

    const ncdDescription = () => {
        const optionalExtra = {};
        optionalExtra.name = messages.ncdText;
        optionalExtra.description = '';
        return optionalExtra;
    };

    const optionalExtras = () => {
        const optionalExtrasList = [];
        let isNCDSelected = {};
        coverages.forEach((cov) => {
            if (!(brandCode === messages.HP && (cov.name === messages.breakdown || cov.name === messages.motorLegalExpenses))) {
                const optionalExtra = ancillariesDescription(cov);
                optionalExtrasList.push(optionalExtra);
            }
        });
        if (isNCD) { isNCDSelected = ncdDescription(); optionalExtrasList.push(isNCDSelected); }
        return optionalExtrasList;
    };
    const monthlyPayment = {
        value: PAYMENT_TYPE_MONTHLY_CODE,
        content: (
            <div className="important-stuff__payment-content theme-white">
                <div className="important-stuff__payment-header">{messages.payMonthlyHeader}</div>
                <div className="important-stuff__payment-value">
                    <span className="important-stuff__payment-value__prefix">{messages.payMonthlyPrefix}</span>
                    &nbsp;&pound;
                    {monthlyVal.elevenMonth ? getAmountAsTwoDecimalDigit(monthlyVal.elevenMonth) : ''}
                </div>
                <div className="important-stuff__payment-description-bottom">
                    {messages.prePayMonthlyInitalPaymentInfo}
                    &pound;
                    {monthlyVal.initialPayment ? getAmountAsTwoDecimalDigit(monthlyVal.initialPayment) : ''}
                    {messages.postPayMonthlyInitalPaymentInfo}
                </div>
                {((showBreakDown && paymentType === PAYMENT_TYPE_ANNUALLY_CODE) || !showBreakDown) && (
                    <HDLabelRefactor
                        className={classNames(
                            'important-stuff__payment-summary-text',
                            { 'important-stuff__payment-summary-text--white': paymentType === PAYMENT_TYPE_MONTHLY_CODE }
                        )}
                        text={messages.payMonthlySummaryText}
                        onClick={() => setShowBreakDown(!showBreakDown)}
                        Tag="a" />
                )}
            </div>)
    };

    const annuallyPayment = {
        value: PAYMENT_TYPE_ANNUALLY_CODE,
        content: (
            <div className="important-stuff__payment-content theme-white">
                <div className="important-stuff__payment-header">{messages.payAnnuallyHeader}</div>
                <div className="important-stuff__payment-value">
                    &pound;
                    {getAmountAsTwoDecimalDigit(annualVal)}
                </div>
                {(!isMonthlyPaymentAvailable()) && (
                    <div
                        role="button"
                        tabIndex={0}
                        className="important-stuff__payment-explanation-link"
                        onClick={() => setShowMissingMonthlyPaymentsPopup(true)}
                        onKeyDown={() => setShowMissingMonthlyPaymentsPopup(true)}
                    >
                        {messages.missingMonthlyPaymentExplanation}
                    </div>
                )}
                {((showBreakDown && paymentType === PAYMENT_TYPE_MONTHLY_CODE) || !showBreakDown) && (
                    <HDLabelRefactor
                        className={classNames(
                            'important-stuff__payment-summary-text',
                            { 'important-stuff__payment-summary-text--white': paymentType === PAYMENT_TYPE_ANNUALLY_CODE }
                        )}
                        text={messages.paymentSummaryText}
                        onClick={() => setShowBreakDown(!showBreakDown)}
                        Tag="a" />
                )}
            </div>)
    };


    const getPaymentTypes = () => ((isMonthlyPaymentAvailable()) ? [monthlyPayment, annuallyPayment] : [annuallyPayment]);
    const ancillariesAmount = () => {
        let ancillariesAmountValue = 0;
        if (brandCode === messages.HP) {
            hpCoverages.forEach(((cov) => {
                ancillariesAmountValue += cov.amount.amount;
            }));
            ancillariesAmountValue += breakDownAmountForHP;
        } else {
            coverages.forEach((cov) => {
                ancillariesAmountValue += cov.amount.amount;
            });
        }
        return ancillariesAmountValue;
    };

    const handlePaymentTypeChange = (event) => {
        EventEmmiter.dispatch('change', getAmount(event.target.value, annualVal, monthlyVal.elevenMonth));
        onPaymentTypeChange(event.target.value);
        if (coverages.length > 0) {
            setShowBreakDown(true);
        } else {
            setShowBreakDown(false);
        }
    };

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 10, offset: 1 }
    };

    return (
        <div className="important-stuff">
            <Container fluid>
                <Row>
                    <Col xs={12} className="wizard-head important-stuff__head arc-header">
                        <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                        <Row>
                            <Col {...mainColProps}>
                                <Row>
                                    <Col xs={12}>
                                        <BackNavigation
                                            id="backNavMainWizard"
                                            className="mb-0"
                                            onClick={onGoBack}
                                            onKeyPress={onGoBack} />
                                    </Col>
                                </Row>
                                <Row className="margin-top-md">
                                    <Col xs={12}>
                                        <HDLabelRefactor
                                            id="important-stuff-header"
                                            className="text-white"
                                            Tag="h1"
                                            text={messages.importantStuffPageHeader} />
                                        <HDLabelRefactor
                                            id="important-stuff-subheader"
                                            className="text-white mb-0"
                                            Tag="p"
                                            text={messages.importantStuffPageSubHeader} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col {...mainColProps}>
                        <Container className="container--anc important-stuff__payment-info-container">
                            <HDToggleButtonGroup
                                webAnalyticsEvent={{
                                    event_action: `${messages.summary} - ${messages.reviewAndConfirm}`,
                                    event_value: `Switch to ${paymentType === PAYMENT_TYPE_MONTHLY_CODE ? 'annualy' : 'monthly'} payment type`
                                }}
                                id="important-stuff-payment-type-btn-group"
                                className={classNames(
                                    'text-center important-stuff__payment-btns-group',
                                    { 'important-stuff__payment-btns-group--only-annual': !isMonthlyPaymentAvailable() }
                                )}
                                availableValues={getPaymentTypes()}
                                value={isMonthlyPaymentAvailable() ? paymentType : '1'}
                                onChange={handlePaymentTypeChange}
                                btnGroupClassName={`grid ${isMonthlyPaymentAvailable() && 'grid--col-2 gap-tiny'}`} />
                            {showBreakDown && isMonthlyPaymentAvailable() && paymentType === PAYMENT_TYPE_MONTHLY_CODE && (
                                <div className="important-stuff__payments-description important-stuff__payments-description--monthly">
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.costOfCover}</div>
                                        <div>
                                            &pound;
                                            {(monthlyVal.creditCharge - ancillariesAmount()).toLocaleString('en',
                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    {brandCode !== messages.HP && coverages.map((cov) => (
                                        <div className="important-stuff__payments-description__line capitalized-first-letter">
                                            <div>{cov.name}</div>
                                            <div>
                                                &pound;
                                                {getAmountAsTwoDecimalDigit(cov.amount.amount)}
                                            </div>
                                        </div>
                                    ))}
                                    {brandCode === messages.HP
                                        && (
                                            <div className="important-stuff__payments-description__hp">
                                                <div className="important-stuff__payments-description__line">
                                                    <div>{messages.motorLegal}</div>
                                                    <div>
                                                        {messages.included}
                                                    </div>
                                                </div>
                                                <div className="important-stuff__payments-description__line">
                                                    <div>{messages.breakdown}</div>
                                                    <div>
                                                        {breakDownAmountForHP === 0 ? messages.included : `£${breakDownAmountForHP.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {brandCode === messages.HP
                                        && hpCoverages.map((cov) => (
                                            <div className="important-stuff__payments-description__line hp-coverage capitalized-first-letter">
                                                <div>{cov.name}</div>
                                                <div>
                                                    &pound;
                                                    {getAmountAsTwoDecimalDigit(cov.amount.amount)}
                                                </div>
                                            </div>
                                        ))}

                                    {isNCD && (
                                        <div className="important-stuff__payments-description__line">
                                            <div>{messages.protectedNoClaims}</div>
                                            <div>
                                                {messages.included}
                                            </div>
                                        </div>
                                    )}
                                    <hr className="important-stuff__hr" />
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.totalCost}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(monthlyVal.creditCharge)}
                                        </div>
                                    </div>
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.totalCredit}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(monthlyVal.amountPayable - monthlyVal.creditCharge)}
                                        </div>
                                    </div>
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.totalAmountPayableLabel}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(monthlyVal.amountPayable)}
                                        </div>
                                    </div>
                                    <div className="important-stuff__payments-description__line important-stuff__payments-description__line--commented">
                                        {messages.ratesComment.replace(APR_RATE, monthlyVal.APR).replace(INTEREST_RATE, monthlyVal.interestRate)}
                                    </div>
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.initialPaymentLabel}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(monthlyVal.initialPayment)}
                                        </div>
                                    </div>
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.elevenMonthlyPayment}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(monthlyVal.elevenMonth)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showBreakDown && (paymentType === PAYMENT_TYPE_ANNUALLY_CODE || !isMonthlyPaymentAvailable()) && (
                                <div
                                    className={classNames(
                                        'important-stuff__payments-description',
                                        { 'important-stuff__payments-description--annual': isMonthlyPaymentAvailable() }
                                    )}
                                >
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.costOfCover}</div>
                                        <div>
                                            &pound;
                                            {(annualVal - ancillariesAmount()).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    {brandCode !== messages.HP && coverages.map((cov) => (
                                        <div className="important-stuff__payments-description__line capitalized-first-letter">
                                            <div>{cov.name}</div>
                                            <div>
                                                &pound;
                                                {getAmountAsTwoDecimalDigit(cov.amount.amount)}
                                            </div>
                                        </div>
                                    ))}
                                    {brandCode === messages.HP
                                        && (
                                            <div className="important-stuff__payments-description__hp">
                                                <div className="important-stuff__payments-description__line">
                                                    <div>{messages.motorLegal}</div>
                                                    <div>
                                                        {messages.included}
                                                    </div>
                                                </div>
                                                <div className="important-stuff__payments-description__line">
                                                    <div>{messages.breakdown}</div>
                                                    <div>
                                                        {breakDownAmountForHP === 0 ? messages.included : `£${breakDownAmountForHP.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {brandCode === messages.HP
                                        && hpCoverages.map((cov) => (
                                            <div className="important-stuff__payments-description__line hp-coverage capitalized-first-letter">
                                                <div>{cov.name}</div>
                                                <div>
                                                    &pound;
                                                    {getAmountAsTwoDecimalDigit(cov.amount.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    {isNCD && (
                                        <div className="important-stuff__payments-description__line">
                                            <div>{messages.protectedNoClaims}</div>
                                            <div>
                                                {messages.included}
                                            </div>
                                        </div>
                                    )}
                                    <hr className="important-stuff__hr" />
                                    <div className="important-stuff__payments-description__line">
                                        <div>{messages.totalCost}</div>
                                        <div>
                                            &pound;
                                            {getAmountAsTwoDecimalDigit(annualVal)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <HDQuoteInfoRefactor className="text-small">
                                <span>{messages.priceInfoDescription}</span>
                            </HDQuoteInfoRefactor>
                            {paymentType === PAYMENT_TYPE_MONTHLY_CODE && (
                                <Row>
                                    <Col>
                                        <HDQuoteInfoWarning className="customize-quote-summary__quote-notice__quote-info text-small">
                                            <span>
                                                {messages.warningInfo}
                                            </span>
                                        </HDQuoteInfoWarning>
                                    </Col>
                                </Row>
                            )}
                        </Container>
                        <HDCoverSummary coverType={coverType} brandCode={brandCode} brand={brand.value} isOnlineProductType={isOnlineProductType} />
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.driverDetailsHeader}
                            id="important-stuff-driver-details-header"
                            className="mb-2 mb-md-3 important-stuff__driver-details-header" />
                        <p className="mb-0 important-stuff__driver-details-info">{messages.driverDetailsMessage}</p>
                        <Row>
                            <Col className="important-stuff__drivers-col px-mobile-0">
                                {driversListDisplay.map((driverEntry) => (
                                    <HDPlaceholderWithHeader
                                        icon={driverAddedIcon()}
                                        title={(driverEntry.isPolicyHolder) ? (
                                            <span>
                                                {driverEntry.displayName}
                                                <i className="no-intalics"> (Policyholder)</i>
                                            </span>
                                        ) : <span>{driverEntry.displayName}</span>
                                        }
                                        className="important-stuff__place-holder-with-header margin-top-lg"
                                    >
                                        <HDDriverDetails driver={driverEntry} />
                                    </HDPlaceholderWithHeader>
                                ))}
                            </Col>
                        </Row>
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.carDetailsHeader}
                            id="important-stuff-car-details-header"
                            className="mb-0 important-stuff__car-details-header" />
                        <Row>
                            <Col className="px-mobile-0">
                                <HDPlaceholderWithHeader title={tableTitle} className="margin-top-lg">
                                    <HDPolicyHolderDetails policyHolder={policyHolder} />
                                    <HDQuotePolicyDetails
                                        policyType={coverType}
                                        brand={brandCode}
                                        isOnlineProductType={isOnlineProductType}
                                        customizeSubmissionVM={customizeSubmissionVM}
                                        policyDetailsItems={policyDetailsItems}
                                        optionalExtras={optionalExtras()} />
                                    <HDYourExcessFees
                                        pageMetadata={pageMetadata}
                                        branchCode={brandCode}
                                        accidentalDamage={accidentalDamageList()}
                                        theftDamage={theftDamageList()}
                                        driverList={driversListDisplay}
                                        windScreenDamage={windScreenDamageList()}
                                        periodStartDate={periodStartDate}
                                        pcCurrentDate={pcCurrentDate} />
                                </HDPlaceholderWithHeader>
                            </Col>
                        </Row>
                        <Row className="my-5">
                            <Col className="px-mobile-0">
                                <HDIpidDocumentPage />
                            </Col>
                        </Row>
                        <Amendments endorsements={vehicleDetails.endorsements} brand={brandCode} />
                        <Row className="my-5">
                            <Col className="px-mobile-0">
                                <HDOurFees pageMetadata={pageMetadata} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="px-mobile-0">
                                <HDOtherThings pageMetadata={pageMetadata} isOnlineProductType={isOnlineProductType} />
                            </Col>
                        </Row>
                        <HDQuoteInfoRefactor className="my-4 my-md-5">
                            <span>{messages.agreeterms}</span>
                        </HDQuoteInfoRefactor>
                    </Col>
                </Row>
            </Container>
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: messages.missingMonthlyPaymentsModalHeader }}
                webAnalyticsEvent={{ event_action: messages.missingMonthlyPaymentsModalHeader }}
                id="paying-by-directdebit-modal"
                show={showMissingMonthlyPaymentsPopup}
                headerText={messages.missingMonthlyPaymentsModalHeader}
                confirmLabel={messages.missingMonthlyPaymentsModalConfirmLabel}
                onConfirm={() => setShowMissingMonthlyPaymentsPopup(false)}
                hideCancelButton
                hideClose
            >
                {messages.missingMonthlyPaymentsModalContent.map((paragraph, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={i} className="my-3">
                        {paragraph}
                    </p>
                ))}
            </HDModal>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        wizardPagesState: state.wizardState.app.pages,
        ipidMatchForAllData: state.ipidMatchForAllModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    getIpidMatchForAll
});

HDImportantStuffPage.propTypes = {
    toggleContinueElement: PropTypes.func,
    submissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    paymentType: PropTypes.string.isRequired,
    onPaymentTypeChange: PropTypes.func.isRequired,
    onGoBack: PropTypes.func,
    wizardPagesState: PropTypes.shape({
        drivers: PropTypes.shape({}),
    }).isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.shape({}),
    ipidMatchForAllData: PropTypes.shape({})
};

HDImportantStuffPage.defaultProps = {
    toggleContinueElement: () => {
    },
    onGoBack: () => { },
    dispatch: null,
    ipidMatchForAllData: null
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDImportantStuffPage));
