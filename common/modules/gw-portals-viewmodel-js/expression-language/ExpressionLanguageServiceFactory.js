import InsuranceSuiteMetadataServiceFactory from 'gw-portals-metadata-js';
import ExpressionLanguage from './ExpressionLanguage';

/**
 * @callback translator
 * @param {string|{id: string, defaultMessage: string}} displayKey the displayKey to translate
 * @param {...object} [args] an arbitrary number of arguments for the translation
 * @returns {string}
 */

export default {
    /**
     * Creates an Expression Language Service using either the
     * provided metadata or the given InsuranceSuiteMetadataService
     * @param {Object} options if passed an `InsuranceSuiteMetadataService`
     * it will use that to create a new Expression Language Service,
     *  otherwise `metadata` must be passed in order to created a new
     *  Insurance Suite Metadata Service.
     *  If both `metadata` and  `InsuranceSuiteMetadataService` are
     *  passed, only the second is taken into consideration.
     * @param {Object} [options.metadata] metadata used to create a new
     * MetadataService used by the returned Expression Language Service
     * @param {Object} [options.insuranceSuiteMetadataService] if this is
     * passed, it supersedes the `metadata` option
     *  and uses the given MetadataService to create an Expression Language Service
     * @param {translator} [options.translator] the translator
     * function taking a display key and an arbitrary number of parameters
     * @returns {Object} an ExpressionLanguageService
    */
    get: ({
        metadata,
        insuranceSuiteMetadataService,
        translator
    }) => {
        const metadataService = insuranceSuiteMetadataService
            || InsuranceSuiteMetadataServiceFactory.createSuiteMetadata(metadata);
        const translateFn = (displayKey, ...args) => {
            return translator ? translator(displayKey, args) : displayKey;
        };

        const typekeyLookupFn = (xCenter, typekey, typecode) => {
            return metadataService.get(xCenter).types.get('typelist', `typekey.${typekey}`).getCode(typecode);
        };

        return ExpressionLanguage.createExpressionLanguage(translateFn, typekeyLookupFn);
    }
};
