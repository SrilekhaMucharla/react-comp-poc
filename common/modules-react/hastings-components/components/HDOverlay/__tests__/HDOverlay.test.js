import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDOverlay from '../HDOverlay';

Enzyme.configure({ adapter: new Adapter() });

const setup = (props) => {
    return shallow(<HDOverlay {...props} />);
};

describe('<HDOverlay />', () => {
    it('matches the snapshot', () => {
        const component = setup({ opacity: 0.9, color: 'black' });
        expect(component).toMatchSnapshot();
    });
});
