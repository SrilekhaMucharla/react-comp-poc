import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import _ from 'lodash';

const ErrorCodes = {
    CameraNotAllowed: 'CameraNotAllowed',
    BrowserNotSupported: 'BrowserNotSupported',
    MissingLicenseKey: 'MissingLicenseKey',
    SdkLoadFailed: 'SdkLoadFailed',
    CameraInUse: 'CameraInUse',
    CameraNotAvailable: 'CameraNotAvailable',
    GenericError: 'GenericError',
    MediaDevicesNotSupported: 'MediaDevicesNotSupported',
    CameraNotFound: 'CameraNotFound',
    VideoElementNotProvided: 'VideoElementNotProvided',
    InternetNotAvailable: 'InternetNotAvailable'
};

const ScanDocument = async (sdk, cameraRef, onStart, onStateChange, onResultChange) => {
    const idRecognizer = await BlinkIDSDK.createBlinkIdRecognizer(
        sdk
    );

    const settings = await idRecognizer.currentSettings();

    // Update desired settings
    settings['recognitionModeFilter '] = { enableFullDocumentRecognition: true };

    // Apply settings
    await idRecognizer.updateSettings(settings);

    // Create a callbacks object that will receive recognition events, such as detected object location etc.
    const callbacks = {
        onQuadDetection: (quad) => onStateChange({
            status: quad.detectionStatus,
            data: quad.data
        }),
        onDetectionFailed: () => onStateChange({ status: BlinkIDSDK.DetectionStatus.Fail }, true),
    };

    const recognizerRunner = await BlinkIDSDK.createRecognizerRunner(
        sdk,
        [idRecognizer],
        true,
        callbacks
    );

    // Create a VideoRecognizer object and attach it to HTMLVideoElement that will be used for displaying the camera feed
    const videoRecognizer = await BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream(
        cameraRef,
        recognizerRunner
    );

    videoRecognizer.setVideoRecognitionMode(BlinkIDSDK.VideoRecognitionMode.Recognition);

    // 4. Start the recognition and get results from callback
    const startRecognition = () => {
        videoRecognizer.startRecognition(
            // 5. Obtain the results
            async (recognitionState) => {
                if (!videoRecognizer) {
                    return;
                }
                // Pause recognition before performing any async operation
                videoRecognizer.pauseRecognition();
                if (recognitionState === BlinkIDSDK.RecognizerResultState.Empty) {
                    videoRecognizer.resumeRecognition(recognizerRunner);
                    return;
                }

                const result = await idRecognizer.getResult();
                if (result.state === BlinkIDSDK.RecognizerResultState.Empty) {
                    videoRecognizer.resumeRecognition(recognizerRunner);
                    return;
                }

                // Inform the user about results
                onResultChange({
                    status: result.state,
                    result: result
                });
            }
        );
    };

    return [videoRecognizer, recognizerRunner, idRecognizer, startRecognition];
};

export default ScanDocument;
export { ErrorCodes };
