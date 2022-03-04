import React from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import _ from 'lodash';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import defaultTranslator from '../testHelper';

// HD
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submissionVMInitial from '../../../../routes/SubmissionVMInitial';
import withTranslator from './withTranslator';

const mountWithSubmissionVM = async (children, pathsToClone = [], additionalSubmissionValues = [], additionalStoreValues = {}, additionalWizardStoreValues = {}) => {
    const submission = _.cloneDeep(submissionVMInitial);
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    pathsToClone.forEach((path) => {
        const originalValues = _.get(submissionVM, path);
        _.set(submission, path, originalValues);
    });

    additionalSubmissionValues.forEach(({ value, path }) => _.set(submission, path, value));

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submission
            },
            app: {
                multiCarFlag: true
            },
            ...additionalWizardStoreValues
        },
        ...additionalStoreValues
    };
    const store = configureStore([])(initialState);

    let wrapper;
    // eslint-disable-next-line no-undef
    await act(async () => {
        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Provider store={store}>
                    {children}
                </Provider>
            </ViewModelServiceContext.Provider>
        ));
    });
    wrapper.update();
    return wrapper;
};

export default mountWithSubmissionVM;
