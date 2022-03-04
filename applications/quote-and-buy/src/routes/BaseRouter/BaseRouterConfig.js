// eslint-disable-next-line import/no-named-as-default
import HastingsDirectIntroCarPage from '../../pages/HastingsDirectIntroCarPage/HastingsDirectIntroCarPage';
import {
    INTRO, VRN_SEARCH_PAGE, CUSTOMIZE_QUOTE_WIZARD,
    INTERSTITIAL, PRIMER_YOUDRIVE, ABOUT_MC_COVER,
    MC_CUSTOMIZE_QUOTE_WIZARD
} from './RouteConst';

import HDVRNSearchPage from '../../pages/HDVRNSearchPage/HDVRNSearchPage';
import HDCustomizeQuoteWizard from '../../pages/HDCustomizeQuoteWizard/HDCustomizeQuoteWizard';
import HastingsInterstitialPage from '../../pages/HastingsInterstitialPageContainer/HastingsInterstitialPage';
import HDPrimerYouDrivePage from '../../pages/wizard-pages/HDPrimerYouDrivePage/HDPrimerYouDrivePage';
import HDMCIntroPage from '../../pages/HDMCIntroPage/HDMCIntroPage';
import HDMCCustomizeQuoteWizard from '../../pages/HDMCCustomizeQuoteWizard/HDMCCustomizeQuoteWizard';

export default [
    {
        id: 'HastingsDirectIntroCar',
        BaseRouterPage: HastingsDirectIntroCarPage,
        path: INTRO,
    },
    {
        id: 'HastingsDirectInterstitial',
        BaseRouterPage: HastingsInterstitialPage,
        path: INTERSTITIAL,
    },
    {
        id: 'HastingsMCIntro',
        BaseRouterPage: HDMCIntroPage,
        path: ABOUT_MC_COVER,
    },
    {
        id: 'HastingsDirectVRNSearch',
        BaseRouterPage: HDVRNSearchPage,
        path: VRN_SEARCH_PAGE,
    },
    {
        id: 'HDPrimerYouDrive',
        BaseRouterPage: HDPrimerYouDrivePage,
        path: PRIMER_YOUDRIVE,
    },
    {
        id: 'HastingsDirectCustomizeQuoteWizard',
        BaseRouterPage: HDCustomizeQuoteWizard,
        path: CUSTOMIZE_QUOTE_WIZARD,
    },
    {
        id: 'HDMCCustomizeQuoteWizard',
        BaseRouterPage: HDMCCustomizeQuoteWizard,
        path: MC_CUSTOMIZE_QUOTE_WIZARD,
    }
].map((config) => ({
    ...config,
    pageMetadata: {
        page_name: config.id,
        page_type: 'Car Insurance - T&L'
    }
}));
