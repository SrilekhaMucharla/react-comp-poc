import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDAddAnotherCarPage from '../HDAddAnotherCarPage';
import submission from '../../../../routes/SubmissionVMInitial';
import * as messages from '../HDAddAnotherCar.messages';

const pageMetadataMock = {
    page_name: 'test',
    page_type: 'test',
    sales_journey_type: 'none'
};

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('<HDAddAnotherCarPage />', () => {
    let store;
    let wrapper;

    beforeEach(async () => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionVM,
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);

        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDAddAnotherCarPage pageMetadata={pageMetadataMock} />
                </Provider>
            );
        });
    });

    test('render component', async () => {
        expect(wrapper).toHaveLength(1);
    });

    it('Click on YES and can go forward', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').props();

        const button = wrapper.find('HDToggleButtonGroup');

        await act(async () => {
            button.props()
                .onChange({
                    target: {
                        name: 'isAddAnotherCar',
                        value: messages.yes,
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') return path;
                            return '';
                        },
                    }
                });
        });
        wrapper.update();

        const actions = store.getActions();

        expect(actions).toHaveLength(2);
        expect(actions[1].payload).toBeTruthy();
    });

    test('Click on NO and can go forward', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').props();

        const button = wrapper.find('HDToggleButtonGroup');

        await act(async () => {
            button.props()
                .onChange({
                    target: {
                        name: 'isAddAnotherCar',
                        value: messages.no,
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') return path;
                            return '';
                        },
                    }
                });
        });
        wrapper.update();

        const actions = store.getActions();

        expect(actions).toHaveLength(2);
        expect(actions[1].payload).toBeTruthy();
    });
    test('No option clicked and cannot move forward', async () => {
        wrapper.find('HDToggleButtonGroup').props().onChange({ target: { value: '' } });

        expect(wrapper.props().store.getActions()[0].payload.canForward).toBeFalsy();
        wrapper.update();

        const actions = store.getActions();

        expect(actions).toHaveLength(1);
        expect(actions.payload).toBeFalsy();
    });
});
