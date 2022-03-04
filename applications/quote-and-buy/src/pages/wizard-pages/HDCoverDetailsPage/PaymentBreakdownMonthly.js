import React from 'react';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import * as messages from './HDCoverDetails.messages';
import { isDateBeforeInception } from '../../../common/utils';
import getMonthAsString from '../../../common/getMonthAsString';


const getOverLayContent = (title, showIcon, pageMetadata) => {
    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: title }}
            webAnalyticsEvent={{ event_action: title }}
            id="breakdown-monthly"
            labelText={messages.overlayHeader}
            overlayButtonIcon={
                (
                    <>
                        {showIcon && <i className="fa fa-sync" />}
                        {' '}
                        <span>{title}</span>
                    </>
                )}
        >
            <p>{messages.overlayHeaderContent}</p>
        </HDOverlayPopup>
    );
};

const customContentText = (boldText, text, date) => {
    return (
        <div className="breakdown-monthly__custom-content-text">
            <strong>{boldText || ''}</strong>
            {' '}
            <span>{ text || ''}</span>
            <strong>{date || ''}</strong>
        </div>
    );
};
const customContentTextWithIcon = (title, showIcon) => {
    return (
        <div className="breakdown-monthly__custom-content-text-icon">
            {showIcon && <i className="fa fa-sync" />}
            {' '}
            <span>{title}</span>
        </div>
    );
};

export const getYearlyPaymentBreakDownData = (yearlyAmount, periodStartDate, periodEndDate, registrationsNumber, pageMetadata) => {
    return [{
        id: 1,
        circle: {
            type: 'violet',
            date: { day: `${periodStartDate.day || 0}`, shortMonth: getMonthAsString(periodStartDate.month || 0) }
        },
        description: {
            label: [registrationsNumber],
            name: [messages.initialAnnualPaymentTodayText],
            quote: { single: `£${yearlyAmount}` }
        }
    }, {
        id: 2,
        circle: {
            date: { day: `${periodStartDate.day || 0}`, shortMonth: getMonthAsString(periodStartDate.month || 0) }
        },
        description: {
            name: [messages.coverStartsText],
        }
    }, {
        id: 3,
        description: {
            extraSpace: [],
        }
    }, {
        id: 7,
        circle: {
            date: { day: `${periodEndDate.day || 0}`, shortMonth: getMonthAsString(periodEndDate.month || 0) }
        },
        description: {
            name: [customContentTextWithIcon(messages.policyRenew, true)]
        }
    }];
};

export const getMonthlyPaymentBreakDownData = (initialPaymentAmount, elevenMonthAmount, periodStartDate, periodEndDate, prefStartDate, registrationsNumber, pageMetadata) => {
    return [{
        id: 1,
        circle: {
            type: 'violet',
            date: { day: `${periodStartDate.day || 0}`, shortMonth: getMonthAsString(periodStartDate.month || 0) }
        },
        description: {
            label: [registrationsNumber],
            name: [messages.initialPaymentTodayText],
            quote: { single: `£${initialPaymentAmount}` },
            tooltip: getOverLayContent('Why today?', false, pageMetadata),
        }
    }, {
        id: 2,
        circle: {
            date: { day: `${periodStartDate.day || 0}`, shortMonth: getMonthAsString(periodStartDate.month || 0) }
        },
        description: {
            name: [messages.coverStartsText],
        }
    }, {
        id: 3,
        circle: {
            type: 'dot'
        },
        description: {
            name: isDateBeforeInception(periodStartDate)
                ? [customContentText(11, messages.elevenMonthText, ''), messages.elevenMonthHelpText]
                : [customContentText(11, messages.elevenMonthText, ''), customContentText('', messages.startOnText, prefStartDate)],
            quote: { single: `£${elevenMonthAmount}` }
        }
    }, {
        id: 4,
        circle: {
            date: { day: `${periodEndDate.day || 0}`, shortMonth: getMonthAsString(periodEndDate.month || 0) }
        },
        description: {
            name: [customContentTextWithIcon(messages.policyRenew, true)]
        }
    }];
};
