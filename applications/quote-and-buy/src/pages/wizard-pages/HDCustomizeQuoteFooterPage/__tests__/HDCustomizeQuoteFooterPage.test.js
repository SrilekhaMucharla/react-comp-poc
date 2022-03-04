import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import HDCustomizeQuoteFooterPage from '../HDCustomizeQuoteFooterPage';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
let wrapper;

describe('<HDCustomizeQuoteFooterPage />', () => {
    beforeEach(() => {
        const initialState = {
            emailSaveProgress: 'ab@ab.com',
            wizardState: {
                app: {
                    multiCarFlag: true
                }
            },
        };

        store = mockStore(initialState);
        wrapper = mount((
            <Provider store={store}>
                <HDCustomizeQuoteFooterPage
                    pageId="ms"
                    quoteID="000000078" />
            </Provider>
        ));
    });

    it('render component', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('click progres button', async () => {
        const button = wrapper.find('HDButtonRefactor');
        wrapper.update();
        expect(button.exists()).toBe(true);
    });

    it('render component with email', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('render component and check div', () => {
        expect(wrapper.find('.email-progress').exists()).toBe(true);
    });

    it('render component and check div', () => {
        expect(wrapper.find('.margin-bottom-tiny').exists()).toBe(true);
    });

    it('render component and check div', () => {
        expect(wrapper.find('.progress-description').exists()).toBe(true);
    });

    it('render component with brand', () => {
        const hdWrapper = mount((
            <Provider store={store}>
                <HDCustomizeQuoteFooterPage
                    pageId="ms"
                    brand="HD"
                    quoteID="000000078" />
            </Provider>
        ));
        expect(hdWrapper.find('HDButtonRefactor').exists()).toBe(true);
    });

    it('check div if email is not sent', () => {
        expect(wrapper.find('.invalid-field').exists()).toBe(false);
    });
});
