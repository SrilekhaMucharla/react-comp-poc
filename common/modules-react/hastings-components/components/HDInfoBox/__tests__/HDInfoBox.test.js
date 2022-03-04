import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInfoBox from '../HDInfoBox';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInfoBox />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDInfoBox
            policyDetails={[{ key: 'keyItem', value: 'value' }]} />);
        expect(wrapper).toMatchSnapshot();
    });
});
