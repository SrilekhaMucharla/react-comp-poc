import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import HDMultiCarKeyCover from '../HDMultiCarKeyCover';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('<HDMultiCarKeyCover />', () => {
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
                <HDMultiCarKeyCover />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
