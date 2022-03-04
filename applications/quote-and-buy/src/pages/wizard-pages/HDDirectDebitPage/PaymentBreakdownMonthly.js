import React from 'react';
import * as dayjs from 'dayjs';
import { HDLabelRefactor } from 'hastings-components';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import * as messages from './HDDirectDebitPage.messages';
import getMonthAsString from '../../../common/getMonthAsString';

const getOverLayContent = (title, overlayHeader, overlayHeaderContent, showIcon = false, pageMetadata) => {
    return (
        <HDOverlayPopup
            className="hd-directdebit-payment-breakdown-monthly"
            id="hd-directdebit-payment-breakdown-monthly"
            webAnalyticsView={{ ...pageMetadata, page_section: title }}
            webAnalyticsEvent={{ event_action: title }}
            labelText={overlayHeader}
            overlayButtonIcon={
                (
                    <>
                        {showIcon && <span className="hd-directdebit-payment-breakdown-monthly__refresh-icon fa fa-lg fa-sync pr-2" />}
                        {' '}
                        <HDLabelRefactor
                            Tag="a"
                            text={title}
                            className="mb-0" />
                    </>
                )}
        >
            <p>{overlayHeaderContent}</p>
            {showIcon && <p>{messages.policyRenewOverlayHeaderContent1}</p>}
            {showIcon && <p>{messages.policyRenewOverlayHeaderContent2}</p>}
            {showIcon && <p>{messages.policyRenewOverlayHeaderContent3}</p>}
        </HDOverlayPopup>
    );
};

const getMonthlyPaymentBreakDownData = (
    initialPaymentAmount,
    elevenMonthAmount,
    periodStartDate,
    periodEndDate,
    prefStartDate,
    registrationsNumber,
    pageMetadata
) => {
    const eleMonthStr = `${messages.startOnText}${prefStartDate}${messages.endBracket}`;
    const policyRenewDate = new Date(periodEndDate.year, periodEndDate.month, periodEndDate.day);
    policyRenewDate.setDate(policyRenewDate.getDate() + 1);
    return [{
        id: 1,
        circle: {
            type: 'violet',
            date: { day: `${dayjs().date()}`, shortMonth: getMonthAsString(dayjs().month()) }
        },
        description: {
            label: [registrationsNumber],
            name: [messages.initialPaymentTodayText],
            quote: { single: `£${initialPaymentAmount}` },
            tooltip: getOverLayContent('Why today?', messages.whyTodayOverlayHeader, messages.whyTodayOverlayHeaderContent, false, pageMetadata),
        }
    }, {
        id: 2,
        circle: {
            date: { day: `${periodStartDate.day}`, shortMonth: getMonthAsString(periodStartDate.month) }
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
            name: [messages.elevenMonthText, eleMonthStr],
            quote: { single: `£${elevenMonthAmount}` }
        }
    },
    {
        id: 7,
        circle: {
            date: { day: `${policyRenewDate.getDate()}`, shortMonth: getMonthAsString(policyRenewDate.getMonth()) }
        },
        description: {
            tooltip: getOverLayContent('Policy renews', messages.policyRenewOverlayHeader, messages.policyRenewOverlayHeaderContent, true, pageMetadata)
        }
    }];
};

export default getMonthlyPaymentBreakDownData;
