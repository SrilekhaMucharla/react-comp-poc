import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

const SN_ADDRESS_LOOKUP = 'addressLookup';

export default class AddressLookupService {
    static lookupAddressUsingStringAndFilterByPostalCode(
        addressStr,
        postalCode,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl(SN_ADDRESS_LOOKUP),
            'lookupAddressUsingStringAndFilterByPostalCode',
            [addressStr, postalCode],
            additionalHeaders
        );
    }

    static lookupAddressUsingString(data, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl(SN_ADDRESS_LOOKUP), 'lookupAddressUsingString', [data], additionalHeaders);
    }
}
