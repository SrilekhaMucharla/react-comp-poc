import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import HastingsDOBInterstitialPage from '../HastingsDOBInterstitialPage';


Enzyme.configure({ adapter: new Adapter() });

const initialState = {
    wizardState: {}
};

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore(initialState);

describe('<HastingsDOBInterstitialPage />', () => {
    test('render component', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HastingsDOBInterstitialPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
