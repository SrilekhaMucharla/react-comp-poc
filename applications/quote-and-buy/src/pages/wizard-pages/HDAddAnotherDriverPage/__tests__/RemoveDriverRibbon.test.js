import React from 'react';
import { shallow, mount } from 'enzyme';
import { HDRibbon } from 'hastings-components';
import RemoveDriverRibbon from '../RemoveDriverRibbon';
import DeleteDriverModal from '../DeleteDriverModal';

// given
const mockedPush = jest.fn();
const isPolicyHolder = false;
const mockedRouterState = { isPolicyHolder };
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockedPush
    }),
    useLocation: () => ({
        state: mockedRouterState
    })
}));

const mockedDrivers = [
    { firstName: 'David', lastName: 'Bowie' },
    { firstName: 'Johnny', lastName: 'Cash' }];
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockedDrivers
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

describe('RemoveDriverRibbon', () => {
    // given
    const getShallowWrapper = () => shallow(<RemoveDriverRibbon />);
    const getMountWrapper = () => mount(<RemoveDriverRibbon />);

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getShallowWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDRibbon', () => {
        // given
        const wrapper = getShallowWrapper();
        // then
        expect(wrapper.find(HDRibbon)).toHaveLength(1);
    });
    it('should contain DeleteDriverModal', () => {
        // given
        const wrapper = getShallowWrapper();
        // then
        expect(wrapper.find(DeleteDriverModal)).toHaveLength(1);
    });

    it('should call onDelete function', () => {
        // given
        const wrapper = getMountWrapper();
        // when
        wrapper.find('[data-testid="action-button"]').simulate('click');
        // then
        expect(mockedSetState).toHaveBeenCalledWith(true);
    });

    it('should hide modal on confirm', async () => {
        // given
        const wrapper = getMountWrapper();
        // when
        wrapper.find('[data-testid="action-button"]').simulate('click');
        // then
        await act(async () => wrapper.update());
        // then
        const modal = wrapper.find(DeleteDriverModal);
        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());
        // then
        expect(modal.prop('show')).toBeFalsy();
    });
});
