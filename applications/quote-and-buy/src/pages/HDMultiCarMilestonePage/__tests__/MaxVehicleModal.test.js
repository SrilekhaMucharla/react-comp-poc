import React from 'react';
import { shallow } from 'enzyme';
import MaxVehicleModal from '../MaxVehicleModal';

describe('MaxVehicleModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const headerText = 'You\'ve reached the maximum amount of cars.';
    const id = 'maximum-vehicle-count-modal';

    const getWrapper = (props = {}) => shallow(
        <MaxVehicleModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            onClose={onClose}
            headerText={headerText}
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
        expect(wrapper.find('span').text()).toContain(headerText);
    });

    it('should contain "this driver"', () => {
        // given
        const noDriverString = 'You\'ve reached the maximum amount of cars.';
        const wrapper = shallow(
            <MaxVehicleModal
                onCancel={onCancel}
                onConfirm={onConfirm}
                onClose={onClose}
                headerText=""
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
