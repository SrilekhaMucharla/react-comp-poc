import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HDButtonRefactor } from 'hastings-components';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsVehicleInfoLookupService } from '../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import { HDCarFinder } from '../HDCarFinder';
import createPortalRoot from '../../__helpers__/test/createPortalRoot';

jest.mock('react-dom', () => ({
    createPortal: (node) => node,
}));

jest.mock('../../../../../../../node_modules/react-redux/lib/utils/batch.js', () => ({
    setBatch: jest.fn(),
    getBatch: () => (fn) => fn()
}));

jest.mock('../../../../../../../common/capabilities/hastings-capability-vehicleinfolookup');

describe('<HDCarFinder />', () => {
    createPortalRoot();
    let wrapper;
    let wrapperWithRedux;
    beforeEach(async () => {
        const viewModelService = ViewModelServiceFactory.getViewModelService(
            productMetadata, defaultTranslator
        );
        const handleFind = jest.fn();
        const displayRerateModal = jest.fn();
        const handleSetVehicleDetails = jest.fn();
        const handleFndVehicleCallback = jest.fn();
        const setPreviousVehicleDetails = jest.fn();
        const push = jest.fn();

        wrapper = mount((
            <ViewModelServiceContext.Provider value={viewModelService}>
                <HDCarFinder
                    onFind={handleFind}
                    displayRerateModal={displayRerateModal}
                    history={{ push: push }}
                    setVehicleDetails={handleSetVehicleDetails}
                    findVehicleCallback={handleFndVehicleCallback}
                    setPreviousVehicleDetails={setPreviousVehicleDetails} />
            </ViewModelServiceContext.Provider>
        ));

        const initialState = {
            epticaId: 854
        };

        const middlewares = [];
        const mockStore = configureStore(middlewares);

        const store = mockStore(initialState);

        wrapperWithRedux = mount((
            <Provider store={store}>
                <ViewModelServiceContext.Provider value={viewModelService}>
                    <HDCarFinder
                        onFind={handleFind}
                        displayRerateModal={displayRerateModal}
                        history={{ push: push }}
                        setVehicleDetails={handleSetVehicleDetails}
                        findVehicleCallback={handleFndVehicleCallback}
                        setPreviousVehicleDetails={setPreviousVehicleDetails} />
                </ViewModelServiceContext.Provider>
            </Provider>
        ));
    });

    test('render with mandatory props', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click resolved, type: CommercialVan_Ext', async () => {
        const vehicleInfo = {
            result: {
                type: 'CommercialVan_Ext',
                abiCode: 'test'
            }
        };
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        await act(async () => wrapper.update());

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click resolved, type: MotorCycle_Ext', async () => {
        const vehicleInfo = {
            result: {
                type: 'MotorCycle_Ext',
                abiCode: 'test'
            }
        };
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        await act(async () => wrapper.update());

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click resolved, type: other', async () => {
        const vehicleInfo = {
            result: {
                type: 'other',
                abiCode: 'test'
            }
        };
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        await act(async () => wrapper.update());

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click resolved, type: invalid', async () => {
        const vehicleInfo = {
            result: {
                type: '',
                abiCode: ''
            }
        };
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(vehicleInfo);
        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        await act(async () => wrapper.update());

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click rejected', async () => {
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockRejectedValue();

        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        await act(async () => wrapper.update());

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        await act(async () => wrapper.update());

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        await act(async () => wrapper.update());

        expect(wrapper).toMatchSnapshot();
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockReset();
    });

    test('No reg number to text input and click', async () => {
        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        wrapper.update();

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });

    test('not know link', async () => {
        await act(async () => wrapperWithRedux.find('.customize-quote-car-finder__not-know-link').at(0).props().onClick());
        wrapperWithRedux.update();

        await act(async () => wrapperWithRedux.find('HDModal').props().onConfirm());
        wrapperWithRedux.update();

        expect(wrapperWithRedux).toMatchSnapshot();
    });
});

describe('<HDCarFinder /> no viewModelService', () => {
    let wrapper;
    beforeEach(async () => {
        const handleFind = jest.fn();
        const displayRerateModal = jest.fn();
        const push = jest.fn();
        const handleSetVehicleDetails = jest.fn();
        const handleFndVehicleCallback = jest.fn();
        const setPreviousVehicleDetails = jest.fn();

        wrapper = mount((
            <HDCarFinder
                onFind={handleFind}
                history={{ push: push }}
                displayRerateModal={displayRerateModal}
                setVehicleDetails={handleSetVehicleDetails}
                findVehicleCallback={handleFndVehicleCallback}
                setPreviousVehicleDetails={setPreviousVehicleDetails} />
        ));
    });
    test('render with mandatory props', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('Enter reg number to text input and click', async () => {
        const invalidInfo = { result: { type: 'invalid', abiCode: '' } };
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockResolvedValueOnce(invalidInfo);
        const textInput = wrapper.find('[id="reg-number"]').at(0);

        await act(async () => textInput.props().onChange({
            target: {
                value: 'AV12BGE'
            }
        }));
        wrapper.update();

        await act(async () => wrapper.find(HDButtonRefactor).props().onClick());
        wrapper.update();

        await act(async () => wrapper.find('HDModal').props().onConfirm());
        wrapper.update();

        expect(wrapper).toMatchSnapshot();

        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN.mockReset();
    });
});
