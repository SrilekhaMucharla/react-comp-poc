import classNames from 'classnames';
import dayjs from 'dayjs';
import {
    HDLabelRefactor, HDPaymentBreakdown, HDQuoteInfoRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import GreenPlainTickIcon from '../../../assets/images/icons/green-plain-tick.svg';
import GreenTickIcon from '../../../assets/images/icons/green-tick-icon.svg';
import TickIcon from '../../../assets/images/icons/tick-icon.svg';
import CompareTheMarketLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_compare-the-market.svg';
import ConfusedDotComLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_confused.com.svg';
import ExperianLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_experian.svg';
import GoCompareLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_go-compare.svg';
import MoneySupermarketLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_money-super-market.svg';
import QuoteZoneLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_quotezone.svg';
import USwitchLogo from '../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_u-switch.svg';
import ClearScore from '../../../assets/images/logo/other-organisations-logo/clearscore_logo.svg';
import HastingsDirectTwinLineLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import HastingsPremierTwinLineLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import { getDateFromParts } from '../../../common/dateHelpers';
import formatRegNumber from '../../../common/formatRegNumber';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import {
    HASTINGS_DIRECT, HASTINGS_ESSENTIAL, HASTINGS_PREMIER,
    PAYMENT_TYPE_ANNUALLY_CODE,
    PAYMENT_TYPE_MONTHLY_CODE,
    YOU_DRIVE,
    UW_ERROR_CODE,
    GREY_LIST_ERROR_CODE,
    CUE_ERROR_CODE
} from '../../../constant/const';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
// eslint-disable-next-line import/no-named-as-default
import HDYouDriveDetailsPage from '../HDYouDriveDetailsPage/HDYouDriveDetailsPage';
import HDCoverDetailsOverlay from './components/HDCoverDetailsOverlay';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    branchCodeToLogo, coverTypeOptions, drivingOtherCarsLabel
} from './const';
import * as messages from './HDCoverDetails.messages';
import {
    getAnnualSteps, getBenefits,
    getMonthlySteps
} from './helpers';

import { returnAncillaryCoveragesObject } from '../../../common/utils';
import { producerCodeList } from '../../../common/producerCodeHelper';
import { faultyClaims } from '../../../common/faultClaimsHelper';

function HDCoverDetailsPage(props) {
    const [showPCWContent, setShowPCWContent] = useState(false);
    const [pcwAncCoverages, setPcwAncCoverages] = useState([]);
    const {
        handleUpgrade,
        handleDowngrade,
        handleParentEvent,
        customizeSubmissionVM,
        offeredQuotes,
        registrationNumber,
        ancillaryCoveragesObject,
        protectNcd,
        isInavlidDate,
        onlineProduct,
        pageMetadata,
        multiCarFlag,
        actionType
    } = props;

    const {
        quote,
        coverages,
        coverType: cqCoverType,
        producerCode,
        periodStartDate: periodStartDateParts,
        insurancePaymentType: cqInsurancePaymentType,
        periodEndDate: periodEndDateParts
    } = customizeSubmissionVM;

    const {
        branchCode: cqBranchCode,
        branchName: cqBranchName,
        hastingsPremium
    } = quote;

    const mcsubmissionVM = useSelector((state) => state.wizardState.data.mcsubmissionVM);

    const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE];

    const selectedCoverType = useMemo(() => coverTypeOptions.find((o) => o.value === cqCoverType), [cqCoverType]);

    const isDrivingOtherCarsSelected = coverages.privateCar.vehicleCoverages[0].coverages
        .find((coverage) => coverage.name.toUpperCase() === drivingOtherCarsLabel.toUpperCase())
        .selected;

    // shouldn't these come all from BE instead of const + driving other cars exception?
    // why are there different benefits for overlay and details component?
    const branchBenefits = Object.entries(getBenefits(cqBranchCode, selectedCoverType.value))
        .reduce((accumulator, [key, benefits]) => ({
            ...accumulator,
            [key]: isDrivingOtherCarsSelected
                ? benefits
                : benefits.filter((benefit) => benefit.label.toUpperCase() !== drivingOtherCarsLabel.toUpperCase())
        }), {
            details: [],
            overlay: []
        });

    const startDateObject = periodStartDateParts && getDateFromParts(periodStartDateParts);
    const endDateObject = periodStartDateParts && getDateFromParts(periodEndDateParts);
    const paymentTypeText = cqInsurancePaymentType === PAYMENT_TYPE_ANNUALLY_CODE ? messages.Annual : messages.Monthly;

    const getPaymentBreakdownSteps = useMemo(() => {
        const isCircleGreen = false;
        endDateObject.setDate(endDateObject.getDate() + 1);
        const dates = { start: startDateObject, end: endDateObject };
        let steps = [];

        if (cqInsurancePaymentType === PAYMENT_TYPE_MONTHLY_CODE && hastingsPremium) {
            steps = getMonthlySteps(formatRegNumber(registrationNumber), dates, isCircleGreen, hastingsPremium.monthlyPayment);
        }

        if (cqInsurancePaymentType === PAYMENT_TYPE_ANNUALLY_CODE && hastingsPremium) {
            steps = getAnnualSteps(formatRegNumber(registrationNumber), dates, isCircleGreen, hastingsPremium.annuallyPayment);
        }

        return {
            title: messages.whatYouPayAndWhen,
            steps: steps
        };
    }, [cqInsurancePaymentType, hastingsPremium]);

    useEffect(() => {
        if (producerCode !== messages.defaultMsg
            && (actionType !== messages.directText && !_.includes(producerCodeList, producerCode))) {
            // eslint-disable-next-line react/prop-types
            let selectedAncCoverages = [];
            if (multiCarFlag) {
                selectedAncCoverages = returnAncillaryCoveragesObject(customizeSubmissionVM);
            } else {
                selectedAncCoverages = ancillaryCoveragesObject ? ancillaryCoveragesObject.filter((anc) => anc.selected) : [];
            }
            const formattedAncCoverages = selectedAncCoverages.map((coverage) => {
                const tempCoverage = coverage;
                if (coverage.name === messages.breakDown || coverage.name === messages.racBreakDown) {
                    tempCoverage.name = messages.racBreakDown;
                } else {
                    tempCoverage.name = coverage.name.charAt(0) + coverage.name.slice(1).toLowerCase();
                }
                return tempCoverage;
            });
            let noClaimDetailsFlag = true;
            if (multiCarFlag) {
                const getmcsubmissionVMQuotes = _.get(mcsubmissionVM, 'quotes', []);
                const submissionVM = getmcsubmissionVMQuotes.filter((subm) => subm.value.isParentPolicy)[0];
                const claimsDetails = faultyClaims(submissionVM);
                if (claimsDetails && claimsDetails.length >= 2) {
                    noClaimDetailsFlag = false;
                }
            }
            if (protectNcd && noClaimDetailsFlag) {
                const ncdCoverage = { name: messages.ncdProtection };
                formattedAncCoverages.push(ncdCoverage);
            }
            setPcwAncCoverages(formattedAncCoverages);
            setShowPCWContent(true);
        }
    }, [protectNcd]);

    useEffect(() => {
        props.toggleContinueElement(true);
    }, []);

    const upgradeContent = (logo, upgradeBrand, upgradeCost, totalAmount, extraCovers) => {
        const upgradeLabel = (upgradeCost > 0) ? `${messages.upgradeForExtraLabel} £${upgradeCost}` : `${messages.upgradeAndSaveLabel} £${-upgradeCost}`;
        let upgradeDesc;
        if (upgradeBrand === 'Hastings Direct') {
            upgradeDesc = `A Hastings Direct policy will only cost you £${getAmountAsTwoDecimalDigit(totalAmount)} in total and you'll get all this:`;
        } else {
            upgradeDesc = `For £${getAmountAsTwoDecimalDigit(totalAmount)} in total, you could upgrade to a Hastings Premier policy,
            which includes the below extras. That's  cheaper than adding these separately!`;
        }

        return (
            <div>
                {registrationNumber && handleUpgrade && (
                    <Container
                        className={`cover-details__upgrade-container theme-white margin-top-lg py-3
                        ${onlineProduct ? 'logo-online-product' : ''} ${classNames({ disabled: isInavlidDate })}`}
                    >
                        <Row>
                            <Col>
                                <img className="cover-details__upgrade-logo" src={logo} alt={logo} />
                            </Col>
                        </Row>
                        <Row className="cover-details__upgrade-header">
                            <Col>
                                <HDLabelRefactor
                                    Tag="h5"
                                    className="size-sm my-0"
                                    text={upgradeLabel} />
                            </Col>
                        </Row>
                        <Row className="cover-details__upgrade-content">
                            <Col>
                                <HDLabelRefactor
                                    Tag="p"
                                    className="size-xs"
                                    text={upgradeDesc} />
                            </Col>
                        </Row>
                        <Row className="cover-details__extra-cover d-block">
                            {extraCovers.map((benefit) => (
                                <Col>
                                    <HDLabelRefactor
                                        Tag="span"
                                        className="cover-details__extra-cover-label mb-2"
                                        text={benefit}
                                        icon={<img src={GreenPlainTickIcon} alt="tick" />}
                                        iconPosition="l" />
                                </Col>
                            ))}
                        </Row>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    Tag="a"
                                    className="cover-details__link--upgrade-cover"
                                    text={messages.seeBenefitsLabel}
                                    onClick={handleUpgrade}
                                    onKeyDown={handleUpgrade} />
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>
        );
    };

    const getPremiumForBrand = (brand) => {
        if (offeredQuotes
                && offeredQuotes.find((offeredQuote) => offeredQuote.branchCode === brand)
                && offeredQuotes.find((offeredQuote) => offeredQuote.branchCode === brand).hastingsPremium) {
            const { monthlyPayment, annuallyPayment } = offeredQuotes.find((offeredQuote) => offeredQuote.branchCode === brand).hastingsPremium;
            if (cqInsurancePaymentType === PAYMENT_TYPE_MONTHLY_CODE) {
                return monthlyPayment.premiumAnnualCost.amount;
            }
            return annuallyPayment.premiumAnnualCost.amount;
        }
    };

    const isHPQuoteAvailable = (brand) => {
        const offeredQuote = offeredQuotes.find((offeredQuoteEntry) => offeredQuoteEntry.branchCode === brand);
        return offeredQuote;
    };


    const getPremiumDifference = (lowerBrand, higherBrand) => {
        return (getPremiumForBrand(higherBrand) - getPremiumForBrand(lowerBrand)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');
    };

    const hasHastingsErrors = (brand) => {
        const offeredQuote = offeredQuotes.find((offeredQuoteEntry) => offeredQuoteEntry.branchCode === brand);
        return offeredQuote && (offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1));
    };

    const isDownGradable = () => {
        if (cqBranchName === 'Hastings Direct') {
            return !hasHastingsErrors(HASTINGS_ESSENTIAL);
        }
        if (cqBranchName === 'Hastings Premier') {
            return !hasHastingsErrors(HASTINGS_ESSENTIAL) || !hasHastingsErrors(HASTINGS_DIRECT);
        }
        return false;
    };

    const getUpgradeContent = () => {
        let content = '';
        if (cqBranchName === 'Hastings Essential') {
            if (!hasHastingsErrors(HASTINGS_DIRECT)) {
                content = upgradeContent(HastingsDirectTwinLineLogo, 'Hastings Direct', getPremiumDifference(HASTINGS_ESSENTIAL, HASTINGS_DIRECT),
                    getPremiumForBrand(HASTINGS_DIRECT), ['Windscreen cover', 'Vandalism Promise', 'Uninsured Driver Promise', 'Personal belongings cover']);
            } else if (!hasHastingsErrors(HASTINGS_PREMIER)) {
                content = upgradeContent(HastingsPremierTwinLineLogo, 'Hastings Premier', getPremiumDifference(HASTINGS_ESSENTIAL, HASTINGS_PREMIER),
                    getPremiumForBrand(HASTINGS_PREMIER), ['Windscreen cover', 'Vandalism Promise', 'Uninsured Driver Promise', 'Personal belongings cover']);
            } else {
                content = '';
            }
        } else if (cqBranchName === 'Hastings Direct' && !hasHastingsErrors(HASTINGS_PREMIER) && isHPQuoteAvailable(HASTINGS_PREMIER)) {
            content = upgradeContent(HastingsPremierTwinLineLogo, 'Hastings Premier', getPremiumDifference(HASTINGS_DIRECT, HASTINGS_PREMIER),
                getPremiumForBrand(HASTINGS_PREMIER), ['Reduced compulsory excess', 'Motor legal expenses', 'RAC breakdown cover']);
        } else {
            content = '';
        }
        return content;
    };

    const getPCWLogo = () => {
        let producerIconKey = '';
        switch (producerCode) {
            case messages.compareTheMarket: producerIconKey = CompareTheMarketLogo; break;
            case messages.moneySupmarket: producerIconKey = MoneySupermarketLogo; break;
            case messages.confusedCom: producerIconKey = ConfusedDotComLogo; break;
            case messages.goCompare: producerIconKey = GoCompareLogo; break;
            case messages.quoteZone: producerIconKey = QuoteZoneLogo; break;
            case messages.uSwitch: producerIconKey = USwitchLogo; break;
            case messages.clearScore: producerIconKey = ClearScore; break;
            case messages.insurerGroup: return (
                <div className="cover-details__pcw-name pt-3 pb-2 pl-5 pr-5">
                    <HDLabelRefactor
                        className="size-xs"
                        text={messages.insurerGroupValue}
                        Tag="span" />
                </div>
            );
            case messages.experian: producerIconKey = ExperianLogo; break;
            default: producerIconKey = CompareTheMarketLogo; break;
        }
        return (
            <div className={`cover-details__logo--wrapper
                    ${(producerCode === messages.quoteZone) ? 'cover-details__logo--quoteZone' : ''}
                    ${(producerCode === messages.moneySupmarket) ? 'cover-details__logo--msm' : ''}
                `}
            >
                <img
                    className="cover-details__logo--pcw"
                    src={producerIconKey}
                    alt={producerIconKey} />
            </div>
        );
    };

    const handleCoverTypeChange = (event) => {
        const coverTypeChangeEventValue = event.target.value;

        if (selectedCoverType !== coverTypeChangeEventValue) {
            handleParentEvent('coverTypeChange', event);
        }
    };

    const getOverlayVRNJSX = () => {
        return (
            <Row className="overlay-vrn">
                <span className="overlay-vrn-text font-bold">{formatRegNumber(registrationNumber)}</span>
            </Row>
        );
    };

    return (
        <div className="cover-details__container" id="cover-details-container">
            <Row className="cover-details__header-container">
                <Col className="cover-details-logos-container">
                    <img
                        src={branchCodeToLogo[cqBranchCode].src}
                        alt={branchCodeToLogo[cqBranchCode].alt}
                        className="cover-details__logo--brand" />
                    <HDLabelRefactor
                        className="cover-details__logo--cover-type mb-0"
                        Tag="h5"
                        text={selectedCoverType.label} />
                </Col>
                <Col className="cover-details__link--overlay">
                    <HDCoverDetailsOverlay
                        branchName={cqBranchName}
                        onChange={handleCoverTypeChange}
                        policyStartDate={dayjs(startDateObject).format('DD/MM/YYYY')}
                        paymentTypeText={paymentTypeText}
                        benefits={branchBenefits.overlay}
                        selectedCoverType={selectedCoverType}
                        options={coverTypeOptions}
                        pageMetadata={pageMetadata}
                        headerBar={multiCarFlag ? getOverlayVRNJSX() : null}
                    >
                        {cqBranchCode !== HASTINGS_ESSENTIAL && cqBranchCode !== YOU_DRIVE && registrationNumber && handleDowngrade && isDownGradable() && (
                            <Row className="cover-details__overlay-downgrade-btn-container">
                                <Col sm={12} md={9}>
                                    <HDButton
                                        id="more-than-you-need-button"
                                        webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.moreThanYouNeed}` }}
                                        label={messages.moreThanYouNeed}
                                        variant="secondary"
                                        className="w-100"
                                        onClick={handleDowngrade}
                                        disabled={isInavlidDate} />
                                </Col>
                            </Row>
                        )}
                        {
                            getUpgradeContent(cqBranchName)
                        }
                        <hr />
                        <HDPaymentBreakdown {...getPaymentBreakdownSteps} />
                    </HDCoverDetailsOverlay>
                </Col>
                <Col className="cover-details__benefits-container">
                    {branchBenefits.details.map((detailsBenefit) => (
                        <HDLabelRefactor
                            Tag="span"
                            className="font-weight-bold mb-2 w-50"
                            text={detailsBenefit.label}
                            icon={<img src={TickIcon} alt="tick" />}
                            iconPosition="l" />
                    ))}
                </Col>
            </Row>
            <Row className="cover-details__pcw-container" hidden={!showPCWContent}>
                <Col sm={12} md={5} className="cover-details__pcw-subcontainer pl-4">
                    <Row className="cover-details__pcw-label">
                        <Col>
                            <HDQuoteInfoRefactor className="text-regular m-0 p-0">
                                <div>{messages.pcwLabel}</div>
                            </HDQuoteInfoRefactor>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {getPCWLogo()}
                        </Col>
                    </Row>
                </Col>
                <Col className="cover-details__ancilliary-container">
                    {pcwAncCoverages.map((anc) => (
                        <HDLabelRefactor
                            Tag="span"
                            className="font-bold cover-details__ancilliary"
                            text={anc.name}
                            icon={<img src={GreenTickIcon} alt={messages.tick} />}
                            iconPosition="l" />
                    ))}
                </Col>
            </Row>
            {cqBranchCode === YOU_DRIVE && (<HDYouDriveDetailsPage />)}
        </div>
    );
}

const mapStateToProps = (state) => ({
    actionType: state.wizardState.app.actionType,

});

HDCoverDetailsPage.propTypes = {
    toggleContinueElement: PropTypes.func,
    handleParentEvent: PropTypes.func,
    handleDowngrade: PropTypes.func,
    handleUpgrade: PropTypes.func,
    registrationNumber: PropTypes.string.isRequired,
    customizeSubmissionVM: PropTypes.shape({
        coverages: PropTypes.object,
        coverType: PropTypes.string,
        producerCode: PropTypes.string,
        periodStartDate: PropTypes.shape({ year: PropTypes.number, month: PropTypes.number, day: PropTypes.number }),
        periodEndDate: PropTypes.shape({ year: PropTypes.number, month: PropTypes.number, day: PropTypes.number }),
        insurancePaymentType: PropTypes.string,
        quote: PropTypes.shape({
            branchCode: PropTypes.string,
            branchName: PropTypes.string,
            hastingsPremium: PropTypes.object,
        }).isRequired,
    }).isRequired,
    offeredQuotes: PropTypes.arrayOf(PropTypes.object).isRequired,
    ancillaryCoveragesObject: PropTypes.shape({}),
    protectNcd: PropTypes.bool,
    isInavlidDate: PropTypes.bool,
    onlineProduct: PropTypes.bool,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    multiCarFlag: PropTypes.bool,
    actionType: PropTypes.string
};

HDCoverDetailsPage.defaultProps = {
    toggleContinueElement: () => { },
    handleParentEvent: () => { },
    handleDowngrade: null,
    handleUpgrade: null,
    ancillaryCoveragesObject: null,
    protectNcd: false,
    isInavlidDate: false,
    onlineProduct: false,
    multiCarFlag: false,
    actionType: null
};

export default withRouter(connect(mapStateToProps)(HDCoverDetailsPage));
