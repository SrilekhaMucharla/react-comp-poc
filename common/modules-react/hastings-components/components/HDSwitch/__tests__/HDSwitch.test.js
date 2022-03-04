import React from 'react';
import { shallow } from 'enzyme';
import HDSwitch from '../HDSwitch';

describe('HDSwitch', () => {
    // given
    const onChange = jest.fn();
    const values = [
        {
            name: 'value 1',
            value: '1'
        },
        {
            name: 'value 2',
            value: '2'
        }
    ];
    const { value } = values[1];
    const name = 'name';
    const path = 'path';

    const getWrapper = (props = {}) => shallow(
        <HDSwitch
            path={path}
            name={name}
            value={value}
            onChange={onChange}
            values={values}
            {...props} />
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain two labels', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('label')).toHaveLength(2);
    });

    it('should contain input', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('input')).toHaveLength(1);
    });

    it('should call onChange when switch is clicked off', () => {
        // given
        const defaultChecked = false;
        const wrapper = getWrapper({
            defaultChecked
        });
        const customEvent = {
            target: {
                value: values[1].value,
                name: name,
                getAttribute: (attr) => (attr === 'path' ? path : null)
            }
        };

        // when
        wrapper.find('.custom-control-input').simulate('change', { target: { checked: !defaultChecked } });
        // then
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                value: customEvent.target.value,
                name: customEvent.target.name
            })
        }));
        expect(wrapper.find('.custom-control-label-right').hasClass('active')).toBeTruthy();
    });

    it('should call onChange when switch is clicked on', () => {
        // given
        const defaultChecked = true;
        const wrapper = getWrapper({
            defaultChecked
        });
        const customEvent = {
            target: {
                value: values[0].value,
                name: name,
                getAttribute: (attr) => (attr === 'path' ? path : null)
            }
        };
        // when
        wrapper.find('.custom-control-input').simulate('change', { target: { checked: !defaultChecked } });
        // then
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                value: customEvent.target.value,
                name: customEvent.target.name
            })
        }));
        expect(wrapper.find('.custom-control-label-left').hasClass('active')).toBeTruthy();
    });

    it('should have id when provided', () => {
        // given
        const wrapper = getWrapper({
            id: 'test-id'
        });
        // then
        expect(wrapper.find('#test-id')).toHaveLength(1);
    });

    it('should apply dark theme by default', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.switch--dark')).toHaveLength(1);
    });

    it('should apply light theme', () => {
        // given
        const wrapper = getWrapper({
            theme: 'light'
        });
        // then
        expect(wrapper.find('.switch--light')).toHaveLength(1);
    });
});
