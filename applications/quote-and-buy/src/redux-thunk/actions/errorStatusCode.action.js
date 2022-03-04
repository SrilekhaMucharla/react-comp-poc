export const SET_ERROR_STATUS_CODE = 'SET_ERROR_STATUS_CODE';
export const CLEAR_ERROR_STATUS_CODE = 'CLEAR_ERROR_STATUS_CODE';

export const setErrorStatusCode = (code) => ({
    type: SET_ERROR_STATUS_CODE,
    payload: code
});

export const clearErrorStatusCode = () => ({
    type: CLEAR_ERROR_STATUS_CODE,
});
