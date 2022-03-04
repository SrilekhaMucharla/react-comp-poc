/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import CompilationContext from './_CompilationContext';

const NONSENSE = CompilationContext.NONSENSE;
const cleanse = CompilationContext.cleanse;

/** Common (global) operator namespace. */
const operators = {
    ':sys:ops:': {
        and: (exprs, exprArgs) => {
            let hasNonsense = false;
            for (const expr of exprs) {
                const v = cleanse(expr(exprArgs));
                if (v === NONSENSE) {
                    hasNonsense = true;
                } else if (!v) {
                    return false;
                }
            }
            return hasNonsense ? NONSENSE : true;
        },
        or: (exprs, exprArgs) => {
            let hasNonsense = false;
            for (const expr of exprs) {
                const v = cleanse(expr(exprArgs));
                if (v === NONSENSE) {
                    hasNonsense = true;
                } else if (v) {
                    return true;
                }
            }
            return hasNonsense ? NONSENSE : false;
        }
    }
};


const eqf = (a, b) => {
    if (a === b) {
        return true;
    }
    if (a && a.code && a.typelist) {
        a = a.code;
    }

    if (_.isUndefined(a)) {
        a = null;
    }

    if (b && b.code && b.typelist) {
        b = b.code;
    }

    if (_.isUndefined(b)) {
        b = null;
    }

    return a === b;
};

/** Common (global) function/type namespace. */
const baseFunctions = {
    ':sys:ops:': {
        eq: eqf,
        neq: (a, b) => {
            return !eqf(a, b);
        },
        less: (a, b) => {
            return a < b;
        },
        greater: (a, b) => {
            return a > b;
        },
        lessOrEqual: (a, b) => {
            return a <= b;
        },
        greaterOrEqual: (a, b) => {
            return a >= b;
        },
        not: (v) => {
            return !v;
        },
        lessOrEqualToNextYear: (v) => {
            return (new Date().getFullYear() + 1) >= v;
        }
    }
};


/* Default typekey lookup function. Throws an exception on each access. */
function defaultLookupType(xcenter, typelist /* , typekey*/) {
    throw new Error(`Could not find typelist ${typelist} in the xcenter ${xcenter}`);
}


/** Creates a new expression language with a given translation provider.
 * @param {Function} translate translation function.
 * @param {Function} [typekeyLookup] function used to lookup the typekeys. This function have a type
 *   (xcenter : String, typelistName : String, typecodeName : String) : Typecode. XCenter could be null to indicate
 *   that typekey was requested in the generic context.
 *
 *  @returns {Object}
 */
function createExpressionLanguage(translate, typekeyLookup) {
    typekeyLookup = typekeyLookup || defaultLookupType;
    const commonContext = CompilationContext.createRootContext(operators, baseFunctions, translate, typekeyLookup);

    /** Compilation contexts for each xCenter instance. */
    const xCenterContexts = {};


    return {
        /** Returns a compilation context.
         * <p>If xCenter is not provided, returns a common context. Types registered in
         * the common context would be available in all xCenters. It is not possible to register a type which is already
         * defined for any xCenter. However, expressions could see only functions defined in this common context.
         * <p>If xCenter is provided, xcenter-specific context is returned. It is possible to register a type which
         * would be accessible to this context only (however, it is not possible to define a type already registered
         * in common context). Expressions could see functions defined both in common context and returned context.
         * @param {String} [xCenter] optional xCenter.
         * @returns {Object}
         */
        getCompilationContext: (xCenter) => {
            if (!xCenter) {
                return commonContext;
            }

            const storedContext = MapUtil.get(xCenterContexts, xCenter);
            if (storedContext) {
                return storedContext;
            }

            const newContext = commonContext.deriveContext(xCenter);
            xCenterContexts[xCenter] = newContext;
            return newContext;
        }
    };
}


/** Expression language access point. */
export default {
    /** Creates a new expression language.
     * @param {Function} translate function used to translate messages. This function receives a display key and
     * translation arguments (as function positional arguments) and must return a translated string.
     */
    createExpressionLanguage,
    /** Magical value meaning that there is no meaningful value in the expression. Similar to SQL null. */
    NONSENSE,
    /** Converts a maybe-view-model node into its typed value. */
    cleanse
};
