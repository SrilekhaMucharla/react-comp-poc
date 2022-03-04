import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInformationToolTip from '../HDInformationToolTip';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInformationToolTip />', () => {
    it('render information tooltip', () => {
        const wrapper = shallow(<HDInformationToolTip id="abcd" heading="Hello heading" content="Hello Content" />);
        expect(wrapper).toMatchSnapshot();
    });
});
