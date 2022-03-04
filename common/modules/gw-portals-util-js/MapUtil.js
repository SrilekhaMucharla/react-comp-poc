/* eslint-disable import/no-dynamic-require */
import _ from 'lodash';

// eslint-disable-next-line import/no-unresolved
import appConfig from 'app-config';

export default {
    /**
     * "Safer" version of accessor which retrieves object's own properties only.
     * @param {Array} map
     * @param {*} prop
     * @returns {*}
     */
    get: (map, prop) => {
        if (!_.has(map, prop)) {
            return undefined;
        }

        return map[prop];
    },

    /**
     * Converts items list into the unique map.
     * @param {Array} items items to convert into the map.
     * @param {Function|String} keyFunctionOrProperty function used to access a key
     *                          or name of the key property.
     * @returns {Object} map from key to object.
     * @throws Error if key is not unique.
     */
    toUniqueMap: (items, keyFunctionOrProperty) => {
        const res = {};
        const keyFunction = _.isFunction(keyFunctionOrProperty)
            ? keyFunctionOrProperty
            : _.property(keyFunctionOrProperty);
        items.forEach((item) => {
            const key = keyFunction(item);
            if (_.has(res, key)) {
                throw new Error(`Duplicate key ${key} found`);
            }
            res[key] = item;
        });
        return res;
    },

    getApiKey: () => {
        try {
            // https://developers.google.com/maps/documentation/javascript/get-api-key
            const { googleMapsApiKey } = appConfig.credentials;

            if (_.isNil(googleMapsApiKey) || _.isEmpty(googleMapsApiKey) || googleMapsApiKey === 'ENTER GOOGLE MAPS API KEY HERE') {
                throw new Error('No API key applied');
            }

            return googleMapsApiKey;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Please include a google maps API key to the config.json file in the config directory.');
            return undefined;
        }
    },

    getLibraries: () => {
        try {
            return appConfig.googleMaps.libraries;
        } catch (error) {
            return undefined;
        }
    },

    getMapVersion: () => {
        try {
            return appConfig.googleMaps.version;
        } catch (error) {
            return undefined;
        }
    }
};
