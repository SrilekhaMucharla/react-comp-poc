import _ from 'lodash';

const vmQualifyingProperties = ['modelValue', 'question', 'answer', 'aspects', 'label', 'value'];

/**
 * Checks if maybenode is view model node.
 *
 * @param {*} maybeNode
 *
 * @returns {Boolean}
 */
function isVMNode(maybeNode) {
    if (!maybeNode || !_.isObject(maybeNode)) {
        return false;
    }

    return vmQualifyingProperties.every((qp) => {
        return qp in maybeNode;
    });
}

export default {
    /** Checks if maybenode is view model node. */
    isViewModelNode: isVMNode,
};
