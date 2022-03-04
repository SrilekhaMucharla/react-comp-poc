import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HDVoluntaryExcessPopup from '../HDVoluntaryExcessPopup';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const pageMetadataMock = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

describe('<HDVoluntaryExcessPopup />', () => {
    createPortalRoot();

    const initialState = { pageMetadata: pageMetadataMock };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    const wrapper = mount(
        <Provider store={store}>
            <HDVoluntaryExcessPopup pageMetadata={pageMetadataMock} />
        </Provider>
    );

    it('should render correctly', () => {
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly and match the snapshot', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDVoluntaryExcessPopup pageMetadata={pageMetadataMock} />
            </Provider>
        );
        // then
        expect(anotherWrapper).toMatchSnapshot();
    });
});
