import React from 'react';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
import useScrollToTop from '../useScrollToTop';

// given
const mockScrollTo = jest.fn();
window.scroll = mockScrollTo;

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: (callback) => {
        callback();
    }
}));

// given
const TestComponent = ({ pathname }) => {
    useScrollToTop(pathname);
    return <div>test component</div>;
};

TestComponent.propTypes = {
    pathname: PropTypes.string.isRequired
};

describe('useScrollToTop', () => {
    it('should call window.scrollTo function on pathname change', () => {
        // given
        const wrapper = shallow(<TestComponent pathname="path/1" />);
        // when
        wrapper.setProps({ pathname: 'path/2' });
        wrapper.update();
        // then
        expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should call window.scrollTo function when directly call useScrollToTop', () => {
        // when
        useScrollToTop('pathname');
        // then
        expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });
});
