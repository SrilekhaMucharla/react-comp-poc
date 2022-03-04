import React from 'react';
import { shallow, mount } from 'enzyme';
import { Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsIpidService } from 'hastings-capability-ipid';
import { HastingsPaymentService } from 'hastings-capability-payment';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import mcsubmission from '../mock/retrieveResponse.json';
import submission from '../../HDCustomizeQuoteSummaryPage/mock/mockSubmission.json';
import HDMCCustomizeQuoteSummaryPageConnected from '../HDMCCustomizeQuoteSummaryPage';
import withTranslator from '../../__helpers__/test/withTranslator';
import mockPaymentSchedule from '../../HDMCThanksPage/mock/mockMCPSnormal.json';
// import routes from '../../../../routes/WizardRouter/RouteConst';

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

jest.spyOn(HastingsIpidService, 'mcIpidByProducerCode').mockResolvedValue({ result: { ipidResponse: [{ ipids: {} }] } });

// const VEHICLE_PATH = routes.VEHICLE_DETAILS;
// const DRIVER_PATH = routes.MC_MILESTONE;

const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

function createInitialState() {
    const MCsubmissionVM = viewModelService.create(
        mcsubmission,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const SubmissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: MCsubmissionVM,
                submissionVM: SubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        },
        rerateModal: { status: false },
        customMultiQuoteModel: {
            loading: true,
            multiCustomUpdatedQuoteObj: {}
        },
        mcPaymentScheduleModel: {
            mcPaymentScheduleObject: mockPaymentSchedule.result,
            mcPaymentScheduleError: {}
        }
    };

    return initialState;
}

// actual store since component relies on dispatch to e.g., initialize createSumbissionVM to store
function initializeRealStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
    return store;
}

async function initializeWrapper(store, props, history = createMemoryHistory()) {
    let wrapper;
    await act(async () => {
        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Router history={history}>
                    <Provider store={store}>
                        <HDMCCustomizeQuoteSummaryPageConnected
                            setTotalPrice={jest.fn()}
                            shouldPNCDShow={jest.fn()}
                            {...props} />
                    </Provider>
                </Router>
            </ViewModelServiceContext.Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCCustomizeQuoteSummaryPage />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(HastingsPaymentService, 'fetchMCPaymentDetails').mockImplementation((data) => Promise.resolve({
            result: data
        }));
    });

    test('render component', () => {
        const wrapper = shallow((
            <HDMCCustomizeQuoteSummaryPageConnected />
        ));

        expect(wrapper).toMatchSnapshot();
    });

    test('component renders', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        HastingsPaymentService.fetchMCPaymentDetails.mockResolvedValue(mockPaymentSchedule);
        expect(wrapper).toEqual({});
    });
});
