import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import hoistNonReactStatics from 'hoist-non-react-statics';
import useMultiCarJourney from './useMultiCarJourney';
import { trackView } from './trackData';
import { COMPONENT_TYPE } from './withEventTracking';

// only for HDOverlayPopup
const withViewTracking = (WrappedComponent, componentType) => {
    const Wrapper = React.forwardRef((props, ref) => {
        const {
            webAnalyticsView,
            onBeforeOpen,
            id,
            ...rest
        } = props;

        // return unchanged component when analytics data is not provided
        if (!webAnalyticsView) {
            return <WrappedComponent {...props} ref={ref} />;
        }

        const isMultiCar = useMultiCarJourney();

        const trackViewEvent = (event) => {
            trackView({
                ...webAnalyticsView,
                page_name: `${webAnalyticsView.page_name}${componentType === COMPONENT_TYPE.OVERLAY ? 'Overlay' : 'Modal'}`,
                page_section: `${webAnalyticsView.page_section} ${componentType === COMPONENT_TYPE.OVERLAY ? '- Overlay' : '- Modal'}`,
                element_id: id,
                sales_journey_type: isMultiCar ? 'multi_car' : 'single_car',
            });

            if (onBeforeOpen) {
                onBeforeOpen(event);
            }
        };

        const newProps = {
            ...WrappedComponent.defaultProps,
            id,
            onBeforeOpen: trackViewEvent,
            ...rest
        };

        return (
            <WrappedComponent {...newProps} ref={ref} />
        );
    });

    Wrapper.propTypes = {
        webAnalyticsView: PropTypes.shape({ page_name: PropTypes.string, page_section: PropTypes.string }),
        onBeforeOpen: PropTypes.func,
        id: PropTypes.string,

    };
    Wrapper.defaultProps = {
        onBeforeOpen: null,
        id: 'default-id',
        webAnalyticsView: null,
    };

    Wrapper.displayName = WrappedComponent.displayName;
    Wrapper.type = WrappedComponent.type;
    return hoistNonReactStatics(Wrapper, WrappedComponent);
};


withViewTracking.propTypes = {
    WrappedComponent: PropTypes.elementType.isRequired,
};

export default withViewTracking;
