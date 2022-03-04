import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDOurFees from '../HDOurFees';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDOurFees />', () => {
    it('render component', () => {
        const wrapper = shallow((
            <HDOurFees />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
