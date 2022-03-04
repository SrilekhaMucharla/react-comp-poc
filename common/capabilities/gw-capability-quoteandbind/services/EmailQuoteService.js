import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class EmailQuoteService {
    static emailQuote(quoteEmailDTO, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('quote'),
            'emailQuote',
            [quoteEmailDTO],
            additionalHeaders
        );
    }
}
