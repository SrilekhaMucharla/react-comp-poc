import _ from 'lodash';
import _VMFactory from '../_VMFactory';
/**
 * Add an aspect property to create recreate the view model object from data
 * Private aspect used by flow to recreate a view model object from a snapshot
 **/
export default {
    'getAspectProperties'(currentViewModelNode, currentMetadataNode, ancestorChain) {
        if (ancestorChain.parent) {
            // only interested in root objects
            return undefined;
        }
        return {
            _vmFromData: {
                get: () => {
                    return _.partial(
                        // eslint-disable-next-line no-underscore-dangle
                        _VMFactory(currentViewModelNode._aspectFactories).create,
                        _,
                        currentMetadataNode
                    );
                }
            }
        };
    }
};
