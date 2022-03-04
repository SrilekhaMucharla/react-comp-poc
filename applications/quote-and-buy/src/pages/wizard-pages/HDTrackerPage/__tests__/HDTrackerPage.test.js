import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import {
    HDToggleButtonGroupRefactor, HDModal, HDForm, HDOverlayPopup
} from 'hastings-components';
import HDTrackerPage from '../HDTrackerPage';
import * as messages from '../HDTracker.messages';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import submission from '../../../../routes/SubmissionVMInitial';
import withTranslator from '../../__helpers__/test/withTranslator';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

const middlewares = [];
const mockStore = configureStore(middlewares);
let store;

async function checkRadioButton(wrapper, buttonName, value) {
    await act(async () => {
        wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === buttonName)
            .findWhere((n) => n.name() === 'ToggleButton' && n.prop('value') === value)
            .find('input')
            .simulate('change', { currentTarget: { checked: true } });
    });
    wrapper.update();
}
async function chooseYesForCarModQuestion(wrapper) {
    expect(wrapper.find(HDForm).find(HDModal).props()).toHaveProperty('show', false);

    await checkRadioButton(wrapper, 'isCarModified', 'true');

    expect(wrapper.find(HDForm).find(HDModal).props()).toHaveProperty('show', true);
}

describe('<HDTrackerPage />', () => {
    let wrapper;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const vehicleWorth = 'vehicleWorth';
    const carWorthPath = `${vehiclePath}.${vehicleWorth}`;

    createPortalRoot();
    jest.useFakeTimers();

    function initializeStore() {
        // Init VM
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );

        const submissionVM = viewModelService.create(
            submission,
            'pc',
            'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
        );

        // this is an workaround, submissionVM is too big to create SNAP
        const vehicle = _.get(submissionVM, vehiclePath);
        _.set(submission, vehiclePath, vehicle);

        // setting vehicle worth above messages.minValueForTracker, so that the tracker question section is displayed by default
        _.set(submission, `${carWorthPath}.value`, messages.minValueForTracker + 1);

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
    }

    describe('with wrapper unmounting (independent)', () => {
        beforeEach(() => {
            initializeStore();
        });

        afterEach(() => {
            // make sure wrapper is unmounted, so that global portalRoot div remains empty between tests
            // (because createPortal() from HDModal may be used during tests)
            if (wrapper) {
                wrapper.unmount();
                wrapper = undefined;
            }
        });

        test('render component', () => {
            // Initialize mockstore with empty state
            const initialState = {};
            const emptyStore = mockStore(initialState);

            wrapper = shallow(
                <Provider store={emptyStore}>
                    <HDTrackerPage />
                </Provider>
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('render component with mount', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();
            expect(wrapper).toMatchSnapshot();
        });

        test('tracker options present, when vehicle worth is more than messages.minValueForTracker', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            expect(wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === 'tracker').exists()).toBeTruthy();
        });

        test('car tracker question: tooltip opens (when tracker options are present)', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            expect(wrapper.find('.overlay').exists()).toBeFalsy();

            const hdOverlayPopupBtn = wrapper.findWhere((n) => n.type() === HDOverlayPopup && n.prop('labelText') === messages.trackerQuestion)
                .parents().first().find('.hd-overlay-btn');
            await act(async () => {
                hdOverlayPopupBtn.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find('.overlay').exists()).toBeTruthy();
        });

        test('car modified question: tooltip opens', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            expect(wrapper.find('.overlay').exists()).toBeFalsy();

            const hdOverlayPopupBtn = wrapper.findWhere((n) => n.type() === HDOverlayPopup && n.prop('labelText') === messages.trackerQuestion)
                .parents().first().find('.hd-overlay-btn');
            await act(async () => {
                hdOverlayPopupBtn.simulate('click');
            });
            wrapper.update();

            expect(wrapper.find('.overlay').exists()).toBeTruthy();
        });

        test('tracker options not present, when vehicle worth is less than messages.minValueForTracker', async () => {
            _.set(submission, `${carWorthPath}.value`, messages.minValueForTracker - 1);
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
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            expect(wrapper.findWhere((n) => n.type() === HDToggleButtonGroupRefactor && n.prop('name') === 'tracker').exists()).toBeFalsy();
        });

        test('validation passes and forward navigation is enabled, when tracker and modification are checked as not present', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            await checkRadioButton(wrapper, 'tracker', 'false');
            await checkRadioButton(wrapper, 'isCarModified', 'false');

            expect(_.last(wrapper.find('Provider').props().store.getActions())).toEqual({ type: 'SET_NAVIGATION', payload: { canForward: true } });
        });

        test('add modification modal overlay picker: trying to confirm without picking, results in validation error message visible', async () => {
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();

            await chooseYesForCarModQuestion(wrapper);

            // expect validation error message hidden
            expect(wrapper.find('.modification-modal .error').prop('hidden')).toEqual(true);

            // confirm without picking any car modification
            await act(async () => {
                wrapper.find(HDForm).find(HDModal).invoke('onConfirm')({ target: { value: 'Confitm' } });
            });
            wrapper.update();

            // expect validation error message visible
            expect(wrapper.find('.modification-modal .error').prop('hidden')).toEqual(false);

            // cancle without picking any car modification
            await act(async () => {
                wrapper.find(HDForm).find(HDModal).invoke('onCancel')({ target: { value: 'Cancel' } });
            });
            wrapper.update();
        });
    });

    describe('car modifications operations (ordered because DRY)', () => {
        beforeAll(async () => {
            initializeStore();
            await act(async () => {
                wrapper = mount(withTranslator(
                    <Provider store={store}>
                        <HDTrackerPage />
                    </Provider>
                ));
            });
            wrapper.update();
        });

        test('car modification question: choosing "Yes" opens modal window for adding modification', async () => {
            await chooseYesForCarModQuestion(wrapper);
        });

        // uses .each to repeat action instead of loop within test, to preserve information for message log in case of failure
        // eslint-disable-next-line max-len
    });

    test('HDModal', async () => {
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDTrackerPage />
                </Provider>
            ));
        });
        wrapper.update();
        const rerateModal = () => wrapper.findWhere((n) => n.type() === HDModal && n.prop('headerText') === 'Modification');
        expect(rerateModal().props()).toHaveProperty('show', false);
        rerateModal().invoke('onConfirm')();
        expect(rerateModal().props()).toHaveProperty('show', false);
    });

    it('Click on YES', async () => {
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDTrackerPage />
                </Provider>
            ));
        });
        wrapper.update();
        const { path } = wrapper.find('HDToggleButtonGroup').at(0).props();

        const button = wrapper.find('HDToggleButtonGroup').at(0);

        await act(async () => {
            button.props()
                .onChange({
                    target: {
                        name: 'isCarModified',
                        value: messages.yes,
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') return path;
                            return '';
                        },
                    }
                });
        });
        wrapper.update();
        const actions = store.getActions();
        expect(actions).toHaveLength(49);
        expect(actions[1].payload).toBeTruthy();
    });

    test('Click on NO', async () => {
        await act(async () => {
            wrapper = mount(withTranslator(
                <Provider store={store}>
                    <HDTrackerPage />
                </Provider>
            ));
        });
        wrapper.update();
        const { path } = wrapper.find('HDToggleButtonGroup').at(0).props();

        const button = wrapper.find('HDToggleButtonGroup').at(0);
        await act(async () => {
            button.props()
                .onChange({
                    target: {
                        name: 'isCarModified',
                        value: messages.no,
                        // eslint-disable-next-line no-unused-vars
                        setAttribute: (name, value) => { /* mock */ },
                        getAttribute: (attr) => {
                            if (attr === 'path') return path;
                            return '';
                        },
                    }
                });
        });
        wrapper.update();
        const actions = store.getActions();
        expect(actions).toHaveLength(62);
        expect(actions[1].payload).toBeTruthy();
    });
});
