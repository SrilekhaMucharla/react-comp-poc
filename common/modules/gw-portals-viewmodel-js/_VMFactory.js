/* eslint-disable no-underscore-dangle */
import StringUtil from 'gw-portals-util-js/StringUtil';
import _VMListNode from './_VMListNode';
import _VMNode from './_VMNode';
import _AncestorChainFactory from './_AncestorChainFactory';
import _Step from './build/_Step';
/**
 * Return a factory to create new view model objects using registered aspects
 *
 * @param {Array} aspects : Aspect factory objects that have been registered with the ViewModel API
 * @param {Object} config : configuration for VM factory
 *
 * @returns {Object}: A factory object with a create function for creating new view model objects
 **/
export default (aspects, config) => {
    function createRootViewModelNode(modelRoot, metadataInfo) {
        const VMNode = _VMNode(modelRoot, aspects, config);
        // eslint-disable-next-line no-use-before-define
        const VMListNode = _VMListNode(VMNode, createViewModelNode);

        const viewModelNode = new VMNode(metadataInfo, _AncestorChainFactory.emptyChain);

        function setDTOProperty(
            dtoViewModel, propertyName, propertyMetadataInfo, propertyAncestorChain
        ) {
            let node = null;
            Object.defineProperty(dtoViewModel, propertyName, {
                get: () => {
                    if (!dtoViewModel.value) {
                        return;
                    }

                    if (node) {
                        // eslint-disable-next-line consistent-return
                        return node;
                    }

                    // create node lazily if parent node has a value
                    // eslint-disable-next-line no-use-before-define
                    node = createViewModelNode(
                        dtoViewModel,
                        propertyName,
                        _Step.property(
                            propertyMetadataInfo.dtoType.xCenter.name,
                            propertyMetadataInfo
                        ),
                        propertyAncestorChain
                    );
                    // eslint-disable-next-line consistent-return
                    return node;
                },
                set: (vmNodeOrModel) => {
                    if (!node) {
                        // eslint-disable-next-line no-use-before-define
                        node = createViewModelNode(
                            dtoViewModel,
                            propertyName,
                            _Step.property(
                                propertyMetadataInfo.dtoType.xCenter.name,
                                propertyMetadataInfo
                            ),
                            propertyAncestorChain
                        );
                    }

                    node.set(vmNodeOrModel);
                },
                enumerable: true
            });
        }

        /* Set view model nodes for properties of a DTO view model node */
        function setDTOProperties(_viewModelNode) {
            const pathBuilder = _AncestorChainFactory.build(
                _viewModelNode,
                _viewModelNode._metadataInfo,
                _viewModelNode._ancestorChain
            );
            const metadataProperties = _viewModelNode._metadataInfo.valueType.typeInfo.properties;
            // eslint-disable-next-line no-restricted-syntax
            for (const properyMetadata of metadataProperties) {
                const propertyName = StringUtil.toSerializedPropertyName(properyMetadata.name);
                const propertyAncestorChain = pathBuilder.forChild(properyMetadata.name);
                // eslint-disable-next-line max-len
                setDTOProperty(_viewModelNode, propertyName, properyMetadata, propertyAncestorChain);
            }
        }

        /* Create a view model node for the current metadata and ancestor chain. */
        function createViewModelNode(_parentViewModel, accessorCode, _metadataInfo, ancestorChain) {
            if (_metadataInfo.valueType.isCollection) {
                return new VMListNode(_metadataInfo, ancestorChain, accessorCode);
            }
            const _viewModelNode = new VMNode(_metadataInfo, ancestorChain, accessorCode);
            const { typeInfo } = _metadataInfo.valueType;
            if (typeInfo && typeInfo.metaType.isDto) {
                setDTOProperties(_viewModelNode, _metadataInfo, ancestorChain);
            }
            return _viewModelNode;
        }


        setDTOProperties(viewModelNode);
        return viewModelNode;
    }


    return {
        /**
         * Create a new view model object based on an object containing data and a metadata type
         *
         * @param {Object} modelRoot : initial data object for view model.
         *      Error thrown if data is not an object
         * @param {Object} metadataInfo : metadata information associated with the root model object
         *
         * @returns {Object}: A new view model object
         **/
        create: (modelRoot, metadataInfo) => {
            return createRootViewModelNode(modelRoot, metadataInfo);
        }
    };
};
