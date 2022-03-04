import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from '../Header';
import createPortalRoot from '../../../wizard-pages/__helpers__/test/createPortalRoot';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('Header', () => {
    createPortalRoot();
    it('component is rendered', () => {
        const wrapper = shallow(<Router><Header /></Router>);
        expect((wrapper).find(Header)).toBeTruthy();
    });

    it('should render Header container', () => {
        const emptyStore = mockStore({});
        const wrapper = mount(<Provider store={emptyStore}><Router><Header /></Router></Provider>);
        expect((wrapper).find('.fixed-header').length).toBe(1);
    });

    it('should call eventemitter', () => {
        const emptyStore = mockStore({});
        const mockEvent = jest.fn();
        const mockEventData = { amount: '10', prefix: 'abc', text: 'abc' };
        const wrapper = mount(<Provider store={emptyStore}><Router><Header /></Router></Provider>);
        wrapper.find(Header).instance().getEventData = mockEvent;
        wrapper.find(Header).instance().getEventData(mockEventData);
        wrapper.update();
        expect(mockEvent).toHaveBeenCalled();
    });
});
