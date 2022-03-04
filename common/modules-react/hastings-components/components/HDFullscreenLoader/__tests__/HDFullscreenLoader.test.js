import React from 'react';
import HDFullscreenLoader from '../HDFullscreenLoader';
import { findByTestAttribute } from '../../__helpers__/testHelper';

const setup = (props) => {
    return mount(<HDFullscreenLoader {...props} />);
};

describe('<HDFullscreenLoader />', () => {
    it('correctly renders component tree', () => {
        const tree = setup({
            text: 'Test text',
            spinner: <span />,
            overlayOpacity: 0.5,
            overlayColor: 'red'
        });

        expect(tree).toMatchSnapshot();
    });

    it('should correctly display passed text', () => {
        const textToCompare = 'Loading';
        const wrapper = setup({
            text: textToCompare,
            spinner: <span />,
            overlayOpacity: 0.5,
            overlayColor: 'red'
        });
        const loaderText = findByTestAttribute(wrapper, 'loader-text').text();
        expect(loaderText).toBe(textToCompare);
    });
});
