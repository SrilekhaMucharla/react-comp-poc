import { getProxiedServiceUrl } from 'gw-portals-url-js';
import BaseTransportService from '../../../modules/gw-portals-transport-js/BaseTransportService';

export default class HastingsVehicleInfoLookupService {
    /**
     * Retrieves vehicle data based on product type,manufacturer and mode.
     *
     * @param {Object} dto VehicleDataReqDTO
     * @returns {Promise}
     * @memberof HastingsVehicleInfoLookupService
     */
    static retrieveVehicleData(dto = {}) {
        return BaseTransportService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            { 'Content-Type': 'application/json; charset=utf-8' },
            {
                jsonrpc: '2.0',
                method: 'vehicle',
                params: dto
            }
        );
    }

    /**
     * Retrieves model data based on product type and manufacturer
     *
     * @param {Object} dto ModelDataReqDTO
     * @returns {Promise}
     * @memberof HastingsVehicleInfoLookupService
     */
    static retrieveModels(dto = {}) {
        return BaseTransportService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            { 'Content-Type': 'application/json; charset=utf-8' },
            {
                jsonrpc: '2.0',
                method: 'models',
                params: dto
            }
        );
    }

    /**
     * Retrieves manufacturer data based on product type.
     *
     * @param {Object} dto ManufacturersDataReqDTO
     * @returns {Promise}
     * @memberof HastingsVehicleInfoLookupService
     */
    static retrieveManufacturers(dto = {}) {
        return BaseTransportService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            { 'Content-Type': 'application/json; charset=utf-8' },
            {
                jsonrpc: '2.0',
                method: 'manufacturers',
                params: dto
            }
        );
    }

    /**
     * Retrieves vehicle data based on vehicle registration.
     *
     * @param {Object} dto RegistrationReqDTO
     * @returns {Promise}
     * @memberof HastingsVehicleInfoLookupService
     */
    static retrieveVehicleDataBasedOnVRN(dto = {}) {
        return BaseTransportService.send(
            getProxiedServiceUrl('vehicleInfoLookup'),
            { 'Content-Type': 'application/json; charset=utf-8' },
            {
                jsonrpc: '2.0',
                method: 'registration',
                params: dto
            }
        );
    }
    // static retrieveVehicleDataBasedOnVRN(dto = {}) {
    //     return BaseTransportService.send(
    //         getProxiedServiceUrl('vehicleInfoLookup'),
    //         { 'Content-Type': 'application/json; charset=utf-8' },
    //         dto
    //     );
    // }
}
