/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import _ from 'lodash';

/**
 * Returns a constructor object for creating new View Model Node objects.
 * A view model node is a pointer to an underlying model object. It also contains aspect properties
 * based on the underlying model value and metadata
 *
 * @param {Object} modelRoot : The root model object that was used to create the view model
 * @param {Array} aspects : Aspect factory objects that have been registered with the ViewModel API
 * @param {Object} config : Configuration for view model
 *
 * @returns {Function}: A constructor function to create new View Model Node objects
 **/
export default function (modelRoot, aspects, config) {
    function VMNode(metadataInfo, ancestorChain, accessorCode) {
        // It is important to have 'var' here, because currently const referencing a property on argument
        // is deoptimizing the entire function call ('Unsupported phi use of const or let variable')
        var aspectFactory; // eslint-disable-line no-var
        var propName; // eslint-disable-line no-var

        this._ancestorChain = ancestorChain;
        this._metadataInfo = metadataInfo;
        this._accessorCode = accessorCode;
        this._aspectFactories = aspects;
        this._aspects = {};

        /* Provide more convenient methods for the typelists. They provide an automatic conversion between
         * typecodes and string values on the model.
         */
        if (metadataInfo.valueType.kind === 'class' && metadataInfo.valueType.typeInfo.metaType.isTypelist) {
            this.get = typelistGet;
            this.set = typelistSet;
        }

        /* mixin aspect properties to the view model node */
        for (let i = 0; i < aspects.length; i += 1) {
            aspectFactory = aspects[i];

            const aspectProperties = aspectFactory.getAspectProperties(this, this._metadataInfo, this._ancestorChain, config);
            if (aspectProperties) {
                // eslint-disable-next-line guard-for-in
                for (propName in aspectProperties) {
                    if (propName in this._aspects) {
                        throw new Error(`View model node already has a property ${propName}, it cannot be overridden by another aspect`);
                    }
                    Object.defineProperty(this._aspects, propName, aspectProperties[propName]);
                }
            }
        }
    }

    /**
     * Typelist version of the get function. It provides automatic conversion into the typecode.
     *
     * @returns {Object}
     */
    function typelistGet() {
        const baseValue = VMNode.prototype.get.call(this);
        if (_.isString(baseValue)) {
            return _.find(this._metadataInfo.valueType.typeInfo.codes, {
                code: baseValue
            });
        }
        return baseValue;
    }


    /**
     * Typelist version of the setter.
     * @param {*} vmNodeOrModel
     */
    function typelistSet(vmNodeOrModel) {
        if (vmNodeOrModel instanceof VMNode) {
            vmNodeOrModel = vmNodeOrModel.value;
        }

        if (vmNodeOrModel && !_.isString(vmNodeOrModel)) {
            /* Somebody (like an angular) cheats and provides clones of the objects. Do not allow that! */
            const trueEntity = this._metadataInfo.valueType.typeInfo.getCode(vmNodeOrModel.code);
            if (trueEntity !== vmNodeOrModel) {
                // eslint-disable-next-line no-console
                console.error('Critical MVC violation: attempt to provide non-genuine typecode');
                vmNodeOrModel = trueEntity;
            }
            vmNodeOrModel = vmNodeOrModel.code;
        }

        VMNode.prototype.set.call(this, vmNodeOrModel);
    }

    VMNode.prototype = {
        get() {
            if (this._ancestorChain.parent) {
                return this._ancestorChain.parent.value[this._propertyName];
            }

            return modelRoot;
        },

        set(vmNodeOrModel) {
            if (vmNodeOrModel instanceof VMNode) {
                vmNodeOrModel = vmNodeOrModel.value;
            }
            if (!this._ancestorChain.parent) {
                modelRoot = vmNodeOrModel;
            } else {
                this._ancestorChain.parent.value[this._propertyName] = vmNodeOrModel;
            }
        },

        get value() {
            return this.get();
        },
        set value(pathOrValue) {
            this.set(pathOrValue);
        },

        get aspects() {
            return this._aspects;
        },

        get _propertyName() {
            return this._accessorCode;
        },

        get _parent() {
            return this._ancestorChain.parent;
        },

        get _dtoName() {
            return this._metadataInfo.valueType.name;
        },

        get _xCenter() {
            return this._metadataInfo.xCenter;
        },

        get _context() {
            return this._metadataInfo.externalContext;
        },

        get baseVMNode() {
            return this._ancestorChain.owners[0];
        }

    };

    return VMNode;
}
