import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDMCCustomizeQuoteWizard from '../HDMCCustomizeQuoteWizard';
import defaultTranslator from '../../wizard-pages/__helpers__/testHelper';
import productMetadata from '../../../generated/metadata/product-metadata.json';
import * as mcSubmission from '../../../routes/mockMCSubmissionQuoted.json';

let mcSubmissionVM;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const pncdFlag = [true, false];

/* const getSingleSubmissionVM = (submissionVMIndex) => {
    return mcSubmissionVM.quotes.children[submissionVMIndex];
}; */
jest.mock('../../wizard-pages/HDMCCustomizeQuoteSummaryPage/HDMCCustomizeQuoteSummaryPage', () => (props) => <mockHDMCCustomizeQuoteSummaryPage {...props} />);
jest.mock('../../wizard-pages/HDMCPNCDPage/HDMCPNCDPage', () => (props) => <mockHDMCPNCDPage {...props} />);
jest.mock('../../wizard-pages/HDMotorLegalMultiCarPage/HDMotorLegalMultiCarPage', () => (props) => <mockHDMotorLegalMultiCarPage {...props} />);

const initializeStore = (mcupdateMarketingPreferencesModel = null) => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    if (mcupdateMarketingPreferencesModel) _.set(mcSubmissionVM, 'value', mcupdateMarketingPreferencesModel.marketingUpdatedObj);

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: mcSubmissionVM
            },
            app: {
                multiCarFlag: true
            }
        }
    };

    return mockStore(initialState);
};

async function initializeWrapper(store, props, location = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <MemoryRouter initialEntries={[location]}>
                <Provider store={store}>
                    <HDMCCustomizeQuoteWizard {...props} />
                </Provider>
            </MemoryRouter>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCCustomizeQuoteWizard />', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }))
        });
    });
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDMCCustomizeQuoteWizard />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Should render default page HDMCCustomizeQuoteSummaryPage', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('mockHDMCCustomizeQuoteSummaryPage')).toHaveLength(1);
    });

    test('Should render HDMCPNCDPage when click on continue button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('mockHDMCPNCDPage')).toHaveLength(0);
        await act(async () => wrapper.find('HDButtonRefactor.mc-customize-quote-wizard__continue-button').simulate('click'));
        await act(async () => wrapper.update());
        pncdFlag.forEach((flag) => {
            if (flag) {
                expect(wrapper.find('mockHDMCPNCDPage')).toHaveLength(1);
            } else {
                expect(wrapper.find('mockHDMotorLegalMultiCarPage')).toHaveLength(0);
            }
        });
    });

    test('Should render mockHDMotorLegalMultiCarPage when we are on HDMCPNCDPage and click continue button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('mockHDMCCustomizeQuoteSummaryPage')).toHaveLength(1);
        await act(async () => wrapper.find('HDButtonRefactor.mc-customize-quote-wizard__continue-button').simulate('click'));
        await act(async () => wrapper.update());
        expect(wrapper.find('mockHDMCPNCDPage')).toHaveLength(1);
        await act(async () => wrapper.find('HDButtonRefactor.mc-customize-quote-wizard__continue-button').simulate('click'));
        await act(async () => wrapper.update());
        expect(wrapper.find('mockHDMotorLegalMultiCarPage')).toHaveLength(1);
    });
});
