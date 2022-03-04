import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { BaseTransportService } from 'gw-portals-transport-js';

export default class HastingsAccountService {
    /**
     * set user entered password as new password.
     *
     * @param {Object} passwordObject code
     * @returns {Promise}
     * @memberof HastingsAccountService
     */
    static setNewPassword(passwordObject) {
        return BaseTransportService.send(
            getProxiedServiceUrl('account'),
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
            {
                jsonrpc: '2.0',
                method: 'setNewPassword',
                params: [passwordObject]
            }
        );
    }
}
