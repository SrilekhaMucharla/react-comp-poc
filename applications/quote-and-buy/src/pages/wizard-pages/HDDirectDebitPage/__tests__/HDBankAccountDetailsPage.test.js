import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { HastingsValidationService } from 'hastings-capability-validation';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDBankAccountDetailsPage from '../HDBankAccountDetailsPage';
import submission from '../mock/mockSubmission.json';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('hastings-capability-validation');

let viewModelService;
let customizeSubmissionVM;

/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 */
const onChangeAction = (component, path, actionName, actionValue) => {
    component
        .invoke('onChange')({
            target: {
                name: actionName,
                value: actionValue,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};
/**
* A helper function to perform onBlur event on a given component.
* @param {*} component - component to preform onChange() on.
* @param {*} path - path prop to component.
* @param {*} actionName - name prop.
* @param {*} actionValue - new value of component 'value' prop.
*/
const onBlurAction = (component, path, actionName, actionValue) => {
    component
        .invoke('onBlur')({
            target: {
                name: actionName,
                value: actionValue,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};

describe('<HDBankAccountDetailsPage /> enter valid values', () => {
    beforeEach(async () => {
        viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        customizeSubmissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
    });

    test('render component', () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        expect(wrapper).toHaveLength(1);
    });

    test('input and validate sort code one', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));


        const input = wrapper.find('[id="sort-code-1"]').at(0);

        const code1 = '11';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code1
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code1
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });

    test('input and validate sort code two', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('[id="sort-code-2"]').at(0);

        const code2 = '11';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code2
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code2
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });

    test('input and validate sort code three', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('[id="sort-code-3"]').at(0);

        const code3 = '11';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code3
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code3
        ));


        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });

    test('input and validate account number with no sort code', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '11223344';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            accountNumber
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            accountNumber
        ));


        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });

    test('input and validate account number with sort code and expect serviceCall from onAccountNumberBlur', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));

        let input = wrapper.find('[id="sort-code-1"]').at(0);

        const code1 = '11';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-2"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-3"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        await act(async () => wrapper.update());

        HastingsValidationService.validateBankAccount.mockResolvedValue({ result: { isValid: true } });

        input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '11223344';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => onBlurAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });

    test('input and validate account number with sort code and expect serviceCall from constructSortCode', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));

        let input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '11223344';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        input = wrapper.find('[id="sort-code-1"]').at(0);

        const code1 = '11';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-2"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-3"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.bank-account-details__invalid-field')).toHaveLength(0);
    });
});

describe('<HDBankAccountDetailsPage /> enter invalid values', () => {
    viewModelService = ViewModelServiceFactory.getViewModelService(
        productMetadata, defaultTranslator
    );

    customizeSubmissionVM = viewModelService.create(
        submission,
        'pc',
        'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
    );

    test('enter invalid sort code one', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));


        const input = wrapper.find('.bank-account-details__sort-code-1').at(0);

        const code1 = '1';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code1
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code1
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });

    test('enter invalid sort code two', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('.bank-account-details__sort-code-2').at(0);

        const code2 = '1';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code2
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code2
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });

    test('enter invalid sort code three', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('.bank-account-details__sort-code-3').at(0);

        const code3 = '1';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code3
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            code3
        ));


        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });

    test('invalid account number with no sort code', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));
        const input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '223344';
        await act(async () => onChangeAction(
            input,
            input.prop('path'),
            input.prop('name'),
            accountNumber
        ));

        await act(async () => onBlurAction(
            input,
            input.prop('path'),
            input.prop('name'),
            accountNumber
        ));


        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });

    test('input account number with sort code and expect account validation server to return false', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));

        let input = wrapper.find('[id="sort-code-1"]').at(0);

        const code1 = '11';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-2"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-3"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        await act(async () => wrapper.update());

        HastingsValidationService.validateBankAccount.mockResolvedValue({ result: { isValid: false } });

        input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '11223344';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => onBlurAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });

    test('input account number with sort code and catch server exception', async () => {
        const wrapper = mount((
            <HDBankAccountDetailsPage
                customizeSubmissionVM={customizeSubmissionVM} />
        ));

        let input = wrapper.find('[id="sort-code-1"]').at(0);

        const code1 = '11';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-2"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        input = wrapper.find('[id="sort-code-3"]').at(0);

        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), code1
        ));

        await act(async () => wrapper.update());

        HastingsValidationService.validateBankAccount.mockRejectedValue();

        input = wrapper.find('[name="accountNumber"]').at(0);

        const accountNumber = '11223344';
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => onBlurAction(
            input, input.prop('path'), input.prop('name'), accountNumber
        ));

        await act(async () => wrapper.update());

        expect(wrapper.find('.error')).toHaveLength(2);
    });
});
