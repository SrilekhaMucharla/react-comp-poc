import React from 'react';
import { shallow, mount } from 'enzyme';
// eslint-disable-next-line no-unused-vars
import { useHistory } from 'react-router-dom';
import BackNavigation from '../BackNavigation';

// given
const mockedGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        goBack: mockedGoBack
    })
}));

describe('BackNavigation', () => {
    it('should render correctly and match the snapshot', () => {
        // given
        const component = shallow(<BackNavigation />);
        // then
        expect(component).toMatchSnapshot();
    });

    it('should navigate back when clicked', () => {
        // given
        const component = mount(<BackNavigation />);
        const button = component.find('[name="go-back"]').at(0);
        // when
        button.simulate('click');
        // then
        expect(mockedGoBack).toHaveBeenCalled();
    });
});
