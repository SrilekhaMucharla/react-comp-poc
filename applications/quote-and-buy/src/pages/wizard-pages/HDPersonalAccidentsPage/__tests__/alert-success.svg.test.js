import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<alertSuccessIcon/>', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<alertSuccessIcon />);
    });
    test('render component', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
