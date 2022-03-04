import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import StringUtil from 'gw-portals-util-js/StringUtil';
import Typelists from './_TypelistDefinition';
import Dtos from './_DtoDefinition';

const metaTypeNames = ['dto', 'typelist'];
const metaTypes = {};

metaTypeNames.forEach((metaType) => {
    const metaObject = {
        kind: metaType
    };
    metaTypeNames.forEach((possibleMetaType) => {
        metaObject[`is${StringUtil.capitalizeFirstLetter(possibleMetaType)}`] = possibleMetaType === metaType;
    });
    metaTypes[metaType] = Object.freeze(metaObject);
});

const typeFactories = {
    'edgev10.metadata.typeinfo.dtoinfo.dto.DTOMetadataDTO': (typeRef, xCenter, typeName, typeMeta) => {
        return Dtos.createDTOInfo(xCenter, typeRef, typeName, typeMeta.value, metaTypes.dto);
    },
    'edgev10.metadata.typeinfo.typelistinfo.dto.TypelistMetadataDTO': (typeRef, xCenter, typeName, typeMeta) => {
        return Typelists.createTypelistInfo(xCenter, typeName, typeMeta.value, metaTypes.typelist);
    }
};

/* Parses a type metadata. */
function parseType(typeRef, xCenter, typeMeta, typeName) {
    const typeKindTranslator = MapUtil.get(typeFactories, typeMeta.type);
    if (!typeKindTranslator) {
        throw new Error(`Type metadata format ${typeMeta.type} was not recognized as a valid type metadata.`);
    }
    return typeKindTranslator(typeRef, xCenter, typeName, typeMeta);
}

/* Checks if type have a specific (meta-)type. */
function hasKind(kind, typeObject) {
    return typeObject.metaType.kind === kind;
}

export default {
    /**
     * Creates a representation of types belonging to an xcenter.
     *
     * Following properties and functions are defined on the object:
     * <dl>
     *     <dt>allTypes</dt><dd>List of all types defined for the xcenter</dd>
     *     <dt>dtoTypes</dt><dd>List of all DTO types defined for the xcenter</dd>
     *     <dt>typelists</dt><dd>List of typelists defined for the xcenter</dd>
     *     <dt>has([typeKind], typeName)</dt><dd>Checks if typeName is
     *       defined for the types. If typekind is passed,
     *       checks type presense of the specific kind.</dd>
     *     <dt>get([typeKind], typeName)</dt><dd>Retrieves a type by its name.
     *       Throws Error if type was not found.
     *       Searches for specific type kinds if two-arg version is used.
     *     <dt>getTypelist(typelistNameOrType)</dt><dd>Retrieves a typelist by
     *       either a type name or simple typelist
     *       name. Throws Error if typelist is not present in the xcenter</dd>
     * </dl>
     *
     * @param {Object} typesMeta information about types.
     * @param {*} xCenter reference back to an xCenter.
     *
     * @returns {Object}
     */
    createXCenterTypes: (typesMeta, xCenter) => {
        let typeMap = {};

        function getTypeRef(typeName) {
            if (!_.has(typesMeta, typeName)) {
                throw new Error(`Illegal reference to unknown type ${typeName}`);
            }
            return () => {
                return typeMap[typeName];
            };
        }

        typeMap = _.mapValues(typesMeta, _.partial(parseType, getTypeRef, xCenter));

        // eslint-disable-next-line no-underscore-dangle
        const _get = (...args) => {
            let guess;
            if (args.length === 2) {
                guess = MapUtil.get(typeMap, args[1]);
                if (!guess || !hasKind(args[0], guess)) {
                    throw new Error(`No ${args[0]} with name ${args[1]} is defined`);
                }
                return guess;
            }
            guess = MapUtil.get(typeMap, args[0]);
            if (!guess) {
                throw new Error(`No type with name ${args[0]} is defined`);
            }
            return guess;
        };

        return {
            allTypes: _.values(typeMap),
            dtoTypes: _.values(typeMap).filter(_.partial(hasKind, 'dto')),
            typelists: _.values(typeMap).filter(_.partial(hasKind, 'typelist')),
            has: (...args) => {
                if (args.length === 2) {
                    return _.has(typeMap, args[1]) && hasKind(args[0], typeMap[args[1]]);
                }
                return _.has(typeMap, args[0]);
            },
            get: _get,
            getTypelist: (typelistNameOrType) => {
                let newTypelistNameOrType = typelistNameOrType;
                /* Convert simple typelist name into the type name. */
                if (typelistNameOrType.indexOf('.') < 0) {
                    newTypelistNameOrType = `typekey.${typelistNameOrType}`;
                }
                return _get('typelist', newTypelistNameOrType);
            }
        };
    }
};
