import React from 'react';
import { mount } from 'enzyme';
import HDPriceTable from '../HDPriceTable';
import { priceTablePillLinkAnnualNoMonthly, priceTablePriceTotal1, priceTablePriceTotal2 } from '../HDPriceTable.messages';
import * as mcSubmission from '../../../../../../applications/quote-and-buy/src/routes/mockMCSubmissionQuoted.json';
import * as multiCustomizeSubmission from '../../../../../../applications/quote-and-buy/src/routes/mockMultiCustomizeSubmissionVM.json';
import mockPaymentSchedule from '../../../../../../applications/quote-and-buy/src/pages/wizard-pages/HDMCThanksPage/mock/mockMCPSnormal.json';

const defaultProps = {
    general: {
        paymentTotalCredit: '£5003.78',
        paymentTotalCreditCharge: '£5003.78',
        paymentTotalBase: '£4354.89',
        instalmentsTotal: {
            count: 11,
            value: '£309.57',
            paymentInitial: '£309.57'
        },
        rateOfInterest: '14.9%',
        representativeApr: '29.9%',
    },
    quotes: [],
    mcsubmissionVM: {
        value: mcSubmission.result
    },
    multiCustomizeSubmissionVM: {
        value: multiCustomizeSubmission.result
    },
    mcPaymentScheduleModel: {
        mcPaymentScheduleObject: mockPaymentSchedule.result
    }
};

const setup = (additionalProps = {}) => {
    const props = { ...defaultProps, ...additionalProps };

    return mount(<HDPriceTable {...props} />);
};

const findByTestAttribute = (wrapper, selector) => wrapper.find(`[data-testid='${selector}']`);

describe('<HDPriceTable />', () => {
    let component;

    describe('Deferred payments scenario', () => {
        const quotes = [{
            id: '0000005401',
            label: 'AV12 BGE',
            name: 'BMW M6',
            startDate: '17/3/2021',
            daysInsured: 365,
            paymentBase: '£2112.27',
            paymentCredit: null,
            isDeferred: true,
            ancillaries: [{
                name: 'mock',
                value: '£100.77'
            }],
            instalments: {
                count: 3,
                value: '£202.25',
                paymentInitial: '£202.25'
            },
            basePolicyPayment: {
                amount: 121.25,
                currency: '£'
            }
        }, {
            label: 'DA61 UEG',
            id: '0000005402',
            name: 'FIAT 126p',
            startDate: '17/3/2021',
            daysInsured: 365,
            paymentBase: '£1121.31',
            paymentCredit: null, // no direct debit
            isDeferred: true,
            ancillaries: [],
            instalments: {
                count: 8,
                value: '£107.32',
                paymentInitial: '£107.32'
            },
            basePolicyPayment: {
                amount: 121.25,
                currency: '£'
            }
        }];

        beforeAll(() => {
            component = setup({ quotes });
        });

        afterAll(() => {
            component.unmount();
        });

        it('should display split payments for < 3 quotes', () => {
            const priceElements = findByTestAttribute(component, 'nav-price');
            expect(priceElements.length).toBe(quotes.length);
        });

        it('should display combined payment element for > 2 quotes', () => {
            const quote = {
                label: 'DA61 UEG',
                id: '0000005401',
                name: 'FIAT 126p',
                startDate: '17/3/2021',
                daysInsured: 365,
                paymentBase: '£1121.31',
                paymentCredit: null, // no direct debit
                isDeferred: true,
                ancillaries: [],
                instalments: {
                    count: 8,
                    value: '£107.32',
                    paymentInitial: '£107.32'
                },
                basePolicyPayment: {
                    amount: 121.25,
                    currency: '£'
                }
            };

            const newQuotes = [...quotes, quote];
            component = setup({ quotes: newQuotes });

            const priceBlock = findByTestAttribute(component, 'nav-price');
            expect(priceBlock.length).toBe(2);
        });

        it('should display total price for x products text for > 2 quotes', () => {
            const quote = {
                label: 'DA61 UEG',
                id: '0000005401',
                name: 'FIAT 126p',
                startDate: '17/3/2021',
                daysInsured: 365,
                paymentBase: '£1121.31',
                paymentCredit: null,
                ancillaries: [],
                instalments: {
                    count: 8,
                    value: '£107.32',
                    paymentInitial: '£107.32'
                },
                basePolicyPayment: {
                    amount: 121.25,
                    currency: '£'
                }
            };

            const newQuotes = [...quotes, quote];
            const quoteCount = newQuotes.length;
            const expectedText = (`${priceTablePriceTotal1} ${quoteCount} ${priceTablePriceTotal2}`);

            const totalPriceText = findByTestAttribute(component, 'quote-count-text').text();
            expect(totalPriceText).toEqual(expectedText);
        });
    });

    describe('No Direct Debit (affordability failed) scenario', () => {
        const quotes = [{
            label: 'AV12 BGE',
            id: '0000005401',
            name: 'BMW M6',
            startDate: '17/3/2021',
            daysInsured: 365,
            paymentBase: '£2112.27',
            paymentCredit: null,
            ancillaries: [{
                name: 'mock',
                value: '£100.77'
            }],
            instalments: {
                count: 3,
                value: '£202.25',
                paymentInitial: '£202.25'
            },
            basePolicyPayment: {
                amount: 121.25,
                currency: '£'
            }
        }, {
            label: 'DA61 UEG',
            id: '0000005402',
            name: 'FIAT 126p',
            startDate: '17/3/2021',
            daysInsured: 365,
            paymentBase: '£1121.31',
            paymentCredit: null,
            ancillaries: [],
            instalments: {
                paymentInitial: '£107.32'
            },
            basePolicyPayment: {
                amount: 121.25,
                currency: '£'
            }

        }];

        beforeEach(() => {
            component = setup({ quotes });
        });

        afterEach(() => {
            component.unmount();
        });


        it('should hide monthly pill', () => {
            const monthlyPill = findByTestAttribute(component, 'nav-monthly');
            expect(monthlyPill.length).toBe(0);
        });

        it('should display why direct debit is not available text', () => {
            const childrenText = findByTestAttribute(component, 'nav-link').render().text();
            expect(childrenText).toEqual(priceTablePillLinkAnnualNoMonthly);
        });
    });

    describe('No ancillaries scenario', () => {
        const quotes = [{
            label: 'AV12 BGE',
            id: '0000005401',
            name: 'BMW M6',
            startDate: '17/3/2021',
            daysInsured: 365,
            paymentBase: '£2112.27',
            paymentCredit: null,
            paymentCreditCharge: null,
            ancillaries: [],
            instalments: {
                count: 3,
                value: '£202.25',
                paymentInitial: '£202.25'
            },
            basePolicyPayment: {
                amount: 121.25,
                currency: '£'
            }
        }];

        beforeEach(() => {
            component = setup({ quotes });
        });

        afterEach(() => {
            component.unmount();
        });

        it('should correctly pass arrow hidden prop to subcomponent', () => {
            const subcomponent = findByTestAttribute(component, 'nav-annual');
            expect(subcomponent.props().isArrowHidden).toBeTruthy();
        });

        it('initially should hide payment summary', () => {
            const paymentSummary = findByTestAttribute(component, 'payment-summary');
            expect(paymentSummary.length).toBe(0);
        });
    });
});
