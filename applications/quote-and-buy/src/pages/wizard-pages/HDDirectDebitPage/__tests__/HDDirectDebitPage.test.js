import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';
// import { HastingsPaymentService } from 'hastings-capability-payment';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HDDropdownList } from 'hastings-components';
import {
    setSubmissionVM as setSubmissionVMAction,
    setCustomizeSubmissionVM as setCustomizeSubmissionVMAction
} from '../../../../redux-thunk/actions';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../mock/mockSubmission.json';
import HDDirectDebitPage from '../HDDirectDebitPage';
import rootReducer from '../../../../redux-thunk/reducers/index';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import withTranslator from '../../__helpers__/test/withTranslator';
import * as accountHolderDetailsMessages from '../HDAccountHolderDetails.messages';

jest.mock('hastings-capability-addresslookup');
jest.mock('../PaymentBreakdownMonthly.js', () => jest.fn().mockReturnValue([
    {
        id: 1,
        circle: {
            type: 'violet',
            date: { day: 1, shortMonth: 2 }
        },
        description: {
            label: ['TEST123'],
            name: ['TEST123'],
            quote: { single: '£12' },
            tooltip: jest.fn()
        }
    }, {
        id: 2,
        circle: {
            date: { day: 1, shortMonth: 2 }
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
    },
    {
        id: 7,
        circle: {
            date: { day: 1, shortMonth: 2 }
        },
        description: {
            tooltip: jest.fn()
        }
    }
]));
const mockCovers = require('../mock/mockRerate.json');

let submissionVM;
let customizeSubmissionVM;

const addressLookupResponse = {
    result: {
        matches: [
            {
                matchAccuracy: 0.7,
                address: {
                    addressLine1: '1 Westbourne Court',
                    addressLine2: 'Cooden Drive',
                    addressLine3: '',
                    city: 'BEXHILL-ON-SEA',
                    county: 'East Sussex',
                    postalCode: 'TN393AA'
                }
            }
        ]
    }
};

// const updateDDIResponse = {
//     result: {
//         isUpdated: true,
//         isGreyListed: false
//     }
// };

const customQuoteData = {
    customUpdatedQuoteObj: {
        quote: '',
        quoteID: '',
        sessionUUID: '',
        periodStartDate: '',
        periodEndDate: '',
        coverType: 'comprehensive',
        voluntaryExcess: '',
        ncdgrantedYears: '',
        ncdgrantedProtectionInd: '',
        producerCode: '',
        insurancePaymentType: '3',
        otherOfferedQuotes: '',
        coverages: '',
    },
    loading: false
};

const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 */
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

function createInitialState() {
    submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    customizeSubmissionVM = viewModelService.create(
        mockCovers.result,
        'pc',
        'edgev10.capabilities.quote.submission.dto.CustomQuoteDTO'
    );

    const initialState = {
        customQuoteModel: customQuoteData,
        offeredQuoteModel: submission.quoteData,
        wizardState: {
            data: {
                submissionVM: submissionVM,
                customizeSubmissionVM: customizeSubmissionVM
            },
            app: {
                step: 1,
                prevStep: 0
            },
        }
    };
    return initialState;
}

// actual store (e.g., to test behaviour relying on state changes through dispatch)
function initializeRealStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
    return store;
}

async function pickAddressFromDropdownList(wrapper, option) {
    await act(async () => {
        wrapper.findWhere((n) => n.type() === HDDropdownList && n.prop('name') === 'payerAddressPath').find('Select').invoke('onChange')(option);
    });
    wrapper.update();
}

describe('<HDDirectDebitPage />', () => {
    let wrapper;

    createPortalRoot();
    HastingsAddressLookupService.lookupAddressByPostCode.mockResolvedValue(addressLookupResponse);
    // HastingsPaymentService.updateDDI.mockResolvedValueOnce(updateDDIResponse);

    const pageMetadata = {
        page_name: 'DirectDebit'
    };

    beforeEach(async () => {
        const store = initializeRealStore();

        await act(async () => {
            wrapper = mount(withTranslator(
                <Router>
                    <ViewModelServiceContext.Provider value={viewModelService}>
                        <Provider store={store}>
                            <HDDirectDebitPage
                                submissionVM={submissionVM}
                                setSubmissionVM={setSubmissionVMAction}
                                setCustomizeSubmissionVM={setCustomizeSubmissionVMAction}
                                offeredQuoteObject={submission.quoteData}
                                customQuoteData={customQuoteData}
                                customizeSubmissionVM={customizeSubmissionVM}
                                pageMetadata={pageMetadata} />
                        </Provider>
                    </ViewModelServiceContext.Provider>
                </Router>
            ));
        });
        wrapper.update();
    });
    test('render component', () => {
        expect(wrapper).toHaveLength(1);
    });

    test.skip('Enter postcode', async () => {
        const input = wrapper.find('[name="postcode"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'SW1A'
        ));
        wrapper.update();

        expect(wrapper.find('[className="invalid-field"]')).toHaveLength(0);
    });

    test('Enter postcode and select address', async () => {
        const input = wrapper.find('[name="postcode"]').at(0);
        const postCode = 'SW1A';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), postCode
        ));
        wrapper.update();

        await pickAddressFromDropdownList(wrapper, '0');

        expect(wrapper.find('[className="invalid-field"]')).toHaveLength(0);
    });

    test.skip('Enter postcode, select address and click on button to lookup address successfully', async () => {
        const input = wrapper.find('[name="postcode"]').at(0);
        const postCode = 'SW1A';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), postCode
        ));
        wrapper.update();

        await pickAddressFromDropdownList(wrapper, '0');

        const button = wrapper.find('HDButtonRefactor').at(1);
        HastingsAddressLookupService.lookupAddressByPostCode.mockResolvedValueOnce(addressLookupResponse);
        await act(async () => button.props().onClick());
        wrapper.update();
        expect(wrapper.find('.error-container HDAlert').props()).toHaveProperty('message', null);
    });

    test.skip('Enter postcode, select address and click on button to lookup address and catch error', async () => {
        const input = wrapper.find('[name="postcode"]').at(0);
        const postCode = 'SW1A';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), postCode
        ));
        wrapper.update();

        await pickAddressFromDropdownList(wrapper, '0');

        const button = wrapper.find('HDButtonRefactor').at(1);

        HastingsAddressLookupService.lookupAddressByPostCode.mockRejectedValueOnce();
        await act(async () => button.props().onClick());
        wrapper.update();

        expect(wrapper.find('.error-container HDAlert').props()).toHaveProperty('message', accountHolderDetailsMessages.postcodeValidationMessage);
    });
});
