import React from 'react';
import { mount } from 'enzyme';
import { HDRibbon } from 'hastings-components';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import VehicleRibbon from '../VehicleRibbon';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import DeleteVehicleModal from '../../../HDMultiCarMilestonePage/DeleteVehicleModal';
import HDQuoteService from '../../../../api/HDQuoteService';
import multiCarSubmission from '../../../../routes/MCsubmissionMockTesting';

const middlewares = [];
// given
const mockedPush = jest.fn();
const isVehicleAdded = false;
const mockedRouterState = { isVehicleAdded };
const mockStore = configureStore(middlewares);
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockedPush
    }),
    useLocation: () => ({
        state: mockedRouterState
    })
}));
jest.mock('../../../../api/HDQuoteService');

const mockedVehicles = [
    { registrationsNumber: 'AV12BGE', make: '2012' },
    { registrationsNumber: 'S6TAY', make: '2013' }];
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockedVehicles
}));

const mockedSetState = jest.fn();
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: (init) => [init, mockedSetState]
}));

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));

const initializeStore = () => {
    const initialState = {
        wizardState: {
            app: {
                fromMCDriverAllocation: true
            },
        },
    };

    return mockStore(initialState);
};

async function initializeWrapper(store, props) {
    let wrapper;
    createPortalRoot();
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <VehicleRibbon {...props} />
            </Provider>
        );
    });

    HDQuoteService.updateMultiQuote.mockResolvedValue(multiCarSubmission);
    HDQuoteService.multiToSingleQuote.mockResolvedValue(multiCarSubmission);

    wrapper.update();
    return wrapper;
}

describe('RemoveVehicleRibbon', () => {
    // given

    it('should render correctly and match the snapshot', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDRibbon', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find(HDRibbon)).toHaveLength(1);
    });

    it('should contain VehicleRibbon', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find(VehicleRibbon)).toHaveLength(1);
    });

    it('should call onDelete function', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        wrapper.find('[className="vehicle-ribbon"]').simulate('click');
        expect(mockedSetState).toHaveBeenCalled();
    });

    it('should hide modal on confirm', async () => {
        const store = initializeStore();
        const wrapper = await initializeWrapper(store);
        wrapper.find('[className="vehicle-ribbon"]').simulate('click');
        // then
        await act(async () => wrapper.update());
        // then
        const modal = wrapper.find(DeleteVehicleModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        // then
        expect(modal.prop('show')).toBeFalsy();
    });
});
