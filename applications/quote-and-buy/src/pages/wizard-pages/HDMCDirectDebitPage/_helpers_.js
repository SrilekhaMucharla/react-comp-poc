import dayjs from 'dayjs';
import _ from 'lodash';
import {
    dayOfTheYear, getDateFromParts, getDateObject, _isLeapYear
} from '../../../common/dateHelpers';
import { sumFloats } from '../../../common/utils';

const MAX_PREFERRED_DAY_RANGE = 31;
const INITIAL_PAYMENT_INDEX = 0;

export const formatVehicleDisplayName = ({ make, model }) => `${make} ${model}`;

export const getVehicleDetails = (vehicleDetails) => {
    return {
        displayName: formatVehicleDisplayName(vehicleDetails.lobData.privateCar.coverables.vehicles[0]),
        vrn: vehicleDetails.lobData.privateCar.coverables.vehicles[0].license,
        quoteID: vehicleDetails.quoteID,
    };
};

export const getVeiclePolicyDuration = (vehicleData, coverables) => {
    const startDate = dayjs(getDateFromParts(vehicleData.baseData.periodStartDate));
    const endDate = dayjs(getDateFromParts(vehicleData.baseData.periodEndDate));
    const dateDiff = endDate.diff(startDate, 'days') + 1;
    return dateDiff;
};

export const getCarBreakdownInstallments = (paymentScheduleResponse) => {
    let paymentResponse = null;
    if (paymentScheduleResponse.mcPaymentScheduleObject) {
        paymentResponse = paymentScheduleResponse.mcPaymentScheduleObject;
    }
    const instalmentsArray = [];

    // for generating instalments array at all instalment dates
    // eslint-disable-next-line no-warning-comments
    // TODO: fix this via reducer f if possible
    // eslint-disable-next-line array-callback-return
    paymentResponse.map((singlePaymentSchedule) => {
        singlePaymentSchedule.paymentSchedule.map((instalment, index) => {
            if (index > 0) {
                if (instalmentsArray[getDateObject(instalment.paymentDate).getTime()]) {
                    instalmentsArray[getDateObject(instalment.paymentDate).getTime()].push({
                        amount: instalment.paymentAmount.amount,
                        currency: instalment.paymentAmount.currency,
                    });
                } else {
                    instalmentsArray[getDateObject(instalment.paymentDate).getTime()] = [{
                        amount: instalment.paymentAmount.amount,
                        currency: instalment.paymentAmount.currency,
                    }];
                }
            }
            return null;
        });
    });
    return instalmentsArray;
};

const getPaymentScheduleBySubmissionID = (id, paymentSchedule) => paymentSchedule.mcPaymentScheduleObject.filter((c) => c.submissionID === id)[0];

export const getQuotedVehicleDetails = (quotes, paymentSchedule) => {
    const result = [];
    const parentQuoteVehicleData = quotes.filter((q) => q.isParentPolicy)[0];
    const { chosenQuote } = parentQuoteVehicleData.bindData;
    const parentCarChoosenQuote = parentQuoteVehicleData.quoteData.offeredQuotes.filter((of) => of.publicID === chosenQuote)[0];
    const premiumAnualCostAmount = _.get(parentCarChoosenQuote, 'hastingsPremium.monthlyPayment.premiumAnnualCost.amount', '');
    const totalAmountCredit = _.get(parentCarChoosenQuote, 'hastingsPremium.monthlyPayment.totalAmountCredit', '');
    const parentCarPaymentSchedule = paymentSchedule.mcPaymentScheduleObject.filter((c) => c.submissionID === parentQuoteVehicleData.quoteID)[0];
    const parentQuoteID = parentQuoteVehicleData.quoteID;
    // decided to keep the logic for parent car a bit different since it is a "policy holder car" and future data changes may be needed;
    result.push({
        parentCar: true,
        premiumAnualCostAmount,
        quoteID: parentQuoteID,
        totalAmountCredit,
        vehicleDetails: { ...getVehicleDetails(parentQuoteVehicleData) },
        policyDuration: _isLeapYear(new Date().getFullYear()) ? 366 : 365, // parent cars have full year policy.
        initialPayment: {
            amount: parentCarPaymentSchedule.paymentSchedule[0].paymentAmount.amount,
            currency: parentCarPaymentSchedule.paymentSchedule[0].paymentAmount.currency
        },
    });
    // disabled eslint rules because the deconstruced objects are not the same as the ones in the scope above, their scope is in the foor loop
    for (let i = 1; i < quotes.length; i += 1) {
        const quotedVehicle = quotes[i];
        // eslint-disable-next-line no-shadow
        const { chosenQuote } = quotedVehicle.bindData;
        const childCarChoosenQuote = quotedVehicle.quoteData.offeredQuotes.filter((of) => of.publicID === chosenQuote)[0];

        // eslint-disable-next-line no-shadow
        const premiumAnualCostAmount = _.get(childCarChoosenQuote, 'hastingsPremium.monthlyPayment.premiumAnnualCost.amount', '');
        // eslint-disable-next-line no-shadow
        const totalAmountCredit = _.get(childCarChoosenQuote, 'hastingsPremium.monthlyPayment.totalAmountCredit', '');

        const vehiclePaymentSchedule = getPaymentScheduleBySubmissionID(quotedVehicle.quoteID, paymentSchedule);
        result.push({
            parentCar: false,
            premiumAnualCostAmount,
            quoteID: quotes[i].quoteID,
            totalAmountCredit,
            vehicleDetails: { ...getVehicleDetails(quotes[i]) },
            policyDuration: getVeiclePolicyDuration(quotedVehicle, paymentSchedule.mcPaymentScheduleObject),
            initialPayment: {
                amount: vehiclePaymentSchedule.paymentSchedule[0].paymentAmount.amount,
                currency: vehiclePaymentSchedule.paymentSchedule[0].paymentAmount.currency,
            }
        });
    }
    return result;
};

export const getDropdownOptionsRec = (options = []) => (
    options.length < MAX_PREFERRED_DAY_RANGE
        ? getDropdownOptionsRec([...options, { label: options.length + 1, value: options.length + 1 }])
        : options
);

export const getFlatSchedule = (paymentScheduleObject, quotes) => paymentScheduleObject.flatMap((schedule) => schedule.paymentSchedule.map((payment, i) => ({
    paymentAmount: payment.paymentAmount,
    paymentDate: getDateFromParts(payment.paymentDate),
    label: i === INITIAL_PAYMENT_INDEX
        ? quotes.find(({ quoteID }) => quoteID === schedule.submissionID).lobData.privateCar.coverables.vehicles[0].license
        : null
})));

export const getSumPayments = (arr) => arr.reduce((acc, current) => {
    const i = acc.findIndex((item) => item.paymentDate.toString() === current.paymentDate.toString());

    if (i < 0 || acc[i].label) {
        return [...acc, current];
    }

    const newPaymentAmount = {
        ...acc[i].paymentAmount,
        amount: sumFloats(acc[i].paymentAmount.amount, current.paymentAmount.amount)
            .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };

    acc[i].paymentAmount = newPaymentAmount;
    return acc;
}, []);

export const getMcPaymentList = (paymentScheduleObject, quotes) => {
    const flatArray = getFlatSchedule(paymentScheduleObject, quotes);
    const summed = getSumPayments(flatArray);
    const sorted = summed.sort((a, b) => a.paymentDate - b.paymentDate);

    return sorted;
};

export const getMulticarDDI = (mcSubmission, paymentDay, sortCode, accountNumber) => {
    return {
        sessionUUID: mcSubmission.sessionUUID,
        mpwrapperNumber: mcSubmission.mpwrapperNumber,
        mpwrapperJobNumber: mcSubmission.mpwrapperJobNumber,
        payerDetails: mcSubmission.accountHolder,
        preferredPaymentForQuotes: mcSubmission.quotes.map((quote) => ({ quoteID: quote.quoteID, preferredPaymentDate: paymentDay })),
        payerAddress: mcSubmission.accountHolder.primaryAddress,
        bankDetails: {
            accountName: mcSubmission.accountHolder.displayName,
            accountNumber: accountNumber,
            sortCode: sortCode
        },
        isPayerPolicyOwner: true,
        loanHolder: mcSubmission.accountHolder,
        loanHolderAddress: mcSubmission.accountHolder.primaryAddress
    };
};

export const getVehicleBreakdownPayments = (mcsubmissionVM, mcPaymentScheduleModel) => {
    const vehicleDetails = getQuotedVehicleDetails(mcsubmissionVM.value.quotes, mcPaymentScheduleModel);
    const coverableInstalments = getCarBreakdownInstallments(mcPaymentScheduleModel);
    let indexIndicator = 0;

    const carDetailsBreakdown = vehicleDetails.map((v) => {
        let followedByNoOfMonths = 1;
        let amount = 0;
        let currency = null;
        const scheduleKeys = Object.keys(coverableInstalments).sort((a, b) => a - b);

        // eslint-disable-next-line no-plusplus
        for (let i = indexIndicator; i < scheduleKeys.length; i++) {
            const key = scheduleKeys[i];
            const value = coverableInstalments[key];

            const nextKey = scheduleKeys[i + 1];
            const nextValue = coverableInstalments[nextKey];
            if (!nextValue) {
                amount = value.reduce((sum, item) => sum + item.amount, 0);
                // eslint-disable-next-line prefer-destructuring
                currency = value[0].currency;
                break;
            }
            if (value.length >= nextValue.length) {
                followedByNoOfMonths += 1;
            } else {
                indexIndicator = i + 1;
                amount = value.reduce((sum, item) => sum + item.amount, 0);
                // eslint-disable-next-line prefer-destructuring
                currency = value[0].currency;
                break;
            }
        }
        return {
            quoteId: v.vehicleDetails.quoteID,
            parentVehicle: v.parentCar,
            initialPayment: v.initialPayment,
            futurePayments: {
                amount,
                currency,
                followedBy: followedByNoOfMonths
            }
        };
    });
    return carDetailsBreakdown;
};
