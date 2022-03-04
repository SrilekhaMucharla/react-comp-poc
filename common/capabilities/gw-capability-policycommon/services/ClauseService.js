import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class ClauseService {
    static getDependentClausesForLob(jobNumber, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('coverage'), 'getDependentCoveragesForLob', [jobNumber], additionalHeaders);
    }
}
