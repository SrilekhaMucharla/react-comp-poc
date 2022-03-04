import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDMCPayerDetails from '../components/HDMCPayerDetails';
import withTranslator from '../../__helpers__/test/withTranslator';

Enzyme.configure({ adapter: new Adapter() });

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

describe('HDMCPayerDetails', () => {
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
                        <HDMCPayerDetails />
                    </Provider>
                )
            );
        });
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });
});
