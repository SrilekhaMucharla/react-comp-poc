import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDCoverSummary from '../HDCoverSummary';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDCoverSummary />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDCoverSummary />);
        expect(wrapper).toMatchSnapshot();
    });
});
