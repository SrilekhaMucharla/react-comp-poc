import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HDBindErrorPage from '../HDBindErrorPage';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('<HDBindErrorPage />', () => {
    let wrapper;

    createPortalRoot();

    beforeEach(() => {
        jest.clearAllMocks();
    });

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
                <HDBindErrorPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
