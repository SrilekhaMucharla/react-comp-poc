import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDButton from '../HDButton';


Enzyme.configure({ adapter: new Adapter() });

describe('<HDButton />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDButton />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it('render component with props', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<HDButton
            variant="btnsecondary"
            label="LABEL"
            onClick={handleClick} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
