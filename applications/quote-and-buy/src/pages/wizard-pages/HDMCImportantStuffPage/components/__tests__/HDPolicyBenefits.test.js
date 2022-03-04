import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { useSelector, Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import HDPolicyBenefits from '../HDPolicyBenefits';

Enzyme.configure({ adapter: new Adapter() });
const middlewares = [];
const mockStore = configureStore(middlewares);
let store;
const multiCustomizeSubmissionVM = {
    value: {
        mpwrapperNumber: '12345',
        sessionUUID: '1234',
        customQuotes: []
    }
};
const mockAppState = {
    wizardState: {
        app: {
            driverLicenceDetails: []
        },
        data: {
            multiCustomizeSubmissionVM: multiCustomizeSubmissionVM
        }
    },
};
const MockpolicyType = 'Some String';
const Mockbrand = 'Some Brand';
const Mockvehicle = {
    quoteID: '1234567890'
};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('<HDPolicyBenefits />', () => {
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
                <HDPolicyBenefits policyType={MockpolicyType} brand={Mockbrand} vehicle={Mockvehicle} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
