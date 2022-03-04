import React from 'react';
import { mount } from 'enzyme';
import HDAddAnotherCar from '../HDAddAnotherCar';

describe('<HDAddAnotherCar />', () => {
    test('render component', () => {
        const wrapper = mount(
            <HDAddAnotherCar />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('hidden to false renders component and matches snapshot', () => {
        const wrapper = mount(
            <HDAddAnotherCar hidden={false} />
        );
        expect(wrapper.find(HDAddAnotherCar)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });
});
