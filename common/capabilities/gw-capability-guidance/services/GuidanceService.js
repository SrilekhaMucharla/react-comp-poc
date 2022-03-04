import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class GuidanceService {
    static getOccupations(additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('guidance'), 'getOccupations', [], additionalHeaders);
    }

    static populateQuestions(data, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('guidance'), 'populateQuestions', [data], additionalHeaders);
    }

    static populateRecommendedProducts(data, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('guidance'), 'populateRecommendedProducts', [data], additionalHeaders);
    }

    static createAccountAndSubmission(data, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('guidance'), 'createAccountAndSubmission', data, additionalHeaders);
    }
}
