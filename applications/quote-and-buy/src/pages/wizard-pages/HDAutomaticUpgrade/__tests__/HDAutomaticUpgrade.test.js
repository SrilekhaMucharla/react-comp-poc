import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDAutomaticUpgrade from '../HDAutomaticUpgrade';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDAutomaticUpgrade />', () => {
    test('render component', () => {
        const submissionVM = {};

        const wrapper = shallow((
            <HDAutomaticUpgrade
                submissionVM={submissionVM} />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
