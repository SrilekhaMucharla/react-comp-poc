import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import {
    HDToggleButtonGroupRefactor, HDToast, HDQuoteInfoRefactor
} from 'hastings-components';
import configureStore from 'redux-mock-store';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import HDMotorLegalPage from '../HDMotorLegalPage';
import * as messages from '../HDMotorLegalPage.messages';
import customizeSubmission from '../mock/customizeSubmission.json';
import HDQuoteService from '../../../../api/HDQuoteService';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const branchCodePath = 'quote.branchCode.value';
const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';

const NO_RADIO_BUTTON_VAL = 'no';
const YES_RADIO_BUTTON_VAL = 'yes';
const setShowManualDowngrade = jest.fn();

function createInitialState() {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const customizeSubmissionVM = viewModelService.create(
        customizeSubmission.result,
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
                pcwLegalChosen: true,
                showContinueOnML: true
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

function setAllAncCoveragesSelectedMod(initialState, setAllAncCoveragesSelectedValue) {
    const ancCoverages = _.get(initialState, `wizardState.data.customizeSubmissionVM.${ancCoveragesPath}`);
    _.forEach(ancCoverages.value[0].coverages, (cov) => {
        _.set(cov, 'selected', setAllAncCoveragesSelectedValue);
    });
}

function setBranchCodeMod(initialState, branchCode) {
    _.set(initialState, `wizardState.data.customizeSubmissionVM.${branchCodePath}`, branchCode);
}

function extendAncillaryJourneyModelMod(initialState, ancillaryJourneyModel) {
    _.assign(initialState.ancillaryJourneyModel, ancillaryJourneyModel);
}

function setIpidsInfo(initialState) {
    const ipidsInfo = [{
        fileName: 'some-file-name',
        description: 'some-file-description',
        uuid: '{11111111-1111-1111-1111-111111111111}',
        ancillaryCode: messages.ANCMotorLegalExpensesCovExt
    }];
    _.set(initialState, 'ancillaryJourneyModel.ipidsInfo', ipidsInfo);
}

async function checkRadioButton(wrapper, value) {
    await act(async () => {
        wrapper.find(HDToggleButtonGroupRefactor)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
    expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value).props())
        .toHaveProperty('checked', true);
}

describe('<HDMotorLegalPage />', () => {
    let wrapper;

    jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementation((customizeSubmissionVM) => Promise.resolve({
        id: customizeSubmission.id,
        result: customizeSubmissionVM
    }));
    const ipidDocByUUIDMockResult = {
        result: {
            documentContentEncoded: 'file encoded to string',
            fileName: 'IPID - Ancillary - Motor Legal',
            mimeType: 'application/pdf'
        }
    };
    const ipidDocByUUIDSpy = jest.spyOn(HastingsDocretrieveService, 'ipidDocByUUID').mockResolvedValue(ipidDocByUUIDMockResult);

    createPortalRoot();

    async function initializeWrapper(store, props, location) {
        await act(async () => {
            wrapper = mount(
                <MemoryRouter initialEntries={[{ ...location }]}>
                    <Provider store={store}>
                        <HDMotorLegalPage
                            {...props}
                            setShowManualDowngrade={setShowManualDowngrade} />
                    </Provider>
                </MemoryRouter>
            );
        });
        wrapper.update();
        return wrapper;
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        // make sure wrapper is unmounted, so that global portalRoot div remains empty between tests
        // (because createPortal() from HDToast may be used during tests)
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', () => {
        const emptyStore = mockStore({});

        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMotorLegalPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('motor legal expenses cover: choose "No" radio button, starting from default state, then expect no opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();

        // check "No" radio button
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();
    });

    test('motor legal expenses cover: choose "Yes" radio button, starting from default state, then hide opened popup', async () => {
        const store = initializeRealStore();
        await initializeWrapper(store);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();

        // check "Yes" radio button
        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        // expect opened popup
        expect(wrapper.find(HDToast).exists()).toBeTruthy();
    });

    test('motor legal expenses cover: choose "No" radio button, starting from "Yes" state, then hide opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // check "No" radio button
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        // expect opened popup
        expect(wrapper.find(HDToast).exists()).toBeTruthy();
    });

    test('clicking confirmation button triggers continue action', async () => {
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { motorLegal: true });
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        const navigateMock = jest.fn();
        const props = { navigate: navigateMock };
        await initializeWrapper(store, props);

        // initially no ancillary coverages are selected, so button is not displayed
        expect(wrapper.find('.navigation').find('button').exists()).toBeFalsy();

        // check "No" radio button (need to pick either yes or no for continue button to appear)
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        wrapper.find('HDButtonRefactor').simulate('click');

        expect(navigateMock).toHaveBeenCalledWith(true);
    });

    test('branch code hp results in hastings premier related information being displayed', async () => {
        const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, messages.HP);
        const store = initializeMockStore(setBranchCodeStateMod);
        await initializeWrapper(store);

        expect(wrapper.find(HDQuoteInfoRefactor).find('span').at(2).text()).toEqual(messages.pageInfoTextHPSecond);
    });

    test('PCWJourney set to true in location state object results in PCW information being displayed', async () => {
        const location = { state: { PCWJourney: true } };
        const store = initializeMockStore();
        await initializeWrapper(store, {}, location);

        expect(wrapper.find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();
        expect(wrapper.find(HDQuoteInfoRefactor).find('span').at(1).text()).toEqual(messages.pageInfoTextPCWFirst);
    });

    test('state where quoteCoveragesError is not null results in navigation not invoked', async () => {
        jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementationOnce(() => Promise.reject(new Error('test error message')));
        const store = initializeRealStore();
        const navigateMock = jest.fn();
        const props = { navigate: navigateMock };
        await initializeWrapper(store, props);

        // check radio button to trigger error evaluation
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        expect(navigateMock).toHaveBeenCalledTimes(0);
    });

    test('ancillary coverages not selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to No', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { motorLegal: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to Yes', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { motorLegal: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
    });

    test('download action chain is executed on Insurer Product Information download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);

        wrapper.find('.motor-legal__pageLinkText').at(0).simulate('click');
        expect(ipidDocByUUIDSpy).toHaveBeenCalledTimes(1);
    });
});
