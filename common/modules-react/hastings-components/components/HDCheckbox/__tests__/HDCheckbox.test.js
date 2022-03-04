import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDCheckbox from '../HDCheckbox';

configure({ adapter: new Adapter() });

describe('<HDCheckbox />', () => {
    it('render component with boolean values', () => {
        const tree = renderer.create(<HDCheckbox
            value={false}
            type="checkbox"
            checked={false}
            name="Email" />)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
