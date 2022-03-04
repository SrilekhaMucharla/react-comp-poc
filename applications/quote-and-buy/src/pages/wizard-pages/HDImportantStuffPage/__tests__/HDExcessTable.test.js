import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDExcessTable from '../HDExcessTable';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDExcessTable />', () => {
    test('render with mandatory props', () => {
        const wrapper = shallow((
            <HDExcessTable
                name="James Bond"
                excesses={[
                    { excessName: 'Fire', voluntaryAmount: 100, compulsoryAmount: 200 },
                    { excessName: 'Demage', voluntaryAmount: 200, compulsoryAmount: 300 },
                ]} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
