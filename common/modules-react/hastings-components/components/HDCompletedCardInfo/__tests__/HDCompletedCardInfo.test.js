import React from 'react';
import { shallow } from 'enzyme';
import HDCompletedCardInfo from '../HDCompletedCardInfo';

describe('HDCompletedCardInfo', () => {
    // given
    const text = 'test-text';
    const additionalText = 'test-additional-text';
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onEditKeyDown = jest.fn();
    const onDeleteKeyDown = jest.fn();


    const getWrapper = (props = {}) => shallow(
        <HDCompletedCardInfo
            text={text}
            additionalText={additionalText}
            onEdit={onEdit}
            onDelete={onDelete}
            onEditKeyDown={onEditKeyDown}
            onDeleteKeyDown={onDeleteKeyDown}
            variant="driver"
            {...props} />
    );

    it('should render correctly for driver variant and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly for car variant and match the snapshot', () => {
        // given
        const wrapper = getWrapper({ variant: 'car' });
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain icon', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__icon-main')).toHaveLength(1);
        expect(wrapper.find('.completed-info-card__tick')).toHaveLength(1);
    });

    it('should not contain icon for driver', () => {
        // given
        const wrapper = getWrapper({ variant: 'driver' });
        // then
        expect(wrapper.find('.completed-info-card__icon-main').props().alt).toBe('Driver');
    });


    it('should not contain icon for car', () => {
        // given
        const wrapper = getWrapper({ variant: 'car' });
        // then
        expect(wrapper.find('.completed-info-card__icon-main').props().alt).toBe('Car');
    });

    it('should contain text', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__main-text')).toHaveLength(1);
    });

    it('should contain additional text', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__additional-text')).toHaveLength(1);
    });

    it('should contian edit icon', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__icon-edit')).toHaveLength(1);
    });

    it('should call onEdit when edit icon clicked', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.completed-info-card__icon-edit').simulate('click');
        // then
        expect(onEdit).toHaveBeenCalled();
    });

    it('should call onEditKeyDown', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.completed-info-card__icon-edit').simulate('keyDown', { keyCode: 40 });
        // then
        expect(onEditKeyDown).toHaveBeenCalled();
    });

    it('should contian delete icon', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__icon-delete')).toHaveLength(1);
    });

    it('should call onDelete when edit icon clicked', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.completed-info-card__icon-delete').simulate('click');
        // then
        expect(onDelete).toHaveBeenCalled();
    });

    it('should call onDeleteKeyDown', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.completed-info-card__icon-delete').simulate('keyDown', { keyCode: 40 });
        // then
        expect(onDeleteKeyDown).toHaveBeenCalled();
    });


    it('should have default tabIndexes', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.completed-info-card__icon-edit').props().tabIndex).toBe(0);
        expect(wrapper.find('.completed-info-card__icon-delete').props().tabIndex).toBe(1);
    });

    it('should have proper tabIndexes passed', () => {
        const editIndex = 1;
        const deleteIndex = 3;
        // given
        const wrapper = getWrapper({ editTabIndex: editIndex, deleteTabIndex: deleteIndex });
        // then
        expect(wrapper.find('.completed-info-card__icon-edit').props().tabIndex).toBe(editIndex);
        expect(wrapper.find('.completed-info-card__icon-delete').props().tabIndex).toBe(deleteIndex);
    });
});
