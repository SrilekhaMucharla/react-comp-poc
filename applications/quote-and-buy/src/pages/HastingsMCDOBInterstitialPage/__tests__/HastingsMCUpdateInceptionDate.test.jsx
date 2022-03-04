import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HastingsMCUpdateInceptionDate from '../HastingsMCUpdateInceptionDate';


Enzyme.configure({ adapter: new Adapter() });


describe('<HastingsMCUpdateInceptionDate />', () => {
    test.skip('render component', () => {
        const wrapper = shallow(
            <HastingsMCUpdateInceptionDate />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
