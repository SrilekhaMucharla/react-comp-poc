import React from 'react';
import { shallow } from 'enzyme';
import HDButtonDashed from '../HDButtonDashed';

describe('HDButtonDashed', () => {
    // given
    const label = 'test-title';
    const onClick = jest.fn();
    const onKeyDown = jest.fn();
    const theme = 'dark';
    const className = 'test-classname';

    const getWrapper = (props = {}) => shallow(
        <HDButtonDashed
            label={label}
            onClick={onClick}
            onKeyDown={onKeyDown}
            theme={theme}
            className={className}
            {...props} />
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper({ icon: true });
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain icon when icon prop is true', () => {
        // given
        const wrapper = getWrapper({ icon: true });
        // then
        expect(wrapper.find('.icon')).toHaveLength(1);
    });

    it('should not contain icon when icon prop is false', () => {
        // given
        const wrapper = getWrapper({ icon: false });
        // then
        expect(wrapper.find('.icon')).toHaveLength(0);
    });

    it('should contain title', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.text')).toHaveLength(1);
    });

    it('should call onClick', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.test-classname').simulate('click');
        // then
        expect(onClick).toHaveBeenCalled();
    });

    it('should call onKeyDown', () => {
        // given
        const wrapper = getWrapper();
        // when
        wrapper.find('.test-classname').simulate('keyDown', { keyCode: 40 });

        // then
        expect(onKeyDown).toHaveBeenCalled();
    });

    it('should apply dark theme by default', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.btn-dashed--dark')).toHaveLength(1);
    });

    it('should apply light theme', () => {
        // given
        const wrapper = getWrapper({
            theme: 'light'
        });
        // then
        expect(wrapper.find('.btn-dashed--light')).toHaveLength(1);
    });

    it('should have tabIndex 0 by default', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.test-classname').props().tabIndex).toBe(0);
    });

    it('should have proper tabIndex passed to the button', () => {
        const tabIndex = 17;
        // given
        const wrapper = getWrapper({ tabIndex });
        // then
        expect(wrapper.find('.test-classname').props().tabIndex).toBe(tabIndex);
    });

    it('should not be disabled by default', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.disabled')).toHaveLength(0);
    });

    it('should be disabled when disabled prop is passed', () => {
        // given
        const wrapper = getWrapper({ disabled: true });
        // then
        expect(wrapper.find('.disabled')).toHaveLength(1);
    });
});

describe('HDButtonDashed - default onClick and onKeyDown', () => {
    // given
    const label = 'test-title';
    const theme = 'dark';
    const className = 'test-classname';

    const getWrapper = (props = {}) => shallow(
        <HDButtonDashed
            label={label}
            theme={theme}
            className={className}
            {...props} />
    );

    it('should execute default onClick when clicked', () => {
        // given
        const wrapper = getWrapper({ icon: true });
        // then
        wrapper.simulate('click');
        expect(wrapper).toMatchSnapshot();
    });

    it('should execute default onKeyDown when key pressed', () => {
        // given
        const wrapper = getWrapper({ icon: true });
        // then
        wrapper.props().onKeyDown();
        expect(wrapper).toMatchSnapshot();
    });
});
