import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsIpidService {
    /**
     * Retrieves ipid information based on ipid dto.
     *
     * @param {string} IPIDObject DTO
     * @returns {Promise}
     * @memberof HastingsIpidService
     */
    static ipidByProducerCode(IPIDObject) {
        return BaseTransportService.send(
            getProxiedServiceUrl('matcher'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'matchForAll',
                params: [IPIDObject]
            }
        );
    }

    static mcIpidByProducerCode(IPIDObject) {
        return BaseTransportService.send(
            getProxiedServiceUrl('matcher'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'multiProductMatchForAll',
                params: [IPIDObject]
            }
        );
    }
}
