/*
* Add missing tests for:
* HDImageRadioButton.typeName,
* HDAsyncSelect.typeName,
*
* Check if VM Validation (yup) is working
*
* =======================
*
* Refactoring
*
* 1. Children components traverser
* 2. Redux like value updates (Q: are we want to update data after "Continue" button?)
* 3. Move to Q&B -> this is more like integration Layer
* 4. Don't relay on uyp while restoring data from View Model
 */

import React from 'react';
import { configure } from 'enzyme';
import _ from 'lodash';
import Adapter from 'enzyme-adapter-react-16';
// TODO: this needs to be changed in next sprint as Part II
// TODO: HDForm should be moved to QnB App as an integration layer
// eslint-disable-next-line import/no-extraneous-dependencies
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
// eslint-disable-next-line import/no-extraneous-dependencies
import productMetadata from 'quote-and-buy/src/generated/metadata/product-metadata.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import submission from 'quote-and-buy/src/routes/SubmissionVMInitial';
import {
    HDDatePicker, HDDropdownList, HDTextInput, HDToggleButtonGroup
} from '../../../index';
import * as yup from '../../../yup';
import HDForm from '../HDForm';
import { defaultTranslator } from '../../__helpers__/testHelper';

configure({ adapter: new Adapter() });

describe('<HDForm />', () => {
    let validationSchema = yup.object({});
    let model = { lobData: {} };

    beforeEach(() => {
        validationSchema = yup.object({});
        model = { lobData: {} };
    });

    test('Render component with one div', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <div>Wrapped</div>
                </HDForm>
            );
        });

        expect(wrapper.find('div'))
            .toHaveLength(1);

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Render component with one nested div and fn', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <div>
                        <span>span text</span>
                        {(hdProps) => {
                            return (
                                <div>
                                    Values:
                                    {Object.keys(hdProps.values).length}
                                </div>
                            );
                        }}
                    </div>
                </HDForm>
            );
        });

        expect(wrapper.find('div'))
            .toHaveLength(2);

        expect(wrapper.find('div')
            .at(1)
            .text())
            .toBe('Values:0');

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Render component with one nested function', async () => {
        let wrapper;

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    {(hdProps) => {
                        return (
                            <div>
                                Values:
                                {Object.keys(hdProps.values).length}
                            </div>
                        );
                    }}
                </HDForm>
            );
        });

        expect(wrapper.find('div'))
            .toHaveLength(1);

        expect(wrapper.find('div')
            .at(0)
            .text())
            .toBe('Values:0');

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Render component with many nested elements', async () => {
        let wrapper;

        const firstTest = 'first';
        const secoundTest = 'secound';

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <div>{firstTest}</div>
                    <div>{secoundTest}</div>
                </HDForm>
            );
        });

        expect(wrapper.find('div'))
            .toHaveLength(2);

        expect(wrapper.find('div')
            .at(0)
            .text())
            .toBe(firstTest);

        expect(wrapper.find('div')
            .at(1)
            .text())
            .toBe(secoundTest);

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Render component with many nested elements and one function', async () => {
        let wrapper;

        const firstTest = 'first';
        const secondTest = 'secound';

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <div>{firstTest}</div>
                    <div>{secondTest}</div>
                    {() => {
                        const thirdTest = firstTest + secondTest;

                        return (<div>{thirdTest}</div>);
                    }}
                </HDForm>
            );
        });

        expect(wrapper.find('div'))
            .toHaveLength(3);

        expect(wrapper.find('div')
            .at(0)
            .text())
            .toBe(firstTest);

        expect(wrapper.find('div')
            .at(1)
            .text())
            .toBe(secondTest);

        expect(wrapper.find('div')
            .at(2)
            .text())
            .toBe(firstTest + secondTest);

        expect(wrapper)
            .toMatchSnapshot();
    });
});

/**
 * List of available implementations:
 * @see HDForm allowedHDComponents
 */

describe('HDForm HDComponents binding', () => {
    let validationSchema = yup.object({});
    let model = { lobData: {} };
    let viewModelService;

    beforeEach(() => {
        validationSchema = yup.object({});
        model = { lobData: {} };

        viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
    });

    function createEvent(costAmountFieldname, costAmountPath, value) {
        return {
            preventDefault: () => {},
            target: {
                name: costAmountFieldname,
                value: value,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value1) => { /* mock */ },
                getAttribute: (attr) => {
                    if (attr === 'path') {
                        return costAmountPath;
                    }
                    return '';
                }
            }
        };
    }

    test('HDToggleButtonGroup bind', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const isCarModifiedFieldname = 'isCarModified';
        const isCarModifiedPath = `${vehiclePath}.${isCarModifiedFieldname}`;

        _.set(model, `${isCarModifiedPath}.value`, '');

        const availableValues = [{
            value: true,
            name: 'Yes',
            icon: 'check'
        }, {
            value: false,
            name: 'No',
            icon: 'times'
        }];

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDToggleButtonGroup
                        path={isCarModifiedPath}
                        name={isCarModifiedFieldname}
                        label={{ text: 'Is your car modified' }}
                        availableValues={availableValues} />
                </HDForm>
            );
        });

        const toggle = wrapper.find('HDToggleButtonGroup')
            .find('ButtonGroup');

        expect(toggle.find('ToggleButton'))
            .toHaveLength(2);

        // Simulate value update
        const answerIndex = 0;
        const testValue = availableValues[answerIndex].value;
        await act(async () => {
            wrapper.find(HDToggleButtonGroup)
                .props()
                .onChange(createEvent(isCarModifiedFieldname, isCarModifiedPath, testValue));
        });

        expect(_.get(model, `${isCarModifiedPath}.value`))
            .toBe(testValue);
    });

    test('HDToggleButtonGroup restore value', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const isCarModifiedFieldname = 'isCarModified';
        const isCarModifiedPath = `${vehiclePath}.${isCarModifiedFieldname}`;

        const availableValues = [{
            value: 'true',
            name: 'Yes',
            icon: 'check'
        }, {
            value: 'false',
            name: 'No',
            icon: 'times'
        }];

        const testValue = availableValues[1];
        _.set(model, `${isCarModifiedPath}.value`, testValue.value);

        validationSchema = yup.object({
            [isCarModifiedFieldname]: yup.boolean()
                .required('This filed is required.')
                .VMValidation(isCarModifiedPath, null, model),
        });

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDToggleButtonGroup
                        path={isCarModifiedPath}
                        name={isCarModifiedFieldname}
                        label={{ text: 'Is your car modified' }}
                        availableValues={availableValues} />
                </HDForm>
            );
        });

        const toggleButtons = wrapper.find('HDToggleButtonGroup')
            .find('ButtonGroup')
            .find('ToggleButton');

        expect(toggleButtons.find('input')
            .find({
                name: 'isCarModified',
                value: testValue.value
            })
            .prop('checked'))
            .toBe(true);
    });

    test('HDTextInput bind', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const costPath = `${vehiclePath}.costNew`;
        const costAmountFieldname = 'amount';
        const costAmountPath = `${costPath}.${costAmountFieldname}`;

        _.set(model, `${costAmountPath}.value`, '');

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDTextInput
                        className="mb-3"
                        type="currency"
                        icon="pound-sign"
                        path={costAmountPath}
                        name={costAmountFieldname} />
                </HDForm>
            );
        });

        const input = wrapper.find('FormControl')
            .find('input');

        expect(input
            .prop('path'))
            .toBe(costAmountPath);

        // Simulate value update
        const testValue = '1';
        await act(async () => {
            input
                .props()
                .onChange(createEvent(costAmountFieldname, costAmountPath, testValue));
        });

        expect(_.get(model, `${costAmountPath}.value`))
            .toBe(testValue);
    });

    test('HDTextInput restore value, currency', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const costPath = `${vehiclePath}.costNew`;
        const costAmountFieldname = 'amount';
        const costAmountPath = `${costPath}.${costAmountFieldname}`;

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const testValue = '3344';
        _.set(submissionVM, `${costPath}.value`, {
            amount: testValue,
            currency: 'gbp'
        });

        // Setup one node of VM to get proper value
        const costVM = _.get(submissionVM, costPath);
        _.set(model, costPath, costVM);

        validationSchema = yup.object({
            [costAmountFieldname]: yup.number()
                .required('This filed is required.')
                .VMValidation(costPath, null, model),
        });

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDTextInput
                        className="mb-3"
                        type="currency"
                        icon="pound-sign"
                        path={costAmountPath}
                        name={costAmountFieldname} />
                </HDForm>
            );
        });

        wrapper.update();

        const input = wrapper.find('FormControl')
            .find('input');

        expect(input
            .prop('path'))
            .toBe(costAmountPath);

        expect(input.prop('value'))
            .toBe(testValue);
    });

    test('HDTextInput restore value, string', async () => {
        let wrapper;

        const driverPath = 'baseData.accountHolder';
        const firstNameFieldName = 'firstName';
        const firstNamePath = `${driverPath}.${firstNameFieldName}`;

        const testValue = 'Firstname';
        _.set(model, `${firstNamePath}.value`, testValue);

        validationSchema = yup.object({
            [firstNameFieldName]: yup.string()
                .required('This filed is required.')
                .VMValidation(firstNamePath, null, model),
        });

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDTextInput
                        className="mb-3"
                        type="alphanum"
                        icon="pound-sign"
                        path={firstNamePath}
                        name={firstNameFieldName} />
                </HDForm>
            );
        });

        wrapper.update();

        const input = wrapper.find('FormControl')
            .find('input');

        expect(input
            .prop('path'))
            .toBe(firstNamePath);

        expect(input.prop('value'))
            .toBe(testValue);
    });

    test('HDDropdownList bind', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const registeredKeeperFieldname = 'registeredKeeper';
        const registeredKeeperPath = `${vehiclePath}.${registeredKeeperFieldname}`;

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        const registeredKeeperAvailableValues = _.get(submissionVM, registeredKeeperPath)
            .aspects
            .availableValues
            .map((type) => {
                return {
                    value: type.code,
                    label: defaultTranslator({
                        id: type.name,
                        defaultMessage: type.name
                    })
                };
            });

        _.set(model, `${registeredKeeperPath}.value`, '');

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDDropdownList
                        path={registeredKeeperPath}
                        name={registeredKeeperFieldname}
                        options={registeredKeeperAvailableValues}
                        label={{ text: 'Registered Keeper' }}
                        selectSize="lg" />
                </HDForm>
            );
        });

        const testValue = registeredKeeperAvailableValues[2];
        await act(async () => {
            wrapper.find('Select')
                .props()
                .onChange(testValue);
        });

        wrapper.update();

        // Select component as value is storing whole event
        expect(wrapper.find('SelectContainer')
            .props()
            .getValue()[0])
            .toBe(testValue);

        // In VM we expect only type.code
        expect(_.get(model, `${registeredKeeperPath}.value`))
            .toBe(testValue.value);
    });

    test('HDDropdownList restore value', async () => {
        let wrapper;

        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        const registeredKeeperFieldname = 'registeredKeeper';
        const registeredKeeperPath = `${vehiclePath}.${registeredKeeperFieldname}`;

        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        // this is an workaround, submissionVM is too big to create SNAP
        // const aspects = _.get(submissionVM, `${licenceTypePath}.aspects.availableValues`);
        // _.set(model, `${licenceTypePath}.aspects.availableValues`, aspects);

        const values = _.get(submissionVM, registeredKeeperPath)
            .aspects
            .availableValues;
        const testValue = values[2].code;

        const registeredKeeperAvailableValues = values
            .map((type) => {
                return {
                    value: type.code,
                    label: defaultTranslator({
                        id: type.name,
                        defaultMessage: type.name
                    })
                };
            });

        _.set(model, `${registeredKeeperPath}.value`, { code: testValue });

        validationSchema = yup.object({
            [registeredKeeperFieldname]: yup.object({ value: yup.string() })
                .required('This filed is required.')
                .VMValidation(registeredKeeperPath, null, model),
        });

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDDropdownList
                        path={registeredKeeperPath}
                        name={registeredKeeperFieldname}
                        options={registeredKeeperAvailableValues}
                        label={{ text: 'Registered Keeper' }}
                        selectSize="lg" />
                </HDForm>
            );
        });

        wrapper.update();

        // Select component as value is storing whole event
        expect(wrapper.find('SelectContainer')
            .props()
            .getValue()[0].value)
            .toBe(testValue);
    });

    test('HDDatePicker bind', async () => {
        let wrapper;

        const policyStartDateFieldName = 'periodStartDate';
        const policyStartDatePath = `baseData.${policyStartDateFieldName}`;

        _.set(model, `${policyStartDatePath}.value`, null);

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDDatePicker
                        path={policyStartDatePath}
                        name={policyStartDateFieldName}
                        minDate={-365}
                        maxDate={365}
                        label={{
                            text: 'Label',
                            size: 'lg',
                            iconPosition: 'r'
                        }}
                        subLabel={{
                            text: 'Sublabel',
                            size: 'xs',
                        }} />
                </HDForm>
            );
        });

        // Simulate day update
        const testDayValue = new Date().getDate();
        await act(async () => {
            wrapper.find('#hastingDateControlDay')
                .props()
                .onChange({ target: { value: testDayValue } });
        });

        wrapper.update();

        // Date should not be set
        expect(_.get(model, `${policyStartDatePath}.value`))
            .toBe(undefined);

        // Simulate day update (human readable date)
        const testMonthValue = new Date().getMonth() + 1;
        await act(async () => {
            wrapper.find('#hastingDateControlMonth')
                .props()
                .onChange({ target: { value: testMonthValue } });
        });

        wrapper.update();

        // Date should not be set
        expect(_.get(model, `${policyStartDatePath}.value`))
            .toBe(undefined);

        // Simulate day update
        const testYearValue = new Date().getFullYear();
        await act(async () => {
            wrapper.find('#hastingDateControlYear')
                .props()
                .onChange({ target: { value: testYearValue } });
        });

        wrapper.update();

        const input = wrapper.find('input')
            .find({ name: policyStartDateFieldName });

        expect(input
            .prop('path'))
            .toBe(policyStartDatePath);

        // Input is in human readable style 1-12, but Date month is zero index 0-11
        const expectedDate = new Date(new Date(testYearValue, testMonthValue - 1, testDayValue, 0, 0, 0, 0).setFullYear(testYearValue));
        // Date should not be set
        expect(input
            .props().value)
            .toStrictEqual(expectedDate);
    });

    // skipped due to new HDForm, it should pass when Develop is merged into tealium
    test.skip('HDDatePicker restore value', async () => {
        let wrapper;

        const policyStartDateFieldName = 'periodStartDate';
        const policyStartDatePath = `baseData.${policyStartDateFieldName}`;

        const testDayValue = new Date().getDate();
        const testMonthValue = new Date().getMonth();
        const testYearValue = new Date().getFullYear();
        const expectedDate = new Date(new Date(testYearValue, testMonthValue, testDayValue, 0, 0, 0, 0).setFullYear(testYearValue));

        _.set(model, `${policyStartDatePath}.value.year`, testYearValue);
        _.set(model, `${policyStartDatePath}.value.day`, testDayValue);
        _.set(model, `${policyStartDatePath}.value.month`, testMonthValue);

        validationSchema = yup.object({
            [policyStartDateFieldName]: yup.date()
                .required('This filed is required.')
                .VMValidation(policyStartDatePath, null, model),
        });

        await act(async () => {
            wrapper = mount(
                <HDForm submissionVM={model} validationSchema={validationSchema}>
                    <HDDatePicker
                        path={policyStartDatePath}
                        name={policyStartDateFieldName}
                        minDate={-365}
                        maxDate={365}
                        label={{
                            text: 'Label',
                            size: 'lg',
                            iconPosition: 'r'
                        }}
                        subLabel={{
                            text: 'Sublabel',
                            size: 'xs',
                        }} />
                </HDForm>
            );
        });

        wrapper.update();

        // Day should be set
        expect(wrapper.find('#hastingDateControlDay')
            .prop('value'))
            .toBe(String(testDayValue).padStart(2, '0'));

        // Month should be set
        // Input is in human readable style 1-12, but Date month is zero index 0-11
        expect(wrapper.find('#hastingDateControlMonth')
            .prop('value'))
            .toBe(String(testMonthValue + 1).padStart(2, '0'));

        // Month should be set
        expect(wrapper.find('#hastingDateControlYear')
            .prop('value'))
            .toBe(testYearValue);

        const input = wrapper.find('input')
            .find({ name: policyStartDateFieldName });

        expect(input
            .prop('path'))
            .toBe(policyStartDatePath);

        // Date should not be set
        expect(input
            .prop('value'))
            .toStrictEqual(expectedDate);
    });
});
