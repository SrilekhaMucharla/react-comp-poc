import React from 'react';
import { HDLabelRefactor, HDAsyncSelect } from 'hastings-components';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDPrimaryEmployementInfoPage from '../HDPrimaryEmployementInfoPage';
import * as messages from '../HDDriverEmployement.messages';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const EMPL_CODE_EMPLOYED = 'E';
const EMPL_CODE_SELF_EMPLOYED = 'S';
const EMPL_CODE_EDUCATION = 'F';
const EMPL_CODE_RETIRED = 'R';
const EMPL_CODE_HOUSEHOLD_DUTIES = 'H';
const EMPL_CODE_UNEMPLOYED = 'U';
const EMPL_CODE_INDEP_MEANS = 'I';
const EMPL_CODE_DISABILITY = 'N';
const INDUSTRY_CODE_HOUESHOLD_DUTIES = '948';
const GENDER_CODE_DR_FEMALE = '005';

async function fastForwardFakeTimers(wrapper) {
    await act(async () => {
        jest.runAllTimers();
    });
    wrapper.update();
}

async function selectEmploymentStatus(wrapper, employmentCode) {
    await act(async () => {
        wrapper.find('Select').at(0)
            .props()
            .onChange({
                label: employmentCode,
                value: employmentCode,
            });
    });
    wrapper.update();
}

describe('<HDPrimaryEmployementInfoPage />', () => {
    createPortalRoot();
    jest.useFakeTimers();

    const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

    const businessTypeFieldName = 'businessTypeFull';
    const businessTypePath = `${driverPath}.${businessTypeFieldName}.aspects.availableValues`;

    const occupationFullFieldName = 'occupationFull';
    const occupationFullPath = `${driverPath}.${occupationFullFieldName}`;

    const fullEmpStatusFieldName = 'fullEmpStatus';
    const fullEmpStatusPath = `${driverPath}.${fullEmpStatusFieldName}`;

    const personPrefixPath = 'person.prefix.value.code';
    const driverVMPath = 'lobData.privateCar.coverables.drivers.children[0]';
    const prefixPath = `${driverVMPath}.${personPrefixPath}`;

    const pathsToClone = [businessTypePath, occupationFullPath, fullEmpStatusPath];

    const additionalSubmissionValues = [{ path: prefixPath, value: GENDER_CODE_DR_FEMALE }];

    const getWrapper = () => mountWithSubmissionVM(
        <HDPrimaryEmployementInfoPage />,
        pathsToClone,
        additionalSubmissionValues
    );

    it('should render the component and match snapshot', async () => {
        const wrapper = await getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('click on first icon displays tooltipOverlay', async () => {
        const wrapper = await getWrapper();
        const iconOverlay = wrapper.find('.hd-overlay-btn').at(0);
        await act(async () => {
            iconOverlay
                .simulate('click');
        });
        wrapper.update();
        expect(wrapper.find('.overlay').exists()).toBe(true);
    });

    test('Select option "Self employed" and dispaly "What do you do?"', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_SELF_EMPLOYED);

        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation'))
            .toHaveLength(1);
    });
    test('Select option "Self employed" and dispaly Infocard', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_SELF_EMPLOYED);

        expect(wrapper.find('HDInfoCardRefactor'))
            .toHaveLength(1);
    });

    test('Select option "Self employed" and dispaly "What industry do you work in?"', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_SELF_EMPLOYED);

        expect(wrapper.find('HDAsyncSelect#primary-empl-business'))
            .toHaveLength(1);
    });

    test('Select option "In Full Or Part Time Education" and dispaly "What type of student are you?"', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_EDUCATION);

        expect(wrapper.find('HDDropdownList#primary-empl-occupation')).toHaveLength(1);
        expect(wrapper.find('HDDropdownList#primary-empl-occupation').find(HDLabelRefactor).at(0).props())
            .toHaveProperty('text', messages.typeOfStudent(false));
    });

    test('Select option "Household Duties" and dispaly "What do you do?"', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_HOUSEHOLD_DUTIES);

        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation')).toHaveLength(1);
        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation').find(HDLabelRefactor).at(0).props()).toHaveProperty('text', messages.occupation(false));
    });

    test('Select option "Retired" and expect no further questions', async () => {
        const wrapper = await getWrapper();
        await selectEmploymentStatus(wrapper, EMPL_CODE_RETIRED);
        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation').exists()).toBeFalsy();
    });

    test('Select option "Independent Means" and expect no further questions', async () => {
        const wrapper = await getWrapper();
        await selectEmploymentStatus(wrapper, EMPL_CODE_INDEP_MEANS);
        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation').exists()).toBeFalsy();
    });

    test('Select option "Unemployed" and expect no further questions', async () => {
        const wrapper = await getWrapper();
        await selectEmploymentStatus(wrapper, EMPL_CODE_UNEMPLOYED);
        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation').exists()).toBeFalsy();
    });

    test('Select option "Not Employed Due To Disability" and expect no further questions', async () => {
        const wrapper = await getWrapper();
        await selectEmploymentStatus(wrapper, EMPL_CODE_DISABILITY);
        expect(wrapper.find('HDAsyncSelect#primary-empl-occupation').exists()).toBeFalsy();
    });

    test('values can be put in occupation async select', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_EMPLOYED);

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

        await selectEmploymentStatus(wrapper, EMPL_CODE_EMPLOYED);

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

    test('term can be put in occupation industry async select when "Household Duties" status is selected', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_HOUSEHOLD_DUTIES);

        const newInputVal = { label: 'Accountancy', value: '001' };
        await act(async () => {
            wrapper.find(HDAsyncSelect).at(1).find('Select').props()
                .onInputChange(newInputVal.label);
        });
        wrapper.update();
        await fastForwardFakeTimers(wrapper);
        expect(wrapper.find(HDAsyncSelect).at(1).find('Select input')
            .at(0)
            .closest('div')
            .find('div')
            .at(1)
            .text()).toEqual(newInputVal.label);
        expect(wrapper.find(HDAsyncSelect).at(1).find('input').at(1)
            .props()).toHaveProperty('value', INDUSTRY_CODE_HOUESHOLD_DUTIES);
    });

    test('changing employement status clears value from "What do you do?" answer input', async () => {
        const wrapper = await getWrapper();

        await selectEmploymentStatus(wrapper, EMPL_CODE_SELF_EMPLOYED);

        const newInputVal = { label: 'Accountant', value: 'A01' };
        await act(async () => {
            wrapper.find(HDAsyncSelect).at(0).find('Select').props()
                .onInputChange(newInputVal.label);
            wrapper.find(HDAsyncSelect).at(0).find('Select').instance()
                .selectOption(newInputVal);
        });
        wrapper.update();
        expect(wrapper.find(HDAsyncSelect).at(0).find('SingleValue div')
            .text()).toEqual(newInputVal.label);

        await selectEmploymentStatus(wrapper, EMPL_CODE_EMPLOYED);

        expect(wrapper.find(HDAsyncSelect).at(0).find('SingleValue div')
            .exists()).toBeFalsy();
        expect(wrapper.find(HDAsyncSelect).at(0).find('input').at(1)
            .prop('value')).toBeFalsy();
    });
});
