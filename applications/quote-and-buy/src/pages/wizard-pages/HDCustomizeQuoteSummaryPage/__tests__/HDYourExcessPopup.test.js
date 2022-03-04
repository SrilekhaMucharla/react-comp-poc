import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDYourExcessPopup from '../HDYourExcessPopup';

Enzyme.configure({ adapter: new Adapter() });

const drivers = [{
    name: 'Ashley Smith',
    excesses: [
        { excessName: 'Fire', voluntaryAmount: 200, compulsoryAmount: 130 },
        { excessName: 'Theft', voluntaryAmount: 200, compulsoryAmount: 130 },
        { excessName: 'Accidental damage', voluntaryAmount: 200, compulsoryAmount: 130 },
    ]
},
{
    name: 'Kelly Smith',
    excesses: [
        { excessName: 'Fire', voluntaryAmount: 200, compulsoryAmount: 130 },
        { excessName: 'Theft', voluntaryAmount: 200, compulsoryAmount: 130 },
        { excessName: 'Accidental damage', voluntaryAmount: 200, compulsoryAmount: 130 },
    ]
}];
const globalExcesses = [
    { excessName: 'Windscreen repair', voluntaryAmount: 0, compulsoryAmount: 15 },
    { excessName: 'Windscreen replacement', voluntaryAmount: 0, compulsoryAmount: 15 }
];

describe('<HDYourExcessPopup />', () => {
    test('render component with mandatory props', () => {
        const wrapper = shallow((
            <HDYourExcessPopup
                drivers={drivers}
                globalExcesses={globalExcesses} />
        ));
        expect(wrapper).toMatchSnapshot();
    });

    test('render component with globalExcesses', () => {
        const wrapper = shallow((
            <HDYourExcessPopup
                drivers={drivers}
                globalExcesses={globalExcesses} />
        ));
        expect(wrapper.find('HDExcessTableRefactor').at(2).exists()).toBe(true);
    });

    test('render component with empty globalExcesses', () => {
        const wrapper = shallow((
            <HDYourExcessPopup
                drivers={drivers}
                globalExcesses={[]} />
        ));
        expect(wrapper.find('HDExcessTableRefactor').at(2).exists()).toBe(false);
    });
});
