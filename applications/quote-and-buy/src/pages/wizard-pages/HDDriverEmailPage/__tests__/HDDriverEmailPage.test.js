import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import withTranslator from '../../__helpers__/test/withTranslator';

// HD
import submission from '../../../../routes/SubmissionVMInitial';
import HDDriverEmailPage from '../HDDriverEmailPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;


describe('<HDDriverEmailPage />', () => {
    beforeEach(() => {
        // Set default values
        const submissionWithEmail = _.cloneDeep(submission);
        _.set(submissionWithEmail, 'baseData.accountHolder.emailAddress1', 'test@mail.uk');

        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionWithEmail
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
    });
    test('render component', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <Provider store={store}>
                    <HDDriverEmailPage />
                </Provider>
            );
        });
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });
    test('verify classname driver-email-container', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverEmailPage />
            </Provider>
        ));
        expect(wrapper.find('.driver-email-container').exists()).toBe(true);
    });

    test('verify driver-email-label', async () => {
        const wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDDriverEmailPage />
            </Provider>
        ));
        expect(wrapper.find('.driver-email-label').exists()).toBeDefined();
    });
});
