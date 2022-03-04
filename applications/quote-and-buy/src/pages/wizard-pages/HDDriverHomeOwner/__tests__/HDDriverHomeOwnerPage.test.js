import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import _ from 'lodash';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

// HD
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import HDDriverHomeOwnerPage from '../HDDriverHomeOwnerPage';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

describe('<HDDriverHomeOwnerPage />', () => {
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

        const accessToOtherVehicles = 'accessToOtherVehicles';
        const accessToOtherVehiclesPath = `${driverPath}.${accessToOtherVehicles}.aspects.availableValues`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, accessToOtherVehiclesPath);
        _.set(submission, accessToOtherVehiclesPath, aspects);

        // Set default values

        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
    });
    test('Render component', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDDriverHomeOwnerPage />
                </Provider>
            ));
        });

        wrapper.update();

        expect(wrapper)
            .toMatchSnapshot();
    });
});
