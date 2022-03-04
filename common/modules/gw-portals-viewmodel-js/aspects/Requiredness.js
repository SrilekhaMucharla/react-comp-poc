/* eslint-disable no-restricted-syntax */
import Augment from './_Augment';

const METADATA_CLASS = 'edgev10.aspects.validation.dto.VisibilityAndRequirednessRuleDTO';

/**
 * Creates a new "Field is required" aspect.
 * @param {Object} expressionLanguage
 * @returns {Object}
 */
function create(expressionLanguage) {
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
        const visibilityExpr = compilationContext.compile(rule.data.expression);
        const messageExpr = compilationContext.compile(rule.data.message);

        return {
            shouldApply: rule.shouldApply,
            status: visibilityExpr,
            message: messageExpr
        };
    }

    function combineRules(rules) {
        return {
            visible: (v, pv, ctx) => {
                for (const rule of rules) {
                    if (rule.shouldApply() && rule.status(v, pv, ctx) === 'NOT_SET') {
                        return false;
                    }
                }

                return true;
            },
            required: (v, pv, ctx) => {
                for (const rule of rules) {
                    if (rule.shouldApply() && rule.status(v, pv, ctx) === 'REQUIRED') {
                        return true;
                    }
                }

                return false;
            },
            requirednessMessages: (v, pv, ctx) => {
                const messages = [];
                for (const rule of rules) {
                    if (rule.shouldApply() && rule.status(v, pv, ctx) === 'REQUIRED') {
                        messages.push(rule.message(v, pv, ctx));
                    }
                }
                return messages;
            }
        };
    }

    return {
        getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain) => {
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
            return {
                visible: {
                    get: () => {
                        return descriptor.visible(
                            currentViewModelNode,
                            ancestorChain.parent,
                            currentViewModelNode.aspects.context
                        );
                    }
                },
                required: {
                    get: () => {
                        return descriptor.required(
                            currentViewModelNode,
                            ancestorChain.parent,
                            currentViewModelNode.aspects.context
                        );
                    }
                },
                _requirednessMessages: {
                    get: () => {
                        return descriptor.requirednessMessages(
                            currentViewModelNode,
                            ancestorChain.parent,
                            currentViewModelNode.aspects.context
                        );
                    }
                }
            };
        }
    };
}

export default {
    create
};
