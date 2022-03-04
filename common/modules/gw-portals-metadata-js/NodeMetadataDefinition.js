/* eslint-disable consistent-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';

/* Puts an item into the meta map. */
function _put(map, meta) {
    if (!_.has(map, meta.type)) {
        map[meta.type] = [];
    }
    map[meta.type].push(meta.value);
}

/* Puts all items into the map. */
function _putAll(meta, items) {
    for (const item of items) {
        _put(meta, item);
    }
}


/* Puts named annotation into the named map. */
function _putNamed(namedMetas, items) {
    if (!namedMetas.hasOwnProperty(items.name)) {
        namedMetas[items.name] = {};
    }
    _put(namedMetas[items.name], items.metadata);
}


/* Chooses a map to use for the given name. */
function _chooseMap(allMap, unnamedMap, namedMaps, name) {
    if (_.isUndefined(name)) {
        return allMap;
    }

    if (name === null) {
        return unnamedMap;
    }

    return MapUtil.get(namedMaps, name) || {};
}


/**
 * Generates an error "description".
 * @param {String} message
 * @param {String} type
 * @param {String} name
 * @private
 */
function _fail(message, type, name) {
    if (_.isUndefined(name)) {
        throw new Error(`${message} with type ${type}`);
    }
    if (name === null) {
        throw new Error(`${message} with type ${type} and without name`);
    }

    throw new Error(`${message} with type ${type} and name ${name}`);
}

const emptyMeta = Object.freeze([]);
function _createMetadata(unnamedMetadata, namedMetadata) {
    unnamedMetadata = unnamedMetadata || [];
    namedMetadata = namedMetadata || [];

    const allMap = {};
    const unnamedMap = {};
    const namedMaps = {};

    _putAll(allMap, unnamedMetadata);
    _putAll(unnamedMap, unnamedMetadata);
    namedMetadata.forEach((namedMeta) => {
        _putNamed(namedMaps, namedMeta);
        _put(allMap, namedMeta.metadata);
    });

    function getMeta(typeName, name) {
        const mapToUse = _chooseMap(allMap, unnamedMap, namedMaps, name);
        return MapUtil.get(mapToUse, typeName) || emptyMeta;
    }

    /**
     * Returns all named metadata.
     * @param {String} name
     * @returns {Array}
     */
    function getNamed(name) {
        return _.flatten(_.values(MapUtil.get(namedMaps, name) || {}), true);
    }

    return Object.freeze({
        get: getMeta,
        getOne: (typeName, name) => {
            const props = getMeta(typeName, name);
            if (props.length < 1) {
                _fail('Could not find metadata', typeName, name);
            }
            if (props.length > 1) {
                _fail(`Too many metadata (${props.length})`, typeName, name);
            }

            return props[0];
        },
        getOptional: (typeName, name) => {
            const props = getMeta(typeName, name);
            if (props.length > 1) {
                _fail(`Too many metadata (${props.length})`, typeName, name);
            }

            if (props.length < 1) {
                return;
            }
            return props[0];
        },
        getNamed,
        getOneNamed: (name) => {
            const res = getNamed(name);
            if (res.length < 1) {
                throw new Error(`Could not find named metadata ${name}`);
            }
            if (res.length > 1) {
                throw new Error(`Too many metadata (${res.length}) for name ${name}`);
            }
            return res[0];
        },
        getOptionalNamed: (name) => {
            const res = getNamed(name);
            if (res.length > 1) {
                throw new Error(`Too many metadata (${res.length}) for name ${name}`);
            }
            if (res.length < 1) {
                return;
            }
            return res[0];
        },
        has: (typeName, name) => {
            return getMeta(typeName, name).length > 0;
        },
        types: (name) => {
            const mapToUse = _chooseMap(allMap, unnamedMap, namedMaps, name);
            return _.keys(mapToUse);
        },
        names: Object.freeze(_.keys(namedMaps)),
        _namedArray: namedMetadata,
        _unnamedArray: unnamedMetadata
    });
}


function _merge(...args) {
    if (args.length === 1) {
        return args[0];
    }

    const named = [];
    const unnamed = [];

    for (let i = 0; i < args.length; i += 1) {
        named.push(...args[i]._namedArray);
        unnamed.push(...args[i]._unnamedArray);
    }
    return _createMetadata(unnamed, named);
}

export default {
    /** Constant: empty metadata. */
    EMPTY: _createMetadata([], []),

    /**
     * Creates a new metadata representation object.
     * Metadata object have following properties and methods:
     * <dl>
     *     <dt>get(typeName, [name])</dt><dd> returns array of metadata with
     *     he given metadata type.</dd>
     *     <dt>getOne(typeName, [name])</dt><dd> returns exactly one metadata of
     *     the given type. Throws an
     *     Error if there is no metadata or more than one items with the same name.</dd>
     *     <dt>getOptional(typeName, [name])</dt><dd> returns an "optional" item.
     *     Returns metadata representation
     *       when it is defined. Returns undefined if there is no metadata with
     *       the given name. Throws an Error
     *       if there is no metadata with the given type.</dt>
     *     <dt>has(typeName, [name])</dt><dd> checks if a metadata have at
     *      least one metadata item with the given
     *       type.
     *     <dt>types([name])</dt><dd>Metadata types defined for the
     *     specific metadata name or without the name.</dd>
     *     <dt>getNamed(name)</dt><dd>Returns all items of named metatada for the given type.</dd>
     *     <dt>getOneNamed(name)</dt><dd>Returns exactly one named item.</dd>
     *     <dt>getOptionalNamed(name)</dt><dd>Returns at most one named metadata</dd>
     *     <dt>names</dt><dd>Array of possible metadata names (excluding null).</dd>
     * </dl>
     * Functions with optional <code>name</code> argument works with both named
     * and unnamed metadata. By default
     * (when name is not defined or passed) it takes both named and unnamed
     * arguments into the account. When name
     * is passed, only named metadata of that name is taken into the account.
     * When name is <code>null</code> then
     * only unnamed metadata is taken into the account.
     *
     * @param [unnamedMetadata=[]] unnamed metadata items.
     * @param [namedMetadata=[]] named metadata items.
     */
    createMetadata: _createMetadata,
    /**
     * Merges metadata into one object. This method could be used to evaluate
     * effective metadata based on
     * multiple (inherited) objects. This function is applicable to any number of arguments.
     */
    merge: _merge
};
