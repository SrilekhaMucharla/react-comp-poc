import _ from 'lodash';
import { CUE_ERROR_CODE, GREY_LIST_ERROR_CODE, UW_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE, QUOTE_RATE_ERROR_CODE } from '../../../constant/const';

export const isUWErrorPresent = (offeredQuotes) => offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
    .filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE))).length > 0)).length === offeredQuotes.length;

export const isGrayListErrorPresent = (offeredQuotes) => offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
    .filter((hastingsError) => (hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE))).length > 0)).length === offeredQuotes.length;

export const isCueErrorPresent = (offeredQuotes) => offeredQuotes.filter((offeredQuote) => (offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors
    .filter((hastingsError) => (hastingsError.technicalErrorCode === CUE_ERROR_CODE))).length > 0)).length === offeredQuotes.length;

export const selectedBrandHasDeclineError = (submissionVM, brand) => {
    const offeredQuotes = _.get(submissionVM, 'quoteData.offeredQuotes.value') || _.get(submissionVM, 'quoteData.offeredQuotes');
    const offeredQuote = offeredQuotes && offeredQuotes.find((offeredQuoteVal) => (offeredQuoteVal.branchCode === brand));
    return offeredQuote && offeredQuote.hastingsErrors && (offeredQuote.hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE)
        || (hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE) || (hastingsError.technicalErrorCode === CUE_ERROR_CODE)).length > 0);
};

export const getQuoteDeclineErrors = (submissionVM) => {
    const offeredQuotes = _.get(submissionVM, 'quoteData.offeredQuotes.value') || _.get(submissionVM, 'quoteData.offeredQuotes');
    let uwError;
    let greyListError;
    let cueErrors = false;
    let isNotQuotable = false;
    if (submissionVM && submissionVM.value && submissionVM.value.baseData
        && submissionVM.value.baseData.periodStatus !== 'Quoted') {
        isNotQuotable = true;
    }
    if (offeredQuotes) {
        uwError = isUWErrorPresent(offeredQuotes);
        greyListError = isGrayListErrorPresent(offeredQuotes);
        cueErrors = isCueErrorPresent(offeredQuotes);
    }
    return (uwError || greyListError || cueErrors || isNotQuotable);
};

// checkHastingsErrorFromHastingErrorObj
export const checkHastingsErrorFromHastingErrorObj = (hastingsErrors) => {
    const errorObject = { errorMessage: null };
    const hasUWErrors = hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE));
    const greyListErrors = hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE));
    const cueErrors = hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === CUE_ERROR_CODE));
    const quoteDeclineErrors = hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === QUOTE_DECLINE_ERROR_CODE));
    const quoteRateErrors = hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === QUOTE_RATE_ERROR_CODE));
    if (!hasUWErrors && !greyListErrors && !cueErrors && !quoteDeclineErrors && !quoteRateErrors) {
        return errorObject;
    }
    if (hasUWErrors.length) { errorObject.errorCode = UW_ERROR_CODE; }
    if (greyListErrors.length) { errorObject.errorCode = GREY_LIST_ERROR_CODE; }
    if (cueErrors.length) { errorObject.errorCode = CUE_ERROR_CODE; }
    if (quoteDeclineErrors.length) { errorObject.errorCode = QUOTE_DECLINE_ERROR_CODE; }
    if (quoteRateErrors.length) { errorObject.errorCode = QUOTE_RATE_ERROR_CODE; }
    return errorObject;
};
