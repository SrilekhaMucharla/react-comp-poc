import { useCallback } from 'react';
import { trackEvent, trackView } from './trackData';
import { COMPONENT_TYPE, ACTION } from './withEventTracking';
import useMultiCarJourney from './useMultiCarJourney';

const useTrackOnToastAdd = () => {
    const isMultiCar = useMultiCarJourney();
    return useCallback((toast) => {
        trackEvent({
            ...toast.webAnalyticsEvent,
            event_type: `${COMPONENT_TYPE.TOAST}_${ACTION.OPEN}`,
            element_id: toast.id || 'default-id',
            event_value: `${toast.webAnalyticsEvent ? `${toast.webAnalyticsEvent.event_value} - ` : ''}Toast`,
            sales_journey_type: isMultiCar ? 'multi_car' : 'single_car',
        });
        trackView({
            ...toast.webAnalyticsView,
            page_section: `${toast.webAnalyticsView ? `${toast.webAnalyticsView.page_section} - ` : ''}Toast`,
            element_id: toast.id || 'default-id',
            sales_journey_type: isMultiCar ? 'multi_car' : 'single_car',
        });
    }, [isMultiCar]);
};

export default useTrackOnToastAdd;
