import React from 'react';
import { HDDropdownList } from 'hastings-components';
import HDRenewalPreferenceOverlay from '../HDRenewalPreferenceOverlay';

describe('<HDRenewalPreferenceOverlay />', () => {
    const getWrapper = () => mount((
        <HDRenewalPreferenceOverlay
            apiFailure={false}
            onOptOutReasonSelect={jest.fn()}
            otherReasonValidated={jest.fn()}
            headerText="Test"
            isMultiCar={false} />));
    it('render component', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
    it('select dropdown option 1', () => {
        const wrapper = getWrapper();
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        act(() => dropdown.props().onChange({ target: { value: options[0] } }));
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });
    it('select dropdown option 2', () => {
        const wrapper = getWrapper();
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        act(() => dropdown.props().onChange({ target: { value: options[1] } }));
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });
    it('select dropdown option 3', () => {
        const wrapper = getWrapper();
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        act(() => dropdown.props().onChange({ target: { value: options[2] } }));
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });
    it('select dropdown option 4 with text', () => {
        const wrapper = getWrapper();
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        act(() => dropdown.props().onChange({ target: { value: options[3] } }));
        wrapper.update();

        const textArea = wrapper.find('textarea');
        act(() => textArea.props().onChange({
            target: {
                value: 'Test reason inside the areatext.'
            }
        }));
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });
    it('select dropdown option 4 without text', () => {
        const wrapper = getWrapper();
        const dropdown = wrapper.find(HDDropdownList);
        const options = dropdown.prop('options');

        act(() => dropdown.props().onChange({ target: { value: options[3] } }));
        wrapper.update();

        const textArea = wrapper.find('textarea');
        act(() => textArea.props().onChange({
            target: {
                value: ''
            }
        }));
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<HDRenewalPreferenceOverlay /> isMulticar true', () => {
    const getWrapper = () => mount((
        <HDRenewalPreferenceOverlay
            apiFailure={false}
            onOptOutReasonSelect={jest.fn()}
            otherReasonValidated={jest.fn()}
            headerText="Test"
            isMultiCar
            setOtherValue={jest.fn()} />));
    it('render component', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<HDRenewalPreferenceOverlay /> apiFailure true', () => {
    const getWrapper = () => mount((
        <HDRenewalPreferenceOverlay
            apiFailure
            onOptOutReasonSelect={jest.fn()}
            otherReasonValidated={jest.fn()}
            headerText="Test"
            isMultiCar
            setOtherValue={jest.fn()} />));
    it('render component', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
