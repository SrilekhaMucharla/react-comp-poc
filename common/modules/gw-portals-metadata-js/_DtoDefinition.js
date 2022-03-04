import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import StringUtil from 'gw-portals-util-js/StringUtil';
import Metadata from './NodeMetadataDefinition';
import Types from './_TypeReference';
/**
 * Creates a new DTO property description.
 * @param {Function} typeLinker function used to access information about related types.
 * @param {*} dtoType DTO type object.
 * @param {*} metadata property metadata.
 * @param {String} name property name.
 * @returns {Object}
 */
function createProperty(typeLinker, dtoType, metadata, name) {
    return Object.freeze({
        name,
        jsProperty: StringUtil.toSerializedPropertyName(name),
        type: Types.parseType(typeLinker, metadata.valueType),
        metadata: Metadata.createMetadata(metadata.metadata, []),
        dtoType,
        readOnly: metadata.readOnly
    });
}


export default {
    /**
     * Creates a new DTO definition from its serialized form. Returned object have following
     * properties and functions:
     * <dl>
     *     <dt>typeName</dt><dd>Name of the type represented by the mirror.</dd>
     *     <dt>metadata</dt><dd>Metadata (named and unnamed) defined on the type.</dd>
     *     <dt>properties</dt><dd>List of all properties defined on the DTO type.</dd>
     *     <dt>hasProperty(propName)</dt><dd>Checks if property with the
     *       <code>propName</code> is defined on the DTO.</dd>
     *     <dt>getProperty(propName)</dt><dd>Retrieves a property by its name.
     *       Throws Error if property is not found.</dd>
     *     <dt>metaType</dt><dd>Optional meta-type of the DTO type.</dd>
     *     <dt>xCenter</dt><dd>Reference back to the xcenter to which this dto belongs.</dd>
     * </dl>
     *
     * Each property definition have following properties and methods:
     * <dl>
     *     <dt>name</dt><dd>Property name.</dd>
     *     <dt>jsProperty</dt><dd>Name of the javascript property.
     *       It should be used to access this property on the frontend.</dd>
     *     <dt>type</dt><dd>Property type description.</dd>
     *     <dt>metadata</dt><dd>Metadata object with information about property.</dd>
     *     <dt>dtoType</dt><dd>Reference to the owning DTO type.</dd>
     * </dl>
     *
     * @param {*} xCenter xCenter instance for which this type belongs.
     * @param {Function} typeLinker function used to get an access
     *   to referenced types (like types of DTO properties).
     * @param {*} name type name.
     * @param {*} metadata DTO definition to parse.
     * @param {String} [metaType] optional meta-type data containing
     *   information about the type (like "isDto", etc...).
     * @returns {Object} DTO type definition.
     */
    createDTOInfo: (xCenter, typeLinker, name, metadata, metaType) => {
        const res = {
            typeName: name,
            xCenter,
            metadata: Metadata.createMetadata(metadata.metadata, metadata.namedMetadata)
        };

        /* PROPERTIES */
        const propMap = _.mapValues(
            metadata.properties,
            _.partial(createProperty, typeLinker, res)
        );
        res.properties = _.values(propMap);
        if (metaType) {
            res.metaType = metaType;
        }

        /* FUNCTIONS */
        res.hasProperty = (propName) => {
            return _.has(propMap, propName);
        };

        res.getProperty = (propName) => {
            const prop = MapUtil.get(propMap, propName);
            if (!prop) {
                throw new Error(`No property ${propName} is defined on type ${res.typeName}`);
            }
            return prop;
        };

        Object.freeze(res.properties);
        Object.freeze(res);
        return res;
    }
};
