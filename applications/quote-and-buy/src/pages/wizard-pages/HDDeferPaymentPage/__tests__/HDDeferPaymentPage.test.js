import React from 'react';
import Enzyme from 'enzyme';
import HDDeferPaymentPage from '../HDDeferPaymentPage';

const defaultProps = { ...HDDeferPaymentPage.defaultProps };

const setup = (props = defaultProps) => { return Enzyme.mount(<HDDeferPaymentPage {...props} />); };
const findByTestAttribute = (wrapper, selector) => wrapper.find(`[data-testid='${selector}']`);

describe('<HDDeferPaymentPage />', () => {
    it('should render page with default props', () => {
        const tree = setup();
        expect(tree).toMatchSnapshot();
    });

    it('should display correct defer message', () => {
        const props = [{
            dueDate: 'today',
            amount: 458.50
        }, {
            dueDate: '15/12/2020',
            amount: 301.40
        }, {
            dueDate: '02/02/2021',
            amount: 237.16
        }, {
            dueDate: '02/05/2021',
            amount: 500.00
        }];

        const expectedMessage = '£458.5 today, £301.4 on 15/12/2020, £237.16 on 02/02/2021 and £500 on 02/05/2021';
        const component = setup({ payments: props });

        const actualMessage = findByTestAttribute(component, 'text-defer').text();

        expect(actualMessage).toEqual(expectedMessage);
    });
});
