import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import ToggleButton from 'react-bootstrap/ToggleButton';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';

// HD
import HDDriverLicenceTypePage from '../HDDriverLicenceTypePage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

describe('<HDDriverLicenceTypePage />', () => {
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

        const licenceTypeFieldname = 'licenceType.aspects.availableValues';
        const licenceTypePath = `${driverPath}.${licenceTypeFieldname}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, licenceTypePath);
        _.set(submission, licenceTypePath, aspects);

        // Set default values

        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
                },
                app: {
                    step: 1,
                    prevStep: 0,
                    pages: {
                        drivers: {
                            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        }
                    }
                },
            }
        };
        store = mockStore(initialState);
    });

    test('Render component', async () => {
        let wrapper;

        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        await act(async () => {
            wrapper = mount(withTranslator(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDDriverLicenceTypePage pageId="test-page" />
                    </Provider>
                </ViewModelServiceContext.Provider>
            ));
        });

        wrapper.update();

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click other options, and check dropdown', async () => {
        let wrapper;

        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        await act(async () => {
            wrapper = mount(withTranslator(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDDriverLicenceTypePage />
                    </Provider>
                </ViewModelServiceContext.Provider>
            ));
        });

        const { path } = wrapper.find('HDToggleButtonGroup')
            .props();
        const toggleButtons = wrapper.find(ToggleButton);

        // Simulate click on "Other' button
        await act(async () => {
            toggleButtons.at(3)
                .props()
                .onChange({
                    target: {
                        name: 'licenceType',
                        value: 'other',
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') {
                                return path;
                            }

                            return '';
                        }
                    }
                });
        });

        wrapper.update();

        expect(wrapper.find('#driver-licence-other-label').exists()).toEqual(true);

        expect(wrapper).toMatchSnapshot();
    });
});
