import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInfoCardRefactor from '../HDInfoCardRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInfoCardRefactor />', () => {
    it('render component with text only', () => {
        const wrapper = shallow(<HDInfoCardRefactor id="Random-ID" title="Random title" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with paragraph only', () => {
        const wrapper = shallow(<HDInfoCardRefactor id="Random-ID" paragraphs={['test1', 'test2']} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with children', () => {
        const wrapper = shallow(<HDInfoCardRefactor id="Random-ID" title="Random title"><span>children</span></HDInfoCardRefactor>);
        expect(wrapper).toMatchSnapshot();
    });
});
