/* eslint-disable no-restricted-syntax */
import _ from 'lodash';

const METADATA_CLASS = 'edgev10.aspects.validation.dto.RuleAugmentationRuleDTO';
const alwaysTrue = _.constant(true);

/**
 * Returns a list of augments derived from the metadata.
 * @param {Object} expressionLanguage
 * @param {Object} metadata
 * @param {String} targetType
 * @param {String} targetPath
 * @param {Object} currentNode
 * @param {Object} parentNode
 * @returns {Array}
 */
function getAugmentsFromMeta(expressionLanguage, metadata, targetType,
    targetPath, currentNode, parentNode) {
    const augments = metadata.elementMetadata.get(METADATA_CLASS);
    const res = [];

    for (const augment of augments) {
        if (augment.targets.indexOf(targetPath) === -1) {
            continue; // eslint-disable-line no-continue
        }

        let shouldApply;
        if (augment.when) {
            const cond = expressionLanguage.compile(augment.when);
            shouldApply = () => {
                /* Explicit cast to a true due to three-state value: true, false and NONSENSE. */
                return cond(currentNode, parentNode, currentNode.aspects.context) === true;
            };
        } else {
            shouldApply = alwaysTrue;
        }

        for (const override of augment.augments) {
            if (override.type === targetType) {
                res.push({
                    shouldApply: shouldApply,
                    data: override.value,
                    node: currentNode,
                    parentNode
                });
            }
        }
    }

    return res;
}

/**
 * Collects rules from all the nodes.
 * @param {Object} expressionLanguage
 * @param {Object} node
 * @param {Object} nodeMetadata
 * @param {*} ancestorChain
 * @param {String} targetType
 * @returns {Array}
 */
function collectRules(expressionLanguage, node, nodeMetadata, ancestorChain, targetType) {
    const res = [];
    const localMeta = nodeMetadata.elementMetadata.get(targetType);
    localMeta.forEach((targetMeta) => {
        res.push({
            shouldApply: _.constant(true),
            data: targetMeta,
            node,
            parentNode: ancestorChain.parent
        });
    });

    for (let ancestorIdx = ancestorChain.owners.length - 1; ancestorIdx >= 0; ancestorIdx -= 1) {
        const owner = ancestorChain.owners[ancestorIdx];
        const parent = ancestorIdx === 0 ? undefined
            : ancestorChain.owners[ancestorIdx - 1].container;
        const inheritedAugments = getAugmentsFromMeta(expressionLanguage, owner.metadata,
            targetType, owner.pathToItem.asString, owner.container, parent);
        res.push(...inheritedAugments);
    }

    return res;
}

/** Utilities for the augmentable properties. */
export default {
    collectRules
};
