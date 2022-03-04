import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class PolicyDiffService {
    static getPolicyDiffWithPrevious(data, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('policydiff'), 'getPolicyDiffWithPrevious', [data], additionalHeaders);
    }
}
