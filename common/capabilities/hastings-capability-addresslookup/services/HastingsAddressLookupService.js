import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsAddressLookupService {
    /**
     * Retrieves addresses based on post code.
     *
     * @param {string} postCode Post code
     * @returns {Promise}
     * @memberof HastingsAddressLookupService
     */
    static lookupAddressByPostCode(postCode) {
        return BaseTransportService.send(
            getProxiedServiceUrl('addressLookup'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'lookupAddressUsingPostCode',
                params: [postCode]
            }
        );
    }
}
