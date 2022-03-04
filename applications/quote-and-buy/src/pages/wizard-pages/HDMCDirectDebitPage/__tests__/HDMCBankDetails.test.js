import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HDMCBankDetails from '../components/HDMCBankDetails';

window.HTMLElement.prototype.scrollIntoView = jest.fn();
jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe('<createPortalRoot />', () => {
    let wrapper;
    test('render component', () => {
        const emptyStore = mockStore({});
        wrapper = shallow(
            <Provider store={emptyStore}>
                <HDMCBankDetails
                    serviceDown={false}
                    formikValues={{}}
                    formikErrors={{}}
                    validatorError={false}
                    validateBankAccDetails={() => { }} />
            </Provider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
