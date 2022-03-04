import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { HDButtonDashed, HDButtonRefactor, HDModal } from 'hastings-components';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import submission from '../../../../routes/SubmissionVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import HDMCDriverAllocationSecondary from '../HDMCDriverAllocationSecondary';
import DeleteDriverModal from '../../HDAddAnotherDriverPage/DeleteDriverModal';
import MaxDriverModal from '../MaxDriverModal';
import MaxVehicleModal from '../../../HDMultiCarMilestonePage/MaxVehicleModal';
import HDQuoteService from '../../../../api/HDQuoteService';

const middlewares = [];
const mockStore = configureStore(middlewares);

const mockedPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    }),
    useHistory: () => ({
        push: mockedPush
    }),
}));

let mcSubmissionVM;
let submissionVM;
const handleForward = jest.fn();

const initializeStore = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: mcSubmissionVM,
                submissionVM: submissionVM
            },
            app: {
                isEditQuoteJourney: false
            }
        },
        monetateModel: {
            resultData: {}
        },
        updateMultiQuoteModel: {
            updatedMultiQuoteObj: {},
            multiQuoteError: null,
            updateMultiQuoteFlag: false,
            loading: false
        }
    };

    return mockStore(initialState);
};

const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(withTranslator(
            <BrowserRouter>
                <Provider store={store}>
                    <HDMCDriverAllocationSecondary pageMetadata={pageMetadata} {...props} />
                </Provider>
            </BrowserRouter>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCDriverAllocationSecondary />', () => {
    let wrapper;

    beforeEach(() => {
        handleForward.mockClear();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(HDQuoteService, 'updateMultiQuote').mockImplementation(() => Promise.resolve({
            result: mcSubmissionVM
        }));
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', () => {
        const emptyStore = mockStore({});

        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCDriverAllocationSecondary />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should not show HDModal by default', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        // then
        expect(wrapper.find(HDModal).at(0).props().show).toBeFalsy();
        expect(wrapper.find(HDModal).at(1).props().show).toBeFalsy();
        expect(wrapper.find(HDModal).at(2).props().show).toBeFalsy();
    });

    test('should call handleForward on clicking Another driver button', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        const button = wrapper.find('#mc-driver-alloc-2nd-add-another-driver-btn').filter(HDButtonDashed);
        await act(async () => button.props().onClick());
        await act(async () => wrapper.update());
        // then
        expect(handleForward).toHaveBeenCalled();
    });

    test.skip('should navigate to VRN Search page on clicking Another car button', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        const button = wrapper.find('#mc-driver-alloc-2nd-add-another-car-btn').filter(HDButtonRefactor);
        await act(async () => button.props().onClick());
        await act(async () => wrapper.update());
        // then
        expect(historyMock.history.push).toBeDefined();
    });

    test('should contain Delete Driver Modal', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        // then
        expect(wrapper.find(DeleteDriverModal)).toHaveLength(1);
    });

    test('should contain Max Driver Modal', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        // then
        expect(wrapper.find(MaxDriverModal)).toHaveLength(1);
    });

    test('should contain Max Vehicle Modal', async () => {
        // given
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, { ...historyMock, handleForward });
        // then
        expect(wrapper.find(MaxVehicleModal)).toHaveLength(1);
    });

    test('should hide Delete Driver Modal on confirm', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(DeleteDriverModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Delete Driver Modal on cancel', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(DeleteDriverModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Max Driver Modal on confirm', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(MaxDriverModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Max Driver Modal on cancel', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(MaxDriverModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Max Vehicle Modal on confirm', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(MaxVehicleModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    test('should hide Max Driver Modal on cancel', async () => {
        const store = initializeStore();
        const historyMock = { history: { location: { state: { } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = await initializeWrapper(store, historyMock);
        const modal = wrapper.find(MaxVehicleModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });
});
