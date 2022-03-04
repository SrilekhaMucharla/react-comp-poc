import React from 'react';
import { shallow, mount } from 'enzyme';
import withEventTracking, { ACTION, COMPONENT_TYPE } from '../withEventTracking';

const mockedLink = jest.fn();
global.utag = {
    link: mockedLink,
};
describe('withEventTracking HOC', () => {
    // given
    const Component = (props) => <div {...props}>wrapped component</div>;
    const webAnalyticsEvent = { analytics: 'some analytics data' };
    const componentId = 'component-id';
    const componentType = 'custom_type';

    const getWrapper = (props, actions, type = componentType) => {
        const WrappedComponent = withEventTracking(Component, type, actions);
        return mount(<WrappedComponent
            webAnalyticsEvent={webAnalyticsEvent}
            id={componentId}
            {...props} />);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return original WrappedComponent if webAnalyticsEvent was not provided', () => {
        // given
        const onClick = jest.fn();
        const WrappedComponent = withEventTracking(Component, componentType, []);
        const wrapper = shallow(<WrappedComponent onClick={onClick} />);
        // then
        expect(wrapper.props().onClick).toBe(onClick);
    });

    it('should track event for change action', () => {
        // given
        const onChange = jest.fn();
        const action = ACTION.CHANGE;
        const type = COMPONENT_TYPE.DROPDOWN;
        const mockedEvent = {
            target: {
                value: { label: 'test value' }
            }
        };
        const wrapper = getWrapper({ onChange }, [action], type);
        // when
        wrapper.find(Component).props().onChange(mockedEvent);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: mockedEvent.target.value.label,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onChange).toHaveBeenCalledWith(mockedEvent);
    });

    it('should track event for click action', () => {
        // given
        const onClick = jest.fn();
        const action = ACTION.CLICK;
        const type = COMPONENT_TYPE.BUTTON;
        const mockedEvent = {
            target: {
                value: 'test value'
            }
        };
        const wrapper = getWrapper({ onClick }, [action], type);
        // when
        wrapper.find(Component).props().onClick(mockedEvent);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: mockedEvent.target.value,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onClick).toHaveBeenCalledWith(mockedEvent);
    });

    it('should track event for focus action', () => {
        // given
        const onFocus = jest.fn();
        const action = ACTION.FOCUS;
        const type = COMPONENT_TYPE.INPUT;
        const placeholder = 'input placeholder';
        const wrapper = getWrapper({ onFocus, placeholder }, [action], type);
        // when
        wrapper.find(Component).props().onFocus();
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: placeholder,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onFocus).toHaveBeenCalled();
    });

    it('should track event for blur action', () => {
        // given
        const onBlur = jest.fn();
        const action = ACTION.BLUR;
        const type = COMPONENT_TYPE.INPUT;
        const placeholder = 'input placeholder';
        const wrapper = getWrapper({ onBlur, placeholder }, [action], type);
        // when
        wrapper.find(Component).props().onBlur();
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: placeholder,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onBlur).toHaveBeenCalled();
    });


    it('should track event for confirm action', () => {
        // given
        const onConfirm = jest.fn();
        const action = ACTION.CONFIRM;
        const type = COMPONENT_TYPE.OVERLAY;
        const wrapper = getWrapper({ onConfirm }, [action], type);
        const mockedEvent = {
            target: {
                value: 'test value'
            }
        };
        // when
        wrapper.find(Component).props().onConfirm(mockedEvent);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: mockedEvent.target.value,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onConfirm).toHaveBeenCalledWith(mockedEvent);
    });

    it('should track event for cancel action', () => {
        // given
        const onCancel = jest.fn();
        const action = ACTION.CANCEL;
        const type = COMPONENT_TYPE.OVERLAY;
        const wrapper = getWrapper({ onCancel }, [action], type);
        const mockedEvent = {
            target: {
                value: 'test value'
            }
        };
        // when
        wrapper.find(Component).props().onCancel(mockedEvent);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: mockedEvent.target.value,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onCancel).toHaveBeenCalledWith(mockedEvent);
    });

    it('should track event for open action', () => {
        // given
        const onBeforeOpen = jest.fn();
        const action = ACTION.OPEN;
        const type = COMPONENT_TYPE.OVERLAY;
        const wrapper = getWrapper({ onBeforeOpen }, [action], type);
        const mockedEvent = {
            target: {
                value: 'Overlay open'
            }
        };
        // when
        wrapper.find(Component).props().onBeforeOpen(mockedEvent);
        // then
        expect(mockedLink).toHaveBeenCalledWith({
            event_value: mockedEvent.target.value,
            element_id: componentId,
            event_type: `${type}_${action}`,
            sales_journey_type: 'single_car',
            ...webAnalyticsEvent
        });
        expect(onBeforeOpen).toHaveBeenCalledWith(mockedEvent);
    });
});
