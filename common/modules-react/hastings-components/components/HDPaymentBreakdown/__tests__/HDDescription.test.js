import React from 'react';
import Enzyme from 'enzyme';
import HDDescription from '../HDDescription';
import { findByTestAttribute } from '../../__helpers__/testHelper';

const setup = (props = {}) => {
    return Enzyme.mount(<HDDescription {...props} />);
};

describe('<HDDescription />', () => {
    const quote = { single: '£54', instalments: ['1', '2'] };

    describe('renders correctly', () => {
        test(('should match snapshot'), () => {
            const tree = setup({ name: ['Some', 'Names', 'In New Lines'], label: ['Some', 'Labels', 'In New Lines'], quote });
            expect(tree).toMatchSnapshot();
        });
    });

    describe('correctly displays quotes', () => {
        let component;
        beforeEach(() => {
            component = setup({ quote });
        });

        test('single quote', () => {
            const singleQuoteText = findByTestAttribute(component, 'description-quote-single').text();
            expect(singleQuoteText).toBe(quote.single);
        });

        test('instalments', () => {
            const instalmentsText = findByTestAttribute(component, 'description-quote-instalments').text();
            expect(instalmentsText).toBe(`(${quote.instalments[0]} + ${quote.instalments[1]})`);
        });
    });
});
