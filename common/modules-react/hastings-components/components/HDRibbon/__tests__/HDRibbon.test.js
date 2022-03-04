import React from 'react';
import { shallow } from 'enzyme';
import HDRibbon from '../HDRibbon';

describe('HDRibbon', () => {
    // given
    const onClick = jest.fn();
    const onKeyDown = jest.fn();
    const text = 'Robert Kubica';
    const actionText = 'Remove driver';

    const getWrapper = (props = {}) => shallow(
        <HDRibbon
            text={text}
            actionText={actionText}
            onClick={onClick}
            onKeyDown={onKeyDown}
            {...props} />
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain text', () => {
        // given
        const wrapper = getWrapper();
        const element = wrapper.find('.text');
        // then
        expect(element).toHaveLength(1);
        expect(element.text()).toBe(text);
    });
    it('should action button', () => {
        // given
        const wrapper = getWrapper();
        const element = wrapper.find('.action');
        // then
        expect(element).toHaveLength(1);
        expect(element.text()).toBe(actionText);
    });

    it('should not contain text when not provided', () => {
        // given
        const wrapper = getWrapper({ text: null });
        // then
        expect(wrapper.find('.text')).toHaveLength(0);
    });

    it('should not contain action button when action text not provided', () => {
        // given
        const wrapper = getWrapper({ actionText: null });
        // then
        expect(wrapper.find('.action')).toHaveLength(0);
    });

    it('should be empty when text and action text are not provided', () => {
        // given
        const wrapper = getWrapper({
            actionText: null,
            text: null
        });
        // then
        expect(wrapper.find('.text')).toHaveLength(0);
        expect(wrapper.find('.action')).toHaveLength(0);
    });

    it('should call onClick when action button clicked', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.action').simulate('click');
        // then
        expect(onClick).toHaveBeenCalled();
    });

    it('should call onKeyDown on key press', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.action').simulate('keyDown', { keyCode: 40 });
        // then
        expect(onKeyDown).toHaveBeenCalled();
    });

    it('should pass default tabIndex to action button', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.action').props().tabIndex).toBe(0);
    });

    it('should pass tabIndex to action button', () => {
        // given
        const tabIndex = 3;
        const wrapper = getWrapper({ tabIndex });
        // then
        expect(wrapper.find('.action').props().tabIndex).toBe(tabIndex);
    });
});
