/* eslint-disable max-len */
import React from 'react';

export const scciOverlayTitle = 'Standard Consumer Credit Information (SCCI)';
export const scciOverlaySubHeader = 'Pre-contract credit  information';
export const print = 'Print';
export const scciHeaderDescription = '(Standard Consumer Credit Information)';
export const scciFirstParagraphHeader = '1. Contact details';
export const scciFirstParagraphContent = 'Creditor: Hastings Insurance Services ("we, us, our"). Address: Conquest House, Collington Avenue, Bexhill-On-Sea, East Sussex, TN39 3LW.';
export const scciSecondParagraphHeader = '2. Key features of the credit product';

export const scciKeyFeaturesContent = (initialPayment, noOfMonthlyPayment, costOfMonthlyPayment) => [
    'The type of credit: Running-account credit to pay (from time to time) for the purchase of insurance policies or the amendment or renewal of policies and/or any related products and our associated arrangement and administration fees ("Insurance Transactions").',
    "The total amount of credit: This means the amount of credit to be provided under the proposed credit agreement or the credit limit. At the date of the credit agreement there will be no credit limit.However, we may, at any time and at our discretion, set a credit limit, or subsequently vary such a credit limit, by giving you at least thirty days' written notice.",
    'How and when credit would be provided: We will agree to provide you with credit under the agreement to finance the cost of any Insurance Transactions which we arrange from time to time at your request, including the insurance premiums, the costs of any related products and our arrangement and administration fees.When you enter into an Insurance Transaction, we will pay on your behalf the amount of such premium and, where applicable, costs to the insurance and related product provider(s).',
    'The duration of the credit agreement: The minimum duration of the credit agreement is the period required to make the monthly payments for your initial drawdown; otherwise there is no fixed duration.',
    <>
        {'Repayments: The monthly repayments for your initial drawdown will be a first repayment of '}
        <b>{`${initialPayment}`}</b>
        {' followed by '}
        <b>{`${noOfMonthlyPayment}`}</b>
        {' of '}
        <b>{`${costOfMonthlyPayment}`}</b>
        {'. Thereafter, each time credit is drawn down under the agreement, we will determine the period over which the drawdown is to be repaid and will notify you of this and the monthly payments, which will be calculated by adding interest for that period(at the then current rate) to the amount of credit drawn down and then, adding any balance then outstanding, and subsequently dividing the sum of these amounts into equal amounts between the number of months over which the drawdown must be repaid.'}
    </>,
    'The total amount you will have to pay: This means the amount you have borrowed plus interest and other costs. Please note that this is an example figure and not the amount you will actually repay. The total amount payable would be £1378.80 (assuming an initial borrowing of £1200). The actual amount you pay will depend on how much you borrow and how long you borrow it for. Each time you pay for another policy under this agreement we will write to you to let you know what your payments will be.',
    'The proposed credit will be granted in the form of a deferred payment for goods or service: For purposes of our arrangement and administration fees.',
    'The proposed credit will be linked to the supply of specific goods or the provision of a service: For the purposes of the insurance policies, or the amendment or renewal of policies, and / or any related products.',
    'Description of goods / services / land / cash price: Insurance Transactions, which we arrange from time to time at your request.We will write to you with details of the cash price of an Insurance Transaction at the time you request the related drawdown.',
    'Security: In the event that you materially breach any of the terms of this agreement you irrevocably authorise us to instruct the Insurer to cancel the relevant Policy and to pay to us any refund of premium or claim amount required by us to apply against what you owe us under this agreement.'
];

export const scciThirdParagraphHeader = '3. Costs of the credit';
export const scciCreditCostContent = [
    "The rates of interest which apply to the credit agreement: Rate of Interest 14.90% - This is the rate of interest for the specified repayment period charged on the credit we provide to you, expressed as a percentage of the cash price of the Insurance Transaction without taking into account any first repayment. Where any drawdown is after the inception date of the related Policy the rate will be adjusted and you will be notified accordingly. These rates will apply throughout the duration of the credit agreement unless we vary the Rate of Interest, which we may do in the circumstances specified in the credit agreement, by giving you at least twenty-one days' written notice of the new rate.",
    'Annual Percentage Rate of Charge(APR): This is the total cost expressed as an annual percentage of the total amount of credit. The APR is there to help you compare different offers. APR 29.9 % - This has been calculated on the basis of the following assumptions: you will have a credit limit of, and will borrow £1200; you will repay that sum, together with interest, by 12 equal instalments at monthly intervals, starting one month after your initial transaction; and the Rate of Interest will not change.',
    "Costs in the case of late payments: On each occasion that you fail to make, or ensure a payment is made, on the due date, you must pay us a default charge of £12. If a debt is left outstanding upon cancellation of the policy and this debt is passed to an external debt collection agency, we will charge you an administration fee of £25.00. You must pay all costs and expenses reasonably incurred by us in; tracing you if you change your address without telling us, recovering sums you owe to us, including, without limitation any and all costs in relation to debt recovery and legal action.In addition, we may charge you daily interest at the Rate of Interest on any payment not made on its due date until the date it is paid in full.We may vary the Rate of Interest in the circumstances specified in the credit agreement, by giving you at least twenty - one days' written notice of the new rate. We may vary any charges we make by giving you at least twenty-one days written notice in the case of a change in the Rate of Interest and 30 days written notice for all other changes.",
    'Consequences of missing payments: We will be authorised to instruct the Insurer to cancel the relevant Policy and receive a refund of premium or claim amount in the event that you materially breach any terms of the agreement.'
];

export const scciForthParagraphHeader = '4. Other important legal aspects';
export const scciImportantLegalAspectsContent = [
    'Right of withdrawal: You have the right to withdraw from the credit agreement without giving any reason. The withdrawal period begins on the day after you receive a notice from us confirming the credit agreement has been made and ends fourteen calendar days later.',
    'Early repayment: You have a right to settle the agreement early in full or in part at any time.',
    'Consultation with a Credit Reference Agency: If we make any searches with credit reference agencies and decide not to proceed with the prospective credit agreement, when informing you of our decision, we must tell you if that decision has been made on the basis of information received from a credit reference agency and the particulars of that credit reference agency.',
    'Right to a draft credit agreement: You have the right, upon request, to obtain a copy of the draft credit agreement free of charge, unless we are unwilling at the time of the request to proceed to the conclusion of the credit agreement.'
];

export const fifthParagraphHeader = '5. Additional information in the case of distance marketing of financial services';
export const fifthParagraphSectionA = '(a) concerning the creditor: Registration number - We are authorised and regulated by the Financial Conduct Authority under the firm reference number 311492. Company Registration Number 03116518. The supervisory authority: We are supervised by the Financial Conduct Authority in relation to our consumer credit business; and regulated by the Financial Conduct Authority in relation to our insurance mediation business.';
export const fifthParagraphSectionB = '(b) concerning the credit agreement. The law taken by the creditor as a basis for the establishment of relations with you before the conclusion of the credit agreement: The law applicable to the credit agreement and/or the competent court. Language to be used in connection with the credit agreement: If you live in Scotland, Scots law will apply, otherwise English law will apply. If you live in Scotland, Scots law will apply to the credit agreement and the Scottish courts will have exclusive jurisdiction in relation to the agreement. Otherwise English law will apply and the courts of England will have exclusive jurisdiction in relation to the credit agreement. The information and contractual terms will be supplied in English and used for communication during the duration of the credit agreement.';
export const fifthParagraphSectionC = '(c) concerning redress. Access to out-of - court complaint and redress mechanism: If you have a complaint we can\'t resolve you can refer your case to the Financial Ombudsman Service. You can write to them at Exchange Tower, Harbour Exchange Square, London E14 9SR. Alternatively their email address is complaint.info@financial-ombudsman.org.uk, and their phone number is 0800 023 4567. www.financial-ombudsman.org.uk.';
