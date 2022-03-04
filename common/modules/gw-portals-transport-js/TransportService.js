/* eslint-disable prefer-promise-reject-errors */
import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import config from 'app-config';
import { InactivityTimerService } from 'gw-portals-auth-inactivity-timer-js';
import BaseTransportService from './BaseTransportService';

// import {getConfigValue, DEFAULT_HTTP_TIMEOUT} from 'gw-portals-config';

// const httpTimeout = getConfigValue('httpSettings.timeout', DEFAULT_HTTP_TIMEOUT);
const httpTimeout = 90000;

export default class TransportService {
    /**
     * Invoke the given method on the remote service endpoint.
     * @param {string} serviceEndpoint - The service url
     * @param {string|FormData} body - The body to pass
     * @param {Object} headers - The headers to pass
     * @returns {Promise} - The promise returned by the remote call
     */
    static send(serviceEndpoint, body, headers) {
        const callStart = new Date().getTime();
        if (config.persona !== 'anonymous') {
            const inactivityTimer = InactivityTimerService();
            inactivityTimer.resetInactivityTimer();
        }
        const request = BaseTransportService.send(serviceEndpoint, headers, body)
            .then((response) => {
                return response.result;
            })
            .catch(({ error = {} }) => {
                const callTime = new Date().getTime() - callStart;
                const errorCode = _.get(error, 'error.data.appError') || 'GW_ERROR';
                const appErrorCode = _.get(error, 'error.data.appErrorCode') || 101;
                return Promise.reject({
                    baseError: error.message,
                    errorCode: errorCode,
                    appErrorCode: appErrorCode,
                    isTimeout: (error.status === 0) && callTime < httpTimeout,
                    isUnauthenticated: (error.status === 401)
                });
            });
        return request;
    }

    static isSessionExpiredReason(reason) {
        return reason.isTimeout === true;
    }

    static isUserUnauthenticatedReason(reason) {
        return reason.isUnauthenticated === true;
    }
}
