import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getTopDocuments, searchByTerm } from '../faqHelper';
import HDFaq from '../HDFaq';
import createPortalRoot from '../../../wizard-pages/__helpers__/test/createPortalRoot';

jest.mock('../faqHelper');

describe('<HDFaq />', () => {
    createPortalRoot();

    const initialState = {
        epticaId: 854
    };

    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const store = mockStore(initialState);

    const wrapper = mount(
        <Provider store={store}>
            <HDFaq />
        </Provider>
    );

    it('should render correctly and match the snapshot', () => {
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly and match the snapshot when FAQ is in popup', () => {
        const anotherWrapper = mount(
            <Provider store={store}>
                <HDFaq isInPopup />
            </Provider>
        );
        // then
        expect(anotherWrapper).toMatchSnapshot();
    });

    it('should display top questions when popup is open', async () => {
        getTopDocuments.mockReturnValue(Promise.resolve([{ header: 'Header', content: 'Content' }]));

        const helpIcon = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            helpIcon.simulate('click');
        });
        wrapper.update();

        // then
        expect(wrapper.find('.overlay')).toBeDefined();
        expect(getTopDocuments).toBeCalled();
    });

    it('should display questions filtered by search term', async () => {
        searchByTerm.mockReturnValue(Promise.resolve([{ header: 'Header', content: 'Content' }]));

        const helpIcon = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            helpIcon.simulate('click');
        });
        wrapper.update();

        const searchInput = wrapper.find('input').at(0);
        await act(async () => {
            searchInput.simulate('change', { target: { value: 'payment' } });
        });
        wrapper.update();

        // then
        setTimeout(() => {
            expect(searchByTerm).toBeCalled();
        }, 1000);
    });

    it('should display error when Eptica is down', async () => {
        getTopDocuments.mockReturnValue(Promise.reject());

        const helpIcon = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            helpIcon.simulate('click');
        });
        wrapper.update();
        const errorBox = wrapper.find('.error-box').at(0);

        // then
        expect(getTopDocuments).toBeCalled();
        expect(errorBox).toBeDefined();
    });
});
