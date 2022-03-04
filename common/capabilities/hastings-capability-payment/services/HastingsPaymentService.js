import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsPaymentService {
    /**
     * Fetch order code from request with payment information.
     *
     * @param {Object} dto OrderCodeRequestDTO
     * @returns {Promise}
     * @memberof HastingsPaymentService
     */
    static fetchOrderCode(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'fetchOrderCode',
                params: [dto]
            }
        );
    }

    static fetchOrderCodeMP(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'fetchOrderCodeforMP',
                params: [dto]
            }
        );
    }

    static fetchPaymentDetails(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'retrievePaymentSchedule',
                params: [dto]
            }
        );
    }

    static fetchMCPaymentDetails(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'retrievePaymentScheduleForMulti',
                params: [dto]
            }
        );
    }

    /**
     * Create payment request in Worldpay.
     *
     * @param {Object} dto FetchPaymentURLRequestDTO
     * @returns {Promise}
     * @memberof HastingsPaymentService
     */
    static fetchHostedPaymentURL(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'fetchHostedPaymentURL',
                params: [dto]
            }
        );
    }

    /**
     * Create payment request in Worldpay.
     *
     * @param {Object} dto updateDDIRequestDTO
     * @returns {Promise}
     * @memberof HastingsPaymentService
     */
    static updateDDI(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'updateDDI',
                params: [dto]
            }
        );
    }

    /**
     * Create multiprodut DDI request
     * @param {Object} dto MultiproductDDIRequestDTO
     * @returns {Promise}
     * @memberof HastingsPaymentService
    */
    static updateMultiproductDDI(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('payment'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'updateMultiproductDDI',
                params: [dto]
            }
        );
    }
}
