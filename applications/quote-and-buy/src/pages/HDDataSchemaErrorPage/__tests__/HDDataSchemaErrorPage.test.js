import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HDLabelRefactor, HDButtonRefactor } from 'hastings-components';
import HDDataSchemaErrorPage from '../HDDataSchemaErrorPage';

const oldWindowLocation = window.location;
async function initializeWrapper(store, props, tempLocation = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={[tempLocation]}>
                    <HDDataSchemaErrorPage {...props} />
                </MemoryRouter>
            </Provider>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('HDDataSchemaErrorPage', () => {
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
    it('should render component', async () => {
        const wrapper = await initializeWrapper(store);
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(9);
        expect(wrapper.find(HDButtonRefactor)).toHaveLength(2);
    });
    it('should redirect to /intro on clicking button Get a new quote', async () => {
        const wrapper = await initializeWrapper(store);
        // const button = wrapper.find({ 'data-testid': 'new-quote-buttton' });
        const button = wrapper.find('HDButtonRefactor[data-testid="new-quote-buttton"]');
        await act(async () => button.simulate('click'));
        await act(async () => wrapper.update());
        expect(window.location.assign).toHaveBeenCalledWith('/quote-and-buy');
    });
    it('should redirect to app homepage on clicking button Go back to the homepage', async () => {
        const wrapper = await initializeWrapper(store);
        // const button = wrapper.find({ 'data-testid': 'goto-home-buttton' });
        const button = wrapper.find('HDButtonRefactor[data-testid="goto-home-buttton"]');
        await act(async () => button.simulate('click'));
        await act(async () => wrapper.update());
        expect(window.location.assign).toHaveBeenCalledWith('https://hastingsdirect.com');
    });
});
