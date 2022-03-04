import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import HDCustomizeQuoteFinalPage from '../HDCustomizeQuoteFinalPage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let customizeSubmissionVM;

const setupStore = () => {
// Init VM
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    // Initialize mockstore with empty state
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    // this is an workaround, submissionVM is too big to create SNAP
    const vehicle = _.get(submissionVM, vehiclePath);
    _.set(submission, vehiclePath, vehicle);


    const mockCovers = require('../../HDCoverDetailsPage/mock/mockRerate.json');
    customizeSubmissionVM = viewModelService.create(
        mockCovers.result,
        'pc',
        'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
    );
    // { value: {} };
    const initialState = {
        wizardState: {
            data: {
                submissionVM: submission,
                customizeSubmissionVM: customizeSubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        }
    };
    return mockStore(initialState);
};

describe('<HDCustomizeQuoteBreakDownCoverPage />', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        store = setupStore();
        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDCustomizeQuoteFinalPage.WrappedComponent />
                </Provider>
            );
        });
    });

    test('component renders', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('press YES on ToggleButtonGroup', async () => {
        const yesButton = wrapper.find('ToggleButton').at(0);
        await act(async () => yesButton.props().onChange({
            target:
            {
                value: '1',
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
            }
        }));
        wrapper.update();
        expect(yesButton.prop('value')).toBe('1');
    });

    test('press YES on ToggleButtonGroup', async () => {
        const noButton = wrapper.find('ToggleButton').at(1);

        await act(async () => noButton.props().onChange({
            target:
            {
                value: '2',
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
            }
        }));
        wrapper.update();
        expect(noButton.prop('value')).toBe('2');
    });
});
