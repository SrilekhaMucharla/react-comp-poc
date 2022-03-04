/* eslint-disable import/prefer-default-export */
import { HastingsPaymentService } from 'hastings-capability-payment';
import {
    MC_PAYMENT_SCHEDULE_START,
    MC_PAYMENT_SCHEDULE_SUCCESS,
    MC_PAYMENT_SCHEDULE_FAIL
} from '../action.types';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';

export const mcGetPaymentSchedule = (param) => (dispatch) => {
    dispatch({
        type: MC_PAYMENT_SCHEDULE_START
    });
    HastingsPaymentService.fetchMCPaymentDetails(param)
        .then((result) => {
            dispatch({
                type: MC_PAYMENT_SCHEDULE_SUCCESS,
                payload: result
            });
            trackAPICallSuccess('Multi Payment Schedule');
        }).catch((error) => {
            dispatch({
                type: MC_PAYMENT_SCHEDULE_FAIL,
                payload: error
            });
            trackAPICallFail('Multi Payment Schedule', 'Multi Payment Schedule Failed');
        });
};
