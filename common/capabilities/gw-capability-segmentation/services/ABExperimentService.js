import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class ABExperimentService {
    static getExperimentValue(experimentId, params, additionalHeaders = {}) {
        return JsonRPCService.send(
            getProxiedServiceUrl('abexperiment'),
            'getExperimentValue',
            [experimentId, params],
            additionalHeaders
        );
    }
}
