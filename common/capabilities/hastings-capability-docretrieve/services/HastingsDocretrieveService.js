import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsDocretrieveService {
    /**
     * Retrieves ipid information based on ipid dto.
     *
     * @param {string} IPIDObject DTO
     * @returns {Promise}
     * @memberof HastingsDocretrieveService
     */
    static ipidDocByUUID(IPIDObject) {
        return BaseTransportService.send(
            getProxiedServiceUrl('document'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'retrieve',
                params: [IPIDObject]
            }
        );
    }
}
