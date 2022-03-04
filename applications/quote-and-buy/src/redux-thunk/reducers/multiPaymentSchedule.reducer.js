import {
    MC_PAYMENT_SCHEDULE_START,
    MC_PAYMENT_SCHEDULE_SUCCESS,
    MC_PAYMENT_SCHEDULE_FAIL
} from '../action.types';

const INITIAL_STATE = {
    mcPaymentScheduleObject: null,
    mcPaymentScheduleError: null,
    loading: false,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MC_PAYMENT_SCHEDULE_START:
            return {
                ...state,
                loading: true
            };
        case MC_PAYMENT_SCHEDULE_SUCCESS:
            return {
                ...state,
                loading: false,
                mcPaymentScheduleObject: action.payload.result,
                mcPaymentScheduleError: null,
            };
        case MC_PAYMENT_SCHEDULE_FAIL:
            return {
                ...state,
                mcPaymentScheduleObject: null,
                loading: false,
                mcPaymentScheduleError: action.payload,
            };
        default:
            return state;
    }
}
