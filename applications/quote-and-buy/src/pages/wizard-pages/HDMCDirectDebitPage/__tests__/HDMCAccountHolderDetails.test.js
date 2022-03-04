import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HDLabelRefactor } from 'hastings-components';
import HDMCAccountHolderDetails from '../components/HDMCAccountHolderDetails';
import withTranslator from '../../__helpers__/test/withTranslator';
import { AnalyticsHDModal as HDModal } from '../../../../web-analytics';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({}),
}));

const mockedData = {
    value: {
        accountHolder: {
            firstName: 'David',
            primaryAddress: {
                postalCode: '36000',
            },
        },
    },
};
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => mockedData,
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

describe('<HDAccountHolderDetails/>', () => {
    beforeEach(() => {
        const initialState = {
            wizardState: {
                data: {
                    value: {
                        accountHolder: {
                            title: 'Mr',
                            firstName: 'Tracy',
                            lastName: 'Craig',
                            primaryAddress: {
                                postalCode: '11300',
                                addressLine1: 'Karadjordjeva 26',
                            },
                        },
                    },
                },
            },
        };
        store = mockStore(initialState);
    });
    test('Render component', async () => {
        let wrapper;

        await act(async () => {
            wrapper = shallow(
                withTranslator(
                    <Provider store={store}>
                        <HDMCAccountHolderDetails />
                    </Provider>
                )
            );
        });

        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    test('should open overlay', async () => {
        let wrapper;

        await act(async () => {
            wrapper = shallow(<HDMCAccountHolderDetails />);
        });

        wrapper.find(HDLabelRefactor).at(0).simulate('click');
        await (async () => wrapper.update());
        expect(wrapper.find(HDModal)).toHaveLength(1);
    });

    test('is modal closed by default', async () => {
        let wrapper;

        await act(async () => {
            wrapper = shallow(<HDMCAccountHolderDetails />);
        });

        expect(wrapper.find(HDModal).props().show).toBeFalsy();
    });
});
