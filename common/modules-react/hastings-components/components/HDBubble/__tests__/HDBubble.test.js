import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDBubble from '../HDBubble';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDBubble />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDBubble>Text</HDBubble>);
        expect(wrapper).toMatchSnapshot();
    });
});
