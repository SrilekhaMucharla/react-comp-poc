import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDWarningModal from '../HDWarningModal';

configure({ adapter: new Adapter() });

describe('<HDWarningModal />', () => {
    it('render component with text only and sample content tree', () => {
        const tree = renderer.create(<HDWarningModal
            onBack={() => {
            }}
            onLeave={() => {
            }}
            body={<p>Sample text</p>} />)
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
