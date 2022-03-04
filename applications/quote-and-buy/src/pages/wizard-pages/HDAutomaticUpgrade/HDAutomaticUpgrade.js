/* eslint-disable react/jsx-equals-spacing */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import {
    HDInfoCardRefactor, HDLabelRefactor, HDTable
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton
} from '../../../web-analytics';
import { HASTINGS_PREMIER, MOTOR_LEGAL_DEFAULTVALUE } from '../../../constant/const';
import EventEmmiter from '../../../EventHandler/event';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import * as messages from './HDAutomaticUpgradeMessages';
import * as helpers from './HDAutomaticUpgradeHelper';
import {
    setNavigation, setNavigation as setNavigationAction, updateQuoteCoverages
} from '../../../redux-thunk/actions';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import hdLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import hpLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import {
    getAmount
} from '../../../common/utils';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import getYoungAndInexperiencedExcess from '../../../common/getYoungAndInexperiencedExcess';


const HDAutomaticUpgrade = (props) => {
    const {
        submissionVM,
        dispatch,
        customizeSubmissionVM,
        onGoBack,
    } = props;
    const [policyHolderFirstName, setPolicyHolderFirstName] = useState('');
    const [coverDifference, setCoverdifference] = useState(0);
    const [, setPremiumObject] = useState({});
    const [tableValuesArray, setTableValues] = useState([]);
    const [apiTriggerPoint, setAPITriggerPoint] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const firstName = _.get(submissionVM, 'value.baseData.accountHolder.firstName');
    const preUpgradeObject = useSelector((state) => state.wizardState.app.autoUpgradeData);
    const preUpgadeBrand = useSelector((state) => state.wizardState.app.autoUpgradeData.quoteBeforeUpdate.branchCode);
    const vehCoveragesPath = 'coverages.privateCar.vehicleCoverages';
    const offeringsPath = 'lobData.privateCar.offerings.value';
    const coverTypeFieldName = 'coverType';
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const coverTypePath = `${vehiclePath}.${coverTypeFieldName}`;
    const coverTypeCode = _.get(submissionVM, `${coverTypePath}.value.code`);
    const displayAmount = (value) => `£${value}`;
    const formatDisplayAmount = (value) => `£${getAmountAsTwoDecimalDigit(value)}`;
    const [isBack, setGoBack] = useState(false);
    const updateQuoteCoverage = useSelector((state) => (state.updateQuoteCoveragesModel));
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(submissionVM, driverPath));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];
    const insurancePaymentTypeValue = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    const [policySelected, setPolicySelected] = useState(true);

    const modifyPremiumObjForVM = (obj) => {
        let hastingsPremiumObj = {};
        if (obj && obj.offeredQuote) {
            hastingsPremiumObj = {
                ...obj.offeredQuote,
                ...obj
            };
            delete hastingsPremiumObj.offeredQuote;
        }

        setPremiumObject(hastingsPremiumObj);
        return hastingsPremiumObj;
    };

    const getTotalCompulsoryExcess = (coverages) => {
        const productType = _.get(customizeSubmissionVM, 'value.quote.productType');
        const { accidentalDamageCompulsaryKey, onlineAccDmgExcessKey } = messages;
        const productofferedID = (productType === 'online') ? onlineAccDmgExcessKey : accidentalDamageCompulsaryKey;

        const accidentalDamageCov = coverages.find((cov) => cov.publicID === messages.acctidentalDamageCovKey);

        const accidentalCompulsoryExcess = (accidentalDamageCov)
            ? accidentalDamageCov.terms.filter((amt) => amt.publicID === productofferedID) : 0;

        const dv = _.has(accidentalCompulsoryExcess[0], 'directValue') ? accidentalCompulsoryExcess[0].directValue : 0;
        const cmpYAndIAccDamage = getYoungAndInexperiencedExcess(driversList);

        let compulsoryExcess = dv + cmpYAndIAccDamage;

        if (coverTypeCode === messages.tpft) {
            const theftDamage = coverages ? coverages.filter((cover) => cover.publicID === messages.fireAndTheft) : '';
            const theftVehicleDamageList = theftDamage[0].terms.filter((amt) => amt.publicID === productofferedID);
            compulsoryExcess = _.has(theftVehicleDamageList[0], 'directValue') ? theftVehicleDamageList[0].directValue : 0;
        }
        return compulsoryExcess;
    };

    const getCompulsoryExcesses = () => {
        const offerings = _.get(customizeSubmissionVM, 'value.otherQuotes') || [];
        return offerings.map((offering) => {
            const { coverages } = offering.coverages.privateCar.vehicleCoverages[0];
            const compulsoryExcess = getTotalCompulsoryExcess(coverages);
            return {
                branchCode: offering.branchCode,
                compulsoryExcess
            };
        });
    };

    const getHPCompulsoryExcesses = () => {
        const selectedCoverages = _.get(customizeSubmissionVM, 'value.coverages.privateCar.vehicleCoverages[0].coverages') || [];
        const compulsoryExcess = getTotalCompulsoryExcess(selectedCoverages);
        return {
            branchCode: 'HP',
            compulsoryExcess
        };
    };

    const getDisplayObject = () => {
        let breakDownVal;
        // Checked with Andy adding as part of DE352110 and DE360071
        const motorLegalVal = MOTOR_LEGAL_DEFAULTVALUE; // discounted value in response must not be shown.
        const tableDataArray = [];
        const annualAmount = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount');
        const elevenMonthAmount = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount');
        const monthlyPaymentAmount = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount');
        const firstMonth = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.firstInstalment.amount');
        setPolicyHolderFirstName(firstName);
        const voluntaryExcess = _.get(customizeSubmissionVM, 'voluntaryExcess.value.code');
        const HPObject = customizeSubmissionVM
            && customizeSubmissionVM.value.otherOfferedQuotes
            // eslint-disable-next-line no-mixed-operators
            && customizeSubmissionVM.value.otherOfferedQuotes.filter((data) => data.branchCode === preUpgadeBrand) || [];
        // const HPMonthlyObject = HPObject && HPObject[0] && HPObject[0].hastingsPremium.monthlyPayment || {};
        const HPMonthlyObject = preUpgradeObject.quoteBeforeUpdate.hastingsPremium.monthlyPayment;
        tableDataArray.push(
            {
                rowLabel: messages.payAnnually,
                highlighted: true,
                cells: [
                    { value: formatDisplayAmount(preUpgradeObject.quoteBeforeUpdate.hastingsPremium.annuallyPayment.premiumAnnualCost.amount) },
                    { value: formatDisplayAmount(annualAmount) }]
            }
        );
        const { compulsoryExcess: hpCompulsoryExcess } = getHPCompulsoryExcesses();
        const { compulsoryExcess: preUpgadeCompulsoryExcess } = getCompulsoryExcesses().find((excess) => excess.branchCode === preUpgadeBrand);

        if (elevenMonthAmount && monthlyPaymentAmount && firstMonth && HPMonthlyObject) {
            tableDataArray.push({
                rowLabel: messages.payMonthly,
                cells: [
                    {
                        value: (
                            <>
                                <div>
                                    {formatDisplayAmount(HPMonthlyObject.premiumAnnualCost.amount)}
                                </div>
                                <div className="mt-1">
                                    <span className="font-regular text-small text-md-md">11 x </span>
                                    {formatDisplayAmount(HPMonthlyObject.elevenMonthsInstalments.amount)}
                                </div>
                                <div className="font-regular text-small text-md-md">
                                    (
                                    {formatDisplayAmount(HPMonthlyObject.firstInstalment.amount)}
                                    &nbsp;today)
                                </div>
                            </>
                        )
                    },
                    {
                        value: (
                            <>
                                <div>
                                    {formatDisplayAmount(monthlyPaymentAmount)}
                                </div>
                                <div className="mt-1">
                                    <span className="font-regular text-small text-md-md">11 x </span>
                                    {formatDisplayAmount(elevenMonthAmount)}
                                </div>
                                <div className="font-regular text-small text-md-md">
                                    (
                                    {formatDisplayAmount(firstMonth)}
                                    &nbsp;today)
                                </div>
                            </>
                        )
                    }]
            });
        }
        if (voluntaryExcess) {
            tableDataArray.push(
                {
                    rowLabel: messages.totalExcess,
                    cells: [
                        { value: displayAmount(preUpgadeCompulsoryExcess + +voluntaryExcess) },
                        { value: displayAmount(hpCompulsoryExcess + +voluntaryExcess) }
                    ]
                }
            );
        }
        if (customizeSubmissionVM
            && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.forEach((data) => {
                const coverages = [];
                data.coverages.forEach((nestedData) => {
                    if (nestedData.publicID === 'ANCMotorLegalExpensesCov_Ext') {
                        coverages.unshift({ rowLabel: messages.motorLegal, cells: [{ value: displayAmount(motorLegalVal) }, { value: true }] });
                    }
                    if (nestedData.publicID === 'ANCBreakdownCov_Ext') {
                        const termsOptions = nestedData.terms && nestedData.terms[0] && nestedData.terms[0].options;
                        const basictermOption = termsOptions.filter((termsOtion) => (termsOtion && termsOtion.name === 'Roadside'));
                        if (basictermOption && basictermOption[0].amount) {
                            breakDownVal = basictermOption[0].amount.amount;
                        } else {
                            breakDownVal = nestedData.amount.amount;
                        }
                        coverages.unshift(
                            { rowLabel: messages.roadSide, cells: [{ value: `${messages.from}${messages.poundSign}${breakDownVal}` }, { value: true }] }
                        );
                    }
                });
                tableDataArray.push(...coverages);
            });
        }
        setTableValues(tableDataArray);
        modifyPremiumObjForVM(HPObject[0]);
        const prevAmount = preUpgradeObject.quoteBeforeUpdate.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
        setCoverdifference((prevAmount - annualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };
    useEffect(() => {
        props.toggleContinueElement(false); // pass false to explicitly make parent continue button invisible
    }, [props]);

    const monthlyPaymentObjectPath = 'value.quote.hastingsPremium.monthlyPayment';
    const annualAmountPath = 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount';
    const monthlyAmountPath = 'quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount';
    const updateMonthlyAnnualPrice = () => {
        const updatedAnnualAmount = _.get(customizeSubmissionVM, `${annualAmountPath}.value`);
        const updatedMonthlyAmount = _.get(customizeSubmissionVM, `${monthlyAmountPath}.value`);
        const isMonthlyPaymentAvailable = _.get(customizeSubmissionVM, monthlyPaymentObjectPath, false);
        const paymentType = (isMonthlyPaymentAvailable && insurancePaymentTypeValue === messages.PAYMENT_TYPE_MONTHLY_CODE)
            ? messages.PAYMENT_TYPE_MONTHLY_CODE : messages.PAYMENT_TYPE_ANNUALLY_CODE;
        EventEmmiter.dispatch('change', getAmount(paymentType, updatedAnnualAmount, updatedMonthlyAmount));
    };

    useEffect(() => {
        if (customizeSubmissionVM
            && updateQuoteCoverage
            && (_.get(updateQuoteCoverage, 'quoteCoveragesObj')
                && Object.keys(updateQuoteCoverage.quoteCoveragesObj).length > 0) && apiTriggerPoint) {
            _.set(customizeSubmissionVM, 'value', updateQuoteCoverage.quoteCoveragesObj);
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', updateQuoteCoverage.quoteCoveragesObj.otherQuotes);
            _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount', updateQuoteCoverage.quoteCoveragesObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);
            _.set(submissionVM, 'value.lobData.privateCar.coverables', updateQuoteCoverage.quoteCoveragesObj.coverables);
            if (updateQuoteCoverage.quoteCoveragesObj.quote) {
                _.set(submissionVM, 'value.baseData.brandCode', (updateQuoteCoverage.quoteCoveragesObj.quote.branchCode));
            }
            if (isBack) {
                dispatch(setNavigation({ autoUpgradeData: null }));
                hideLoader();
                onGoBack();
            } else {
                getDisplayObject();
                // props.navigate(true);
                updateMonthlyAnnualPrice();
                hideLoader();
            }
        }
    }, [updateQuoteCoverage]);
    const isUpgradable = () => {
        const currentBrand = _.get(customizeSubmissionVM, 'value.quote.branchCode');
        return (currentBrand === 'HE' || currentBrand === 'HD');
    };

    const updateAncillaries = (ancillaryCoverages) => {
        const ANCBREAKDOWNCOV_EXT = 'ANCBreakdownCov_Ext';
        ancillaryCoverages.map((data, index1) => {
            if (data && data.coverages) {
                data.coverages.map((nestedData, index2) => {
                    const covaragePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2];
                    const selectedValue = _.get(covaragePath, 'selected');
                    _.set(covaragePath, 'updated', selectedValue);
                    if (nestedData && nestedData.publicID === ANCBREAKDOWNCOV_EXT && selectedValue && nestedData.terms && nestedData.terms.length > 0) {
                        const setValuePath = customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages[index1].coverages[index2].terms[0];
                        _.set(setValuePath, 'updated', selectedValue);
                    }
                });
            }
        });
    };
    const continueAction = () => {
        if (isUpgradable()) {
            showLoader();
            setAPITriggerPoint(true);
            let HPObject = (customizeSubmissionVM && customizeSubmissionVM.value.otherOfferedQuotes
                && customizeSubmissionVM.value.otherOfferedQuotes.filter((data) => data.branchCode === messages.premier)) || [];

            HPObject = HPObject.length && (HPObject[0].offeredQuote) ? HPObject : (customizeSubmissionVM && customizeSubmissionVM.value
                && customizeSubmissionVM.value.otherOfferedDataForUpgrade.filter((data) => data.branchCode === messages.premier));

            modifyPremiumObjForVM(HPObject[0]);
            _.set(customizeSubmissionVM.value, 'quote', modifyPremiumObjForVM(HPObject[0]));
            const otherOfferedData = [];
            submissionVM.value.quoteData.offeredQuotes.forEach((data) => {
                if (messages.premier !== data.branchCode) {
                    otherOfferedData.push(data);
                }
            });
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', otherOfferedData);
            const ancillaryCoverages = _.get(customizeSubmissionVM, 'value.coverages.privateCar.ancillaryCoverages');
            if (ancillaryCoverages && ancillaryCoverages.length > 0) {
                updateAncillaries(ancillaryCoverages);
            }
            dispatch(updateQuoteCoverages(customizeSubmissionVM));
        } else {
            getDisplayObject();
        }
    };

    useEffect(() => {
        continueAction();
        setPolicySelected(_.get(submissionVM, 'value.isOnlineProductType'));
    }, []);

    const getCoveragesArray = () => {
        let coveragesArray = coverTypeCode === 'tpft' ? helpers.coveragesArrayTPFT : helpers.coveragesArray;
        const vehCoverages = _.get(customizeSubmissionVM, `${vehCoveragesPath}.value`);
        let isDrivingOtherCarsSelected = false;
        if (vehCoverages && vehCoverages[0]) {
            isDrivingOtherCarsSelected = vehCoverages[0].coverages.find((vehicleCov) => vehicleCov.name === 'Driving Other Cars').selected;
        }
        if (!isDrivingOtherCarsSelected) {
            coveragesArray = coveragesArray.filter((coverage) => coverage.name !== messages.otherCar);
        }
        return coveragesArray.map(({ name, values }) => ({ rowLabel: name, cells: values.map((value) => ({ value })) }));
    };

    const handleBack = () => {
        setGoBack(true);
        setAPITriggerPoint(true);
        if (preUpgadeBrand) {
            const HPObject = (customizeSubmissionVM && customizeSubmissionVM.value.otherOfferedQuotes
                && customizeSubmissionVM.value.otherOfferedQuotes.filter((data) => data.branchCode === preUpgadeBrand)) || [];
            _.set(customizeSubmissionVM.value, 'quote', modifyPremiumObjForVM(HPObject[0]));
            const otherOfferedData = [];
            submissionVM.value.quoteData.offeredQuotes.forEach((data) => {
                if (preUpgadeBrand !== data.branchCode) {
                    otherOfferedData.push(data);
                }
            });
            _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', otherOfferedData);
            const ancillaryCoverages = _.get(customizeSubmissionVM, 'value.coverages.privateCar.ancillaryCoverages');
            if (ancillaryCoverages && ancillaryCoverages.length > 0) {
                updateAncillaries(ancillaryCoverages);
            }
            dispatch(updateQuoteCoverages(customizeSubmissionVM));
            showLoader();
        }
    };

    return (
        <Container fluid className="mb-md-5">
            <Row className="wizard-head automatic-upgrade__head">
                <Col xs={12}>
                    <BackNavigation
                        id="backNavMainWizard"
                        onClick={handleBack}
                        onKeyPress={handleBack}
                        className="align-self-start mb-0 ml-md-5" />
                    <Row>
                        <Col xs={12} md={{ span: 8, offset: 2 }} className="text-md-center">
                            <div className="automatic-upgrade-container">
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.greatNews.replace('FIRST_NAME', policyHolderFirstName)}
                                    id="automatic-upgrade-first-name-header"
                                    className="automatic-upgrade__first-name-header" />
                                <HDLabelRefactor
                                    Tag="span"
                                    text={messages.coverUpgrade.replace('COVER_DIFFERENCE', coverDifference)}
                                    id="automatic-upgrade-upgrade-header"
                                    className="automatic-upgrade__upgrade-header" />
                                <HDInfoCardRefactor
                                    image={exclamationIcon}
                                    paragraphs={[messages.autoUpgradeText]}
                                    size="thin"
                                    id="automatic-upgrade-options-info-card"
                                    className="mb-5 margin-top-xl" />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} className="px-mobile-0">
                    <div className="automatic-upgrade-container">
                        <HDTable
                            onlineProduct={policySelected}
                            id="cover-type-table"
                            className="automatic-upgrade__compare-table"
                            data={[...tableValuesArray, ...getCoveragesArray()]}
                            headerValues={[{
                                image: hdLogo,
                            }, {
                                image: hpLogo,
                                secondaryLabel: messages.newPolicy
                            }]}
                            defaultIndex={1} />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                        id="continue-button"
                        variant="primary"
                        onClick={() => props.navigate(true)}
                        label={messages.continueButtonText}
                        className="theme-white margin-top-lg w-100 btn-sm btn-continue-lg-lg mx-auto" />
                </Col>
            </Row>
            {HDFullscreenLoader}
        </Container>
    );
};

HDAutomaticUpgrade.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object, value: PropTypes.object }).isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    dispatch: PropTypes.func.isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    toggleContinueElement: PropTypes.func,
    navigate: PropTypes.func,
    onGoBack: PropTypes.func,
    customQuoteData: PropTypes.shape({ loading: PropTypes.bool, customUpdatedQuoteObj: PropTypes.object }),
};

HDAutomaticUpgrade.defaultProps = {
    customizeSubmissionVM: null,
    toggleContinueElement: () => {
    },
    navigate: () => { },
    onGoBack: () => { },
    customQuoteData: null,
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    offeredQuoteObject: state.offeredQuoteModel,
    customQuoteData: state.customQuoteModel
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    setNavigation: setNavigationAction,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDAutomaticUpgrade));
