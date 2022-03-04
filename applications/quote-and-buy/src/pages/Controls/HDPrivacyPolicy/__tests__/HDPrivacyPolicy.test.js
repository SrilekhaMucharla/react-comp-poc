import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDPrivacyPolicy from '../HDPrivacyPolicy';
import createPortalRoot from '../../../wizard-pages/__helpers__/test/createPortalRoot';

describe('<HDPrivacyPolicy />', () => {
    createPortalRoot();

    const initialState = { };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    const wrapper = mount(
        <Provider store={store}>
            <HDPrivacyPolicy />
        </Provider>
    );

    it('should render correctly', () => {
        // then
        expect(wrapper).toBeDefined();
    });

    it('should render correctly when HDPrivacyPolicy is in popup', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDPrivacyPolicy isInPopup />
            </Provider>
        );
        // then
        expect(anotherWrapper).toBeDefined();
    });

    test('Check all fields are rendered', async () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDPrivacyPolicy isInPopup />
            </Provider>
        );
        // then
        await act(async () => {
            expect(anotherWrapper.find('HDOverlayPopup[labelText="Privacy policy"]')).toBeTruthy();
            expect(anotherWrapper.find('HDLabelRefactor[className="secondary-style"]')).toBeTruthy();
        });
    });
});
