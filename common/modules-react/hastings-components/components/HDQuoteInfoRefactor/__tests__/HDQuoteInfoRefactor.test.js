import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDQuoteInfoRefactor from '../HDQuoteInfoRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDQuoteInfo />', () => {
    it('render component with data type of string', () => {
        const wrapper = shallow(<HDQuoteInfoRefactor><span>If your car is written off or cannot be repaired</span></HDQuoteInfoRefactor>);
        expect(wrapper).toMatchSnapshot();
    });
});
