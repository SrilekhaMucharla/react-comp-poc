import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDCustomizeQuoteWelcomePage from '../HDCustomizeQuoteWelcomePage';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDCustomizeQuoteWelcomePage />', () => {
    test('render component with mandatory props', () => {
        const wrapper = mount((
            <HDCustomizeQuoteWelcomePage.WrappedComponent />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
