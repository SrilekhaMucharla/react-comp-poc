import React from 'react';
import {
    HDButtonDashed, HDCompletedCardInfo, HDLabelRefactor, HDModal, HDInfoCardRefactor
} from 'hastings-components';
import HDAddAnotherDriverPage from '../HDAddAnotherDriverPage';
import DeleteDriverModal from '../DeleteDriverModal';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDQuoteService from '../../../../api/HDQuoteService';

// given
const driverIndex = 1;
const mockedRouterState = { driverIndex };
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: mockedRouterState
    })
}));

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (element) => element
}));

const mockedDetDriversList = jest.fn();
const mockedSetDeleteDriverIndex = jest.fn();
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: (init) => {
        if (init === []) {
            return [init, mockedDetDriversList];
        } if (init === true) {
            return [false, jest.fn()];
        } return [init, mockedSetDeleteDriverIndex];
    }
}));


describe('HDAddAnotherDriverPage', () => {
    // given
    const mockedDrivers = [
        { firstName: 'Alice', lastName: 'Cooper', fixedId: '1' },
        {
            firstName: 'Bryan', lastName: 'Adams', fixedId: '2', relationToProposer: 'Brother'
        }];
    const mockedVehicle = {
        make: 'Fiat',
        model: 'Multipla',
        registrationsNumber: 'H45T1NG5'
    };
    const additionalSubmissionValues = [{
        path: 'lobData.privateCar.coverables.drivers.value',
        value: mockedDrivers
    },
    {
        path: 'lobData.privateCar.coverables.vehicles.children[0].value',
        value: mockedVehicle
    }];

    const additionalStoreValues = {
        singleToMultiProductModel: {
            multiQuoteObj: {},
            loading: false,
            quoteError: null
        },
        monetateModel: {
            resultData: { }
        }
    };

    jest.spyOn(HDQuoteService, 'singleToMultiProduct').mockImplementation((mcsubmissionVM) => Promise.resolve({
        result: mcsubmissionVM
    }));

    const handleForward = jest.fn();
    const getWrapper = () => mountWithSubmissionVM(
        <HDAddAnotherDriverPage handleForward={handleForward} />,
        [],
        additionalSubmissionValues,
        additionalStoreValues
    );

    it('should render correctly and match the snapshot', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should contain HDLabel', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find('.add-another-driver__label').filter(HDLabelRefactor)).toHaveLength(1);
    });

    it('should contain DeleteDriverModal', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find(DeleteDriverModal)).toHaveLength(1);
    });

    it('should not show HDModal by default', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find(HDModal).props().show).toBeFalsy();
    });

    // skipped due to enzyme not updating the wrapper after useState hooks
    it('should contain HDCompletedCardInfo', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find(HDCompletedCardInfo)).toHaveLength(3);
    });

    it('should contain HDButtonDashed when there is less than 5 drivers', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find('.add-another-driver__button').filter(HDButtonDashed)).toHaveLength(1);
    });

    it('should contain HDInfoCardRefactor when there is equal to 5 drivers', async () => {
        // given
        const wrapper = await getWrapper();
        // then
        expect(wrapper.find(HDInfoCardRefactor)).toHaveLength(0);
    });

    it('should not contain delete icon for the first driver', async () => {
        // given
        const wrapper = await getWrapper();
        const driverCard = wrapper.find(HDCompletedCardInfo).find((card) => card.text().contains(mockedDrivers[0].lastName));
        // then
        expect(driverCard.find('.icon-delete')).toHaveLength(0);
    });

    // skipped due to enzyme not updating the wrapper after useState hooks
    it('should not contain HDButtonDashed when there is 5 drivers', async () => {
        // given
        const fiveDrivers = [
            { firstName: 'Alice', lastName: 'Cooper' },
            { firstName: 'Bryan', lastName: 'Adams' },
            { firstName: 'David', lastName: 'Bowie' },
            { firstName: 'Elton', lastName: 'John' },
            { firstName: 'Jimi', lastName: 'Hendrix' }];
        const fiveDriversSubmissioNValues = [{
            path: 'lobData.privateCar.coverables.drivers.value',
            value: fiveDrivers
        },
        {
            path: 'lobData.privateCar.coverables.vehicles.children[0].value',
            value: mockedVehicle
        }
        ];
        const wrapper = await mountWithSubmissionVM(
            <HDAddAnotherDriverPage handleForward={handleForward} />,
            [],
            fiveDriversSubmissioNValues,
            additionalStoreValues
        );
        wrapper.update();
        // then
        expect(wrapper.find('.add-another-driver__button')).toHaveLength(0);
        expect(wrapper.find(HDCompletedCardInfo)).toHaveLength(6);
    });
});
