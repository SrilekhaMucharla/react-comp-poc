import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDMCQuoteDeclinePage from '../HDMCQuoteDeclinePage';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDMCQuoteDeclinePage />', () => {
    test('render component', () => {
        const wrapper = shallow((
            <HDMCQuoteDeclinePage />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
