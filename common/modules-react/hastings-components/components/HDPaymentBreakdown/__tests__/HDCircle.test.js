import React from 'react';
import Enzyme from 'enzyme';
import HDCircle from '../HDCircle';
import { findByTestAttribute } from '../../__helpers__/testHelper';

const setup = (props = {}) => {
    return Enzyme.mount(<HDCircle {...props} />);
};

describe('<HDCircle />', () => {
    describe('renders correctly', () => {
        test(('should match snapshot with no props'), () => {
            const tree = setup();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('displays correct circle', () => {
        test('renders green circle based on props', () => {
            const component = setup({ type: 'green' });
            const match = findByTestAttribute(component, 'circle-green');

            expect(match.length).toBe(1);
        });

        test('renders date circle based on props', () => {
            const component = setup({ type: 'date', date: { day: '15', shortMonth: 'Nov' } });
            const match = findByTestAttribute(component, 'circle-date');

            expect(match.length).toBe(1);
        });

        test('renders dot circle based on props', () => {
            const component = setup({ type: 'dot' });
            const match = findByTestAttribute(component, 'circle-dot');

            expect(match.length).toBe(1);
        });
    });
});
