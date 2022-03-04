import { mount, shallow } from 'enzyme';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import {
    HDDatePickerRefactor,
    HDDropdownList,
    HDImageRadioButton,
    HDModal,
    HDPolicySelect,
    HDSwitch,
    HDTable,
    HDToast
} from 'hastings-components';
import _ from 'lodash';
import React from 'react';
import Form from 'react-bootstrap/Form';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HDQuoteService from '../../../../api/HDQuoteService';
import { PAYMENT_TYPE_ANNUALLY_CODE, PAYMENT_TYPE_MONTHLY_CODE } from '../../../../constant/const';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import rootReducer from '../../../../redux-thunk/reducers/index';
import withTranslator from '../../__helpers__/test/withTranslator';
import defaultTranslator from '../../__helpers__/testHelper';
import HDVoluntaryExcessPopup from '../HDVoluntaryExcessPopup';
import * as hdVoluntaryExcessPopupMessages from '../HDVoluntaryExcessPopup.messages';
import HDYourQuotesPage from '../HDYourQuotesPage';
import * as messages from '../HDYourQuotesPage.messages';
import submission from '../mock/mockSubmission.json';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const vehicleMockPath = 'lobData.privateCar.coverables.vehicles[0]';
const offeredQuotesPath = 'quoteData.offeredQuotes';
const voluntaryExcessFieldName = 'voluntaryExcess';
const voluntaryExcessPath = `${vehicleMockPath}.${voluntaryExcessFieldName}`;
const coverTypeFieldName = 'coverType';
const coverTypePath = `${vehicleMockPath}.${coverTypeFieldName}`;

const HE = 'HE';
const HP = 'HP';
const YD = 'YD';
const TEST_ERR_MSG = 'test error message';

function createInitialState() {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            }
        },
        createQuoteModel: {
            lwrQuoteObj: {
                quoteData: {
                    offeredQuotes: []
                }
            },
            quoteError: null
        },
        rerateModal: {
            status: false,
        }
    };

    return initialState;
}

// actual store (e.g., to test behaviour relying on state changes through dispatch)
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

function initializeMockStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}

function unsetOffrdQtsMnthlyPmntsMod(initialState) {
    const offeredQuotes = _.get(initialState, `wizardState.data.submissionVM.${offeredQuotesPath}`);
    _.forEach(offeredQuotes.value, (offeredQuote) => {
        _.unset(offeredQuote, 'hastingsPremium.monthlyPayment');
    });
}

function pickCoverBrand(wrapper, coverBrand) {
    const event = { target: { value: coverBrand } };
    wrapper.find(HDTable)
        .findWhere((n) => n.type() === HDImageRadioButton && n.prop('currentValue') === coverBrand)
        .find('input')
        .simulate('change', event);
}

function getCoverNotAvailable(wrapper) {
    return wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.coverlevelNotAvailModalHeader);
}

function getCoverDetailsModal(wrapper) {
    return wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.headerText);
}

function openCoverTypeSelectionModal(wrapper) {
    wrapper.find('a#your-quote-edit-cover-level-button').simulate('click');
    expect(getCoverDetailsModal(wrapper).props()).toHaveProperty('show', true);
}

function youDriveMessagePopUp(wrapper) {
    return wrapper.findWhere((n) => n.type() === HDModal && n.prop('id') === 'confirm-cover-modal');
}

function pickCoverType(wrapper, coverType) {
    expect(getCoverDetailsModal(wrapper).props()).toHaveProperty('show', true);
    getCoverDetailsModal(wrapper).find(HDDropdownList).find('Select').invoke('onChange')(coverType);
    expect(getCoverDetailsModal(wrapper).find(HDDropdownList).prop('value')).toEqual(coverType);
}

function getRerateModal(wrapper, id) {
    return wrapper.findWhere((n) => n.type() === HDModal && n.prop('id') === id);
}

function getExcessValDropdown(wrapper) {
    return wrapper.find('.hd-your-quote__sections__section').find(HDDropdownList);
}


describe('<HDYourQuotesPage />', () => {
    let wrapper;

    // create a div, allowing createPortal() from HDToast to function properly in tests
    const portalRoot = global.document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    const body = global.document.querySelector('body');
    body.appendChild(portalRoot);

    async function initializeWrapper(store, props, location = {}) {
        await act(async () => {
            wrapper = mount(withTranslator(
                <MemoryRouter initialEntries={[location]}>
                    <Provider store={store}>
                        <HDYourQuotesPage {...props} handleForward={jest.fn()} />
                    </Provider>
                </MemoryRouter>

            ));
        });
        wrapper.update();
        return wrapper;
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(HDQuoteService, 'createQuote').mockImplementation((data) => Promise.resolve({
            result: data
        }));
        jest.spyOn(HDQuoteService, 'updateSelectedVersion').mockImplementation((data) => Promise.resolve({
            result: data
        }));
    });

    afterEach(() => {
        // make sure wrapper is unmounted, so that global portalRoot div remains empty between tests
        // (because createPortal() from HDModal may be used during tests)
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', () => {
        const store = mockStore({});
        wrapper = shallow(
            <Provider store={store}>
                <HDYourQuotesPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('offered values table is rendered with matching values', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        const mockedOfferedQuotes = _.get(submission, offeredQuotesPath);
        const { headerValues: offeredQuotesHeaderVals, data: offeredQuotesData } = wrapper.find(HDTable).props();
        expect(offeredQuotesHeaderVals).toHaveLength(mockedOfferedQuotes.length);
        expect(offeredQuotesHeaderVals).toMatchSnapshot();
        expect(offeredQuotesData).toMatchSnapshot();
    });

    test('insurance payment switch renders when both annual and monthly payments are available', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        const mockedOfferedQuotes = _.get(submission, offeredQuotesPath);
        const areBothQuotePaymentsAvlbl = mockedOfferedQuotes.some(({ hastingsPremium }) => !!hastingsPremium.monthlyPayment);
        expect(areBothQuotePaymentsAvlbl).toEqual(true);
        expect(wrapper.find(HDSwitch).exists()).toEqual(true);
    });

    test('relevant information is displayed, and payment switch does not render, when only annual payment is available', async () => {
        const store = initializeMockStore(unsetOffrdQtsMnthlyPmntsMod);
        await initializeWrapper(store);

        expect(wrapper.find('.hd-your-quote__your-options-header__show-annual-text').text()).toEqual(messages.onlyAnnualAvailText);
        expect(wrapper.find(HDSwitch).exists()).toEqual(false);
    });

    test('only annual payment information popup can be opened when only annual payment is available', async () => {
        const store = initializeMockStore(unsetOffrdQtsMnthlyPmntsMod);
        await initializeWrapper(store);

        wrapper.find('.hd-your-quote__your-options-header__show-annual-text').closest('div').find('img').invoke('onClick')();
        const getIUnderstandModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.iUnderstandModalHeader);
        expect(getIUnderstandModal().props()).toHaveProperty('show', true);

        getIUnderstandModal().invoke('onConfirm')();
        expect(getIUnderstandModal().props()).toHaveProperty('show', false);
    });

    test('choosing monthly payment type results in relevant information rendered in cover options table', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        wrapper.find(HDSwitch).find('input').simulate('change', { target: { checked: false } });
        expect(wrapper.find(HDSwitch).props()).toHaveProperty('value', PAYMENT_TYPE_MONTHLY_CODE);

        // Table row 0 should contain payment information
        expect(JSON.stringify(wrapper.find(HDTable).prop('data')[0], null, 2)).toMatchSnapshot();
    });

    test('choosing annual payment type results in relevant information rendered in cover options table', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        wrapper.find(HDSwitch).find('input').simulate('change', { target: { checked: true } });
        expect(wrapper.find(HDSwitch).props()).toHaveProperty('value', PAYMENT_TYPE_ANNUALLY_CODE);

        // Table row 0 should contain payment information
        expect(JSON.stringify(wrapper.find(HDTable).prop('data')[0], null, 2)).toMatchSnapshot();
    });

    test('voluntary excess info popup opens on button click', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(wrapper.find(HDVoluntaryExcessPopup).find('.overlay').exists()).toBeFalsy();

        wrapper.find(HDVoluntaryExcessPopup).find('.hd-overlay-btn').simulate('click');

        expect(wrapper.find(HDVoluntaryExcessPopup).find('.overlay').exists()).toBeTruthy();
        expect(wrapper.find(HDVoluntaryExcessPopup).find('.voluntary-excess__subheader').at(1).text())
            .toEqual(hdVoluntaryExcessPopupMessages.headerDescription);
    });

    test('value of voluntary excess can be chosen', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        const voluntaryExcess = _.get(submission, voluntaryExcessPath);
        expect(getExcessValDropdown(wrapper).prop('data').value).toEqual(voluntaryExcess);

        const event = { value: '100', label: '£100' };
        await act(async () => {
            getExcessValDropdown(wrapper).find('Select').invoke('onChange')(event);
        });
        wrapper.update();

        expect(getExcessValDropdown(wrapper).prop('data').value).toEqual(event.value);
    });

    test('total excess is calculated properly', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        // Table row 1 should contain total excess information
        expect(JSON.stringify(wrapper.find(HDTable).prop('data')[1], null, 2)).toMatchSnapshot();
    });

    test('Cover can be chosen', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        pickCoverBrand(wrapper, HP);

        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HP);
    });

    test('"Edit cover details" modal allows changing of cover level', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(getCoverDetailsModal(wrapper).props()).toHaveProperty('show', false);

        // Pick cover type other than the currently selected one
        const coverType = _.get(submission, coverTypePath);
        openCoverTypeSelectionModal(wrapper);
        const newCoverType = getCoverDetailsModal(wrapper).find(HDDropdownList).prop('options').find(({ value }) => value !== coverType);
        pickCoverType(wrapper, newCoverType);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();

        expect(wrapper.find('h3#your-quote-cover-level-label').text()).toEqual(newCoverType.label);
        expect(getCoverDetailsModal(wrapper).props()).toHaveProperty('show', false);
    });

    test('"Edit cover details" modal does not allow changing of cover level to tpft, when brand HE brand is chosen', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', false);

        pickCoverBrand(wrapper, HE);

        const newCoverType = { value: 'tpft', label: 'Third Party, Fire And Theft' };
        openCoverTypeSelectionModal(wrapper);
        pickCoverType(wrapper, newCoverType);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();

        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', true);
        expect(wrapper.find('h3#your-quote-cover-level-label').text()).not.toEqual(newCoverType.value);

        getCoverNotAvailable(wrapper).invoke('onConfirm')();
        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', false);
    });

    test('"Edit cover details" modal closes properly on cancel, without saving changes', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        const initialCoverTypeHdrText = wrapper.find('h3#your-quote-cover-level-label').text();

        // Pick cover type other than the currently selected one
        const coverType = _.get(submission, coverTypePath);
        openCoverTypeSelectionModal(wrapper);
        const newCoverType = getCoverDetailsModal(wrapper).find(HDDropdownList).prop('options').find(({ value }) => value !== coverType);
        pickCoverType(wrapper, newCoverType);

        getCoverDetailsModal(wrapper).invoke('onClose')();
        expect(getCoverDetailsModal(wrapper).props()).toHaveProperty('show', false);
        expect(wrapper.find('h3#your-quote-cover-level-label').text()).toEqual(initialCoverTypeHdrText);
    });

    test('changint to HE cover brand when tpft cover is selected, changes cover to comprehensive and displays a popup with explanation', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', false);

        pickCoverBrand(wrapper, HP);

        const tpftCoverType = { value: 'tpft', label: 'Third Party, Fire And Theft' };
        openCoverTypeSelectionModal(wrapper);
        pickCoverType(wrapper, tpftCoverType);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();

        pickCoverBrand(wrapper, HE);
        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', true);
        expect(wrapper.find(HDTable).prop('selectedHeaderValue')).toEqual(HE);
        const comprehensiveCoverType = { value: 'comprehensive', label: 'typekey.CoverageCategory_EXT.comprehensive' };
        expect(wrapper.find('h3#your-quote-cover-level-label').text()).toEqual(comprehensiveCoverType.label);
    });

    test('when cover brand is HE, selecting tpft cover is not possible and an explanation popup is disaplyed', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', false);

        pickCoverBrand(wrapper, HE);

        const tpftCoverType = { value: 'tpft', label: 'Third Party, Fire And Theft' };
        openCoverTypeSelectionModal(wrapper);
        pickCoverType(wrapper, tpftCoverType);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();

        expect(getCoverNotAvailable(wrapper).props()).toHaveProperty('show', true);
        expect(wrapper.find(HDTable).prop('selectedHeaderValue')).toEqual(HE);
        const comprehensiveCoverType = { value: 'comprehensive', label: 'typekey.CoverageCategory_EXT.comprehensive' };
        expect(wrapper.find('h3#your-quote-cover-level-label').text()).toEqual(comprehensiveCoverType.label);
    });

    test('choosing policy start date in the past results in validation error displayed', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);

        expect(wrapper.find(Form.Control).at(1).props().isInvalid).toBeFalsy();

        const currentDate = new Date();
        const yesterdayDate = new Date(currentDate - 24 * 60 * 60 * 1000);
        await act(async () => {
            wrapper.find(HDDatePickerRefactor).find('#hd-date-picker-date-input-day')
                .simulate('change', { currentTarget: { value: yesterdayDate.getDate() } });
            wrapper.find(HDDatePickerRefactor).find('#hd-date-picker-date-input-month')
                .simulate('change', { currentTarget: { value: yesterdayDate.getMonth() } });
            wrapper.find(HDDatePickerRefactor).find('#hd-date-picker-date-input-year')
                .simulate('change', { currentTarget: { value: yesterdayDate.getFullYear() } });
        });
        await wrapper.update();

        expect(wrapper.find(Form.Control.Feedback).at(1).find('.invalid-feedback').text()).toEqual(messages.datePastErrorMessage);
    });

    test('rerate modal shows on first excess change, but not on subsequent', async () => {
        const store = initializeRealStore();
        await initializeWrapper(store);
        // console.log('getRerateModal', getRerateModal(wrapper).debug());
        const modalId = 'rerate-modal';
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);

        const event1 = { value: '100', label: '£100' };
        await act(async () => {
            getExcessValDropdown(wrapper).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', true);

        getRerateModal(wrapper, modalId).invoke('onConfirm')();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);

        const event2 = { value: '200', label: '£200' };
        await act(async () => {
            getExcessValDropdown(wrapper).find('Select').invoke('onChange')(event2);
        });
        wrapper.update();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);
    });

    test('rerate modal shows on first cover type change, but not on subsequent', async () => {
        const store = initializeRealStore();
        await initializeWrapper(store);
        const modalId = 'rerate-modal';

        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);

        // Pick cover type other than the currently selected one
        const coverType = _.get(submission, coverTypePath);
        openCoverTypeSelectionModal(wrapper);
        const newCoverType1 = getCoverDetailsModal(wrapper).find(HDDropdownList).prop('options').find(({ value }) => value !== coverType);
        pickCoverType(wrapper, newCoverType1);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', true);

        getRerateModal(wrapper, modalId).invoke('onConfirm')();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);

        // Pick cover type other than the currently selected one
        openCoverTypeSelectionModal(wrapper);
        const newCoverType2 = getCoverDetailsModal(wrapper).find(HDDropdownList).prop('options').find(({ value }) => value !== newCoverType1);
        pickCoverType(wrapper, newCoverType2);
        getCoverDetailsModal(wrapper).invoke('onConfirm')();
        expect(getRerateModal(wrapper, modalId).props()).toHaveProperty('show', false);
    });

    test('welcome back toast is shown when relevant location state flag is true', async () => {
        const location = { state: { SaveAndReturn: true } };
        const store = initializeMockStore();
        await initializeWrapper(store, {}, location);

        expect(wrapper.find(HDToast).exists()).toBeTruthy();
        expect(wrapper.find(HDToast).find('.hd-toast-text-wrapper').text()).toEqual(messages.welcomeBack);
    });

    test('error returned from api request is rendered', async () => {
        const mockErrorObj = {
            status: 'fail',
            message: TEST_ERR_MSG,
            data: {
                appErrorCode: 'fail'
            }
        };
        jest.spyOn(HDQuoteService, 'createQuote').mockRejectedValue({ error: mockErrorObj });
        function extendRerateModalStatus(initialState) {
            _.assign(initialState.rerateModal, {
                status: true,
            });
        }
        const store = initializeRealStore(extendRerateModalStatus);
        await initializeWrapper(store);

        // Trigger api call by changing excess value
        const event = { value: '200', label: '£200' };
        await act(async () => {
            getExcessValDropdown(wrapper).find('Select').invoke('onChange')(event);
        });
        wrapper.update();
        expect(wrapper.find('.error').text()).toEqual(TEST_ERR_MSG);
    });

    test('should contain HD Policy Select', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDPolicySelect).exists()).toBeTruthy();
    });

    test('Default select online policy', async () => {
        const myInitialState = 'online';
        React.useState = jest.fn().mockReturnValue([myInitialState, {}]);
        const store = initializeMockStore();
        await initializeWrapper(store);
        expect(wrapper.find(HDPolicySelect).props()).toHaveProperty('selectedOption', myInitialState);
    });

    test('Should show YouDrive-Pop up when user select online policy and brand as YouDrive and click on continue button', async () => {
        const store = initializeMockStore();
        await initializeWrapper(store);
        const myInitialState = 'online';
        expect(wrapper.find(HDPolicySelect).props()).toHaveProperty('selectedOption', myInitialState);

        pickCoverBrand(wrapper, YD);
        expect(wrapper.find(HDTable).prop('selectedHeaderValue')).toEqual(YD);


        expect(youDriveMessagePopUp(wrapper).props()).toHaveProperty('show', false);
        await act(async () => { wrapper.find('HDButtonRefactor#continue-button').simulate('click'); });
        wrapper.find('HDButtonRefactor#continue-button').simulate('click');

        wrapper.update();
        expect(youDriveMessagePopUp(wrapper).props()).toHaveProperty('show', true);
        // youDriveMessagePopUp(wrapper).invoke('onConfirm')();
        // expect(youDriveMessagePopUp(wrapper).props()).toHaveProperty('show', false);
    });
});
