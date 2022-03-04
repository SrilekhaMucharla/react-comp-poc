import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import HastingDirectContainer from '../HastingDirectContainer';

Enzyme.configure({ adapter: new Adapter() });
const initialState = {
    wizardState: {}
};

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore(initialState);
describe('<HastingDirectContainer />', () => {
    test('render component', () => {
        const wrapper = mount(
            <Provider store={store}>
                <Router>
                    <HastingDirectContainer />
                </Router>
            </Provider>
        );
        expect((wrapper).find('.hasting-direct-container').length).toBe(1);
    });
});
