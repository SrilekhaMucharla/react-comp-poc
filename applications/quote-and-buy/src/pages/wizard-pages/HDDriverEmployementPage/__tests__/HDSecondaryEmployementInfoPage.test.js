import React from 'react';
import { HDAsyncSelect, HDToggleButtonGroupRefactor } from 'hastings-components';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDSecondaryEmployementInfoPage from '../HDSecondaryEmployementInfoPage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const NO_RADIO_BUTTON_VAL = 'false';
const YES_RADIO_BUTTON_VAL = 'true';

async function fastForwardFakeTimers(wrapper) {
    await act(async () => {
        jest.runAllTimers();
    });
    wrapper.update();
}

async function checkRadioButton(wrapper, value) {
    await act(async () => {
        wrapper.find(HDToggleButtonGroupRefactor)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
}

describe('<HDSecondaryEmployementInfoPage />', () => {
    jest.useFakeTimers();

    const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const pathsToClone = [
        driverPath
    ];

    const getWrapper = () => mountWithSubmissionVM(
        <HDSecondaryEmployementInfoPage />,
        pathsToClone
    );

    it('should render the component and match snapshot', async () => {
        const wrapper = await getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('Click on Yes and display What is it question', async () => {
        const wrapper = await getWrapper();

        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        expect(wrapper.find('HDAsyncSelect#secondary-empl-occupation').exists()).toBeTruthy();
        expect(wrapper).toMatchSnapshot();
    });

    test('Click Yes and display What industry is this ?', async () => {
        const wrapper = await getWrapper();

        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        expect(wrapper.find('HDAsyncSelect#secondary-empl-business').exists()).toBeTruthy();
        expect(wrapper).toMatchSnapshot();
    });

    test('Click No and expect no further questions', async () => {
        const wrapper = await getWrapper();

        await checkRadioButton(wrapper, NO_RADIO_BUTTON_VAL);

        expect(wrapper.find('HDAsyncSelect#secondary-empl-occupation').exists()).toBeFalsy();
        expect(wrapper.find('HDAsyncSelect#secondary-empl-business').exists()).toBeFalsy();
        expect(wrapper).toMatchSnapshot();
    });

    test('values can be put in occupation async select', async () => {
        const wrapper = await getWrapper();

        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        const newInputVal1 = { label: 'Accountant', value: 'A01' };
        await act(async () => {
            wrapper.find(HDAsyncSelect).at(0).find('Select').props()
                .onInputChange(newInputVal1.label);
            wrapper.find(HDAsyncSelect).at(0).find('Select').instance()
                .selectOption(newInputVal1);
        });
        wrapper.update();
        await fastForwardFakeTimers(wrapper);
        expect(wrapper.find(HDAsyncSelect).at(0).find('SingleValue div')
            .text()).toEqual(newInputVal1.label);

        const newInputVal2 = { label: 'Barber', value: '036' };
        await act(async () => {
            wrapper.find(HDAsyncSelect).at(0).find('Select').props()
                .onInputChange(newInputVal2.label);
            wrapper.find(HDAsyncSelect).at(0).find('Select').instance()
                .selectOption(newInputVal2);
        });
        wrapper.update();
        await fastForwardFakeTimers(wrapper);
        expect(wrapper.find(HDAsyncSelect).at(0).find('SingleValue div')
            .text()).toEqual(newInputVal2.label);
    });

    test('term can be put in occupation industry async select when "Employed" status is selected', async () => {
        const wrapper = await getWrapper();

        await checkRadioButton(wrapper, YES_RADIO_BUTTON_VAL);

        const newInputVal = { label: 'Accountancy', value: '001' };
        await act(async () => {
            wrapper.find(HDAsyncSelect).at(1).find('Select').props()
                .onInputChange(newInputVal.label);
            wrapper.find(HDAsyncSelect).at(1).find('Select').instance()
                .selectOption(newInputVal);
        });
        wrapper.update();
        await fastForwardFakeTimers(wrapper);
        expect(wrapper.find(HDAsyncSelect).at(1).find('SingleValue div')
            .text()).toEqual(newInputVal.label);
    });
});
