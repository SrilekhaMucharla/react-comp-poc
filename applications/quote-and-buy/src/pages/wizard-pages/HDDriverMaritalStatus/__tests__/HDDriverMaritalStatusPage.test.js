import React from 'react';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDDriverMaritalStatusPage from '../HDDriverMaritalStatusPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

describe('<HDDriverMaritalStatusPage />', () => {
    // given
    const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const maritalStatus = 'maritalStatus';
    const maritalStatusAvailableValuesPath = `${driverPath}.${maritalStatus}.aspects.availableValues[0].typelist.filters`;
    const accessToOtherVehicles = 'accessToOtherVehicles';
    const accessToOtherVehiclesAvailableValuesPath = `${driverPath}.${accessToOtherVehicles}.aspects.availableValues`;
    const fullEmpStatusValue = `${driverPath}.fullEmpStatus.value`;
    const pathsToClone = [
        maritalStatusAvailableValuesPath,
        accessToOtherVehiclesAvailableValuesPath,
        fullEmpStatusValue];
    const pageId = 'page-id';

    const getWrapper = () => mountWithSubmissionVM(
        <HDDriverMaritalStatusPage pageId={pageId} />,
        pathsToClone
    );
    it('should render the component and match snapshot', async () => {
        const wrapper = await getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
