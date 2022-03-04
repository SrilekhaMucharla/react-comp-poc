import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HDLabelRefactor } from 'hastings-components';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDInvalidURLErrorPage from '../HDInvalidURLErrorPage';
import * as messages from '../HDInvalidURLErrorPage.messages';

const oldWindowLocation = window.location;
async function initializeWrapper(store, props, tempLocation = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={[tempLocation]}>
                    <HDInvalidURLErrorPage {...props} />
                </MemoryRouter>
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('HDInvalidURLErrorPage', () => {
    const initialState = {
        epticaId: 854
    };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    beforeAll(() => {
        delete window.location;
        window.location = Object.defineProperties(
            {},
            {
                ...Object.getOwnPropertyDescriptors(oldWindowLocation),
                assign: {
                    configurable: true,
                    value: jest.fn(),
                },
            },
        );
    });
    afterAll(() => {
        window.location = oldWindowLocation;
    });
    it('should render component with default props', async () => {
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(2);
        expect(wrapper.find('#home-page-button')).toHaveLength(4);
        expect(wrapper.find('h4').text()).toEqual(messages.header);
        expect(wrapper.find('p').text()).toEqual(messages.subHeader);
    });
    it('should render component with props', async () => {
        const props = {
            fromWizard: 'yes'
        };
        const wrapper = await initializeWrapper(store, props);
        expect(wrapper.find('.invalid-url-container .invalid-url-container-override')).toBeDefined();
    });
    it('should redirect to app homepage on clicking button Go back to the homepage', async () => {
        const wrapper = await initializeWrapper(store);
        const button = wrapper.find({ 'data-testid': 'goto-home-buttton' }).at(1);
        await act(async () => button.simulate('click'));
        await act(async () => wrapper.update());
        expect(window.location.assign).toHaveBeenCalledWith('https://hastingsdirect.com');
    });
});
