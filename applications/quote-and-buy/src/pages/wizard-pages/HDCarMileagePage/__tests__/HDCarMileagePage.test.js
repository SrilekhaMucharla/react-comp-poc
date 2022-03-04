import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDCarMileagePage from '../HDCarMileagePage';
import submission from '../../../../routes/SubmissionVMInitial';


const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<HDCarMileagePage />', () => {
    let store;
    beforeEach(() => {
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
    });
    test('render component', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDCarMileagePage />
                </Provider>
            );
        });

        expect(wrapper).toHaveLength(1);
    });
    test('Enter miles', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDCarMileagePage />
                </Provider>
            );
        });

        const { path } = wrapper.find('#car-mileage-input').at(1).props();
        const input = wrapper.find('[data-testid="text-input-with-append"]');
        await act(async () => {
            input.at(0).simulate('change', {
                target: {
                    name: 'annualMileage',
                    value: '10000',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') {
                            return path;
                        }
                        return '';
                    }
                }
            });
        });
        wrapper.update();

        expect(wrapper.find('[data-testid="text-input-with-append"]')
            .at(0)
            .props().value)
            .toBe('10,000');
    });

    let realDate;
    test('test leap year', async () => {
        // Setup date change
        const currentDate = new Date('2012-05-14T11:01:58.135Z');
        realDate = Date;
        global.Date = class extends Date {
            constructor(...args) {
                if (args.length > 0) {
                    // eslint-disable-next-line constructor-super, no-constructor-return
                    return super(...args);
                }

                // eslint-disable-next-line no-constructor-return
                return currentDate;
            }
        };
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDCarMileagePage />
                </Provider>
            );
        });

        const { path } = wrapper.find('#car-mileage-input').at(1).props();
        const input = wrapper.find('#car-mileage-input');
        await act(async () => {
            input.at(1).simulate('change', {
                target: {
                    name: 'annualMileage',
                    value: '10000',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') {
                            return path;
                        }
                        return '';
                    }
                }
            });
        });
        wrapper.update();
        expect(new Date().getFullYear()).toBe(2012);
        expect(wrapper).toHaveLength(1);
        // Cleanup
        global.Date = realDate;
    });
});
