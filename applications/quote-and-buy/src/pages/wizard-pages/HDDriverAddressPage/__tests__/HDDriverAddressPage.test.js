/* eslint-disable no-unused-vars */
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import HDDriverAddressPage from '../HDDriverAddressPage';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

let customSubmissionVM;

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

jest.mock('hastings-capability-addresslookup');

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => { return element; }
}));

describe('<HDDriverAddressPage />', () => {
    createPortalRoot();
    beforeEach(() => {
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

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const yearsLivedAtCurrentAddressFieldName = 'yearsLivedAtCurrentAddress.aspects.availableValues';
        const yearsLivedAtCurrentAddressPath = `${driverPath}.${yearsLivedAtCurrentAddressFieldName}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, yearsLivedAtCurrentAddressPath);
        _.set(submission, yearsLivedAtCurrentAddressPath, aspects);
        customSubmissionVM = submission;

        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
    });

    test('render component', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('verify classname address-page-container', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        ));
        expect(wrapper.find('.address-page-container').exists()).toBe(true);
    });

    test('Search address by postcode', async () => {
        const mockData = {
            result: {
                matches: [
                    {
                        addressline1: 'Street One 1',
                        city: 'City',
                    },
                    {
                        addressline1: 'Street Two 2',
                        city: 'City',
                    }
                ]
            }
        };

        HastingsAddressLookupService.lookupAddressByPostCode.mockResolvedValue(mockData);

        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        ));

        await act(async () => {
            wrapper.find('#address-page-postcode-input').first().simulate('change', {
                target: {
                    name: 'postcode',
                    value: 'TN39 3AA',
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => { /* mock */ }
                }
            });
            wrapper.find('.address-page__lookup-button').first().simulate('click');
        });
    });

    test('it displays tooltipOverlay on click first icon question', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        ));

        const iconOverlay = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            iconOverlay
                .simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });

    test('it displays tooltipOverlay on click enter mannualy button', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        ));

        const enterManuallyLink = wrapper.find('.hd-overlay-btn').at(1);
        await act(async () => {
            enterManuallyLink
                .simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });

    test('enter manual address', async () => {
        const setNavigation = jest.fn();
        const setAddressDisplay = jest.fn();
        const dispatch = jest.fn();
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage.WrappedComponent
                    submissionVM={customSubmissionVM}
                    setNavigation={setNavigation}
                    setAddressDisplay={setAddressDisplay}
                    dispatch={dispatch} />
            </Provider>
        ));

        const popup = wrapper.find('HDManualAddressPopup');
        const address = {
            addressLine1: 'Test St 123',
            addressLine2: 'xxx',
            addressLine3: 'xxx',
            postalCode: 'XX23XX',
            city: 'Test City',
        };
        await act(async () => {
            popup
                .props().onConfirm(address);
        });
        wrapper.update();
        expect(wrapper.find('HDManualAddressPopup').prop('initialAddress').addressLine1).toBe(address.addressLine1);
    });

    test('it displays modal', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverAddressPage />
            </Provider>
        ));
        const modal = wrapper.find('#address-confirm-modal').at(0);
        wrapper.update();
        expect(modal.prop('show')).toBeFalsy();
    });
});
