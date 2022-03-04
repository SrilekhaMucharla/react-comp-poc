import getMonthlyPaymentBreakDownData from './PaymentBreakdownMonthly';

const getAnnuallyPaymentBreakDownData = (initialPaymentAmount, elevenMonthAmount, periodStartDate,
    periodEndDate, prefStartDate, registrationsNumber, pageMetadata) => {
    return getMonthlyPaymentBreakDownData(initialPaymentAmount, elevenMonthAmount, periodStartDate,
        periodEndDate, prefStartDate, registrationsNumber, pageMetadata)
        .filter((step) => step.id !== 3);
};

export default getAnnuallyPaymentBreakDownData;
