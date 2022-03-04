import React from 'react';
import { Provider } from 'react-redux';
import {
    shallow,
    mount
} from 'enzyme';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import {
    HDDropdownList,
    HDToggleButtonGroupRefactor
} from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDMCPolicyStartDatePage from '../HDMCPolicyStartDatePage';
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

const onChangeAction = (component, path, actionName, actionValue) => {
    component
        .invoke('onChange')({
            target: {
                name: actionName,
                value: actionValue,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};

// arugments via ES6 parameter object dectructuring, to emulate python-like named arguments
function initializeStore({ ncdGrantedYearsValue, claimsDetailsValue } = {}, isParentPolicy = true) {
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

    _.set(submissionVM, `${vehiclePath}.value.license`, 'AV12BGE');
    _.set(submissionVM, 'value.isParentPolicy', isParentPolicy);

    const initialState = {
        wizardState: {
            data: {
                mcsubmissionVM: {
                    quotes: {
                        children: [submissionVM]
                    }
                }
            },
            app: {
                step: 1,
                prevStep: 0,
                currentPageIndex: 0
            },
        },
        createQuoteModel: {
            quoteError: {
                error: {
                    message: testErrMsg
                }
            }
        },
        updateMultiQuoteModel: {
            multiQuoteError: {
                error: {
                    message: testErrMsg
                }
            }
        },
        multiQuoteModel: {
            multiQuoteError: {
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
                <HDMCPolicyStartDatePage {...props} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCPolicyStartDatePage />', () => {
    test('render component', () => {
        // Initialize mockstore with empty state
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDMCPolicyStartDatePage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('setting 1 year no claims discount triggers question about protecting no claims discount', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find('#mc-policy-start-protect-ncd-button-group0').findWhere((n) => n.type() === HDToggleButtonGroupRefactor
        && n.prop('name') === protectNcdFieldName).exists())
            .toBeFalsy();

        const event = { value: '1', label: '1' };
        await act(async () => {
            wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event);
        });
        wrapper.update();
        expect(wrapper.find('#mc-policy-start-protect-ncd-button-group0').findWhere((n) => n.type() === HDToggleButtonGroupRefactor
        && n.prop('name') === protectNcdFieldName).exists())
            .toBeTruthy();
    });

    test('setting 0 years no claims discount, answering Yes about experience on another policy, answering amount > 0, answering experience type',
        async () => {
            const store = initializeStore();
            const wrapper = await initializeWrapper(store);

            // choose 0 years no claims discount
            const event1 = { value: '0', label: '0' };
            await act(async () => {
                wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
            });
            wrapper.update();

            expect(wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
            expect(wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();

            // asnwer Yes about experience on another policy
            const button = wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor);
            await act(async () => {
                onChangeAction(button, button.prop('path'), button.prop('name'), 'true');
            });
            wrapper.update();

            expect(wrapper.find('#mc-policy-start-driving-exp-button-group0')
                .at(0)
                .props()).toHaveProperty('value', 'true');
            expect(wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).exists()).toBeTruthy();

            // choose 1 experience amount
            const event2 = { value: '1', label: '1' };
            await act(async () => {
                wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).find('Select').invoke('onChange')(event2);
            });
            wrapper.update();

            expect(wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event2);
            expect(wrapper.find('#mc-policy-start-driving-exp-type0')
                .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName).exists()).toBeTruthy();

            // choose experience type
            const event3 = { label: 'Private Hire', value: '12' };
            await act(async () => {
                wrapper.find('#mc-policy-start-driving-exp-type0')
                    .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName)
                    .find('Select').invoke('onChange')(event3);
            });
            wrapper.update();

            expect(wrapper.find('#mc-policy-start-driving-exp-type0')
                .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName)
                .find('Select').props()).toHaveProperty('value', event3);
        });

    test('setting 0 years no claims discount, answering Yes about experience on another policy, answering amount 0', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        // choose 0 years no claims discount
        const event1 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();

        expect(wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
        expect(wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();

        // asnwer Yes about experience on another policy
        const button = wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor);
        await act(async () => {
            onChangeAction(button, button.prop('path'), button.prop('name'), 'true');
        });
        wrapper.update();

        expect(wrapper.find('#mc-policy-start-driving-exp-button-group0')
            .at(0)
            .props()).toHaveProperty('value', 'true');
        expect(wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).exists()).toBeTruthy();

        // choose 1 experience amount
        const event2 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).find('Select').invoke('onChange')(event2);
        });
        wrapper.update();

        expect(wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event2);
        expect(wrapper.find('#mc-policy-start-driving-exp-type0')
            .findWhere((n) => n.type() === HDDropdownList && n.prop('name') === drivingExpereinceTypeFieldName).exists()).toBeFalsy();
    });

    test('setting 0 years no claims discount, answering No about experience on another policy', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        // choose 0 years no claims discount
        const event1 = { value: '0', label: '0' };
        await act(async () => {
            wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').invoke('onChange')(event1);
        });
        wrapper.update();

        expect(wrapper.find('.mc-policy-start__ncd-dropdown').find(HDDropdownList).find('Select').props()).toHaveProperty('value', event1);
        expect(wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor).exists()).toBeTruthy();

        // asnwer Yes about experience on another policy
        const button = wrapper.find('#mc-policy-start-driving-exp-button-group0').find(HDToggleButtonGroupRefactor);
        await act(async () => {
            onChangeAction(button, button.prop('path'), button.prop('name'), 'false');
        });
        wrapper.update();

        expect(wrapper.find('#mc-policy-start-driving-exp-button-group0')
            .at(0)
            .props()).toHaveProperty('value', 'false');
        expect(wrapper.find('#mc-policy-start-driving-exp-years0').find(HDDropdownList).exists()).toBeFalsy();
    });

    // tests initial render useEffect and related behavior
    test('starting with ncdGrantedYears set to 1 results in discount protection question shown, without any prior user action on the page', async () => {
        const ncdGrantedYearsValue = { code: '1' };
        const store = initializeStore({ ncdGrantedYearsValue }); // ES6 same-name shorthand syntax
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('#mc-policy-start-protect-ncd-button-group0')
            .findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeTruthy();
    });

    // tests initial render useEffect and related behavior
    test('starting without ncdGrantedYears set results in discount protection question not shown, without any prior user action on the page', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);

        expect(wrapper.find('#mc-policy-start-protect-ncd-button-group0')
            .findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === protectNcdFieldName).exists())
            .toBeFalsy();
    });
});
