import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import Metadata from './NodeMetadataDefinition';
import PropDef from './_PropertyDefinitionUtil';

const typePrefix = 'typekey.';

/* Returns typelist name based on its type. */
function getTypelistName(type) {
    if (typePrefix !== type.substring(0, typePrefix.length)) {
        throw new Error(`Illegal typelist type  name ${type}`);
    }
    return type.substring(typePrefix.length);
}


/* Creates a new filter. */
function newFilter(typelist, codeMap, filter) {
    const lookupCode = (code) => {
        const codeInfo = MapUtil.get(codeMap, code);
        if (!codeInfo) {
            throw new Error(`Bad reference to ${code} from filter ${filter.name} on typelist ${typelist}`);
        }
        return codeInfo;
    };

    const referencedCodes = filter.includedCodes.map(lookupCode);

    const res = {
        name: filter.name,
        codes: referencedCodes,

        allows: (codeOrCodeName) => {
            return _.some(referencedCodes, (code) => {
                return code === codeOrCodeName || code.code === codeOrCodeName;
            });
        }
    };

    Object.freeze(res);
    Object.freeze(res.codes);

    return res;
}


/* Creates a new typecode draft. */
function newCode(typelist, code) {
    const res = {
        code: code.code,
        priority: code.priority,
        typelist,
        belongsToCategory: (categoryCode) => {
            return _.some(code.categories, (cat) => {
                return cat.typecode === categoryCode.code
                    && cat.typelist === categoryCode.typelist.name;
            });
        }
    };
    Object.defineProperty(res, 'name', PropDef.toPropertyDef(code.displayKey));
    Object.freeze(res);

    return res;
}


/** Creates a new typelist definition.
 * @param {*} xCenter xCenter to which this typelist belongs.
 * @param {String} type typelist's type name.
 * @param {Object} meta typelist metadata.
 * @param {*} [metaType] meta-type of the typelist.
 * @returns {Object}
 */
function newTypelist(xCenter, type, meta, metaType) {
    const res = {
        typeName: type,
        xCenter,
        name: getTypelistName(type),
        metadata: Metadata.createMetadata([], meta.namedMetadata)
    };
    res.codes = meta.codes.map(_.partial(newCode, res));

    /* Fields. */
    if (metaType) {
        res.metaType = metaType;
    }
    const codeMap = MapUtil.toUniqueMap(res.codes, 'code');
    res.filters = meta.filters.map(_.partial(newFilter, type, codeMap));
    const filterMap = MapUtil.toUniqueMap(res.filters, 'name');

    /* Functions. */
    res.getCode = (code) => {
        if (!_.has(codeMap, code)) {
            throw new Error(`Typelist ${type} do not have a typecode ${code}`);
        }
        return codeMap[code];
    };
    res.getCodesForCategory = (category) => {
        return res.codes.filter((code) => {
            return code.belongsToCategory(category);
        });
    };
    res.hasCode = (codeName) => {
        return _.has(codeMap, codeName);
    };
    res.getFilter = (name) => {
        if (!_.has(filterMap, name)) {
            throw new Error(`Typelist ${type} do not have a filter ${name}`);
        }
        return filterMap[name];
    };
    res.hasFilter = (name) => {
        return _.has(filterMap, name);
    };

    Object.freeze(res.codes);
    Object.freeze(res.filters);
    Object.freeze(res);

    return res;
}


export default {
    /**
     * Creates a new typelist representation.
     * Typelist have following properties and methods:
     * <dl>
     *     <dt>name</dt> <dd>simple typelist name.</dd>
     *     <dt>typeName</dt> <dd>typelist's type name.</dd>
     *     <dt>metadata</dt> <dd>metadata defined on the typelist.<dd>
     *     <dt>codes</dt> <dd>array of all codes on the typelist</dd>.
     *     <dt>hasCode(codeName)</dt> <dd>Checks if typecode with the
     *       specific name is defined for the typelist.</dd>
     *     <dt>getCode(code)</dt> <dd>returns typecode by its name.
     *       Throws an exception if no type code is defined.</dd>
     *     <dt>getCodesForCategory(code)</dt> <dd>returns an array of codes
     *       in a category defined by another typekey.</dd>
     *     <dt>filters</dt> <dd>array of all type filters defined on the typelist</dd>.
     *     <dt>getFilter(filterName)</dt> <dd>returns filter by its name.
     *       Throws an exception if filter could not be found.</dd>
     *     <dt>hasFilter(filterName)</dt><dd>Checks if typelist have a filter
     *       with the specific name.</dd>
     *     <dt>xcenter</dt><dd>Reference back to the xcenter to which this dto belongs.</dd>
     * </dl>
     *
     * Typecodes have following methods and properties:
     * <dl>
     *     <dt>code</dt><dd> code of the item</dd>
     *     <dt>priority</dt> <dd> priority of the typecode</dd>
     *     <dt>name</dt> <dd>(translateable) typecode name</dd>
     *     <dt>typelist</dt> <dd>reference back to a typelist instance</dd>
     *     <dt>belongsToCategory(code)<dt> <dd>checks if this typekey belongs to a category</dd>
     * </dl>
     *
     * Each filter have following methods and properties:
     * <dl>
     *     <dt>name</dt> <dd>name of the filter.</dd>
     *     <dt>codes</dt> <dd>typecodes included in the filter.</dd>
     *     <dt>allows(typecodeOrCodeName)</dt><dd> checks if this filter has
     *       this typecode in it</dt>
     * </dl>
     *
     * @param {*} xCenter xCenter to which this typelist belongs.
     * @param {String} typeName type name.
     * @param {Object} meta typelist metadata.
     * @param {*} [metaType] optional meta-type definition.
     *   If present, could define some meta-properties (like
     *   isTypelist, isDTOType, etc...)
     * @returns {Object} typelist information.
     */
    createTypelistInfo: (xCenter, typeName, meta, metaType) => {
        return newTypelist(xCenter, typeName, meta, metaType);
    }
};
