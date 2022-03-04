import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInfoCard from '../HDInfoCard';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInfoCard />', () => {
    it('render component with text only', () => {
        const wrapper = shallow(<HDInfoCard title="Random title" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with paragraph only', () => {
        const wrapper = shallow(<HDInfoCard paragraphs={['test1', 'test2']} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with children', () => {
        const wrapper = shallow(<HDInfoCard title="Random title"><span>children</span></HDInfoCard>);
        expect(wrapper).toMatchSnapshot();
    });
});
