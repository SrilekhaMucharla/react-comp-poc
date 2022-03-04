import {
    UW_ERROR_CODE,
    GREY_LIST_ERROR_CODE,
    CUE_ERROR_CODE,
    QUOTE_DECLINE_ERROR_CODE,
    SESSION_TIMEOUT_ERROR,
    VALIDATION_ERROR,
    QUOTE_RATE_ERROR_CODE
} from '../constant/const';

const BACKEND = 'backend';
const SESSION_TIMEOUT = 'session timeout';
const VALIDATION = 'validation';

const getErrorString = (errorCode) => {
    switch (errorCode) {
        case UW_ERROR_CODE: return BACKEND;
        case GREY_LIST_ERROR_CODE: return BACKEND;
        case CUE_ERROR_CODE: return BACKEND;
        case QUOTE_DECLINE_ERROR_CODE: return BACKEND;
        case QUOTE_RATE_ERROR_CODE: return BACKEND;
        case SESSION_TIMEOUT_ERROR: return SESSION_TIMEOUT;
        case VALIDATION_ERROR: return VALIDATION;
        default: return null;
    }
};

export default getErrorString;
