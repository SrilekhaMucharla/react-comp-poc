import getErrorString from './getErrorString';

const BACKEND = 'backend';
const SESSION_TIMEOUT = 'session timeout';
const VALIDATION = 'validation';

const getErrorDescription = (errorCode) => {
    switch (getErrorString(errorCode)) {
        case BACKEND: return 'Backend error, covers error codes: 705, 716, 802, 805, 805.';
        case SESSION_TIMEOUT: return 'Session timeout error code: 408.';
        case VALIDATION: return 'Validation error.';
        default: return null;
    }
};

export default getErrorDescription;
