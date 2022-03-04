import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import configureStore from 'redux-mock-store';
import { HDToggleButtonGroupRefactor } from 'hastings-components';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import mcsubmission from '../mock/mcSubmission.json';
import HDMCKeyCoverAncillaryPage from '../HDMCKeyCoverAncillaryPage';
import withTranslator from '../../__helpers__/test/withTranslator';


Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

function createInitialState() {
    const submissionVM = viewModelService.create(
        mcsubmission,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: submissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        },
        rerateModal: { status: false }
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

async function initializeWrapper(store, props, location = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Router initialEntries={[location]}>
                    <Provider store={store}>
                        <HDMCKeyCoverAncillaryPage {...props} invalidateImportantStuffPage={() => { }} />
                    </Provider>
                </Router>
            </ViewModelServiceContext.Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

async function checkRadioButton(wrapper, value) {
    await act(async () => {
        wrapper.find(HDToggleButtonGroupRefactor)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
}

function initializeMockStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}


describe('<HDMCKeyCoverAncillaryPage />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const initialState = {};
    const emptyStore = mockStore(initialState);
    const NO_RADIO_BUTTON_VAL = 'false';


    test('render component', () => {
        const wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCKeyCoverAncillaryPage
                    invalidateImportantStuffPage={() => { }} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('component renders', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper).toHaveLength(1);
    });

    test('picking value from radio button shows continue button', async () => {
        const store = initializeMockStore();
        const navigateMock = jest.fn();
        const props = { parentContinue: navigateMock };
        const wrapper = await initializeWrapper(store, props);

        // initially no ancillary coverages are selected, so button is not displayed
        expect(wrapper.find('#mc-key-cover-continue-btn button').exists()).toBeFalsy();

        // check "No" radio button (need to pick either yes or no for continue button to appear)
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        expect(wrapper.find('#mc-key-cover-continue-btn button').exists()).toBeTruthy();
    });
});
