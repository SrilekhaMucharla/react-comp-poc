import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HastingsUpdateInceptionDate from '../HastingsUpdateInceptionDate';


Enzyme.configure({ adapter: new Adapter() });


describe('<HastingsUpdateInceptionDate />', () => {
    test('render component', () => {
        const wrapper = shallow(
            <HastingsUpdateInceptionDate />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
