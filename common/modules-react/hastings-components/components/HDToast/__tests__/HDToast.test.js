import React from 'react';
import { mount } from 'enzyme';
import HDToast from '../HDToast';

const defaultProps = {
    position: 'top-right',
    toastList: [{
        bgColor: 'main',
        iconType: 'tick',
        content: 'Test content'
    }]
};

const setup = (props = {}) => {
    const setupProps = { ...props, ...defaultProps };
    return mount(<HDToast {...setupProps} />);
};

describe('<HDToast />', () => {
    it('should match snapshot', () => {
        const tree = setup();
        expect(tree).toMatchSnapshot();
    });
});
