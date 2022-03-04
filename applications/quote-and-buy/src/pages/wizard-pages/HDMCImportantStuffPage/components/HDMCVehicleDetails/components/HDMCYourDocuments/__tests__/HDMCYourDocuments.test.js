import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    HDLabelRefactor
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import productMetadata from '../../../../../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../../../../../__helpers__/testHelper';
import multisubmissionVM from '../mocks/mcsubmissionVMMock';
import customizeSubmissionVM from '../../../../../../../../routes/CustomizesubmissionVMInitial.json';
import createPortalRoot from '../../../../../../__helpers__/test/createPortalRoot';
import rootReducer from '../../../../../../../../redux-thunk/reducers/index';
import HDMCYourDocuments from '../HDMCYourDocuments';

window.HTMLElement.prototype.scrollIntoView = jest.fn();
jest.mock('../../../../../../../../common/downloadFile/handlePolicyBookletDownloadFile');
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe('<HDMCYourDocuments />', () => {
    createPortalRoot();
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

        const customMultiQuoteData = {
            multiCustomUpdatedQuoteCoverageObj: {
                customQuotesResponses: customizeSubmissionVM.customQuotes
            },
            loading: true
        };

        const initialState = {
            mcStartDatePageIndex: {
                currentPageIndex: 0
            },
            wizardState: {
                data: {
                    mcsubmissionVM: mcsubmission,
                    multiCustomizeSubmissionVM: mccustomizesubmission,
                    customMultiQuoteData: customMultiQuoteData,
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            },
            mcancillaryJourneyModel: {
                breakdown: [{
                    breakdown: true,
                    quoteID: '0000001625'
                }]
            },
            createQuoteModel: {
                quoteError: {
                    error: {
                        message: 'testErrMsg'
                    }
                }
            },
            customMultiQuoteCoveragesModel: {
                loading: false,
                multiCustomQuoteCoverageError: null,
                multiCustomQuoteCoverageFlag: false,
                multiCustomUpdatedQuoteCoverageObj: {
                    customQuotesResponses: customizeSubmissionVM.customQuotes
                },
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
        store = mockStore(initialState, rootReducer);
    });
    test('render component', () => {
        const vehicleData = {
            quoteID: '00000016251'
        };
        const emptyStore = mockStore({});
        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCYourDocuments vehicleData={vehicleData} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDLabelRefactor', async () => {
        const vehicleData = {
            quoteID: '00000016251'
        };
        wrapper = mount(
            <Provider store={store}>
                <HDMCYourDocuments pageMetadata={pageMetadata} mcsubmissionVM={multisubmissionVM} vehicleData={vehicleData} />
            </Provider>
        );
        expect(wrapper.find(HDLabelRefactor).exists()).toBe(true);
    });
});
