import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class BOPCoverablesService {
    static addBOPLocation(quoteID, bopLocation, sessionUUID, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('bopcoverables'), 'addLocation', [quoteID, bopLocation, sessionUUID], additionalHeaders);
    }

    static updateBOPLocation(quoteID, bopLocation, sessionUUID, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('bopcoverables'), 'updateLocation', [quoteID, bopLocation, sessionUUID], additionalHeaders);
    }

    static removeBOPLocation(quoteID, bopLocation, sessionUUID, additionalHeaders = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('bopcoverables'), 'removeLocation', [quoteID, bopLocation, sessionUUID], additionalHeaders);
    }

    static addBOPBuilding(
        quoteID,
        bopLocationId,
        bopBuilding,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(getProxiedServiceUrl('bopcoverables'), 'addBuilding', [quoteID, bopLocationId, bopBuilding, sessionUUID], additionalHeaders);
    }

    static updateBOPBuilding(
        quoteID,
        bopLocationId,
        bopBuilding,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl('bopcoverables'),
            'updateBuilding',
            [quoteID, bopLocationId, bopBuilding, sessionUUID],
            additionalHeaders
        );
    }

    static removeBOPBuilding(
        quoteID,
        bopLocationId,
        bopBuilding,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl('bopcoverables'),
            'removeBuilding',
            [quoteID, bopLocationId, bopBuilding, sessionUUID],
            additionalHeaders
        );
    }

    static updateBOPBuildingCoverages(
        quoteID,
        bopLocationId,
        bopBuilding,
        sessionUUID,
        additionalHeaders = {}
    ) {
        return JsonRPCService.send(
            getProxiedServiceUrl('bopcoverables'),
            'updateBuildingCoverages',
            [quoteID, bopLocationId, bopBuilding, sessionUUID],
            additionalHeaders
        );
    }
}
