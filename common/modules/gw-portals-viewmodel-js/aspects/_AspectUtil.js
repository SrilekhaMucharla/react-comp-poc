/* Utilities for the aspect writers. */

function parentValue(ancestorChain) {
    if (!ancestorChain.parent) {
        return undefined;
    }

    return ancestorChain.parent.value;
}

export default {
    /** Returns a value of the parent node.
     * @param anchestorChain node's ancestor chain.
     */
    parentValue,

    /**
     * Binds a function and creates a closure for the "validation call".
     * Returned function calls a function as
     * the "validation expression", passing arguments in the order consistent with the backend.
     * @param {Function} fn function to bind.
     * @param {Object} node view model node.
     * @param {*} ancestorChain ancestor chain for the node.
     *
     * @returns {*}
     */
    bindValidationCall: (fn, node, ancestorChain) => {
        return () => {
            return fn(node.value, parentValue(ancestorChain), node.aspects.context);
        };
    }
};
