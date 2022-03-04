import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDTimeoutPage from '../HDTimeoutPage';

describe('<HDTimeoutPage />', () => {
    const initialState = {
        epticaId: 854
    };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    test('render HDTimeoutPage', () => {
        const wrapper = mount((
            <Provider store={store}>
                <HDTimeoutPage />
            </Provider>
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('Verify page header', () => {
        const wrapper = mount((
            <Provider store={store}>
                <HDTimeoutPage />
            </Provider>
        ));
        expect(wrapper.find('#timeout-header-label').exists()).toBeTruthy();
    });

    test('verify page message', () => {
        const wrapper = mount((
            <Provider store={store}>
                <HDTimeoutPage />
            </Provider>
        ));
        expect(wrapper.find('#timeout-sub-header-one-label').exists()).toBeTruthy();
        expect(wrapper.find('#timeout-sub-header-two-label').exists()).toBeTruthy();
    });
});
