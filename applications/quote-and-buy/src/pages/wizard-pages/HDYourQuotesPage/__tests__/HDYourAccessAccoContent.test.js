import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDYourAccessAccoContent from '../HDYourAccessAccoContent';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

describe('<HDYourAccessAccoContent />', () => {
    createPortalRoot();

    const initialState = {};

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    const wrapper = mount(
        <Provider store={store}>
            <HDYourAccessAccoContent />
        </Provider>
    );

    it('should render correctly', () => {
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly and match the snapshot', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDYourAccessAccoContent />
            </Provider>
        );
        // then
        expect(anotherWrapper).toMatchSnapshot();
    });
});
