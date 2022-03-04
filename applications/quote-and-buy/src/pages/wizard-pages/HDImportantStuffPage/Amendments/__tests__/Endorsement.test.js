import React from 'react';
import { shallow } from 'enzyme';
import Endorsement from '../Endorsement';

describe('Endorsement', () => {
    const endoresment = {
        endorsementCode: 'PCE07Cond_Ext',
        endorsementTitle: 'E07 - Drivers under 25 years of age aren’t included unless named on this schedule',
        // eslint-disable-next-line max-len
        endorsementDescription: 'No insurance cover applies while your car is being driven by anyone under 25 years of age, unless that person’s name is shown on this schedule against this endorsement number'
    };
    const number = 1;

    const getWrapper = () => shallow(
        <Endorsement
            title={endoresment.endorsementTitle}
            description={endoresment.endorsementDescription}
            number={number} />
    );

    it('should render Endorsement correctly and match the snapshot', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render header with number', () => {
        const wrapper = getWrapper();
        const header = wrapper.find('#important-stuff-amendments-subheader');
        expect(header).toHaveLength(1);
        expect(header.props().text).toBe('Endorsement 1');
    });

    it('should render title', () => {
        const wrapper = getWrapper();
        const title = wrapper.find('#important-stuff-amendments-title');
        expect(title).toHaveLength(1);
        expect(title.props().text).toBe(endoresment.endorsementTitle);
    });

    it('should render description', () => {
        const wrapper = getWrapper();
        const description = wrapper.find('#important-stuff-amendments-description');
        expect(description).toHaveLength(1);
        expect(description.text()).toBe(endoresment.endorsementDescription);
    });
});
