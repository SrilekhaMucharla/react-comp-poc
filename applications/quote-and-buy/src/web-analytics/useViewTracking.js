import { useState, useEffect } from 'react';
import _ from 'lodash';
import { trackView } from './trackData';
import useMultiCarJourney from './useMultiCarJourney';
import {
    INTRO,
    MC_CUSTOMIZE_QUOTE_WIZARD, POLICY_START_DATE, VRN_SEARCH_PAGE, YOUR_QUOTES
} from '../routes/BaseRouter/RouteConst';
import routes from '../routes/WizardRouter/RouteConst';
import getErrorString from './getErrorString';
import getErrorDescription from './getErrorDescription';
import useErrorStatus from './useErrorStatus';

const useViewTracking = (history, routingConfig, basename) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [prevPathname, setPathname] = useState('');

    const isMultiCar = useMultiCarJourney();
    const errorStatus = useErrorStatus();
    let locationState = history.location.state;

    const trackJourneyType = (pathname) => {
        let multiCarString = (isMultiCar) ? 'multi_car' : 'single_car';
        const waMultiFlag = _.get(locationState, 'waMultiFlag', undefined);
        if (locationState && waMultiFlag) multiCarString = 'multi_car';
        if (pathname === POLICY_START_DATE || pathname === YOUR_QUOTES || pathname === routes.PROMOTION || pathname === INTRO) {
            multiCarString = 'single_car';
        }
        return multiCarString;
    };

    const trackPageLoad = (pathname, isAdditionalDriver) => {
        setPathname(pathname);
        const pageConfig = routingConfig.find((config) => (basename ? `${basename}${config.path}` === pathname : config.path === pathname));
        if (!pageConfig) return;
        const { pageMetadata } = pageConfig;

        let dataObj = {
            ...pageMetadata,
            page_section: 'Page',
            page_name: pageConfig.personalDetails ? `${pageMetadata.page_name}_${isAdditionalDriver ? 'AD' : 'MD'}` : pageMetadata.page_name,
            sales_journey_type: trackJourneyType(pathname)
        };

        if (errorStatus || (locationState && locationState.error)) {
            const error = errorStatus || locationState.error;

            dataObj = {
                ...dataObj,
                error_type: getErrorString(error),
                error_description: getErrorDescription(error)
            };
        }

        if (locationState && locationState.periodDates) {
            const { startDate, endDate } = locationState?.periodDates;
            dataObj = {
                ...dataObj,
                cover_start_date: startDate,
                cover_end_date: endDate,
            };
        }

        trackView(dataObj);
    };

    // history.listen is not triggered on the first load, so track the initial load
    useEffect(() => {
        if (!initialLoad) {
            const { pathname } = history.location;
            setInitialLoad(true);
            trackPageLoad(pathname);
        }
    }, []);

    // avoid sending data multiple times for the same page load (multi rerendering issue on pages)
    useEffect(() => {
        return history.listen((location) => {
            const { pathname } = location;
            const isAdditionalDriver = !_.get(location, 'state.isPolicyHolder', true);
            const newState = _.get(location, 'state', undefined);
            if (newState) locationState = newState;
            if (prevPathname !== pathname && pathname !== MC_CUSTOMIZE_QUOTE_WIZARD && pathname !== VRN_SEARCH_PAGE) {
                trackPageLoad(pathname, isAdditionalDriver);
            }
        });
    }, [history]);
};

export default useViewTracking;
