// react
import React, {
    useEffect, useMemo, useRef, useState
} from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// Other
import * as BlinkIDSDK from '@microblink/blinkid-in-browser-sdk';
import _ from 'lodash';
// Hastings
// eslint-disable-next-line import/no-unresolved
import { deployment, microblink } from 'app-config';
import { AnalyticsHDModal as HDModal } from '../../../web-analytics';
import ScanDocument, { ErrorCodes } from './HDMicroblinkIntegration';
import HDMicroblinkDataExtractor from './HDMicroblinkDataExtractor';
import {
    setNavigation as setNavigationAction,
    setWizardPagesState as setWizardPagesStateAction,
    setAddressDisplay as setAddressDisplayAction
} from '../../../redux-thunk/actions';
import HDCameraDisabled from './HDCameraDisabled';

// Resources
import greenTick from '../../../assets/images/icons/green-tick-icon.svg';
import cross from '../../../assets/images/wizard-images/hastings-icons/icons/Cross.svg';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import * as messages from './HDDriverScanPage.messages';

const HDDriverScanPage = (props) => {
    const {
        handleForward,
        handleBackward,
        setNavigation,
        setWizardPageState,
        submissionVM,
        setAddressDisplay,
        pageMetadata
    } = props;

    // UI elements for scanning feedback
    const cameraFeed = useRef(null);
    const screenScanning = useRef(null);
    const [driverIndex, isAnotherDriver, driverFixedId] = useAnotherDriver(useLocation());
    const [errorCode, setErrorCode] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [cameraStatusClasses, setCameraStatusClasses] = useState('is-loading');

    let scanFeedbackLock = false;
    const updateScanFeedback = (classnames, force) => {
        if (scanFeedbackLock && !force) {
            return;
        }
        scanFeedbackLock = true;

        setCameraStatusClasses(classnames);
        // eslint-disable-next-line no-return-assign
        setTimeout(() => scanFeedbackLock = false, 1000);
    };

    const setAddressDisplayAsACardForMainDriver = (asACard) => {
        if (!isAnotherDriver) {
            setAddressDisplay(asACard);
        }
    };

    const goForwardOnErrorCode = [ErrorCodes.BrowserNotSupported, ErrorCodes.MissingLicenseKey, ErrorCodes.SdkLoadFailed, ErrorCodes.MediaDevicesNotSupported,
        ErrorCodes.VideoElementNotProvided, ErrorCodes.CameraNotFound, ErrorCodes.GenericError];
    const goBackwardOnErrorCode = [ErrorCodes.CameraInUse, ErrorCodes.CameraNotAvailable];
    const drivers = _.get(submissionVM, 'lobData.privateCar.coverables.drivers.value');
    const editDriverIndex = drivers && drivers.length && !!driverFixedId
        && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;

    const driversPageState = useSelector((state) => state.wizardState.app.pages.drivers);
    const newDriversPageState = _.cloneDeep(driversPageState);

    const onResultChange = (state, force = false) => {
        switch (state.status) {
            case BlinkIDSDK.RecognizerResultState.Valid:
                // If empty, it means that we need to go with Uncertain scenario
                if (!_.isEmpty(state.result) && !_.isEmpty(state.result.viz) && state.result.viz.empty) {
                    console.warn('Detection with empty result - document outside of UK.');
                } else {
                    updateScanFeedback('is-done', force);

                    HDMicroblinkDataExtractor(state.result, submissionVM, editDriverIndex, isAnotherDriver);
                    setAddressDisplayAsACardForMainDriver(true);
                    setTimeout(() => {
                        _.set(newDriversPageState, `${driverIndex}.licenceSuccessfulScanned`, true);
                        _.set(newDriversPageState, `${driverIndex}.licenceSuccessfulValidated`, false);
                        _.set(newDriversPageState, `${driverIndex}.licenceDataChanged`, false);

                        setWizardPageState({ drivers: newDriversPageState });

                        handleForward();
                    }, 2000);
                    break;
                }
            // eslint-disable-next-line no-fallthrough
            case BlinkIDSDK.RecognizerResultState.Uncertain:
                handleBackward({ routerPageContext: { errorMessage: messages.errorUncertainResponse } });
                setAddressDisplayAsACardForMainDriver(false);
                break;
            default:
                setAddressDisplayAsACardForMainDriver(false);
                console.warn(
                    'Unhandled result status!',
                    state.staus
                );
        }
    };

    const onDetectionChange = (state, force = false) => {
        switch (state.status) {
            case BlinkIDSDK.DetectionStatus.Fail:
                updateScanFeedback('is-default', force);
                break;
            case BlinkIDSDK.DetectionStatus.Success:
            case BlinkIDSDK.DetectionStatus.FallbackSuccess:
                updateScanFeedback('is-classification', force);
                break;
            case BlinkIDSDK.DetectionStatus.CameraAtAngle:
                updateScanFeedback('is-error-adjust-angle', force);
                break;
            case BlinkIDSDK.DetectionStatus.CameraTooHigh:
                updateScanFeedback('is-error-move-closer', force);
                break;
            case BlinkIDSDK.DetectionStatus.CameraTooNear:
            case BlinkIDSDK.DetectionStatus.DocumentTooCloseToEdge:
            case BlinkIDSDK.DetectionStatus.Partial:
                updateScanFeedback('is-error-move-farther', force);
                break;
            default:
                console.warn(
                    'Unhandled detection status!',
                    state.staus
                );
        }
    };

    const onStart = () => {
        updateScanFeedback('is-default', true);
    };

    const errorHandler = (e) => {
        try {
            console.error(e);
        } catch (error) {
            console.error(error);
        }

        if (!navigator.onLine
            || e === 'Problem during initialization of worker file!'
            || (_.isObject(e) && e.wasmModuleName === 'BlinkIDWasmSDK')) {
            setErrorCode(ErrorCodes.InternetNotAvailable);
            return;
        }

        if (!e) {
            if (e === 'Problem during initialization of worker file!"') {
                setErrorCode(ErrorCodes.InternetNotAvailable);
            } else {
                setErrorCode(ErrorCodes.GenericError);
            }
            return;
        }

        if (_.isObject(e) && e.code !== undefined) {
            if (e.code === 19) {
                if (e.name === 'NetworkError') {
                    setErrorCode(ErrorCodes.InternetNotAvailable);
                } else {
                    setErrorCode(ErrorCodes.SdkLoadFailed);
                }
            } else if (e.code === 'UNLOCK_LICENSE_ERROR') {
                setErrorCode(ErrorCodes.MissingLicenseKey);
            } else {
                setErrorCode(ErrorCodes.GenericError);
            }
        } else if (e === 'Missing license key!') {
            setErrorCode(ErrorCodes.MissingLicenseKey);
        } else if (e.reason !== undefined) {
            setErrorCode(e.reason);
        } else if (_.startsWith(e.stack, 'RuntimeError')
            && (_.includes(e.stack, 'WebAssembly') || _.includes(e.stack, 'NetworkError'))) {
            setErrorCode(ErrorCodes.InternetNotAvailable);
        } else {
            setErrorCode(ErrorCodes.GenericError);
        }
    };

    useEffect(() => {
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: false,
            showWizardTooltip: false
        });


        let loadSettings;
        try {
            loadSettings = new BlinkIDSDK.WasmSDKLoadSettings(microblink.licence);
            loadSettings.allowHelloMessage = false;
            // eslint-disable-next-line no-return-assign
            loadSettings.engineLocation = `${deployment.url}/assets/`;
        } catch (error) {
            setErrorCode(ErrorCodes.MissingLicenseKey);
            return;
        }

        let microblinkSDK;
        let videoRecognizer;
        let recognizerRunner;
        let idRecognizer;
        let startRecognition;

        try {
            BlinkIDSDK.loadWasmModule(loadSettings)
                .then(
                    (sdk) => {
                        microblinkSDK = sdk;

                        ScanDocument(sdk, cameraFeed.current, onStart, onDetectionChange, onResultChange)
                            .then((result) => {
                                [videoRecognizer, recognizerRunner, idRecognizer, startRecognition] = result;
                                startRecognition();
                                setCameraStatusClasses('is-default');
                            })
                            .catch((e) => errorHandler(e));
                    },
                    (error) => {
                        throw error;
                    }
                )
                .catch((e) => {
                    errorHandler(e);
                });
        } catch (error) {
            errorHandler(error);
        }

        // eslint-disable-next-line consistent-return
        return () => {
            if (microblinkSDK && typeof microblinkSDK.delete === 'function') {
                microblinkSDK.delete();
            }

            if (videoRecognizer) {
                videoRecognizer.pauseRecognition();
                videoRecognizer.releaseVideoFeed();
                recognizerRunner.delete();
                idRecognizer.delete();
            }
        };
    }, []);

    // Check if browser has proper support for WebAssembly
    if (!BlinkIDSDK.isBrowserSupported()) {
        setErrorCode(ErrorCodes.BrowserNotSupported);
    }

    const goBack = () => {
        // Some cleanups if needed
        handleBackward({ routerPageContext: { errorMessage: null } });
    };

    useEffect(() => {
        if (goBackwardOnErrorCode.includes(errorCode)) {
            handleBackward({ routerPageContext: { errorMessage: messages.errorCameraInUse } });
        }

        if (ErrorCodes.InternetNotAvailable === errorCode) {
            handleBackward({ routerPageContext: { errorMessage: messages.errorInternetNotAvailable } });
        }

        if (goForwardOnErrorCode.includes(errorCode)) {
            setModalMessage(messages.errorGeneric);
        }
    }, [errorCode]);

    const renderContent = useMemo(() => {
        if (errorCode === ErrorCodes.CameraNotAllowed) {
            return <HDCameraDisabled handleForward={() => handleForward()} handleBackward={() => handleBackward()} />;
        }

        return (
            <div className="scan">
                <div className="overlay is-active" ref={screenScanning} id="showcase-camera-overlay">
                    <div className="overlay__header">
                        <div className="control" />
                        <div className="control">
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                            <div id="close-camera" className="control__icon control__icon__close is-visible" onClick={goBack}>
                                <img src={cross} alt="Close" />
                            </div>
                        </div>
                    </div>

                    <div className="overlay__center overlay__center__reticle">
                        <div id="scanning-status" className={`reticle ${cameraStatusClasses}`}>
                            <div className="reticle__cursor" />
                            <div className="reticle__done">
                                <img
                                    alt="spinner"
                                    src={greenTick} />
                            </div>
                        </div>
                        <p className="label" data-message="is-loading">{messages.isLoading}</p>
                        <p className="label" data-message="is-default">{messages.isDefault}</p>
                        <p className="label" data-message="is-error-move-farther">{messages.isErrorMoveFarther}</p>
                        <p className="label" data-message="is-error-move-closer">{messages.isErrorMoveCloser}</p>
                        <p className="label" data-message="is-error-adjust-angle">{messages.isErrorAdjustAngle}</p>
                        <p className="label" data-message="is-fail">{messages.isFail}</p>
                        <p className="label" data-message="is-classification">{messages.isClassification}</p>
                    </div>

                    <div className="overlay__camera">
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video id="showcase-camera-feed" ref={cameraFeed} playsInline />
                    </div>
                </div>
            </div>
        );
    }, [errorCode, cameraStatusClasses]);

    return (
        <>
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: messages.errorModalTitle }}
                webAnalyticsEvent={{ event_action: messages.errorModalTitle }}
                id="something-went-wrong-modal"
                show={!!modalMessage}
                headerText={messages.errorModalTitle}
                confirmLabel={messages.errorModalConfirmLabel}
                hideClose
                hideCancelButton
                onConfirm={() => { setModalMessage(''); handleForward(); }}
            >
                <p>{modalMessage}</p>
            </HDModal>

            {renderContent}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setWizardPageState: setWizardPagesStateAction,
    setAddressDisplay: setAddressDisplayAction
};

HDDriverScanPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    handleForward: PropTypes.func.isRequired,
    handleBackward: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    setAddressDisplay: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDDriverScanPage);
