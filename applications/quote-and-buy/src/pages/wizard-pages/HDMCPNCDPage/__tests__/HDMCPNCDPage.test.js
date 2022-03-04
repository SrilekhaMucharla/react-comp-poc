/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';
import customizeSubmission from '../mock/customizeSubmission.json';
import HDMCPNCDPage from '../HDMCPNCDPage';
import HDMCPNCDCostQuestionPage from '../HDMCPNCDCostQuestionPage';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup
} from '../../../../web-analytics';
import HDQuoteService from '../../../../api/HDQuoteService';

describe('<HDMCPNCDPage />', () => {
    jest.spyOn(HDQuoteService, 'updateQuoteCoverages').mockImplementation((customizeSubmissionVM) => Promise.resolve({
        id: customizeSubmission.id,
        result: customizeSubmissionVM
    }));

    test('should render page', () => {
        const wrapper = shallow(<HDMCPNCDPage />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render button group', () => {
        const availableValues = [{
            value: 'yes',
            name: 'Yes',
        }, {
            value: 'no',
            name: 'No',
        }];
        const wrapper = shallow(<HDToggleButtonGroup availableValues={availableValues} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('renders HDMCPNCDCostQuestionPage component', () => {
        const wrapper = shallow(<HDMCPNCDCostQuestionPage vehicleName="mercedes E-class" />);
        expect(wrapper.get(0)).toBeTruthy();
    });
    // test('renders toggle button group', () => {
    //     const wrapper = mount(<Router><Provider store={store}><HDMCPNCDPage /></Provider></Router>);
    //     const wrapperToggleButtonGroup = wrapper.find(<HDToggleButtonGroup />);
    //     console.log(wrapperToggleButtonGroup.debug());
    //     // expect(wrapper.containes(yesButton)).toEqual(true)
    // });
});
