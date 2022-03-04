/* eslint-disable camelcase */
import { trackEvent } from './trackData';

const homeRenewalEventTracking = (data) => {
    const {
        element_id, event_action, event_value, renewal_type, renewal_month
    } = data;
    trackEvent({
        ...data,
        element_id: (element_id) || 'custom-element',
        event_action: (event_action) || 'custom-value',
        event_value: (event_value) || 'custom-label',
        renewal_type: (renewal_type) || 'Home',
        renewal_month: (renewal_month) || 'Sample_Year'
    });
};

export default homeRenewalEventTracking;
