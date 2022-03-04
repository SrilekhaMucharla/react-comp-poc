/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */
import _AncestorChainFactory from './_AncestorChainFactory';
import _Step from './build/_Step';
import ViewModelUtil from './ViewModelUtil';
/**
 * Returns a constructor object for creating new View Model Node List objects.
 * The constructor inherits from VMNode and adds list access and modification methods.
 *
 * @param {Function} VMNode : The ViewModelNode constructor
 * @param {Function} createViewModelNodeFn : The function passed from VMFactory to create View Model Nodes
 *
 * @returns {Function}: A constructor function to create new View Model Node List objects
 **/
export default function (VMNode, createViewModelNodeFn) {
    function VMListNode(/* metadataInfo, ancestorChain, accessorCode*/) {
        VMNode.apply(this, arguments);

        // internal array to hold view model nodes pointing to model array objects
        this._vmElements = [];
        this._lastChildren = Object.freeze([]);
    }

    VMListNode.prototype = Object.create(VMNode.prototype);
    VMListNode.prototype.constructor = VMListNode;

    /**
     * Returns a view model object which points to the corresponding element in the underlying model array
     *
     * @param {Number} idx : The index of the list element to be retrieved
     * @returns {Object} : A view model object that points to the model array element at the same index
     **/
    VMListNode.prototype.getElement = function (idx) {
        if (idx >= this.value.length) {
            return undefined;
        }
        if (!this._vmElements[idx]) {
            // sync up internal array containing vm nodes with underlying model array
            this._syncVmListWithModel();
        }
        return this._vmElements[idx];
    };

    /**
     * Returns a view model object which points to last model element in the array
     *
     * @returns {Object}: A view model object that points to the last model array element
     **/
    VMListNode.prototype.getLastElement = function () {
        if (this.value.length === 0) {
            return undefined;
        }
        if (!this._vmElements[this.value.length - 1]) {
            // sync up internal array containing vm nodes with underlying model array
            this._syncVmListWithModel();
        }
        return this._vmElements[this.value.length - 1];
    };

    /**
     * Returns a view model object which points to the first element with a value that
     * matches the first argument. Matching is done by strict equality.
     *
     * @param {Object} vmNodeOrModel : The value object that is used to search
     * @param {int} fromIndex : The index to start the search at.
     * If the index is greater than or equal to the array's length, undefined is returned.
     * Default: 0 (entire array is searched).
     * @returns {Object}: A view model object that points to the matching model array element
     **/
    VMListNode.prototype.findFirstElement = function (vmNodeOrModel, fromIndex) {
        if (fromIndex >= this.value.length - 1) {
            return undefined;
        }
        if (vmNodeOrModel instanceof VMNode) {
            vmNodeOrModel = vmNodeOrModel.value;
        }
        fromIndex = (fromIndex === undefined) ? 0 : fromIndex;
        const foundIdx = this.value.indexOf(vmNodeOrModel, fromIndex);
        if (!this._vmElements[foundIdx]) {
            // sync up internal array containing vm nodes with underlying model array
            this._syncVmListWithModel();
        }
        return this._vmElements[foundIdx];
    };

    /**
     * Sets the model element array at the same index. Essentially an alias to calling vmListNode.value[idx] = modelElementValue
     * Throws an error if a index value greater than the length of the underlying model array is passed in.
     *
     * @param {Number} idx : The index of the list element to be retrieved
     * @param {Object} vmNodeOrModel A view model node or simple data object to replace the element at the index passed in
     **/
    VMListNode.prototype.setElement = function (idx, vmNodeOrModel) {
        if (idx >= this.value.length) {
            throw new Error('Index provided is outside the bounds of the list. Use the push or unshift methods to add elements');
        }
        if (vmNodeOrModel instanceof VMNode) {
            vmNodeOrModel = vmNodeOrModel.value;
        }
        this.value[idx] = vmNodeOrModel;
    };

    /**
     * Adds a new element to the end array of view model elements.
     *
     * @param {Object} vmNodeOrModel A view model node or simple data object
     * @returns {Object}: A view model object that points to the model array element that was just added
     **/
    VMListNode.prototype.pushElement = function (vmNodeOrModel) {
        if (ViewModelUtil.isViewModelNode(vmNodeOrModel)) {
            vmNodeOrModel = vmNodeOrModel.value;
        }
        this.value.push(vmNodeOrModel);
        return this.findFirstElement(vmNodeOrModel);
    };

    /**
     * Property returning the length of the underlying model array
     *
     * @returns {Number}: Length of list
     **/
    Object.defineProperty(VMListNode.prototype, 'length', {
        'get'() {
            return (this.value) ? this.value.length : 0;
        }
    });

    /**
     * A convenience method to iterate over the view model node elements
     *
     * @param {Function} callback : Function to execute for each element, taking three arguments: element, index, array
     * @param {Object} [thisArg] : Optional. Value to use as this when executing callback.
     **/
    VMListNode.prototype.forEach = function (callback, thisArg) {
        if (typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }

        this._syncVmListWithModel();
        this._vmElements.forEach(callback, thisArg);
    };

    /**
     * A convenience method to filter view model node elements.
     * @param {Function} callback : Function taking a view model node and returning boolean.
     * @param {*} thisArg
     * @returns {Array} list of the view model nodes for which this function returned true.
     */
    VMListNode.prototype.filter = function (callback, thisArg) {
        if (typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }

        this._syncVmListWithModel();
        return this._vmElements.filter(callback, thisArg);
    };

    /**
     * Returns a frozen array object containing the view model elements of the list
     * The same object is returned once the list hasn't been modified
     * Useful if you need to access the list in an array-like fashion like with ng-repeat
     */
    Object.defineProperty(VMListNode.prototype, 'children', {
        'get'() {
            if (this.length === this._lastChildren.length) {
                return this._lastChildren;
            }

            this._syncVmListWithModel();
            this._lastChildren = Object.freeze(this._vmElements.slice(0, this.length));
            return this._lastChildren;
        }
    });


    Object.defineProperty(VMListNode.prototype, '_dtoName', {
        'get'() {
            return this._metadataInfo.valueType.elementType.name;
        }
    });

    Object.defineProperty(VMListNode.prototype, '_xCenter', {
        'get'() {
            return this._metadataInfo.xCenter;
        }
    });

    VMListNode.prototype._syncVmListWithModel = function () {
        const metadataInfo = this._metadataInfo;
        const pathBuilder = _AncestorChainFactory.build(this, this._metadataInfo, this._ancestorChain);
        const elementMetadataInfo = _Step.collectionElement(metadataInfo.xCenter, metadataInfo.valueType.elementType);
        for (let i = this._vmElements.length; i < this.value.length; i += 1) {
            this._vmElements.push(createViewModelNodeFn(this, i, elementMetadataInfo, pathBuilder.forChild(i)));
        }
    };

    return VMListNode;
}
