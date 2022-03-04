import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { useSelector, Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import HDPreferredPaymentDatePage from '../HDPreferredPaymentDatePage';

Enzyme.configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
const mockAppState = {
    wizardState: {
        app: {
            paymentDay: '1'
        },
    }
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('<HDPreferredPaymentDatePage />', () => {
    beforeEach(() => {
        useSelector.mockImplementation((callback) => {
            return callback(mockAppState);
        });
        store = mockStore({});
    });
    afterEach(() => {
        useSelector.mockClear();
    });

    test('render with mandatory props', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDPreferredPaymentDatePage />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('verify HDLabelRefactor', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDPreferredPaymentDatePage />
            </Provider>
        );
        expect(wrapper.find('preferred-payment-date').exists()).toBeDefined();
    });

    test('verify HDOverlayPopup', () => {
        const wrapper = shallow(
            <Provider store={store}>
                <HDPreferredPaymentDatePage />
            </Provider>
        );
        expect(wrapper.find('preferred-payment-date__payment-date-overlay').exists()).toBeDefined();
    });
});
