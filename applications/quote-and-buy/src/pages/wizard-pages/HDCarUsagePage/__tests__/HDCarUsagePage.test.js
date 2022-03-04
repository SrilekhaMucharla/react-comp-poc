import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import configureStore from 'redux-mock-store';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDCarUsagePage from '../HDCarUsagePage';

const submission = {
    baseData: {
        accountHolder: { dateOfBirth: null },
        periodStatus: 'Draft',
        producerCode: 'Default',
        termType: 'Annual',
        isPostalDocument: false,
        marketingContacts: {
            allowSMS: false,
            allowPost: false,
            allowEmail: false,
            allowTelephone: false
        },
        isExistingCustomer: false,
        jobType: 'Submission',
        productCode: 'PrivateCar_Ext',
        policyAddress: {},
        productName: 'Private Car'
    },
    lobData: {
        privateCar: {
            preQualQuestionSets: [],
            coverables: {
                drivers: [{
                    residingInUKSince: null,
                    licenceObtainedDate: null,
                    previousPoliciesInformation: {},
                    claimsAndConvictions: {
                        claimsDetailsCollection: [],
                        convictionsCollection: []
                    }
                }],
                vehicleDrivers: [{}],
                addInterestTypeCategory: 'PAVhcleAddlInterest',
                vehicles: [
                    {
                        typeOfUse: null,
                        vehicleWorth: '',
                        vehicleModifications: [
                            {
                                modification: ''
                            }
                        ],
                        isCarModified: '',
                        tracker: '',
                        isOvernightLocationHome: false
                    }
                ]
            }
        }
    }
};

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<HDCarUsagePage /> with TypeOfUse "You"', () => {
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
                    <HDCarUsagePage />
                </Provider>
            );
        });
    });

    test('render component', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('choose an option and can continue', async () => {
        const buttonGroup = wrapper.find('HDToggleButtonGroup').at(0);
        const button = buttonGroup.find('ToggleButton');

        await act(async () => button.at(0).simulate('change'));

        wrapper.update();

        const payload = store.getActions();

        expect(payload[0].payload).toStrictEqual({ canForward: true, showForward: true });
    });
});
describe('<HDCarUsagePage /> with TypeOfUse "Commercial business"', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        submission.lobData.privateCar.coverables.vehicles[0].typeOfUse = '06';
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
                    <HDCarUsagePage />
                </Provider>
            );
        });
    });

    test('render component', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('choose an option and can continue', async () => {
        const buttonGroup = wrapper.find('HDToggleButtonGroup').at(0);
        const button = buttonGroup.find('ToggleButton');

        await act(async () => button.at(0).simulate('change'));

        wrapper.update();

        const payload = store.getActions();

        expect(payload[0].payload).toStrictEqual({ canForward: true, showForward: true });
    });
});
