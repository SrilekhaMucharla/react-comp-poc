import React from 'react';
import Enzyme, { shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDTableCell from '../HDTableCell';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDTableCell />', () => {
    it('render with mandatory props', () => {
        const wrapper = shallow(<HDTableCell value="Text value" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render with boolean value and all optional props', () => {
        const wrapper = shallow((
            <HDTableCell
                label="Label"
                value={false}
                topDescription="top"
                bottomDescription="bottom"
                extraLines={['line1', 'line2']}
                boldText="Text"
                selected={false} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    it('icon for value === true should be check', () => {
        const wrapper = render((
            <HDTableCell
                label="Label"
                value />
        ));
        const icon = wrapper.find('.fa-check');
        expect(icon).toBeDefined();
    });

    it('icon for value === false should be times', () => {
        const wrapper = render((
            <HDTableCell
                label="Label"
                value={false} />
        ));
        const icon = wrapper.find('.fa-times');
        expect(icon).toBeDefined();
    });
});
