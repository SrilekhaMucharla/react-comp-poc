import React from 'react';
import { Provider } from 'react-redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import configureStore from 'redux-mock-store';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDCarWorthPage from '../HDCarWorthPage';
import submission from '../../../../routes/SubmissionVMInitial';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<HDCarWorthPage /> with TypeOfUse "You"', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        submission.lobData.privateCar.coverables.vehicles[0].typeOfUse = '19';
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
                    <HDCarWorthPage />
                </Provider>
            );
        });
    });

    test('render component', () => {
        expect(wrapper).toHaveLength(1);
    });
    test('enter valid worth changes state', async () => {
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const vehicleWorth = 'vehicleWorth';
        const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;

        const input = wrapper.find('input').at(0);

        await act(async () => input.props().onChange({
            target: {
                value: '10000',
                name: 'vehicleWorth',
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => {
                    if (attr === 'path') return vehicleWorthPath;
                    return '';
                }
            }
        }));
        await act(async () => wrapper.update());

        const subVM = store.getState().wizardState.data.submissionVM;
        const vehicleWorthState = subVM.lobData.privateCar.coverables.vehicles.children[0].vehicleWorth;

        expect(vehicleWorthState.value).toBe('10000');
    });

    test('enter "" worth value and cannot continue', async () => {
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const vehicleWorth = 'vehicleWorth';
        const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;

        const input = wrapper.find('input').at(0);

        await act(async () => input.props().onChange({
            target: {
                value: '',
                name: 'vehicleWorth',
                getAttribute: (attr) => {
                    if (attr === 'path') return vehicleWorthPath;
                    return '';
                }
            }
        }));
        wrapper.update();

        const subVM = store.getState().wizardState.data.submissionVM;
        const vehicleWorthState = subVM.lobData.privateCar.coverables.vehicles.children[0].vehicleWorth;

        expect(vehicleWorthState.value).toBe('');
    });

    test('enter more than 999999 worth value and error popup visible', async () => {
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const vehicleWorth = 'vehicleWorth';
        const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;

        const input = wrapper.find('input').at(0);

        await act(async () => input.props().onChange({
            target: {
                value: '1000000',
                name: 'vehicleWorth',
                getAttribute: (attr) => {
                    if (attr === 'path') return vehicleWorthPath;
                    return '';
                }
            }
        }));

        await act(async () => wrapper.update());

        expect(wrapper.find('.carworth-error').props().hidden).toBeFalsy();
    });

    test('enter less than 1 worth value and error popup visible', async () => {
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const vehicleWorth = 'vehicleWorth';
        const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;

        const input = wrapper.find('input').at(0);

        await act(async () => input.props().onChange({
            target: {
                value: '0',
                name: 'vehicleWorth',
                getAttribute: (attr) => {
                    if (attr === 'path') return vehicleWorthPath;
                    return '';
                }
            }
        }));
        await act(async () => wrapper.update());

        expect(wrapper.find('.carworth-error').props().hidden).toBeFalsy();
    });

    test('enter float worth value and error popup visible', async () => {
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const vehicleWorth = 'vehicleWorth';
        const vehicleWorthPath = `${vehiclePath}.${vehicleWorth}`;

        const input = wrapper.find('input').at(0);

        await act(async () => input.props().onChange({
            target: {
                value: '1000.0',
                name: 'vehicleWorth',
                getAttribute: (attr) => {
                    if (attr === 'path') return vehicleWorthPath;
                    return '';
                }
            }
        }));
        await act(async () => wrapper.update());

        expect(wrapper.find('.carworth-error').props().hidden).toBeFalsy();
    });
});
