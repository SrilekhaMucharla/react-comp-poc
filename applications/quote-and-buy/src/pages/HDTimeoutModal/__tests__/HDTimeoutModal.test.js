import React from 'react';
import { shallow } from 'enzyme';
import HDTimeoutModal from '../HDTimeoutModal';

describe('<HDTimeoutModal />', () => {
    test('render HDTimeoutModal', () => {
        const wrapper = shallow((
            <HDTimeoutModal />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('Verify modal text', () => {
        const wrapper = shallow((
            <HDTimeoutModal />
        ));
        expect(wrapper.find('#timeout-popup-text').exists()).toBeTruthy();
    });

    test('verify modal time', () => {
        const wrapper = shallow((
            <HDTimeoutModal />
        ));
        expect(wrapper.find('#timeout-popup-time').exists()).toBeTruthy();
    });
});
