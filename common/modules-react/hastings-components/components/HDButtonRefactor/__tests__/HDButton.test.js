import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDButtonRefactor from '../HDButtonRefactor';


Enzyme.configure({ adapter: new Adapter() });

describe('<HDButtonRefactor />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDButtonRefactor />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it('render component with props', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<HDButtonRefactor
            id="Random-ID"
            variant="btnsecondary"
            label="LABEL"
            onClick={handleClick} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
