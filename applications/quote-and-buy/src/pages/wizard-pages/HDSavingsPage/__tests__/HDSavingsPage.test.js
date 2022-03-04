import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import _ from 'lodash';
import { HDModal, HDButtonRefactor } from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsVehicleInfoLookupService } from '../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import HDSavingsPage from '../HDSavingsPage';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import mcSubmission from '../mock/mockResponse.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import * as messages from '../HDSavingsPage.messages';

const middlewares = [];
const mockStore = configureStore(middlewares);

const vehiclePath = 'lobData.privateCar.coverables.vehicles[0]';
// const ncdGrantedYearsFieldName = 'ncdgrantedYears';
const regPath = `${vehiclePath}.registrationsNumber`;
const claimsDetailPath = 'lobData.privateCar.coverables.drivers.children[0].claimsAndConvictions.claimsDetailsCollection';

// const protectNcdFieldName = 'protectNCD';
// const drivingExpereinceTypeFieldName = 'drivingExperienceType';

const testErrMsg = 'test error message';
// const removeCarHandler = jest.fn();
// const modalCancelHandler = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    })
}));

jest.mock('../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup');


// arugments via ES6 parameter object dectructuring, to emulate python-like named arguments
function initializeStore({ removeReg, claimsDetailsValue } = {}) {
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
    if (claimsDetailsValue) {
        _.set(mcSubmissionVM, `${claimsDetailPath}.value`, claimsDetailsValue);
    }

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: mcSubmissionVM
            },
            app: {
                multiCarFlag: true
            }
        },
        multiQuoteModel: {
            multiQuoteError: {
                error: {
                    message: testErrMsg
                }
            }
        },
        multiToSingleQuoteModel: {
            multiToSingleQuoteObj: {},
            multiToSingleQuoteError: {
                error: {
                    message: testErrMsg
                }
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
                    <HDSavingsPage {...props} />
                </Provider>
            </BrowserRouter>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDSavingsPage />', () => {
    test('render component', () => {
        // Initialize mockstore with empty state
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDSavingsPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('clicking on remove car link opens remove car modal', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        await act(async () => {
            wrapper.find('#car-info-card-remove-car-btn').at(0).simulate('click');
        });
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.yesRemoveCar);
        expect(hdModal().props()).toHaveProperty('show', true);
    });

    test.skip('clicking on continue with quote for one car button opens a modal', async () => {
        const store = initializeStore(true);
        const wrapper = await initializeWrapper(store);

        await act(async () => {
            wrapper.find('#continue-with-one-car-button').find(HDButtonRefactor).simulate('click');
        });
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.yesContinue);
        expect(hdModal().props()).toHaveProperty('show', true);

        await act(async () => {
            wrapper.find('.hd-modal-footer').find(HDButtonRefactor).at(0).simulate('click');
        });
        wrapper.update();
        expect(hdModal().props()).toHaveProperty('show', false);
    });

    test('having no reg in one car should open a modal on load', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const wrapper = await initializeWrapper(store);
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.regModalBtnLabel);
        expect(hdModal().props()).toHaveProperty('show', 1);
    });

    test('having no reg in one car should open a modal on load and then continuing should show reg input container', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const wrapper = await initializeWrapper(store);
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.regModalBtnLabel);
        expect(hdModal().props()).toHaveProperty('show', 1);
        await act(async () => {
            wrapper.find('.hd-modal-footer').find(HDButtonRefactor).at(0).simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.reg-input-container')).toBeTruthy();
    });

    test('having no reg in one car should open a modal on load and then continuing should show reg input container', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const wrapper = await initializeWrapper(store);
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.regModalBtnLabel);
        expect(hdModal().props()).toHaveProperty('show', 1);
        await act(async () => {
            wrapper.find('.hd-modal-footer').find(HDButtonRefactor).at(0).simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.reg-input-container')).toBeTruthy();
    });

    test('error field will be show for invalid reg input', async () => {
        const removeReg = true;
        const store = initializeStore({ removeReg });
        const wrapper = await initializeWrapper(store);
        wrapper.update();
        const hdModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('confirmLabel') === messages.regModalBtnLabel);
        expect(hdModal().props()).toHaveProperty('show', 1);
        await act(async () => {
            wrapper.find('.hd-modal-footer').find(HDButtonRefactor).at(0).simulate('click');
        });
        wrapper.update();

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
        wrapper.find('#find-car-button').find(HDButtonRefactor).at(0).props()
            .onClick();
        await act(async () => wrapper.update());
        expect(wrapper.find('.invalid-field')).toHaveLength(1);
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockReset();
    });
});
