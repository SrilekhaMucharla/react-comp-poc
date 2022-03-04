import React from 'react';
import { shallow } from 'enzyme';
import { HDWizardRouter } from '../HDWizardRouter';
import { getWizardConfig } from '../HDWizardConfig';

jest.mock('../../../web-analytics/useViewTracking', () => () => jest.fn());

// given
const mockedGoBack = jest.fn();
const mockedPush = jest.fn();
// get config with skip, handleForward and handleBackward methods for testing
const mockedWizardConfig = getWizardConfig(true).find((config) => config.id === 'HastingsPersonalDetails_Complete');
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
    // mock the router context as WizardRouter has the Switch inside
    const context = { contextTypes: {} };

    const getWrapper = (props = {}) => shallow(
        <HDWizardRouter
            createQuote={createQuote}
            updateQuote={updateQuote}
            setNavigation={setNavigation}
            setSubmissionVM={setSubmissionVM}
            createSubmission={createSubmission}
            {...props} />,
        { context }
    );

    it('should render with email save div', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('.wizard-pages-email').exists()).toBe(true);
    });

    it('should render with HDCustomizeQuoteFooterPage', () => {
        // given
        const wrapper = getWrapper();
        // then
        expect(wrapper.find('Connect(HDCustomizeQuoteFooterPage)').exists()).toBe(true);
    });
});
