import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDTextInput from '../HDTextInput';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDTextInput />', () => {
    it('render component with text value only', () => {
        const onChangeMock = jest.fn();
        const wrapper = shallow(<HDTextInput value="Text" onChange={onChangeMock} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('change value in text input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'New text' }
        };
        const wrapper = shallow(<HDTextInput value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('New text');
        }, 0);
    });

    it('change value in masked input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'MASKtext' }
        };
        const wrapper = shallow(<HDTextInput type="mask" mask="MASK****" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'masked-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('MASKTEXT');
        }, 0);
    });

    it('change value in currency input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: '1004.98gf' }
        };
        const wrapper = shallow(<HDTextInput type="currency" value="100" onChange={onChangeMock} icon="pound-sign" />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        const icon = wrapper.find('.fas');
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('1,004.98');
            expect(icon).toBeDefined();
        }, 0);
    });

    it('change value in number input with append label', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: '190a' }
        };
        const wrapper = shallow(<HDTextInput type="currency" value="100" onChange={onChangeMock} appendLabel="kilometers" />);
        const textInput = wrapper.find({ 'data-testid': 'text-input-with-append' });
        const appendLabel = wrapper.find({ 'data-testid': 'append-label' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('190');
            expect(appendLabel.prop('children')).toBe('kilometers');
        }, 0);
    });

    it('change value in password input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'Text' }
        };
        const wrapper = shallow(<HDTextInput type="password" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('Text');
        }, 0);
    });
});
