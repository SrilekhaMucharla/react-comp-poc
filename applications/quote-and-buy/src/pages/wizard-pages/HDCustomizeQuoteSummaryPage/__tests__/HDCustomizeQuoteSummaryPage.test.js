import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import {
    HDDatePickerRefactor,
    HDDropdownList,
    HDModal,
    HDToggleButtonGroupRefactor,
    HDToast
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsIpidService } from 'hastings-capability-ipid';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../mock/mockSubmission.json';
import submissionVMAnnualy from './mock/mockSubmissionVMAnnualy.json';
import HDCustomizeQuoteSummaryPageConnected from '../HDCustomizeQuoteSummaryPage';
import HDQuoteService from '../../../../api/HDQuoteService';
import withTranslator from '../../__helpers__/test/withTranslator';
import * as messages from '../HDCustomizeQuoteSummaryPage.messages';
import {
    PAYMENT_TYPE_ANNUALLY_CODE, PAYMENT_TYPE_MONTHLY_CODE
} from '../../../../constant/const';

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

jest.mock('../../HDManualUpgradeDowngrade/HDManualUpgradeDowngrade', () => (props) => <mockHDManualUpgradeDowngrade {...props} />);

const handleToggleContinueElement = jest.fn();
const onPaymentChange = jest.fn();
const handleDisableContinueElement = jest.fn();
const setShowManualUpgrade = jest.fn();
const setShowManualDowngrade = jest.fn();

const vehicleDetails = {
    data: {
        abiCode: '32120102',
        alarmImmobilizer: '93',
        body: 'SALOON',
        bodyCode: '02',
        colour: 'SILVER',
        drivingSide: 'R',
        engineSize: '2143',
        fuelType: 'Diesel',
        importType: 'no',
        make: 'MERCEDES-BENZ',
        model: 'E250 SPORT ED125 CDI BLUE',
        numberOfDoors: 4,
        numberOfSeats: '5',
        registrationsNumber: 'BD51 SMR',
        transmission: '001',
        type: 'PrivateCar_Ext',
        weight: 2280,
        year: 2012,
        yearManufactured: 2012
    }
};

const customQuoteData = {
    customUpdatedQuoteObj: {
        quote: '',
        quoteID: '',
        sessionUUID: '',
        periodStartDate: '',
        periodEndDate: '',
        coverType: 'comprehensive',
        voluntaryExcess: '',
        ncdgrantedYears: '',
        ncdgrantedProtectionInd: '',
        producerCode: '',
        insurancePaymentType: PAYMENT_TYPE_MONTHLY_CODE,
        otherOfferedQuotes: '',
        coverages: '',
    },
    loading: false
};

const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

function createInitialStateAnnualy() {
    const submissionVM = viewModelService.create(
        submissionVMAnnualy,
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
                prevStep: 0,
                isEditQuoteJourney: false,
                isEditQuoteJourneyFromSummmary: false
            },
        },
        offeredQuoteModel: _.cloneDeep(submissionVMAnnualy.quoteData),
        vehicleDetails: vehicleDetails,
        customQuoteModel: customQuoteData,
        ipidMatchForAllModel: {
            ipidMatchForAllObj: {},
            ipidMatchForAllErrorObj: null,
            ipdaMFAFlag: false,
            loading: false
        },
        rerateModal: { status: false },
        ancillaryCoveragesObject: {}
    };

    return initialState;
}

// actual store since component relies on dispatch to e.g., initialize createSumbissionVM to store
function initializeRealStoreAnnualy(...initialStateModifiers) {
    const initialState = createInitialStateAnnualy();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
    return store;
}

function createInitialState() {
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
                prevStep: 0,
                isEditQuoteJourney: false,
                isEditQuoteJourneyFromSummmary: false
            },
        },
        offeredQuoteModel: _.cloneDeep(submission.quoteData),
        vehicleDetails: vehicleDetails,
        customQuoteModel: customQuoteData,
        ipidMatchForAllModel: {
            ipidMatchForAllObj: {},
            ipidMatchForAllErrorObj: null,
            ipdaMFAFlag: false,
            loading: false
        },
        rerateModal: { status: false },
        ancillaryCoveragesObject: {}
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

function unsetOfferedQuotesMonthlyPaymentMod(initialState) {
    _.chain(initialState)
        .get('offeredQuoteModel.offeredQuotes')
        .forEach((offeredQuote) => _.unset(offeredQuote, 'hastingsPremium.monthlyPayment'))
        .value();
}

function setRerateModalStatusMod(initialState, status) {
    _.set(initialState, 'rerateModal.status', status);
}

function unsetVehicleRegistrationNumMod(initialState) {
    _.unset(initialState, 'vehicleDetails.data.registrationsNumber');
}

function unsetHECoverBrandMod(initialState) {
    const offeredQuotes = _.get(initialState, 'offeredQuoteModel.offeredQuotes');
    _.set(initialState, 'offeredQuoteModel.offeredQuotes', offeredQuotes.filter((offeredQuote) => offeredQuote.branchCode !== messages.HE));
}

async function initializeWrapper(store, props, location = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Router initialEntries={[location]}>
                    <Provider store={store}>
                        <HDCustomizeQuoteSummaryPageConnected
                            toggleContinueElement={handleToggleContinueElement}
                            disableContinueElement={handleDisableContinueElement}
                            paymentType={customQuoteData.customUpdatedQuoteObj.insurancePaymentType}
                            onPaymentTypeChange={onPaymentChange}
                            setShowManualUpgrade={setShowManualUpgrade}
                            setShowManualDowngrade={setShowManualDowngrade}
                            {...props} />
                    </Provider>
                </Router>
            </ViewModelServiceContext.Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDCustomizeQuoteSummaryPage />', () => {
    const customUpdateQuoteSpy = jest.spyOn(HDQuoteService, 'customUpdateQuote').mockImplementation((data) => Promise.resolve({
        result: data
    }));

    jest.spyOn(HastingsIpidService, 'ipidByProducerCode').mockResolvedValue({ result: { ipids: {} } });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('component renders', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper).toHaveLength(1);
    });

    test('Click on payment explanation link and expect a confirmable popup', async () => {
        const store = initializeRealStoreAnnualy(unsetOfferedQuotesMonthlyPaymentMod);
        const wrapper = await initializeWrapper(store);

        const button = wrapper.find('.customize-quote-summary__payment-explanation-link');
        await act(async () => button.props().onClick());
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.missingMonthlyPaymentsModalHeader);
        expect(hdModal().props()).toHaveProperty('show', true);

        await act(async () => hdModal().props().onConfirm());
        wrapper.update();
        expect(hdModal().props()).toHaveProperty('show', false);
    });

    test('Change payment type to monthly', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        const button = wrapper.find(HDToggleButtonGroupRefactor).at(0);
        await act(async () => button.props().onChange({ target: { value: PAYMENT_TYPE_MONTHLY_CODE } }));
        wrapper.update();
        expect(onPaymentChange).toHaveBeenCalledTimes(1);
        expect(customUpdateQuoteSpy).toHaveBeenCalledTimes(0);
    });

    test('quote api is not called when changing payment type, when monthly payment is not available', async () => {
        const store = initializeRealStore(unsetOfferedQuotesMonthlyPaymentMod);
        const wrapper = await initializeWrapper(store);
        const button = wrapper.find(HDToggleButtonGroupRefactor).at(0);
        await act(async () => button.props().onChange({ target: { value: PAYMENT_TYPE_ANNUALLY_CODE } }));
        wrapper.update();
        expect(onPaymentChange).toHaveBeenCalledTimes(1);
        expect(customUpdateQuoteSpy).toHaveBeenCalledTimes(0);
    });

    test.skip('choosing Voluntary amount from Dropdown list displays popup and continue can be clicked', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        const dropdown = () => wrapper.find(HDDropdownList).at(0);

        const voluntaryAmount = { value: '200', label: '£200' };
        await act(async () => dropdown().find('Select').invoke('onChange')(voluntaryAmount));
        wrapper.update();
        expect(wrapper.find(HDModal).at(0).props()).toHaveProperty('show', true);

        await act(async () => wrapper.find(HDModal).at(0).props().onConfirm());
        wrapper.update();
        expect(dropdown().prop('value')).toEqual(voluntaryAmount);
    });

    test('choosing Voluntary amount from Dropdown list does not display popup when rerateModal status is true', async () => {
        const setRerateModalStatusStateMod = _.partialRight(setRerateModalStatusMod, true);
        const store = initializeRealStore(setRerateModalStatusStateMod);
        const wrapper = await initializeWrapper(store);

        const dropdown = () => wrapper.find(HDDropdownList).at(0);

        const voluntaryAmount = { value: '250', label: '£250' };
        await act(async () => dropdown().find('Select').invoke('onChange')(voluntaryAmount));
        wrapper.update();
        expect(wrapper.find(HDModal).at(0).props()).toHaveProperty('show', false);

        expect(dropdown().prop('value')).toEqual(voluntaryAmount);
    });

    test('HDCoverDetailsPage handleDowngrade and expect HDManualUpgradeDowngrade, then go back', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);

        const coverPage = wrapper.find('HDCoverDetailsPage');
        await act(async () => coverPage.props().handleDowngrade());
        wrapper.update();

        expect(setShowManualDowngrade).toHaveBeenCalledTimes(1);
    });

    test('HDCoverDetailsPage handleUpgrade and expect HDManualUpgradeDowngrade, then go back', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        const coverPage = wrapper.find('HDCoverDetailsPage');

        await act(async () => coverPage.props().handleUpgrade());
        wrapper.update();

        expect(wrapper.find('mockHDManualUpgradeDowngrade')).toHaveLength(0);
    });

    test.skip('HDCoverDetailsPage childEventHandler', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        const coverPage = wrapper.find('HDCoverDetailsPage');

        await act(async () => coverPage.props().handleParentEvent({}, { target: { value: { value: 'tpft' } } }));
        wrapper.update();

        expect(wrapper.find('HDManualUpgradeDowngrade')).toHaveLength(0);
    });

    test('Pick start date', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);
        const datePicker = () => wrapper.find(HDDatePickerRefactor);
        const currentDate = new Date();
        const tomorrowDate = new Date(currentDate + 24 * 60 * 60 * 1000);
        await act(async () => {
            datePicker().find('#hd-date-picker-date-input-day').simulate('change', { target: { value: tomorrowDate.getDate() } });
            datePicker().find('#hd-date-picker-date-input-month').simulate('change', { target: { value: tomorrowDate.getMonth() } });
            datePicker().find('#hd-date-picker-date-input-year').simulate('change', { target: { value: tomorrowDate.getFullYear() } });
        });
        wrapper.update();
    });

    test('registration number related section is shown when no registration number was provided', async () => {
        const store = initializeRealStore(unsetVehicleRegistrationNumMod);
        const wrapper = await initializeWrapper(store);

        const link = wrapper.find('.customize-quote-summary__no-registration-number-link').at(0);
        await act(async () => link.props().onClick());
        wrapper.update();
    });

    test('registration number related popup is shown and can be confirmed when no registration number was provided', async () => {
        const store = initializeRealStore(unsetVehicleRegistrationNumMod);
        const wrapper = await initializeWrapper(store);

        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.missingRegNumberModalHeader).at(1);
        expect(hdModal().props()).toHaveProperty('show', true);

        await act(async () => hdModal().invoke('onConfirm')());
        wrapper.update();
        expect(hdModal().props()).toHaveProperty('show', false);
    });

    test('registration number related popup is shown and can be canceled when no registration number was provided', async () => {
        const store = initializeRealStore(unsetVehicleRegistrationNumMod);
        const wrapper = await initializeWrapper(store);

        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === messages.missingRegNumberModalHeader).at(1);
        expect(hdModal().props()).toHaveProperty('show', true);

        await act(async () => hdModal().invoke('onCancel')());
        wrapper.update();
        expect(hdModal().props()).toHaveProperty('show', false);
    });

    test('when no registration number was provided, on vehicle find, vehicle details can be displayed and subsequently closed', async () => {
        const store = initializeRealStore(unsetVehicleRegistrationNumMod);
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('.customize-quote-car-finder')).toHaveLength(2);

        expect(wrapper.find('HDVehicleDetailsPage')).toHaveLength(0);
        await act(async () => wrapper.find('.customize-quote-car-finder').at(0).closest('ForwardRef').invoke('onFind')(true));
        wrapper.update();
        expect(wrapper.find('HDVehicleDetailsPage')).toHaveLength(1);

        await act(async () => wrapper.find('HDVehicleDetailsPage').invoke('onFind')());
        wrapper.update();
        expect(wrapper.find('HDVehicleDetailsPage')).toHaveLength(0);
    });

    test('welcome back toast is shown when relevant location state flag is true', async () => {
        const location = { state: { SaveAndReturn: true } };
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store, {}, location);

        expect(wrapper.find(HDToast).exists()).toBeTruthy();
        expect(wrapper.find(HDToast).at(0).find('.hd-toast-text-wrapper').text()).toEqual(messages.welcomeBack);
    });

    test('annual cost difference is calculated properly, when cover brand is HD (assuming selected is at offeredQuotes[0])', async () => {
        const store = initializeRealStore(unsetHECoverBrandMod);
        const wrapper = await initializeWrapper(store);

        const { annualCostDifference, annualCost } = wrapper.find('HDCoverDetailsPage').props();
        expect({ annualCostDifference, annualCost }).toMatchSnapshot();
    });

    test('annual cost difference is calculated properly, when cover brand is HE (assuming selected is at offeredQuotes[0])', async () => {
        const store = initializeRealStore();
        const wrapper = await initializeWrapper(store);

        const { annualCostDifference, annualCost } = wrapper.find('HDCoverDetailsPage').props();
        expect({ annualCostDifference, annualCost }).toMatchSnapshot();
    });
});
