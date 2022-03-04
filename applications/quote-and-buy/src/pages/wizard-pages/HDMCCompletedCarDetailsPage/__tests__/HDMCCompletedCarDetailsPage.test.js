import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDQuoteService from '../../../../api/HDQuoteService';
import defaultTranslator from '../../__helpers__/testHelper';
import HDMCCompletedCarDetailsPage from '../HDMCCompletedCarDetailsPage';
import DeleteVehicleModal from '../../../HDMultiCarMilestonePage/DeleteVehicleModal';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import mcSubmission from '../../HDSavingsPage/mock/mockResponse.json';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

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
let mcStore;

describe('<HDMCCompletedCarDetailsPage /> with filled make, model and reg', () => {
    createPortalRoot();
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
                    <HDMCCompletedCarDetailsPage />
                </Provider>
            );
        });
        expect(wrapper)
            .toMatchSnapshot();
    });
});

const createStoreWithMC = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    // Initialize mockstore with empty state
    const submissionVM = viewModelService.create(
        customSubmission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );
    const mcSubmissionCopy = _.cloneDeep(mcSubmission);
    mcSubmissionCopy.quotes = mcSubmissionCopy.quotes.filter((quoteObj) => quoteObj.isParentPolicy);
    const mcSubmissionVM = viewModelService.create(
        mcSubmissionCopy,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    // this is an workaround, submissionVM is too big to create SNAP
    const vehicle = _.get(submissionVM, vehiclePath);
    _.set(customSubmission, vehiclePath, vehicle);
    const initialState = {
        wizardState: {
            data: {
                submissionVM: customSubmission,
                mcsubmissionVM: mcSubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        }
    };
    mcStore = mockStore(initialState);
};

describe('<HDMCCompletedCarDetailsPage /> without filled make, model and reg', () => {
    createPortalRoot();
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
                    <HDMCCompletedCarDetailsPage />
                </Provider>
            );
        });

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('should hide Modal on delete vehicle confirm', async () => {
        createStoreWithMC();
        jest.spyOn(HDQuoteService, 'multiToSingleQuote').mockImplementation((data) => Promise.resolve({
            result: data
        }));
        let wrapper;
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(
                <Provider store={mcStore}>
                    <HDMCCompletedCarDetailsPage handleForward={() => handleForwardMock()} />
                </Provider>
            );
        });
        wrapper.update();
        const modal = wrapper.find(DeleteVehicleModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        // then
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Modal on delete vehicle cancel', async () => {
        // given
        let wrapper;
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDMCCompletedCarDetailsPage handleForward={() => handleForwardMock()} />
                </Provider>
            );
        });
        wrapper.update();
        const modal = wrapper.find(DeleteVehicleModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        // then
        expect(modal.prop('show')).toBeFalsy();
    });
});
