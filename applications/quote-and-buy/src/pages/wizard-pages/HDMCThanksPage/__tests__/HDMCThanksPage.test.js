import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { HDDropdownList } from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import HDMCThanksPage from '../HDMCThanksPage';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import * as multiCustomizeSubmission from '../../../../routes/mockMultiCustomizeSubmissionVM.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import mockPaymentSchedule from '../mock/mockMCPSnormal.json';
import { trackView, trackEvent } from '../../../../web-analytics/trackData';

const middlewares = [];
const mockStore = configureStore(middlewares);

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn()
}));

jest.mock('../../../../web-analytics/useMultiCarJourney.js', () => () => true);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    })
}));

jest.mock('../../../../web-analytics/trackData', () => ({
    trackEvent: jest.fn(),
    trackView: jest.fn()
}));

jest.mock('hastings-capability-renewaloptions', () => ({
    HastingsRenewalOptionService: {
        setRenewalOption: jest.fn().mockResolvedValue({
            result: {
                resultFlag: true
            }
        })
    }
}));
jest.mock('../MCPaymentBreakdownData.js', () => ({
    getMCYearlyPaymentBreakDownData: jest.fn().mockReturnValue([
        {
            id: 1,
            circle: {
                type: 'violet',
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                label: ['TEST123'],
                name: ['TEST123'],
                quote: { single: '£12' },
                tooltip: <div />
            }
        }, {
            id: 2,
            circle: {
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                name: ['TEST123'],
            }
        }, {
            id: 3,
            circle: {
                type: 'dot'
            },
            description: {
                name: ['TEST123'],
                quote: { single: `£${12}` }
            }
        }, {
            id: 7,
            circle: {
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                tooltip: <div />
            }
        }
    ]),
    getMCMonthlyPaymentBreakDownData: jest.fn().mockReturnValue([
        {
            id: 1,
            circle: {
                type: 'violet',
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                label: ['TEST123'],
                name: ['TEST123'],
                quote: { single: '£12' },
                tooltip: <div />
            }
        }, {
            id: 2,
            circle: {
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                name: ['TEST123'],
            }
        }, {
            id: 3,
            circle: {
                type: 'dot'
            },
            description: {
                name: ['TEST123'],
                quote: { single: `£${12}` }
            }
        }, {
            id: 7,
            circle: {
                date: { day: 1, shortMonth: '2' }
            },
            description: {
                tooltip: <div />
            }
        }
    ])
}));

const additionalEventValues = {
    customer_id: 'XA,XA,XA',
    insurance_product: 'HE,HD',
    product_option: 'Hastings Essential,Hastings Direct',
    product_option_code: 'HE,HD',
    sales_journey_type: 'multi_car',
    event_category: 'NEWBUS Car',
    journey_type: 'Car'
};

const expectedEventValues = [
    {
        order_reference_number: 'XA50000000279',
        policy_number: 'XA,XA,XA',
        sales_journey_type: 'multi_car'
    },
    {
        event_value: 'Change preference',
        event_type: 'label_click',
        element_id: 'gipp-nb-auto-rn-change-preference',
        event_action: 'Renewal preferences',
        ...additionalEventValues
    },
    {
        event_value: 'I think auto renewal is used to bump up the price of my quote',
        event_type: 'dropdown_change',
        element_id: 'gipp-nb-auto-rn-opt-out-dropdown',
        sales_journey_type: 'multi_car',
        event_action: 'Please tell us your reason for opting out...',
        ...additionalEventValues
    },
    {
        event_value: 'Confirm',
        event_action: 'Opting out',
        event_type: 'modal_confirm',
        element_id: 'gipp-nb-auto-rn-opt-out-confirm',
        optOutReasonCode: 'I think auto renewal is used to bump up the price of my quote',
        ...additionalEventValues
    },
    {
        event_type: 'toast_open',
        element_id: 'renewal-preference-toast',
        event_value: 'Toast',
        sales_journey_type: 'multi_car'
    }
];

const eventValues = [
    {
        event_value: 'Other',
        event_type: 'dropdown_change',
        element_id: 'gipp-nb-auto-rn-opt-out-dropdown',
        event_action: 'Please tell us your reason for opting out...',
        ...additionalEventValues
    },
    {
        event_value: 'Confirm',
        event_action: 'Opting out',
        event_type: 'modal_confirm',
        element_id: 'gipp-nb-auto-rn-opt-out-confirm',
        optOutReasonCode: 'Other',
        ...additionalEventValues
    },
    {
        event_type: 'toast_open',
        element_id: 'renewal-preference-toast',
        event_value: 'Toast',
        sales_journey_type: 'multi_car'
    }
];

const initializeStore = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const multiCustomSubVM = viewModelService.create(
        multiCustomizeSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiCustomQuoteDTO'
    );

    const initialState = {
        wizardState: {
            app: {
                multiCarFlag: true
            },
            data: {
                mcsubmissionVM: mcSubmissionVM,
                multiCustomizeSubmissionVM: multiCustomSubVM
            }
        },
        mcPaymentScheduleModel: {
            mcPaymentScheduleObject: mockPaymentSchedule.result[0]
        }
    };

    return mockStore(initialState);
};

const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

const mockProps = { pageMetadata: pageMetadata };

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDMCThanksPage {...props} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

describe('<HDMCThanksPage />', () => {
    afterEach(() => {
        trackEvent.mockClear();
        trackView.mockClear();
    });
    test('render component', () => {
        const initialState = {};
        const store = mockStore(initialState);

        const wrapper = shallow(
            <Provider store={store}>
                <HDMCThanksPage pageMetadata={pageMetadata} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('Component should have login button', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        expect(wrapper.find('.mc-thanks-page__log-in-button')).toBeTruthy();
    });

    test('Component should have container to show all quotes ref number', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        expect(wrapper.find('mc-thanks-page__container-car-info')).toBeTruthy();
    });
    test('should render overlay when optout link was clicked', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const overlay = wrapper.find('HDRenewalPreference');
        const modal = wrapper.find('HDModal');
        expect(overlay.length).toBe(1);
        expect(modal.props().show).toBeTruthy();
    });
    test('should not render overlay when optout link was clicked and overlay confirmed', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find('HDDropdownList');
        const options = dropdown.prop('options');

        await act(async () => dropdown.props().onChange({ target: { value: options[0] } }));
        await act(async () => wrapper.update());
        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(wrapper.find('HDModal').prop('show')).toBeFalsy();
    });
    test('should not render overlay when optout link was clicked and overlay canceled', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(1).props().onClick({
            target: {
                value: {
                    label: 'Cancel'
                }
            }
        }));
        wrapper.update();
        expect(wrapper.find('HDModal').prop('show')).toBeFalsy();
    });

    test('should send event when optout link was clicked', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        expect(trackEvent).toHaveBeenNthCalledWith(1, expectedEventValues[1]);
    });
    test('should send event when optout link was clicked and overlay confirmed', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        await act(async () => dropdown.props().onChange({ target: { value: options[0] } }));
        await act(async () => wrapper.update());
        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(trackEvent).toHaveBeenNthCalledWith(2, expectedEventValues[2]);
        expect(trackEvent).toHaveBeenNthCalledWith(3, expectedEventValues[3]);
        expect(trackEvent).toHaveBeenNthCalledWith(4, expectedEventValues[4]);
    });
    test('should send opt out reason when optout other reason was selected and text fill', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find('HDDropdownList');
        const options = dropdown.prop('options');

        await act(async () => dropdown.props().onChange({ target: { value: options[3] } }));
        await act(async () => wrapper.update());

        const textArea = wrapper.find('textarea');
        await act(async () => textArea.props().onChange({
            target: {
                value: 'Test reason inside the areatext.'
            }
        }));
        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(trackEvent).toHaveBeenNthCalledWith(2, eventValues[0]);
        expect(trackEvent).toHaveBeenNthCalledWith(3, eventValues[1]);
        expect(trackEvent).toHaveBeenNthCalledWith(4, eventValues[2]);
    });
    test('should send opt out reason when optout other reason was selected and text not fill', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find('HDDropdownList');
        const options = dropdown.prop('options');

        await act(async () => dropdown.props().onChange({ target: { value: options[3] } }));
        await act(async () => wrapper.update());

        const textArea = wrapper.find('textarea');
        await act(async () => textArea.props().onChange({
            target: {
                value: ''
            }
        }));
        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(trackEvent).toHaveBeenNthCalledWith(2, eventValues[0]);
        expect(trackEvent).toHaveBeenNthCalledWith(3, eventValues[1]);
        expect(trackEvent).toHaveBeenNthCalledWith(4, eventValues[2]);
    });
    test('should send redacted opt out reason when optout other reason contains nums and/or email', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find('HDDropdownList');
        const options = dropdown.prop('options');

        await act(async () => dropdown.props().onChange({ target: { value: options[3] } }));
        await act(async () => wrapper.update());

        const textArea = wrapper.find('textarea');
        await act(async () => textArea.props().onChange({
            target: {
                value: 'test@mail1.com test123 123test te2st test'
            }
        }));
        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('Button').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(trackEvent).toHaveBeenNthCalledWith(4, eventValues[2]);
    });

    test('should send wa event when optout modal close button is pressed', async () => {
        // setup
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, mockProps);
        const tempStorage = expectedEventValues[1];
        expectedEventValues[1] = {
            element_id: 'gipp-nb-auto-rn-opt-out-close',
            event_action: 'Opting out',
            event_type: 'modal_close',
            event_value: 'close',
            ...additionalEventValues
        };

        // test
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');

        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('[data-testid="close-button"]').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());
        expect(trackEvent).toHaveBeenNthCalledWith(2, expectedEventValues[1]);

        // cleanup
        expectedEventValues[1] = tempStorage;
    });
});
