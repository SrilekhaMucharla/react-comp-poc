import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import { shallow } from 'enzyme';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

// HD
import HDAccountHolderDetailsPage from '../HDAccountHolderDetailsPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import updateDDI from '../../__helpers__/updateDDIVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

describe('<HDAccountHolderDetailsPage />', () => {
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const updateDDIVM = viewModelService.create(
            updateDDI,
            'pc',
            'com.hastings.edgev10.capabilities.payments.dto.request.DDIRequestDTO'
        );

        const payerAddress = 'payerAddress';

        // this is an workaround, submissionVM is too big to create SNAP
        const path = _.get(updateDDIVM, payerAddress);
        _.set(updateDDI, payerAddress, path);

        const payerDetails = 'payerDetails';

        // this is an workaround, submissionVM is too big to create SNAP
        const detailsPath = _.get(updateDDIVM, payerDetails);
        _.set(updateDDI, payerDetails, detailsPath);

        // Set default values

        const initialState = {
            wizardState: {
                data: {
                    updateDDIVM: updateDDI
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
            wrapper = shallow(withTranslator(
                <Provider store={store}>
                    <HDAccountHolderDetailsPage />
                </Provider>
            ));
        });

        wrapper.update();

        expect(wrapper)
            .toMatchSnapshot();
    });
});
