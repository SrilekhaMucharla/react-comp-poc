import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDStartDatePopup from '../HDStartDatePopup';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDStartDatePopup />', () => {
    test('render component', () => {
        const wrapper = shallow((
            <HDStartDatePopup />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
