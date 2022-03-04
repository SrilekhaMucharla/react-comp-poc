/* eslint-disable prefer-template */
import {
    MONETATE_FETCH_START,
    MONETATE_FETCH_SUCCESS,
    MONETATE_FETCH_FAILED
} from '../action.types';
import { MONETATE_API_URL } from '../../constant/const';
import axiosInstance from '../data-handler/axios.handler';
import * as monetateHelper from '../../common/monetateHelper';
// import Utils from '../../util/util';

// eslint-disable-next-line import/prefer-default-export
export const monetateApi = (cookie, producerCode) => {
    return async (dispatch) => {
        dispatch({
            type: MONETATE_FETCH_START
        });
        try {
            const cookieObject = cookie['mc.v'];
            const body = {
                channel: monetateHelper.getChannelId(),
                events: monetateHelper.getEventTypes(cookieObject, producerCode),
                monetateId: (cookieObject && cookieObject.monetateId !== undefined) ? cookieObject.monetateId : undefined
            };
            axiosInstance.post(MONETATE_API_URL, body)
                .then((response) => {
                    dispatch({
                        type: MONETATE_FETCH_SUCCESS,
                        payload: response.data
                    });
                }).catch((error) => {
                    dispatch({
                        type: MONETATE_FETCH_FAILED,
                        payload: error
                    });
                });
        } catch (error) {
            dispatch({
                type: MONETATE_FETCH_FAILED,
                payload: error
            });
        }
    };
};
