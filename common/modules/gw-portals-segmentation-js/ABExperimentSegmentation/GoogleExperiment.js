/**
 * Provides variations from the Google Experiment
 *
 * @returns {Object}
 *
 * {Object}.googleExperiment {Number} Selected option for the user from the Google Experiment.
 *      E.g. 0 or 1. If GA is not loaded or experiment is not provided then -1 is returned
 *      The value is persisted in cookies
 */

export default class GoogleExperiment {
    constructor() {
        this.experiment = {};
    }

    loadExperimentScript(experimentId) {
        this.cachedExperimentId = experimentId;

        this.scriptLoaded = document.createElement('script');
        this.scriptLoaded.async = true;
        document.head.appendChild(this.scriptLoaded);
        this.scriptLoaded.src = `https://www.google-analytics.com/cx/api.js?experiment=${experimentId}`;
    }

    getExperimentValue(experimentId) {
        if (this.experiment[experimentId] !== undefined) {
            return Promise.resolve(this.experiment[experimentId]);
        }

        this.loadExperimentScript(experimentId);

        return new Promise((resolve, reject) => {
            this.scriptLoaded.onload = () => {
                this.experiment[experimentId] = window.cxApi.chooseVariation();
                resolve(this.experiment[experimentId]);
            };
            this.scriptLoaded.onerror = () => {
                reject(new Error('Error Loading Google Experiment script'));
            };
        });
    }
}
