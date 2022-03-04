/* eslint-disable no-underscore-dangle */
import _ from 'lodash';

const vmQualifyingProperties = ['value', 'aspects', '_propertyName', '_parent',
    '_ancestorChain', '_metadataInfo', '_accessorCode', '_aspects'
];

const vmOwnProperties = vmQualifyingProperties.concat(['_aspectFactories']);


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

function unpackIfVMNode(maybeNode) {
    if (isVMNode(maybeNode)) {
        return maybeNode.value;
    }

    return maybeNode;
}

function findRoot(viewModel) {
    if (viewModel._parent) {
        return findRoot(viewModel._parent);
    }

    return viewModel;
}

function getNonVMPath(path) {
    return path.replace(/\.children|\.value/g, '');
}

/** Miscellaneous utilities for the view model nodes. */
export default {
    /** Checks if maybenode is view model node. */
    isViewModelNode: isVMNode,
    unpackIfViewModelNode: unpackIfVMNode,
    findRoot: findRoot,
    getNonVMPath: getNonVMPath,

    /**
     * Cleans item and extracts its true value.
     *
     * @param {*} maybeNode
     *
     * @returns {Boolean}
     */
    cleanse: (maybeNode) => {
        return isVMNode(maybeNode) ? maybeNode.value : maybeNode;
    },

    iterateOverChildNodes(vmNode, cb) {
        Object.keys(vmNode)
            .filter((key) => !vmOwnProperties.includes(key))
            .filter((key) => isVMNode(vmNode[key]))
            .forEach((key) => cb(vmNode[key], key));
    }
};
