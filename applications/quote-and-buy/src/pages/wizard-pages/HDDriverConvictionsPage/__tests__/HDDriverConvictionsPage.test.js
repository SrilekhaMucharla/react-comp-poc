import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

// GW
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';

// HD
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import HDDriverConvictionsPage from '../HDDriverConvictionsPage';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import defaultTranslator from '../../__helpers__/testHelper';
import withTranslator from '../../__helpers__/test/withTranslator';
import { setNavigation } from '../../../../redux-thunk/actions';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

/**
 * A helper function to perform onChange event on a given component.
 * @param {*} component - component to preform onChange() on.
 * @param {*} path - path prop to component.
 * @param {*} actionName - name prop.
 * @param {*} actionValue - new value of component 'value' prop.
 * @param {*} prevVal - previous value prop.
 */
const onChangeAction = (component, path, actionName, actionValue, prevVal = 'no') => {
    component
        .invoke('onChange')({
            target: {
                name: actionName,
                value: actionValue,
                previousvalue: prevVal,
                // eslint-disable-next-line no-unused-vars
                setAttribute: (name, value) => { /* mock */ },
                getAttribute: (attr) => (attr === 'path' ? path : '')
            }
        });
};

describe('<HDDriverConvictionsPage />', () => {
    let store;
    let wrapper;

    jest.useFakeTimers();

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

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';

        const licenceTypeFieldname = 'licenceType.aspects.availableValues';
        const licenceTypePath = `${driverPath}.${licenceTypeFieldname}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, licenceTypePath);
        _.set(submission, licenceTypePath, aspects);

        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submission,
                    pageId: 'test-page'
                },
                app: {
                    step: 1,
                    prevStep: 0,
                    pages: {
                        drivers: {
                            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        }
                    }
                },
            }
        };
        store = mockStore(initialState);

        await act(async () => {
            wrapper = mount(withTranslator(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDDriverConvictionsPage pageId="test-page" />
                    </Provider>
                </ViewModelServiceContext.Provider>
            ));
        });
    });

    test('Render component', async () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click toggle buttons and set both to false', async () => {
        const button1 = wrapper.find('HDToggleButtonGroup').at(0);
        const button2 = wrapper.find('HDToggleButtonGroup').at(1);

        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'false'
        ));

        await act(async () => wrapper.update());

        await act(async () => onChangeAction(
            button2, button2.prop('path'), button2.prop('name'), 'false'
        ));

        await act(async () => wrapper.update());

        expect(wrapper)
            .toMatchSnapshot();
    });

    test('Click toggle button and render modal', async () => {
        const button1 = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'true'
        ));

        await act(async () => wrapper.update());

        const convictionForm = wrapper.find('#driver-conv-conviction-form');

        expect(convictionForm).toHaveLength(1);
    });

    test('Click toggle button, render modal and choose from dropdown list', async () => {
        const button1 = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'true'
        ));

        await act(async () => wrapper.update());

        const selects = wrapper.find('Select');

        expect(selects)
            .toHaveLength(3);

        // check first select props
        const convictionTypeSelect = selects.filter({ name: 'convictionCodeType' });
        await act(async () => {
            convictionTypeSelect
                .props()
                .onChange({
                    value: 'speedlimits',
                    label: 'SP-Speed limits'
                });
        });

        await act(async () => wrapper.update());

        const inputConvictionCodeType = wrapper.find('input').filter({ name: 'convictionCodeType' }).props().value;
        expect(inputConvictionCodeType)
            .toBe('speedlimits');
    });

    it('Click toggle button, render modal and fill values and confirm', async () => {
        const button1 = wrapper.find('HDToggleButtonGroup').at(0);
        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'true'
        ));
        await act(async () => wrapper.update());

        let input = wrapper.find('[name="convictionDateMonth"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), '1'
        ));
        await act(async () => wrapper.update());

        input = wrapper.find('[name="convictionDateYear"]').at(0);
        await act(async () => onChangeAction(
            input, input.prop('path'), input.prop('name'), '2018'
        ));
        await act(async () => wrapper.update());

        const selects = wrapper.find('Select');
        expect(selects)
            .toHaveLength(3);

        // check first select props
        const convictionTypeSelect = selects.filter({ name: 'convictionCodeType' });
        await act(async () => {
            convictionTypeSelect
                .props()
                .onChange({
                    value: 'speedlimits',
                    label: 'SP-Speed limits'
                });
        });
        await act(async () => wrapper.update());

        const convictionCodeSelect = selects.filter({ name: 'convictionCode' });
        await act(async () => {
            convictionCodeSelect
                .props()
                .onChange({
                    value: 'SP16',
                    label: 'Inciting - SP10'
                });
        });
        await act(async () => wrapper.update());

        const pointsSelect = selects.filter({ name: 'penaltyPoints' });
        await act(async () => {
            pointsSelect
                .props()
                .onChange({
                    value: '4',
                    label: '4'
                });
        });
        await act(async () => wrapper.update());

        const button = wrapper.find('[name="isThereBanForDriving"]').at(0);
        await act(async () => onChangeAction(
            button, button.prop('path'), button.prop('name'), 'false'
        ));
        await act(async () => onChangeAction(
            button, button.prop('path'), button.prop('name'), 'false'
        ));
        await act(async () => wrapper.update());

        const addButton = wrapper.find('HDButtonRefactor').at(0);
        await act(async () => addButton.props().onClick());
        await act(async () => wrapper.update());

        expect(wrapper.find('#driver-conv-conviction-card'))
            .toHaveLength(1);
    });

    test('Click toggle button, render modal and cancel', async () => {
        const button1 = wrapper.find('HDToggleButtonGroup').at(0);
        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'true'
        ));
        await act(async () => wrapper.update());

        const cancelButton = wrapper.find('HDButtonRefactor#cancel-add-conviction-button');
        await act(async () => cancelButton.props().onClick());
        jest.runAllTimers();
        await act(async () => wrapper.update());

        expect(wrapper.find('#driver-conv-conviction-form'))
            .toHaveLength(0);
        expect(wrapper.find('#driver-conv-conviction-card'))
            .toHaveLength(0);
    });
});

describe('<HDDriverConvictionsPage convictions given />', () => {
    let store;
    let wrapper;
    beforeEach(async () => {
        const convictions = {
            anyConvictions: { value: 'true' },
            convictionsCollection: [
                {
                    convictionCodeType: { value: 'speedlimits', label: 'SP-Speed limits' },
                    convictionCode: { value: 'SP16', label: 'Inciting - SP10' },
                    convictionDate: new Date('2016-12-31T23:00:00.000Z'),
                    convictionDateMonth: '1',
                    convictionDateYear: '2017',
                    penaltyPoints: '4',
                    isThereBanForDriving: 'false',
                    drivingBanMonths: '0'
                }
            ],
            unspentNonMotorConvictions: { value: 'false' }
        };

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

        const driverPath = 'lobData.privateCar.coverables.drivers.children[0]';
        const claimsAndConvictionsPath = `${driverPath}.claimsAndConvictions`;
        _.set(submissionVM, claimsAndConvictionsPath, convictions);

        const licenceTypeFieldname = 'licenceType.aspects.availableValues';
        const licenceTypePath = `${driverPath}.${licenceTypeFieldname}`;

        // this is an workaround, submissionVM is too big to create SNAP
        const aspects = _.get(submissionVM, licenceTypePath);
        _.set(submission, licenceTypePath, aspects);

        // Set default values
        const initialState = {
            wizardState: {
                data: {
                    submissionVM: submissionVM
                },
                app: {
                    step: 1,
                    prevStep: 0,
                    pages: {
                        drivers: {
                            0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                        }
                    }
                },
            }
        };
        store = mockStore(initialState);

        await act(async () => {
            wrapper = mount(withTranslator(
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <Provider store={store}>
                        <HDDriverConvictionsPage.WrappedComponent
                            pageId="test-page"
                            setNavigation={setNavigation}
                            submissionVM={submissionVM} />
                    </Provider>
                </ViewModelServiceContext.Provider>
            ));
        });
        wrapper.update();
    });

    test('Render component', async () => {
        expect(wrapper)
            .toHaveLength(1);
    });

    // test('edit convitcion entry', async () => {
    //     const toggleButtons = wrapper.find('HDToggleButtonGroup')
    //         .first();

    //     await act(async () => onChangeAction(
    //         toggleButtons, toggleButtons.prop('path'), 'anyConvictions', 'true'
    //     ));

    //     const updateButton = wrapper.find('#driver-conv-conviction-card button img[alt="delete-conviction"]').childAt(1);

    //     await act(async () => updateButton.props().onClick());

    //     const selects = wrapper.find('Select');
    //     const pointsSelect = selects.filter({ name: 'penaltyPoints' });
    //     await act(async () => {
    //         pointsSelect
    //             .props()
    //             .onChange({
    //                 value: '3',
    //                 label: '3'
    //             });
    //     });

    //     const submitButton = wrapper.find('HDButtonRefactor').at(0);

    //     await act(async () => submitButton.props().onClick());
    //     await act(async () => wrapper.update());

    //     expect(wrapper.find('#driver-conv-conviction-card'))
    //         .toHaveLength(0);
    // });

    test('add new conviction', async () => {
        const toggleButtons = wrapper.find('HDToggleButtonGroup')
            .first();

        await act(async () => onChangeAction(
            toggleButtons, toggleButtons.prop('path'), 'anyConvictions', 'true'
        ));

        const addButton = wrapper.find('HDButtonDashed#driver-conv-add-another-button');

        await act(async () => addButton.props().onClick());
    });

    test('delete conviction entry', async () => {
        expect(wrapper.find('#driver-conv-conviction-card'))
            .toHaveLength(1);

        const button1 = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => onChangeAction(
            button1, button1.prop('path'), button1.prop('name'), 'true'
        ));

        await act(async () => wrapper.update());

        const deleteButton = wrapper.find('#driver-conv-conviction-card button img[alt="delete-conviction"]').parents().first();

        await act(async () => deleteButton.props().onClick());
        await act(async () => wrapper.update());

        const modal = wrapper.find('HDModal').at(1);

        await act(async () => modal.props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper.find('#driver-conv-conviction-card'))
            .toHaveLength(0);
    });
});
