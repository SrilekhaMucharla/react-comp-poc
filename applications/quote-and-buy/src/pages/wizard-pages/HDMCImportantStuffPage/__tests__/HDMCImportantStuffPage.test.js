import React, { useState } from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsIpidService } from 'hastings-capability-ipid';
import { TranslatorContext } from '../../../../integration/TranslatorContext';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../HDYourQuotesPage/mock/mockSubmission.json';
import mockCovers from '../../HDImportantStuffPage/mock/mockCovers.json';
import HDMCImportantStuffPage from '../HDMCImportantStuffPage';
import HDDriverDetails from '../components/HDDriverDetails';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import mcSubmission from '../../HDSavingsPage/mock/mockResponse.json';
import mccustomizeSubmissionVM from '../../../../routes/CustomizesubmissionVMInitial.json';
import mockPaymentSchedule from '../../HDMCThanksPage/mock/mockMCPSnormal.json';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const ancCoveragesPath = 'coverages.privateCar.ancillaryCoverages';
const ncdCoveragesPath = 'ncdgrantedProtectionInd';
const driverPath = 'lobData.privateCar.coverables.drivers';

const PAYMENT_TYPE_MONTHLY_CODE = '3';

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

    const mcSubmissionCopy = _.cloneDeep(mcSubmission);
    mcSubmissionCopy.quotes = mcSubmissionCopy.quotes.filter((quoteObj) => quoteObj.isParentPolicy);
    const mcSubmissionVM = viewModelService.create(
        mcSubmissionCopy,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const mccustomizesubmission = viewModelService.create(
        mccustomizeSubmissionVM,
        'pc',
        'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                customizeSubmissionVM: customizeSubmissionVM,
                mcsubmissionVM: mcSubmissionVM,
                multiCustomizeSubmissionVM: mccustomizesubmission,
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
        mcPaymentScheduleModel: {
            mcPaymentScheduleObject: mockPaymentSchedule.result
        }
    };

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return [mockStore(initialState), viewModelService];
};

// wrapper to allow passing of required state and it's setter as props to HDMCImportantStuffPage
const TestWrapper = (props) => {
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPE_MONTHLY_CODE);

    return (
        <HDMCImportantStuffPage paymentType={paymentType} onPaymentTypeChange={setPaymentType} {...props} />
    );
};

async function initializeWrapper(store, viewModelService, props) {
    let wrapper;

    await act(async () => {
        wrapper = shallow(
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

describe('<HDMCImportantStuffPage />', () => {
    createPortalRoot();

    test('render component', () => {
        const store = mockStore({});
        const wrapper = shallow(
            <Provider store={store}>
                <HDMCImportantStuffPage />
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
    });

    test('all selected optional extras are passed to quote policy details view', async () => {
        const setNCDSelectedStateMod = _.partialRight(setNCDSelectedMod, true);
        const setAllAncCoveragesSelectedStateMod = _.partialRight(setAllAncCoveragesSelectedMod, true);
        const [store, viewModelService] = setupStore(setAllAncCoveragesSelectedStateMod, setNCDSelectedStateMod);
        const wrapper = await initializeWrapper(store, viewModelService);
        expect(wrapper.find(TestWrapper));
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
});
