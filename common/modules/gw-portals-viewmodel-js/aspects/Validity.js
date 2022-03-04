import _ from 'lodash';
import Augment from './_Augment';

const METADATA_CLASS = 'edgev10.aspects.validation.dto.ValidationRuleDTO';

/** Validitiy descriptor for any type. Considers value as always valid. */
const ANY_TYPE = {
    typeValid: _.constant(true),
    messages: _.constant([])
};

const INT_TYPES = ['byte', 'short', 'int', 'long', 'Byte', 'Short', 'Integer', 'Long', 'BigInteger'];
const FLOAT_TYPES = ['float', 'double', 'Float', 'Double', 'BigDecimal'];

const alwaysTrue = _.constant(true);
const alwaysEmpty = _.constant([]);

/**
 * Creates a new "Field is required" aspect.
 * @param {Object} expressionLanguage
 * @param {Object} validationMessages
 * @returns  {Object}
 */
function create(expressionLanguage, validationMessages) {
    /** Validity for the decimal type. */
    const DECIMAL_TYPE = {
        typeValid: (val) => {
            if (_.isNumber(val)) {
                return true;
            }
            return /^-?\d*(\.\d*)?$/.test(val);
        },
        messages: (/* val*/) => {
            return [validationMessages.notANumber];
        }
    };


    /** Validity descriptor for the integer types. */
    const INT_TYPE = {
        typeValid: (val) => {
            if (_.isNumber(val)) {
                return Math.round(val) === val;
            }

            return /^-?\d+$/.test(val);
        },
        messages: (val) => {
            if (!DECIMAL_TYPE.typeValid(val)) {
                return DECIMAL_TYPE.messages(val);
            }
            return [validationMessages.notAnInteger];
        }
    };


    function getAllRules(compilationContext, node, nodeMetadata, ancestorChain) {
        return Augment.collectRules(
            compilationContext,
            node,
            nodeMetadata,
            ancestorChain,
            METADATA_CLASS
        );
    }

    function compileRule(compilationContext, rule) {
        const validationRule = compilationContext.compile(rule.data.expression);
        const messageExpr = compilationContext.compile(rule.data.message);

        return {
            shouldApply: rule.shouldApply,
            validate: validationRule,
            message: messageExpr
        };
    }

    function combineRules(rules) {
        function getMessages(v, pv, ctx) {
            return rules.filter((rule) => {
                /* `rule.validate` returns `true`, `false` or `NONSENSE`.
                 NONSENSE handling: shouldApply do that internally. Negation is fine for it. */
                return rule.shouldApply() && !rule.validate(v, pv, ctx);
            }).map((rule) => {
                return rule.message(v, pv, ctx);
            });
        }

        return {
            messages: getMessages,
            valid: (v, pv, ctx) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const rule of rules) {
                    /* `rule.validate` returns `true`, `false` or `NONSENSE`.
                     NONSENSE handling: shouldApply internally. Explicit check in validate. */
                    if (rule.shouldApply() && !(rule.validate(v, pv, ctx) === true)) {
                        return false;
                    }
                }

                return true;
            }
        };
    }

    /**
     * Returns a type validation descriptor based on the DTO type.
     * @param {Object} type
     * @returns {Object}
     */
    function getTypeDescriptor(type) {
        switch (type.kind) {
            case 'primitive':
                if (INT_TYPES.indexOf(type.name) >= 0) {
                    return INT_TYPE;
                }
                if (FLOAT_TYPES.indexOf(type.name) >= 0) {
                    return DECIMAL_TYPE;
                }
                return ANY_TYPE;

            default:
                return ANY_TYPE;
        }
    }

    function valueNotSet(currentViewModelNode) {
        const val = currentViewModelNode.value;
        return _.isUndefined(val) || _.isNull(val) || val === '';
    }

    return {
        getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain) => {
            // `var` because otherwise causes
            // deoptimization: 'Unsupported phi use of const or let variable'
            var readOnlyProperty = currentMetadataNode.readOnly; // eslint-disable-line no-var

            const compilationContext = expressionLanguage.getCompilationContext(
                currentMetadataNode.xCenter
            );
            const rules = getAllRules(
                compilationContext,
                currentViewModelNode,
                currentMetadataNode,
                ancestorChain
            );
            const compiledRules = new Array(rules.length);
            for (let i = 0; i < rules.length; i += 1) {
                compiledRules[i] = compileRule(compilationContext, rules[i]);
            }

            const descriptor = combineRules(compiledRules);
            const typeDescriptor = getTypeDescriptor(currentMetadataNode.valueType);

            /* Angular evaluation model workaround. */
            let lastMessages = null;

            const allMessages = readOnlyProperty ? alwaysEmpty : function allMessages() {
                let allMsgs;
                if (valueNotSet(currentViewModelNode)) {
                    // eslint-disable-next-line no-underscore-dangle
                    allMsgs = currentViewModelNode.aspects._requirednessMessages;
                } else if (!typeDescriptor.typeValid(currentViewModelNode.value)) {
                    allMsgs = typeDescriptor.messages(currentViewModelNode.value);
                } else {
                    allMsgs = descriptor.messages(
                        currentViewModelNode,
                        ancestorChain.parent, currentViewModelNode.aspects.context
                    );
                }

                const newMessages = _.uniq(allMsgs);
                if (!_.isEqual(lastMessages, newMessages)) {
                    lastMessages = newMessages;
                }
                return lastMessages;
            };

            return {
                valid: {
                    get: readOnlyProperty ? alwaysTrue : () => {
                        if (valueNotSet(currentViewModelNode)) {
                            return !currentViewModelNode.aspects.required;
                        }

                        return typeDescriptor.typeValid(currentViewModelNode.value)
                            && descriptor.valid(
                                currentViewModelNode,
                                ancestorChain.parent, currentViewModelNode.aspects.context
                            );
                    }
                },
                validationMessages: {
                    get: allMessages
                },
                validationMessage: {
                    get: () => allMessages()[0]
                }
            };
        }
    };
}

export default {
    create
};
