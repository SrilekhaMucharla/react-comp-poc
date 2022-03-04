import React from 'react';
import Enzyme, { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import HDLoader from '../HDLoader';
import { findByTestAttribute } from '../../__helpers__/testHelper';

Enzyme.configure({ adapter: new Adapter() });

const setup = (props) => {
    return mount(<HDLoader {...props} />);
};

describe('<HDLoader />', () => {
    it('correctly renders component tree without props passed', () => {
        const tree = renderer.create(
            <HDLoader />
        ).toJSON();

        expect(tree)
            .toMatchSnapshot();
    });

    it('should correctly display default text if none is passed as props', () => {
        const wrapper = setup();
        const defaultText = HDLoader.defaultProps.text;
        const loaderText = findByTestAttribute(wrapper, 'loader-text').text();
        expect(loaderText).toBe(defaultText);
    });

    it('should correctly display passed text', () => {
        const textToCompare = 'Loading';
        const wrapper = setup({ text: textToCompare });
        const loaderText = findByTestAttribute(wrapper, 'loader-text').text();
        expect(loaderText).toBe(textToCompare);
    });
});
