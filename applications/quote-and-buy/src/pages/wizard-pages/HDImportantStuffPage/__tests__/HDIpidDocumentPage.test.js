import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { applyMiddleware, createStore } from 'redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsDocretrieveService } from 'hastings-capability-docretrieve';
import { HDLabelRefactor } from 'hastings-components';
import rootReducer from '../../../../redux-thunk/reducers/index';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import customizeSubmission from '../mock/customizeSubmission.json';
import * as utils from '../../../../common/utils';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import * as messages from '../HDImportantStuffPage.messages';
import HDIpidDocumentPage from '../HDIpidDocumentPage';

jest.mock('../../../../common/downloadFile/handlePolicyBookletDownloadFile');

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
            ipidKeyCoverDoc: {},
            ipidCarPolicy: {}
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

function setIpidsInfo(initialState) {
    const ipidsInfo = [{
        fileName: 'some-file-name',
        description: 'some-file-description',
        uuid: '{11111111-1111-1111-1111-111111111111}',
    }];
    _.set(initialState, 'ancillaryJourneyModel.ipidsInfo', ipidsInfo);
}


describe('<HDIpidDocumentPage />', () => {
    let wrapper;
    const ipidDocByUUIDMockResult = {
        result: {
            documentContentEncoded: 'file encoded to string',
            fileName: 'IPID - Hastings Direct Comprehensive Car Policy',
            mimeType: 'application/pdf'
        }
    };
    jest.spyOn(HastingsDocretrieveService, 'ipidDocByUUID').mockResolvedValue(ipidDocByUUIDMockResult);
    utils.base64ToArrayBuffer = jest.fn();
    utils.saveByteArray = jest.fn();

    createPortalRoot();

    async function initializeWrapper(store, props, location) {
        await act(async () => {
            wrapper = mount(
                <MemoryRouter initialEntries={[{ ...location }]}>
                    <Provider store={store}>
                        <HDIpidDocumentPage {...props} />
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
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', () => {
        const RealStore = initializeRealStore();

        wrapper = mount(
            <Provider store={RealStore}>
                <HDIpidDocumentPage />
            </Provider>
        );
    });

    it('should contain HDLabelRefactor', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(8);
    });

    test('download action chain is executed on car insurance download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);
        const linkButton = wrapper.findWhere((n) => n.type() === HDLabelRefactor && n.prop('className') === 'ipid-details__car-insurance-link');
        expect(linkButton).toHaveLength(2);
        const button = linkButton.at(1);// get the first button
        button.simulate('click');
    });

    test('download action chain is executed on ancillary download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);
        const linkButton = wrapper.findWhere((n) => n.type() === HDLabelRefactor && n.prop('className') === 'ipid-details__download-file-link');
        expect(linkButton).toHaveLength(2);
        // and
        expect(linkButton.at(1).find('.ipid-details__download-file-link > span').text()).toContain(messages.substituteVehicle);
        const button = linkButton.at(0);// get the first button
        button.simulate('click');
    });

    test('download action chain is executed on policy booklet additional product download link click', async () => {
        const store = initializeRealStore(setIpidsInfo);
        await initializeWrapper(store);
        const linkButton = wrapper.findWhere((n) => n.type() === HDLabelRefactor && n.prop('className') === 'ipid-details__additional-products-link');
        expect(linkButton).toHaveLength(1);
        const button = linkButton.at(0);// get the first button
        button.simulate('click');
    });
});
