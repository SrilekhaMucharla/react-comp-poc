import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDHeader from '../HDHeader';

Enzyme.configure({ adapter: new Adapter() });
const MockmulticarReference = 'Some String';

describe('<HDHeader />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDHeader multicarReference={MockmulticarReference} />);
        expect(wrapper).toMatchSnapshot();
    });
});
