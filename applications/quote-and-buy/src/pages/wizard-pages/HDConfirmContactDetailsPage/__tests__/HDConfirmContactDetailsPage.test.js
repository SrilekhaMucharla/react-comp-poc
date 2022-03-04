import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

import thunk from 'redux-thunk';
import HDConfirmContactDetailsPage from '../HDConfirmContactDetailsPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../__helpers__/testHelper';
import submission from '../../../../routes/SubmissionVMInitial';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import withTranslator from '../../__helpers__/test/withTranslator';

jest.mock('../../../../redux-thunk/actions/CustomizeQuote/updateMarketingPreference.action.js', () => ({
    updateMarketingPreference: jest.fn().mockReturnValue({ type: null }),
    clearMarketingPreference: jest.fn().mockReturnValue({ type: null })
}));

jest.mock('../../../Controls/Loader/useFullscreenLoader', () => ({
    __esModule: true,
    default: () => [jest.fn(), jest.fn(), jest.fn()],
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const updateMarketingPreferencesData = {
    marketingUpdatedObj: {
        quoteData: {
            offeredQuotes: { value: '' }
        },
        baseData: {
            brandCode: 'HD'
        }
    }
};

const pageMetadata = {
    page_name: 'ConfirmContactDetails'
};

let wrapper;

describe('<HDConfirmContactDetailsPage />', () => {
    createPortalRoot();
    beforeEach(() => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        // this is an workaround, submissionVM is too big to create SNAP
        const vehicle = _.get(submissionVM, vehiclePath);
        _.set(submission, vehiclePath, vehicle);
        const accountHolderPath = 'baseData.accountHolder';
        const emailField = 'emailAddress1';
        const driverEmailPath = `${accountHolderPath}.${emailField}.value`;
        // Set default values
        _.set(submission, driverEmailPath, 'test@test.com');
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
                }
            }
        };
        const store = mockStore(initialState);
        wrapper = mount(withTranslator(
            <ViewModelServiceContext.Provider value={viewModelService}>
                <Provider store={store}>
                    <HDConfirmContactDetailsPage pageMetadata={pageMetadata} updateMarketingPreferencesData={updateMarketingPreferencesData} />
                </Provider>
            </ViewModelServiceContext.Provider>
        ));
    });

    test('render component', () => {
        expect(wrapper).toHaveLength(1);
    });

    test('check email box', async () => {
        const buttonGroup = wrapper.find('HDCheckbox').at(0);
        const { path } = buttonGroup.props();
        const button = buttonGroup.find('ToggleButton').at(0);
        await act(async () => {
            button.props().onChange({
                target: {
                    value: true,
                    name: 'Text',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') return path;
                        return '';
                    }
                }
            });
        });
        await act(async () => wrapper.update());
        expect(wrapper).toMatchSnapshot();
    });

    test('check post box', async () => {
        const buttonGroup = wrapper.find('HDCheckbox').at(1);
        const { path } = buttonGroup.props();
        const button = buttonGroup.find('ToggleButton').at(0);
        await act(async () => {
            button.props().onChange({
                target: {
                    value: true,
                    name: 'Text',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') return path;
                        return '';
                    }
                }
            });
        });
        await act(async () => wrapper.update());
        expect(wrapper).toMatchSnapshot();
    });

    test('check text message box', async () => {
        const buttonGroup = wrapper.find('HDCheckbox').at(2);
        const { path } = buttonGroup.props();
        const button = buttonGroup.find('ToggleButton').at(0);
        await act(async () => {
            button.props().onChange({
                target: {
                    value: true,
                    name: 'Text',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') return path;
                        return '';
                    }
                }
            });
        });
        await act(async () => wrapper.update());
        expect(wrapper).toMatchSnapshot();
    });

    test('check post box', async () => {
        const buttonGroup = wrapper.find('HDCheckbox').at(3);
        const { path } = buttonGroup.props();
        const button = buttonGroup.find('ToggleButton').at(0);
        await act(async () => {
            button.props().onChange({
                target: {
                    value: true,
                    name: 'Text',
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') return path;
                        return '';
                    }
                }
            });
        });
        await act(async () => wrapper.update());
        expect(wrapper).toMatchSnapshot();
    });

    test('continue button click', async () => {
        const button = wrapper.find('HDButtonRefactor#continue-to-payment-button');
        await act(async () => {
            button.props().onClick();
        });
        await act(async () => wrapper.update());
        expect(wrapper).toMatchSnapshot();
    });
});
