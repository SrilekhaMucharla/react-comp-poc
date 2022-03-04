import React from 'react';
import { mount } from 'enzyme';
import {
    Route, Switch, useHistory, MemoryRouter, Link
} from 'react-router-dom';
import useViewTracking from '../useViewTracking';

jest.mock('../useErrorStatus', () => () => jest.fn());

const mockedView = jest.fn();
global.utag = {
    view: mockedView,
};

describe('useViewTracking HOOK', () => {
    // given
    const mockedConfig = [{
        id: '1',
        path: '/path-1',
        component: () => (
            <div>
                    Component 1
                <Link to="path-2" id="click-1" />
            </div>
        ),
        pageMetadata: {
            page_name: '1',
            page_type: 'Page Type',
            sales_journey_type: 'single_car'
        }

    },
    {
        id: '2',
        path: '/path-2',
        component: () => (
            <div>
            Component 2
                <Link to="path-1" id="click-2" />
            </div>
        ),
        pageMetadata: {
            page_name: '2',
            page_type: 'Page Type',
            sales_journey_type: 'single_car'
        }
    },
    ];
    const MockedComponent = () => {
        const history = useHistory();
        const wizardRoutes = mockedConfig.map(
            (config) => <Route key={config.id} exact path={config.path} render={config.component} />
        );
        useViewTracking(history, mockedConfig);
        return (
            <Switch>
                {wizardRoutes}
            </Switch>
        );
    };
    const getWrapper = () => mount(
        <MemoryRouter initialEntries={[mockedConfig[0].path]}>
            <MockedComponent />
        </MemoryRouter>
    );

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should track data on initial load', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('div')).toHaveLength(1);
        expect(wrapper.find('div').text()).toBe('Component 1');
        expect(mockedView).toBeCalledWith({
            ...mockedConfig[0].pageMetadata, page_section: 'Page', error_description: null, error_type: null
        });
    });

    it('should track data on location change', () => {
        // given
        const wrapper = getWrapper();
        // when
        // https://github.com/enzymejs/enzyme/issues/516#issue-167924470
        wrapper.find('a').simulate('click', { button: 0 });
        // then
        wrapper.update();
        expect(mockedView).lastCalledWith({
            ...mockedConfig[1].pageMetadata, page_section: 'Page', error_description: null, error_type: null,
        });
        expect(wrapper.find('div')).toHaveLength(1);
        expect(wrapper.find('div').text()).toBe('Component 2');
    });
});
