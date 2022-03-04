import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import {
    HDCompletedCardInfo,
    HDLabelRefactor
} from 'hastings-components';
import defaultTranslator from '../../wizard-pages/__helpers__/testHelper';
import productMetadata from '../../../generated/metadata/product-metadata.json';
import submission from '../../../routes/SubmissionVMInitial';
import multiCarSubmission from '../../../routes/MCsubmissionMockTesting';
import HDMultiCarMilestonePage from '../HDMultiCarMilestonePage';
import HDQuoteService from '../../../api/HDQuoteService';
import createPortalRoot from '../../wizard-pages/__helpers__/test/createPortalRoot';
import withTranslator from '../../wizard-pages/__helpers__/test/withTranslator';
import DeleteDriverModal from '../../wizard-pages/HDAddAnotherDriverPage/DeleteDriverModal';
import DeleteVehicleModal from '../DeleteVehicleModal';
import MaxVehicleModal from '../MaxVehicleModal';
import routes from '../../../routes/WizardRouter/RouteConst';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);


// given
const driverIndex = 1;
const mockedRouterState = { driverIndex };
const mockedPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: mockedRouterState
    }),
    useHistory: () => ({
        push: mockedPush
    }),
}));

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));

const mockedDetDriversList = jest.fn();
const mockedSetDeleteDriverIndex = jest.fn();
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: (init) => {
        return init === [] ? [init, mockedDetDriversList] : [init, mockedSetDeleteDriverIndex];
    }
}));
const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

const handleForward = jest.fn();

const customprops = {
    pageMetadata: pageMetadata,
    handleForward: handleForward,
    history: {
        location: {
            state: ''
        },
        push: jest.fn(),
        goBack: jest.fn()
    }
};

function createInitialState() {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const mcsubmissionVM = viewModelService.create(
        multiCarSubmission,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                mcsubmissionVM: mcsubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        },
        monetateModel: {
            resultData: { }
        },
        updateMultiQuoteModel: {
            updatedMultiQuoteObj: {},
            multiQuoteError: null,
            updateMultiQuoteFlag: false,
            loading: false
        },
        retrievemulticarQuoteModel: {
            retrievemulticarQuoteObj: {},
            retrievemulticarQuoteError: null,
            loading: false
        }
    };

    return initialState;
}

function initializeMockStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}

describe('<HDMultiCarMilestonePage />', () => {
    let wrapper;
    jest.spyOn(HDQuoteService, 'updateMultiQuote').mockImplementation((mcsubmissionVM) => Promise.resolve({
        result: mcsubmissionVM
    }));

    createPortalRoot();

    async function initializeWrapper(store, props, location) {
        await act(async () => {
            wrapper = mount(
                <MemoryRouter initialEntries={[{ ...location }]}>
                    <Provider store={store}>
                        <HDMultiCarMilestonePage {...props} />
                    </Provider>
                </MemoryRouter>
            );
        });
        wrapper.update();
        return wrapper;
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', async () => {
        const store = initializeMockStore();

        wrapper = shallow(
            <Provider store={store}>
                <HDMultiCarMilestonePage />
            </Provider>
        );
        await act(async () => wrapper.update());
        await initializeWrapper(store);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(HDMultiCarMilestonePage)).toHaveLength(1);
    });

    it('should render component and check HDCompletedCardInfo', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDCompletedCardInfo)).toHaveLength(5);
    });

    it('should render component and check button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(8);
    });

    test('clicking button triggers action', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store, customprops);
        await act(async () => { wrapper.find('HDButtonRefactor').simulate('click'); });
        expect(mockedPush).toHaveBeenCalledTimes(0);
    });

    it('should call handleForward on clicking add another driver button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        wrapper.find('#mc-milestone-add-another-driver-btn').at(1).simulate('click');
        expect(handleForwardMock).toHaveBeenCalled();
    });

    test.skip('should call handleForward on clicking continue cover details button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store, customprops);
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage />
                </Provider>
            ));
        });
        wrapper.update();
        await act(async () => { wrapper.find('#mc-milestone-continue-btn').at(0).simulate('click'); });
        expect(mockedPush).toHaveBeenCalledWith(routes.TRANSITION);
    });

    it('should hide Modal on delete driver confirm', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(DeleteDriverModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should hide Modal on delete driver cancel', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(DeleteDriverModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should hide Modal on delete vehicle confirm', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(DeleteVehicleModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should hide Modal on delete vehicle cancel', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(DeleteVehicleModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should hide Modal on max vehicle count', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(MaxVehicleModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should hide Modal on max vehicle count', async () => {
        // given
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const modal = wrapper.find(MaxVehicleModal);
        await act(async () => modal.props().onCancel());
        await act(async () => wrapper.update());
        expect(modal.prop('show')).toBeFalsy();
    });

    it('should call handleForward on clicking add another driver button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMultiCarMilestonePage handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        const driverCard = wrapper.find('#mc-milestone-driver-card');
        expect(driverCard).toBeTruthy();
    });
});
