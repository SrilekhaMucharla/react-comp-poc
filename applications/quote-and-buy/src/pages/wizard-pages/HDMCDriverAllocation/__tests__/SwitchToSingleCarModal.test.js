import React from 'react';
import { shallow } from 'enzyme';
import SwitchToSingleCarModal from '../SwitchToSingleCarModal';

describe('SwitchToSingleCarModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const id = 'switch-to-single-car-modal';

    const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

    const getWrapper = (props = {}) => shallow(
        <SwitchToSingleCarModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            onClose={onClose}
            show
            pageMetadata={pageMetadata}
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
