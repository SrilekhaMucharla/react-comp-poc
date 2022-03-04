import React from 'react';
import { mount, shallow } from 'enzyme';
import HastingDirectCustomerPage from '../HastingDirectCustomerPage';
import createPortalRoot from '../../wizard-pages/__helpers__/test/createPortalRoot';


describe('<HastingDirectCustomerPage />', () => {
    createPortalRoot();

    test('render component', () => {
        const wrapper = shallow(
            <HastingDirectCustomerPage />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('button at index 0 is not disabled', () => {
        const wrapper = mount(
            <HastingDirectCustomerPage />
        );
        expect(wrapper.find('#existing-customer-button').at(0).prop('disabled')).toBeFalsy();
    });

    test('button at index 1 is disabled', () => {
        const wrapper = mount(
            <HastingDirectCustomerPage />
        );
        expect(wrapper.find('#new-customer-button').at(0).prop('disabled')).toBeTruthy();
    });

    test('it displays tooltipOverlay on click', async () => {
        const wrapper = mount(
            <HastingDirectCustomerPage />
        );
        const acceptanceLink = wrapper.find('.hd-overlay-btn');

        await act(async () => {
            acceptanceLink
                .simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });

    test('on handleWizardFlow click', async () => {
        const wrapper = mount(
            <HastingDirectCustomerPage />
        );
        const mockRedirect = jest.fn();
        wrapper.instance().handleWizardFlow = mockRedirect;
        wrapper.update();
        wrapper.instance().handleWizardFlow();
        expect(mockRedirect).toHaveBeenCalled();
    });
});
