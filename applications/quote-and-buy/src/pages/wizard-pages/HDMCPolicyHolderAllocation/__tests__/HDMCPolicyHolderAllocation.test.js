import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import {
    HDCompletedCardInfo,
    HDLabelRefactor
} from 'hastings-components';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import multiCarSubmission from '../../../../routes/MCsubmissionMockTesting';
// import HDQuoteService from '../../../../api/HDQuoteService';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import withTranslator from '../../__helpers__/test/withTranslator';
import HDMCPolicyHolderAllocation from '../HDMCPolicyHolderAllocation';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockedDetDriversList = jest.fn();
const mockedSetDeleteDriverIndex = jest.fn();
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: (init) => {
        return init === [] ? [init, mockedDetDriversList] : [init, mockedSetDeleteDriverIndex];
    }
}));

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
    };

    return initialState;
}

function initializeMockStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}

describe('<HDMCPolicyHolderAllocation />', () => {
    let wrapper;

    createPortalRoot();

    async function initializeWrapper(store, props, location) {
        await act(async () => {
            wrapper = mount(
                <MemoryRouter initialEntries={[{ ...location }]}>
                    <Provider store={store}>
                        <HDMCPolicyHolderAllocation {...props} />
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
                <HDMCPolicyHolderAllocation />
            </Provider>
        );
        await act(async () => wrapper.update());
        await initializeWrapper(store);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(HDMCPolicyHolderAllocation)).toHaveLength(1);
    });

    it('should render component and check HDCompletedCardInfo', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDCompletedCardInfo)).toHaveLength(1);
    });

    it('should render component and check button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(2);
    });

    test('clicking button triggers action', async () => {
        const store = initializeMockStore();
        const handleForwardMock = jest.fn();
        const props = { continuebtnHandle: handleForwardMock };
        await initializeWrapper(store, props);
        wrapper.find('HDButtonRefactor').at(0).simulate('click');
        expect(handleForwardMock).not.toHaveBeenCalled();
    });

    it('should call handleForward on clicking add another driver button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        const handleForwardMock = jest.fn();
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDMCPolicyHolderAllocation handleForward={() => handleForwardMock()} />
                </Provider>
            ));
        });
        wrapper.update();
        wrapper.find('HDButtonDashed').at(0).simulate('click');
        expect(handleForwardMock).toBeDefined();
    });
});
