import _ from 'lodash';

const factoryFn = (expressionLanguage) => {
    const CONTEXT_DTO_TYPE = 'edgev10.aspects.validation.dto.ContextDTO';

    function getContextValuesForNode(currentMetadataNode) {
        const cachedContext = {};
        const compilationCtx = expressionLanguage.getCompilationContext(
            currentMetadataNode.xCenter
        );

        // Add external context values as context value expressions
        if (currentMetadataNode.externalContext) {
            _.keys(currentMetadataNode.externalContext).forEach((key) => {
                cachedContext[key] = () => {
                    return currentMetadataNode.externalContext[key];
                };
            });
        }

        _.each(currentMetadataNode.elementMetadata.get(CONTEXT_DTO_TYPE), (contextDefn) => {
            const expFn = compilationCtx.compile(contextDefn.expression);
            cachedContext[contextDefn.name] = expFn;
        });
        return cachedContext;
    }

    function getAllContextValues(ctx, currentViewModelNode, ancestorChain) {
        const ancestorCtxProperties = (ancestorChain.parent)
            ? ancestorChain.parent.aspects.context()
            : [];
        const allCtxProperties = Object.getOwnPropertyNames(ctx).concat(ancestorCtxProperties);
        /*
            this is leveraging the fact that the following
                aspects.context
            will yield the {context: value () => {...}} exactly as it is defined in
            "contextAspect"  below
         */
        return _.zipObject(allCtxProperties, allCtxProperties
            .map((propName) => currentViewModelNode.aspects.context(propName)));
    }

    const contextAspect = {
        /**
         * Add aspect properties to a view model node
         *
         * @param {Object} currentViewModelNode
         * @param {Object} currentMetadataNode
         * @param {Object} ancestorChain
         * @returns {Object}
         */
        getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain) => {
            const ctx = getContextValuesForNode(currentMetadataNode);

            return {
                context: {
                    value: (name) => {
                        if (!name) {
                            return getAllContextValues(ctx, currentViewModelNode, ancestorChain);
                        }

                        // return local context value
                        if (ctx[name]) {
                            return ctx[name](currentViewModelNode, ancestorChain.parent);
                        }

                        // return context from ancestors
                        return (ancestorChain.parent)
                            ? ancestorChain.parent.aspects.context(name)
                            : undefined;
                    }
                }
            };
        }
    };

    return contextAspect;
};

export default {
    create: factoryFn
};
