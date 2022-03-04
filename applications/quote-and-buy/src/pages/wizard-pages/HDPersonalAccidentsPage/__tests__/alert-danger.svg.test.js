import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<alertDangerIcon/>', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<alertDangerIcon />);
    });
    test('render component', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
