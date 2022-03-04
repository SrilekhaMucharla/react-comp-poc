import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ToggleButton from 'react-bootstrap/ToggleButton';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import HDCarLocationPage from '../HDCarLocationPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import * as messages from '../HDCarLocation.messages';
import withTranslator from '../../__helpers__/test/withTranslator';

const middlewares = [];
const mockStore = configureStore(middlewares);

const isCarHomeOvernightFieldName = 'isOvernightLocationHome';
const overNightPostalCodeFieldName = 'overnightLocationPostcode';
const usualParkingLocationFieldName = 'overnightParkingArrangements';

let store;
const dispatch = jest.fn();

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

describe('<HDCarLocationPage />', () => {
    let wrapper;
    beforeEach(async () => {
        // Init VM
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
        vehicle.overnightParkingArrangements.value = '7';
        _.set(submission, vehiclePath, vehicle);
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission
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
                <Provider store={store}>
                    <HDCarLocationPage dispatch={dispatch} />
                </Provider>
            ));
        });
    });
    test('render component', () => {
        expect(wrapper)
            .toHaveLength(1);
        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click other options, and check dropdown', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(1)
            .props();
        const toggleButtons = wrapper.find(ToggleButton);

        // Simulate click on "Other' button
        await act(async () => {
            onChangeAction(
                toggleButtons.at(7),
                path,
                usualParkingLocationFieldName,
                messages.someWhereElse,
            );
        });

        await act(async () => {
            wrapper.update();
        });

        expect(wrapper.find('HDDropdownList#car-location-where-parking-loc'))
            .toHaveLength(1);

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click NO for overnight-parking, and check postCode', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();
        const toggleButtons = wrapper.find(ToggleButton);
        // Simulate click on "NO' button
        await act(async () => {
            onChangeAction(toggleButtons.at(1), path, isCarHomeOvernightFieldName, 'false');
        });

        wrapper.update();

        expect(wrapper.find('#car-location-postcode-input'))
            .toHaveLength(5);

        expect(wrapper)
            .toMatchSnapshot();
    });
    test('Click YES for overnight-parking', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();
        const toggleButtons = wrapper.find(ToggleButton);
        // Simulate click on "YES' button
        await act(async () => {
            onChangeAction(toggleButtons.at(0), path, isCarHomeOvernightFieldName, 'true');
        });

        wrapper.update();

        expect(wrapper.find('[id="car-location-postcode-input"]'))
            .toHaveLength(0);

        expect(wrapper)
            .toMatchSnapshot();
    });
    test('Click NO for overnight-parking and enter postcode', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();
        const toggleButtons = wrapper.find(ToggleButton);
        // Simulate click on "NO' button
        await act(async () => {
            onChangeAction(toggleButtons.at(1), path, isCarHomeOvernightFieldName, 'false');
        });

        wrapper.update();

        // Set Postcode
        const inputBox = wrapper.find('[data-testid="text-input"]').at(0);
        const path2 = inputBox.props().path;
        await act(async () => {
            onChangeAction(inputBox, path2, overNightPostalCodeFieldName, '712343');
        });

        wrapper.update();

        expect(wrapper.find('HDInfoCardRefactor#car-location-parking-night-info'))
            .toHaveLength(1);

        expect(wrapper.find('#car-location-postcode-input').at(0).props().value)
            .toBe('712343');

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click YES for home overnight parking and select some location', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();
        const toggleButton = wrapper.find(ToggleButton);
        // Simulate click on "YES' button
        await act(async () => {
            onChangeAction(toggleButton.at(0), path, isCarHomeOvernightFieldName, 'true');
        });

        wrapper.update();

        const toggleButtons = wrapper.find(ToggleButton);

        const path2 = wrapper.find('HDToggleButtonGroup').at(1).prop('path');
        await act(async () => {
            onChangeAction(toggleButtons.at(3), path2, usualParkingLocationFieldName, '4');
        });

        wrapper.update();

        expect(wrapper.find('#car-location-postcode-input'))
            .toHaveLength(0);

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Entered Postcode and switched to overnight home YES', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();

        const toggleButtons = wrapper.find(ToggleButton);
        // Simulate click on "NO' button
        await act(async () => {
            onChangeAction(toggleButtons.at(1), path, isCarHomeOvernightFieldName, 'false');
        });

        wrapper.update();

        // Set Postcode
        const inputBox = wrapper.find('[data-testid="text-input"]').at(0);
        const path2 = inputBox.props().path;
        await act(async () => {
            onChangeAction(inputBox, path2, overNightPostalCodeFieldName, '712343');
        });

        wrapper.update();

        // Simulate click on "YES' button
        await act(async () => {
            onChangeAction(toggleButtons.at(0), path, isCarHomeOvernightFieldName, 'true');
            // toggleButton.at(0).simulate('click');
        });

        wrapper.update();

        expect(store.getActions()).toContainEqual({
            payload: { canForward: true },
            type: 'SET_NAVIGATION'
        });
        expect(wrapper.find('#car-location-postcode-input'))
            .toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
    });
    test('Parking Location Other dropdown select', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(1).props();
        const buttonOther = wrapper.find(ToggleButton).at(7);
        await act(async () => {
            onChangeAction(
                buttonOther,
                path,
                usualParkingLocationFieldName,
                messages.someWhereElse
            );
        });

        wrapper.update();

        const dropdown = wrapper.find('HDDropdownList').at(0);
        const path2 = dropdown.props().path;

        await act(async () => {
            dropdown.invoke('onChange')({
                target: {
                    name: dropdown.prop('name'),
                    value: {
                        name: messages.someWhereElse,
                        value: '7',
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') return path2;
                            return '';
                        }
                    },
                    // eslint-disable-next-line no-unused-vars
                    setAttribute: (name, value) => { /* mock */ },
                    getAttribute: (attr) => {
                        if (attr === 'path') return path2;
                        return '';
                    }
                }
            });
        });

        wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });

    test('Location Drive', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(1)
            .props();

        const toggleButton = wrapper.find(ToggleButton);

        await act(async () => onChangeAction(toggleButton.at(3), path, usualParkingLocationFieldName, '4'));
        wrapper.update();

        expect(store.getActions()).toContainEqual({
            payload: { canForward: true },
            type: 'SET_NAVIGATION'
        });
    });

    test('should show error when postcode is too short', async () => {
        const { path } = wrapper.find('HDToggleButtonGroup').at(0)
            .props();
        const toggleButtons = wrapper.find(ToggleButton);
        // Simulate click on "NO' button
        await act(async () => {
            onChangeAction(toggleButtons.at(1), path, isCarHomeOvernightFieldName, 'false');
        });

        wrapper.update();

        // Set Postcode
        const inputBox = wrapper.find('[data-testid="text-input"]').at(0);
        const path2 = inputBox.props().path;
        await act(async () => {
            onChangeAction(inputBox, path2, overNightPostalCodeFieldName, 'BA13');
        });

        wrapper.update();

        expect(wrapper.find('HDInfoCardRefactor#car-location-parking-night-info'))
            .toHaveLength(1);

        expect(wrapper.find('#car-location-postcode-input').at(0).props().value)
            .toBe('BA13');


        const errorMessage = wrapper.find('div.invalid-feedback');

        expect(errorMessage).toHaveLength(4);
        expect(errorMessage.at(1).text()).toBe("Sorry, we don't recognise that postcode. Please try again");

        expect(wrapper)
            .toMatchSnapshot();
    });
});
