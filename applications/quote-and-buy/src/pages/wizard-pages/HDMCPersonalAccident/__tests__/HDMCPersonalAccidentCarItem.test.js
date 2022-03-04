import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
    HDLabelRefactor
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import HDMCPersonalAccidentCarItem from '../HDMCPersonalAccidentCarItem';

const middlewares = [];
const mockStore = configureStore(middlewares);
describe('<HDMCPersonalAccidentCarItem />', () => {
    let wrapper;
    let store;
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
                personalAccident: [{
                    personalAccident: true,
                    quoteID: '12345'
                },
                {
                    personalAccident: true,
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
                <HDMCPersonalAccidentCarItem mcsubmissionVM={submissionVM} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDLabel', async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCPersonalAccidentCarItem mcsubmissionVM={submissionVM} />
            </Provider>
        );
        expect(wrapper.find(HDLabelRefactor).exists()).toBe(true);
    });
});
