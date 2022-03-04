import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsRenewalOptionService {
    /**
     * Fetch order code from request with renewal information.
     *
     * @param {Object} dto
     * @returns {Promise}
     * @memberof HastingsRenewalOptionService
     */
    static setRenewalOption(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('renewalOptions'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'optOutDuringQuoteSession',
                params: [dto]

            }
        );
    }
}
