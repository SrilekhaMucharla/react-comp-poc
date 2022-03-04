import React from 'react';
import { HDToggleButtonGroupRefactor, HDTextInputRefactor } from 'hastings-components';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import HDDriverNamePage from '../HDDriverNamePage';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mockUseLocation()
}));

const PREFIX_FIELD_NAME = 'prefix';
const GENDER_FIELD_NAME = 'gender';
const PREFIX_CONDE_MR = '003_Mr';
const PREFIX_CONDE_MRS = '004';
const PREFIX_CODE_DR = '003';
const GENDER_CODE_MALE = 'M';
const GENDER_CODE_FEMALE = 'F';

const FIRST_NAME_TEXT = 'John';
const LAST_NAME_TEXT = 'Smith';

const WRONG_FIRST_NAME_TEXT = 'john7';
const WRONG_LAST_NAME_TEXT = 'smith+';
const WRONG_FIRST_NAME_TEXT_CAPITALIZED = 'John7';
const WRONG_LAST_NAME_TEXT_CAPITALIZED = 'Smith+';

async function checkRadioButton(wrapper, name, value) {
    await act(async () => {
        wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === name)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
    expect(wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === name)
        .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value).props())
        .toHaveProperty('checked', true);
}

async function inputText(wrapper, textInputCompIndex, value, transformedValue = value) {
    const { path, name } = wrapper.find(HDTextInputRefactor).at(textInputCompIndex).find('input').props();
    await act(async () => {
        wrapper.find(HDTextInputRefactor).at(textInputCompIndex).find('input').simulate('change', {
            target: {
                name,
                value: value,
                getAttribute: () => path
            }
        });
    });
    wrapper.update();
    expect(wrapper.find(HDTextInputRefactor).at(textInputCompIndex).find('input').props()).toHaveProperty('value', transformedValue);
}

describe('<HDDriverNamePage />', () => {
    // given
    let wrapper = null;
    const prefixAvailableValuesPath = 'baseData.accountHolder.prefix.aspects';
    const relationToProposerAvailableValuesPath = 'lobData.privateCar.coverables.drivers.children.0.relationToProposer.aspects';
    const pathsToClone = [
        prefixAvailableValuesPath,
        relationToProposerAvailableValuesPath
    ];

    beforeEach(async () => {
        wrapper = await mountWithSubmissionVM(
            <HDDriverNamePage />,
            pathsToClone,
            [],
            {},
            {
                app: {
                    pages: {
                        drivers: {
                            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false },
                        }
                    }
                },
            }
        );
    });

    it('should render the component and match snapshot', async () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('can select regular prefix "Mr"', async () => {
        await checkRadioButton(wrapper, PREFIX_FIELD_NAME, PREFIX_CONDE_MR);

        expect(wrapper.find('.gender-question-container').exists()).toBe(false);
    });

    test('can select regular prefix "Mrs"', async () => {
        await checkRadioButton(wrapper, PREFIX_FIELD_NAME, PREFIX_CONDE_MRS);

        expect(wrapper.find('.gender-question-container').exists()).toBe(false);
    });

    test('can select gender after selecting "Dr" prefix', async () => {
        expect(wrapper.find('.gender-question-container').exists()).toBe(false);

        await checkRadioButton(wrapper, PREFIX_FIELD_NAME, PREFIX_CODE_DR);

        expect(wrapper.find('.gender-question-container').exists()).toBe(true);

        await checkRadioButton(wrapper, GENDER_FIELD_NAME, GENDER_CODE_MALE);
        await checkRadioButton(wrapper, GENDER_FIELD_NAME, GENDER_CODE_FEMALE);
    });

    test('can input first name', async () => {
        await inputText(wrapper, 0, FIRST_NAME_TEXT);
    });

    test('can input last name', async () => {
        await inputText(wrapper, 1, LAST_NAME_TEXT);
    });

    test('handle wrong first name', async () => {
        await inputText(wrapper, 0, WRONG_FIRST_NAME_TEXT, WRONG_FIRST_NAME_TEXT_CAPITALIZED);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    });

    test('handle wrong last name', async () => {
        await inputText(wrapper, 0, WRONG_LAST_NAME_TEXT, WRONG_LAST_NAME_TEXT_CAPITALIZED);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    });

    test('can input data on another driver', async () => {
        mockUseLocation.mockImplementation(() => ({ state: { driverIndex: 1 } }));

        await checkRadioButton(wrapper, PREFIX_FIELD_NAME, PREFIX_CONDE_MR);
        expect(wrapper.find('.gender-question-container').exists()).toBe(false);
        await inputText(wrapper, 0, FIRST_NAME_TEXT);
        await inputText(wrapper, 1, LAST_NAME_TEXT);
        await checkRadioButton(wrapper, PREFIX_FIELD_NAME, PREFIX_CODE_DR);
        expect(wrapper.find('.gender-question-container').exists()).toBe(true);
        await checkRadioButton(wrapper, GENDER_FIELD_NAME, GENDER_CODE_MALE);

        mockUseLocation.mockReset();
    });
});
