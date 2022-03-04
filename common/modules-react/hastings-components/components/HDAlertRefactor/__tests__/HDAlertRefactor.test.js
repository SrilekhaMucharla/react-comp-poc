import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDAlertRefactor from '../HDAlertRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDAlertRefactor />', () => {
    it('render component with message', () => {
        const wrapper = shallow(<HDAlertRefactor message="Error" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with message', () => {
        const wrapper = shallow(<HDAlertRefactor />);
        expect(wrapper).toMatchSnapshot();
    });
});
