import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import {
    HDToggleButtonGroupRefactor, HDToast, HDQuoteTable, HDLabelRefactor
} from 'hastings-components';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submissionInitial from '../../../../routes/SubmissionVMInitial';
import customizeSubmission from '../mock/customizeSubmission.json';
import HDPersonalAccidentsPage from '../HDPersonalAccidentsPage';
import HDQuoteService from '../../../../api/HDQuoteService';
import * as messages from '../HDPersonalAccidentsPage.messages';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const branchCodePath = 'quote.branchCode.value';
const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';

const NO_RADIO_BUTTON_VAL = 'false';
const YES_RADIO_BUTTON_VAL = 'true';

function createInitialState() {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const datesMock = {
        baseData: {
            accountHolder: {
                dateOfBirth: {
                    year: 1989,
                    month: 11,
                    day: 26
                }
            },
            periodStartDate: {
                day: 18,
                month: 2,
                year: 2022
            }
        }
    };

    const submissionWithDates = { ...submissionInitial, ...datesMock };

    const submissionVM = viewModelService.create(
        submissionWithDates,
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
                showContinueOnPAC: true
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
        ancillaryCode: messages.ANCMotorPersonalAccidentCovExt
    }];
    _.set(initialState, 'ancillaryJourneyModel.ipidsInfo', ipidsInfo);
}

async function checkRadioButton(wrapper, value) {
    await act(async () => {
        wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === 'personal-accident-cover')
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
}

describe('<HDPersonalAccidentsPage />', () => {
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

    async function initializeWrapper(store, props) {
        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDPersonalAccidentsPage {...props} />
                </Provider>
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
        const initialState = {};
        const store = mockStore(initialState);

        wrapper = shallow(
            <Provider store={store}>
                <HDPersonalAccidentsPage />
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

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();
    });

    test('motor legal expenses cover: choose "Yes" radio button, starting from default state, then hide opened popup', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeRealStore(setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect popup is hidden
        expect(wrapper.find(HDToast).exists()).toBeFalsy();


        // check "Yes" radio button
        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await wait(5000);

        // expect checked "Yes" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);

        // expect opened popup
        expect(wrapper.find(HDToast).exists()).toBeTruthy();
    });

    test('motor legal expenses cover: choose "No" radio button, starting from "Yes" state, then hide opened popup', async () => {
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

    test('clicking confirmation button triggers continue action', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const store = initializeMockStore(setAllAncCoveragesSelectedStateMod);
        const navigateMock = jest.fn();
        const props = { navigate: navigateMock };
        await initializeWrapper(store, props);

        // initially no ancillary coverages are selected, so button is not displayed
        expect(wrapper.find('#personal-accidents-continue-btn button').exists()).toBeFalsy();

        // check "No" radio button (need to pick either yes or no for continue button to appear)
        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        wrapper.find('#personal-accidents-continue-btn button').simulate('click');

        expect(navigateMock).toHaveBeenCalledWith(true);
    });

    test('ancillary coverages not selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to No', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { personalAccident: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === NO_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to Yes', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { personalAccident: true });
        const store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find(HDToggleButtonGroupRefactor).findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === YES_RADIO_BUTTON_VAL).props())
            .toHaveProperty('checked', true);
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

    test('download action chain is executed on Insurer Product Information download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);

        wrapper.findWhere((n) => n.type() === HDLabelRefactor && n.prop('text') === messages.readDocumentMessage).simulate('click');
        expect(ipidDocByUUIDSpy).toHaveBeenCalledTimes(1);
    });

    describe('branch codes related data', () => {
        test('HD branch code results in data passed to quote table', async () => {
            const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, 'HD');
            const store = initializeMockStore(setBranchCodeStateMod);
            await initializeWrapper(store);

            expect(wrapper.find(HDQuoteTable).prop('data')).not.toEqual(null);
        });

        test('HP branch code results in data passed to quote table', async () => {
            const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, 'HP');
            const store = initializeMockStore(setBranchCodeStateMod);
            await initializeWrapper(store);

            expect(wrapper.find(HDQuoteTable).prop('data')).not.toEqual(null);
        });

        test('HE branch code results in data passed to quote table', async () => {
            const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, 'HE');
            const store = initializeMockStore(setBranchCodeStateMod);
            await initializeWrapper(store);

            expect(wrapper.find(HDQuoteTable).prop('data')).not.toEqual(null);
        });

        test('TPO branch code results in data passed to quote table', async () => {
            const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, 'TPO');
            const store = initializeMockStore(setBranchCodeStateMod);
            await initializeWrapper(store);

            expect(wrapper.find(HDQuoteTable).prop('data')).not.toEqual(null);
        });

        test('TPTF branch code results in data passed to quote table', async () => {
            const setBranchCodeStateMod = _.partialRight(setBranchCodeMod, 'TPTF');
            const store = initializeMockStore(setBranchCodeStateMod);
            await initializeWrapper(store);

            expect(wrapper.find(HDQuoteTable).prop('data')).not.toEqual(null);
        });
    });
});
