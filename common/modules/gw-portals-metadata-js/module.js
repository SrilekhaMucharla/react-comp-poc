import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import XCenterTypes from './_XCenterTypes';

/* Parses an XCenter definition object. */
function parseXCenter(meta, name) {
    const res = {
        name
    };
    res.types = XCenterTypes.createXCenterTypes(meta, res);
    return Object.freeze(res);
}

export default {
    /**
     * Parses Insurance suite metadata information.
     * Returned object have following properties and functions:
     * <dl>
     *     <dt>xcenters</dt><dd>List of all xcenter objects defined in
     *     the configuration.<dd>
     *     <dt>has(xcenter)</dt><dd>Checks if this suite have metadata for
     *     the specific xcenter type.</dd>
     *     <dt>get(xcenter)</dt><dd>Returns xcenter metadata. Throws error
     *     if xcenter metadata is not defined.</dd>
     * </dl>
     *
     * Each xcenter metadata object have following method and properties:
     * <dl>
     *     <dt>name</dt><dd>xcenter name.</dd>
     *     <dt>types</dt><dd>type metadata object containing information about
     *     types defined in the xcenter.</dd>
     * </dl>
     *
     * @param {Object} metadata
     * @returns {Object}
     */
    createSuiteMetadata: (metadata) => {
        const xcenterMap = _.mapValues(metadata, _.partial(parseXCenter));
        return {
            xcenters: _.values(xcenterMap),
            has: (xcenter) => {
                return _.has(xcenterMap, xcenter);
            },
            get: (xcenter) => {
                const res = MapUtil.get(xcenterMap, xcenter);
                if (!res) {
                    throw new Error(`No xcenter ${xcenter} is defined`);
                }
                return res;
            }
        };
    }
};
