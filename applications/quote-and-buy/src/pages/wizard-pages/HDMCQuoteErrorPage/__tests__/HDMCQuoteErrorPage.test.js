import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDMCQuoteErrorPage from '../HDMCQuoteErrorPage';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import mockSubmission from '../../../../routes/SubmissionVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import * as messages from '../HDMCQuoteErrorPage.messages';
import HDQuoteService from '../../../../api/HDQuoteService';
import routes from '../../../../routes/WizardRouter/RouteConst';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE
} from '../../../../constant/const';

const middlewares = [];
const mockStore = configureStore(middlewares);

const initializeStore = (hastingsErrors = null, submisssionVMIndex = 0) => {
    if (hastingsErrors && submisssionVMIndex > 0) {
        let offeredQuotes = [...mcSubmission.result.quotes[submisssionVMIndex].quoteData.offeredQuotes];
        offeredQuotes = offeredQuotes.map((offeredQuote) => ({ ...offeredQuote, hastingsErrors }));
        mcSubmission.result.quotes[submisssionVMIndex].quoteData.offeredQuotes = offeredQuotes;
    }

    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const submissionVM = viewModelService.create(
        mockSubmission,
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
                mcsubmissionVM: mcSubmissionVM,
            },
            app: {
                multiCarFlag: true
            }
        },
        multiToSingleQuoteModel: {
            multiToSingleQuoteObject: submissionVM,
            multiToSingleQuoteError: null,
            multiToSingleQuoteLoading: true,
            multiCarFlag: true
        }
    };

    return mockStore(initialState);
};

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCQuoteErrorPage {...props} />
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

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

describe('<HDMCQuoteErrorPage />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(HDQuoteService, 'multiQuote').mockImplementation((data) => Promise.resolve({
            result: data
        }));
    });
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDMCQuoteErrorPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Should render all the valid quotes', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor#quote-card').props().text).toEqual(messages.dontWorryTitle);
        expect(wrapper.find('HDSavingsPageCard')).toHaveLength(3);
    });

    test('Should render UW_ERROR message when quote have UW error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        const store = initializeStore(hastingsErrors, 1);
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor#quote-error-card').props().text).toEqual(messages.quoteUnavailableTitle);
        expect(wrapper.find('HDLabelRefactor#car-info-card-no-quote-section-id').props().text).toEqual(messages.uwErrorMessage);
        expect(wrapper.find('HDSavingsPageCard')).toHaveLength(3);
    });

    test('Should render GREY_LIST_ERROR message when quote have GREY_LIST error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: GREY_LIST_ERROR_CODE
        }];
        const store = initializeStore(hastingsErrors, 1);
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor#quote-error-card').props().text).toEqual(messages.quoteUnavailableTitle);
        expect(wrapper.find('HDLabelRefactor#car-info-card-no-quote-section-id').props().text).toEqual(messages.greyListErrorMessage);
        expect(wrapper.find('HDSavingsPageCard')).toHaveLength(3);
    });

    test('Should render CUE_ERROR_CODE message when quote have CUE error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: CUE_ERROR_CODE
        }];
        const store = initializeStore(hastingsErrors, 1);
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDLabelRefactor#quote-error-card').props().text).toEqual(messages.quoteUnavailableTitle);
        expect(wrapper.find('HDLabelRefactor#car-info-card-no-quote-section-id').props().text).toEqual(messages.cueErrorMessage(50000000279));
        expect(wrapper.find('HDSavingsPageCard')).toHaveLength(3);
    });

    test('Should render button text dynamically when any quotes have hastingsErrors', async () => {
        const hastingsErrors = [{
            technicalErrorCode: CUE_ERROR_CODE
        }];
        const store = initializeStore(hastingsErrors, 1);
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDButtonRefactor#continue-with-one-car-button').props().label).toEqual(messages.continueOneCar('two'));
    });

    test('Should redirect to saving page when one quotes have hastingsErrors from 3 quotes and click on continue button', async () => {
        const hastingsErrors = [{
            technicalErrorCode: CUE_ERROR_CODE
        }];
        const store = initializeStore(hastingsErrors, 1);
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDButtonRefactor#continue-with-one-car-button').props().label).toEqual(messages.continueOneCar('two'));
        await act(async () => { wrapper.find('HDButtonRefactor#continue-with-one-car-button').simulate('click'); });
        wrapper.update();
        expect(mockedPush).toHaveBeenCalledWith(routes.MC_SAVINGS_PAGE);
    });
});
