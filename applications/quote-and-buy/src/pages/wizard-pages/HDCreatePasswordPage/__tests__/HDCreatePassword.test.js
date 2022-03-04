import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

// HD
import { HDLabelRefactor } from 'hastings-components';
import HDCreatePasswordPage from '../HDCreatePasswordPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import * as messages from '../HDCreatePasswordPage.messages';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 * @param {*} prevVal - previous value prop.
 */
const onChangeAction = (component, path, actionName, actionValue, prevVal = 'no') => {
    component
        .invoke('onChange')({
            target: {
                name: actionName,
                value: actionValue,
                previousvalue: prevVal,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};

describe('<HDCreatePasswordPage />', () => {
    let store;
    let wrapper;
    beforeEach(() => {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const licenceTypeFieldname = 'licenceType.aspects.availableValues';
        const licenceTypePath = `${driverPath}.${licenceTypeFieldname}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, licenceTypePath);
        _.set(submission, licenceTypePath, aspects);

        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission,
                    pageId: 'test-page'
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
        wrapper = mount(withTranslator(
            <Provider store={store}>
                <HDCreatePasswordPage />
            </Provider>
        ));
    });

    it('render component ', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('verify HDLabelRefactor', () => {
        expect(wrapper.find('HDLabelRefactor').exists()).toBe(true);
    });

    it('verify InputGroupText', () => {
        expect(wrapper.find('InputGroupText').exists()).toBe(true);
    });

    it('verify classname create-password__current-strength', () => {
        expect(wrapper.find('.create-password__current-strength').exists()).toBe(true);
    });

    it('verify classname create-password__info-card', () => {
        expect(wrapper.find('.create-password__info-card').exists()).toBe(true);
    });

    it('verify classname create-password__my-acc-container', () => {
        expect(wrapper.find('.create-password__my-acc-container').exists()).toBe(true);
    });

    it('verify classname create-password__password-col', () => {
        expect(wrapper.find('.create-password__password-col').exists()).toBe(true);
    });

    it('verify classname create-password__error is hidden when setNewPassword is success', () => {
        expect(wrapper.find('.create-password__error').exists()).toBe(false);
    });

    it('enter new password - empty string', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), ''
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBeUndefined();
    });

    it('enter new password - all lower case', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'test'
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBe(
                `${messages.pswrdEasyMessageOne}\n${messages.pswrdEasyMessageTwo}`
            );
    });

    it('enter new password - all lower case and numbers', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'testpass11'
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBe(
                `${messages.pswrdEasyMessageOne}\n${messages.pswrdEasyMessageTwo}`
            );
    });

    it('enter new password - OK', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'TEstpass11'
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBe(messages.pswrdOkMessage);
    });

    it('enter new password - Strong', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'TEs3paSS_11'
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBe(messages.pswrdStrongMessage);
    });

    it('enter new password - Strong II', async () => {
        const input = wrapper.find('[id="create-password-password-input"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), 'W!ac23Q_f'
        ));
        await act(async () => wrapper.update());

        expect(wrapper.find(HDLabelRefactor).at(2).prop('text'))
            .toBe(messages.pswrdStrongMessage);
    });
});
