import React from 'react';
import { shallow } from 'enzyme';
import HDContainer from '../HDContainer';

const items = [
    { name: 'Motor Legal Expenses' },
    { name: 'Roadside Assistance Breakdown cover' },
    { name: 'Driving other cars', description: 'Third party cover for the policyholder only, see your Certificate of Insurance for more information.' },
    { name: 'Courtesy car', description: 'A small car will be provided while your car\'s being repaired by one of our approved repairers.' },
];

const itemsNotCovered = [
    { name: 'Windscreen or windows' },
    { name: 'Fire and theft damage' }
];

describe('<HDContainer />', () => {
    it('render component with logo', () => {
        const wrapper = shallow(<HDContainer
            hastingsDirectLogo="logourl"
            isComprehensive={false}
            items={items}
            itemsNotCovered={[]} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with logo and comprehensive', () => {
        const wrapper = shallow(<HDContainer
            hastingsDirectLogo="logourl"
            items={items}
            itemsNotCovered={itemsNotCovered} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with and verify item', () => {
        const wrapper = shallow(<HDContainer
            hastingsDirectLogo="logourl"
            isComprehensive={false}
            items={items}
            itemsNotCovered={[]} />);
        expect(wrapper.find('HDTickListItem[title="Courtesy car"]').exists()).toBe(true);
    });

    it('render component and verify items not covered - Fire and theft damage', () => {
        const wrapper = shallow(<HDContainer
            hastingsDirectLogo="logourl"
            isComprehensive={false}
            items={items}
            itemsNotCovered={itemsNotCovered} />);
        expect(wrapper.find('HDTickListItem[title="Fire and theft damage"]').exists()).toBe(true);
    });

    it('render component and verify items not covered - Fire and theft damage', () => {
        const wrapper = shallow(<HDContainer
            hastingsDirectLogo="logourl"
            items={items} />);
        expect(wrapper.find('HDTickListItem[title="Fire and theft damage"]').exists()).toBe(false);
    });

    it('render component with title', () => {
        const wrapper = shallow(<HDContainer
            title="title"
            items={items} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component withuot header', () => {
        const wrapper = shallow(<HDContainer
            title="title"
            items={items} />);
        expect(wrapper).toMatchSnapshot();
    });
});
