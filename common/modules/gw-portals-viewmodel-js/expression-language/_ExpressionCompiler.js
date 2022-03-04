/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import MapUtil from 'gw-portals-util-js/MapUtil';
import ViewModelUtil from '../ViewModelUtil';
/** Module providing compilation facilities for the specific set
 * of "platform definitions" (functions, operators,
 * etc...).
 *
 * Supported types/aliases:
 *   * expressionEvaluator == (args : Object[]) => Object - function taking arguments as
 *     an array and returning expression value.
 *   * kindCompiler == (expr : ExpressionDTO, ctx : CompileContext) =>
 *  expressionEvaluator - compiler for the
 *     specific expression kind.
 */

/** NO-VALUE value (like null/unknown in SQL). */
const NONSENSE = Object.freeze({});


function cleanse(v) {
    return ViewModelUtil.isViewModelNode(v) ? v.aspects.typedValue : v;
}


/**
 * Applies an eager function to its arguments.
 * @param {Function} fun function to apply.
 * @param {Array} funArgExprs expression defining arguments to function.
 * @param {Array} exprArgs arguments to the expression itself.
 * @returns {*}
 */
function applyEagerFunction(fun, funArgExprs, exprArgs) {
    const funArgs = funArgExprs.map((funArgExpr) => {
        /*
         * function which expects values and not expressions.
         */
        return cleanse(funArgExpr(exprArgs));
    });
    if (funArgs.includes(NONSENSE)) {
        return NONSENSE;
    }
    return fun(...funArgs);
}


/** Compiles a constant expression into expression evaluator.
 * @param {{ConstantExpressionDTO}} expr constant expression definition.
 * @returns {{expressionEvaluator}} constant expression evaluator.
 */
const compileConst = (() => {
    /** Mapping from constant type into type factory. */
    const valueFactoriesForType = {
        int: _.identity,
        long: _.identity,
        string: _.identity,
        BigDecimal: _.identity,
        boolean: _.identity,
        dto: _.identity,
        null: _.constant(null),
        Date: (str) => {
            return new Date(str);
        }
    };

    return (expr, buildContext) => {
        const valueFactory = MapUtil.get(valueFactoriesForType, expr.type);
        if (valueFactory) {
            return _.constant(valueFactory(expr.value));
        }

        if (expr.type.substring(0, 5) === 'enum ') {
            return _.constant(expr.value);
        }

        if (expr.type.substring(0, 8) === 'typekey ') {
            return _.constant(buildContext.typekeyLookup(expr.type.substring(8), expr.value));
        }

        throw new Error(`Unsupported constant type ${expr.type}`);
    };
})();


/**
 * Compiles a parameter access expression.
 * @param {{ParameterExpressionDTO}} expr expression to compile.
 * @returns {{expressionEvaluator}} parameter value evaluator.
 */
function compileParameter(expr) {
    const paramIdx = expr.index;
    return (args) => {
        return args[paramIdx];
    };
}


/** Compiles a property access expression. */
const compileFieldAccess = (() => {
    function _decapitalize(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
    }

    /* Fetches a property from the object. */
    function getProperty(obj, propName) {
        if (obj === NONSENSE || _.isUndefined(obj) || _.isNull(obj)) {
            return obj;
        }

        /*
         * Keep navigating VM nodes as much as possible.
         */
        if (ViewModelUtil.isViewModelNode(obj)) {
            let propValue = obj[propName];
            if (!propValue) {
                propValue = obj[_decapitalize(propName)];
            }

            if (propValue) {
                return propValue;
            }

            obj = obj.aspects.typedValue;

            // double check that 'obj' is still valid here
            if (obj === NONSENSE || _.isUndefined(obj) || _.isNull(obj)) {
                return obj;
            }
        }

        let r = obj[propName];
        if (r) {
            return r;
        }
        r = obj[_decapitalize(propName)];
        return r;
    }

    return (expr, buildContext) => {
        const baseEvaluator = buildContext.compile(expr.base);
        const propName = expr.propertyName;

        return (args) => {
            return getProperty(baseEvaluator(args), propName);
        };
    };
})();


/** Method invocation compiler. */
const compileInvocation = (() => {
    return (expr, buildContext) => {
        const ns = expr.container;
        const funcName = expr.name;
        const argExprs = expr.params.map(buildContext.compile);

        const maybeOp = buildContext.operators.getFunction(ns, funcName);
        if (maybeOp) {
            return _.partial(maybeOp, argExprs);
        }

        const maybeFunction = buildContext.functions.getFunction(ns, funcName);
        if (maybeFunction) {
            return _.partial(applyEagerFunction, maybeFunction, argExprs);
        }
        throw new Error(`Could not find function ${funcName} in ${ns}`);
    };
})();


/**
 * Compiles a "translate" expression.
 * @param {Object} expr
 * @param {Object} buildContext
 * @returns {Function}
 */
function compileTranslate(expr, buildContext) {
    const args = expr.arguments.map(buildContext.compile);
    args.unshift(_.constant(expr.displayKey));
    return _.partial(applyEagerFunction, buildContext.translate, args);
}


/** Mapping from kind name to expression compiler for that kind. */
const kindCompilers = {
    const: compileConst,
    parameter: compileParameter,
    getfield: compileFieldAccess,
    nativecall: compileInvocation,
    translate: compileTranslate
};


/* Creates base (non-caching) compiler. */
function createBaseCompiler(operators, functions, translate, typekeyLookup) {
    function compileExpr(expr) {
        const kindCompiler = MapUtil.get(kindCompilers, expr.kind);
        if (!kindCompiler) {
            throw new Error(`Unsupported expression kind ${expr.kind}`);
        }
        return kindCompiler(expr, ctx);
    }

    const ctx = {
        compile: compileExpr,
        operators,
        functions,
        translate,
        typekeyLookup
    };

    return {
        compile(expr) {
            const compiledFn = compileExpr(expr);
            return function () {
                /**
                 * the parameter. We have to return a value, not the node.
                 */
                // eslint-disable-next-line prefer-rest-params
                return cleanse(compiledFn(Array.prototype.slice.call(arguments)));
            };
        }
    };
}


export default {
    /** Creates a compiler. This compiler caches result of operations based on the expression
     * <em>identity</em>.
     * @param {*} operators operators namespace.
     * @param {*} functions function namespace.
     * @param {Function} translate translation function.
     * @param {Function} typekeyLookup function used to lookup typekeys
     * (for typekey constant). It takes typekey name and
     * typecode and returns a typecode object.
     * @returns {Object} compiler.
     */
    createCompiler: (operators, functions, translate, typekeyLookup) => {
        return createBaseCompiler(operators, functions, translate, typekeyLookup);
    },
    NONSENSE,
    cleanse
};
