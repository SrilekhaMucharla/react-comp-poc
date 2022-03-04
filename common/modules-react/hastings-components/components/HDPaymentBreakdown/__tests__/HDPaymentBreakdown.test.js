import React from 'react';
import Enzyme from 'enzyme';
import HDPaymentBreakdown from '../HDPaymentBreakdown';
import { findByTestAttribute } from '../../__helpers__/testHelper';

const setup = (props = {}) => {
    return Enzyme.mount(<HDPaymentBreakdown {...props} />);
};
describe('<HDPaymentBreakdown />', () => {
    const exampleProps = {
        title: 'What you\'ll pay and when',
        steps: [{
            id: 1,
            circle: {
                type: 'date',
                date: { day: '12', shortMonth: 'Dec' }
            },
            description: {
                name: ['Initial payment today'],
                label: ['RFI2 SJI'],
                quote: { single: '£58.49', instalments: ['11', '12'] },
                tooltip: ''
            }
        }, {
            id: 2,
            circle: {
                type: 'date',
                date: { day: '12', shortMonth: 'Dec' }
            },
            description: {
                name: ['Initial payment today'],
                label: ['RFI2 SJI'],
                quote: { single: '£58.49', instalments: ['11', '12'] },
                tooltip: <span>tets</span>
            }
        }]
    };

    describe('renders correctly', () => {
        let component;
        beforeEach(() => {
            component = setup(exampleProps);
        });

        test(('should match snapshot'), () => {
            expect(component).toMatchSnapshot();
        });

        test('should render correct number of steps', () => {
            const match = findByTestAttribute(component, 'payment-breakdown-row');
            expect(match.length).toBe(2);
        });

        test('should correctly pass props to <HDCircle />', () => {
            const match = findByTestAttribute(component, 'circle-date');
            expect(match.length).toBe(2);
        });
    });
});
