import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { JsonRPCService } from 'gw-portals-transport-js';

export default class UsersProfileDetailsService {
    /**
     * Retrieves an accounts contact summary.
     *
     * @param {Object} authHeader additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     * @memberof AccountBillingDetailsService
     */
    static getAccountsContactSummaries(authHeader = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('userProfileInfo'), 'getAccountsContactSummaries', [], authHeader);
    }

    /**
     * Retrieves an accounts contact summary.
     *
     * @param {Object} accountSummaryDTO an updated account summary DTO
     * @param {Object} authHeader additional headers to pass to the backend (e.g. auth)
     * @returns {Promise} the promise from the backend call
     */
    static updateAccountContactSummary(accountSummaryDTO, authHeader = {}) {
        return JsonRPCService.send(getProxiedServiceUrl('userProfileInfo'), 'updateAccountContactSummary', [accountSummaryDTO], authHeader);
    }
}
