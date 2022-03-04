import React from 'react';
import { shallow } from 'enzyme';
import MaxDriverModal from '../MaxDriverModal';

const pageMetadata = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

describe('MaxDriverModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const headerText = 'You can only add up to five people as drivers for this car.';
    const id = 'maximum-driver-count-modal';

    const getWrapper = (props = {}) => shallow(
        <MaxDriverModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            onClose={onClose}
            headerText={headerText}
            pageMetadata={pageMetadata}
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
        const noDriverString = 'You can only add up to five people as drivers for this car.';
        const wrapper = shallow(
            <MaxDriverModal
                onCancel={onCancel}
                onConfirm={onConfirm}
                onClose={onClose}
                headerText=""
                pageMetadata={pageMetadata}
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
