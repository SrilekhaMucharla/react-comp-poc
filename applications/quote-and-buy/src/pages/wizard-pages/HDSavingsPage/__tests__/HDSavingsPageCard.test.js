import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import _ from 'lodash';
import { HDLabelRefactor, HDQuoteInfoRefactor } from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../../web-analytics';
import HDSavingsPageCard from '../HDSavingsPageCard';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import mcSubmission from '../mock/mockResponse.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import HDSavingsPageVRNSearch from '../HDSavingsPageVRNSearch';

const middlewares = [];
const mockStore = configureStore(middlewares);

const vehiclePath = 'lobData.privateCar.coverables.vehicles[0]';
const regPath = `${vehiclePath}.registrationsNumber`;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    })
}));

jest.mock('../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup');

// carInfo, removeCarHandler, dontHaveRegHandler, firstNonRegQuoteID, show Multi car Discount, pageMetadata, isPCWJourney
// arguments via ES6 parameter object destructuring, to emulate python-like named arguments
function initializeStore({ removeReg } = {}) {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    if (removeReg) {
        _.unset(mcSubmission.quotes[0], regPath);
    }

    const mcSubmissionVM = viewModelService.create(
        mcSubmission,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const submissionVM = viewModelService.create(
        mcSubmission.quotes[0],
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                mcsubmissionVM: mcSubmissionVM
            },
            app: {
                multiCarFlag: true,
                showedNoRegModal: false
            }
        }
    };

    return mockStore(initialState);
}

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(withTranslator(
            <BrowserRouter>
                <Provider store={store}>
                    <HDSavingsPageCard {...props} />
                </Provider>
            </BrowserRouter>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDSavingsPageCard />', () => {
    test('render component', () => {
        // Initialize mock store with empty state
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDSavingsPageCard />
            </Provider>
        );
        expect(wrapper).toBeDefined();
    });

    it('should contain HDLabel', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        // then
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(6);
    });

    it('should contain HDSavingsPageVRNSearch', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        // then
        expect(wrapper.find(HDSavingsPageVRNSearch)).toHaveLength(1);
    });

    it('should contain HDQuoteInfoRefactor', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        // then
        expect(wrapper.find(HDQuoteInfoRefactor)).toHaveLength(1);
    });

    it('should contain HDOverlayPopup', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        // then
        expect(wrapper.find(HDOverlayPopup)).toHaveLength(0);
    });

    test('clicking on find car button', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        await act(async () => {
            wrapper.find('#find-car-button').at(0).simulate('click');
        });
        wrapper.update();
    });
});
