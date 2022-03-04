import React from 'react';
import { shallow } from 'enzyme';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
import HDWizardStepper from '../HDWizardStepper';
import { HDWizardRouter } from '../HDWizardRouter';
import { getWizardConfig } from '../HDWizardConfig';
import HDWizardRoute from '../HDWizardRoute';

jest.mock('../../../web-analytics/useViewTracking', () => () => jest.fn());

// given
const mockedGoBack = jest.fn();
const mockedPush = jest.fn();
// get config with skip, handleForward and handleBackward methods for testing
const wizardConfig = getWizardConfig(false);
const mockedWizardConfig = wizardConfig.find((config) => config.id === 'HastingsPersonalDetails_DrivingLicence_Number');
// get real path for the stepper
const mockedPathname = mockedWizardConfig.path;
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockedGoBack,
        push: mockedPush,
        location: {
            state:
                { waMultiFlag: false }
        }
    }),
    useLocation: () => ({
        pathname: mockedPathname
    })
}));

describe('HDWizardRouter', () => {
    // given
    const setSubmissionVM = jest.fn();
    const createSubmission = jest.fn();
    const createQuote = jest.fn();
    const updateQuote = jest.fn();
    const setNavigation = jest.fn();
    const setBackNavigationFlag = jest.fn();
    const createParam = jest.fn();
    const setErrorStatusCode = jest.fn();
    // mock the router context as WizardRouter has the Switch inside
    const context = { contextTypes: {} };
    const wizardPageState = {
        drivers: {
            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false }
        },
        multiFlag: false,
        waMultiFlag: false,
        showHidePromotionalPageFlag: false
    };
    const getWrapper = (props = { wizardPagesState: { } }) => shallow(
        <HDWizardRouter
            createQuote={createQuote}
            updateQuote={updateQuote}
            setNavigation={setNavigation}
            setSubmissionVM={setSubmissionVM}
            createSubmission={createSubmission}
            setBackNavigationFlag={setBackNavigationFlag}
            createParam={createParam}
            setErrorStatusCode={setErrorStatusCode}
            multiCarFlag={false}
            isAddAnotherCar={false}
            {...props} />,
        { context }
    );

    it('should render correctly and match the snapshot', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDWizardStepper', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find(HDWizardStepper)).toHaveLength(1);
    });

    it('should contain back navigation button', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('#backNavMainWizard')).toHaveLength(1);
    });

    it('should show Continue button when showForward is true', () => {
        // given
        const wrapper = getWrapper({
            showForward: true
        });
        // then
        expect(wrapper.find(HDButton)).toHaveLength(1);
    });

    it('should hide Continue button when showForward is false', () => {
        // given
        const wrapper = getWrapper({
            showForward: false
        });
        // then
        expect(wrapper.find(HDButton)).toHaveLength(0);
    });

    it('should enable Continue button when showForward and canForward is true', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canForward: true
        });
        // then
        expect(wrapper.find(HDButton).props().disabled).toBeFalsy();
    });

    it('should disable Continue button when showForward and canForward is true', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canForward: false
        });
        // then
        expect(wrapper.find(HDButton).props().disabled).toBeTruthy();
    });

    it('should show Continue and Skip button', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true
        });
        // then
        expect(wrapper.find(HDButton)).toHaveLength(2);
    });

    it('should call handleSkip method on Skip button click', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true,
            lwrQuoteFlag: false,
            showHidePromotionalPageFlag: false
        });
        const [path, state] = mockedWizardConfig.skip({}, {});
        // when
        wrapper.find({ label: 'Skip' }).simulate('click');
        // then
        expect(mockedPush).toHaveBeenCalledWith(path, state);
    });

    it('should call handleForward method on Continue button click', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true,
            lwrQuoteFlag: false,
            wizardPagesState: wizardPageState,
            multiFlag: false,
            showHidePromotionalPageFlag: false
        });
        const [path, state] = mockedWizardConfig.forward({}, wizardPageState);
        // when
        wrapper.find({ label: 'Continue' }).simulate('click');
        // then
        expect(mockedPush).toHaveBeenCalledWith(path, state);
    });

    it('should call handleBackward method on back button click', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true,
            lwrQuoteFlag: false,
            wizardPagesState: wizardPageState,
            multiFlag: false,
            showHidePromotionalPageFlag: false
        });
        const [path, state] = mockedWizardConfig.backward({}, wizardPageState);
        // when
        wrapper.find('#backNavMainWizard').simulate('click');
        // then
        expect(mockedPush).toHaveBeenCalledWith(path, state);
    });

    it('should render routes', () => {
        // given
        const wrapper = getWrapper();
        const routes = wrapper.find(HDWizardRoute);
        // then
        expect(routes).toHaveLength(wizardConfig.length);
        routes.forEach((route, index) => {
            expect(route.props().path).toBe(wizardConfig[index].path);
        });
    });

    it('should not show finish button', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true
        });
        // then
        expect(wrapper.find('.cancel-finish-edit')).toHaveLength(0);
    });

    it('should show finish button', () => {
        // given
        const wrapper = getWrapper({
            showForward: true,
            canSkip: true,
            isEditQuoteJourney: true
        });
        // then
        expect(wrapper.find('.cancel-finish-edit')).toHaveLength(1);
    });
});
