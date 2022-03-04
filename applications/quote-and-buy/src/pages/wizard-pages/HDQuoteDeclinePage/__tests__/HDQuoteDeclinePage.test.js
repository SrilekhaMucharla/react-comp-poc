import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDQuoteDeclinePage from '../HDQuoteDeclinePage';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDQuoteDeclinePage />', () => {
    test('render component', () => {
        const wrapper = shallow((
            <HDQuoteDeclinePage />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
