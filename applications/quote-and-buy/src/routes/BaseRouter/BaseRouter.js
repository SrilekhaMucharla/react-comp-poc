import React, { useState, useEffect } from 'react';
import {
    Route, Switch, Redirect, useHistory, useLocation
} from 'react-router-dom';
import {
    INTRO, TIMEOUT_PAGE, GETAPRICE, ROOT, DOB_INTERSTITIAL, STORYBOOK, QUOTE_RETRIEVE, MC_DOB_INTERSTITIAL, DOWNLOAD_PAGE
} from './RouteConst';
import Header from '../../pages/Controls/Header/Header';
import Footer from '../../pages/Controls/Footer/Footer';
import baseRouterConfig from './BaseRouterConfig';
// eslint-disable-next-line import/no-named-as-default
import HDWizardRouter from '../WizardRouter/HDWizardRouter';
import useViewTracking from '../../web-analytics/useViewTracking';
import useMonetateTracking from './monetateTracker';
import HastingsDOBInterstitialPage from '../../pages/HastingsDOBInterstitialPage/HastingsDOBInterstitialPage';
import HastingsMCDOBInterstitialPage from '../../pages/HastingsMCDOBInterstitialPage/HastingsMCDOBInterstitialPage';
import Storybook from '../../app/Storybook';
import HDQuoteRetrievePage from '../../pages/HDQuoteRetrievePage/HDQuoteRetrievePage';
import HastingsInterstitialPageHelper from '../../pages/HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';

import HDTimeoutPage from '../../pages/HDTimeoutPage/HDTimeoutPage';
import HDTimeoutModal from '../../pages/HDTimeoutModal/HDTimeoutModal';
import HDInvalidURLErrorPage from '../../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';
import ErrorHandler from '../../HDErrorHandler/ErrorHandler';
import PrivateRoute from './PrivateRoute';
import HDDownloadPage from '../../pages/HDDownloadPage/HDDownloadPage';

const BaseRouter = () => {
    const history = useHistory();
    const { pathname, search } = useLocation();
    const [isMusticar, setIsMulticar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (search) {
            const paramsObj = HastingsInterstitialPageHelper.parseQueryParams(search);
            if (paramsObj.quoteID && paramsObj.quoteID.split('')[0] === '5') {
                setIsMulticar(true);
            }
        }
    }, []);

    const wizardRoutes = baseRouterConfig.map((config) => (
        <Route
            key={config.id}
            exact
            path={config.path}
            render={(props) => (
                <config.BaseRouterPage
                    {...props}
                    pageMetadata={config.pageMetadata}
                    pageId={config.id} />
            )} />
    ));
    useViewTracking(history, baseRouterConfig);
    useMonetateTracking(location);

    return (
        <>
            <Header quote />
            <ErrorHandler>
                <Switch>
                    <Redirect
                        from="/:url*(/+)"
                        to={{
                            pathname: pathname.slice(0, -1),
                            search: location.search,
                            state: location.state
                        }} />
                    <Route exact path={ROOT} render={() => <Redirect exact to={INTRO} push />} />
                    {wizardRoutes}
                    <PrivateRoute path={GETAPRICE} component={HDWizardRouter} />
                    <Route exact path={DOB_INTERSTITIAL} component={isMusticar ? HastingsMCDOBInterstitialPage : HastingsDOBInterstitialPage} />
                    <Route exact path={MC_DOB_INTERSTITIAL} component={HastingsMCDOBInterstitialPage} />
                    <Route exact path={QUOTE_RETRIEVE} component={HDQuoteRetrievePage} />
                    <Route exact path={TIMEOUT_PAGE} component={HDTimeoutPage} />
                    <Route path={`${DOWNLOAD_PAGE}/:pageName/:documentUUID/:referenceNumber/:sessionUUID`} component={HDDownloadPage} />
                    <Route component={HDInvalidURLErrorPage} />
                </Switch>
            </ErrorHandler>
            <Footer name="Hastings Insurance Services Limited" />
            <HDTimeoutModal />
        </>
    );
};

export default BaseRouter;
