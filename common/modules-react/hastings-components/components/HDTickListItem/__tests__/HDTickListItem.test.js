import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDTickListItem from '../HDTickListItem';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDTickListItem />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDTickListItem title="test" />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render component with children', () => {
        const wrapper = shallow(<HDTickListItem title="test"><div /></HDTickListItem>);
        expect(wrapper).toMatchSnapshot();
    });
});
