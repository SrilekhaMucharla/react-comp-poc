import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsIpidService } from 'hastings-capability-ipid';
import { AnalyticsHDToggleButtonGroup as HDToggleButtonGroup, } from '../../../../web-analytics';
import { TranslatorContext } from '../../../../integration/TranslatorContext';
import * as messages from '../HDImportantStuffPage.messages';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../HDYourQuotesPage/mock/mockSubmission.json';
import mockCovers from '../mock/mockCovers.json';
import HDImportantStuffPage from '../HDImportantStuffPage';
import HDQuotePolicyDetails from '../HDQuotePolicyDetails';
import HDDriverDetails from '../HDDriverDetails';
import HDPolicyHolderDetails from '../HDPolicyHolderDetails';
import HDOtherThings from '../HDOtherThings';
import HDInsurersOverlay from '../HDInsurersOverlay';
import HDOurFees from '../HDOurFees';
import HDOurFeesOverlay from '../HDOurFeesOverlay';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';
const ncdCoveragesPath = 'ncdgrantedProtectionInd';
const driverPath = 'lobData.privateCar.coverables.drivers';
const monthlyPath = 'quote.hastingsPremium.monthlyPayment';

const PAYMENT_TYPE_ANNUALLY_CODE = '1';
const PAYMENT_TYPE_MONTHLY_CODE = '3';

function addTermToCoverage(cov, termOptionName) {
    const termsOptions = [{
        name: 'Roadside',
        code: 'zokh28gtick0i2bklnj5bk9n97a',
        optionValue: 1,
        maxValue: 5
    }, {
        name: 'Roadside and Recovery',
        code: 'zahjctmpdgb7pdjphvv03hfdlra',
        optionValue: 3,
        maxValue: 5
    }, {
        name: 'Homestart',
        code: 'z8jje5jcuaogs4qpum9mnjucrvb',
        optionValue: 4,
        maxValue: 5
    }, {
        name: 'European',
        code: 'ze1g6t5ci5lkl13eaovil4lm3pa',
        optionValue: 5,
        maxValue: 5
    }];
    const choosenTermOption = termsOptions.find((elem) => elem.name === termOptionName);
    _.set(cov, 'terms', [
        {
            publicID: 'ANCBreakdownTypeCovTerm_Ext',
            type: 'OptionANCBreakdownTypeCovTerm_ExtType',
            name: 'Breakdown',
            coveragePublicID: 'ANCBreakdownCov_Ext',
            patternCode: 'ANCBreakdownTypeCovTerm_Ext',
            options: termsOptions,
            chosenTerm: choosenTermOption ? choosenTermOption.code : '',
            chosenTermValue: choosenTermOption ? choosenTermOption.name : '',
            isAscendingBetter: true,
            updated: false,
            required: true
        }
    ]);
}

function setTermOnBreakdownCoveragesMod(initialState, termOptionName) {
    const ancCoverages = _.get(initialState, `wizardState.data.customizeSubmissionVM.${ancCoveragesPath}`);
    _.forEach(ancCoverages.value[0].coverages, (cov) => {
        if (cov.name === messages.breakdown) {
            addTermToCoverage(cov, termOptionName);
        }
    });
}

function setAllAncCoveragesSelectedMod(initialState, setAllAncCoveragesSelectedValue) {
    const ancCoverages = _.get(initialState, `wizardState.data.customizeSubmissionVM.${ancCoveragesPath}`);
    _.forEach(ancCoverages.value[0].coverages, (cov) => {
        _.set(cov, 'selected', setAllAncCoveragesSelectedValue);
    });
}

function setNCDSelectedMod(initialState, setAllAncCoveragesSelectedValue) {
    const ncdInd = _.get(initialState, `wizardState.data.customizeSubmissionVM.${ncdCoveragesPath}`);
    _.set(ncdInd, 'selected', setAllAncCoveragesSelectedValue);
}

function setDriverConvictionsMod(initialState, convictionsAmount) {
    const drivers = _.get(initialState, `wizardState.data.submissionVM.${driverPath}`);
    _.forEach(drivers.value, (driver) => {
        const convictionsCollectionsPath = 'claimsAndConvictions.convictionsCollection';
        const newConvictions = Array(convictionsAmount).fill({});
        _.set(driver, convictionsCollectionsPath, newConvictions);
    });
}

function addNonPolicyHolderDriversMod(initialState, driversAmount) {
    const drivers = _.get(initialState, `wizardState.data.submissionVM.${driverPath}`);
    const newDriver = _.cloneDeep(drivers.value[0]);
    newDriver.displayName = 'Joe Non Policyholder';
    newDriver.isPolicyHolder = false;
    const newDrivers = Array(driversAmount).fill(newDriver);
    drivers.value.push(...newDrivers);
}

function setQuoteMonthlyPaymentMod(initialState, monthlyPayment) {
    _.set(initialState, `wizardState.data.customizeSubmissionVM.${monthlyPath}`, monthlyPayment);
}

const setupStore = (...initialStateModifiers) => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const customizeSubmissionVM = viewModelService.create(
        mockCovers.result,
        'pc',
        'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                customizeSubmissionVM: customizeSubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0,
                pages: {
                    drivers: {
                        0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        1: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        2: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        3: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        4: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false }
                    }
                }
            },
        },
        ipidMatchForAllModel: {
            ipidMatchForAllObj: {},
            ipidMatchForAllErrorObj: null,
            ipdaMFAFlag: false,
            loading: false
        },
    };

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return [mockStore(initialState), viewModelService];
};

// wrapper to allow passing of required state and it's setter as props to HDImportantStuffPage
const TestWrapper = (props) => {
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPE_MONTHLY_CODE);

    return (
        <HDImportantStuffPage paymentType={paymentType} onPaymentTypeChange={setPaymentType} {...props} />
    );
};

async function initializeWrapper(store, viewModelService, props) {
    let wrapper;

    await act(async () => {
        wrapper = mount(
            <MemoryRouter>
                <TranslatorContext.Provider value={defaultTranslator}>
                    <ViewModelServiceContext.Provider value={viewModelService}>
                        <Provider store={store}>
                            <TestWrapper props={props} />
                        </Provider>
                    </ViewModelServiceContext.Provider>
                </TranslatorContext.Provider>
            </MemoryRouter>
        );
    });
    wrapper.update();
    return wrapper;
}

async function checkRadioButton(wrapper, value) {
    await act(async () => {
        wrapper.findWhere((n) => n.type() === HDToggleButtonGroup)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
}

async function testTermSetOnBreakdownExtra(termOptionName, termOptionHeader) {
    const setTermOnBreakdownCoveragesStateMod = _.partialRight(setTermOnBreakdownCoveragesMod, termOptionName);
    const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
    const [store, viewModelService] = setupStore(setTermOnBreakdownCoveragesStateMod, setAllAncCoveragesSelectedStateMod);
    const wrapper = await initializeWrapper(store, viewModelService);

    expect(wrapper.find(HDQuotePolicyDetails).at(0).prop('optionalExtras')
        .filter((extra) => extra.name.includes(termOptionHeader)).length).toBeGreaterThan(0);
}

describe('<HDImportantStuffPage />', () => {
    createPortalRoot();

    test('render component', () => {
        const store = mockStore({});
        const wrapper = shallow(
            <Provider store={store}>
                <HDImportantStuffPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
    jest.spyOn(HastingsIpidService, 'ipidByProducerCode').mockResolvedValue({ result: { ipids: {} } });

    test('monthly payments description is shown, when paymentType is monthly and submission contains selected ancillaryCoverages', async () => {
        const [store, viewModelService] = setupStore();
        const wrapper = await initializeWrapper(store, viewModelService);

        // expect mocked values to match test starting state requirements
        const wrapperStoreState = wrapper.find(Provider).props().store.getState();
        const ancCoverages = _.get(wrapperStoreState, `wizardState.data.customizeSubmissionVM.${ancCoveragesPath}`);
        expect(ancCoverages.value[0].coverages.filter((anc) => anc.selected).length).toBeGreaterThan(0);
        expect(wrapper.find(HDToggleButtonGroup).prop('value')).toEqual(PAYMENT_TYPE_MONTHLY_CODE);

        expect(wrapper.find('.important-stuff__payments-description--monthly').exists()).toBeTruthy();
    });

    test('annual payment section is shown, when selecting annual payment type', async () => {
        const [store, viewModelService] = setupStore();
        const wrapper = await initializeWrapper(store, viewModelService);

        await checkRadioButton(wrapper, PAYMENT_TYPE_ANNUALLY_CODE);

        // expect checked annual payment radio button
        expect(wrapper.find(HDToggleButtonGroup)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === PAYMENT_TYPE_ANNUALLY_CODE).props())
            .toHaveProperty('checked', true);

        expect(wrapper.findWhere((n) => n.hasClass('important-stuff__payments-description--annual')).exists()).toBeTruthy();
        expect(wrapper.find('.important-stuff__payments-description--monthly').exists()).toBeFalsy();
    });

    test('all selected optional extras are passed to quote policy details view', async () => {
        const setNCDSelectedStateMod = _.partialRight(setNCDSelectedMod, true);
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const [store, viewModelService] = setupStore(setAllAncCoveragesSelectedStateMod, setNCDSelectedStateMod);
        const wrapper = await initializeWrapper(store, viewModelService);
        const ancCoverages = _.get(mockCovers.result, ancCoveragesPath);
        expect(wrapper.find(HDQuotePolicyDetails).at(0).prop('optionalExtras')).toHaveLength(ancCoverages[0].coverages.length + 1);
    });

    test('roadside term set on breakdown extra is included in extras description', async () => {
        await testTermSetOnBreakdownExtra(messages.roadside, messages.roadsideHeader);
    });

    test('roadsideAndRecovery term set on breakdown extra is included in extras description', async () => {
        await testTermSetOnBreakdownExtra(messages.roadsideAndRecovery, messages.roadsideAndRecoveryHeader);
    });

    test('homestart term set on breakdown extra is included in extras description', async () => {
        await testTermSetOnBreakdownExtra(messages.homestart, messages.homestartHeader);
    });

    test('european term set on breakdown extra is included in extras description', async () => {
        await testTermSetOnBreakdownExtra(messages.european, messages.europeanHeader);
    });

    test('empty term set on breakdown extra is included in extras description as default case', async () => {
        await testTermSetOnBreakdownExtra('', '');
    });

    test('driver convictions are passed to HDDriverDetails when present', async () => {
        const DRIVER_CONVICTIONS_AMOUNT = 4;
        const setDriverConvictionsStateMod = _.partialRight(setDriverConvictionsMod, DRIVER_CONVICTIONS_AMOUNT);
        const [store, viewModelService] = setupStore(setDriverConvictionsStateMod);
        const wrapper = await initializeWrapper(store, viewModelService);

        wrapper.find(HDDriverDetails).forEach((node) => {
            expect(node.prop('driver').convictions === 'None').toBeFalsy();
            expect(node.prop('driver').convictions.split(' ')[0]).toEqual(DRIVER_CONVICTIONS_AMOUNT.toString());
        });
    });

    test('drivers who are not policyholders are passed to HDPolicyHolderDetails as part of policyHolder', async () => {
        const NON_POLICYHOLDER_DRIVERS_AMOUNT = 4;
        const addNonPolicyHolderDriversStateMod = _.partialRight(addNonPolicyHolderDriversMod, NON_POLICYHOLDER_DRIVERS_AMOUNT);
        const [store, viewModelService] = setupStore(addNonPolicyHolderDriversStateMod);
        const wrapper = await initializeWrapper(store, viewModelService);

        expect(wrapper.find(HDPolicyHolderDetails).at(0).prop('policyHolder').namedDrivers).toHaveLength(NON_POLICYHOLDER_DRIVERS_AMOUNT);
    });

    test('InsurersOverlay opens properly', async () => {
        const [store, viewModelService] = setupStore();
        const wrapper = await initializeWrapper(store, viewModelService);

        expect(wrapper.find(HDInsurersOverlay).exists()).toBeFalsy();
        wrapper.find(HDOtherThings).find('.hd-overlay-btn').at(0).invoke('onClick')();
        expect(wrapper.find(HDInsurersOverlay).exists()).toBeTruthy();
    });

    test('OurFeesOverlay opens properly', async () => {
        const [store, viewModelService] = setupStore();
        const wrapper = await initializeWrapper(store, viewModelService);

        expect(wrapper.find(HDOurFeesOverlay).exists()).toBeFalsy();
        wrapper.find(HDOurFees).find('.hd-overlay-btn').at(0).invoke('onClick')();
        expect(wrapper.find(HDOurFeesOverlay).exists()).toBeTruthy();
    });

    test('no quote monthly payment, results in only annual payment being available', async () => {
        const setQuoteMonthlyPaymentStateMod = _.partialRight(setQuoteMonthlyPaymentMod, null);
        const [store, viewModelService] = setupStore(setQuoteMonthlyPaymentStateMod);
        const wrapper = await initializeWrapper(store, viewModelService);

        expect(wrapper.find(HDToggleButtonGroup).prop('availableValues')).toHaveLength(1);
        expect(wrapper.find(HDToggleButtonGroup).prop('availableValues')[0].value).toEqual(PAYMENT_TYPE_ANNUALLY_CODE);
    });
});
