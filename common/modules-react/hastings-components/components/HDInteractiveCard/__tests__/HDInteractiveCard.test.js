import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInteractiveCard from '../HDInteractiveCard';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInteractiveCard />', () => {
    it('render component without icons', () => {
        const component = (
            <HDInteractiveCard>
                <p>Content</p>
            </HDInteractiveCard>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with one icon', () => {
        const component = (
            <HDInteractiveCard icons={<i />}>
                <p>Content</p>
            </HDInteractiveCard>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with two icons', () => {
        const component = (
            <HDInteractiveCard icons={(
                <>
                    <i />
                    <i />
                </>
            )}
            >
                <p>Content</p>
            </HDInteractiveCard>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });
});
