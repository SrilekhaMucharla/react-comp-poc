import React from 'react';
import * as messages from './HDDirectDebitPage.messages';

// eslint-disable-next-line import/prefer-default-export
export const getOverlayContent = ({ firstPayment, elevenMonths, paymentScheduleCount }) => [
    {
        heading: messages.contactDetails,
        content: [messages.contactDetailsContent]
    },
    {
        heading: messages.keyFeatures,
        content: [messages.keyFeaturesCreditType,
            messages.keyFeaturesCreditAmount,
            messages.keyFeaturesHowAndWhenCredit,
            messages.keyFeaturesDurationOfCreditAgreement,
            <>
                {messages.repayments}
                {messages.keyFeaturesRepaymentsPt1}
                <b>{messages.firstPayment(firstPayment)}</b>
                {messages.keyFeaturesRepaymentsPt2}
                <b>{paymentScheduleCount || messages.followedByMonths}</b>
                {messages.keyFeaturesRepaymentsPt3}
                <b>{messages.elevenMonthsPayment(elevenMonths)}</b>
                {messages.keyFeaturesRepaymentsPt4}
            </>,
            messages.keyFeaturesAmountPay,
            messages.keyFeaturesProposedCredit1,
            messages.keyFeaturesProposedCredit2,
            messages.keyFeaturesCashPrice,
            messages.keyFeaturesSecurity
        ]
    },
    {
        heading: messages.creditCost,
        content: [messages.creditCostCreditAgreement,
            messages.creditCostAnnualPercentage,
            messages.creditCostLatePayment,
            messages.creditCostMissingPayment
        ]
    },
    {
        heading: messages.importantLegalAspects,
        content: [messages.importantLegalAspectsWithdrawal,
            messages.importantLegalAspectsRepayment,
            messages.importantLegalAspectsAgency,
            messages.importantLegalAspectsDraftCreditAgreement
        ]
    },
    {
        heading: messages.financialServices,
        content: [messages.financialServicesCreditor,
            messages.financialServicesCreditAgreement,
            messages.financialServicesRedress
        ]
    },

];
