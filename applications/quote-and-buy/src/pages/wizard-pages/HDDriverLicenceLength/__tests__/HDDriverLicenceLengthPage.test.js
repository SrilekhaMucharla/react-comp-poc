import React from 'react';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDDriverLicenceLengthPage from '../HDDriverLicenceLengthPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));
describe('<HDDriverLicenceLengthPage />', () => {
    const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const licenceHeldForFieldname = 'licenceHeldFor';
    const licenceHeldForPath = `${driverPath}.${licenceHeldForFieldname}.aspects.availableValues`;
    const pathsToClone = [licenceHeldForPath];

    const getWrapper = () => mountWithSubmissionVM(
        <HDDriverLicenceLengthPage />,
        pathsToClone
    );

    it('should render the component and match snapshot', async () => {
        const wrapper = await getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('Select 1 year and display data picker', async () => {
        const wrapper = await getWrapper();
        const select = wrapper.find('Select');

        // Simulate selection of 1 year
        await act(async () => {
            select.at(0)
                .props()
                .onChange({
                    label: 'typekey.LicenceHeld_Ext.1',
                    value: '1',
                });
        });

        wrapper.update();

        // When did you get it? Part is visible
        expect(wrapper.find('#dll-when-label').exists()).toEqual(true);

        expect(wrapper).toMatchSnapshot();
    });
});
