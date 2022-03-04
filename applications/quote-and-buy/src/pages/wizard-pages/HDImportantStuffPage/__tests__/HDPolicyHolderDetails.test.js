import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDPolicyHolderDetails from '../HDPolicyHolderDetails';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDPolicyHolderDetails />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDPolicyHolderDetails
            policyHolder={{
                registrationNumber: 'RFI2 SJI',
                car: 'Mercedes E Class',
                policyHolder: 'David Norman',
                yearsNoClaims: '9',
                address: 'Mill lane, TN33 OJH',
                namedDrivers: ['Victoria Norman', 'Sam Norman']
            }} />);
        expect(wrapper).toMatchSnapshot();
    });
});
