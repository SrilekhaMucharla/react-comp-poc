import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDQuoteTable from '../HDQuoteTable';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDQuoteTable />', () => {
    it('render component with data type of string', () => {
        const wrapper = shallow(<HDQuoteTable
            headerValues={[{ value: 'Header1' }, { value: 'Header2' }]}
            data={[{ name: 'SubTitle1', values: ['Value1.1', 'Value1.2'] }, { name: 'SubTitle2', values: ['Value2.1', 'Value2.2'] }]} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with data type of boolean', () => {
        const wrapper = shallow(<HDQuoteTable
            headerValues={[{ value: 'Header1' }, { value: 'Header2' }]}
            data={[{ name: 'SubTitle1', values: [true, false] }, { name: 'SubTitle2', values: [true, true] }]} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with data type of mixed boolean and string', () => {
        const wrapper = shallow(<HDQuoteTable
            headerValues={[{ value: 'Header1' }, { value: 'Header2' }]}
            data={[{ name: 'SubTitle1', values: [true, 'Value1.1'] }, { name: 'SubTitle2', values: [true, 'Value2.1'] }]} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with topLabel', () => {
        const wrapper = shallow(<HDQuoteTable
            headerValues={[{ value: 'Header1' }, { value: 'Header2', topLabel: 'Enhanced' }]}
            data={[{ name: 'SubTitle1', values: ['Value1.1', 'Value1.2'] }, { name: 'SubTitle2', values: ['Value2.1', 'Value2.2'] }]} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with primary', () => {
        const wrapper = shallow(<HDQuoteTable
            primary
            headerValues={[{ value: 'Header1' }, { value: 'Header2' }]}
            data={[{ name: 'SubTitle1', values: ['Value1.1', 'Value1.2'] }, { name: 'SubTitle2', values: ['Value2.1', 'Value2.2'] }]} />);
        expect(wrapper).toMatchSnapshot();
    });
});
