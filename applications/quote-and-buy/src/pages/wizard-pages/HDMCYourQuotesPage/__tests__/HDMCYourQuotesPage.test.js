import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import _ from 'lodash';
import {
    HDTable, HDImageRadioButton
} from 'hastings-components';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDQuoteService from '../../../../api/HDQuoteService';
import HDMCYourQuotesPage from '../HDMCYourQuotesPage';
import defaultTranslator from '../../__helpers__/testHelper';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import * as messages from '../HDMCYourQuotesPage.messages';
import getCarName from '../../../../common/getCarName';
import routes from '../../../../routes/WizardRouter/RouteConst';

jest.mock('../../../../common/formatRegNumber', () => ({
    __esModule: true,
    default: (regNum) => regNum,
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
let mcSubmissionVM;

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

const getSingleSubmissionVM = (submissionVMIndex) => {
    return mcSubmissionVM.quotes.children[submissionVMIndex];
};

const initializeStore = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: mcSubmissionVM
            },
            app: {
                isPCWJourney: false,
                pcwName: 'test'
            }
        },
    };

    return mockStore(initialState);
};

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCYourQuotesPage {...props} />
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

async function pickCoverBrand(wrapper, coverBrand) {
    const event = { target: { value: coverBrand } };
    await act(async () => {
        wrapper.find(HDTable)
            .findWhere((n) => n.type() === HDImageRadioButton && n.prop('currentValue') === coverBrand)
            .find('input')
            .simulate('change', event);
    });
    wrapper.update();
}

describe('<HDMCYourQuotesPage />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(HDQuoteService, 'applyDiscountOnMulticar').mockImplementation(() => Promise.resolve({
            result: mcSubmissionVM
        }));
        jest.spyOn(HDQuoteService, 'updateSelectedVersionForMP').mockImplementation(() => Promise.resolve({
            result: mcSubmissionVM
        }));
    });
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDMCYourQuotesPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Should have first car registrationsNumber on button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        const submissionVM = getSingleSubmissionVM(0);
        const regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`);
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').text()).toEqual(`${messages.confirmCovLabel}${regNum}`);
    });

    test('Should show total multicar discount', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        const totalDiscount = Math.abs(mcSubmissionVM.value.totalMPDiscount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        expect(wrapper.find('HDLabelRefactor#hd-mc-your-quotes-total-saving-text').props().text).toEqual(messages.getTotalMultiCarSavingText(totalDiscount));
    });

    test('Should show make and model text for first car', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        const submissionVM = getSingleSubmissionVM(0);
        const make = _.get(submissionVM, `${vehiclePath}.value.make`);
        const model = _.get(submissionVM, `${vehiclePath}.value.model`);
        expect(wrapper.find('HDLabelRefactor#hd-mc-your-quotes-make-model-text').text())
            .toEqual(`${messages.mcYourQuoteHeader}${getCarName(make, model)}...`);
    });

    test('Button confirm-cover should be disable', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').props().disabled).toBeTruthy();
    });

    test('Button confirm-cover should be enabled once brand selected', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        await pickCoverBrand(wrapper, 'HE');
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').props().disabled).toBeFalsy();
    });

    test('Should have second car registrationsNumber on button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        const submissionVM = getSingleSubmissionVM(1);
        const regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').text()).toEqual(`${messages.confirmCovLabel}${regNum}`);
    });

    test('Should show make and model text for second car', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        const submissionVM = getSingleSubmissionVM(1);
        const make = _.get(submissionVM, `${vehiclePath}.value.make`);
        const model = _.get(submissionVM, `${vehiclePath}.value.model`);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        expect(wrapper.find('HDLabelRefactor#hd-mc-your-quotes-make-model-text').text())
            .toEqual(`${messages.mcChildCarYourQuoteHeader}${getCarName(make, model)}...`);
    });

    test('Button confirm-cover should be disable on child car page', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').props().disabled).toBeTruthy();
    });

    test('Button confirm-cover should be enabled once brand selected on child car page', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        await pickCoverBrand(wrapper, 'HE');
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').props().disabled).toBeFalsy();
    });

    test('Should show first car registrationsNumber on button when user on second car and clicked back button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        let submissionVM = getSingleSubmissionVM(1);
        let regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').text()).toEqual(`${messages.confirmCovLabel}${regNum}`);
        await wrapper.find('BackNavigation#backNavMCYourQuote').simulate('click');
        submissionVM = getSingleSubmissionVM(0);
        regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`);
        expect(wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').text()).toEqual(`${messages.confirmCovLabel}${regNum}`);
    });

    test('Should show saving page when user on first car and clicked back button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        await act(async () => { wrapper.find('BackNavigation#backNavMCYourQuote').simulate('click'); });
        wrapper.update();
        expect(mockedPush).toHaveBeenCalledWith(routes.MC_SAVINGS_PAGE);
    });

    test('Should show Coverage Transition to MultiCar customize quote page when user on last car and clicked continue button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        await pickCoverBrand(wrapper, 'HE');
        await act(async () => { wrapper.find('HDButtonRefactor#hd-mc-your-quotes-continue-button').simulate('click'); });
        wrapper.update();
        expect(mockedPush).toHaveBeenCalledWith(routes.COVERAGE_TRANSITION);
    });
});
