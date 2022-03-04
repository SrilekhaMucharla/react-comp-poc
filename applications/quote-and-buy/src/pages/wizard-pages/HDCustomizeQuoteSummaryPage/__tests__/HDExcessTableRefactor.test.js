import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDExcessTableRefactor from '../components/HDExcessTableRefactor';
import * as messages from '../HDYourExcessPopup.messages';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDExcessTableRefactor />', () => {
    test('render with mandatory props', () => {
        const wrapper = shallow((
            <HDExcessTableRefactor
                name="James Bond"
                drivers={[{ id: 1, name: messages.forAllDriversHeader }]}
                excess={[
                    { excessName: messages.windowGlassText, voluntaryAmount: 200, compulsoryAmount: 300 },
                ]} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
    test('render with mandatory props and hide total column', () => {
        const wrapper = shallow((
            <HDExcessTableRefactor
                name="James Bond"
                drivers={[{ id: 1, name: messages.forAllDriversHeader }]}
                hideTotalColumn
                excess={[
                    { excessName: messages.windowGlassText, voluntaryAmount: 200, compulsoryAmount: 300 },
                ]} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
