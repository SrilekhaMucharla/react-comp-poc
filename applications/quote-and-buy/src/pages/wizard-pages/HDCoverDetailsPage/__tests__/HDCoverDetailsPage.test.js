/* eslint-disable no-console */
import React from 'react';
// import { HDButtonRefactor, HDLabelRefactor } from 'hastings-components';
import { Provider } from 'react-redux';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDCoverDetailsPage from '../HDCoverDetailsPage';
import submission from '../../../../routes/SubmissionVMInitial';
import * as messages from '../HDCoverDetails.messages';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

import CTM from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_compare-the-market.svg';
import CONFUSEDCOM from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_confused.com.svg';
import EXPERIAN from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_experian.svg';
import GOCOMPARE from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_go-compare.svg';
import MSM from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_money-super-market.svg';
import QUOTEZONE from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_quotezone.svg';
import USWITCH from '../../../../assets/images/logo/other-organisations-logo/hastings-direct_logos_u-switch.svg';
import withTranslator from '../../__helpers__/test/withTranslator';
import {
    HASTINGS_DIRECT,
    HASTINGS_ESSENTIAL,
    HASTINGS_PREMIER,
    PAYMENT_TYPE_MONTHLY_CODE,
    YOU_DRIVE
} from '../../../../constant/const';
import { coverTypeOptions } from '../const';

const middlewares = [];
const mockStore = configureStore(middlewares);

const setupStore = (store) => {
    let tempStore = store;
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );
    // Initialize mockstore with empty state
    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    // this is an workaround, submissionVM is too big to create SNAP
    const vehicle = _.get(submissionVM, vehiclePath);
    _.set(submission, vehiclePath, vehicle);
    const initialState = {
        wizardState: {
            data: {
                submissionVM: submission,
            },
            app: {
                step: 1,
                prevStep: 0
            },
        }
    };
    tempStore = mockStore(initialState);
    return tempStore;
};

const getWrapper = (store, mockRerate) => {
    return mount(withTranslator(
        <BrowserRouter>
            <Provider store={store}>
                <HDCoverDetailsPage
                    customizeSubmissionVM={mockRerate.result}
                    handleParentEvent={() => { }}
                    handleDowngrade={jest.fn()}
                    handleUpgrade={jest.fn()}
                    offeredQuotes={mockRerate.result.otherOfferedQuotes}
                    registrationNumber="AV12BGE" />
            </Provider>
        </BrowserRouter>
    ));
};

const getWrapperWithoutUD = (store, mockRerate) => {
    return mount(withTranslator(
        <BrowserRouter>
            <Provider store={store}>
                <HDCoverDetailsPage
                    customizeSubmissionVM={mockRerate.result}
                    offeredQuotes={mockRerate.result.otherOfferedQuotes}
                    handleParentEvent={() => { }}
                    registrationNumber="AV12BGE" />
            </Provider>
        </BrowserRouter>
    ));
};

// some of these tests should be rewritten
describe('<HDCoverDetailsPage />', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;

    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('clicking on "See full details" opens the popup', async () => {
        const button = wrapper.find('[className^="hd-overlay-btn"]').at(0);
        await act(async () => button.simulate('click'));
        wrapper.update();

        expect(document.getElementsByClassName('hd-modal-open').length).toBe(1);
    });
});

describe('<HDCoverDetailsPage /> branch hastingsDirect', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;

    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.quote.branchCode = HASTINGS_DIRECT;
        mockRerate.result.coverType = 'tpft';

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });

    // test('select "third party..." third party from dropdown list', async () => {
    //     const detailsButton = wrapper.find('[className="hd-overlay-btn"]').at(0);
    //     await act(async () => detailsButton.simulate('click'));
    //     wrapper.update();
    //     let dropdownList = wrapper.find('HDDropdownList').find('Select');

    //     await act(async () => {
    //         const eventValue = { event: { target: { value: coverTypeOptions[0] } } };
    //         dropdownList.props().onChange(eventValue);
    //     });
    //     wrapper.update();
    //     dropdownList = wrapper.find('HDDropdownList');

    //     expect(dropdownList.prop('value').label).toBe(coverTypeOptions[0].label);
    // });

    test('Had the downgrade button visible in details popup', async () => {
        const detailsButton = wrapper.find('[className^="hd-overlay-btn"]').at(0);
        await act(async () => {
            detailsButton.simulate('click');
        });
        wrapper.update();

        expect(wrapper.find('HDButtonRefactor').at(0).prop('hidden')).toBeFalsy();
    });
});

describe('<HDCoverDetailsPage /> producerCode hastingsPremier', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;

    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.quote.branchCode = HASTINGS_PREMIER;
        mockRerate.result.coverType = 'comprehensive';

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('Had the downgrade button visible in details popup', async () => {
        const detailsButton = wrapper.find('[className^="hd-overlay-btn"]').at(0);
        await act(async () => detailsButton.simulate('click'));
        wrapper.update();

        expect(wrapper.find('HDButtonRefactor').at(0).prop('hidden')).toBeFalsy();
    });

    test('starts with comprehensive from dropdown list', async () => {
        const detailsButton = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => detailsButton.simulate('click'));
        wrapper.update();

        const select = wrapper.find('HDDropdownList').find('Select');
        wrapper.update();

        expect(select.prop('value')).toBe(coverTypeOptions[0]);
    });

    // test('select "third party..." third party from dropdown list', async () => {
    //     const detailsButton = wrapper.find('[className="hd-overlay-btn"]').at(0);
    //     await act(async () => detailsButton.simulate('click'));
    //     wrapper.update();
    //     const dropdownList = wrapper.find('HDDropdownList').find('Select');

    //     await act(async () => {
    //         const eventValue = { event: { target: { value: coverTypeOptions[1] } } };
    //         dropdownList.simulate('click', eventValue);
    //     });
    //     wrapper.update();

    //     expect(dropdownList.prop('value').label).toBe(coverTypeOptions[1].label);
    // });
});

describe('<HDCoverDetailsPage /> insurancePaymentType does not equal 1', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.insurancePaymentType = PAYMENT_TYPE_MONTHLY_CODE;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', async () => {
        const button = wrapper.find('[className^="hd-overlay-btn"]').at(0);

        await act(async () => {
            button.simulate('click');
            wrapper.update();
        });

        expect(wrapper.find('HDCoverDetailsOverlay').prop('paymentTypeText')).toBe('Monthly');
    });
});

describe('<HDCoverDetailsPage /> periodStartDate equals " ', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.periodStartDate = { year: 2021, month: 5, day: 25 };
        mockRerate.result.periodEndDate = { year: 2022, month: 5, day: 25 };

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });
});

describe('<HDCoverDetailsPage /> starts with coverType TPFaT', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.quote.branchCode = HASTINGS_DIRECT;
        mockRerate.result.coverType = 'tpft';

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', () => {
        expect(wrapper).toHaveLength(1);
    });

    // test('select "comprehensiveBlock" from dropdown list', async () => {
    //     const button = wrapper.find('[className="hd-overlay-btn"]').at(0);
    //     await act(async () => button.props().onClick());
    //     wrapper.update();

    //     const dropdownList = wrapper.find('HDDropdownList');
    //     await act(async () => dropdownList.props().onChange({ target: { value: coverTypeOptions[0].value } }));
    //     wrapper.update();

    //     expect(dropdownList.prop('value')).toBe(coverTypeOptions[0]);
    // });
});

describe('<HDCoverDetailsPage /> producerCode hastingsEssential', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.quote.branchCode = HASTINGS_ESSENTIAL;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });
});

describe('<HDCoverDetailsPage /> producerCode hastingsYouDrive', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.quote.branchCode = YOU_DRIVE;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('render component cover details page', () => {
        expect(wrapper).toHaveLength(1);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals compareTheMarket', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.compareTheMarket;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(CTM);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals MSM', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.moneySupmarket;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(MSM);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals confusedCom', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.confusedCom;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(CONFUSEDCOM);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals goCompare', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.goCompare;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(GOCOMPARE);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals quoteZone', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.quoteZone;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(QUOTEZONE);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals uSwitch', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.uSwitch;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(USWITCH);
    });
});

describe('<HDCoverDetailsPage /> producerCode equals insurerGroup', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.insurerGroup;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });

    test('renders component', async () => {
        expect(wrapper.find('.cover-details__pcw-name').find('HDLabelRefactor').prop('text')).toBe('Insurer Group');
    });
});

describe('<HDCoverDetailsPage /> producerCode equals experian', () => {
    createPortalRoot();
    let store;
    let wrapper;
    let mockRerate;
    beforeEach(async () => {
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.producerCode = messages.experian;

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
    });
    test('renders component', async () => {
        expect(wrapper.find('[className="cover-details__logo--pcw"]').prop('src')).toBe(EXPERIAN);
    });
});

describe('<HDCoverDetailsPage /> without Upgrade Downgrade functions', () => {
    let store;
    let wrapper;
    let mockRerate;
    test('renders component without upgrade downgrade functions', async () => {
        createPortalRoot();
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.periodStartDate = { year: 2021, month: 5, day: 25 };
        mockRerate.result.periodEndDate = { year: 2022, month: 5, day: 25 };
        mockRerate.result.quote.branchCode = HASTINGS_DIRECT;
        mockRerate.result.quote.branchName = 'Hastings Direct';

        await act(async () => {
            wrapper = getWrapperWithoutUD(store, mockRerate);
        });
        const overlay = wrapper.find('[text="See full details"]');
        overlay.simulate('click');
        expect(wrapper.find('.cover-details__overlay-downgrade-btn-container')).toHaveLength(0);
        expect(wrapper.find('.cover-details__upgrade-container')).toHaveLength(0);
    });

    test('renders component with upgrade downgrade functions', async () => {
        createPortalRoot();
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.periodStartDate = { year: 2021, month: 5, day: 25 };
        mockRerate.result.periodEndDate = { year: 2022, month: 5, day: 25 };
        mockRerate.result.quote.branchCode = HASTINGS_DIRECT;
        mockRerate.result.quote.branchName = 'Hastings Direct';

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
        const overlay = wrapper.find('[text="See full details"]');
        overlay.simulate('click');
        expect(wrapper.find('[className^="cover-details__overlay-downgrade-btn-container"]')).toHaveLength(2);
    });

    test('renders component with upgrade downgrade functions', async () => {
        createPortalRoot();
        store = setupStore(store);
        mockRerate = require('../mock/mockRerate.json');
        mockRerate.result.periodStartDate = { year: 2021, month: 5, day: 25 };
        mockRerate.result.periodEndDate = { year: 2022, month: 5, day: 25 };
        mockRerate.result.quote.branchCode = HASTINGS_DIRECT;
        mockRerate.result.quote.branchName = 'Hastings Direct';
        mockRerate.result.otherOfferedQuotes[0].hastingsErrors = [];

        await act(async () => {
            wrapper = getWrapper(store, mockRerate);
        });
        const overlay = wrapper.find('[text="See full details"]');
        overlay.simulate('click');
        expect(wrapper.find('[className^="cover-details__overlay-downgrade-btn-container"]')).toHaveLength(2);
        expect(wrapper.find('[className^="cover-details__upgrade-container"]')).toHaveLength(2);
    });
});
