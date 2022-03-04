import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDInteractiveCardRefactor from '../HDInteractiveCardRefactor';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDInteractiveCard />', () => {
    it('render component without icons', () => {
        const component = (
            <HDInteractiveCardRefactor>
                <p>Content</p>
            </HDInteractiveCardRefactor>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with one icon', () => {
        const component = (
            <HDInteractiveCardRefactor icons={<i />}>
                <p>Content</p>
            </HDInteractiveCardRefactor>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });

    it('render component with two icons', () => {
        const component = (
            <HDInteractiveCardRefactor icons={(
                <>
                    <i />
                    <i />
                </>
            )}
            >
                <p>Content</p>
            </HDInteractiveCardRefactor>
        );
        const wrapper = shallow(component);
        expect(wrapper).toMatchSnapshot();
    });
});
