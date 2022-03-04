/* eslint-disable max-len */
import React from 'react';
import { mount } from 'enzyme';
import HDYourExcessFees from '../HDYourExcessFees';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const driverList = [
    {
        displayName: 'test user',
        youngAndInExpExcess: 195
    }
];

const accidentalDamage = [
    { compulsoryAmount: 145, voluntaryAmount: 145 }
];

const theftDamage = [
    { excessName: 'All drivers', compulsoryAmount: 145, voluntaryAmount: 145 }
];

const windScreenDamage = [
    { excessName: 'All drivers', compulsoryAmount: 85, voluntaryAmount: 85 }
];

describe('<HDYourExcessFees />', () => {
    createPortalRoot();

    it('render component', () => {
        const wrapper = mount(<HDYourExcessFees driverList={driverList} accidentalDamage={accidentalDamage} theftDamage={theftDamage} windScreenDamage={windScreenDamage} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with windscreen damages', () => {
        const wrapper = mount(<HDYourExcessFees driverList={driverList} accidentalDamage={accidentalDamage} theftDamage={theftDamage} windScreenDamage={windScreenDamage} />);
        expect(wrapper.find('HDExcessTable').at(2).exists()).toBe(true);
    });


    it('render component with empty windscreen damages', () => {
        const wrapper = mount(<HDYourExcessFees driverList={driverList} accidentalDamage={accidentalDamage} theftDamage={theftDamage} windScreenDamage={[]} />);
        expect(wrapper.find('HDExcessTable').at(2).exists()).toBe(false);
    });

    test('click on tooltip icon and display tooltipOverlay', async () => {
        const wrapper = mount(<HDYourExcessFees driverList={driverList} accidentalDamage={accidentalDamage} theftDamage={theftDamage} windScreenDamage={windScreenDamage} />);
        const iconOverlay = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            iconOverlay
                .simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });
});
