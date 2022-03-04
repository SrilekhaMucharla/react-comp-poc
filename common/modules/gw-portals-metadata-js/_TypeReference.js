/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
import _ from 'lodash';
import StringUtil from 'gw-portals-util-js/StringUtil';
import PropDef from './_PropertyDefinitionUtil';

/** Kind initializers. Receives resulting object, class definition and class link resolver. */
const kindConstructors = {
    primitive: (obj, def) => {
        obj.name = def.name;
    },
    collection: (obj, def, classResolver) => {
        obj.elementType = _parseType(classResolver, def.elementType);
    },
    stringMap: (obj, def, classResolver) => {
        obj.valueType = _parseType(classResolver, def.valueType);
    },
    class: (obj, def, classResolver) => {
        obj.name = def.className;
        Object.defineProperty(
            obj, 'typeInfo',
            PropDef.toPropertyDef(classResolver(def.className))
        );
    }
};

/** All supported type kinds. */
const kinds = _.keys(kindConstructors);

/**
 * Defines kind properties on the object.
 * @param {Object} obj object to define properties on.
 * @param {*} kind object (type) kind.
 */
function _defineKinds(obj, kind) {
    // eslint-disable-next-line no-param-reassign
    obj.kind = kind;
    kinds.forEach((k) => {
        // eslint-disable-next-line no-param-reassign
        obj[`is${StringUtil.capitalizeFirstLetter(k)}`] = k === kind;
    });
}


/* See parse type on exports. */
function _parseType(classResolver, definition) {
    // eslint-disable-next-line no-prototype-builtins
    if (!kindConstructors.hasOwnProperty(definition.kind)) {
        throw new Error(`Unsupported type kind ${definition.kind}`);
    }
    const res = {};
    _defineKinds(res, definition.kind);
    kindConstructors[definition.kind](res, definition, classResolver);
    Object.freeze(res);

    return res;
}


export default {
    /**
     * Parses a type metadata representation and returns a "type reference"
     *   object. Type reference is more like a
     * type name (i.e. string, edge.dto.SampleDTO, int[][]) rather than the
     *   type information ("this type have these properties").
     *
     * Common functions/properties (applicable for each kind of types) are:
     * <dl>
     *     <dt>kind</dt> <dd>Kind of the type (class, collection, primitive, stringMap).</dd>
     *     <dt>isClass, isCollection, isPrimitive, isStringMap</dt>
     *       <dd>Properties used to verify if dto have
     *       a corresponding kind. Equivalent to "kind === ..."<dd>
     * </dl>
     *
     * Depending on the type, there could be additional properties.
     * They are (for the appropriate kinds):
     * <dl>
     *     <dt>primitive</dt><dd><dl>
     *         <dt>name</dt><dd> name of the primitive type</dd>
     *     </dl></dd>
     *     <dt>collection</dt><dd><dl>
     *         <dt>elementType</dt><dd> type of the element in the collection</dd>
     *     </dl></dd>
     *     <dt>stringMap</dt><dd><dl>
     *         <dt>valueType</dt><dd> type of the value in the map</dd>
     *     </dl></dd>
     *     <dt>class</dt><dd><dl>
     *         <dt>name</dt><dd> name of the class</dd>
     *         <dt>typeInfo</dt><dd> metadata about the referenced type (class mirror).</dd>
     *     </dl></dd>
     * </dl>
     *
     * @param classResolver function used to access "referenced class"
     * in the type hierarchy. It could return either:
     * <ul>
     *     <li>No-arg function which returns a type metadata (lazy initialization).
     *     <li>Non-functional value describing the destination type.
     * </ul>
     * This style allows the <code>classResolver</code> to validate
     * type name before the type metadata is constructed.
     * @param definition type definition (taken from the metadata).
     */
    parseType: _parseType,

    /**
     * Creates a type info factory using class data resolver.
     *
     * @param {*} classResolver
     * @returns {Function}
     */
    createFactory: (classResolver) => {
        return _.partial(_parseType, classResolver);
    }
};
