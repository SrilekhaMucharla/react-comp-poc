import React from 'react';
import { shallow } from 'enzyme';
import DataSyncModal from '../DataSyncModal';

describe('DataSyncModal', () => {
    // given
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const syncSaveChanges = 'This will save any changes made to:';
    const id = 'data-sync-modal';
    const innerParagraphText = 'You won\'t be able to cancel these changes once they\'ve been saved.';
    const vehicleDetails = 'AV12BGE';
    const vehicleName = 'Test';

    const getWrapper = (props = {}) => shallow(
        <DataSyncModal
            onCancel={onCancel}
            onConfirm={onConfirm}
            onClose={onClose}
            syncSaveChanges={syncSaveChanges}
            innerParagraphText={innerParagraphText}
            vehicleDetails={vehicleDetails}
            vehicleName={vehicleName}
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

    it('should contain syncSaveChanges', () => {
        // given
        const wrapper = getWrapper();
        console.log(wrapper.debug());
        // then
        expect(wrapper.find('p').at(0).text()).toContain(syncSaveChanges);
    });

    it('should contain innerParagraphText', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('p').at(1).text()).toContain(innerParagraphText);
    });

    it('should contain vehicleDetails', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('div').at(0).text()).toContain(vehicleDetails);
    });

    it('should contain vehicleName', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('div').at(1).text()).toContain(vehicleName);
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
