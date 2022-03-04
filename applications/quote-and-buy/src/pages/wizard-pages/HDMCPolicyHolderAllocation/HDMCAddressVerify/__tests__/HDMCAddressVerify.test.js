import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../../__helpers__/testHelper';
import productMetadata from '../../../../../generated/metadata/product-metadata.json';
import submission from '../../../../../routes/SubmissionVMInitial';
import * as mcSubmission from '../../../../../routes/mockMCSubmissionQuoted.json';
import withTranslator from '../../../__helpers__/test/withTranslator';
import createPortalRoot from '../../../__helpers__/test/createPortalRoot';
import HDMCAddressVerify from '../HDMCAddressVerify';

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

    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
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
    const setNavigation = jest.fn();
    await act(async () => {
        wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDMCAddressVerify handleForward={handleForward} setNavigation={setNavigation} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCAddressVerify />', () => {
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const wrapper = shallow(
            <Provider store={store}>
                <HDMCAddressVerify />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Component should have container - address-verify__container', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('.address-verify__container')).toBeTruthy();
    });

    test('Should render two <HDInfoCardRefactor />', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDInfoCardRefactor')).toHaveLength(1);
    });

    test('Should render one <HDLabelRefactor />', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor')).toHaveLength(1);
    });
});
