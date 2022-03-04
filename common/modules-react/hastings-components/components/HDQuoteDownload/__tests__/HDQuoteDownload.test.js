import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDQuoteDownload from '../HDQuoteDownload';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDQuoteDownload />', () => {
    it('render component with linkText', () => {
        const wrapper = shallow(<HDQuoteDownload linkText="download" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component without icon', () => {
        const wrapper = shallow(<HDQuoteDownload linkText="download" showIcon={false} />);
        expect(wrapper.find('.download-link-icon').exists()).toBeFalsy();
    });

    it('render component with icon', () => {
        const wrapper = shallow(<HDQuoteDownload linkText="download" />);
        expect(wrapper.find('svg').exists()).toBeTruthy();
    });
});
