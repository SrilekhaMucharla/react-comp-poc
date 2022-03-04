import React, { Component } from 'react';
import ViewModelServiceContext from './ViewModelServiceContext';

export default function withViewModelServiceHOC(WrappedComponent) {
    return class extends Component {
        render() {
            return (
                <ViewModelServiceContext.Consumer>
                    {(ViewModelService) => ViewModelService && (
                    /* we render the component only if the viewModelService is available */
                        <WrappedComponent viewModelService={ViewModelService} {...this.props} />
                    )
                    }
                </ViewModelServiceContext.Consumer>
            );
        }
    };
}
