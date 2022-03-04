import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDTextInputRefactor from '../HDTextInputRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDTextInput />', () => {
    it('render component with text value only', () => {
        const onChangeMock = jest.fn();
        const wrapper = shallow(<HDTextInputRefactor value="Text" onChange={onChangeMock} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('change value in text input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'New text' }
        };
        const wrapper = shallow(<HDTextInputRefactor value="Text" onChange={onChangeMock} />);
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
        const wrapper = shallow(<HDTextInputRefactor type="mask" mask="MASK****" value="Text" onChange={onChangeMock} />);
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
        const wrapper = shallow(<HDTextInputRefactor type="currency" value="100" onChange={onChangeMock} icon="pound-sign" />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        const icon = wrapper.find('.fas');
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('1,004.98');
            expect(icon).toBeDefined();
        }, 0);
    });

    it('change value in currency low input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: '.100gf' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="currency" value="100" onChange={onChangeMock} icon="pound-sign" />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        const icon = wrapper.find('.fas');
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('100');
            expect(icon).toBeDefined();
        }, 0);
    });

    it('change value in number input with append label', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: '190a' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="currency" value="100" onChange={onChangeMock} appendLabel="kilometers" />);
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
        const wrapper = shallow(<HDTextInputRefactor type="password" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('Text');
        }, 0);
    });

    it('change value in email input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'a@b.co' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="email" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('a@b.co');
        }, 0);
    });

    it('change value in alpha input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'test' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="alpha" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('test');
        }, 0);
    });

    it('change value in number input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: '123' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="number" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('123');
        }, 0);
    });

    it('change value in postcode input', () => {
        const onChangeMock = jest.fn();
        const event = {
            preventDefault() { },
            target: { value: 'SWE123' }
        };
        const wrapper = shallow(<HDTextInputRefactor type="postcode" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' });
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('SWE123');
        }, 0);
    });

    it('change value in alphanum input', () => {
        const onChangeMock = jest.fn();
        const ref = {
            current: {
                selectionStart: 1
            }
        };
        const event = {
            preventDefault() { },
            target: { value: 'Text123' }
        };
        const wrapper = mount(<HDTextInputRefactor ref={ref} tickIcon type="alphanum" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' }).at(0);
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('Text123');
        }, 0);
    });

    it('change value in firstName input', () => {
        const onChangeMock = jest.fn();
        const ref = {
            current: {
                selectionStart: 1
            }
        };
        const event = {
            preventDefault() { },
            target: { value: 'mary-jane franziska' }
        };
        const wrapper = mount(<HDTextInputRefactor ref={ref} tickIcon type="firstName" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' }).at(0);
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('Mary-Jane Franziska');
        }, 0);
    });

    it('change value in lastName input', () => {
        const onChangeMock = jest.fn();
        const ref = {
            current: {
                selectionStart: 1
            }
        };
        const event = {
            preventDefault() { },
            target: { value: 'o\'donell mckain' }
        };
        const wrapper = mount(<HDTextInputRefactor ref={ref} tickIcon type="lastName" value="Text" onChange={onChangeMock} />);
        const textInput = wrapper.find({ 'data-testid': 'text-input' }).at(0);
        textInput.simulate('change', event);
        setTimeout(() => {
            expect(textInput.prop('value')).toBe('O\'Donell McKain');
        }, 0);
    });
});
