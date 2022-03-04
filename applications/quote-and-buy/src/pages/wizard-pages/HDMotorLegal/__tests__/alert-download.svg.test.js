import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<alertDownloadIcon/>', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<alertDownloadIcon />);
    });
    test('render component', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
