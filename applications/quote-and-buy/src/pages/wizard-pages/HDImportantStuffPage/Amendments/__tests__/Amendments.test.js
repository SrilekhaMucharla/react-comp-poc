import React from 'react';
import { shallow } from 'enzyme';
import Amendments from '../Amendments';
import Endorsement from '../Endorsement';

describe('Amendments', () => {
    const endorsementsList = [
        {
            endorsementCode: 'PCE07Cond_Ext',
            endorsementTitle: 'E07 - Drivers under 25 years of age aren’t included unless named on this schedule',
            // eslint-disable-next-line max-len
            endorsementDescription: 'No insurance cover applies while your car is being driven by anyone under 25 years of age, unless that person’s name is shown on this schedule against this endorsement number'
        },
        {
            endorsementCode: 'PCE26Cond_Ext',
            endorsementTitle: 'E26 - Tracking device subscription required',
            // eslint-disable-next-line max-len
            endorsementDescription: 'This policy won’t cover your car for loss or damage caused by theft or attempted theft unless your car is fitted with a GPS satellite tracking device with a continuous subscription in place.'
        },
        {
            endorsementCode: 'PCE31Cond_Ext',
            endorsementTitle: 'E31 - Double voluntary and compulsory excess/es',
            // eslint-disable-next-line max-len
            endorsementDescription: "If you don't use one of our nominated repairers to repair your car when making a claim under sections 1 or 2 of your policy, the excess/es on your schedule will be doubled."
        }
    ];

    const getWrapper = (brand) => shallow(
        <Amendments
            brand={brand}
            endorsements={endorsementsList} />
    );

    describe('for HE', () => {
        const brand = 'HE';
        const wrapper = getWrapper(brand);

        it('should render Amendments correctly and match the snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should render header', () => {
            const header = wrapper.find('#important-stuff-amendments-header');
            expect(header.props().text).toBe('Amendments or exceptions to your policy');
        });

        it('should render proper number of endorsements', () => {
            const endorsements = wrapper.find(Endorsement);
            expect(endorsements).toHaveLength(3);
        });
    });

    describe('for brand other than HE', () => {
        const brand = 'HP';
        const wrapper = getWrapper(brand);

        it('should render Amendments correctly and match the snapshot', () => {
            expect(wrapper).toMatchSnapshot();
        });


        it('should render header', () => {
            const header = wrapper.find('#important-stuff-amendments-header');
            expect(header.props().text).toBe('Amendments or exceptions to your policy');
        });

        it('should render proper number of endorsements', () => {
            const endorsements = wrapper.find(Endorsement);
            expect(endorsements).toHaveLength(2);
        });

        it('should render passed endorsements', () => {
            const endorsements = wrapper.find(Endorsement);
            endorsements.forEach((endorsement, index) => {
                const { endorsementTitle, endorsementDescription } = endorsementsList[index];
                expect(endorsement.props().title).toBe(endorsementTitle);
                expect(endorsement.props().description).toBe(endorsementDescription);
                expect(endorsement.props().number).toBe(index + 1);
            });
        });
    });

    describe('for empty or undefined endorsements', () => {
        it('should render null for undefined endorsements', () => {
            const wrapper = shallow(
                <Amendments
                    brand=""
                    endorsements={undefined} />
            );
            expect(wrapper.type()).toEqual(null);
        });

        it('should render null for empty endorsements', () => {
            const wrapper = shallow(
                <Amendments
                    brand=""
                    endorsements={[]} />
            );
            expect(wrapper.type()).toEqual(null);
        });
    });
});
