import React from 'react';
import { mount } from 'enzyme';
import { HDTable, HDImageRadioButton } from 'hastings-components';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDManualUpgradeDowngradeConnected from '../HDManualUpgradeDowngrade';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submissionV1 from '../mock/mockSubmission_v1.json';
import submissionV2 from '../mock/mockSubmission_v2.json';
import submissionV3 from '../mock/mockSubmission_v3.json';
import {
    HASTINGS_ESSENTIAL,
    HASTINGS_DIRECT,
    HASTINGS_PREMIER
} from '../../../../constant/const';

const middlewares = [];
const mockStore = configureStore(middlewares);

const offeredQuotesPath = 'quoteData.offeredQuotes.value';
const offeringsPath = 'lobData.privateCar.offerings.value';
const offeredQuotes = 'quoteData.offeredQuotes';

function createInitialState(submission) {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );
    // this is an workaround, submissionVM is too big to create SNAP
    _.set(submission, offeredQuotesPath, _.get(submissionVM, offeredQuotesPath));
    _.set(submission, offeringsPath, _.get(submissionVM, offeringsPath));

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submission,
                customizeSubmissionVM: {
                    quote: {
                        branchCode: { value: HASTINGS_DIRECT }
                    }
                }
            },
            app: {
                step: 1,
                prevStep: 0
            },
        },
        updateQuoteCoveragesModel: {
            quoteCoveragesObj: {
                quote: {},
                quoteID: '1',
                sessionUUID: '1',
                periodStartDate: '1',
                periodEndDate: '1',
                coverType: '1',
                voluntaryExcess: '1',
                ncdgrantedYears: '1',
                ncdgrantedProtectionInd: '1',
                producerCode: '1',
                insurancePaymentType: '1',
                otherOfferedQuotes: {},
                coverages: {},
            },
            quoteCoveragesError: null
        },
        ancillaryJourneyModel: {
            breakdown: false,
            keyCover: false,
            motorLegal: false,
            personalAccident: false,
            substituteVehicle: false,
            ipidsInfo: [],
            ipidDocError: null,
            ipidMotorLegalDoc: {},
            ipidBreakdownEuropeanDoc: {},
            ipidBreakdownHomeStartDoc: {},
            ipidBreakdownRoadsideRecoveryDoc: {},
            ipidBreakdownRoadsideDoc: {},
            ipidSubstituteVehicleDoc: {},
            ipidPersonalAccidentalDoc: {},
            ipidKeyCoverDoc: {}
        }
    };

    return initialState;
}

function initializeMockStore(submission, ...initialStateModifiers) {
    const initialState = createInitialState(submission);

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}

async function initializeWrapper(store, props) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <HDManualUpgradeDowngradeConnected {...props} />
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

function pickCoverBrand(wrapper, coverBrand) {
    const event = { target: { value: coverBrand } };
    wrapper.find(HDTable)
        .findWhere((n) => n.type() === HDImageRadioButton && n.prop('currentValue') === coverBrand)
        .find('input')
        .simulate('change', event);
}

function setCurrentBrandMod(initialState, brandCode) {
    _.set(initialState, 'wizardState.data.customizeSubmissionVM.quote.branchCode.value', brandCode);
}

function setCurrentBrandModTest(initialState, brandCode) {
    _.set(initialState, 'wizardState.data.customizeSubmissionVM.value.quote.branchCode.value', brandCode);
    _.set(initialState, 'wizardState.data.customizeSubmissionVM.otherOfferedQuotes', _.get(submissionV3, offeredQuotes));
}

describe('<HDManualUpgradeDowngrade />', () => {
    test('downgrade from HD', async () => {
        const goBackHandler = jest.fn();
        const downgradeHandler = jest.fn();
        const props = {
            isUpgrade: false,
            isMonthlyPaymentAvailable: true,
            onGoBack: goBackHandler,
            onDowngrade: downgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandMod, HASTINGS_DIRECT);
        const store = initializeMockStore(submissionV1, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_ESSENTIAL);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_ESSENTIAL);
        expect(downgradeHandler).toHaveBeenCalledTimes(1);
    });

    test('downgrade from HP', async () => {
        const goBackHandler = jest.fn();
        const downgradeHandler = jest.fn();
        const props = {
            isUpgrade: false,
            isMonthlyPaymentAvailable: true,
            onGoBack: goBackHandler,
            onDowngrade: downgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandMod, HASTINGS_PREMIER);
        const store = initializeMockStore(submissionV1, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_DIRECT);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_DIRECT);
        expect(downgradeHandler).toHaveBeenCalledTimes(1);

        pickCoverBrand(wrapper, HASTINGS_ESSENTIAL);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_ESSENTIAL);
        expect(downgradeHandler).toHaveBeenCalledTimes(2);
    });

    test('upgrade from HE with monthly payments', async () => {
        const goBackHandler = jest.fn();
        const upgradeHandler = jest.fn();
        const props = {
            isUpgrade: true,
            isMonthlyPaymentAvailable: true,
            onGoBack: goBackHandler,
            onUpgrade: upgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandMod, HASTINGS_ESSENTIAL);
        const store = initializeMockStore(submissionV1, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_DIRECT);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_DIRECT);

        pickCoverBrand(wrapper, HASTINGS_PREMIER);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_PREMIER);
    });

    test('upgrade from HD without monthly payments', async () => {
        const goBackHandler = jest.fn();
        const upgradeHandler = jest.fn();
        const props = {
            isUpgrade: true,
            isMonthlyPaymentAvailable: false,
            onGoBack: goBackHandler,
            onUpgrade: upgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandMod, HASTINGS_DIRECT);
        const store = initializeMockStore(submissionV1, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_PREMIER);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_PREMIER);
    });

    test('upgrade from HD with savings amount', async () => {
        const goBackHandler = jest.fn();
        const upgradeHandler = jest.fn();
        const props = {
            isUpgrade: true,
            isMonthlyPaymentAvailable: false,
            onGoBack: goBackHandler,
            onUpgrade: upgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandMod, HASTINGS_DIRECT);
        const store = initializeMockStore(submissionV2, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_PREMIER);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_PREMIER);
    });

    test('upgrade from HD with savings amount and preselected ancillaries', async () => {
        const goBackHandler = jest.fn();
        const upgradeHandler = jest.fn();
        const props = {
            isUpgrade: true,
            isMonthlyPaymentAvailable: false,
            onGoBack: goBackHandler,
            onUpgrade: upgradeHandler
        };
        const setCurrentBrandStateMod = _.partialRight(setCurrentBrandModTest, HASTINGS_DIRECT);
        const store = initializeMockStore(submissionV3, setCurrentBrandStateMod);
        const wrapper = await initializeWrapper(store, props);

        expect(wrapper).toMatchSnapshot();

        pickCoverBrand(wrapper, HASTINGS_PREMIER);
        expect(wrapper.find(HDTable).props()).toHaveProperty('selectedHeaderValue', HASTINGS_PREMIER);
    });
});
