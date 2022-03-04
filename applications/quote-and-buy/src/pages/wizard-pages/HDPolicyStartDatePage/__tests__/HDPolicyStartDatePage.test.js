/* eslint-disable max-len */
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import {
    HDDropdownList, HDToggleButtonGroupRefactor
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDPolicyStartDatePage from '../HDPolicyStartDatePage';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [];
const mockStore = configureStore(middlewares);

const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
const ncdGrantedYearsFieldName = 'ncdgrantedYears';
const ncdGrantedYearsPath = `${vehiclePath}.${'ncdProtection'}.${ncdGrantedYearsFieldName}`;
const claimsDetailPath = 'lobData.privateCar.coverables.drivers.children[0].claimsAndConvictions.claimsDetailsCollection';

const protectNcdFieldName = 'protectNCD';
const drivingExpereinceTypeFieldName = 'drivingExperienceType';

const testErrMsg = 'test error message';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    })
}));


// arugments via ES6 parameter object dectructuring, to emulate python-like named arguments
function initializeStore({ ncdGrantedYearsValue, claimsDetailsValue } = {}) {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    if (ncdGrantedYearsValue) {
        _.set(submissionVM, `${ncdGrantedYearsPath}.value`, ncdGrantedYearsValue);
    }
    if (claimsDetailsValue) {
        _.set(submissionVM, `${claimsDetailPath}.value`, claimsDetailsValue);
    }

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        },
        createQuoteModel: {
            quoteError: {
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
            <Provider store={store}>
                <HDPolicyStartDatePage {...props} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDPolicyStartDatePage />', () => {
    test('render component', () => {
        // Initialize mockstore with empty state
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDPolicyStartDatePage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('error message is displayed, when present in state.createQuoteModel', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('p.error').text()).toEqual(testErrMsg);
    });

    test('setting 1 year no claims discount triggers question about protecting no claims discount', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('.policy-start__container').findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeFalsy();

        const event = { value: '1', label: '1' };
        await act(async () => {
            wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event);
        });
        wrapper.update();

        expect(wrapper.find('.policy-start__container').findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeTruthy();
    });

    test('setting 0 years no claims discount, answering Yes about experience on another policy, answering amount > 0, answering experience type', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        // choose 0 years no claims discount
        const event1 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
        expect(wrapper.find('#policy-start-other-exp-button-group').find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();

        // asnwer Yes about experience on another policy
        await act(async () => {
            wrapper.find('#policy-start-other-exp-button-group').find(HDToggleButtonGroupRefactor)
                .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'true')
                .find('input')
                .simulate('change', { currentTarget: { checked: true } });
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-other-exp-button-group').find(HDToggleButtonGroupRefactor)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'true').props()).toHaveProperty('checked', true);
        expect(wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).exists()).toBeTruthy();

        // choose 1 experience amount
        const event2 = { value: '1', label: '1' };
        await act(async () => {
            wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event2);
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event2);
        expect(wrapper
            .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName).exists()).toBeTruthy();

        // choose experience type
        const event3 = { label: 'Private Hire', value: '12' };
        await act(async () => {
            wrapper.findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName)
                .find('Select').invoke('onChange')(event3);
        });
        wrapper.update();

        expect(wrapper.findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName)
            .find('Select').props()).toHaveProperty('value', event3);
    });

    test('setting 0 years no claims discount, answering Yes about experience on another policy, answering amount 0', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        // choose 0 years no claims discount
        const event1 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
        expect(wrapper.find('#policy-start-other-exp-button-group').exists()).toBeTruthy();

        // asnwer Yes about experience on another policy
        await act(async () => {
            wrapper.find('#policy-start-other-exp-button-group')
                .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'true')
                .find('input')
                .simulate('change', { currentTarget: { checked: true } });
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-other-exp-button-group')
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'true').at(0).props())
            .toHaveProperty('checked', true);
        expect(wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).exists()).toBeTruthy();

        // choose 0 experience amount
        const event2 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event2);
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event2);
        expect(wrapper.find('.policy-start-claim-dropdown')
            .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName).exists()).toBeFalsy();
    });

    test('setting 0 years no claims discount, answering No about experience on another policy', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        // choose 0 years no claims discount
        const event1 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-claim-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
        expect(wrapper.find('#policy-start-other-exp-button-group').find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();

        // asnwer Yes about experience on another policy
        await act(async () => {
            wrapper.find('#policy-start-other-exp-button-group')
                .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'false')
                .find('input')
                .simulate('change', { currentTarget: { checked: true } });
        });
        wrapper.update();

        expect(wrapper.find('#policy-start-other-exp-button-group').find(HDToggleButtonGroupRefactor)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === 'false').props()).toHaveProperty('checked', true);
        expect(wrapper.find('#policy-start-driving-exp-dropdown').find(HDDropdownList).exists()).toBeFalsy();
    });

    // tests initial render useEffect and related behavior
    test('starting with ncdGrantedYears set to 1 results in discount protection question shown, without any prior user action on the page', async () => {
        const ncdGrantedYearsValue = { code: '1' };
        const store = initializeStore({ ncdGrantedYearsValue }); // ES6 same-name shorthand syntax
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('.policy-start__container').findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeTruthy();
    });

    // tests initial render useEffect and related behavior
    test('starting without ncdGrantedYears set results in discount protection question not shown, without any prior user action on the page', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('.policy-start__container').findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeFalsy();
    });

    // tests initial render useEffect and related behavior
    test('starting with ncdGrantedYears set to 1 and more than one claim with own fault recorded,'
        + 'results in discount protection question not shown, without any prior user action on the page', async () => {
        const ncdGrantedYearsValue = { code: '1' };
        const myFaultClaimDetails = { wasItMyFault: true, accidentDate: new Date('2020-01-01T00:00:00Z') };
        const claimsDetailsValue = Array(3).fill(myFaultClaimDetails); // can be same object x3 for this test
        const store = initializeStore({ ncdGrantedYearsValue, claimsDetailsValue }); // ES6 same-name shorthand syntax
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('.policy-start__container').findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeFalsy();
    });
});
