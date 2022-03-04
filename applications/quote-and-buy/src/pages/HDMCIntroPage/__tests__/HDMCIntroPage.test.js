import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import { Provider } from 'react-redux';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import configureStore from 'redux-mock-store';
import productMetadata from '../../../generated/metadata/product-metadata.json';
import defaultTranslator from '../../wizard-pages/__helpers__/testHelper';
import HDMCIntroPage from '../HDMCIntroPage';
import { INTRO } from '../../../routes/BaseRouter/RouteConst';
import mockSubmission from '../../../routes/SubmissionVMInitial';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
let wrapper;
describe('<HDMCIntroPage />', () => {
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            mockSubmission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const yearsLivedAtCurrentAddressFieldName = 'yearsLivedAtCurrentAddress.aspects.availableValues';
        const yearsLivedAtCurrentAddressPath = `${driverPath}.${yearsLivedAtCurrentAddressFieldName}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, yearsLivedAtCurrentAddressPath);
        _.set(mockSubmission, yearsLivedAtCurrentAddressPath, aspects);
        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: mockSubmission
                },
                app: {
                    step: 1,
                    prevStep: 0
                }
            },
            singleToMultiProductModel: {
                multiQuoteObj: {},
                loading: false,
                quoteError: null
            }
        };
        store = mockStore(initialState);
    });

    test('render component', () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should render button for back functionality', () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage />
            </Provider>
        );
        expect(wrapper.find('#backNavMain')).toBeTruthy();
    });

    test('should render two <HDButtonRefactor />', () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage />
            </Provider>
        );
        expect(wrapper.find('HDButtonRefactor')).toHaveLength(3);
    });

    test('button at index 0 is not disabled', () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage />
            </Provider>
        );
        expect(wrapper.find('HDButtonRefactor').at(0).prop('disabled')).toBeFalsy();
    });

    test('button at index 1 is not disabled', () => {
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage />
            </Provider>
        );
        expect(wrapper.find('HDButtonRefactor').at(1).prop('disabled')).toBeFalsy();
    });

    test('button at index 1 is clicked after coming from INTRO', () => {
        const historyMock = { history: { location: { state: { fromPage: INTRO } }, push: jest.fn() } };
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage {...historyMock} />
            </Provider>
        );
        wrapper.find('HDButtonRefactor').at(1).simulate('click');
        expect(historyMock.history.push).toHaveBeenCalled();
    });

    test('button at index 1 is clicked after coming from screen other than INTRO', () => {
        const historyMock = { history: { location: { state: { fromPage: 'other screen' } }, push: jest.fn(), goBack: jest.fn() } };
        wrapper = mount(
            <Provider store={store}>
                <HDMCIntroPage {...historyMock} />
            </Provider>
        );
        wrapper.find('HDButtonRefactor').at(2).simulate('click');
        expect(historyMock.history.push).toHaveBeenCalled();
    });
});
