import React from 'react';
import { shallow } from 'enzyme';
import DeleteDriverModal from '../DeleteDriverModal';

describe('DeleteDriverModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const driverName = 'driver name';
    const id = 'remove-driver-modal';

    const getWrapper = (props = {}) => shallow(
        <DeleteDriverModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            onClose={onClose}
            driverName={driverName}
            show
            {...props} />
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should display HDModal', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find(`#${id}`)).toHaveLength(1);
    });

    it('should contain driver name', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('span').text()).toContain(driverName);
    });

    it('should contain "this driver"', () => {
        // given
        const noDriverString = 'this driver';
        const wrapper = shallow(
            <DeleteDriverModal
                onCancel={onCancel}
                onConfirm={onConfirm}
                onClose={onClose}
                driverName=""
                show />
        );
        // then
        expect(wrapper.find('span').text()).toContain(noDriverString);
    });

    it('should pass functions to HDModal', () => {
        // given
        const wrapper = getWrapper();
        const modalProps = wrapper.find(`#${id}`).props();
        // then
        expect(modalProps.onCancel).toBe(onCancel);
        expect(modalProps.onClose).toBe(onClose);
        expect(modalProps.onConfirm).toBe(onConfirm);
    });
});
