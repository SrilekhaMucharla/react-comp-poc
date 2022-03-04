import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import HDMCDriverAllocation from '../HDMCDriverAllocation';
import HDQuoteService from '../../../../api/HDQuoteService';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockedPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: ''
    }),
    useHistory: () => ({
        push: mockedPush
    }),
}));

const singleToMultiProduct = jest.spyOn(HDQuoteService, 'singleToMultiProduct').mockResolvedValue({});

const initializeStore = () => {
    const viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    const submissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    const mcSubmissionVM = viewModelService.create(
        mcSubmission.result,
        'pc',
        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
    );

    const initialState = {
        wizardState: {
            data: {
                submissionVM: submissionVM,
                mcsubmissionVM: mcSubmissionVM
            }
        },
        multiToSingleProductModel: {
            loading: false,
            multiToSingleQuoteError: null,
            multiToSingleQuoteObj: {}
        },
        singleToMultiProductModel: {
            loading: false,
            multiQuoteObj: {},
            quoteError: null
        },
        monetateModel: {
            loading: false,
            error: null,
            finished: true,
            resultData: [
                {
                    impressionReporting: [
                        {
                            is_control: false,
                            has_targets: true,
                            tags: [],
                            experience_type: '100% Experience',
                            experience_name: ':: CCX - 1.1 : MutiCar: HD_Website: Returning Visitors: MC True  - 5 Cars',
                            experience_id: 1468346,
                            experience_label: 'CCX-10-MutiCar-HD_Website_1468346',
                            variant_label: 'Experiment',
                            control_allocation: 0
                        }
                    ],
                    json: {
                        nCars: 5,
                        multiCar: true
                    },
                    actionType: 'monetate:action:OmnichannelJson',
                    actionId: 4015192,
                    isControl: false
                }
            ]
        }
    };

    return mockStore(initialState);
};

const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDMCDriverAllocation {...props} />
            </Provider>
        ));
    });
    wrapper.update();
    return wrapper;
}

const handleForward = jest.fn();

const props = {
    pageMetadata: pageMetadata,
    handleForward: handleForward,
    history: {
        location: {
            state: ''
        },
        push: jest.fn(),
        goBack: jest.fn()
    }
};

describe('<HDMCDriverAllocation />', () => {
    it('should render component', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        expect(wrapper).toHaveLength(1);
    });
    it('should handleForward when add another driver button is clicked', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const button = wrapper.find('.mc-driver-allocation__add-another-driver-btn').at(0);
        button.simulate('click');
        wrapper.update();
        expect(handleForward).toHaveBeenLastCalledWith({
            driverIndex: 1,
            isDriverEdit: false,
            isPolicyHolder: false,
            removeDriver: false,
        });
    });
    it('should handleForward when add another car button is clicked', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const button = wrapper.find('.mc-driver-allocation__add-another-car-btn').at(0);
        button.simulate('click');
        wrapper.update();
        expect(handleForward).toHaveBeenLastCalledWith({
            driverIndex: 1,
            isDriverEdit: false,
            isPolicyHolder: false,
            removeDriver: false,
        });
        expect(singleToMultiProduct).toHaveBeenLastCalledWith(submission);
    });
    it('should show modal when continue with single car button is clicked', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const button = wrapper.find('.mc-driver-allocation__cont-single-car-btn').at(0);
        button.simulate('click');
        wrapper.update();
        expect(handleForward).toHaveBeenLastCalledWith({
            driverIndex: 1,
            isDriverEdit: false,
            isPolicyHolder: false,
            removeDriver: false,
        });
        expect(wrapper.find('SwitchToSingleCarModal').props().show).toBeTruthy();
    });
    it('should handleForward after SwitchToSingleCarModal confirm', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const button = wrapper.find('.mc-driver-allocation__cont-single-car-btn').at(0);
        button.simulate('click');
        wrapper.update();
        const confirmButton = wrapper.find('SwitchToSingleCarModal').find('HDButtonRefactor').at(1);
        confirmButton.simulate('click');
        await act(async () => wrapper.update());
        expect(handleForward).toHaveBeenLastCalledWith();
    });
    it('should handleForward after clicking on edit', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const button = wrapper.find('.completed-info-card__icon-edit').at(0);
        button.simulate('click');
        wrapper.update();
        expect(handleForward).toHaveBeenLastCalledWith({ isDriverEdit: false, isVehicleEdit: true });
    });
    it('should render continue buttons in correct order', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store, props);
        const buttons = wrapper.find('HDButtonRefactor');
        expect(buttons.at(0).prop('label')).toBe('No, add my next car');
        expect(buttons.at(1).prop('label')).toBe('Yes, add another driver');
    });
});
