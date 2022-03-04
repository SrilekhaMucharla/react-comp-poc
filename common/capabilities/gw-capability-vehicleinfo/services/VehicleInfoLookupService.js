import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class VehicleInfoLookupService {
    static lookupVehicleInfoBasedOnVin(vin, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            'lookupBasedOnVIN',
            [vin],
            additionalHeaders
        );
    }

    static lookupMakes(additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            'lookupMakes',
            [],
            additionalHeaders
        );
    }

    static autofillBasedOnPartialDto(dto, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            'lookupBasedOnPartialDTO',
            [dto],
            additionalHeaders
        );
    }
}
