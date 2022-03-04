import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDDropdownList from '../HDDropdownList';

configure({ adapter: new Adapter() });

describe('<HDDropdownList />', () => {
    it('render component with text only and sample values', () => {
        const availableValues = [{
            value: 1,
            name: 'name'
        }];

        const tree = renderer.create(<HDDropdownList
            label={{ text: 'Ask question' }}
            options={availableValues} />)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
