import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDImageRadioButton from '../HDImageRadioButton';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDImageRadioButton />', () => {
    it('render component with image', () => {
        const onChangeMock = jest.fn();
        const component = (
            <HDImageRadioButton
                name="group"
                currentValue="variant1"
                value="variant1"
                onChange={onChangeMock}
                image={<img alt="HD" />} />
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('Change value and check after select radio button', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'variant2' }
        };
        const component = (
            <HDImageRadioButton
                name="group"
                currentValue="variant2"
                value="variant1"
                onChange={onChangeMock}
                image={<img alt="HD" />} />
        );
        const wrapper = shallow(component);
        const radioButton = wrapper.find({ 'data-testid': 'radio-btn' });
        radioButton.simulate('change', event);
        setTimeout(() => {
            expect(radioButton.prop('value')).toBe('variant2');
            expect(radioButton.prop('checked')).toBe(true);
        }, 0);
    });
});
