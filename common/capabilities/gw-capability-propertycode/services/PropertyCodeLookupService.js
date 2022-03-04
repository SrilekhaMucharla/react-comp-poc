import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class PropertyCodeLookupService {
    static getPropertyCodes(
        lob,
        jobNumber,
        previousClassCode,
        address,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl('propertyCodeLookup'),
            'getPropertyCodes',
            [lob, jobNumber, previousClassCode, address, sessionUUID],
            additionalHeaders
        );
    }
}
