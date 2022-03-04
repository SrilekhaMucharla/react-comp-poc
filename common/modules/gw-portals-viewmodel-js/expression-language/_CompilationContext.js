import _ from 'lodash';
import Namespace from './_Namespace';
import ExpressionCompiler from './_ExpressionCompiler';
/**
 * This module defines a compilation context. Each compilation context has following functions:
 * <dl>
 *     <dt>registerType(typeName : String, typeMethods : Map&lt;string, function&gt;)</dt>
 *      <dd>Registers a type for
 *       the specific context. There could be additional restriction on when
 *          type could be registered, those
 *       restrictions are defined in the documentation to the particular compilation context.</dd>
 *     <dt>registerTypes(types: Map&lt;String, Map&lt;string, function&gt;&gt;)</dt>
 *      <dd>Batch version of
 *       <code>registerType</code></dd>
 *     <dt>compile(expr : ExpressionDTO) : Function</dt><dd>Compiles an expression. </dd>
 * </dl>
 */


/**
 * Creates a root compilation context. Additional methods on the compilation context:
 * <dl>
 *     <dt>deriveContext(ctxName : String) : CompilationContext</dt><dd>
 *      Defines a "derived" context. That derived
 *       context have an access to all functions and operators in this base
 *      context. The context could
 *       have additional types not present in this core context.</dd>
 * </dl>
 * @param {Array} ops map from string name to operators.
 * @param {Array} coreClasses initial classes defined in the root context.
 * @param {Function} translate translation function which takes display
 *  key and input parameters and returns a translated string.
 * @param {Function} typekeyLookup function used to lookup typekey based
 *  on xCenter name, typekey name and typecode.
 * @returns {Object}
 */
function createRootContext(ops, coreClasses, translate, typekeyLookup) {
    const opsNS = Namespace.createMutableNamespace('[Root]', ops);
    const commonNS = Namespace.createMutableNamespace('[Root]', coreClasses);
    const commonCompiler = ExpressionCompiler.createCompiler(
        opsNS, commonNS, translate, _.partial(typekeyLookup, null)
    );
    const derivedNamespaces = [];

    /* Registers a common type. */
    function registerCommonType(typeName, methods) {
        const offender = _.find(derivedNamespaces, (context) => {
            return context.namespace.hasType(typeName);
        });
        if (offender) {
            throw new Error(`Type ${typeName} is already registered in child context ${offender.name}`);
        }
        commonNS.registerType(typeName, methods);
    }


    /* Derives a child context. */
    function deriveContext(ctxName) {
        const privateNS = Namespace.createMutableNamespace(ctxName, {});
        const effectiveNS = Namespace.createCompositeNamespace(commonNS, privateNS);
        const derivedCompiler = ExpressionCompiler.createCompiler(
            opsNS, effectiveNS, translate, _.partial(typekeyLookup, ctxName)
        );
        derivedNamespaces.push({
            name: ctxName,
            namespace: privateNS
        });

        function registerDerivedType(typeName, methods) {
            if (commonNS.hasType(typeName)) {
                throw new Error(`Type ${typeName} is already registered in common namespace`);
            }
            privateNS.registerType(typeName, methods);
        }

        return {
            registerType: (typeName, methods) => {
                registerDerivedType(typeName, methods);
            },
            registerTypes: (types) => {
                _.each(types, (funcs, typeName) => {
                    registerDerivedType(typeName, funcs);
                });
            },
            compile: (expr) => {
                return derivedCompiler.compile(expr);
            }
        };
    }

    return {
        registerType: (typeName, methods) => {
            registerCommonType(typeName, methods);
        },
        registerTypes: (types) => {
            _.each(types, (funcs, typeName) => {
                registerCommonType(typeName, funcs);
            });
        },
        compile: (expr) => {
            return commonCompiler.compile(expr);
        },
        deriveContext
    };
}


export default {
    createRootContext,
    NONSENSE: ExpressionCompiler.NONSENSE,
    cleanse: ExpressionCompiler.cleanse
};
