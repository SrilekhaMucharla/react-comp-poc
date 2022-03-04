import React from 'react';
import { shallow } from 'enzyme';
import HDCoverDetailsOverlay from '../components/HDCoverDetailsOverlay';

describe('<HDCoverDetailsOverlay />', () => {
    it('should render correctly and match the snapshot', () => {
        // given
        const component = shallow(
            <HDCoverDetailsOverlay
                branchName="HD"
                onChange={jest.fn()}
                policyStartDate="20/05/2021"
                paymentTypeText="Montlhy"
                benefits={[]}
                selectedCoverType={{ value: 'comprehensive', label: 'Comprehensive' }}
                options={[{ value: 'comprehensive', label: 'Comprehensive' }, { value: 'thirdParty', label: 'Third Party' }]}
            >
                <p>Content</p>
            </HDCoverDetailsOverlay>
        );
        // then
        expect(component).toMatchSnapshot();
    });
});
