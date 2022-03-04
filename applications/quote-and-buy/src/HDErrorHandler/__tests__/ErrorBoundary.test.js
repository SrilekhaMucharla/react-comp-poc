import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary';
import HDInvalidURLErrorPage from '../../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

describe('ErrorBoundary', () => {
    it('should display HDErrorBoundaryPage if wrapped component throws an error', () => {
        const Something = () => <p id="some-paragraph">Some paragraph</p>;
        const wrapper = mount(
            <Provider store={store}>
                <ErrorBoundary>
                    <Something />
                </ErrorBoundary>
            </Provider>
        );

        const error = new Error('test');
        wrapper.find(Something).simulateError(error);
        expect(wrapper.find(HDInvalidURLErrorPage).exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
    it('should display children if no error thrown by wrapped component', () => {
        const Something = () => <p id="some-paragraph">Some paragraph</p>;
        const wrapper = mount(
            <ErrorBoundary>
                <Something />
            </ErrorBoundary>
        );
        expect(wrapper.find('#some-paragraph').exists()).toEqual(true);
        expect(wrapper).toHaveLength(1);
    });
});
