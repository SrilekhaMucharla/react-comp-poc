import { ABExperimentService } from 'gw-capability-segmentation';

/**
 * Provides variations from a Guidewire service
 *
 * getExperimentVariant {Promise}
 *      It fulfils with a selected option for the user.
 *      E.g. 0 or 1. In case of an error -1 is returned
 *      The value is persisted in cookies
 */

export default class DemoGuidewireExperiment {
    constructor() {
        this.experiment = {};
    }

    loadExperiment(experimentId) {
        return ABExperimentService.getExperimentValue(experimentId, null)
            .then(({ experimentResponse }) => {
                this.experiment[experimentId] = experimentResponse;
                return experimentResponse;
            }).catch(() => {
                throw Error('Error with Guidewire Experiment');
            });
    }

    /**
     * @param {String} [experimentId]
     * @param {Object} [params]
     *
     * @returns {Promise}
     */
    getExperimentValue(experimentId = 'guidewireExperiment') {
        // check experiment is already loaded
        if (this.experiment[experimentId] !== undefined) {
            return Promise.resolve(this.experiment[experimentId]);
        }

        return this.loadExperiment(experimentId);
    }
}
