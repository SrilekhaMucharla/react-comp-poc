import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDStepper from '../HDStepper';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDStepper />', () => {
    // given
    const steps = ['CAR', 'DRIVER', 'COVER', 'QUOTE'];

    it('render component and match the snapshot', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[0]} />);
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render properly with fist step as a milestone', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[0]} milestone />);
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render properly with middle step as current step', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[1]} />);
        // then
        expect(wrapper).toMatchSnapshot();
    });


    it('should render properly with middle step as a milestone', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[1]} milestone />);
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render properly with last step as current step', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[3]} milestone />);
        // then
        expect(wrapper).toMatchSnapshot();
    });


    it('should render properly with last step as a milestone', () => {
        // given
        const wrapper = shallow(<HDStepper steps={steps} currentStep={steps[3]} milestone />);
        // then
        expect(wrapper).toMatchSnapshot();
    });
});
