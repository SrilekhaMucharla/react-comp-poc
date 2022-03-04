import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HDAdditionalInformation from '../HDAdditionalInformation';

Enzyme.configure({ adapter: new Adapter() });

const pageMetadataMock = {
    page_name: 'test',
    page_type: 'test',
    sales_journey_type: 'none'
};
const MockisCreditAgreementVisible = true;

describe('<HDAdditionalInformation />', () => {
    it('render component', () => {
        const wrapper = shallow(<HDAdditionalInformation pageMetadata={pageMetadataMock} isCreditAgreementVisible={MockisCreditAgreementVisible} />);
        expect(wrapper).toMatchSnapshot();
    });
});
