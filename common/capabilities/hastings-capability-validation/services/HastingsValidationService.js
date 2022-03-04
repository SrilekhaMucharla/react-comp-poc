import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsValidationService {
    /**
     * Retrieves LicenseDataDTO on license number.
     *
     * @param {Object} dto LicenseRequestDTO
     * @returns {Promise}
     * @memberof HastingsValidationService
     */
    static validateLicense(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('validateLicense'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'validateLicense',
                params: [dto]
            }
        );
    }

    static validateBankAccount(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('validateLicense'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'validateBankAccount',
                params: [dto]
            }
        );
    }

    static checkTransactionDetails(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('validateLicense'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'checkTransactionDetails',
                params: [dto]
            }
        );
    }

    static checkTransactionDetailsForMC(dto) {
        return BaseTransportService.send(
            getProxiedServiceUrl('validateLicense'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'checkTransactionDetailsForMC',
                params: [dto]
            }
        );
    }
}
