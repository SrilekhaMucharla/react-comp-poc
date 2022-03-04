import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { MemoryRouter as Router } from 'react-router-dom';
import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HastingsDirectCarPurchasePage from '../HDCarPurchasePage';
import submission from '../../../../routes/SubmissionVMInitial';
import { setNavigation as setNavigationAction } from '../../../../redux-thunk/actions';
import withTranslator from '../../__helpers__/test/withTranslator';

const tempGetElementById = document.getElementById;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const month = '6';
const year = '2020';

const onChangeAction = (component, path, componentName, changeValue) => {
    component.invoke('onChange')({
        target: {
            name: componentName,
            value: changeValue,
            // eslint-disable-next-line no-unused-vars
            setAttribute: (name, value) => { /* mock */ },
            getAttribute: (attr) => {
                if (attr === 'path') return path;
                return '';
            }
        }
    });
};

describe('<HDCarPurchasePage />', () => {
    document.getElementById = jest.fn().mockImplementation((id) => {
        if (id === 'carPurchaseMonth') return ({ value: month, maxLength: 2 });
        if (id === 'carPurchaseYear') return ({ value: year, maxLength: 4 });
        if (id === 'nbyCheckBox') return ({ checked: true });
        return null;
    });
    let store;
    let wrapper;
    beforeEach(async () => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        // this is an workaround, submissionVM is too big to create SNAP
        const vehicle = _.get(submissionVM, vehiclePath);
        _.set(submission, vehiclePath, vehicle);
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionVM,
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
        await act(async () => {
            wrapper = mount(withTranslator(
                <Router>
                    <ViewModelServiceContext.Provider value={viewModelService}>
                        <Provider store={store}>
                            <HastingsDirectCarPurchasePage
                                submissionVM={submissionVM}
                                setNavigation={setNavigationAction} />
                        </Provider>
                    </ViewModelServiceContext.Provider>
                </Router>
            ));
        });
    });

    test('render component', async () => {
        await act(async () => wrapper.update());
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(HastingsDirectCarPurchasePage)).toHaveLength(1);
    });

    test('Keeper question to NO opens form with dropdown lists', async () => {
        const noButton = wrapper.find('HDToggleButtonGroup');

        await act(async () => {
            onChangeAction(
                noButton,
                noButton.prop('path'),
                noButton.prop('name'),
                'false'
            );
        });

        await act(async () => wrapper.update());

        const component = wrapper.find('.car-purchase__owner-keeper');
        expect(component.props().hidden).toBeFalsy();
    });

    test('Keeper question to YES does not open form', async () => {
        const yesButton = wrapper.find('HDToggleButtonGroup');

        await act(async () => {
            onChangeAction(
                yesButton,
                yesButton.prop('path'),
                yesButton.prop('name'),
                'true'
            );
        });

        await act(async () => wrapper.update());

        const component = wrapper.find('.car-purchase__owner-keeper');
        expect(component.props().hidden).toBeTruthy();
    });

    test('Enter month and year of car buy date', async () => {
        const monthInput = wrapper.find('input').at(0);
        const yearInput = wrapper.find('input').at(1);

        await act(async () => {
            onChangeAction(
                monthInput,
                monthInput.prop('path'),
                monthInput.prop('name'),
                month
            );
        });
        await act(async () => monthInput.props().onBlur({ target: { name: 'month' } }));

        await act(async () => wrapper.update());

        await act(async () => {
            onChangeAction(
                yearInput,
                yearInput.prop('path'),
                yearInput.prop('name'),
                year
            );
        });
        await act(async () => yearInput.props().onBlur({ target: { name: 'year' } }));

        await act(async () => wrapper.update());

        expect(wrapper.find('[id="carPurchaseMonth"]').at(0).prop('value')).toBe(month);
        expect(wrapper.find('[id="carPurchaseYear"]').at(0).prop('value')).toBe(year);
    });

    test('click on "not bought yet" checkbox and expect input to be filled', async () => {
        const checkbox = wrapper.find('[id="nbyCheckBox"]');
        await act(async () => checkbox.invoke('onClick')());
        await act(async () => wrapper.update());

        const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthTemp = String(date.getMonth() + 1).padStart(2, '0');
        const yearTemp = date.getFullYear();
        expect(wrapper.find('[id="carPurchaseMonth"]').at(0).prop('value')).toBe(monthTemp);
        expect(wrapper.find('[id="carPurchaseYear"]').at(0).prop('value')).toBe(yearTemp);
    });

    test('"not bought yet" to false', async () => {
        document.getElementById = jest.fn().mockImplementation((id) => {
            if (id === 'nbyCheckBox') return ({ checked: false });
            return null;
        });
        const checkbox = wrapper.find('[id="nbyCheckBox"]');
        await act(async () => checkbox.invoke('onClick')());
        await act(async () => wrapper.update());

        expect(wrapper.find('[id="carPurchaseMonth"]').at(0).prop('value')).toBe(null);
        expect(wrapper.find('[id="carPurchaseYear"]').at(0).prop('value')).toBe(null);
    });

    test('Enter invlid month and expect error', async () => {
        document.getElementById = jest.fn().mockImplementation((id) => {
            if (id === 'carPurchaseMonth') return ({ value: '0', maxLength: 2 });
            if (id === 'carPurchaseYear') return ({ value: '', maxLength: 4 });
            if (id === 'nbyCheckBox') return ({ checked: true });
            return null;
        });
        const monthInput = wrapper.find('input').at(0);

        await act(async () => {
            onChangeAction(
                monthInput,
                monthInput.prop('path'),
                monthInput.prop('name'),
                '0'
            );
        });

        await act(async () => wrapper.update());

        expect(wrapper.find('.car-purchase-date-error').prop('hidden')).toBeFalsy();
    });

    test('Enter invlid year and expect error', async () => {
        document.getElementById = jest.fn().mockImplementation((id) => {
            if (id === 'carPurchaseMonth') return ({ value: '', maxLength: 2 });
            if (id === 'carPurchaseYear') return ({ value: '000', maxLength: 4 });
            if (id === 'nbyCheckBox') return ({ checked: true });
            return null;
        });
        const yearInput = wrapper.find('input').at(1);

        await act(async () => {
            onChangeAction(
                yearInput,
                yearInput.prop('path'),
                yearInput.prop('name'),
                '000'
            );
        });
        await act(async () => yearInput.props().onBlur({ target: { name: 'year' } }));

        await act(async () => wrapper.update());

        expect(wrapper.find('.car-purchase-date-error').prop('hidden')).toBeFalsy();
    });

    test('Keeper question to NO, check "not bought yet" and select from dropdown lists', async () => {
        const checkbox = wrapper.find('[id="nbyCheckBox"]');
        await act(async () => checkbox.invoke('onClick')());
        await act(async () => wrapper.update());

        const noButton = wrapper.find('HDToggleButtonGroup');

        await act(async () => {
            onChangeAction(
                noButton,
                noButton.prop('path'),
                noButton.prop('name'),
                'false'
            );
        });

        await act(async () => wrapper.update());

        const dropdownKeeper = wrapper.find('HDDropdownList').at(0);

        await act(async () => onChangeAction(
            dropdownKeeper,
            dropdownKeeper.prop('path'),
            dropdownKeeper.prop('name'),
            { value: '1_PR', label: 'Proposer' }
        ));

        await act(async () => wrapper.update());

        const dropdownOwner = wrapper.find('HDDropdownList').at(1);

        await act(async () => onChangeAction(
            dropdownOwner,
            dropdownOwner.prop('path'),
            dropdownOwner.prop('name'),
            { value: '1_PR', label: 'Proposer' }
        ));

        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDForm').props().onValidation(true));
        await act(async () => wrapper.update());
        const action = store.getActions()[store.getActions().length - 1];

        expect(action).toEqual({ type: 'SET_NAVIGATION', payload: { canForward: true } });
    });
});

describe('<HDCarPurchasePage /> submission: purchaseDate and owner, keeper chosen', () => {
    document.getElementById = jest.fn().mockImplementation((id) => {
        if (id === 'carPurchaseMonth') return ({ value: month, maxLength: 2 });
        if (id === 'carPurchaseYear') return ({ value: year, maxLength: 4 });
        if (id === 'nbyCheckBox') return ({ checked: true });
        return null;
    });
    let store;
    let wrapper;
    beforeEach(async () => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        // Initialize mockstore with empty state
        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );
        const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
        // this is an workaround, submissionVM is too big to create SNAP
        const vehicle = _.get(submissionVM, vehiclePath);
        _.set(submissionVM, vehiclePath, vehicle);
        const legalOwnerName = 'legalOwner';
        const legalOwnerPath = `${vehiclePath}.${legalOwnerName}`;
        _.set(submissionVM, legalOwnerPath, '1_PR');
        const registeredKeeperName = 'registeredKeeper';
        const registeredKeeperPath = `${vehiclePath}.${registeredKeeperName}`;
        _.set(submissionVM, registeredKeeperPath, '1_PR');
        const legalOwnerOrKeeperName = 'isRegisteredKeeperAndLegalOwner';
        const legalOwnerOrKeeperPath = `${vehiclePath}.${legalOwnerOrKeeperName}`;
        _.set(submissionVM, legalOwnerOrKeeperPath, '1_PR');
        const purchaseDateName = 'purchaseDate';
        const purchaseDatePath = `${vehiclePath}.${purchaseDateName}`;
        _.set(submissionVM, purchaseDatePath, new Date('2020-11-01T00:00:00Z'));
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionVM,
                },
                app: {
                    step: 1,
                    prevStep: 0
                },
            }
        };
        store = mockStore(initialState);
        await act(async () => {
            wrapper = mount(withTranslator(
                <Router>
                    <ViewModelServiceContext.Provider value={viewModelService}>
                        <Provider store={store}>
                            <HastingsDirectCarPurchasePage
                                submissionVM={submissionVM}
                                setNavigation={setNavigationAction} />
                        </Provider>
                    </ViewModelServiceContext.Provider>
                </Router>
            ));
        });
    });

    test('render component', async () => {
        await act(async () => wrapper.update());
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(HastingsDirectCarPurchasePage)).toHaveLength(1);
    });

    afterAll(async () => {
        document.getElementById = tempGetElementById;
    });
});
