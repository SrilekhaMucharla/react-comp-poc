import { shallow } from 'enzyme';
import React from 'react';
import HDCustomerReviews from '../HDCustomerReviews';

describe('<HDCustomerReviews />', () => {
    test('render component', () => {
        const loadReviewsBagde = jest.fn();
        const wrapper = shallow((
            <HDCustomerReviews onLoadReviewsBagde={loadReviewsBagde} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
