import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ErrorHandler from '../ErrorHandler';
import HDInvalidURLErrorPage from '../../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';
import HDDataSchemaErrorPage from '../../pages/HDDataSchemaErrorPage/HDDataSchemaErrorPage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

function createInitialState(errCode) {
    const initialState = {
        errorStatus: { errorStatusCode: errCode }
    };

    return initialState;
}

function initializeMockStore(initialState) {
    return mockStore(initialState);
}

async function initializeWrapper(store, children, props, location = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <MemoryRouter initialEntries={[location]}>
                <Provider store={store}>
                    <ErrorHandler {...props}>{children}</ErrorHandler>
                </Provider>
            </MemoryRouter>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('<ErrorHandler />', () => {
    test('component renders with children when error code is undefined(200 ok)', async () => {
        const children = (
            <p id="some-paragraph">Some paragraph</p>
        );
        const initialState = createInitialState(undefined);
        const store = initializeMockStore(initialState);
        const wrapper = await initializeWrapper(store, children);
        expect(wrapper.find('#some-paragraph').exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
    test('component renders with HDInvalidURLErrorPage when error code is 404', async () => {
        const children = (
            <p id="some-paragraph">Some paragraph</p>
        );
        const initialState = createInitialState(404);
        const store = initializeMockStore(initialState);
        const wrapper = await initializeWrapper(store, children);
        expect(wrapper.find(HDInvalidURLErrorPage).exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
    test('component renders with HDDataSchemaErrorPage when error code is 503', async () => {
        const children = (
            <p id="some-paragraph">Some paragraph</p>
        );
        const initialState = createInitialState(503);
        const store = initializeMockStore(initialState);
        const wrapper = await initializeWrapper(store, children);
        expect(wrapper.find(HDDataSchemaErrorPage).exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
    test('component renders with HDDataSchemaErrorPage when error code is exist', async () => {
        const children = (
            <p id="some-paragraph">Some paragraph</p>
        );
        const initialState = createInitialState(500);
        const store = initializeMockStore(initialState);
        const wrapper = await initializeWrapper(store, children);
        expect(wrapper.find(HDDataSchemaErrorPage).exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
});
