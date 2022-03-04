import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDDriverDetails from '../HDDriverDetails';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDDriversDetails />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDDriverDetails driver={{
            dateOfBirth: '18/11/1980',
            occupation: 'Teacher',
            drivingLicence: 'Full UK Manual, held for 16 years',
            accidence: '1 in the last 5 years',
            convictions: 'None'
        }} />);
        expect(wrapper).toMatchSnapshot();
    });
});
