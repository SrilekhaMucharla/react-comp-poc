import React from 'react';
import { shallow } from 'enzyme';
import HastingsInterstitialRatingsWizardComponent from '../HastingsInterstitialRatingsWizardComponent';

describe('<HastingsInterstitialRatingsWizardComponent />', () => {
    test('render component with HD brand', () => {
        const wrapper = shallow(
            <HastingsInterstitialRatingsWizardComponent brand="HD" />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('render component with HE brand', () => {
        const wrapper = shallow(
            <HastingsInterstitialRatingsWizardComponent brand="HE" />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('render component without brand', () => {
        const wrapper = shallow(
            <HastingsInterstitialRatingsWizardComponent />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
