import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HDOverlayPopup from '../HDOverlayPopup';

configure({ adapter: new Adapter() });

describe('<HDOverLayPopup />', () => {
    it('render component with text only and sample content tree', () => {
        const tree = renderer.create(
            <HDOverlayPopup
                id="sample-id"
            >
                <p>Sample text</p>
            </HDOverlayPopup>
        )
            .toJSON();

        expect(tree)
            .toMatchSnapshot();
    });
});
