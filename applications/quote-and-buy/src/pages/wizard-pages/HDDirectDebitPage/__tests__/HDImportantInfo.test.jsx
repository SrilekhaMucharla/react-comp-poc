import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDImportantInfo from '../HDImportantInfo';

Enzyme.configure({ adapter: new Adapter() });

describe('<HDImportantInfo />', () => {
    test('render component', () => {
        const wrapper = shallow((
            <HDImportantInfo />
        ));
        expect(wrapper).toMatchSnapshot();
    });
});
