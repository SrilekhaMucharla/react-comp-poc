import React from 'react';
import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import _ from 'lodash';

// HD
import createPortalRoot from '../../__helpers__/test/createPortalRoot';
import HDDriverScanPage from '../HDDriverScanPage';
import mountWithSubmissionVM from '../../__helpers__/test/mountWithSubmissionVM';
import { mockResults } from './__mocks__/ScancerMockResults';
import { ErrorCodes } from '../HDMicroblinkIntegration';
import HDMicroblinkDataExtractor from '../HDMicroblinkDataExtractor';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({})
}));

describe('HDDriverScanPage', () => {
    createPortalRoot();

    const drivers = 'lobData.privateCar.coverables.drivers.children';
    const pathsToClone = [
        drivers
    ];

    let wrapper;
    let getResult = () => {};
    let startRecognition = () => {};
    let metadataCallbacks = jest.fn();
    let handleBackward = jest.fn();

    const defaultImplementations = {
        loadWasmModule: BlinkIDSDK.loadWasmModule,
        createVideoRecognizerFromCameraStream: BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream
    };

    const getWrapper = () => mountWithSubmissionVM(
        <HDDriverScanPage handleForward={jest.fn()} handleBackward={handleBackward} setNavigation={jest.fn()} />,
        pathsToClone,
        [],
        {},
        {
            app: {
                pages: {
                    drivers: {
                        0: { licenceSuccessfulScanned: false, licenceSuccessfulValidated: false },
                    }
                }
            },
        }
    );

    function initMocks() {
        BlinkIDSDK.loadWasmModule = jest.fn(
            () => Promise.resolve({})
        );

        BlinkIDSDK.createBlinkIdRecognizer = jest.fn(
            () => Promise.resolve({
                getResult: getResult,
                currentSettings: () => { return { recognitionModeFilter: '' }; },
                updateSettings: () => {}
            })
        );

        BlinkIDSDK.createRecognizerRunner = jest.fn(
            (wasmSDK, recognizers, allowMultipleResults, callbacks) => {
                metadataCallbacks = callbacks;
                return Promise.resolve({});
            }
        );

        BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream = jest.fn(
            () => Promise.resolve({
                startRecognition: startRecognition,
                pauseRecognition: () => {},
                setVideoRecognitionMode: () => {}
            })
        );
    }

    beforeEach(async () => {
        jest.useFakeTimers();

        getResult = () => {};
        startRecognition = () => {};
        handleBackward = jest.fn();
    });

    it('renders component, with video tag', async () => {
        initMocks();

        wrapper = await getWrapper();

        jest.runAllTimers();

        expect(wrapper.find('video'))
            .toHaveLength(1);

        expect(wrapper)
            .toMatchSnapshot();
    });

    it('should extract DL information and set submission data', async () => {
        getResult = () => {
            return mockResults;
        };

        startRecognition = (param) => {
            param(BlinkIDSDK.RecognizerResultState.Valid);
        };

        initMocks();

        wrapper = await getWrapper();
        jest.runAllTimers();
        wrapper.update();

        // Check some values
        const state = wrapper.find('Provider').props().store.getState();
        const stateSubmissionVM = _.get(state, 'wizardState.data.submissionVM');
        const firstName = _.startCase(_.camelCase(mockResults.firstName));

        expect(mockResults.address).toContain(stateSubmissionVM.baseData.policyAddress.addressLine1);
        expect(firstName).toBe(stateSubmissionVM.baseData.accountHolder.firstName);
        expect(mockResults.dateOfBirth.day).toBe(stateSubmissionVM.baseData.accountHolder.residingInUKSince.day);
        expect(mockResults.dateOfBirth.month).toBe(Number(stateSubmissionVM.baseData.accountHolder.residingInUKSince.month) + 1);
        expect(mockResults.dateOfBirth.year).toBe(stateSubmissionVM.baseData.accountHolder.residingInUKSince.year);
        expect(firstName).toBe(stateSubmissionVM.lobData.privateCar.coverables.drivers.children[0].person.firstName.value);
    });

    test('should match name with title', async () => {
        // Case 1
        const name = 'DAVE JUNIOR';
        const titleAndSpace = 'MR ';
        mockResults.firstName = titleAndSpace + name;
        const model = {};

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        expect(model.baseData.accountHolder.firstName).toBe('Dave');

        // Case 2
        const title = 'MR';
        mockResults.firstName = title + name;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        expect(model.baseData.accountHolder.firstName).toBe('Mrdave');

        // Case 3
        const titleMsAndSpace = 'MS ';
        const sarah = 'SARAH';
        mockResults.firstName = titleMsAndSpace + sarah;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        expect(model.baseData.accountHolder.firstName).toBe('Sarah');

        // Case 4
        const titleMissAndSpace = 'MISS ';
        mockResults.firstName = titleMissAndSpace + sarah;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        expect(model.baseData.accountHolder.firstName).toBe('Sarah');
    });

    it('should match address in different format', async () => {
        // Case 1
        const postalCode = 'EH1 9GP';
        const city = 'EDINBURGH';
        const burns = '122 BURNS CRESCENT';

        mockResults.address = `${burns}, ${city}, ${postalCode}`;
        const model = {};

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 1', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(burns);
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);
        model.baseData.policyAddress = {};

        // Case 2
        mockResults.address = `${burns} \n ${city} \n ${postalCode}`;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 2', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(burns);
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);
        model.baseData.policyAddress = {};

        // Case 3
        const flat = 'FLAT 4';
        mockResults.address = `${flat}, ${burns}, ${city}, ${postalCode}`;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 3', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(flat);
        expect(model.baseData.policyAddress.addressLine2).toBe(burns);
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);
        model.baseData.policyAddress = {};

        // Case 4
        const crossley = 'CROSSLEY COURT';
        const burns2 = '17-18 \n BURNS CRESCENT';
        mockResults.address = `${flat}, ${crossley}, ${burns2}, ${city}, ${postalCode}`;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 4', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(flat);
        expect(model.baseData.policyAddress.addressLine2).toBe('CROSSLEY COURT, 17-18 BURNS CRESCENT');
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);

        // Case 5
        mockResults.address = `${burns}, ${city},\n${postalCode}`;
        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 5', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(burns);
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);

        // Case 6
        mockResults.address = `${flat}, ${crossley}, ${burns2},\n${city}, ${postalCode}`;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 6', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(flat);
        expect(model.baseData.policyAddress.addressLine2).toBe('CROSSLEY COURT, 17-18 BURNS CRESCENT');
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);
    });

    it('should match address in different format (new)', async () => {
        const postalCode = 'EH1 9GP';
        const city = 'EDINBURGH';
        const burns = '122 BURNS CRESCENT';
        const flat = 'FLAT 4';
        const crossley = 'CROSSLEY COURT';
        const burns2 = '17-18 \n BURNS CRESCENT';

        const model = {};

        // Case 5
        mockResults.address = `${burns}, ${city},\n${postalCode}`;
        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 5', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(burns);
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);

        // Case 6
        mockResults.address = `${flat}, ${crossley}, ${burns2},\n${city}, ${postalCode}`;

        HDMicroblinkDataExtractor(mockResults, model, 0, false);

        console.log('case 6', model.baseData.policyAddress);

        expect(model.baseData.policyAddress.addressLine1).toBe(flat);
        expect(model.baseData.policyAddress.addressLine2).toBe('CROSSLEY COURT, 17-18 BURNS CRESCENT');
        expect(model.baseData.policyAddress.city).toBe(city);
        expect(model.baseData.policyAddress.postalCode).toBe(postalCode);
    });

    it('should display info in case of camera not allowed issue', async () => {
        startRecognition = () => {
            const error = new Error();
            error.reason = ErrorCodes.CameraNotAllowed;
            throw error;
        };

        initMocks();

        wrapper = await getWrapper();
        jest.runAllTimers();
        wrapper.update();

        expect(wrapper.find('HDCameraDisabled').exists()).toBeTruthy();
    });

    it('should display modal in case of license issue', async () => {
        BlinkIDSDK.loadWasmModule = defaultImplementations.loadWasmModule;
        BlinkIDSDK.WasmSDKLoadSettings = jest.fn();

        wrapper = await getWrapper();
        jest.runAllTimers();
        wrapper.update();

        expect(wrapper.find('HDModal').props().show).toBeTruthy();
    });

    it('should go back on uncertain result', async () => {
        getResult = () => {
            return {
                ...mockResults,
                state: 1
            };
        };

        startRecognition = (param) => {
            param(BlinkIDSDK.RecognizerResultState.Uncertain);
        };

        initMocks();

        wrapper = await getWrapper();
        jest.runAllTimers();
        wrapper.update();

        expect(handleBackward).toBeCalled();
    });

    it('should go back on camera in use code', async () => {
        startRecognition = () => {
            const error = new Error();
            error.reason = ErrorCodes.CameraInUse;
            throw error;
        };

        initMocks();

        wrapper = await getWrapper();
        jest.runAllTimers();
        wrapper.update();

        expect(handleBackward).toBeCalled();
    });

    it('should update status message on success', async () => {
        initMocks();

        wrapper = await getWrapper();
        await act(async () => { metadataCallbacks.onQuadDetection({ detectionStatus: BlinkIDSDK.DetectionStatus.Success, data: '' }); });
        await wrapper.update();

        expect(wrapper.find('#scanning-status').props().className)
            .toContain('is-classification');
    });

    it('should update status message on any status change', async () => {
        initMocks();

        wrapper = await getWrapper();
        await act(async () => { metadataCallbacks.onQuadDetection({ detectionStatus: BlinkIDSDK.DetectionStatus.Fail, data: '' }); });
        await wrapper.update();

        expect(wrapper.find('#scanning-status').props().className)
            .toContain('is-default');

        wrapper = await getWrapper();
        await act(async () => { metadataCallbacks.onQuadDetection({ detectionStatus: BlinkIDSDK.DetectionStatus.CameraAtAngle, data: '' }); });
        wrapper.update();

        expect(wrapper.find('#scanning-status').props().className)
            .toContain('is-error-adjust-angle');

        wrapper = await getWrapper();
        await act(async () => { metadataCallbacks.onQuadDetection({ detectionStatus: BlinkIDSDK.DetectionStatus.CameraTooHigh, data: '' }); });
        wrapper.update();

        expect(wrapper.find('#scanning-status').props().className)
            .toContain('is-error-move-closer');

        wrapper = await getWrapper();
        await act(async () => { metadataCallbacks.onQuadDetection({ detectionStatus: BlinkIDSDK.DetectionStatus.DocumentTooCloseToEdge, data: '' }); });
        wrapper.update();

        expect(wrapper.find('#scanning-status').props().className)
            .toContain('is-error-move-farther');
    });
});
