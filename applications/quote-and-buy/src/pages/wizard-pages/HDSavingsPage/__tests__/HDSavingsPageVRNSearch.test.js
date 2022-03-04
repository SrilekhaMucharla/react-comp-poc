import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import _ from 'lodash';
import { HDButtonRefactor } from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsVehicleInfoLookupService } from '../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import HDSavingsPageVRNSearch from '../HDSavingsPageVRNSearch';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import mcSubmission from '../mock/mockResponse.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

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


// arugments via ES6 parameter object dectructuring, to emulate python-like named arguments
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
                    <HDSavingsPageVRNSearch {...props} />
                </Provider>
            </BrowserRouter>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDSavingsPageVRNSearch />', () => {
    test('render component', () => {
        // Initialize mockstore with empty state
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDSavingsPageVRNSearch />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('component should have reg number input element', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        expect(wrapper.find('.tell-reg-number-text')).toBeTruthy();
    });

    test('component should call lookup method when user click on find car', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        const vehicleInfo = {
            result: {
                type: 'PrivateCar_Ext',
                abiCode: 'test'
            }
        };

        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="savings-search-input"]').at(0);
        await act(async () => textInput.props().onChange({
            target: {
                value: 'AGE'
            }
        }));
        await act(async () => wrapper.update());
        await act(async () => {
            wrapper.find('#find-car-button').find(HDButtonRefactor).at(0).props()
                .onClick();
        });
        wrapper.update();
        expect(wrapper.find('.invalid-field')).toBeTruthy();
    });

    test('component should display sorry you need to answer when user clicks find car without entering vrn', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const carInfo = store.getState().wizardState.data.submissionVM;
        const dontHaveRegHandlerMock = jest.fn();
        const props = {
            carInfo: carInfo,
            dontHaveRegHandler: dontHaveRegHandlerMock
        };
        const wrapper = await initializeWrapper(store, props);
        const vehicleInfo = {
            result: {
                type: 'PrivateCar_Ext',
                abiCode: 'test'
            }
        };

        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="savings-search-input"]').at(0);
        await act(async () => textInput.props().onChange({
            target: {
                value: ''
            }
        }));
        await act(async () => wrapper.update());
        await act(async () => {
            wrapper.find('#find-car-button').find(HDButtonRefactor).at(0).props()
                .onClick();
        });
        wrapper.update();
        expect(wrapper.find('.message').text()).toEqual('Sorry, you need to answer this question');
    });
});
