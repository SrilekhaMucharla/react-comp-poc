import { Row, Col } from 'react-bootstrap';
import {
    HDAccordionRefactor,
    HDLabelRefactor,
    HDPaymentBreakdown
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup,
} from '../../../web-analytics';
import HDYourAccessAccoContent from './HDYourAccessAccoContent';
import * as messages from './HDMoreDetailsPopup.messages';
import * as productBenefits from './HDBenefits';
import {
    PAYMENT_TYPE_MONTHLY_CODE, PAYMENT_TYPE_ANNUALLY_CODE
} from '../../../constant/const';
import {
    getMonthlySteps,
    getAnnualSteps
} from '../HDCoverDetailsPage/helpers';
import formatRegNumber from '../../../common/formatRegNumber';
import { getDateFromParts } from '../../../common/dateHelpers';
import { trackEvent } from '../../../web-analytics/trackData';

const HDMoreDetailsPopup = ({
    brandCode,
    coverType,
    startDate,
    endDate,
    paymentType,
    coverages,
    pageMetadata,
    driversList,
    brandName,
    registrationNumber,
    hastingsPremium,
    isYoungAndInexpDriver,
    productType
}) => {
    let benefits = [];
    const commonCovers = productBenefits.commonBenefits;
    const displayDate = ({ day, month, year }) => {
        const formattedDay = day && day.toString().padStart(2, '0');
        const formattedMonth = (month || month === 0) && (month + 1).toString().padStart(2, '0');
        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const driverListWithExcessDetails = () => {
        const accidentalVehicleDamage = coverages
            && coverages[brandCode] ? coverages[brandCode].filter((cover) => cover.publicID === messages.accidentalDamage) : {};
        const theftVehicleDamage = coverages
            && coverages[brandCode] ? coverages[brandCode].filter((cover) => cover.publicID === messages.fireAndTheft) : {};
        if (accidentalVehicleDamage.length > 0 && theftVehicleDamage.length > 0) {
            let excessList = [];
            const cmpAmountPathAccDamage = productType === messages.online
                ? accidentalVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.onlineAccDmgExcessKey)
                : accidentalVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.accidentalDamageCompulsaryKey);
            const voluntaryAmountPathAccDamage = accidentalVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.accidentalDamageVoluntaryKey);
            const cmpAmountPathFire = productType === messages.online
                ? theftVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.onlineLossFireTheftCovKey)
                : theftVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.theftCompulsaryKey);
            const voluntaryAmountPathFire = theftVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.theftVountaryKey);

            excessList = driversList.map((driver) => {
                return {
                    name: driver.displayName,
                    excesses: [
                        {
                            excessName: messages.fireText,
                            voluntaryAmount: _.has(voluntaryAmountPathFire[0], 'directValue') ? voluntaryAmountPathFire[0].directValue : 0,
                            compulsoryAmount: _.has(cmpAmountPathFire[0], 'directValue') ? cmpAmountPathFire[0].directValue : 0
                        },
                        {
                            excessName: messages.theftText,
                            voluntaryAmount: _.has(voluntaryAmountPathFire[0], 'directValue') ? voluntaryAmountPathFire[0].directValue : 0,
                            compulsoryAmount: _.has(cmpAmountPathFire[0], 'directValue') ? cmpAmountPathFire[0].directValue : 0
                        },
                        {
                            excessName: messages.accidentalDamageText,
                            voluntaryAmount: _.has(voluntaryAmountPathAccDamage[0], 'directValue') ? voluntaryAmountPathAccDamage[0].directValue : 0,
                            compulsoryAmount: _.has(cmpAmountPathAccDamage[0], 'directValue') ? cmpAmountPathAccDamage[0].directValue : 0
                        },
                    ]
                };
            });
            return excessList;
        }
        return [];
    };

    const windScreenExcessDetails = () => {
        const windScreenVehicleDamage = coverages
            && coverages[brandCode] ? coverages[brandCode].filter((cover) => cover.publicID === messages.windScreenExcess) : {};
        if (windScreenVehicleDamage.length > 0) {
            let excessList = [];
            const repairPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.windScreenExcessRepairKey);
            const replacementPath = windScreenVehicleDamage[0].terms.filter((amt) => amt.publicID === messages.windScreenExcessReplacementKey);

            excessList = [
                { excessName: messages.windRepairText, voluntaryAmount: repairPath[0].directValue, compulsoryAmount: repairPath[0].directValue },
                { excessName: messages.windScreenReplText, voluntaryAmount: replacementPath[0].directValue, compulsoryAmount: replacementPath[0].directValue }
            ];
            return excessList;
        }
        return [];
    };

    switch (brandCode) {
        case messages.hastingsEssential:
            benefits = productBenefits.essential;
            break;
        case messages.hastingsDirect:
            if (messages.comprehensive && isYoungAndInexpDriver) {
                benefits = coverType === messages.comprehensive ? productBenefits.directCompYAndI : productBenefits.directTP;
            } else {
                benefits = coverType === messages.comprehensive ? productBenefits.directComp : productBenefits.directTP;
            }
            break;
        case messages.hastingsYouDrive:
            benefits = coverType === messages.comprehensive ? productBenefits.directComp : productBenefits.directTP;
            break;
        case messages.hastingsPremier:
            if (messages.comprehensive && isYoungAndInexpDriver) {
                benefits = coverType === messages.comprehensive ? productBenefits.premierCompYAndI : productBenefits.directTP;
            } else {
                benefits = coverType === messages.comprehensive ? productBenefits.premierComp : productBenefits.premierTP;
            }
            break;
        default:
            benefits = [];
    }

    const isDrivingOtherCarsSelected = coverages && coverages[brandCode]
        && coverages[brandCode].find((coverage) => coverage.name === messages.drivingOtherCarsCoverName).selected;
    if (!isDrivingOtherCarsSelected) {
        benefits = benefits.filter(({ benefit }) => benefit !== productBenefits.drivingOtherCarsBenefit);
    }

    // This to generate the key id
    function getRandomInt(min = 1, max = 9999) {
        const minimum = Math.ceil(min);
        const maximum = Math.floor(max);
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationNumber), [registrationNumber]);
    const data = { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() };
    const getPaymentBreakdownSteps = useMemo(() => {
        const isCircleGreen = false;
        const startDateObject = getDateFromParts(_.get(startDate, 'value', data));
        const endDateObject = getDateFromParts(_.get(endDate, 'value', data));
        endDateObject.setDate(endDateObject.getDate() + 1);
        const dates = { start: startDateObject, end: endDateObject };
        let steps = [];

        if (paymentType && paymentType.value === PAYMENT_TYPE_MONTHLY_CODE && hastingsPremium.monthlyPayment) {
            steps = getMonthlySteps(formattedRegNumber, dates, isCircleGreen, hastingsPremium.monthlyPayment);
        }

        if (paymentType && paymentType.value === PAYMENT_TYPE_ANNUALLY_CODE && hastingsPremium.annuallyPayment) {
            steps = getAnnualSteps(formattedRegNumber, dates, isCircleGreen, hastingsPremium.annuallyPayment);
        }

        return steps;
    }, [paymentType, hastingsPremium]);

    const onBeforeOpen = () => {
        if (brandName) {
            const { moreDetails, policy } = messages;
            const hyphen = productType === 'online' ? ` - ${_.capitalize(productType)} ${policy}` : '';
            trackEvent({
                event_value: `${brandCode === 'YD' ? `${brandName} - ${moreDetails}` : brandName.concat(hyphen, ' - ', moreDetails)}`,
                event_action: `${messages.quote} - ${messages.moreDetails}`,
                event_type: (productType === 'online' && brandCode !== 'YD') ? 'link': 'overlay_open',
                element_id: `more-details-popup popup-${brandCode.toLowerCase()}`
            });
        }
    };

    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.moreDetails}` }}
            customStyle="more-details"
            id={`more-details-popup popup-${brandCode && brandCode.toLowerCase()}`}
            overlayButtonIcon={<HDLabelRefactor Tag="a" text={messages.moreDetailsLabel} className="text-small" />}
            labelText={messages.mainHeader}
            onBeforeOpen={onBeforeOpen}
        >
            <hr />
            <Row className="more-details__basic-info">
                <Col xs={4}>
                    <ul>
                        <li>{messages.coverTypeLabel}</li>
                        <li>{messages.startDateLabel}</li>
                        <li>{messages.paymentTermsLabel}</li>
                    </ul>
                </Col>
                <Col xs={8}>
                    <ul className="font-demi-bold">
                        <li>{coverType || '--'}</li>
                        <li>{displayDate(_.get(startDate, 'value', data)) || '--'}</li>
                        <li>{(paymentType && paymentType.name) || '--'}</li>
                    </ul>
                </Col>
            </Row>
            <hr />
            <Row className="more-details__coverages">
                <Col>
                    <HDLabelRefactor
                        className="mt-0"
                        Tag="h5"
                        text={messages.coveragesHeader} />
                    <ul>
                        {benefits && benefits.map((coverage) => {
                            return (
                                <li key={getRandomInt()}>
                                    <span>
                                        <i className="more-details__coverages-check fas fa-check" />
                                    </span>
                                    {coverage.benefit}
                                </li>
                            );
                        })}
                    </ul>
                    <HDLabelRefactor
                        className=""
                        Tag="h5"
                        text={messages.commonCoveragesHeader} />
                    <ul>
                        {commonCovers.map((cover) => (
                            <li key={getRandomInt()}>
                                <span>
                                    <i className="more-details__common-coverages-check fas fa-check" />
                                </span>
                                {cover.benefit}
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
            <hr />
            <HDPaymentBreakdown
                className="more-details__payment-breakdown"
                title={messages.paymentBreakdownTitle}
                steps={getPaymentBreakdownSteps} />
            <hr />
            <Row>
                <Col>
                    <HDAccordionRefactor
                        className="more-details__more-info-accordion no-hr-accordion"
                        size="lg"
                        cards={[
                            {
                                header: messages.excessesHeader,
                                content: <HDYourAccessAccoContent
                                    drivers={driverListWithExcessDetails()}
                                    globalExcesses={windScreenExcessDetails()} />
                            },
                        ]} />
                </Col>
            </Row>
        </HDOverlayPopup>
    );
};

HDMoreDetailsPopup.propTypes = {
    brandName: PropTypes.string.isRequired,
    brandCode: PropTypes.string.isRequired,
    coverType: PropTypes.string,
    startDate: PropTypes.objectOf(PropTypes.object).isRequired,
    endDate: PropTypes.objectOf(PropTypes.object).isRequired,
    paymentType: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    initialPayment: PropTypes.string.isRequired,
    coverages: PropTypes.arrayOf(PropTypes.object),
    driversList: PropTypes.arrayOf(PropTypes.object).isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    registrationNumber: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    hastingsPremium: PropTypes.object.isRequired,
    isYoungAndInexpDriver: PropTypes.bool,
    productType: PropTypes.string,
};

HDMoreDetailsPopup.defaultProps = {
    coverType: null,
    coverages: null,
    isYoungAndInexpDriver: false,
    productType: messages.online
};

export default HDMoreDetailsPopup;
