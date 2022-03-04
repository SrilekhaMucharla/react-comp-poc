import _ from 'lodash';

const FILTER_METADATA = 'edgev10.aspects.validation.dto.TypelistFilterDTO';
const CATEGORY_METADATA = 'edgev10.aspects.validation.dto.CategoryFilterDTO';
const EXPLICIT_LISTS = 'edgev10.aspects.validation.dto.TypekeyListFilterDTO';

/** This aspect defines a list of available values for the field based on the field type
 * and property metadata.
 *
 * @param {Object} expressionLanguage
 *
 * @returns {Object}
 */
function create(expressionLanguage) {
    function compileCategory(compilationContext, node, parent, category) {
        const expr = compilationContext.compile(category.categoryExpression);
        return () => {
            return expr(node, parent, node.aspects.context);
        };
    }

    /**
     * Checks if two lists matches each other.
     *
     * @param {Array|*} arr1
     * @param {Array|*} arr2
     *
     * @returns {Boolean}
     */
    function matches(arr1, arr2) {
        if ((arr1 === null) !== (arr2 === null)) {
            return false;
        }

        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    return {
        getAspectProperties: (currentViewModelNode, currentMetadataNode, ancestorChain) => {
            if (currentMetadataNode.valueType.kind !== 'class') {
                return {};
            }

            const { typeInfo } = currentMetadataNode.valueType;
            if (!typeInfo.metaType.isTypelist) {
                return {};
            }

            let baseValues = typeInfo.codes;

            const filterRules = currentMetadataNode.elementMetadata.get(FILTER_METADATA);

            filterRules.forEach((filterName) => {
                const filter = typeInfo.getFilter(filterName.filterName);
                baseValues = baseValues.filter(filter.allows);
            });

            const explicitLists = currentMetadataNode.elementMetadata.get(EXPLICIT_LISTS);
            explicitLists.forEach((explicitList) => {
                baseValues = baseValues.filter((value) => {
                    return explicitList.codes.indexOf(value.code) >= 0;
                });
            });

            const categoryRules = currentMetadataNode.elementMetadata.get(CATEGORY_METADATA);
            if (categoryRules.length === 0) {
                return {
                    availableValues: {
                        value: baseValues
                    }
                };
            }

            const compilationContext = expressionLanguage
                .getCompilationContext(currentMetadataNode.xCenter);

            const parent = ancestorChain.parent || {};
            const categoryExprs = categoryRules
                .map(_.partial(compileCategory, compilationContext, currentViewModelNode, parent));

            let res = null;

            return {
                availableValues: {
                    get: () => {
                        const newValues = baseValues.filter((typekey) => {
                            return categoryExprs.every((categoryExpr) => {
                                const cat = categoryExpr();
                                return !cat || typekey.belongsToCategory(cat);
                            });
                        });

                        /*
                         * This is a work around for Angular. It does not have a
                         * propagation/dependency tracking.
                         * At the same time it does not consider two arrays with the same
                         * content equivalent.
                         * So we have to return the same array to prevent
                         * infinite update loops.
                         */
                        if (!matches(newValues, res)) {
                            res = newValues;
                        }

                        return res;
                    }
                }
            };
        }
    };
}

export default {
    create
};
