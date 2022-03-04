import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDDataCard from '../HDDataCard';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDDataCard />', () => {
    it('render component with mandatory props', () => {
        const wrapper = shallow(<HDDataCard title="Title" data={{ key1: 'value1', key2: 10 }} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with all props', () => {
        const onClickMock = jest.fn();
        const wrapper = shallow((
            <HDDataCard
                title="Title"
                data={{ key1: 'value1', key2: 10 }}
                description="Desc"
                icon="car"
                linkText="Link"
                onLinkClick={onClickMock} />));
        expect(wrapper).toMatchSnapshot();
    });

    it('Call onClick handler after link click', () => {
        const onClickMock = jest.fn();
        const wrapper = shallow((
            <HDDataCard
                title="Title"
                data={{ key1: 'value1', key2: 10 }}
                description="Desc"
                icon="car"
                linkText="Link"
                onLinkClick={onClickMock} />));
        wrapper.find('#dc-link').simulate('click');
        expect(onClickMock).toBeCalled();
    });
});
