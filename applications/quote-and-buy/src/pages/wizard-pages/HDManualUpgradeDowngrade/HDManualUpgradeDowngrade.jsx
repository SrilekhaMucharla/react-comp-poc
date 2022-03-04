import {
    HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import arcTop from '../../../assets/images/background/top-arc.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import hdLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import heLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential.svg';
import hpLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import getYoungAndInexperiencedExcess from '../../../common/getYoungAndInexperiencedExcess';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import {
    GREY_LIST_ERROR_CODE, HASTINGS_DIRECT,
    HASTINGS_ESSENTIAL,
    HASTINGS_PREMIER,
    UW_ERROR_CODE,
    CUE_ERROR_CODE,
    PAYMENT_TYPE_MONTHLY_CODE,
    PAYMENT_TYPE_ANNUALLY_CODE
} from '../../../constant/const';
import { CUSTOMISE_QUOTE, UPGRADE } from '../../../customer/directintegrations/faq/epticaMapping';
import { updateEpticaId as updateEpticaIdAction } from '../../../redux-thunk/actions';
import {
    AnalyticsHDTable as HDTable
} from '../../../web-analytics';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import * as messages from './HDManualUpgradeDowngrade.messages';
import EventEmmiter from '../../../EventHandler/event';
import { getAmount } from '../../../common/utils';
import { trackEvent } from '../../../web-analytics/trackData';

// import './HDManualUpgradeDowngrade.scss';

const AMOUNT_VALUE = 'AMOUNT';
const TPFT = 'tpft';
const NO_TPFT_COVERAGES = [
    messages.windscreenCoverId,
    messages.vandalismPromiseCovId,
    messages.uninsuredDriverPromiseCovId,
    messages.personalBelongingsCoverId
];

export const HDManualUpgradeDowngrade = ({
    submissionVM,
    customizeSubmissionVM,
    isUpgrade,
    isMonthlyPaymentAvailable,
    paymentType,
    updateEpticaId,
    onGoBack,
    onUpgrade,
    onDowngrade,
    onUpgradeDowngradeCancellation,
    label
}) => {
    const offeredQuotesPath = 'quoteData.offeredQuotes.value';
    const offeringsPath = 'lobData.privateCar.offerings.value';
    const vehCoveragesPath = 'coverages.privateCar.vehicleCoverages';
    const otherOffferedQuotesPath = 'value.otherOfferedQuotes';
    const coverTypeFieldName = 'coverType';
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const coverTypePath = `${vehiclePath}.${coverTypeFieldName}`;
    const quotePath = 'value.quote';
    const currentBrand = _.get(customizeSubmissionVM, 'quote.branchCode.value');
    const voluntaryExcess = _.get(customizeSubmissionVM, 'voluntaryExcess.value.code');
    const coverTypeCode = _.get(submissionVM, `${coverTypePath}.value.code`);
    const brandOrder = [HASTINGS_ESSENTIAL, HASTINGS_DIRECT, HASTINGS_PREMIER];
    const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE];
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(submissionVM, driverPath));
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];

    const [selectedBrand, setSelectedBrand] = useState(currentBrand);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [title, setTitle] = useState(null);
    const [savingsHeader, setSavingsHeader] = useState(null);
    const [explanationHeader, setExplanationHeader] = useState(null);
    const [coverages, setCoverages] = useState({});
    const [vehicleExcessCoverages, setVehicleExcessCoverages] = useState({});
    const [isOnlineProduct, setIsOnlineProduct] = useState(false);
    const [annualAmount, setAnnualAmount] = useState(0);
    const [monthlyAmount, setMonthlyAmount] = useState(0);


    // eslint-disable-next-line no-unused-vars
    const setAnnualMonthlyAmount = () => {
        const { premiumAnnualCost, elevenMonthsInstalments } = messages;
        const custSubVM = _.cloneDeep(_.concat(
            _.get(customizeSubmissionVM, otherOffferedQuotesPath) || [],
            _.get(customizeSubmissionVM, quotePath)
        ));

        if (_.isArray(custSubVM) && _.size(custSubVM) > 0) {
            const hastingPrem = custSubVM.filter(({ branchCode }) => branchCode === selectedBrand)
                .map(({ hastingsPremium, offeredQuote }) => ((
                    offeredQuote && _.size(offeredQuote) > 0) ? _.get(offeredQuote, 'hastingsPremium') : hastingsPremium
                )).shift();

            if (_.has(hastingPrem, premiumAnnualCost)) {
                setAnnualAmount(_.get(hastingPrem, premiumAnnualCost, 0));
            }

            if (_.has(hastingPrem, elevenMonthsInstalments)) {
                setMonthlyAmount(_.get(hastingPrem, elevenMonthsInstalments, 0));
            }
        }
    };

    /**
    * Update amount on the top right
    * header corner on changing brand
    */
    // eslint-disable-next-line no-unused-vars
    const updateAmountHeader = () => {
        const isInsurancePaymentType = _.get(customizeSubmissionVM, 'value.insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
        const getPaymentType = (isMonthlyPaymentAvailable && isInsurancePaymentType === PAYMENT_TYPE_MONTHLY_CODE)
            ? PAYMENT_TYPE_MONTHLY_CODE : PAYMENT_TYPE_ANNUALLY_CODE;
        EventEmmiter.dispatch('change', getAmount(getPaymentType, annualAmount, monthlyAmount));
    };

    /**
    * On Policy selected
    * i.e either Online to Standard or
    * Vice versa
    */

    useEffect(() => {
        let offeredQuotes;
        const otherOfferedQuotes = _.get(customizeSubmissionVM, otherOffferedQuotesPath);
        const selectedPolicy = _.get(submissionVM, 'value.isOnlineProductType');
        if (_.isArray(otherOfferedQuotes) && otherOfferedQuotes[0].offeredQuote) {
            const selectedQuote = _.get(customizeSubmissionVM, quotePath);
            offeredQuotes = [...otherOfferedQuotes.map((q) => q.offeredQuote), (selectedQuote.offeredQuote || selectedQuote)];
        } else {
            offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        }
        offeredQuotes = offeredQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1))));
        const offeredBrands = offeredQuotes.map(({ branchCode }) => branchCode);
        let brands = [];

        const getPremiumForBrand = (brand) => {
            const offeredQuote = offeredQuotes.find(({ branchCode }) => branchCode === brand);
            if (!offeredQuote) {
                return 0;
            }

            if (isMonthlyPaymentAvailable && paymentType === PAYMENT_TYPE_MONTHLY_CODE) {
                return _.get(offeredQuote, 'hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            }

            return _.get(offeredQuote, 'hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
        };

        const getUpgradeAmount = (newBrand) => (getPremiumForBrand(newBrand) - getPremiumForBrand(currentBrand)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');

        const getUpgradeLabel = (newBrand) => {
            const upgradeAmount = getUpgradeAmount(newBrand);
            return (upgradeAmount > 0) ? messages.upgradeForExtraLabel.replace(AMOUNT_VALUE, upgradeAmount)
                : messages.upgradeAndSaveLabel.replace(AMOUNT_VALUE, -upgradeAmount);
        };

        const getExtrasCoveragesCostForBrand = (brand) => {
            const offerings = _.get(submissionVM, offeringsPath) || [];
            const offeringForBrand = offerings.find((offering) => offering.branchCode === brand);
            if (!offeringForBrand) {
                return 0;
            }
            const ancillaryCoverages = offeringForBrand.coverages.ancillaryCoverages[0].coverages;
            const extrasCoverages = ancillaryCoverages.filter(({ publicID, selected }) => [messages.motorLegalCovId, messages.racBreakdownCovId]
                .includes(publicID) && !selected);
            return extrasCoverages.reduce((total, current) => total + current.amount.amount, 0);
        };

        document.body.classList.remove('hd-modal-open');
        updateEpticaId(UPGRADE);
        if (currentBrand === HASTINGS_ESSENTIAL && isUpgrade) {
            brands = [
                { value: HASTINGS_ESSENTIAL, image: heLogo },
                { value: HASTINGS_DIRECT, stickyHeaderText: getUpgradeLabel(HASTINGS_DIRECT), image: hdLogo },
                { value: HASTINGS_PREMIER, image: hpLogo }
            ];
            setIsOnlineProduct(selectedPolicy);
            setTitle(messages.upgradeToHDTitle);
        }
        if (currentBrand === HASTINGS_DIRECT && isUpgrade) {
            brands = [
                { value: HASTINGS_DIRECT, image: hdLogo },
                { value: HASTINGS_PREMIER, stickyHeaderText: getUpgradeLabel(HASTINGS_PREMIER), image: hpLogo }
            ];
            const savingsAmount = (getPremiumForBrand(currentBrand) + getExtrasCoveragesCostForBrand(currentBrand) - getPremiumForBrand(HASTINGS_PREMIER))
                .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setTitle(messages.upgradeToHPTitle);
            setIsOnlineProduct(selectedPolicy);
            if (savingsAmount > 0 && getUpgradeAmount(HASTINGS_PREMIER) > 0) {
                setSavingsHeader(messages.savingsHeader.replace(AMOUNT_VALUE, savingsAmount));
                setExplanationHeader(messages.explanationHeader);
            }
        }
        if (currentBrand === HASTINGS_DIRECT && !isUpgrade) {
            brands = [
                { value: HASTINGS_ESSENTIAL, image: heLogo },
                { value: HASTINGS_DIRECT, image: hdLogo },
                {
                    value: HASTINGS_PREMIER,
                    stickyHeaderText: getUpgradeLabel(HASTINGS_PREMIER),
                    image: hpLogo,
                }
            ];
            setTitle(messages.downgradeTitle);
            setIsOnlineProduct(selectedPolicy);
        }
        if (currentBrand === HASTINGS_PREMIER && !isUpgrade) {
            brands = [
                { value: HASTINGS_ESSENTIAL, image: heLogo },
                { value: HASTINGS_DIRECT, image: hdLogo },
                { value: HASTINGS_PREMIER, image: hpLogo }
            ];
            setTitle(messages.downgradeTitle);
            setIsOnlineProduct(selectedPolicy);
        }
        if (coverTypeCode === TPFT) {
            brands = brands.filter(({ value }) => value !== HASTINGS_ESSENTIAL);
        }
        setAvailableBrands(brands.filter(({ value }) => offeredBrands.indexOf(value) > -1));
        window.scrollTo(0, 0);

        // Set Type of Policy Selected
    }, []);

    useEffect(() => {
        const offerings = _.get(submissionVM, offeringsPath) || [];
        const result = {};
        availableBrands.forEach(({ value: brandCode }) => {
            const offeringForBrand = offerings.find((offering) => offering.branchCode === brandCode);
            if (offeringForBrand) {
                const vehicleCoverages = offeringForBrand.coverages.vehicleCoverages[0].coverages;
                const ancillaryCoverages = offeringForBrand.coverages.ancillaryCoverages[0].coverages;
                _.set(result, brandCode, [...vehicleCoverages, ...ancillaryCoverages]);
            }
        });
        setCoverages(result);
    }, [availableBrands]);

    useEffect(() => {
        const otheQuotes = _.get(customizeSubmissionVM, 'value.otherOfferedQuotes') || [];
        const result = {};
        const isCoveragesUpdated = otheQuotes[0];
        availableBrands.forEach(({ value: brandCode }) => {
            const offeringForBrand = otheQuotes.find((quote) => quote.branchCode === brandCode);

            const currentBrandCov = _.get(customizeSubmissionVM, 'value.coverages.privateCar.vehicleCoverages[0].coverages');
            if ((offeringForBrand || currentBrandCov) && isCoveragesUpdated && isCoveragesUpdated.coverages) {
                const vehicleCoverages = offeringForBrand
                    && offeringForBrand.coverages
                    ? offeringForBrand.coverages.privateCar.vehicleCoverages[0].coverages
                    : currentBrandCov;
                _.set(result, brandCode, [...vehicleCoverages]);
            }
        });
        setVehicleExcessCoverages(result);
    }, [availableBrands]);

    // useEffect(
    //     () => {
    //         if (selectedBrand) {
    //             setAnnualMonthlyAmount();
    //             updateAmountHeader();
    //         }
    //     },
    //     [annualAmount, monthlyAmount, selectedBrand]
    // );

    const handleGoBack = () => {
        updateEpticaId(CUSTOMISE_QUOTE);
        onGoBack();
    };


    const getWebAnyalMess = () => isOnlineProduct ? `${messages.eventValueOnline}` : '';


    /**
     * Track brand selection
     * @param {string} type brand 
     */
    const trackSelectedCover = (type) => {
        if (type) {
            const hyphen = isOnlineProduct ? ' - ' : '';
            trackEvent({
                event_value: `${type === 'YD' ? type : type.concat(hyphen, getWebAnyalMess())}`,
                event_action: `${messages.customizeQuote} - ${label} - ${messages.chooseCover}`,
                event_type: isOnlineProduct ? 'link' : 'table_select',
                element_id: 'cover-type-table',
            });
        }
    };


    const handleBrandSelection = (event) => {
        const newBrand = event.target.value;
        const indexOfNewBrand = brandOrder.findIndex((b) => newBrand === b);
        const indexOfCurrentBrand = brandOrder.findIndex((b) => currentBrand === b);
        setSelectedBrand(newBrand);
        trackSelectedCover(newBrand);
        if (indexOfNewBrand > indexOfCurrentBrand) {
            onUpgrade(newBrand);
        }
        if (indexOfNewBrand === indexOfCurrentBrand) {
            onUpgradeDowngradeCancellation();
        }
        if (!isUpgrade && (indexOfNewBrand < indexOfCurrentBrand)) {
            onDowngrade(newBrand);
        }

    };


    const displayAmountWithFormat = ({ amount, currency }) => {
        const currencySymbols = {
            gbp: '£'
        };
        return `${currencySymbols[currency]}${getAmountAsTwoDecimalDigit(amount)}`;
    };

    const displayAmount = ({ amount, currency }) => {
        const currencySymbols = {
            gbp: '£'
        };
        return `${currencySymbols[currency]}${amount}`;
    };

    const displayCurrency = (value) => `£${Number.isInteger(value)
        ? value
        : value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const findCoverageByBrandAndId = (brandCode, id) => {
        if (NO_TPFT_COVERAGES.includes(id)) {
            return {
                publicID: id,
                selected: coverTypeCode !== TPFT && brandCode !== HASTINGS_ESSENTIAL
            };
        }
        if (!_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode] && coverages[brandCode].find((cov) => cov.publicID === id);
        }

        return null;
    };

    const findVehicleCoverageByBrandAndId = (brandCode, id) => {
        if (NO_TPFT_COVERAGES.includes(id)) {
            return {
                publicID: id,
                selected: coverTypeCode !== TPFT && brandCode !== HASTINGS_ESSENTIAL
            };
        }

        if (!_.isEmpty(vehicleExcessCoverages) && brandCode) {
            return vehicleExcessCoverages[brandCode].find((cov) => cov.publicID === id);
        } if (_.isEmpty(vehicleExcessCoverages) && !_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode].find((cov) => cov.publicID === id);
        }

        return null;
    };

    const displayCoverage = (brandCode, coverage, prefix) => {
        if (coverage) {
            const { selected, amount, publicID: covId } = coverage;
            if (selected || (brandCode === HASTINGS_PREMIER && !NO_TPFT_COVERAGES.includes(covId))) {
                return {
                    value: true
                };
            }
            if (amount) {
                return {
                    value: `${prefix}${displayAmount(coverage.amount)}`
                };
            }
        }
        return {
            value: false
        };
    };

    const getCoveragesToDisplay = () => {
        const vehCoverages = _.get(customizeSubmissionVM, `${vehCoveragesPath}.value`);
        let isDrivingOtherCarsSelected = false;
        if (vehCoverages && vehCoverages[0]) {
            isDrivingOtherCarsSelected = vehCoverages[0].coverages.find((vehicleCov) => vehicleCov.name === 'Driving Other Cars').selected;
        }
        const coveragesMapping = {
            [messages.motorLegalCovId]: messages.motorLegalLabel,
            [messages.racBreakdownCovId]: messages.racBreakdownLabel,
            [messages.courtesyCarCovId]: messages.courtesyCarCovLabel,
            [messages.claimsHelplineId]: messages.claimsHelplineLabel,
            [messages.euCoverId]: messages.euCoverLabel,
            [messages.drivingOtherCarsCovId]: messages.drivingOtherCarsLabel,
            [messages.managePolicyId]: messages.managePolicyLabel,
            [messages.windscreenCoverId]: messages.windscreenCoverLabel,
            [messages.vandalismPromiseCovId]: messages.vandalismPromiseLabel,
            [messages.uninsuredDriverPromiseCovId]: messages.uninsuredDriverPromiseLabel,
            [messages.personalBelongingsCoverId]: messages.personalBelongingsCoverLabel,
        };
        if (!isDrivingOtherCarsSelected) {
            delete coveragesMapping[messages.drivingOtherCarsCovId];
        }
        const coveragesPrefixes = {
            [messages.motorLegalCovId]: messages.motorLegalAmountPrefix,
            [messages.racBreakdownCovId]: messages.racBreakdownAmountPrefix,
        };

        return Object.keys(coveragesMapping).map((coverageId) => ({
            rowLabel: coveragesMapping[coverageId],
            cells: ([messages.claimsHelplineId, messages.managePolicyId, messages.euCoverId].includes(coverageId))
                ? Array(availableBrands.length).fill({ value: true })
                : availableBrands.map(({ value: brandCode }) => {
                    const coverage = findCoverageByBrandAndId(brandCode, coverageId);
                    return displayCoverage(brandCode, coverage, coveragesPrefixes[coverageId] || '');
                })
        }));
    };

    const getData = () => {
        let offeredQuotes;
        const otherOfferedQuotes = _.get(customizeSubmissionVM, otherOffferedQuotesPath);
        const vehCoverages = _.get(customizeSubmissionVM, `${vehCoveragesPath}.value`);
        if (_.isArray(otherOfferedQuotes) && otherOfferedQuotes[0].offeredQuote) {
            const selectedQuote = _.get(customizeSubmissionVM, quotePath);
            offeredQuotes = [...otherOfferedQuotes.map((q) => q.offeredQuote), (selectedQuote.offeredQuote || selectedQuote)];
        } else {
            offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        }
        offeredQuotes = offeredQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1))));
        const availableBrandsValues = availableBrands.map(({ value }) => value);
        const availableQuotes = offeredQuotes
            .filter(({ branchCode }) => availableBrandsValues.includes(branchCode))
            .sort((quote1, quote2) => {
                const pos1 = brandOrder.findIndex((b) => b === quote1.branchCode);
                const pos2 = brandOrder.findIndex((b) => b === quote2.branchCode);
                return pos1 - pos2;
            });

        let allData = [];

        if (availableQuotes.length === 0) {
            return allData;
        }

        allData = [{
            rowLabel: messages.payInFullLabel,
            highlighted: true,
            cells: availableQuotes && availableQuotes.map(({ hastingsPremium }) => {
                const {
                    annuallyPayment: { premiumAnnualCost }
                } = hastingsPremium;
                return {
                    value: displayAmountWithFormat(premiumAnnualCost)
                };
            })
        },
        {
            rowLabel: messages.payMonthlyLabel,
            cells: (isMonthlyPaymentAvailable) ? availableQuotes.map(({ hastingsPremium }) => {
                const {
                    monthlyPayment: { firstInstalment, elevenMonthsInstalments, premiumAnnualCost }
                } = hastingsPremium;
                return {
                    value: (
                        <>
                            <div>
                                {displayAmountWithFormat(premiumAnnualCost)}
                            </div>
                            <div className="mt-1">
                                <span className="font-regular text-small text-md-md">{`${messages.monthlyPaymentPrefix} `}</span>
                                {displayAmountWithFormat(elevenMonthsInstalments)}
                            </div>
                        </>
                    ),
                    extraLines: [
                        <div className="mt-1">
                            {messages.montlhyFirstPaymentLabel.replace(AMOUNT_VALUE, displayAmountWithFormat(firstInstalment))}
                        </div>
                    ]
                };
            }) : []
        },
        {
            rowLabel: messages.totalExcessLabel,
            cells: availableBrandsValues && availableBrandsValues.map((brandCode) => {
                const avq = availableQuotes.filter((quote) => quote.branchCode === brandCode);
                const accidentalDamageCov = findVehicleCoverageByBrandAndId(brandCode, messages.acctidentalDamageCovId);
                let totalExcess = 0;
                if (accidentalDamageCov) {
                    const { standardAccDmgExcessKey, onlineAccDmgExcessKey } = messages;
                    if (_.size(avq) > 0) {
                        const productofferedID = (avq[0].productType === 'online') ? onlineAccDmgExcessKey : standardAccDmgExcessKey;
                        const compulsoryExcessObj = accidentalDamageCov.terms.filter((term) => term.publicID === productofferedID);
                        const compulsoryExcess = _.has(compulsoryExcessObj[0], 'directValue') ? compulsoryExcessObj[0].directValue : 0;
                        const cmpYAndIAccDamage = getYoungAndInexperiencedExcess(driversList);
                        totalExcess = compulsoryExcess + +voluntaryExcess + cmpYAndIAccDamage;
                    }
                } else if (coverTypeCode === messages.tpft) {
                    const theftDamage = findVehicleCoverageByBrandAndId(brandCode, messages.fireAndTheft);
                    if (theftDamage) {
                        const { standardLossFireTheftCovKey, onlineLossFireTheftCovKey } = messages;
                        if (_.size(avq) > 0) {
                            const productofferedID = (avq[0].productType === 'online') ? onlineLossFireTheftCovKey : standardLossFireTheftCovKey;
                            const theftVehicleDamageList = theftDamage.terms.filter((term) => term.publicID === productofferedID);
                            totalExcess = _.has(theftVehicleDamageList[0], 'directValue') ? theftVehicleDamageList[0].directValue : 0;
                        }
                    }
                } else {
                    totalExcess = 0;
                }
                return {
                    value: displayCurrency(totalExcess)
                };
            })
        },
        ...getCoveragesToDisplay(availableBrandsValues)];

        if (isMonthlyPaymentAvailable) {
            return allData;
        }

        return allData.filter((item) => item.rowLabel !== messages.payMonthlyLabel);
    };

    return (
        <div className="manual-upgrade-downgrade-container">
            <div className="manual-upgrade-downgrade__arc-header arc-header">
                <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                <BackNavigation
                    id="backNavMainWizard"
                    onClick={handleGoBack}
                    onKeyPress={handleGoBack}
                    className="align-self-start manual-upgrade-downgrade__arc-header__back-button" />
            </div>
            <Row className="manual-upgrade-downgrade__top-header text-center margin-bottom-xxl">
                <Col>
                    <HDLabelRefactor text={title} Tag="h1" className="title mb-0" />
                    {
                        savingsHeader
                        && <HDLabelRefactor text={savingsHeader} Tag="p" className="font-bold mb-0 mt-3" />
                    }
                    {
                        explanationHeader
                        && <HDLabelRefactor text={explanationHeader} Tag="p" className="mb-0" />
                    }
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} className="px-0">
                    <HDTable
                        onlineProduct={isOnlineProduct}
                        // webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${label} - ${messages.chooseCover}` }}
                        id="cover-type-table"
                        className="cover-type-table__table-box-shadow"
                        name="brandCode"
                        selectedHeaderValue={selectedBrand}
                        onSelect={handleBrandSelection}
                        headerValues={availableBrands}
                        defaultIndex={availableBrands.findIndex((brand) => brand.value === currentBrand)}
                        data={getData()} />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }} className="px-md-0 margin-top-md margin-bottom-lg">
                    {isUpgrade && (
                        <HDInfoCardRefactor
                            id="manual-upgrade-info-card"
                            image={tipCirclePurple}
                            paragraphs={[messages.extrasTipMessage]}
                            theme="light"
                            size="thin" />
                    )}
                </Col>
            </Row>
        </div>
    );
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
});

const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction,
};

HDManualUpgradeDowngrade.propTypes = {
    submissionVM: PropTypes.shape({
        lobData: PropTypes.object,
        baseData: PropTypes.object,
        aspects: PropTypes.object,
    }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    isUpgrade: PropTypes.bool.isRequired,
    isMonthlyPaymentAvailable: PropTypes.bool.isRequired,
    paymentType: PropTypes.string.isRequired,
    onGoBack: PropTypes.func.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func,
    onDowngrade: PropTypes.func,
    onUpgradeDowngradeCancellation: PropTypes.func,
    label: PropTypes.string.isRequired,
};

HDManualUpgradeDowngrade.defaultProps = {
    onUpgrade: () => { },
    onDowngrade: () => { },
    onUpgradeDowngradeCancellation: () => { }
};

export default connect(mapStateToProps, mapDispatchToProps)(HDManualUpgradeDowngrade);
