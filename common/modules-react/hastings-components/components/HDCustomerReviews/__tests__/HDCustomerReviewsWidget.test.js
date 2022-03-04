import { shallow, mount } from 'enzyme';
import React from 'react';
import HDCustomerReviewsWidget from '../HDCustomerReviewsWidget';

describe('<HDCustomerReviewsWidget />', () => {
    test('render component', () => {
        const loadReviewsBagde = jest.fn();
        const wrapper = shallow((
            <HDCustomerReviewsWidget onLoadReviewsBagde={loadReviewsBagde} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('resize component', () => {
        const loadReviewsBagde = jest.fn();
        window.addEventListener = jest.fn();
        window.removeEventListener = jest.fn();

        const wrapper = mount((
            <HDCustomerReviewsWidget onLoadReviewsBagde={loadReviewsBagde} />
        ));
        expect(window.addEventListener).toBeCalled();

        wrapper.unmount();
        expect(window.removeEventListener).toBeCalled();
    });
});
