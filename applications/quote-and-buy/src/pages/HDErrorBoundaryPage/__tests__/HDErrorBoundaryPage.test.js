import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HDLabelRefactor } from 'hastings-components';
import HDErrorBoundaryPage from '../HDErrorBoundaryPage';

const oldWindowLocation = window.location;
async function initializeWrapper(props, tempLocation = {}) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <MemoryRouter initialEntries={[tempLocation]}>
                <HDErrorBoundaryPage {...props} />
            </MemoryRouter>
        );
    });
    wrapper.update();
    return wrapper;
}

describe('HDErrorBoundaryPage', () => {
    beforeAll(() => {
        delete window.location;
        window.location = Object.defineProperties(
            {},
            {
                ...Object.getOwnPropertyDescriptors(oldWindowLocation),
                assign: {
                    configurable: true,
                    value: jest.fn(),
                },
            },
        );
    });
    afterAll(() => {
        window.location = oldWindowLocation;
    });
    it('should render component with default props', async () => {
        const wrapper = await initializeWrapper();
        expect(wrapper.find(HDLabelRefactor)).toHaveLength(2);
        expect(wrapper.find('#home-page-button')).toHaveLength(4);
    });
    it('should render component with props', async () => {
        const props = {
            error: 'test',
            errorInfo: 'testErrorInfo'
        };
        const wrapper = await initializeWrapper(props);
        expect(wrapper.find('h4').text()).toEqual(props.error);
        expect(wrapper.find('p').text()).toEqual(props.errorInfo);
    });
    it('should redirect to app homepage on clicking button Go back to the homepage', async () => {
        const wrapper = await initializeWrapper();
        const button = wrapper.find({ 'data-testid': 'goto-home-buttton' }).at(1);
        await act(async () => button.simulate('click'));
        await act(async () => wrapper.update());
        expect(window.location.assign).toHaveBeenCalledWith('https://hastingsdirect.com');
    });
});
