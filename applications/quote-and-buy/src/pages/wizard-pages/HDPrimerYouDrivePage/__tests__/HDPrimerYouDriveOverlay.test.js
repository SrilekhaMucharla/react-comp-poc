import React from 'react';
import HDPrimerYouDriveOverlay from '../HDPrimerYouDriveOverlay';

describe('<HDPrimerYouDriveOverlay />', () => {
    test('render component', () => {
        const wrapper = mount(<HDPrimerYouDriveOverlay />);
        expect(wrapper).toMatchSnapshot();
    });
});
