import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Footer from '../Footer';
import createPortalRoot from '../../../wizard-pages/__helpers__/test/createPortalRoot';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('Footer', () => {
    createPortalRoot();
    it('component is rendered', () => {
        const wrapper = shallow(<Router><Footer /></Router>);
        expect((wrapper).find(Footer)).toBeTruthy();
    });

    it('should render footer container', () => {
        const emptyStore = mockStore({});
        const wrapper = mount(<Provider store={emptyStore}><Router><Footer /></Router></Provider>);
        expect((wrapper).find('.fixed-footer').length).toBe(1);
    });
});
