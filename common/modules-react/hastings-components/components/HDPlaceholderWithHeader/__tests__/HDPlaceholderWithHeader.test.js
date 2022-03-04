import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDPlaceholderWithHeader from '../HDPlaceholderWithHeader';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDPlaceholderWithHeader />', () => {
    it('render component with children', () => {
        const wrapper = shallow(<HDPlaceholderWithHeader title="test"><span /></HDPlaceholderWithHeader>);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it('render component without children', () => {
        const wrapper = shallow(<HDPlaceholderWithHeader title="test" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it('render component with icon', () => {
        const wrapper = shallow(<HDPlaceholderWithHeader title="test" icon={<span />} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
