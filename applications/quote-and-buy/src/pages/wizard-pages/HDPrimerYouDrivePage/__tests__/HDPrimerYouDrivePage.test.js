import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import HDPrimerYouDrivePage from '../HDPrimerYouDrivePage';
import {
    AnalyticsHDModal as HDModal,
    AnalyticsHDButton as HDButton,
} from '../../../../web-analytics/index';

const middlewares = [];
const mockStore = configureStore(middlewares);

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

describe('<HDPrimerYouDrivePage />', () => {
    test('render component', () => {
        const wrapper = mount(<HDPrimerYouDrivePage />);
        expect(wrapper).toMatchSnapshot();
    });

    test('render popup modal click', () => {
        const initialStates = {};
        const stores = mockStore(initialStates);

        const wrapper = mount(
            <Provider store={stores}>
                <HDPrimerYouDrivePage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should open modal', async () => {
        let wrapper;
        await act(async () => {
            wrapper = shallow(<HDPrimerYouDrivePage />);
        });

        wrapper.find(HDButton).at(0).simulate('click');
        await (async () => wrapper.update());
        expect(wrapper.find(HDModal)).toHaveLength(2);
    });
});
