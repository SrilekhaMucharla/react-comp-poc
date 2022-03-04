import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {
    HDLabelRefactor,
    HDQuoteTable
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import HDMultiCarSubVehicle from '../HDMultiCarSubVehicle';

let store;
const middlewares = [];
const mockStore = configureStore(middlewares);
describe('<HDMCSubVehicleCarItem />', () => {
    let wrapper;
    const submissionVM = {
        value: {
            quotes: [
                {
                    baseData: { brandCode: 'PCW', },
                    lobData: {
                        privateCar: {
                            offerings: [{
                                branchName: 'HastingsPremium',
                                branchCode: 'HP',
                                coverages: [
                                    {
                                        name: 'Motor Legal Expense',
                                        selected: false
                                    }
                                ]
                            }]
                        }
                    }
                }
            ]
        }
    };
    const pageMetadata = {
        page_name: 'page name',
        page_type: 'page type',
        sales_journey_type: 'sales journey type'
    };
    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    beforeEach(() => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        const mcsubmissionVM = viewModelService.create(
            submissionVM,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: mcsubmissionVM
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            },
            mcancillaryJourneyModel: {
                breakdown: [],
                substituteVehicle: [{
                    substituteVehicle: true,
                    quoteID: '12345'
                },
                {
                    substituteVehicle: true,
                    quoteID: '56789'
                }]
            },
        };
        store = mockStore(initialState);
    });

    test('render component', () => {
        const emptyStore = mockStore({});

        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMultiCarSubVehicle />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDLabel', async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMultiCarSubVehicle pageMetadata={pageMetadata} mcsubmissionVM={submissionVM} />
            </Provider>
        );
        expect(wrapper.find(HDLabelRefactor).exists()).toBe(true);
        expect(wrapper.find(HDQuoteTable).exists()).toBe(true);
    });
});
