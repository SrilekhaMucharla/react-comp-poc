import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDLabelRefactor from '../HDLabelRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDLabelRefactor />', () => {
    it('render component with text only', () => {
        const wrapper = mount(<HDLabelRefactor id="Random-ID" Tag="h1" text="Random label" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with text only', () => {
        const wrapper = mount(<HDLabelRefactor id="Random-ID" Tag="h1" text="Random label" size="xs" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with text and icon on left', () => {
        const wrapper = mount(<HDLabelRefactor id="Random-ID" Tag="h1" text="Random label" icon="car" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with text and icon on right', () => {
        const wrapper = mount(<HDLabelRefactor id="Random-ID" Tag="h1" text="Random label" icon="car" iconPosition="r" />);
        expect(wrapper).toMatchSnapshot();
    });
});
