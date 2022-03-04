import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDAlert from '../HDAlert';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDAlert />', () => {
    it('render component with message', () => {
        const wrapper = shallow(<HDAlert message="Error" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with message', () => {
        const wrapper = shallow(<HDAlert />);
        expect(wrapper).toMatchSnapshot();
    });
});
