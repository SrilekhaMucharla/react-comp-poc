import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import Header from '../../../pages/Controls/Header/Header';
import Footer from '../../../pages/Controls/Footer/Footer';
import BaseRouter from '../BaseRouter';
import {
    INTRO,
    GETAPRICE,
    DOB_INTERSTITIAL,
    // STORYBOOK,
    QUOTE_RETRIEVE,
    VRN_SEARCH_PAGE,
    CUSTOMIZE_QUOTE_WIZARD,
    INTERSTITIAL,
    PRIMER_YOUDRIVE,
    ABOUT_MC_COVER,
    TIMEOUT_PAGE,
    MC_DOB_INTERSTITIAL
} from '../RouteConst';

jest.mock('../../../web-analytics/useViewTracking', () => () => jest.fn());

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: ''
    }),
    useHistory: () => ({
        location: {
            state: {
                waMultiFlag: false
            }
        }
    })
}));
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn()
}));


describe('BaseRouter', () => {
    // given
    const wrapper = shallow(<BaseRouter />);

    it('should render correctly and match the snapshot', () => {
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render Header and Footer', () => {
        // then
        expect(wrapper.find(Header)).toHaveLength(1);
        expect(wrapper.find(Footer)).toHaveLength(1);
    });

    it('should have all the routes', () => {
        // when
        const routes = wrapper.find(Route);
        // then
        expect(routes).toHaveLength(14);
    });

    it('should contain HastingsInterstitialPage', () => {
        // when
        const route = wrapper.find({ path: INTERSTITIAL });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDQuoteRetrievePage', () => {
        // when
        const route = wrapper.find({ path: QUOTE_RETRIEVE });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HastingsDirectIntroCarPage', () => {
        // when
        const route = wrapper.find({ path: INTRO });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDVRNSearchPage', () => {
        // when
        const route = wrapper.find({ path: VRN_SEARCH_PAGE });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDTimeoutPage', () => {
        // when
        const route = wrapper.find({ path: TIMEOUT_PAGE });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDTimeoutPage', () => {
        // when
        const route = wrapper.find({ path: MC_DOB_INTERSTITIAL });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDCustomizeQuoteWizard', () => {
        // when
        const route = wrapper.find({ path: CUSTOMIZE_QUOTE_WIZARD });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDWizardRouter', () => {
        // when
        const route = wrapper.find({ path: GETAPRICE });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDMCIntroPage', () => {
        // when
        wrapper.debug();
        const route = wrapper.find({ path: ABOUT_MC_COVER });
        // then
        expect(route).toHaveLength(1);
    });

    // it('should contain Storybook', () => {
    //     // when
    //     const route = wrapper.find({ path: STORYBOOK });
    //     // then
    //     expect(route).toHaveLength(1);
    // });

    it('should contain HastingsDOBInterstitialPage', () => {
        // when
        const route = wrapper.find({ path: DOB_INTERSTITIAL });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HastingsDirectInterstitial', () => {
        // when
        const route = wrapper.find({ path: INTERSTITIAL });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDPrimerYouDrivePage', () => {
        // when
        const route = wrapper.find({ path: PRIMER_YOUDRIVE });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDCustomizeQuoteWizard', () => {
        // when
        const route = wrapper.find({ path: CUSTOMIZE_QUOTE_WIZARD });
        // then
        expect(route).toHaveLength(1);
    });

    it('should contain HDCustomizeQuoteWizard', () => {
        // when
        const route = wrapper.find({ path: CUSTOMIZE_QUOTE_WIZARD });
        // then
        expect(route).toHaveLength(1);
    });


    it('should contain HDMCIntroPage', () => {
        // when
        const route = wrapper.find({ path: ABOUT_MC_COVER });
        // then
        expect(route).toHaveLength(1);
    });
});
