import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDToggleButtonGroupRefactor from '../HDToggleButtonGroupRefactor';

configure({ adapter: new Adapter() });

describe('<HDToggleButtonGroupRefactor />', () => {
    it('render component with text only and sample values', () => {
        const availableValues = [{
            value: 1,
            name: 'name'
        }];

        const tree = renderer.create(<HDToggleButtonGroupRefactor
            label={{ Tag: 'h2', text: 'Ask question' }}
            availableValues={availableValues} />)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
