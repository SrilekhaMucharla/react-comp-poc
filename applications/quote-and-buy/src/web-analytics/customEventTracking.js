/* eslint-disable camelcase */
import { trackEvent } from './trackData';

const customEventTracking = (data) => {
    const {
        element_id, event_action, event_type, event_value, sales_journey_type
    } = data;
    trackEvent({
        ...data,
        element_id: (element_id) || 'custom-element',
        event_action: (event_action) || 'custom-value',
        event_type: (event_type) || 'custom_type',
        event_value: (event_value) || 'custom-label',
        sales_journey_type: (sales_journey_type) || 'single_car'
    });
};

export default customEventTracking;
