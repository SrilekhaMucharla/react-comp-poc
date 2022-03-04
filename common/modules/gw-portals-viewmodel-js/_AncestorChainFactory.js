import _ from 'lodash';

const emptyChain = {
    owners: [],
    parent: undefined
};

function createOwnerObj(container, metadata, pathStr) {
    // Creating object literal with complex property
    // deoptimizes the function, so is worth extracting
    return {
        container: container,
        metadata: metadata,
        pathToItem: { asString: pathStr }
    };
}

// eslint-disable-next-line no-underscore-dangle
function _createChain(newChain) {
    // Creating object literal with complex property
    // deoptimizes the function, so is worth extracting
    return {
        owners: newChain,

        get parent() {
            const ancestorChainLength = this.owners.length;
            if (ancestorChainLength !== 0) {
                return this.owners[ancestorChainLength - 1].container;
            }

            return undefined;
        }

    };
}

/**
 * Creates a chain of owners for the new (nested) element.
 * @param {Object} element
 * @param {Object} metadata
 * @param {*} accessor
 * @param {Object} [owners]
 * @returns {{owners: Array, parent}}
 */
function createOwnerChain(element, metadata, accessor, owners) {
    const newChain = new Array(owners ? owners.owners.length + 1 : 1);
    if (owners) {
        const ownerAccessorStr = _.isNumber(accessor) ? `[${accessor}]` : `.${accessor}`;
        for (let i = 0; i < owners.owners.length; i += 1) {
            const base = owners.owners[i];
            newChain[i] = createOwnerObj(
                base.container, base.metadata,
                base.pathToItem.asString + ownerAccessorStr
            );
        }
    }

    newChain[newChain.length - 1] = createOwnerObj(
        element, metadata,
        _.isNumber(accessor) ? `[${accessor}]` : accessor
    );

    return _createChain(newChain);
}


/**
 * Creates a new metadata builder for the current container, metadata node and owner items.
 * @param {Object} element
 * @param {Object} metadata
 * @param {Object} [owners]
 * @returns {Object}
 */
function builderFor(element, metadata, owners) {
    return {
        /**
         * Returns a new owner chain for the child object.
         * @param {*} accessor
         * @returns {Object}
         */
        forChild: (accessor) => {
            return createOwnerChain(element, metadata, accessor, owners);
        }
    };
}

/**
 * This modules contains utilities to work with the "chain of ownership".
 * Ownership is chain of containing (owning) objects from some "root" object.
 * For example, in the object {a: 3} value 3 is contained in the object itself.
 * And it the code {a : {b : 3}} value 3 is contained in both inner object
 * (as property b) and in the outer object (under the path a.b).
 * Ownership chain provides access to all those objects along the chain and paths
 * from each object to the value ("b" and "a.b" in the latter example).
 *
 * <h1>Owner chain API</h1>
 * Each owner chain have following methods and properties:
 * <dl>
 *     <dt>owners</dt><dd>List of owners from the outermost to innermost.</dd>
 * </dl>
 *
 * <h1>Owner API</h1>
 * Each owner object (element in the owners chain) have following methods and properties:
 * <dl>
 *     <dt>container</dt><dd>Container object itself (path sensitive model, dto, etc...).</dd>
 *     <dt>metadata</dt><dd>All the metadata associated with the container object's type.</dd>
 *     <dt>pathToItem</dt><dd>Path <strong>from</code> the
 *      container object to the "current" object.</dd>
 * </dl>
 *
 *
 * <h1>Path API</h1>
 * Each path object (path description) have following properties and methods:
 * <dl>
 *     <dt>asString</dt>string representation of the path.
 * </dl>
 */
export default {
    /**
     * Starts building a new chains for the child elements.
     * Receives a current value, object metadata and optional
     * chain of "parent containers". Creates a new builder object used
     * to create chains for child objects.
     *
     * Common use is:
     * <code>
     *     function createNode(meta, owners) {
     *         const newImpl = createNodeImplementation(meta, owners);
     *        const pathBuilder = OwnershipChain.build(newImpl, meta, owners);
     *        for (const subElement in subElementsOf(newImpl, meta)) {
     *            newImpl[subElement] =
     *              createNode(meta.sub(subElement), pathBuilder.forChild(subElement));
     *        }
     *     }
     * </code>
     *
     * You could use <code>emptyChain</code> to start from the root node.
     */
    build: builderFor,

    /** Representation of the empty chain (i.e. chain of owners of the root entity). */
    emptyChain
};
