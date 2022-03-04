import React from 'react';
import { shallow } from 'enzyme';
import DeleteVehicleModal from '../DeleteVehicleModal';

describe('DeleteVehicleModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const driverName = 'This will remove this car';
    const id = 'remove-vehicle-modal';

    const getWrapper = (props = {}) => shallow(
        <DeleteVehicleModal
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
        expect(wrapper.find('p').text()).toContain(driverName);
    });

    it('should contain "this driver"', () => {
        // given
        const noDriverString = 'This will remove this car.';
        const wrapper = shallow(
            <DeleteVehicleModal
                onCancel={onCancel}
                onConfirm={onConfirm}
                onClose={onClose}
                driverName=""
                show />
        );
        // then
        expect(wrapper.find('p').text()).toContain(noDriverString);
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
