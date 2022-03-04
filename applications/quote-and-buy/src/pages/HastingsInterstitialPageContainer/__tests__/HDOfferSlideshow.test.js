import { mount } from 'enzyme';
import React from 'react';
import HDOfferSlideshow from '../components/HDOfferSlideshow';

const slideshowItems = [
    (<div>Test01</div>),
    (<div>Test02</div>),
    (<div>Test03</div>),
];

describe('<HDOfferSlideshow />', () => {
    test('component renders', () => {
        const wrapper = mount(<HDOfferSlideshow items={slideshowItems} />);
        expect(wrapper).toMatchSnapshot();
    });
});
