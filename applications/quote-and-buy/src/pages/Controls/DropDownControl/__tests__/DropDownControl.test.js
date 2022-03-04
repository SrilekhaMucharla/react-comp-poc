import React from 'react';
import { mount } from 'enzyme';
import DropDownList from '../DropDownControl';

const props = {
    name: '',
    options: [],
    onChange: jest.fn()
};

describe('DropDownList', () => {
    it('should render DropDownList ', () => {
        const wrapper = mount(<DropDownList {...props} />);
        console.log(wrapper.debug());
        expect((wrapper).find('.selBox').length).toBe(1);
    });
});
