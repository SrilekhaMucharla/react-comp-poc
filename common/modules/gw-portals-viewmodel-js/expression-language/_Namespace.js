/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable prefer-rest-params */
import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
/**
 * Mutable namespace, see module docs.
 * @param {String} nsId
 * @param {Array} [initialMap]
 * @returns {Object}
 */
function createMutableNamespace(nsId, initialMap) {
    const container = {};

    function registerType(typeName, funcs) {
        if (_.has(container, typeName)) {
            throw new Error(`Type ${typeName} is already defined in ${nsId}`);
        }
        container[typeName] = funcs;
    }

    if (initialMap) {
        _.each(initialMap, (funcs, type) => {
            registerType(type, funcs);
        });
    }

    return {
        hasType: (typeName) => {
            return _.has(container, typeName);
        },
        getFunction: (typeName, functionName) => {
            const typeSpec = MapUtil.get(container, typeName) || {};
            return MapUtil.get(typeSpec, functionName);
        },
        registerType
    };
}

/**
 * Creates a composite namespace, see module docs.
 * @returns {Object}
 */
function createCompositeNamespace() {
    const peers = Array.prototype.slice.call(arguments);

    return {
        hasType: (typeName) => {
            return peers.some((peer) => {
                return peer.hasType(typeName);
            });
        },
        getFunction: (typeName, functionName) => {
            const declaringPeer = _.find(peers, (peer) => {
                return peer.hasType(typeName);
            });

            if (declaringPeer) {
                return declaringPeer.getFunction(typeName, functionName);
            }
        }
    };
}

/** Module used to create different types of namespaces.
 *
 * <h1>Types and interfaces.</h1>
 * <h2>Namespace</h2>
 * Namespace defines a way to lookup types and functions based on the input parameters. Each namespace have following
 * functions and properties:
 * <dl>
 *     <dt>getFunction(typeName : String, functionName : String) : Function</dt>
 *       <dd>Returns a function belonging to a given type. Returns undefined if there is no such function or type
 *       in this namespace</dd>
 *     <dt>hasType(typeName: String) : boolean</dt><dd>Checks if type is defined in the namespace.</dd>
 * </dl>
 */
export default {
    /** Creates a new modifiable (mutable) namespace. Returned object is a namespace with the following
     * additional functions:
     * <dl>
     *     <dt>registerType(typeName : String, funcs : Map&lt;String, Function$gt;)</dt>
     *       <dd>Registers a type with the specific name and static function on that type. Throws an Error if
     *         type is already defined inside the namespace.</dd>
     * </dl>
     * @param {String} nsId identifier of the namespace, used for debug purposes and error reporting.
     * @param {Object} [initialMap] initial values, map from type to function in this type.
     * @returns {Namespace} with additional mutation functions.
     */
    createMutableNamespace,

    /**
     * Creates a new read-only composite namespace. This namespace tries to find a type in all child namespaces
     * and returns value from the first one.
     * Receives peer (child) namespaces an an input.
     */
    createCompositeNamespace
};
