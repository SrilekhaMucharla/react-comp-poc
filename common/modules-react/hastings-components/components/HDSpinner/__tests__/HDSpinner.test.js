import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDSpinner from '../HDSpinner';
import { findByTestAttribute } from '../../__helpers__/testHelper';

Enzyme.configure({ adapter: new Adapter() });

const setup = (props) => {
    return shallow(<HDSpinner {...props} />);
};

describe('<HDSpinner />', () => {
    it('renders default monochrome spinner when no props are passed', () => {
        const component = setup({ diameter: 300 });
        expect(component).toMatchSnapshot();
    });

    it('renders colorful spinner', () => {
        const component = setup({ type: 'color', diameter: 300 });
        const svg = findByTestAttribute(component, 'spinner-color');
        expect(svg.length).toBe(1);
    });
});
