import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDMCHeadsUpPage from '../HDMCHeadsUpPage';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [];
const mockStore = configureStore(middlewares);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    })
}));


const initializeStore = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: mcSubmissionVM
            }
        },
    };

    return mockStore(initialState);
};

async function initializeWrapper(store) {
    let wrapper;
    createPortalRoot();
    const handleForward = jest.fn();
    const handleSkip = jest.fn();
    const setNavigation = jest.fn();
    await act(async () => {
        wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDMCHeadsUpPage handleSkip={handleSkip} handleForward={handleForward} setNavigation={setNavigation} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCHeadsUpPage />', () => {
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const wrapper = shallow(
            <Provider store={store}>
                <HDMCHeadsUpPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Component should have container - headsup', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('.mc-scan-or-continue-heads-up-container')).toBeTruthy();
    });

    test('Component should have Button- i Understand', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('#page-scan-or-continue-button-scan-licence')).toBeTruthy();
    });

    test('Should render two <HDButtonRefactor />', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDButtonRefactor')).toHaveLength(2);
    });

    test('Should render two <HDLabelRefactor />', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor')).toHaveLength(2);
    });

    test('Should render two <HDInfoCardRefactor />', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDInfoCardRefactor')).toHaveLength(2);
    });
});
