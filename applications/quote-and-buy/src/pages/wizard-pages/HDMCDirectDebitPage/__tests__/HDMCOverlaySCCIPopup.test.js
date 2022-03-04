import React from 'react';

import HDMCOverlaySCCIPopup from '../components/HDMCOverlaySCCIPopup';

describe('<HDMCOverlaySCCIPopup />', () => {
    const creditAgreementData = {
        initialPayment: 5,
    };

    test('render component', () => {
        const wrapper = mount(
            <HDMCOverlaySCCIPopup creditAgreementData={creditAgreementData} />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
