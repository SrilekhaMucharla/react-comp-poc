import React from 'react';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { HDDropdownList, HDPaymentBreakdown } from 'hastings-components';
import HDThanksPage from '../HDThanksPage';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import { trackView, trackEvent } from '../../../../web-analytics/trackData';

const middlewares = [];
const mockStore = configureStore(middlewares);

jest.mock('hastings-capability-renewaloptions', () => ({
    HastingsRenewalOptionService: {
        setRenewalOption: jest.fn().mockResolvedValue({
            result: {
                resultFlag: true
            }
        })
    }
}));
jest.mock('../PaymentBreakdownData.js', () => ({
    getYearlyPaymentBreakDownData: jest.fn().mockReturnValue([
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
    getMonthlyPaymentBreakDownData: jest.fn().mockReturnValue([
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

jest.mock('../../../../web-analytics/trackData', () => ({
    trackEvent: jest.fn(),
    trackView: jest.fn()
}));

const additionalValues = {
    customer_id: 'XA200000027758',
    event_category: 'NEWBUS Car',
    insurance_product: 'xyz',
    journey_type: 'Car',
    sales_journey_type: 'single_car',
    product_option: 'xyz',
    product_option_code: 'xyz',
};

const expectedEventValues = [
    {
        event_value: 'Change preference',
        event_type: 'label_click',
        element_id: 'gipp-nb-auto-rn-change-preference',
        event_action: 'Renewal preferences',
        ...additionalValues
    },
    {
        event_value: 'I think auto renewal is used to bump up the price of my quote',
        event_type: 'dropdown_change',
        element_id: 'gipp-nb-auto-rn-opt-out-dropdown',
        event_action: 'Please tell us your reason for opting out...',
        ...additionalValues
    },
    {
        event_value: 'Confirm',
        event_type: 'modal_confirm',
        element_id: 'gipp-nb-auto-rn-opt-out-confirm',
        event_action: 'Opting out',
        optOutReasonCode: 'I think auto renewal is used to bump up the price of my quote',
        ...additionalValues
    },
    {
        event_type: 'toast_open',
        element_id: 'renewal-preference-toast',
        event_value: 'Toast',
        sales_journey_type: 'single_car'
    }
];

const eventValues = [
    {
        event_value: 'Other',
        event_type: 'dropdown_change',
        element_id: 'gipp-nb-auto-rn-opt-out-dropdown',
        event_action: 'Please tell us your reason for opting out...',
        ...additionalValues
    },
    {
        event_value: 'Confirm',
        event_type: 'modal_confirm',
        element_id: 'gipp-nb-auto-rn-opt-out-confirm',
        optOutReasonCode: 'Other',
        event_action: 'Opting out',
        ...additionalValues
    },
    {
        event_type: 'toast_open',
        element_id: 'renewal-preference-toast',
        event_value: 'Toast',
        sales_journey_type: 'single_car'
    }
];

const mockAppState = {
    offeredQuoteModel: {
        offeredQuotes: [{ branchCode: 'xyz', branchName: 'xyz' }]
    },
    wizardState: {
        app: {
            paymentDay: '1'
        },
        data: {
            submissionVM: {
                lobData: {
                    privateCar: {
                        coverables: {
                            vehicles: {
                                children: [
                                    {
                                        value: {
                                            make: 'MERCEDES-BENZ',
                                            model: 'E250 SPORT ED125 CDI BLUE',
                                            registrationsNumber: 'AV12BGE'
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                baseData: {
                    periodStartDate: {
                        value: {
                            year: 2021,
                            month: 3,
                            day: 21
                        }
                    },
                    periodEndDate: {
                        value: {
                            year: 2022,
                            month: 3,
                            day: 21
                        }
                    }
                },
                bindData: {
                    policyNumber: {
                        value: 'XA200000027758'
                    }
                }
            },
            customizeSubmissionVM: {
                value: {
                    insurancePaymentType: '1',
                    quote: {
                        hastingsPremium: {
                            monthlyPayment: {
                                elevenMonthsInstalments: {
                                    amount: '99.99'
                                },
                                firstInstalment: {
                                    amount: '80.99'
                                }
                            },
                            annuallyPayment: {
                                premiumAnnualCost: {
                                    amount: '1100.99'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'single_car' };

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn()
}));

describe('HDThanksPage', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockAppState);
        });
    });
    afterEach(() => {
        useSelector.mockClear();
        trackEvent.mockClear();
        trackView.mockClear();
    });
    // const initialState = {};
    const store = mockStore(mockAppState);
    createPortalRoot();
    const getShallowWrapper = () => shallow(<Provider store={store}><HDThanksPage pageMetadata={pageMetadata} /></Provider>);
    const getMountedWrapper = async () => {
        const wrapper = await mountWithSubmissionVM(
            <Provider store={store}>
                <HDThanksPage pageMetadata={pageMetadata} />
            </Provider>,
            [],
            [],
            mockAppState
        );
        return wrapper;
    };

    it('should render correctly and match the snapshot', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper).toMatchSnapshot();
    });
    it('should contain HDButton', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper.find('#login-button')).toHaveLength(0);
    });
    it('should contain HDPaymentBreakdown', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper.find(HDPaymentBreakdown)).toHaveLength(0);
    });
    it('should render make number', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper.text().includes('MERCEDES-BENZ')).toBe(false);
    });
    it('should render registrations number', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper.text().includes('AV12 BGE')).toBe(false);
    });
    it('should render policyNumber number', () => {
        const wrapper = getShallowWrapper();
        expect(wrapper.text().includes('XA200000027758')).toBe(false);
    });
    it('should render when mounted', async () => {
        const wrapper = await getMountedWrapper();
        expect(wrapper.length).toBe(1);
        expect(wrapper).toMatchSnapshot();
    });
    it('should render overlay when optout link was clicked', async () => {
        const wrapper = await getMountedWrapper();
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const overlay = wrapper.find('HDRenewalPreference');
        const modal = wrapper.find('HDModal');
        expect(overlay.length).toBe(1);
        expect(modal.props().show).toBeTruthy();
    });
    it('should not render overlay when optout link was clicked and overlay confirmed', async () => {
        const wrapper = await getMountedWrapper();
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
        expect(wrapper.find('HDModal').prop('show')).toBeFalsy();
    });
    it('should not render overlay when optout link was clicked and overlay canceled', async () => {
        const wrapper = await getMountedWrapper();
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
        await act(async () => wrapper.update());
        expect(wrapper.find('HDModal').prop('show')).toBeFalsy();
    });

    it('should send event when optout link was clicked', async () => {
        const wrapper = await getMountedWrapper();
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        expect(trackEvent).toHaveBeenNthCalledWith(1, expectedEventValues[0]);
    });
    it('should send event when optout link was clicked and overlay confirmed', async () => {
        const wrapper = await getMountedWrapper();
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
        expect(trackEvent).toHaveBeenNthCalledWith(3, expectedEventValues[2]);
        expect(trackEvent).toHaveBeenNthCalledWith(4, expectedEventValues[3]);
    });
    it('should send opt out reason when optout other reason was selected and text fill', async () => {
        const wrapper = await getMountedWrapper();
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find(HDDropdownList);
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
    it('should send opt out reason when optout other reason was selected and text not fill', async () => {
        const wrapper = await getMountedWrapper();
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');
        const dropdown = wrapper.find(HDDropdownList);
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
        expect(trackEvent).toHaveBeenNthCalledWith(3, eventValues[1]);
        expect(trackEvent).toHaveBeenNthCalledWith(4, eventValues[2]);
    });

    it('should send wa event when optout modal close button is pressed', async () => {
        // setup
        const tempStorage = expectedEventValues[1];
        expectedEventValues[1] = {
            element_id: 'gipp-nb-auto-rn-opt-out-close',
            event_action: 'Opting out',
            event_type: 'modal_close',
            event_value: 'close',
            ...additionalValues
        };
        const wrapper = await getMountedWrapper();

        // test
        const optoutlink = wrapper.find('.thanks-page__opt-out-link');
        optoutlink.at(0).simulate('click');

        const modal = wrapper.find('HDModal');
        await act(async () => modal.find('[data-testid="close-button"]').at(0).props().onClick({
            target: {
                value: {
                    label: 'Confirm'
                }
            }
        }));
        await act(async () => wrapper.update());

        expect(trackEvent).toHaveBeenNthCalledWith(1, expectedEventValues[0]);
        expect(trackEvent).toHaveBeenNthCalledWith(2, expectedEventValues[1]);

        // cleanup
        expectedEventValues[1] = tempStorage;
    });
});
