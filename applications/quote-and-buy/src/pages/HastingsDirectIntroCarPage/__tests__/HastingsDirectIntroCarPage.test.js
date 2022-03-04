import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { mount, shallow } from 'enzyme';
import { HastingsDirectIntroCarPage } from '../HastingsDirectIntroCarPage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

function createInitialState() {
    const initialState = {
        wizardState: {
            app: {
                pcwName: 'HD_Website'
            }
        },
        monetateModel: {
            resultData: { }
        }
    };

    return initialState;
}
function initializeMockStore(...initialStateModifiers) {
    const initialState = createInitialState();

    // apply initialState modifiers
    _.over(initialStateModifiers)(initialState);

    return mockStore(initialState);
}
describe('<HastingsDirectIntroCarPage />', () => {
    test('render component', () => {
        const store = initializeMockStore();
        const updateEpticaId = jest.fn();
        const wrapper = shallow(
            <Provider store={store}>
                <HastingsDirectIntroCarPage updateEpticaId={updateEpticaId} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('button at index 0 is not disabled', () => {
        const store = initializeMockStore();
        const updateEpticaId = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <HastingsDirectIntroCarPage updateEpticaId={updateEpticaId} />
            </Provider>
        );
        expect(wrapper.find('HDButtonRefactor').at(0).prop('disabled')).toBeFalsy();
    });

    test('button at index 1 is not disabled', () => {
        const store = initializeMockStore();
        const updateEpticaId = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <HastingsDirectIntroCarPage updateEpticaId={updateEpticaId} />
            </Provider>
        );
        expect(wrapper.find('HDButtonRefactor').at(1).prop('disabled')).toBeFalsy();
    });
});
