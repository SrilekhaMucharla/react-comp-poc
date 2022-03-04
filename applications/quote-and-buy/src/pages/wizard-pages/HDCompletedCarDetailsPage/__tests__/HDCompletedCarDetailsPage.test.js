import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import HDCompletedCarDetailsPage from '../HDCompletedCarDetailsPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';

const customSubmission = {
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
                        registrationsNumber: 'SAM42A',
                        make: 'ma',
                        model: 'mo',
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

let store;

describe('<HDCompletedCarDetailsPage /> with filled make, model and reg', () => {
    beforeEach(() => {
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
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
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
                    <HDCompletedCarDetailsPage />
                </Provider>
            );
        });
        expect(wrapper)
            .toMatchSnapshot();
    });
});

describe('<HDCompletedCarDetailsPage /> without filled make, model and reg', () => {
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            customSubmission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        // this is an workaround, submissionVM is too big to create SNAP
        const vehicle = _.get(submissionVM, vehiclePath);
        _.set(customSubmission, vehiclePath, vehicle);
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: customSubmission
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
                    <HDCompletedCarDetailsPage />
                </Provider>
            );
        });

        expect(wrapper)
            .toMatchSnapshot();
    });
});
