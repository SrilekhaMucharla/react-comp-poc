/* eslint-disable max-len */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDQuotePolicyDetails from '../HDQuotePolicyDetails';

const policyDetailsItems = [
    { key: 'Quote reference:', value: '10500441968' },
    { key: 'Length of policy:', value: '365 days' },
    { key: 'Starts:', value: '15/09/2020' },
    { key: 'Ends:', value: '14/09/2021 23:59' },
    { key: 'Underwriter:', value: 'Covea Insurance plc' },
];
const optionalExtras = [
    { name: 'Personal accident cover - £XX.XX', description: 'Meets your need for extra financial support if you or your passengers were injured following an accident involving your car' },
    { name: 'Substitute vehicle - £XX.XX', description: 'Meets your need to have a replacement car like your if your car is written off or stolen and not recovered.' },
    { name: 'No claims discount protection - included', description: '' }
];

Enzyme.configure({ adapter: new Adapter() });

describe('<HDQuotePolicyDetails />', () => {
    it('render component with hpComprehensive', () => {
        const wrapper = shallow(<HDQuotePolicyDetails policyType="HP" brand="HP" policyDetailsItems={policyDetailsItems} optionalExtras={optionalExtras} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render component with heComprehensive', () => {
        const wrapper = shallow(<HDQuotePolicyDetails policyType="HE" brand="HE" policyDetailsItems={policyDetailsItems} optionalExtras={optionalExtras} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render component with hdComprehensive', () => {
        const wrapper = shallow(<HDQuotePolicyDetails policyType="HD" brand="HD" policyDetailsItems={policyDetailsItems} optionalExtras={optionalExtras} />);
        expect(wrapper).toMatchSnapshot();
    });
});
