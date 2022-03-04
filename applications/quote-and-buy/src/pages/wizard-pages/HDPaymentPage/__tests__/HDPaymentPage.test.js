import { shallow } from 'enzyme';
import { Provider, useSelector } from 'react-redux';
import { HastingsPaymentService } from 'hastings-capability-payment';
import React from 'react';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import HDQuoteService from '../../../../api/HDQuoteService';
import { HDPaymentPage } from '../HDPaymentPage';
import bindAndIssueMock from '../bindAndIssueMock';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import {
    PAYMENT_TYPE_ANNUALLY_CODE,
    PAYMENT_TYPE_MONTHLY_CODE
} from '../../../../constant/const';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import worldpay from '../../../../customer/directintegrations/worldpay/worldpay';

const mockStore = configureStore([]);
jest.mock('hastings-capability-payment');
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../../../customer/directintegrations/worldpay/worldpay');

const submissionVM = {
    value: {
        quoteId: '1200098',
        sessionUUID: '34423-3432-34f34',
        mpwrapperNumber: '1200098',
        quotes: [{
            baseData: {}
        }]
    },
    baseData: {
        accountHolder: {
            value: {
                dateOfBirth: '01/01/1992'
            }
        }
    }
};

const mcsubmissionVM = {
    value: {
        quotes: [{
            baseData: {}
        }]
    }
};

const customizeSubmissionVM = {
    value: {
        quoteId: '1200098',
        sessionUUID: '34423-3432-34f34',
        mpwrapperNumber: '1200098',
        insurancePaymentType: '1',
        customQuotes: [{
            periodStartDate: new Date('01/01/2021'),
            quote: {
                hastingsPremium: {
                    monthlyPayment: {
                        firstInstalment: {
                            value: {
                                amount: 40.01,
                                currency: 'gbp'
                            }
                        }
                    },
                    annuallyPayment: {
                        premiumAnnualCost: {
                            value: {
                                amount: 405.01,
                                currency: 'gbp'
                            }
                        }
                    }
                }
            }
        }]
    },
    quote: {
        hastingsPremium: {
            monthlyPayment: {
                firstInstalment: {
                    value: {
                        amount: 40.01,
                        currency: 'gbp'
                    }
                }
            },
            annuallyPayment: {
                premiumAnnualCost: {
                    value: {
                        amount: 405.01,
                        currency: 'gbp'
                    }
                }
            }
        }
    }
};
const state = {
    wizardState: {
        app: {
            multiCarFlag: true
        },
        data: {
            submissionVM: submissionVM,
            mcsubmissionVM: mcsubmissionVM
        }
    }
};

const store = mockStore(state);

describe('<HDPaymentPage />', () => {
    createPortalRoot();

    beforeEach(() => {
        worldpay.mockImplementation((arg, resultCallback) => {
            resultCallback({
                order: {
                    status: 'success'
                },
                gateway: {
                    paymentStatus: ''
                }
            });
        });

        useSelector.mockImplementation((callback) => {
            return callback(store);
        });
    });

    const mcPaymentSchedule = {
        mcPaymentScheduleObject: null,
        mcPaymentScheduleError: null,
        loading: false
    };

    const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'single_car' };

    const getWrapper = async () => {
        let wrapper;
        await act(async () => {
            const viewModelService = ViewModelServiceFactory.getViewModelService(
                productMetadata, defaultTranslator
            );
            wrapper = mount(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDPaymentPage
                            submissionVM={submissionVM}
                            customizeSubmissionVM={customizeSubmissionVM}
                            mcPaymentSchedule={mcPaymentSchedule}
                            pageMetadata={pageMetadata}
                            paymentType={PAYMENT_TYPE_ANNUALLY_CODE} />
                    </Provider>
                </ViewModelServiceContext.Provider>
            );
            wrapper.update();
        });

        return wrapper;
    };

    test('render component', () => {
        const wrapper = shallow((
            <HDPaymentPage
                submissionVM={submissionVM}
                customizeSubmissionVM={customizeSubmissionVM}
                mcPaymentSchedule={mcPaymentSchedule}
                pageMetadata={pageMetadata}
                paymentType={PAYMENT_TYPE_MONTHLY_CODE} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('load Worldpay iframe', async () => {
        const mockOrderCode = {
            result: 'test_0001'
        };

        const mockHostedPaymentURL = {
            result: {
                orderCode: 'test_0001',
                referenceID: '3249664563',
                referenceValue: 'https://worldpay_url',
                merchantCode: 'MERCHANT_CODE'
            }
        };

        HastingsPaymentService.fetchOrderCode.mockResolvedValue(mockOrderCode);
        HastingsPaymentService.fetchOrderCodeMP.mockResolvedValue(mockOrderCode);
        HastingsPaymentService.fetchHostedPaymentURL.mockResolvedValue(mockHostedPaymentURL);
        jest.spyOn(HDQuoteService, 'bindAndIssueService').mockResolvedValue(bindAndIssueMock);

        const wrapper = await getWrapper();

        const worldpayDiv = wrapper.find('#worldpay');

        expect(worldpayDiv).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    test('show error when bind and issue service wasn\'t successful', async () => {
        jest.spyOn(HDQuoteService, 'bindAndIssueService').mockRejectedValue(new Error());

        const wrapper = await getWrapper();

        const errorBox = wrapper.find('.error-box').at(0);

        expect(errorBox).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    test('show error when fetching order code wasn\'t successful', async () => {
        HastingsPaymentService.fetchOrderCode.mockRejectedValue(new Error());

        const wrapper = await getWrapper();

        const errorBox = wrapper.find('.error-box').at(0);

        expect(errorBox).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    test('show error when fetching hosted payment url wasn\'t successful', async () => {
        const mockOrderCode = {
            result: 'test_0001'
        };

        const mockHostedPaymentURL = {
            result: {
                errors: [
                    {
                        technicalErrorCode: 5,
                        publicErrorMessage: 'Duplicate order'
                    }
                ]
            }
        };

        HastingsPaymentService.fetchOrderCode.mockResolvedValue(mockOrderCode);
        HastingsPaymentService.fetchHostedPaymentURL.mockResolvedValue(mockHostedPaymentURL);

        const wrapper = await getWrapper();

        const errorBox = wrapper.find('.error-box').at(0);

        expect(errorBox).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
describe('<HDPaymentPage /> MultiCar', () => {
    createPortalRoot();

    beforeEach(() => {
        worldpay.mockImplementation((arg, resultCallback) => {
            resultCallback({
                order: {
                    status: 'success'
                },
                gateway: {
                    paymentStatus: ''
                }
            });
        });

        useSelector.mockImplementation((callback) => {
            return callback(store);
        });
    });

    const mcPaymentSchedule = {
        mcPaymentScheduleObject: null,
        mcPaymentScheduleError: null,
        loading: false
    };

    const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'single_car' };

    const getWrapper = async () => {
        let wrapper;
        await act(async () => {
            const viewModelService = ViewModelServiceFactory.getViewModelService(
                productMetadata, defaultTranslator
            );
            wrapper = mount(withTranslator(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDPaymentPage
                            submissionVM={submissionVM}
                            customizeSubmissionVM={customizeSubmissionVM}
                            mcPaymentSchedule={mcPaymentSchedule}
                            pageMetadata={pageMetadata}
                            multiCarFlag
                            paymentType={PAYMENT_TYPE_ANNUALLY_CODE} />
                    </Provider>
                </ViewModelServiceContext.Provider>
            ));
            wrapper.update();
        });

        return wrapper;
    };

    test('render component', () => {
        const wrapper = shallow((
            <HDPaymentPage
                submissionVM={submissionVM}
                customizeSubmissionVM={customizeSubmissionVM}
                mcPaymentSchedule={mcPaymentSchedule}
                pageMetadata={pageMetadata}
                paymentType={PAYMENT_TYPE_MONTHLY_CODE} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('load Worldpay iframe', async () => {
        const mockOrderCode = {
            result: 'test_0001'
        };

        const mockHostedPaymentURL = {
            result: {
                orderCode: 'test_0001',
                referenceID: '3249664563',
                referenceValue: 'https://worldpay_url',
                merchantCode: 'MERCHANT_CODE'
            }
        };

        HastingsPaymentService.fetchOrderCode.mockResolvedValue(mockOrderCode);
        HastingsPaymentService.fetchOrderCodeMP.mockResolvedValue(mockOrderCode);
        HastingsPaymentService.fetchHostedPaymentURL.mockResolvedValue(mockHostedPaymentURL);
        jest.spyOn(HDQuoteService, 'bindAndIssueService').mockResolvedValue(bindAndIssueMock);

        const wrapper = await getWrapper();

        const worldpayDiv = wrapper.find('#worldpay');

        expect(worldpayDiv).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
