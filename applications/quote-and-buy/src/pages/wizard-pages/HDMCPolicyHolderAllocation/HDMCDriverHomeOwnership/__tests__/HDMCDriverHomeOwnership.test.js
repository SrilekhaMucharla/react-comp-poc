import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import HDMCDriverHomeOwnership from '../HDMCDriverHomeOwnership';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<HDMCDriverHomeOwnership />', () => {
    let wrapper;

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    });

    test('render component', () => {
        const emptyStore = mockStore({});

        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCDriverHomeOwnership />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
