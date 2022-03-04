import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import configureStore from 'redux-mock-store';
import { applyMiddleware, createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { HDToggleButtonGroupRefactor, HDToast, HDLabelRefactor } from 'hastings-components';
import thunk from 'redux-thunk';
import _ from 'lodash';
import rootReducer from '../../../../redux-thunk/reducers/index';
import HDKeyCoverAncillaryPage from '../HDKeyCoverAncillaryPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import submission from '../mock/mockSubmission.json';
import customizeSubmission from '../mock/customizeSubmission.json';
import HDQuoteService from '../../../../api/HDQuoteService';
import * as messages from '../HDKeyCoverAncillaryPage.messages';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';

const NO_RADIO_BUTTON_VAL = 'false';
const YES_RADIO_BUTTON_VAL = 'true';

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

function extendAncillaryJourneyModelMod(initialState, ancillaryJourneyModel) {
    _.assign(initialState.ancillaryJourneyModel, ancillaryJourneyModel);
}

function setIpidsInfo(initialState) {
    const ipidsInfo = [{
        fileName: 'some-file-name',
        description: 'some-file-description',
        uuid: '{11111111-1111-1111-1111-111111111111}',
        ancillaryCode: messages.ANCKeyCoverCovExt
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
}

describe('<HDKeyCoverAncillaryPage />', () => {
    let wrapper;

    jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementation((customizeSubmissionVM) => Promise.resolve({
        id: customizeSubmission.id,
        result: customizeSubmissionVM
    }));
    const ipidDocByUUIDMockResult = {
        result: {
            documentContentEncoded: 'file encoded to string',
            fileName: 'IPID - Ancillary - Key Cover',
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
                        <HDKeyCoverAncillaryPage {...props} />
                    </Provider>
                </MemoryRouter>
            );
        });
        wrapper.update();
        return wrapper;
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
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
        const initialState = {};
        const emptyStore = mockStore(initialState);

        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDKeyCoverAncillaryPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('key cover: choose "No" radio button, starting from default state, then expect no opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();

        // check "No" radio button
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();
    });

    test('key cover: choose "Yes" radio button, starting from default state, then hide opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();

        // check "Yes" radio button
        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        // expect checked "Yes" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // expect opened popup
        expect(wrapper.find(HDToast).exists()).toBeTruthy();
    });

    test('key cover: choose "No" radio button, starting from "Yes" state, then hide opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // check "No" radio button
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // expect opened popup
        expect(wrapper.find(HDToast).exists()).toBeTruthy();
    });

    test('key cover: choosing radio button triggers navigation function', async () => {
        const store = initializeMockStore();
        const navigateMock = jest.fn();
        const props = {
            navigate: navigateMock
        };
        await initializeWrapper(store, props);

        // check "No" radio button
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // fast forward setTimeouts
        await act(async () => {
            jest.runAllTimers();
        });

        // check "Yes" radio button
        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        // expect checked "Yes" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // fast forward setTimeouts
        await act(async () => {
            jest.runAllTimers();
        });

        // expect the navigation function not to be called
        expect(navigateMock).toBeCalledTimes(0);
    });

    test('clicking confirmation button triggers continue action', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeMockStore(setAllAncCoveragesSelectedStateMod);
        const navigateMock = jest.fn();
        const props = { navigate: navigateMock };
        await initializeWrapper(store, props);

        // initially no ancillary coverages are selected, but button should be displayed 306199
        expect(wrapper.find('#key-cover-continue-btn button').exists()).toBeTruthy();

        // check "No" radio button (need to pick either yes or no for continue button to appear)
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        wrapper.find('#key-cover-continue-btn button').simulate('click');

        expect(navigateMock).toBeCalledTimes(0);
    });

    test('quoteCoveragesError returned from request results in navigation not invoked', async () => {
        jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementationOnce(() => Promise.reject(new Error('test error message')));
        const store = initializeRealStore();
        const navigateMock = jest.fn();
        const props = { navigate: navigateMock };
        await initializeWrapper(store, props);

        // expect checked "Yes" radio button to trigger request
        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        expect(navigateMock).toHaveBeenCalledTimes(0);
    });

    test('ancillary coverages not selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to No', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { keyCover: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to Yes', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { keyCover: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
    });

    test('download action chain is executed on Insurer Product Information download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);

        wrapper.findWhere((n) => n.type() === HDLabelRefactor && n.prop('text') === messages.documentLink).simulate('click');
        expect(ipidDocByUUIDSpy).toHaveBeenCalledTimes(1);
    });
});
