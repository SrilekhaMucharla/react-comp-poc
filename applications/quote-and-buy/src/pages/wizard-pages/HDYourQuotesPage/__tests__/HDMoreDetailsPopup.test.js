import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HDLabelRefactor } from 'hastings-components';
import HDMoreDetailsPopup from '../HDMoreDetailsPopup';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import { PAYMENT_TYPE_MONTHLY_CODE } from '../../../../constant/const';

const pageMetadataMock = { page_name: 'test', page_type: 'test', sales_journey_type: 'multi_car' };

describe('<HDMoreDetailsPopup />', () => {
    createPortalRoot();

    const initialState = {
        brandCode: 'HD',
        coverType: 'Comprehensive',
        startDate: { value: { day: 2, month: 10, year: 2021 } },
        endDate: { value: { day: 2, month: 10, year: 2022 } },
        paymentType: PAYMENT_TYPE_MONTHLY_CODE,
        coverages: [{ HD: {} }],
        pageMetadata: pageMetadataMock,
        driversList: [{ displayName: 'Something' }],
        brandName: 'Hastings Direct',
        registrationNumber: 'AV12BGE',
        hastingsPremium: { monthlyPayment: { amount: 200 } },
        isYoungAndInexpDriver: false
    };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    const wrapper = mount(
        <Provider store={store}>
            <HDMoreDetailsPopup pageMetadata={pageMetadataMock} />
        </Provider>
    );

    it('should render correctly', () => {
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly and match the snapshot', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDMoreDetailsPopup pageMetadata={pageMetadataMock} {...initialState} />
            </Provider>
        );
        // then
        expect(anotherWrapper).toMatchSnapshot();
    });
    it('should contain HDOverlayPopup', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDMoreDetailsPopup pageMetadata={pageMetadataMock} {...initialState} />
            </Provider>
        );
        expect(anotherWrapper.find('HDOverlayPopup[labelText="Your policy details"]')).toBeTruthy();
    });
    it('should contain HDLabelRefactor', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDMoreDetailsPopup pageMetadata={pageMetadataMock} {...initialState} />
            </Provider>
        );
        expect(anotherWrapper.find(HDLabelRefactor)).toHaveLength(1);
    });
});
