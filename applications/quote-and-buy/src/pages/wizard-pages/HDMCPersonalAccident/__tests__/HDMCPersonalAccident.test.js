import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {
    HDLabelRefactor
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import multisubmissionVM from '../mocks/mcsubmissionVMMock';
import customizeSubmissionVM from '../../../../routes/CustomizesubmissionVMInitial.json';
import HDMCPersonalAccident from '../HDMCPersonalAccident';

let store;
const middlewares = [];
const mockStore = configureStore(middlewares);
describe('<HDMCPersonalAccident />', () => {
    let wrapper;
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
        const mcsubmission = viewModelService.create(
            multisubmissionVM,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const mccustomizesubmission = viewModelService.create(
            customizeSubmissionVM,
            'pc',
            'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
        );

        const initialState = {
            mcStartDatePageIndex: {
                currentPageIndex: 0
            },
            wizardState: {
                data: {
                    mcsubmissionVM: mcsubmission,
                    multiCustomizeSubmissionVM: mccustomizesubmission
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            },
            createQuoteModel: {
                quoteError: {
                    error: {
                        message: 'testErrMsg'
                    }
                }
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
            updateMultiQuoteModel: {
                multiQuoteError: {
                    error: {
                        message: 'testErrMsg'
                    }
                }
            },
            multiQuoteModel: {
                multiQuoteError: {
                    error: {
                        message: 'testErrMsg'
                    }
                }
            }
        };
        store = mockStore(initialState);
    });
    test('render component', () => {
        const emptyStore = mockStore({});
        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCPersonalAccident />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('should contain HDLabel', async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCPersonalAccident pageMetadata={pageMetadata} mcsubmissionVM={multisubmissionVM} />
            </Provider>
        );
        expect(wrapper.find(HDLabelRefactor).exists()).toBe(true);
    });
});
