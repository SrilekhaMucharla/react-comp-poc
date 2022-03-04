import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsNCDService {
    /**
     * Fetch order code from request with payment information.
     *
     * @param {Object} dto
     * @returns {Promise}
     * @memberof HastingsNCDService
     */
    static fetchNCDData(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('ncd'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                id: '1',
                method: 'retrieveNCDData',
                params: [dto],
                jsonrpc: '2.0'
            }
        );
    }
}
