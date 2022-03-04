import React from 'react';
import _ from 'lodash';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDQuoteService from '../../../api/HDQuoteService';
import productMetadata from '../../../generated/metadata/product-metadata.json';
import HastingsInterstitialPage from '../HastingsInterstitialPage';
import defaultTranslator from '../../wizard-pages/__helpers__/testHelper';
import mockSubmission from '../../../routes/SubmissionVMInitial';
import createPortalRoot from '../../wizard-pages/__helpers__/test/createPortalRoot';

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

const mockResultData = [{
    json: {
        multiCar: 'test'
    }
}];

let mockRetrieveQuoteObj = [{
    quoteData: {
        offeredQuotes: []
    },
    bindData: {},
    lobData: {},
    quoteID: '001',
    sessionUUID: '001',
    baseData: {
        periodStatus: 'Quoted',
    },
}];

const mockState = {
    monetateModel: {
        resultData: mockResultData
    },
    wizardState: {
        app: {
            pcwName: 'test'
        },
        data: mockSubmission
    },
    retrieveQuoteModel: { retrieveQuoteObj: mockRetrieveQuoteObj }
};

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    useLocation: () => ({
        state: 'test',
        search: 'test'
    })
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
}));

jest.mock('../../../api/HDQuoteService');
jest.mock('../../../customer/directintegrations/reviews/reviews', () => jest.fn());

// jest.mock('../../../common/monetateHelper', () => ({
//     ...jest.requireActual('../../../common/monetateHelper'),
//     getMultiCarParams: jest.fn(),
//     getReportingArray: jest.fn(),
// }));


describe('<HastingsInterstitialPage />', () => {
    let wrapper;
    createPortalRoot();
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            mockSubmission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const yearsLivedAtCurrentAddressFieldName = 'yearsLivedAtCurrentAddress.aspects.availableValues';
        const yearsLivedAtCurrentAddressPath = `${driverPath}.${yearsLivedAtCurrentAddressFieldName}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, yearsLivedAtCurrentAddressPath);
        _.set(mockSubmission, yearsLivedAtCurrentAddressPath, aspects);

        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: mockSubmission
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            },
            monetateModel: {
                resultData: {}
            }
        };
        store = mockStore(initialState);
    });

    test('render component', () => {
        wrapper = shallow(
            <Provider store={store}>
                <HastingsInterstitialPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Retrieve quote by quoteid', async () => {
        const mockData = {
            data: {
                page: 1,
                quoteID: 123456789,
                action: 'action',
                producerCode: 'producer_code',
                campaignCode: 'producer_code',
                lastName: 'test',
                postalCode: 'AVFTH',
                productBand: 'test',
                lob: 'tests'
            },
            loading: true
        };

        HDQuoteService.retrieveQuote.mockResolvedValue(mockData.data);

        wrapper = mount(
            <Provider store={store}>
                <HastingsInterstitialPage />
            </Provider>
        );

        await act(async () => {
            expect(mockSubmission).toBeDefined();
            expect(mockSubmission.baseData.jobType).toEqual('Submission');
        });
        expect(wrapper).toMatchSnapshot();
    });

    afterEach(() => {
        wrapper.unmount();
    });
});

describe('<HastingsInterstitialPage />', () => {
    createPortalRoot();

    const getWrapper = () => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            mockSubmission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const yearsLivedAtCurrentAddressFieldName = 'yearsLivedAtCurrentAddress.aspects.availableValues';
        const yearsLivedAtCurrentAddressPath = `${driverPath}.${yearsLivedAtCurrentAddressFieldName}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, yearsLivedAtCurrentAddressPath);
        _.set(mockSubmission, yearsLivedAtCurrentAddressPath, aspects);

        store = mockStore(mockState);
        const mockHistory = {
            push: jest.fn()
        };
        const mockLocation = {
            state: {
                PCWJourney: true
            },
            search: ''
        };
        const wrapper = mount(
            <Provider store={store}>
                <HastingsInterstitialPage
                    dispatch={jest.fn()}
                    setSubmissionVM={jest.fn()}
                    history={mockHistory}
                    location={mockLocation} />

            </Provider>
        );
        return wrapper;
    };


    test('render component - Quoted', () => {
        const wrapper = getWrapper();
        expect(wrapper).toHaveLength(1);
    });

    test('render component - Expired', () => {
        // setup
        const temp = mockRetrieveQuoteObj;
        mockRetrieveQuoteObj[0].baseData.periodStatus = 'Expired';
        mockRetrieveQuoteObj[0].retrieveQuoteError = { error: { message: 'test error message.' } };
        [mockRetrieveQuoteObj] = mockRetrieveQuoteObj;
        mockState.retrieveQuoteModel = mockRetrieveQuoteObj;

        // test
        const wrapper = getWrapper();
        expect(wrapper).toHaveLength(1);

        // cleanup
        mockRetrieveQuoteObj = temp;
    });

    test('render component - Quoted - alternative retrieveQuoteObj', () => {
        // setup
        const temp = mockRetrieveQuoteObj;
        [mockRetrieveQuoteObj] = mockRetrieveQuoteObj;
        mockState.retrieveQuoteModel = mockRetrieveQuoteObj;

        // test
        const wrapper = getWrapper();
        expect(wrapper).toHaveLength(1);

        // cleanup
        mockRetrieveQuoteObj = temp;
    });

    test('render component - Expired - alternative retrieveQuoteObj', () => {
        // setup
        const temp = mockRetrieveQuoteObj;
        mockRetrieveQuoteObj[0].baseData.periodStatus = 'Expired';
        mockRetrieveQuoteObj[0].retrieveQuoteError = { error: { message: 'test error message.' } };
        [mockRetrieveQuoteObj] = mockRetrieveQuoteObj;
        mockState.retrieveQuoteModel = { retrieveQuoteObj: mockRetrieveQuoteObj };

        // test
        const wrapper = getWrapper();
        expect(wrapper).toHaveLength(1);

        // cleanup
        mockRetrieveQuoteObj = temp;
    });
});
