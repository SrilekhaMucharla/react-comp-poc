import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import HastingsMCDOBInterstitialPage from '../HastingsMCDOBInterstitialPage';


Enzyme.configure({ adapter: new Adapter() });

const initialState = {
    wizardState: {}
};

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore(initialState);

describe('<HastingsMCDOBInterstitialPage />', () => {
    test('render component', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HastingsMCDOBInterstitialPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
