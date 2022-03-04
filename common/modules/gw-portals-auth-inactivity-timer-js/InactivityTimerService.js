import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import config from 'app-config';
import InactivityTimer from './InactivityTimer';

const { sessionConfig, authentication: authConfig } = config;

function getConfig() {
    if (_.isNil(authConfig)) {
        return undefined;
    }
    const serverConfig = _.get(authConfig, `servers.${authConfig.authServer}`);
    return { ...authConfig, ...serverConfig };
}

function InactivityTimerService() {
    const oAuthConfig = getConfig();
    return InactivityTimer({
        oAuthConfig,
        logoutWarningCallback: console.log,
        inactivityIntervalMins: _.get(sessionConfig, 'inactivityIntervalMins'),
        logoutConfirmationIntervalMins: _.get(sessionConfig, 'logoutConfirmationIntervalMins')
    });
}

export default InactivityTimerService;
