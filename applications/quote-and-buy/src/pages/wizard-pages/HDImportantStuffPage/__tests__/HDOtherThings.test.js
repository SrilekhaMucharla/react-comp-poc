import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDOtherThings from '../HDOtherThings';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDOtherThings />', () => {
    it('render component', () => {
        const wrapper = shallow((
            <HDOtherThings />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
