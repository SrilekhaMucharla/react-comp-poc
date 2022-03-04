import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import {
    HDDataCard, HDDropdownList, HDInfoCardRefactor, HDLabelRefactor, HDModal
} from 'hastings-components';
import HDVehicleDetailsPage from '../HDVehicleDetailsPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import submission from '../../../../routes/SubmissionVMInitial';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import withTranslator from '../../__helpers__/test/withTranslator';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

const onChangeAction = (component, path, componentName, changeValue) => {
    component.invoke('onChange')({
        target: {
            name: componentName,
            value: changeValue,
            // eslint-disable-next-line no-unused-vars
            setAttribute: (name, value) => { /* mock */ },
            getAttribute: (attr) => {
                if (attr === 'path') return path;
                return '';
            }
        }
    });
};

describe('<HDVehicleDetailsPage />', () => {
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        // Set default values
        const initialState = {
            vehicleDetails: {
                data: {
                    abiCode: '32120102',
                    alarmImmobilizer: '93',
                    body: 'SALOON',
                    bodyCode: '02',
                    colour: 'SILVER',
                    drivingSide: 'R',
                    engineSize: '2143',
                    fuelType: 'Diesel',
                    importType: 'no',
                    make: 'MERCEDES-BENZ',
                    model: 'E250 SPORT ED125 CDI BLUE',
                    numberOfDoors: 4,
                    numberOfSeats: '5',
                    registrationsNumber: 'BD51 SMR',
                    transmission: 'MANUAL',
                    type: 'PrivateCar_Ext',
                    weight: 2280,
                    year: 2012,
                    yearManufactured: 2012
                }
            },
            wizardState: {
                data: {
                    submissionVM: submissionVM
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            },
            multiQuoteModel: {
                multiQuoteError: {
                    error: { message: 'error' }
                },
                multiQuoteObj: {}
            },
            getPriceNavigationFlag: { data: true },
            setmilestoneEdit: { trigger: false },
        };
        store = mockStore(initialState);
    });

    test('correct car information is displayed in verify info section, based on mockup vehicle data', async () => {
        let wrapper;
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={() => {}} handleBackward={() => {}} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        const carInfoSection = wrapper.find('.vehicle-details__information-section');
        const carInfoLabels = carInfoSection.find(HDLabelRefactor);
        expect(carInfoLabels.at(0).props()).toHaveProperty('text', 'Right-hand drive');
        expect(carInfoLabels.at(2).props()).toHaveProperty('text', 'Not imported');
        expect(carInfoLabels.at(3).props()).toHaveProperty('text', '5 seats');
    });

    test('"that\'s a wrong car" on click triggers handleBackward when no onFind funcion is passed as a prop', async () => {
        let wrapper;
        createPortalRoot();
        const handleBackwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={() => {}} handleBackward={() => handleBackwardMock()} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        wrapper.find(HDDataCard).find('a').simulate('click');
        expect(handleBackwardMock).toHaveBeenCalled();
    });

    test('correct car information confirmation in read only mode: yes is disabled default', async () => {
        let wrapper;
        createPortalRoot();
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={() => handleForwardMock()} handleBackward={() => {}} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        wrapper.find('.vehicle-details__yes-button').find('button').simulate('click');
        expect(wrapper.find('.vehicle-details__yes-button').find('button').props()).toHaveProperty('disabled', false);
    });

    test('correct car information confirmation in read only mode: choosing No allows for editing car details', async () => {
        let wrapper;
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={() => {}} handleBackward={() => {}} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        await act(async () => {
            wrapper.find('.vehicle-details__no-button').find('button').simulate('click');
        });
        wrapper.update();
        const carInfoEditSection = wrapper.find('.vehicle-details__edit');
        expect(carInfoEditSection.exists()).toBeTruthy();
        expect(carInfoEditSection.props()).toHaveProperty('hidden', false);
    });

    test('confirming car information from edit mode disables edit mode', async () => {
        let wrapper;
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={() => {}} handleBackward={() => {}} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        wrapper.find('.vehicle-details__no-button').find('button').simulate('click');
        wrapper.find('.vehicle-details__edit__confirm-button button').simulate('click');
        expect(wrapper.find('.vehicle-details__edit').props()).toHaveProperty('hidden', true);
    });

    test('confirming car information from edit mode triggers forward action', async () => {
        let wrapper;
        const handleForwardMock = jest.fn();
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage handleForward={handleForwardMock} handleBackward={() => {}} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        wrapper.find('.vehicle-details__no-button').find('button').simulate('click');
        wrapper.find('.vehicle-details__edit__confirm-button button').simulate('click');
        expect(handleForwardMock).toHaveBeenCalled();
    });

    test('that\'s a wrong car" on click triggers onFind when it is passed as a prop', async () => {
        let wrapper;
        const onFindMock = jest.fn();
        const setVehicleDetailsMock = jest.fn();
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage
                            setVehicleDetails={setVehicleDetailsMock}
                            handleForward={() => {}}
                            handleBackward={() => {}}
                            onFind={() => onFindMock()} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        wrapper.find(HDDataCard).invoke('onLinkClick')();
        expect(onFindMock).toHaveBeenCalled();
    });

    test('HDModal', async () => {
        let wrapper;
        const onFindMock = jest.fn();
        const setVehicleDetailsMock = jest.fn();
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage
                            setVehicleDetails={setVehicleDetailsMock}
                            handleForward={() => {}}
                            handleBackward={() => {}}
                            onFind={() => onFindMock()} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        const rerateModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === 'Just so you know...');
        expect(rerateModal().props()).toHaveProperty('show', false);
        rerateModal().invoke('onConfirm')();
        expect(rerateModal().props()).toHaveProperty('show', false);
    });

    test('contain all the fields', async () => {
        // given
        let wrapper;
        const onFindMock = jest.fn();
        const setVehicleDetailsMock = jest.fn();
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage
                            setVehicleDetails={setVehicleDetailsMock}
                            handleForward={() => {}}
                            handleBackward={() => {}}
                            onFind={() => onFindMock()} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        // then
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(12);
        expect(wrapper.find(HDDataCard)).toHaveLength(1);
        expect(wrapper.find(HDInfoCardRefactor)).toHaveLength(1);
        expect(wrapper.find(HDDropdownList)).toHaveLength(3);
        expect(wrapper.find(HDModal)).toHaveLength(1);
    });

    test('HDToggleButtonGroup.transmission', async () => {
        // given
        let wrapper;
        const onFindMock = jest.fn();
        const setVehicleDetailsMock = jest.fn();
        createPortalRoot();
        await act(async () => {
            wrapper = mount(withTranslator(
                <BrowserRouter>
                    <Provider store={store}>
                        <HDVehicleDetailsPage
                            setVehicleDetails={setVehicleDetailsMock}
                            handleForward={() => {}}
                            handleBackward={() => {}}
                            onFind={() => onFindMock()} />
                    </Provider>
                </BrowserRouter>
            ));
        });
        wrapper.update();
        const noButton = wrapper.find('HDToggleButtonGroup').at(0);
        await act(async () => {
            onChangeAction(
                noButton,
                noButton.prop('path'),
                noButton.prop('name'),
                'false'
            );
        });
        await act(async () => wrapper.update());
        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].payload).toBeTruthy();
    });
});
