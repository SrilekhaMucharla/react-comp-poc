import React from 'react';
import { shallow, mount } from 'enzyme';
import { COMPONENT_TYPE } from '../withEventTracking';
import withViewTracking from '../withViewTracking';

const mockedView = jest.fn();
global.utag = {
    view: mockedView,
};
describe('withViewTracking HOC', () => {
    // given
    const Component = (props) => <div {...props}>wrapped component</div>;
    const webAnalyticsView = { page_section: 'Page Section' };
    const componentId = 'component-id';

    const getWrapper = (props, type) => {
        const WrappedComponent = withViewTracking(Component, type);
        return mount(<WrappedComponent
            webAnalyticsView={webAnalyticsView}
            id={componentId}
            {...props} />);
    };
    it('should return original WrappedComponent if webAnalyticsView was not provided', () => {
        // given
        const onBeforeOpen = jest.fn();
        const WrappedComponent = withViewTracking(Component, COMPONENT_TYPE.OVERLAY);
        const wrapper = shallow(<WrappedComponent onBeforeOpen={onBeforeOpen} />);
        // then
        expect(wrapper.props().onBeforeOpen).toBe(onBeforeOpen);
    });

    it('should track event for open action', () => {
        // given
        const onBeforeOpen = jest.fn();
        const type = COMPONENT_TYPE.OVERLAY;
        const wrapper = getWrapper({ onBeforeOpen }, type);
        const mockedEvent = {
            target: {
                value: 'test value'
            }
        };
        // when
        wrapper.find(Component).props().onBeforeOpen(mockedEvent);
        // then
        expect(mockedView).toHaveBeenCalledWith({
            ...webAnalyticsView,
            element_id: componentId,
            sales_journey_type: 'single_car',
            page_name: 'undefinedOverlay',
            page_section: `${webAnalyticsView.page_section} - Overlay`
        });
        expect(onBeforeOpen).toHaveBeenCalledWith(mockedEvent);
    });
});
