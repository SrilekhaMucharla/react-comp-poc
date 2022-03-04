/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import _ from 'lodash';

import _VMFactory from './_VMFactory';
import _Step from './build/_Step';

export default {
    /**
     * A factory function that returns a service that is used to create view models from simple data object and back again
     *
     * @param {Object} insuranceSuiteMetaData : Object returned from InsuranceSuiteMetadata.createSuiteMetadata
     *
     * @returns {Object} : exported view model functions
     **/
    get: (insuranceSuiteMetaData) => {
        const aspectFactories = [];
        const config = {};


        /**
         * View model objects hold data and aspect properties for binding to UI components
         * This service is responsible for creating a view model object from a plain data object and converting back to plain
         * data for sending back to the server.
         *
         */
        return {
            /**
             * Add a factory function to the list of functions that are called to add aspect properties to the view model
             * An aspect is the term used for a set of synthetic properties that are added to a view model. OOTB example would be
             * a validation aspect that adds a 'validity' property to view model nodes
             *
             * @param {Function} aspectFactory : Function to create aspect properties on a view model
             *
             **/
            addAspectFactory: (aspectFactory) => {
                aspectFactories.push(aspectFactory);
            },

            configure: (newConf) => _.extend(config, newConf),

            /**
             * Creates the view model.
             *
             * @param {Object} rawData : initial data object for view model.
             * @param {String} xCenter : The xCenter value to use.
             * @param {String} dtoPath - The DTO path
             * @param {Object} [initialContext={}] - The initial context for the DTO, defaults to '{}'
             *
             * @returns {Object}: The view model object
             **/
            create: (rawData, xCenter, dtoPath, initialContext = {}) => {
                const clonedRawData = _.cloneDeep(rawData);
                const metadataNode = insuranceSuiteMetaData.get(xCenter).types.get(dtoPath);

                if (metadataNode.metaType.isTypelist) {
                    throw new Error(`View model objects can only be created from DTO types not Typelists ${dtoPath}`);
                }

                const rootMetadataInfo = _Step.root(xCenter, metadataNode, initialContext);
                return _VMFactory(aspectFactories, config).create(clonedRawData, rootMetadataInfo);
            },

            /**
             * Creates a new view model object by changing context of the one given as an argument.
             *
             * @param {Object} viewModel an existing viewModel
             * @param {Object} newContext the context object that will be used to generate the new viewmodel
             *
             * @returns {Object} a new view model with a different context
             */
            changeContext(viewModel, newContext) {
                const type = viewModel._dtoName;
                const xCenter = viewModel._xCenter;
                const vmContext = viewModel.aspects.context();
                const enrichedContext = Object.assign({}, vmContext, newContext);
                return this.create(viewModel.value, xCenter, type, enrichedContext);
            },

            /**
             * Clones a view model using the existing one.
             *
             * @param {Object} viewModel an existing viewModel
             *
             * @returns {Object} a new view model
             */
            clone(viewModel) {
                const type = viewModel._dtoName;
                const xCenter = viewModel._xCenter;
                const value = _.cloneDeep(viewModel.value);
                const context = viewModel._metadataInfo.externalContext || {};
                return this.create(value, xCenter, type, context);
            }
        };
    }
};
