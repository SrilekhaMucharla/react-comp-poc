import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class ProducerInfoService {
    static getProducersContactSummaries(authHeader = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('profileinfoProducer'), 'getProducersContactSummaries', [], authHeader);
    }
}
