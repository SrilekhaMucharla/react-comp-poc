import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { useSelector, Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import HDDriverDetails from '../HDDriverDetails';

Enzyme.configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
const mockAppState = {
    wizardState: {
        app: {
            driverLicenceDetails: []
        },
    },
};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('<HDDriverDetails />', () => {
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
                <HDDriverDetails driver={{
                    dateOfBirth: '18/11/1980',
                    occupation: 'Teacher',
                    drivingLicence: 'Full UK Manual, held for 16 years',
                    accidence: '1 in the last 5 years',
                    convictions: 'None'
                }} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
