import React from 'react';
import { shallow } from 'enzyme';
import { HDDriverScanOrContinuePage } from '../HDDriverScanOrContinuePage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

describe('HDDriverScanPage', () => {
    const handleForward = jest.fn();
    const handleSkip = jest.fn();
    const wrapper = shallow((<HDDriverScanOrContinuePage handleSkip={handleSkip} handleForward={handleForward} setNavigation={jest.fn()} />));

    beforeEach(() => {

    });

    it('should render the component and match snapshot', async () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should navigate forward when clicking scan button', async () => {
        const scanButton = wrapper.find('[name="scan"]').at(0);
        scanButton.simulate('click');

        expect(handleForward).toBeCalled();
    });

    it('should skip when clicking continue button', async () => {
        const scanButton = wrapper.find('[name="continue"]').at(0);
        scanButton.simulate('click');

        expect(handleSkip).toBeCalled();
    });
});
