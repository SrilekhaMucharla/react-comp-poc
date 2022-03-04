import React from 'react';
import { mount, shallow } from 'enzyme';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDWizardRoute from '../HDWizardRoute';

describe('HDWizardRoute', () => {
    // given
    const handleForward = jest.fn();
    const handleBackward = jest.fn();
    const path = 'test-path';
    const pageMetadata = {
        page_name: 'page-name'
    };
    // eslint-disable-next-line react/prop-types
    const WizardPage = ({ children }) => <div>{children}</div>;

    const initialState = {
        epticaId: 854
    };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = shallow(
            <Provider store={store}>
                <MemoryRouter initialEntries={[path]} initialIndex={0}>
                    <HDWizardRoute
                        handleBackward={handleBackward}
                        handleForward={handleForward}
                        path={path}
                        WizardPage={WizardPage}
                        pageMetadata={pageMetadata}
                        personalDetails />
                </MemoryRouter>
            </Provider>
        );

        // then
        expect(wrapper).toMatchSnapshot();
    });

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]} initialIndex={0}>
                <HDWizardRoute
                    handleBackward={handleBackward}
                    handleForward={handleForward}
                    path={path}
                    WizardPage={WizardPage}
                    pageMetadata={pageMetadata}
                    personalDetails />
            </MemoryRouter>
        </Provider>
    );

    it('should contain WizardPage', () => {
        // then
        expect(wrapper.find(WizardPage)).toHaveLength(1);
    });

    it('should pass path to the Route', () => {
        // when
        const route = wrapper.find(Route);
        // then
        expect(route.props().path).toBe(path);
    });

    it('should pass handleForward and handleBackward to the WizardPage', () => {
        // when
        const page = wrapper.find(WizardPage);
        // then
        expect(page.props().handleBackward).not.toBeUndefined();
        expect(page.props().handleForward).not.toBeUndefined();
    });
});
