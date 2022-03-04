import React from 'react';
import { HDStepper } from 'hastings-components';
import { shallow } from 'enzyme';
import RemoveDriverRibbon from '../../../pages/wizard-pages/HDAddAnotherDriverPage/RemoveDriverRibbon';
import { getWizardConfig, getCurrentPageConfig } from '../HDWizardConfig';
import HDWizardStepper from '../HDWizardStepper';
import routes from '../RouteConst';

describe('HDWizardStepper', () => {
    // given
    const wizardConfig = getWizardConfig(false);
    const pathname = getCurrentPageConfig.path;
    const isPolicyHolder = false;
    const location = { state: { isPolicyHolder }, pathname };
    const getWrapper = (props = {}) => shallow(
        <HDWizardStepper
            location={location}
            {...props} />
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDStepper', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find(HDStepper)).toHaveLength(1);
    });

    it('should have proper steps forwarded to HDStepper', () => {
        // given
        const stepperSteps = Array.from(new Set(Object.values(wizardConfig.flatMap((config) => (config.stepper || [])))));
        const wrapper = getWrapper();
        // then
        expect(wrapper.find(HDStepper).props().steps).toStrictEqual(stepperSteps);
    });

    it('should have proper currentStep forwarded to HDStepper', () => {
        // given
        const currentStep = getCurrentPageConfig.stepper;
        const wrapper = getWrapper();
        // then
        expect(wrapper.find(HDStepper).props().currentStep).toBe(currentStep);
    });

    it('should show driver ribbon when current step have personalDetails set to true', () => {
        // given
        const mockedConfig = wizardConfig.find((config) => config.personalDetails);
        const mockedPathName = mockedConfig.path;
        const wrapper = getWrapper({ location: { ...location, pathname: mockedPathName } });
        // then
        expect(wrapper.find(RemoveDriverRibbon)).toHaveLength(1);
    });

    it('should not show ribbon when current step have personalDetails set to true', () => {
        // given
        const mockedConfig = wizardConfig.find((config) => !config.personalDetails);
        const mockedPathName = mockedConfig.path;
        const wrapper = getWrapper({ location: { ...location, pathname: mockedPathName } });
        // then
        expect(wrapper.find(RemoveDriverRibbon)).toHaveLength(0);
    });

    it('should show ribbon when current page is DRIVER_NAME and it is for another driver', () => {
        // given
        const mockedConfig = wizardConfig.find((config) => config.path === routes.DRIVER_NAME);
        const mockedPathName = mockedConfig.path;
        const wrapper = getWrapper({ location: { ...location, pathname: mockedPathName } });
        // then
        expect(wrapper.find(RemoveDriverRibbon)).toHaveLength(1);
    });


    it('should not show ribbon when current page is DRIVER_NAME and it is not for another driver', () => {
        // given
        const mockedstate = { driverIndex: 0 };
        const mockedConfig = wizardConfig.find((config) => config.path === routes.DRIVER_NAME);
        const mockedPathName = mockedConfig.path;
        const wrapper = getWrapper({ location: { pathname: mockedPathName, state: mockedstate } });
        // then
        expect(wrapper.find(RemoveDriverRibbon)).toHaveLength(0);
    });

    it('should not show ribbon when current page is ADD_ANOTHER_DRIVER', () => {
        // given
        const mockedConfig = wizardConfig.find((config) => config.path === routes.ADD_ANOTHER_DRIVER);
        const mockedPathName = mockedConfig.path;
        const wrapper = getWrapper({ location: { ...location, pathname: mockedPathName } });
        // then
        expect(wrapper.find(RemoveDriverRibbon)).toHaveLength(0);
    });
});
