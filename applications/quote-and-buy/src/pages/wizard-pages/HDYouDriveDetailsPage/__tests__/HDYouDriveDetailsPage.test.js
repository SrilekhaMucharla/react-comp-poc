import React from 'react';
import { mount, shallow } from 'enzyme';
import { HDYouDriveDetailsPage } from '../HDYouDriveDetailsPage';

describe('<HDYouDriveDetailsPage />', () => {
    test('render component', () => {
        const wrapper = shallow(
            <HDYouDriveDetailsPage />
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('benefits-list not disabled', () => {
        const wrapper = mount(
            <HDYouDriveDetailsPage />
        );
        expect(wrapper.find('.you-drive-cover-details').at(0).prop('disabled')).toBeFalsy();
    });
    test('benefits-list contains children', () => {
        const wrapper = mount(
            <HDYouDriveDetailsPage />
        );
        expect(wrapper.find('.you-drive-cover-details__benefits-message').at(0).children().at(0)
            .hasClass('label-text'));
    });
    test('Overlay is not present', () => {
        const wrapper = mount(
            <HDYouDriveDetailsPage />
        );
        expect(wrapper.find('.you-drive-overlay').exists()).toBeFalsy();
    });
});
