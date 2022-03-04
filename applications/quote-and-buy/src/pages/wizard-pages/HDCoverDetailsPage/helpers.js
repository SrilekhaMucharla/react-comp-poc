import React from 'react';
import dayjs from 'dayjs';
import { HDOverlayPopup, HDLabelRefactor } from 'hastings-components';
import {
    directComprehensive,
    directComprehensiveOverlay,
    directFireTheft,
    directFireTheftOverlay,
    essential,
    essentialOverlay,
    premierComprehensive,
    premierComprehensiveOverlay,
    premierFireTheft,
    premierFireTheftOverlay,
    youDriveComprehensive,
    youDriveFireTheft,
} from './const';
import { getPriceWithCurrencySymbol } from '../../../common/utils';
import { HASTINGS_DIRECT, HASTINGS_PREMIER, YOU_DRIVE } from '../../../constant/const';

export const getBenefits = (branchCode, selectedCoverType) => {
    if (branchCode === YOU_DRIVE && selectedCoverType === 'comprehensive') {
        return { details: youDriveComprehensive, overlay: youDriveComprehensive };
    }

    if (branchCode === YOU_DRIVE && selectedCoverType === 'tpft') {
        return { details: youDriveFireTheft, overlay: youDriveFireTheft };
    }

    if (branchCode === HASTINGS_DIRECT && selectedCoverType === 'comprehensive') {
        return { details: directComprehensive, overlay: directComprehensiveOverlay };
    }

    if (branchCode === HASTINGS_DIRECT && selectedCoverType === 'tpft') {
        return { details: directFireTheft, overlay: directFireTheftOverlay };
    }

    if (branchCode === HASTINGS_PREMIER && selectedCoverType === 'comprehensive') {
        return { details: premierComprehensive, overlay: premierComprehensiveOverlay };
    }

    if (branchCode === HASTINGS_PREMIER && selectedCoverType === 'tpft') {
        return { details: premierFireTheft, overlay: premierFireTheftOverlay };
    }

    return { details: essential, overlay: essentialOverlay };
};

const getFormattedDates = (dates) => {
    const { start, end } = dates;

    return {
        startDay: start.getDate(),
        startShortMonth: dayjs(start).format('MMM'),
        formattedStartDate: dayjs(start).format('DD/MM/YYYY'),
        endDay: end.getDate(),
        endShortMonth: dayjs(end).format('MMM'),
        currentDay: new Date().getDate(),
        currentMonth: dayjs(new Date()).format('MMM')
    };
};

const policyRenewsElement = (
    <>
        <span className="fas fa-sync" />
        &nbsp;
        <span className="text-decoration-none pl-1">Policy renews</span>
    </>
);

const overlayHeader = 'Why do I pay now?';
const overlayHeaderContent = 'Paying today secures the price of your policy. This is to make sure that, even if your policy isn\'t going to start today,'
    + ' your total premium (and monthly payment amount if you\'re paying by Direct Debit) will stay the same as we\'ve quoted today.';

const whyTodayOverlay = (
    <HDOverlayPopup
        id="cover__details-payment-breakdown-overlay"
        labelText={overlayHeader}
        overlayButtonsClassName="btn--link"
        overlayButtonIcon={<HDLabelRefactor Tag="a" text="Why today?" className="text-small-1" />}
    >
        <p>{overlayHeaderContent}</p>
    </HDOverlayPopup>
);

export const getMonthlySteps = (
    registrationNumber,
    dates,
    isCircleGreen,
    monthlyPremium,
) => {
    const {
        startDay,
        startShortMonth,
        formattedStartDate,
        endDay,
        endShortMonth,
        currentDay,
        currentMonth
    } = getFormattedDates(dates);

    const { firstInstalment, elevenMonthsInstalments } = monthlyPremium;

    return [{
        id: 1,
        circle: {
            date: { day: currentDay, shortMonth: currentMonth },
            type: isCircleGreen ? 'green' : 'violet'
        },
        description: {
            quote: { single: [getPriceWithCurrencySymbol(firstInstalment)] },
            tooltip: isCircleGreen ? <br /> : whyTodayOverlay,
            name: ['Initial payment today'],
            label: [registrationNumber]
        }
    }, {
        id: 2,
        circle: {
            date: { day: startDay, shortMonth: startShortMonth }
        },
        description: {
            name: ['Cover starts']
        }
    }, {
        id: 3,
        description: {
            name: [
                <strong>11</strong>,
                ' monthly payments'
            ],
            quote: { single: [getPriceWithCurrencySymbol(elevenMonthsInstalments)] }
        },
        className: 'payment-breakdown__monthly-row'
    }, {
        id: 4,
        circle: {
            date: { day: endDay, shortMonth: endShortMonth }
        },
        description: {
            tooltip: policyRenewsElement
        }
    }];
};

export const getAnnualSteps = (
    registrationNumber,
    dates,
    isCircleGreen,
    annualPremium,
) => {
    const {
        startDay,
        startShortMonth,
        endDay,
        endShortMonth,
        currentDay,
        currentMonth
    } = getFormattedDates(dates);

    const { premiumAnnualCost } = annualPremium;

    return [{
        id: 1,
        circle: {
            date: { day: currentDay, shortMonth: currentMonth },
            type: isCircleGreen ? 'green' : 'violet'
        },
        description: {
            quote: { single: getPriceWithCurrencySymbol(premiumAnnualCost) },
            tooltip: isCircleGreen ? <br /> : whyTodayOverlay,
            name: ['Pay in full today'],
            label: [registrationNumber]
        }
    }, {
        id: 2,
        circle: {
            date: { day: startDay, shortMonth: startShortMonth },
        },
        description: {
            name: ['Cover starts'],
        },
        extraSpace: true
    }, {
        id: 3,
        circle: {
            date: { day: endDay, shortMonth: endShortMonth },
        },
        description: {
            tooltip: policyRenewsElement,
        }
    }];
};
