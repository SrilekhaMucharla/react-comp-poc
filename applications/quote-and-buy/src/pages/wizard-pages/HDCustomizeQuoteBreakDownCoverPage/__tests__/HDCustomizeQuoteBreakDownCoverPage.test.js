import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { MemoryRouter } from 'react-router-dom';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDQuoteService from '../../../../api/HDQuoteService';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import { setNavigation as setNavigationAction } from '../../../../redux-thunk/actions';
import HDCustomizeQuoteBreakDownCoverPage from '../HDCustomizeQuoteBreakDownCoverPage';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import * as messages from '../HDCustomizeQuoteBreakDownCoverPage.messages';
import withTranslator from '../../__helpers__/test/withTranslator';
import * as utils from '../../../../common/utils';

jest.mock('../../../../common/utils');
jest.mock('../../../../../../../common/modules/gw-portals-url-js');

const mockCovers = require('../staticCovers.json');

const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const navigate = jest.fn();
const location = { search: '', state: { PCWJourney: true } };

const INITIAL_STATE = {
    quoteCoveragesObj: { a: '', b: '', c: '' },
    quoteCoveragesError: null
};

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 * @param {*} prevVal - previous value prop.
 */
const onChangeAction = (component, path, actionName, actionValue, prevVal = 'no') => {
    component
        .invoke('onChange')({
            target: {
                name: actionName,
                value: actionValue,
                previousvalue: prevVal,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};

let state;
const setupStore = (mockCoversObj) => {
// Init VM
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    // Initialize mockstore with empty state
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    // this is an workaround, submissionVM is too big to create SNAP
    const vehicle = _.get(submissionVM, vehiclePath);
    _.set(submission, vehiclePath, vehicle);
    const customizeSubmissionVM = viewModelService.create(
        mockCoversObj.result,
        'pc',
        'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
    );
    // { value: {} };
    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                customizeSubmissionVM: customizeSubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0,
                chosenAncillaryTerms: []
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
                ncdgrantedProtectionInd: true,
                producerCode: '1',
                insurancePaymentType: '1',
                otherOfferedQuotes: {},
                coverages: {},
            },
            quoteCoveragesError: null
        },
        ancillaryJourneyDataModel: {
            breakdown: false,
            keyCover: false,
            motorLegal: false,
            personalAccident: false,
            substituteVehicle: false,
            breakdownPreselect: false,
            ipidsInfo: [{ docUUID: '123456', ancillaryCode: messages.ipidEuropean }],
            ipidDocError: null,
            ipidMotorLegalDoc: {},
            ipidBreakdownEuropeanDoc: {},
            ipidBreakdownHomeStartDoc: {},
            ipidBreakdownRoadsideRecoveryDoc: {},
            ipidBreakdownRoadsideDoc: {
                // eslint-disable-next-line max-len
                documentContentEncoded: 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4='
            },
            ipidSubstituteVehicleDoc: {},
            ipidPersonalAccidentalDoc: {},
            ipidKeyCoverDoc: {}
        }
    };
    state = initialState;

    return mockStore(initialState);
};

const mountWrapper = async (store, customizeSubmissionVM) => {
    const wrapper = await mount(withTranslator(
        <MemoryRouter>
            <Provider store={store}>
                <HDCustomizeQuoteBreakDownCoverPage.WrappedComponent
                    setNavigation={setNavigationAction}
                    dispatch={store.dispatch}
                    submissionVM={submission}
                    customizeSubmissionVM={customizeSubmissionVM}
                    location={location}
                    ancillaryJourneyDataModel={state.ancillaryJourneyDataModel}
                    updateQuoteCoveragesData={state.updateQuoteCoveragesModel}
                    preSelectedTerms={state.chosenAncillaryTerms}
                    navigate={navigate} />
            </Provider>
        </MemoryRouter>
    ));
    return wrapper;
};

async function initializeWrapper(store, props) {
    setupStore(mockCovers);
    let wrapper;
    const { customizeSubmissionVM } = state.wizardState.data;
    await act(async () => {
        wrapper = mount(
            <MemoryRouter initialEntries={[{ ...location }]}>
                <Provider store={store}>
                    <HDCustomizeQuoteBreakDownCoverPage.WrappedComponent
                        setNavigation={setNavigationAction}
                        dispatch={store.dispatch}
                        submissionVM={submission}
                        customizeSubmissionVM={customizeSubmissionVM}
                        location={location}
                        updateQuoteCoveragesData={INITIAL_STATE}
                        ancillaryJourneyDataModel={state.ancillaryJourneyDataModel}
                        preSelectedTerms={state.chosenAncillaryTerms}
                        {...props} />
                </Provider>
            </MemoryRouter>
        );
    });
    await act(async () => wrapper.update());
    return wrapper;
}

describe('<HDCustomizeQuoteBreakDownCoverPage />', () => {
    const ipidDocByUUIDMockResult = {
        result: {
            documentContentEncoded: 'file encoded to string',
            fileName: 'IPID - Ancillary - Motor Legal',
            mimeType: 'application/pdf'
        }
    };
    // eslint-disable-next-line no-unused-vars
    const ipidDocByUUIDSpy = jest.spyOn(HastingsDocretrieveService, 'ipidDocByUUID').mockResolvedValue(ipidDocByUUIDMockResult);
    // eslint-disable-next-line no-unused-vars
    const updateQuoteCoverages = jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockResolvedValue({});
    utils.base64ToArrayBuffer = jest.fn();
    let store;
    let wrapper;
    createPortalRoot();
    beforeEach(async () => {
        store = setupStore(mockCovers);
        wrapper = await mountWrapper(store, state.wizardState.data.customizeSubmissionVM);
    });

    test('component renders', () => {
        expect(wrapper).toHaveLength(1);
    });

    function initializeMockStore(...initialStateModifiers) {
        const initialState = setupStore(mockCovers).getState();

        // apply initialState modifiers
        _.over(initialStateModifiers)(initialState);

        return mockStore(initialState);
    }

    function setAllAncCoveragesSelectedMod(initialState, setAllAncCoveragesSelectedValue) {
        const ancCoverages = _.get(initialState, `wizardState.data.customizeSubmissionVM.${ancCoveragesPath}.value`);
        _.forEach(ancCoverages[0].coverages, (cov) => {
            _.set(cov, 'selected', setAllAncCoveragesSelectedValue);
        });
    }

    function extendAncillaryJourneyModelMod(initialState, ancillaryJourneyDataModel) {
        _.assign(initialState.ancillaryJourneyDataModel, ancillaryJourneyDataModel);
    }

    test('ancillary coverages not selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to No', async () => {
        createPortalRoot();
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, false);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find('ToggleButton').at(1).props())
            .toHaveProperty('checked', false);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel indicating choice made, results in radio button set to Yes', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);

        // expect checked "No" radio button
        expect(wrapper.find('ToggleButton').at(1).props())
            .toHaveProperty('checked', false);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel and click on download 1', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);
        const link = wrapper.find('HDQuoteDownloadRefactor[id="break-down-cover-roadside-link"]');
        expect(link).toHaveLength(0);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel and click on download 2', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);
        const link = wrapper.find('HDQuoteDownloadRefactor[id="break-down-cover-roadside-recovery-link"]').at(0);
        expect(link).toHaveLength(0);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel and click on download 3', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);
        const link = wrapper.find('HDQuoteDownloadRefactor[id="break-down-cover-home-link"]');
        expect(link).toHaveLength(0);
    });

    test('ancillary coverages selected and ancillaryJourneyDataModel and click on download 4', async () => {
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const extendAncillaryJourneyModelStateMod = _.partialRight(extendAncillaryJourneyModelMod, { breakdown: true });
        store = initializeMockStore(extendAncillaryJourneyModelStateMod, setAllAncCoveragesSelectedStateMod);
        wrapper = await initializeWrapper(store);
        const link = wrapper.find('HDQuoteDownloadRefactor[id="break-down-cover-european-link"]');
        expect(link).toHaveLength(0);
    });

    test('RAC button to YES shows options table', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDTable')).toHaveLength(1);
    });

    test('RAC button to NO does not show options table', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'false'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDTable')).toHaveLength(0);
    });

    test('RAC button to YES and choose "Roadside" and can Continue', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(0);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').prop('disabled')).toBeFalsy();
    });

    test('RAC button to YES and choose "Roadside and recovery" and can Continue', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(1);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').prop('disabled')).toBeFalsy();
    });

    test('RAC button to YES and choose "Roadside, recovery and home" and can Continue', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(2);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').prop('disabled')).toBeFalsy();
    });

    test('RAC button to YES and choose "Roadside, recovery, home and European" and Continue with selected', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(3);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        const continueButton = wrapper.find('HDButtonRefactor');
        await act(async () => continueButton.props().onClick());

        await act(async () => wrapper.update());

        const yesButton = wrapper.find(`HDModal[show=true] HDButtonRefactor[label="${messages.coverageContinue}"]`);
        await act(async () => yesButton.props().onClick());

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').prop('disabled')).toBeFalsy();
    });

    test('RAC button to YES and choose "Roadside, recovery, home and European" and cancel', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(3);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        const continueButton = wrapper.find('HDButtonRefactor');
        await act(async () => continueButton.props().onClick());

        await act(async () => wrapper.update());

        const noButton = wrapper.find('HDModal').at(1);
        await act(async () => noButton.props().onCancel());

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').at(0).prop('disabled')).toBeFalsy();
    });

    test('RAC button to YES and choose "No cover needed"', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(3);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const link = wrapper.find('HDLabelRefactor#break-down-cover-no-cov-needed-link');
        await act(async () => link.props().onClick());

        await act(async () => wrapper.update());

        expect(wrapper.find('HDModal').at(1).prop('show')).toBeTruthy();
    });

    test('RAC button to YES and choose "No cover needed" and confirm', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const select = wrapper.find('HDTable');
        await act(async () => select.props().onSelect({
            target: {
                value: messages.roadside
            }
        }));

        await act(async () => wrapper.update());

        const continueButton = wrapper.find('HDButtonRefactor').at(0);
        await act(async () => continueButton.props().onClick());

        await act(async () => wrapper.update());

        const yesButton = wrapper.find('HDModal').at(1);
        await act(async () => yesButton.props().onConfirm());

        await act(async () => wrapper.update());

        expect(wrapper.find('HDModal').at(1).prop('hidden')).toBeFalsy();
    });

    test('RAC button to YES and choose "No cover needed" and cancel', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const link = wrapper.find('HDTable');
        await act(async () => link.props().onSelect({
            target: {
                value: messages.roadside
            }
        }));

        await act(async () => wrapper.update());

        const noButton = wrapper.find('HDModal').at(1);
        await act(async () => noButton.props().onCancel());

        await act(async () => wrapper.update());
        expect(wrapper.find('HDModal').at(1).prop('hidden')).toBeFalsy();
    });
});

describe('<HDCustomizeQuoteBreakDownCoverPage /> Hastings Premier', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        const branchCodePath = 'result.quote.branchCode';
        _.set(mockCovers, `${branchCodePath}`, messages.HP);
        _.set(mockCovers, 'result.quote.hastingsPremium.monthlyPayment', false);
        store = setupStore(mockCovers);
        state.ancillaryJourneyDataModel.ipidsInfo[0].ancillaryCode = messages.ipidRoadside;
        const { customizeSubmissionVM } = state.wizardState.data;
        wrapper = await mountWrapper(store, customizeSubmissionVM);
    });
    test('render component', async () => {
        expect(wrapper).toHaveLength(1);
    });
});

describe('<HDCustomizeQuoteBreakDownCoverPage /> Hastings Direct', () => {
    const ipidDocByUUIDMockResult = {
        result: {
            documentContentEncoded: 'file encoded to string',
            fileName: 'IPID - Ancillary - Motor Legal',
            mimeType: 'application/pdf'
        }
    };
    // eslint-disable-next-line no-unused-vars
    const ipidDocByUUIDSpy = jest.spyOn(HastingsDocretrieveService, 'ipidDocByUUID').mockResolvedValue(ipidDocByUUIDMockResult);
    utils.base64ToArrayBuffer = jest.fn();
    utils.iPidAncillaryAPIObject = jest.fn();
    let store;
    let wrapper;
    beforeEach(async () => {
        _.set(location, 'state', null);

        const branchCodePath = 'result.quote.branchCode';
        _.set(mockCovers, branchCodePath, messages.HD);
        const terms = [
            {
                name: 'Compulsory Accidental Damage Excess',
                type: 'DirectCovTerm',
                updated: false,
                valueType: 'Money',
                publicID: 'PCAccDmgCompExcessCT_Ext',
                required: false,
                options: [
                    {
                        name: 'None Selected',
                        code: {
                            includes: jest.fn()
                        },
                        amount: 250
                    }
                ],
                coveragePublicID: 'PCAccidentalDamageCov_Ext',
                chosenTermValue: '250',
                directValue: 250.0000,
                isAscendingBetter: true,
                patternCode: 'PCAccDmgCompExcessCT_Ext',
                chosenTerm: '250.0000'
            }
        ];
        const termsPath = 'result.coverages.privateCar.ancillaryCoverages[0].coverages[0].terms';
        _.set(mockCovers, termsPath, terms);
        const selectedPath = 'result.coverages.privateCar.ancillaryCoverages[0].coverages[0].selected';
        _.set(mockCovers, selectedPath, true);

        store = setupStore(mockCovers);
        state.ancillaryJourneyDataModel.ipidsInfo[0].ancillaryCode = messages.ipidHomestart;
        const { customizeSubmissionVM } = state.wizardState.data;
        await act(async () => {
            wrapper = await mountWrapper(store, customizeSubmissionVM);
        });
    });
    test('render component', async () => {
        expect(wrapper).toHaveLength(1);
    });

    test('RAC button to YES shows options table', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDTable')).toHaveLength(1);
    });

    test('RAC button to YES and choose "No cover needed" and confirm', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const link = wrapper.find('HDTable');
        await act(async () => link.props().onSelect({
            target: {
                value: messages.roadside
            }
        }));

        await act(async () => wrapper.update());

        const yesButton = wrapper.find('HDButtonRefactor').at(0);
        await act(async () => yesButton.props().onClick());

        await act(async () => wrapper.update());

        expect(wrapper.find('HDTable').at(0).prop('show')).toBeFalsy();
    });

    test('RAC button to NO does not show options table', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'false'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDTable')).toHaveLength(0);
    });

    test('RAC button to YES and choose "Roadside" and can Continue', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            toggleButtons,
            toggleButtons.prop('path'),
            toggleButtons.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        const radioButton = wrapper.find('HDImageRadioButton').at(0);
        await act(async () => onChangeAction(
            radioButton,
            radioButton.prop('path'),
            radioButton.prop('name'),
            'true'
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('HDButtonRefactor').prop('disabled')).toBeFalsy();
    });
});

describe('<HDCustomizeQuoteBreakDownCoverPage /> no selected coverages', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        _.set(location, 'state', null);

        const branchCodePath = 'result.quote.branchCode';
        _.set(mockCovers, branchCodePath, messages.HD);
        const terms = [
            {
                name: 'Compulsory Accidental Damage Excess',
                type: 'DirectCovTerm',
                updated: false,
                valueType: 'Money',
                publicID: 'PCAccDmgCompExcessCT_Ext',
                required: false,
                options: [
                    {
                        name: 'None Selected',
                        code: {
                            includes: jest.fn()
                        },
                        amount: 250
                    }
                ],
                coveragePublicID: 'PCAccidentalDamageCov_Ext',
                chosenTermValue: '250',
                directValue: 250.0000,
                isAscendingBetter: true,
                patternCode: 'PCAccDmgCompExcessCT_Ext',
                chosenTerm: '250.0000'
            }
        ];
        const termsPath = 'result.coverages.privateCar.ancillaryCoverages[0].coverages[0].terms';
        _.set(mockCovers, termsPath, terms);
        const selectedPath = 'result.coverages.privateCar.ancillaryCoverages[0].coverages[0].selected';
        _.set(mockCovers, selectedPath, false);

        store = setupStore(mockCovers);
        state.ancillaryJourneyDataModel.ipidsInfo[0].ancillaryCode = messages.ipidRoadsideAndRecovery;
        state.ancillaryJourneyDataModel.breakdown = true;
        const { customizeSubmissionVM } = state.wizardState.data;
        wrapper = await mountWrapper(store, customizeSubmissionVM);
    });
    test('render component', async () => {
        expect(wrapper).toHaveLength(1);
    });
});
