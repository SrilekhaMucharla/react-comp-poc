import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import * as messages from './HDThanksPage.messages';
import getMonthAsString from '../../../common/getMonthAsString';

export const getYearlyPaymentBreakDownData = (yearlyAmount, periodStartDate, periodEndDate, registrationsNumber) => {
    const policyRenewDate = new Date(periodEndDate.year, periodEndDate.month, periodEndDate.day);
    policyRenewDate.setDate(policyRenewDate.getDate() + 1);
    return [{
        id: 1,
        circle: {
            type: 'green',
        },
        description: {
            label: [registrationsNumber],
            name: [messages.payInFullText],
            quote: { single: `£${yearlyAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        }
    }, {
        id: 2,
        circle: {
            date: { day: `${periodStartDate.day}`, shortMonth: getMonthAsString(periodStartDate.month) }
        },
        description: {
            name: [messages.coverStartsText],
        }
    },
    {
        id: 7,
        circle: {
            date: { day: `${policyRenewDate.getDate()}`, shortMonth: getMonthAsString(policyRenewDate.getMonth()) }
        },
        description: {
            tooltip:
    <HDOverlayPopup
        className="thanks-page__overlay"
        webAnalyticsView={{ page_section: 'Yearly payment breakdown' }}
        webAnalyticsEvent={{ event_action: 'Yearly payment breakdown' }}
        id="example"
        overlayButtonIcon={
            (
                <Row>
                    <Col className="col-auto pr-0">
                        <span className="thanks-page__sync-icon fa fa-sync" />
                    </Col>
                    <Col className="pl-2">
                        <span className="thanks-page__policy-link">Policy renews</span>
                    </Col>
                </Row>
            )}
    >
        <h2>{messages.policyRenews}</h2>
        <p>{messages.policyOverlayText1}</p>
        <p>{messages.policyOverlayText2}</p>
        <p>{messages.policyOverlayText3}</p>
        <p>{messages.policyOverlayText4}</p>
    </HDOverlayPopup>
        }
    }];
};

export const getMonthlyPaymentBreakDownData = (initialPaymentAmount, elevenMonthAmount, periodStartDate, periodEndDate, prefStartDate, registrationsNumber) => {
    const eleMonthStr = `\n${messages.startOnText}${prefStartDate}${messages.endBracket}`;
    const policyRenewDate = new Date(periodEndDate.year, periodEndDate.month, periodEndDate.day);
    policyRenewDate.setDate(policyRenewDate.getDate() + 1);
    return [{
        id: 1,
        circle: {
            type: 'green',
        },
        description: {
            label: [registrationsNumber],
            name: [messages.initialPaymentTodayText],
            quote: { single: `£${initialPaymentAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
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
            quote: { single: `£${elevenMonthAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
        }
    },
    {
        id: 7,
        circle: {
            date: { day: `${policyRenewDate.getDate()}`, shortMonth: getMonthAsString(policyRenewDate.getMonth()) }
        },
        description: {
            tooltip:
    <HDOverlayPopup
        className="thanks-page__overlay"
        webAnalyticsView={{ page_section: 'Monthly payment breakdown' }}
        webAnalyticsEvent={{ event_action: 'Monthly payment breakdown' }}
        id="example"
        overlayButtonIcon={
            (
                <Row>
                    <Col className="col-auto pr-0">
                        <span className="thanks-page__sync-icon fa fa-sync" />
                    </Col>
                    <Col className="pl-2">
                        <HDLabelRefactor Tag="a" text={messages.policyRenewsLink} className="thanks-page__overlay__link" />
                    </Col>
                </Row>
            )}
    >
        <h2>{messages.policyRenews}</h2>
        <p>{messages.policyOverlayText1}</p>
        <p>{messages.policyOverlayText2}</p>
        <p>{messages.policyOverlayText3}</p>
        <p>{messages.policyOverlayText4}</p>
    </HDOverlayPopup>
        }
    }];
};
