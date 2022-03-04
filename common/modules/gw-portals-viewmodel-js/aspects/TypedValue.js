import _ from 'lodash';
import ExpressionLanguage from '../expression-language';
/* eslint-disable prefer-destructuring */
const NONSENSE = ExpressionLanguage.NONSENSE;

function intParser(v) {
    if (typeof v === 'number') {
        return v;
    }
    if (typeof v === 'string') {
        // eslint-disable-next-line radix
        const nv = Number.parseInt(v);
        return Number.isNaN(nv) ? NONSENSE : nv;
    }
    return NONSENSE;
}

function numberParser(v) {
    if (typeof v === 'number') {
        return v;
    }
    if (typeof v === 'string') {
        const nv = Number.parseFloat(v);
        return Number.isNaN(nv) ? NONSENSE : nv;
    }
    return NONSENSE;
}

function booleanParser(v) {
    if (typeof v === 'boolean') {
        return v;
    }
    if (typeof v === 'string') {
        return v.toLowerCase().trim() === 'true';
    }
    return NONSENSE;
}

function dateParser(v) {
    if (typeof v === 'string') {
        return new Date(v);
    }
    if (v instanceof Date) {
        return v;
    }
    if (typeof v === 'number') {
        return new Date(v);
    }
    return NONSENSE;
}


const primitiveConverters = {
    byte: intParser,
    Byte: intParser,
    short: intParser,
    Short: intParser,
    char: _.identity,
    Char: _.identity,
    int: intParser,
    Integer: intParser,
    long: intParser,
    Long: intParser,
    BigInteger: intParser,

    float: numberParser,
    Float: numberParser,
    double: numberParser,
    Double: numberParser,
    BigDecimal: numberParser,

    String: _.identity,
    boolean: booleanParser,
    Boolean: booleanParser,
    Date: dateParser
};

function converterForType(type) {
    switch (type.kind) {
        case 'primitive':
            return primitiveConverters[type.name] || _.identity;
        default:
            return _.identity;
    }
}


/* Invokes a converter. */
function access(node, converter) {
    const v = node.value;
    if (v === null || v === undefined) {
        return v;
    }
    return converter(v);
}


function getAspectProperties(currentViewModelNode, currentMetadataNode) {
    const converter = converterForType(currentMetadataNode.valueType);
    return {
        typedValue: {
            get: access.bind(null, currentViewModelNode, converter)
        }
    };
}

export default {
    getAspectProperties
};
