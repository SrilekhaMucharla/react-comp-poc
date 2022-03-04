import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class AvailabilityService {
    static productAvailableBasedOnPostalCode(submission, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('availability'),
            'isProductAvailableBasedOnPostalCode',
            [submission],
            additionalHeaders
        );
    }

    static checkAvailabilityBasedOnAddress(availabilityRequestDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('availability'),
            'isProductAvailableBasedOnAddress',
            [availabilityRequestDTO],
            additionalHeaders
        );
    }
}
