/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import HDVRNSearchPage from '../HDVRNSearchPage';

const middlewares = [];
const mockStore = configureStore(middlewares);
Enzyme.configure({ adapter: new Adapter() });

describe('<HDVRNSearchPage />', () => {
    const initialState = {};
    const store = mockStore(initialState);
    test('render component', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDVRNSearchPage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('simulate VRN', async () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDVRNSearchPage />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('HDTextInput[name="registrationNumber"]')).toBeTruthy();
        });
    });
    test('Check for infocard', async () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDVRNSearchPage />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('.tip-main-left')).toBeTruthy();
        });
    });
    test('Check for VRN title', async () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDVRNSearchPage />
            </Provider>
        );
        await act(async () => {
            expect(wrapper.find('.page-vrn-title')).toBeTruthy();
        });
    });
});
