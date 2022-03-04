import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as _ from 'lodash';
import useMultiCarJourney from './useMultiCarJourney';
import { trackEvent } from './trackData';

export const ACTION = {
    CHANGE: 'change', // dropdowns, button groups, inputs, async dropdowns, date picker, checkbox
    CLICK: 'click', // buttons
    FOCUS: 'focus', // inputs
    BLUR: 'blur', // inputs
    CONFIRM: 'confirm', // overlays
    CANCEL: 'cancel', // overlays
    OPEN: 'open', // overlays,
    SELECT: 'select', // table,
    EDIT: 'edit', // card
    DELETE: 'delete' // card
};

export const COMPONENT_TYPE = {
    INPUT: 'input',
    BUTTON: 'button',
    BUTTON_GROUP: 'button_group',
    DROPDOWN: 'dropdown',
    ASYNC_DROPDOWN: 'async_dopdown',
    OVERLAY: 'overlay',
    MODAL: 'modal',
    DATE_PICKER: 'date_picker',
    SWITCH: 'switch',
    TABLE: 'table',
    CHECKBOX: 'checkbox',
    TOAST: 'toast',
    CARD: 'card',
    RADIO_BUTTON_LIST: 'radio_button_list',
    CHECKBOX_BUTTON_LIST: 'checkbox_button_list',
    LABEL: 'label'
};

const withEventTracking = (WrappedComponent, componentType, eventActions) => {
    const Wrapper = React.forwardRef((props, ref) => {
        const {
            webAnalyticsEvent,
            onChange,
            onClick,
            onFocus,
            onBlur,
            onConfirm,
            onCancel,
            onBeforeOpen,
            onSelect,
            onEdit,
            onDelete,
            id,
            ...rest
        } = props;

        // return unchanged component when analytics data is not provided
        if (!webAnalyticsEvent) {
            return <WrappedComponent {...props} ref={ref} />;
        }

        const isMultiCar = useMultiCarJourney();

        const checkAction = (action, type) => {
            const open = `${type} open`;
            if (action === ACTION.OPEN) return open;
            return '';
        };


        const getValue = (event, action) => {
            switch (componentType) {
                case COMPONENT_TYPE.INPUT: return _.get(props, 'placeholder', '');
                case COMPONENT_TYPE.BUTTON: return _.get(event, 'target.value', '');
                case COMPONENT_TYPE.BUTTON_GROUP: return _.get(event, 'target.label', '');
                case COMPONENT_TYPE.DROPDOWN: return _.get(event, 'target.value.label', '');
                case COMPONENT_TYPE.ASYNC_DROPDOWN: return _.get(event, 'target.value.label', '');
                case COMPONENT_TYPE.OVERLAY: return _.get(event, 'target.value', checkAction(action, COMPONENT_TYPE.OVERLAY));
                case COMPONENT_TYPE.MODAL: return _.get(event, 'target.value', checkAction(action, COMPONENT_TYPE.MODAL));
                case COMPONENT_TYPE.DATE_PICKER: return 'Date';
                case COMPONENT_TYPE.SWITCH: return _.get(event, 'target.label', '');
                case COMPONENT_TYPE.TABLE: return _.get(event, 'target.value', '');
                case COMPONENT_TYPE.CHECKBOX: return _.get(event, 'target.checked', false) ? 'selected' : 'not selected';
                case COMPONENT_TYPE.CARD: return action === ACTION.DELETE ? 'delete' : 'edit';
                case COMPONENT_TYPE.RADIO_BUTTON_LIST: return _.get(event, 'target.label', '');
                case COMPONENT_TYPE.CHECKBOX_BUTTON_LIST:
                    return `${webAnalyticsEvent.eventValuePartial || _.get(event, 'target.label', '')} - ${_.get(event, 'target.prevChecked') ? 'deselected' : 'selected'}`;
                case COMPONENT_TYPE.LABEL: return _.get(event, 'target.innerText', '');
                default: return '';
            }
        };

        const trackActionEvent = (action, forwardEvent) => (event, ...otherProps) => {
            if (eventActions.includes(action)
                && `${componentType}_${action}` !== `${COMPONENT_TYPE.INPUT}_change`
                && `${componentType}_${action}` !== `${COMPONENT_TYPE.DATE_PICKER}_change`
            ) {
                let multiCarFlag = isMultiCar;
                if (webAnalyticsEvent && webAnalyticsEvent.sales_journey_type) {
                    multiCarFlag = (webAnalyticsEvent.sales_journey_type === 'multi_car');
                }
                trackEvent({
                    event_value: getValue(event, action),
                    event_type: `${componentType}_${action}`,
                    element_id: id,
                    sales_journey_type: multiCarFlag ? 'multi_car' : 'single_car',
                    ...((({ eventValuePartial, ...o }) => o)(webAnalyticsEvent)),
                });
            }
            if (forwardEvent) {
                forwardEvent(event, ...otherProps);
            }
        };

        const oldProps = {
            ...WrappedComponent.defaultProps,
            ...rest,
            id
        };

        const newProps = Object.assign({},
            (onFocus || eventActions.includes(ACTION.FOCUS)) && { onFocus: trackActionEvent(ACTION.FOCUS, onFocus) },
            (onBlur || eventActions.includes(ACTION.BLUR)) && { onBlur: trackActionEvent(ACTION.BLUR, onBlur) },
            (onChange || eventActions.includes(ACTION.CHANGE)) && { onChange: trackActionEvent(ACTION.CHANGE, onChange) },
            (onClick || eventActions.includes(ACTION.CLICK)) && { onClick: trackActionEvent(ACTION.CLICK, onClick) },
            (onCancel || eventActions.includes(ACTION.CANCEL)) && { onCancel: trackActionEvent(ACTION.CANCEL, onCancel) },
            (onConfirm || eventActions.includes(ACTION.CONFIRM)) && { onConfirm: trackActionEvent(ACTION.CONFIRM, onConfirm) },
            (onBeforeOpen || eventActions.includes(ACTION.OPEN)) && { onBeforeOpen: trackActionEvent(ACTION.OPEN, onBeforeOpen) },
            (onSelect || eventActions.includes(ACTION.SELECT)) && { onSelect: trackActionEvent(ACTION.SELECT, onSelect) },
            (onEdit && eventActions.includes(ACTION.EDIT)) && { onEdit: trackActionEvent(ACTION.EDIT, onEdit) },
            (onDelete && eventActions.includes(ACTION.DELETE)) && { onDelete: trackActionEvent(ACTION.DELETE, onDelete) });

        return (
            <WrappedComponent {...WrappedComponent.defaultProps} {...oldProps} {...newProps} ref={ref} />
        );
    });

    Wrapper.propTypes = {
        webAnalyticsEvent: PropTypes.shape({ sales_journey_type: PropTypes.string }),
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func,
        onBeforeOpen: PropTypes.func,
        onSelect: PropTypes.func,
        onEdit: PropTypes.func,
        onDelete: PropTypes.func,
        id: PropTypes.string,
    };
    Wrapper.defaultProps = {
        onChange: null,
        onClick: null,
        onFocus: null,
        onBlur: null,
        onCancel: null,
        onConfirm: null,
        onBeforeOpen: null,
        onSelect: null,
        onEdit: null,
        onDelete: null,
        id: 'default-id',
        webAnalyticsEvent: null,
    };
    Wrapper.displayName = WrappedComponent.displayName;
    Wrapper.type = WrappedComponent.type;
    return hoistNonReactStatics(Wrapper, WrappedComponent);
};


withEventTracking.propTypes = {
    WrappedComponent: PropTypes.elementType.isRequired,
    eventActions: PropTypes.arrayOf(PropTypes.string),
};

withEventTracking.defaultProps = {
    eventAction: null
};


export default withEventTracking;
