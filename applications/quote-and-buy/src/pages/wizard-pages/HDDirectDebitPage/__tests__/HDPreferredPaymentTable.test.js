import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDPreferredPaymentTable from '../HDPreferredPaymentTable';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDPreferredPaymentTable />', () => {
    test('render with mandatory props', () => {
        const wrapper = shallow((
            <HDPreferredPaymentTable
                paymentList={[
                    {
                        paymentDate: '26',
                        amount: '300',
                        date: 1234567,
                        paymentAmount: {
                            id: '1',
                            amount: 300
                        }
                    },
                    {
                        paymentDate: '26',
                        amount: '400',
                        date: 9876543,
                        paymentAmount: {
                            id: '2',
                            amount: 400
                        }
                    },

                ]} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
