import _ from 'lodash';

// eslint-disable-next-line import/no-unresolved
import appConfig from 'app-config';
import { getProxiedUrl } from 'gw-portals-url-js';

const supportedJobTypes = ['Submission', 'PolicyChange', 'Cancellation', 'Renewal'];

function getJobDetailURLByJobType(type, jobNumber) {
    let redirectPath = '';
    switch (type) {
        case 'Submission': {
            redirectPath = `/quotes/${jobNumber}/summary`;
            break;
        }
        case 'PolicyChange': {
            redirectPath = `/change/${jobNumber}/summary`;
            break;
        }
        case 'Cancellation': {
            redirectPath = `/cancellation/${jobNumber}/summary`;
            break;
        }
        case 'Renewal': {
            redirectPath = `/renewal/${jobNumber}/summary`;
            break;
        }
        default: {
            break;
        }
    }

    return redirectPath;
}

function openJobInXCenter(jobNumber) {
    const { fixedPCJobURL } = appConfig;
    const policyCenterURL = fixedPCJobURL || getProxiedUrl('pc/GatewayPortal.do');

    window.location.href = `${policyCenterURL}?JobNumber=${jobNumber}`;
}

function isSupportJobType(type) {
    return _.includes(supportedJobTypes, type);
}

export default {
    getJobDetailURLByJobType: (type, jobNumber) => {
        return getJobDetailURLByJobType(type, jobNumber);
    },
    openJobInXCenter: (jobNumber) => {
        return openJobInXCenter(jobNumber);
    },
    isSupportJobType: (type) => {
        return isSupportJobType(type);
    }
};
