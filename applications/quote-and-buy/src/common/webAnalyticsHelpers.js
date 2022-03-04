import { dateToFormattedString } from './dateHelpers';
import { QUOTE_DECLINE_ERROR_CODE } from '../constant/const';

export const getStartPolicyDateForSC = (submissionVM) => {
    const policyStartDate = submissionVM?.baseData?.periodStartDate?.value;
    return policyStartDate;
};

export const getEndPolicyDateForSC = (submissionVM) => {
    const policyEndDate = submissionVM?.baseData?.periodEndDate?.value;
    return policyEndDate;
};

export const getStartPolicyDateForMC = (mcsubmissionVM) => {
    const policyStartDate = mcsubmissionVM?.quotes[0]?.baseData?.periodStartDate?.value;
    return policyStartDate;
};

export const getEndPolicyDateForMC = (mcsubmissionVM) => {
    const policyEndDate = mcsubmissionVM?.quotes[0]?.baseData?.periodEndDate?.value;
    return policyEndDate;
};

export const updateStateOnQuoteDecline = (state, submissionVM) => {
    const subVMStartDate = getStartPolicyDateForSC(submissionVM);
    const startDate = dateToFormattedString(subVMStartDate);

    const subVMEndDate = getEndPolicyDateForSC(submissionVM);
    const endDate = dateToFormattedString(subVMEndDate);
    return {
        ...state,
        error: QUOTE_DECLINE_ERROR_CODE,
        periodDates: {
            startDate: startDate,
            endDate: endDate
        }
    };
};
