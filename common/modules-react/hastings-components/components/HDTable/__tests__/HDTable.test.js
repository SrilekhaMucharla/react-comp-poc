import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDTable from '../HDTable';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDTable />', () => {
    it('render with mandatory props', () => {
        const wrapper = shallow((
            <HDTable
                name="brand"
                headerValues={[{
                    label: 'HD',
                    image: <img alt="HD" />
                }]}
                selectedHeaderValue="HD"
                onSelect={jest.fn()} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    it('render with data', () => {
        const wrapper = shallow((
            <HDTable
                name="brand"
                headerValues={[{
                    label: 'HD',
                    image: <img alt="HD" />
                }]}
                selectedHeaderValue="HD"
                onSelect={jest.fn()}
                data={
                    [
                        {
                            rowLabel: 'First payment',
                            cells: [{
                                value: '{£17.92}',
                                extraLines: ['11 monthly payment', '{£17.88}'],
                                boldText: 'Total {£214.60}'
                            }]
                        },
                        {
                            cells: [{
                                label: 'Courtesy car',
                                value: false
                            }]
                        }
                    ]
                } />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
