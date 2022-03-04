/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    HDInfoCardRefactor, HDLabelRefactor
} from 'hastings-components';
import { Col, Container, Row } from 'react-bootstrap';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo
} from '../../web-analytics';
import * as messages from './HDMultiCarMilestonePage.messages';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import {
    setMultiCarSubmissionVM,
    setNavigation as setNavigationAction,
    setSubmissionVM,
    updateMultiQuote,
    setErrorStatusCode,
    setVehicleDetails,
    incrementCurrentPageIndex as incrementCurrentPageIndexAction,
} from '../../redux-thunk/actions';
import {
    MC_MILESETONE_EDIT
} from '../../redux-thunk/action.types';
import exclamationIcon from '../../assets/images/icons/exclamation-icon.svg';
import useToast from '../Controls/Toast/useToast';
import { VRN_SEARCH_PAGE, MC_CUSTOMIZE_QUOTE_WIZARD, MC_DOB_INTERSTITIAL } from '../../routes/BaseRouter/RouteConst';
import DeleteDriverModal from '../wizard-pages/HDAddAnotherDriverPage/DeleteDriverModal';
import DeleteVehicleModal from './DeleteVehicleModal';
import MaxVehicleModal from './MaxVehicleModal';
import WizardRoutes from '../../routes/WizardRouter/RouteConst';
import { MAX_DRIVERS_PER_CAR, PAYMENT_TYPE_ANNUALLY_CODE } from '../../constant/const';
import { getLatestQuoteByInceptionDate } from '../../common/dateHelpers';
import {
    getDataForUpdateQuoteAPICallinMulti,
    getDataForUpdateMultiQuoteAPICall,
    getDataForMultiQuoteAPICallWithUpdatedFlag
} from '../../common/submissionMappers';
import * as monetateHelper from '../../common/monetateHelper';
import HDQuoteService from '../../api/HDQuoteService';
import { checkPCWJourney, getMultiToSingleParam } from '../../common/utils';
import mcsubmission from '../../routes/MCSubmissionVMInitial';
import { pageMetadataPropTypes } from '../../constant/propTypes';
import DataSyncModal from './DataSyncModal';
import getCarName from '../../common/getCarName';
import {
    multiToSingle, multiToSingleFailed
} from '../HDMCIntroPage/HDMCIntroPage.messages';
import { trackAPICallFail, trackAPICallSuccess } from '../../web-analytics/trackAPICall';
import { trackEvent } from '../../web-analytics/trackData';


const HDMultiCarMilestonePage = (props) => {
    const {
        mcsubmissionVM,
        setNavigation,
        handleForward,
        history,
        updatedMultiQuoteObject,
        updateMultiQuoteError,
        pageMetadata,
        previousPageName,
        isEditQuoteJourney,
        MCSingalQuoteIDForSync,
        incrementCurrentPageIndex,
        isPCWJourney
    } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [HDToast, addToast] = useToast();
    const multicarAddresChanged = useSelector((state) => state.wizardState.app.multicarAddresChanged);
    const submissionVM = useSelector((state) => state.wizardState.data.submissionVM);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const [showMutiCar, setShowMultiCar] = useState(false);
    const [deleteDriver, setDeleteDriver] = useState(null);
    const hideDeleteModal = () => setDeleteDriver(null);

    const [deleteVehicle, setDeleteVehicle] = useState(null);
    const hideDeleteVehicleModal = () => setDeleteVehicle(null);

    const [maxVehicle, setMaxVehicle] = useState(null);
    const hideMaxVehicleModal = () => setMaxVehicle(null);

    const [syncData, setSyncData] = useState(null);
    const hideSyncDataModal = () => setSyncData(null);

    const [toMovedriverAllocationPage] = useState(false);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);

    // explicity set the data for sync and edit
    const [syncDriversObject, setSyncDriversObject] = useState(null);
    const [syncDriverIndex, setSyncDriverIndex] = useState(null);
    const [syncDriverQuoteObject, setSyncDriverQuoteObject] = useState(null);
    const [stringForVehicleDriverEdit, setStringForVehicleDriverEdit] = useState(-1);
    const [syncVehicleQuoteObject, setSyncVehicleQuoteObject] = useState(null);

    // Vehicle Model
    const [syncDeleteVehicleQuoteObject, setSyncDeleteVehicleQuoteObject] = useState(null);
    const [syncDeleteVehicleQuoteIndex, setSyncDeleteVehicleQuoteIndex] = useState(null);
    // Driver Model
    const [syncDeleteDriverName, setSyncDeleteDriverName] = useState(null);
    const [syncDeleteDriverFixedID, setSyncDeleteDriverFixedID] = useState(null);
    const [syncDeleteDriverPublicID, setSyncDeleteDriverPublicID] = useState(null);
    const [syncDeleteDriverQuoteIndex, setSyncDeleteDriverQuoteIndex] = useState(null);
    const [syncDeleteDriverIsPolicyHolder, setSyncDeleteDriverIsPolicyHolder] = useState(false);
    const isAddAnotherCar = useSelector((state) => state.wizardState.app.isAddAnotherCar);
    const isEditQuoteJourneyDriver = useSelector((state) => state.wizardState.app.isEditQuoteJourneyDriver);
    const finishEditingEnabled = useSelector((state) => state.wizardState.app.finishEditingEnabled);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tick',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
        dispatch(setNavigation({
            canForward: true,
            showForward: false,
            updateQuoteFlag: false,
            triggerLWRAPICall: false,
            singleToMultiJourney: false
        }));
        dispatch({
            type: MC_MILESETONE_EDIT,
            payload: { trigger: false }
        });
    }, []);

    useEffect(() => {
        const removeDriver = _.get(location, 'state.removeDriver', false);
        const getSubmissionVM = _.get(submissionVM, 'value', []);
        const drivers = _.get(getSubmissionVM, 'lobData.privateCar.coverables.drivers', []);
        if (drivers.length && removeDriver) {
            _.pullAt(drivers, drivers.length - 1);
        }
    }, []);
    useEffect(() => {
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
    }, [multiCarElements]);
    const mcsubmissionVMBeforeEdit = useSelector((state) => state.wizardState.app.mcsubmissionVMBeforeEdit);
    const vehicleEdited = useSelector((state) => state.wizardState.app.vehicleEdited);
    // To avoid issues of submissionVM and mcSubmissionVM sync
    const updateMCVMAfterEdit = () => {
        if (vehicleEdited) {
            _.set(mcsubmissionVM, 'value', mcsubmissionVMBeforeEdit);
            setNavigation({
                vehicleEdited: false,
            });
        }
    };

    // Push the data from SubmissionVM to Multi Car submissionVM and call updateMultiQuote API
    useEffect(() => {
        const mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
        // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
        const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
        const fromPageVal = _.get(history, 'location.state.fromPage', false);
        const shouldNotUpdate = _.get(history, 'location.state.shouldNotUpdate', false);
        if (!isEditQuoteJourney) {
            if ((fromPageVal !== VRN_SEARCH_PAGE && fromPageVal !== WizardRoutes.MC_CAR_DETAILS && fromPageVal !== MC_CUSTOMIZE_QUOTE_WIZARD)
                && previousPageName !== WizardRoutes.MC_DRIVER_ALLOCATION_SECONDARY && previousPageName !== MC_DOB_INTERSTITIAL && !shouldNotUpdate) {
                if (mcQuote.length && getSCQuoteID === null) {
                    mcQuote.some((data) => {
                        if (data.quoteID !== getSCQuoteID) {
                            _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                            return mcQuote.push(getDataForUpdateQuoteAPICallinMulti(submissionVM.value));
                        }
                        return false;
                    });
                    if (getSCQuoteID === null) {
                        _.set(mcsubmissionVM, 'value.quotes', mcQuote);
                        dispatch(updateMultiQuote(mcsubmissionVM));
                        setAPITriggerPoint(true);
                        showLoader();
                    }
                }
                if (mcQuote.length && getSCQuoteID !== null) {
                    const multiCarQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
                    const updatedmultiCarQuotes = multiCarQuotes.map((quote) => {
                        // populate mandatory data when there is additional driver
                        if (quote.quoteID === getSCQuoteID) {
                            _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                            const updatedQuote = getDataForUpdateQuoteAPICallinMulti(submissionVM.value);
                            return updatedQuote;
                        }
                        quote.isQuoteToBeUpdated = false;
                        return quote;
                    });
                    _.set(mcsubmissionVM, 'value.quotes', updatedmultiCarQuotes);
                    dispatch(updateMultiQuote(mcsubmissionVM));
                    setAPITriggerPoint(true);
                    showLoader();
                }
            } else {
                const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
                _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
            }
        } else {
            updateMCVMAfterEdit();
        }
        setNavigation({ previousPageName: null });
    }, []);

    // get sc driver length
    const getSingleCarDriverLength = () => {
        const SubmissionDriverLength = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers', []);
        return SubmissionDriverLength.length;
    };

    const setChildInsurancePaymentType = () => {
        let parentPaymentType = PAYMENT_TYPE_ANNUALLY_CODE;
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) {
                parentPaymentType = _.get(mcsubmissionVM.value.quotes[i],
                    'lobData.privateCar.coverables.vehicles[0].insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
                break;
            }
        }
        mcsubmissionVM.value.quotes.map((quoteObj) => {
            if (!quoteObj.isParentPolicy) {
                _.set(quoteObj, 'lobData.privateCar.coverables.vehicles[0].insurancePaymentType', parentPaymentType);
            }
            return null;
        });
    };

    // handle continue
    const handleContinue = () => {
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        if (isAddAnotherCar) {
            showLoader();
            HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(result.quotes));

                    setChildInsurancePaymentType();
                    handleForward();
                    hideLoader();
                    incrementCurrentPageIndex();
                    history.push(WizardRoutes.TRANSITION);
                    trackAPICallSuccess('Multi Quote');
                }).catch((error) => {
                    hideLoader();
                    trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                    dispatch(setErrorStatusCode(error
                        && error.error && error.error.data && error.error.data.appErrorCode ? error.error.data.appErrorCode : error.status));
                });
        } else if (isEditQuoteJourney && finishEditingEnabled) {
            // eslint-disable-next-line no-use-before-define
            triggerUpdate().then(() => {
                history.push(WizardRoutes.TRANSITION);
            });
        } else {
            history.push(WizardRoutes.TRANSITION);
        }
    };

    // Add New Driver
    const addDriver = (drivers, quoteObject) => {
        dispatch(setNavigation({
            isEditQuoteJourney: false
        }));
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        _.set(submissionVM, 'value', _.cloneDeep(quoteObject));
        handleForward({
            driverIndex: getSingleCarDriverLength() - 1, removeDriver: false, isDriverEdit: false, isPolicyHolder: !getSingleCarDriverLength()
        });
    };

    // api trigger
    const triggerUpdate = () => {
        return new Promise(async (resolve, reject) => {
            const multiCarQuote = _.get(mcsubmissionVM, 'value.quotes', []);
            // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
            const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
            if (multiCarQuote.length && getSCQuoteID !== null) {
                const ChangedAddress = _.get(submissionVM, 'value.baseData.accountHolder.primaryAddress');
                const availableDrivers = _.get(submissionVM, 'value.lobData.privateCar.coverables.drivers');
                if (multicarAddresChanged && ChangedAddress) {
                    _.set(mcsubmissionVM, 'value.accountHolder.primaryAddress', ChangedAddress);
                }
                multiCarQuote.map((data, index) => {
                    if (multicarAddresChanged && ChangedAddress) {
                        data.baseData.accountHolder.primaryAddress = ChangedAddress;
                        data.baseData.policyAddress = ChangedAddress;
                    }
                    if (data.quoteID === getSCQuoteID) {
                        const emailAddress = _.get(submissionVM, 'value.baseData.accountHolder.emailAddress1');
                        availableDrivers.map((driver, driverIndex) => {
                            if (driver.isPolicyHolder) {
                                _.set(submissionVM, `lobData.privateCar.coverables.drivers.children.${driverIndex}.person.emailAddress1`, emailAddress);
                            }
                        });
                        _.set(submissionVM, 'value.lobData.privateCar.coverables.drivers', availableDrivers);
                        multiCarQuote[index] = getDataForUpdateQuoteAPICallinMulti(submissionVM.value);
                        multiCarQuote[index].isQuoteToBeUpdated = true;
                    } else {
                        data.isQuoteToBeUpdated = false;
                    }
                });
                _.set(mcsubmissionVM, 'value.quotes', multiCarQuote);
            }
            showLoader();
            await HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    dispatch(setNavigation({
                        MCMultiQuoteClonedObject: _.cloneDeep(result)
                    }));
                    trackAPICallSuccess('Update Draft MC Quote');
                    hideLoader();
                    resolve();
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail('Update Draft MC Quote', 'Update Draft MC Quote Failed');
                    hideLoader();
                    reject();
                });
        });
    };

    // call when data is edited or untouched
    const moveToDriverEdit = (driver, index, quoteObject) => {
        const initData = _.cloneDeep(quoteObject || syncDriverQuoteObject);
        dispatch(setNavigation({
            MCSingalQuoteEditObject: initData,
            MCSingalQuoteIDForSync: (quoteObject && quoteObject.quoteID) || syncDriverQuoteObject.quoteID
        }));
        const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
        const fromPageVal = _.get(history, 'location.state.fromPage', false);
        if (getSCQuoteID !== ((quoteObject && quoteObject.quoteID) || syncDriverQuoteObject.quoteID) && fromPageVal !== MC_CUSTOMIZE_QUOTE_WIZARD) {
            triggerUpdate().then(() => {
                const multiCarQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
                const mcQuoteEdited = multiCarQuotes.filter((quote) => (quote.quoteID === ((quoteObject && quoteObject.quoteID)
                    || syncDriverQuoteObject.quoteID)))[0];
                _.set(submissionVM, 'value', mcQuoteEdited);
                dispatch(setNavigation({ multiCarFlag: true }));
                let setDriverIndex;
                if (index !== null && index !== undefined) setDriverIndex = index;
                if (syncDriverIndex !== null && syncDriverIndex !== undefined) setDriverIndex = syncDriverIndex;
                handleForward({
                    driverIndex: setDriverIndex,
                    removeDriver: false,
                    isDriverEdit: true,
                    fixedId: (driver && driver.fixedId) || syncDriversObject.fixedId,
                    isPolicyHolder: driver ? driver.isPolicyHolder : syncDriversObject.isPolicyHolder
                });
            });
        } else {
            _.set(submissionVM, 'value', _.cloneDeep(quoteObject || syncDriverQuoteObject));
            dispatch(setNavigation({ multiCarFlag: true }));
            let setDriverIndex;
            if (index !== null && index !== undefined) setDriverIndex = index;
            if (syncDriverIndex !== null && syncDriverIndex !== undefined) setDriverIndex = syncDriverIndex;
            handleForward({
                driverIndex: setDriverIndex,
                removeDriver: false,
                isDriverEdit: true,
                fixedId: (driver && driver.fixedId) || (syncDriversObject && syncDriversObject.fixedId),
                isPolicyHolder: driver ? driver.isPolicyHolder : (syncDriversObject && syncDriversObject.isPolicyHolder)
            });
        }
    };

    // Edit Driver
    const editDriver = (driver, index, quoteObject) => {
        // User is in edit journey
        if (isEditQuoteJourney) {
            const mcsubmissionVMBeforeEditJourney = _.get(mcsubmissionVM, 'value');
            dispatch(setNavigation({
                isEditTriggered: true,
                mcsubmissionVMBeforeEdit: mcsubmissionVMBeforeEditJourney,
                vehicleEdited: true
            }));
            if (isEditQuoteJourneyDriver) {
                dispatch(setNavigation({
                    finishEditingEnabled: true
                }));
            }
            // Check if already some data is edited
            if (MCSingalQuoteIDForSync && isEditQuoteJourney && !_.isEqual(quoteObject.quoteID, MCSingalQuoteIDForSync)) {
                setSyncData(true);
                setSyncDriversObject(driver);
                setSyncDriverIndex(index);
                setSyncDriverQuoteObject(quoteObject);
                setStringForVehicleDriverEdit(2);
            } else {
                const filterSubmissionFromMCSubmissionVM = mcsubmissionVM.value.quotes.filter((item) => {
                    return quoteObject.quoteID === item.quoteID;
                });
                const initData = _.cloneDeep(filterSubmissionFromMCSubmissionVM);
                dispatch(setNavigation({
                    MCSingalQuoteEditObject: initData[0],
                    MCSingalQuoteIDForSync: quoteObject.quoteID
                }));
                moveToDriverEdit(driver, index, quoteObject);
            }
        } else {
            moveToDriverEdit(driver, index, quoteObject);
        }
    };

    const moveToVehicleEdit = (quoteObject) => {
        const initData = _.cloneDeep(quoteObject || syncVehicleQuoteObject);
        _.set(submissionVM, 'value', initData);
        dispatch(setNavigation({
            MCSingalQuoteEditObject: initData,
            MCSingalQuoteIDForSync: initData.quoteID
        }));
        dispatch({
            type: MC_MILESETONE_EDIT,
            payload: { trigger: true }
        });
        handleForward({
            isVehicleEdit: true, isDriverEdit: false
        });
    };

    // Edit Vehicle
    const handleEditVehicle = (quoteObject) => {
        const mcsubmissionVMBeforeEditJourney = _.get(mcsubmissionVM, 'value');
        dispatch(setNavigation({
            isEditTriggered: true,
            mcsubmissionVMBeforeEdit: mcsubmissionVMBeforeEditJourney,
            vehicleEdited: true
        }));
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        if (MCSingalQuoteIDForSync && isEditQuoteJourney && !_.isEqual(quoteObject.quoteID, MCSingalQuoteIDForSync)) {
            setSyncData(true);
            setSyncVehicleQuoteObject(quoteObject);
            setStringForVehicleDriverEdit(1);
        } else {
            setSyncVehicleQuoteObject(quoteObject);
            moveToVehicleEdit(quoteObject);
        }
    };

    // Sync confirmation
    const onSyncDataConfirm = () => {
        if (!syncData) return;
        hideSyncDataModal();
        let multiCarQuotesSync = _.get(mcsubmissionVM, 'value.quotes', []);
        // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
        const getSCQuoteID = _.get(submissionVM, 'value.quoteID', null);
        // to handle the back functionality if api is not triggered.
        multiCarQuotesSync = multiCarQuotesSync.filter((item) => item.quoteID !== undefined);

        if (multiCarQuotesSync.length && getSCQuoteID !== null) {
            multiCarQuotesSync.forEach((element, index) => {
                if (element.quoteID === getSCQuoteID) {
                    multiCarQuotesSync[index] = submissionVM.value;
                }
            });
            _.set(mcsubmissionVM, 'value.quotes', multiCarQuotesSync);
            showLoader();

            triggerUpdate().then(() => {
                const mcQuoteEdited = mcsubmissionVM.value.quotes.filter((quote) => (quote.quoteID === MCSingalQuoteIDForSync))[0];
                _.set(submissionVM, 'value', mcQuoteEdited);
                dispatch(setNavigation({
                    multiCarFlag: true,
                    MCSingalQuoteIDForSync: null,
                    isEditedDataSynced: true,
                    MCSingalQuoteEditObject: null,
                    submissionVM: null
                }));
                if (stringForVehicleDriverEdit === 1) moveToVehicleEdit();
                if (stringForVehicleDriverEdit === 2) moveToDriverEdit();
                if (stringForVehicleDriverEdit === 3) setDeleteVehicle({ vehicle: syncDeleteVehicleQuoteObject, quoteIndex: syncDeleteVehicleQuoteIndex });
                if (stringForVehicleDriverEdit === 4) {
                    setDeleteDriver({
                        name: syncDeleteDriverName,
                        fixedId: syncDeleteDriverFixedID,
                        publicID: syncDeleteDriverPublicID,
                        quoteIndex: syncDeleteDriverQuoteIndex,
                        isPolicyHolder: syncDeleteDriverIsPolicyHolder
                    });
                }
            });
        }
    };

    // api trigger
    const triggerUpdateDraft = () => {
        return new Promise(async (resolve, reject) => {
            showLoader();
            await HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    trackAPICallSuccess('Update Draft MC Quote');
                    hideLoader();
                    resolve();
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail('Update Draft MC Quote', 'Update Draft MC Quote Failed');
                    hideLoader();
                    reject();
                });
        });
    };

    // handle delete vehicle
    const handleDeleteVehicle = (vehicleObj, quoteIndex) => {
        setSyncDeleteVehicleQuoteObject(vehicleObj);
        setSyncDeleteVehicleQuoteIndex(quoteIndex);
        if (MCSingalQuoteIDForSync && isEditQuoteJourney && !_.isEqual(vehicleObj.quoteID, MCSingalQuoteIDForSync)) {
            setSyncData(true);
            setStringForVehicleDriverEdit(3);
        } else {
            setDeleteVehicle({ vehicle: vehicleObj, quoteIndex: quoteIndex });
        }
    };

    // Delete Vehicle
    const onDeleteVehicleConfirm = () => {
        if (!deleteVehicle) return;
        const vehicleList = _.get(mcsubmissionVM.value, `quotes[${deleteVehicle.quoteIndex}].lobData.privateCar.coverables.vehicles`);
        const quoteList = _.get(mcsubmissionVM.value, 'quotes');
        const index = vehicleList.findIndex((vehicleObj) => (deleteVehicle.vehicle.lobData.privateCar.coverables.vehicles[0].fixedId
            && vehicleObj.fixedId === deleteVehicle.vehicle.lobData.privateCar.coverables.vehicles[0].fixedId)
            || (deleteVehicle.vehicle.lobData.privateCar.coverables.vehicles[0].publicID
                && vehicleObj.publicID === deleteVehicle.vehicle.lobData.privateCar.coverables.vehicles[0].publicID));
        if (index > -1) _.pullAt(quoteList, deleteVehicle.quoteIndex);
        hideDeleteVehicleModal();
        if (quoteList.length > 1) {
            _.set(mcsubmissionVM.value, 'quotes', quoteList);
            // force vehicle reload
            dispatch(setNavigation({ canForward: true }));
            showLoader();
            triggerUpdateDraft().then(() => {
                const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
                _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
                dispatch(setNavigation({
                    isEditedDataSynced: true
                }));
            });
        } else {
            _.set(mcsubmissionVM.value, 'quotes', quoteList);
            _.set(submissionVM, 'value', quoteList[0]);
            _.set(submissionVM, 'value.sessionUUID', mcsubmissionVM.value.sessionUUID);
            trackEvent({
                number_of_vehicles: 1
            });
            showLoader();
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', mcsubmission);
                    _.set(submissionVM, 'value', result);
                    dispatch(setNavigation({
                        quoteID: (result && result.quoteID) || '',
                        sessionUUID: (result && result.sessionUUID) || '',
                        isEditQuoteJourney: false,
                        softSellJourney: false
                    }));
                    dispatch(setVehicleDetails({}));
                    hideLoader();
                    handleForward({ convertToSingle: true });
                    trackAPICallSuccess(multiToSingle);
                }).catch((error) => {
                    hideLoader();
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                });
        }
    };

    // handle delete driver
    const handleDeleteDriver = (name, fixedId, publicID, quoteIndex, quoteObject, isPolicyHolder) => {
        setSyncDeleteDriverName(name);
        setSyncDeleteDriverFixedID(fixedId);
        setSyncDeleteDriverPublicID(publicID);
        setSyncDeleteDriverQuoteIndex(quoteIndex);
        setSyncDeleteDriverIsPolicyHolder(isPolicyHolder);
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        if (MCSingalQuoteIDForSync && isEditQuoteJourney && !_.isEqual(quoteObject.quoteID, MCSingalQuoteIDForSync)) {
            setSyncData(true);
            setStringForVehicleDriverEdit(4);
        } else {
            setDeleteDriver({
                name, fixedId, publicID, quoteIndex, isPolicyHolder
            });
        }
    };

    // Delete Driver
    const onDeleteConfirm = () => {
        let isPHDeleted = false;
        if (!deleteDriver) return;
        if (!deleteDriver.isPolicyHolder) {
            const driversList = _.get(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.drivers`, []);
            const index = driversList.findIndex((driverObj) => (deleteDriver.fixedId && driverObj.fixedId === deleteDriver.fixedId)
                || (deleteDriver.publicID && driverObj.publicID === deleteDriver.publicID));
            _.pullAt(driversList, index);
            const vehicleDriversList = _.get(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.vehicleDrivers`, []);
            const vehicleDriversIndex = vehicleDriversList.findIndex((indexObj) => (deleteDriver.fixedId && indexObj.driverID === deleteDriver.fixedId));
            _.pullAt(vehicleDriversList, vehicleDriversIndex);
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.drivers`, driversList);
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.vehicleDrivers`, vehicleDriversList);
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].isQuoteToBeUpdated`, true);
        } else {
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.drivers`, []);
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].lobData.privateCar.coverables.vehicleDrivers`, []);
            _.set(mcsubmissionVM.value, `quotes[${deleteDriver.quoteIndex}].isQuoteToBeUpdated`, true);
            isPHDeleted = true;
        }
        hideDeleteModal();
        // force drivers reaload
        dispatch(setNavigation({ canForward: true }));
        showLoader();
        triggerUpdateDraft().then(() => {
            const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
            _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
            dispatch(setNavigation({
                isEditedDataSynced: true
            }));
            if (isPHDeleted) history.push(WizardRoutes.MC_POLICY_HOLDER_ALLOCATION);
        });
    };

    // Formatted Vehicle data
    const getVehicleDetails = (details, type) => {
        if (type === 'regno' && details) {
            return details.license || '';
        } if (type === 'year' && details) {
            return details.yearManufactured || '';
        } if (type === 'make' && details) {
            return details.make || '';
        } if (type === 'model' && details) {
            return details.model || '';
        }
        return '';
    };

    // update the mcsubmissionVM after updateDraftMultiProduct
    useEffect(() => {
        const shouldCallUpdate = _.get(location, 'state.shouldNotUpdate', false);
        if (aPITriggerPoint && updatedMultiQuoteObject && updatedMultiQuoteObject.accountNumber && !isEditQuoteJourney && !shouldCallUpdate) {
            _.set(mcsubmissionVM, 'value', updatedMultiQuoteObject);
            dispatch(setMultiCarSubmissionVM({
                mcsubmissionVM: mcsubmissionVM
            }));
            // check quote based on updated date and update the same object in submissionVM
            const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
            _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
            dispatch(setSubmissionVM({
                submissionVM: submissionVM
            }));
            hideLoader();
            if (toMovedriverAllocationPage) {
                history.push(WizardRoutes.MC_DRIVER_ALLOCATION);
            }
            setAPITriggerPoint(false);
        }
        if (updateMultiQuoteError && _.get(updateMultiQuoteError, 'status')) {
            hideLoader();
            setAPITriggerPoint(false);
        }
    }, [updatedMultiQuoteObject, updateMultiQuoteError]);

    // Add Vehicle
    const addCarHandler = () => {
        dispatch(setNavigation({ softSellJourney: false, hideGoBack: false }));
        const vehicleArrayLength = _.get(mcsubmissionVM, 'value.quotes', []);
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        if (vehicleArrayLength.length === monetateHelper.getMaxVehicles(multiCarElements)) {
            setMaxVehicle(true);
        } else if (isEditQuoteJourney) {
            dispatch(setNavigation({
                isEditQuoteJourney: false
            }));
            triggerUpdateDraft().then(() => {
                setMaxVehicle(null);
                history.push({
                    pathname: VRN_SEARCH_PAGE,
                    state: { resetSubmission: true }
                });
            });
        } else {
            setMaxVehicle(null);
            history.push({
                pathname: VRN_SEARCH_PAGE,
                state: { resetSubmission: true }
            });
        }
    };

    // show max vehicle Modal
    const onMaxVehicleConfirm = () => {
        if (!maxVehicle) return;
        hideMaxVehicleModal();
    };

    // driver card
    const mapListElements = (vehicle, quoteIndex, driver, driverIndex, driversArray, getMatchedQuoteID) => {
        const {
            isPolicyHolder, person, fixedId, firstName, lastName, publicID
        } = driver;
        const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
        const accountHolderIdentifier = _.get(person, 'accountHolder', false);
        let additionalTextPolicyAccountHolder;
        if (accountHolderIdentifier && isPolicyHolder && vehicle.isParentPolicy) additionalTextPolicyAccountHolder = messages.accountHolder;
        else if ((accountHolderIdentifier && isPolicyHolder && !vehicle.isParentPolicy)
            || (!accountHolderIdentifier && isPolicyHolder)) additionalTextPolicyAccountHolder = messages.policyholder;
        else if ((!accountHolderIdentifier && !isPolicyHolder)
            || (accountHolderIdentifier && !isPolicyHolder)) additionalTextPolicyAccountHolder = messages.anotherDriver;
        return (
            // nothing else to use
            <React.Fragment key={driverIndex}>
                <div className="horizontal-line--bright" />
                <HDCompletedCardInfo
                    webAnalyticsEvent={{ event_action: `${messages.heading} - Drivers` }}
                    id="mc-milestone-driver-card"
                    text={`${name}`}
                    variant="driver"
                    onEdit={() => editDriver(driver, driverIndex, vehicle, getMatchedQuoteID)}
                    additionalText={additionalTextPolicyAccountHolder}
                    onDelete={(isPolicyHolder && vehicle.isParentPolicy)
                        ? null : () => handleDeleteDriver(
                            name, fixedId, publicID, quoteIndex, vehicle, isPolicyHolder
                        )} />
                {driversArray.length === MAX_DRIVERS_PER_CAR && <div className="horizontal-line--bright" />}
            </React.Fragment>
        );
    };

    const renderLists = (vehicle, quoteIndex, getMatchedQuoteID) => {
        return vehicle.lobData.privateCar.coverables.drivers.sort((driverA, driverB) => {
            if (driverA.isPolicyHolder) return -1;
            if (driverB.isPolicyHolder) return 1;
            return 0;
        }).map((driver, driverIndex, driversArray) => mapListElements(
            vehicle, quoteIndex, driver, driverIndex, driversArray, getMatchedQuoteID
        ));
    };

    const scSubmissionVMVehicle = _.get(submissionVM, 'value.lobData.privateCar.coverables.vehicles[0]', null);

    const numberOfVehicles = (submission) => {
        const mcQuote = _.get(submission, 'value.quotes', []);
        let vehicleCount = 0;
        mcQuote.forEach((quote) => {
            const vehicles = _.get(quote, 'lobData.privateCar.coverables.vehicles', []);
            vehicleCount += vehicles.length;
        });
        return vehicleCount;
    };

    trackEvent({
        number_of_vehicles: numberOfVehicles(mcsubmissionVM)
    });

    return (
        <>
            <Container fluid className="mc-milestone-container">
                <Row>
                    <Col>
                        <HDLabelRefactor
                            Tag="h1"
                            text={messages.heading}
                            id="car-details-sorted-label" />
                        {
                            mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes
                            && mcsubmissionVM.value.quotes.map((vehicle, quoteIndex) => {
                                // to show the updated data in edit journey
                                const clonedSubmissionVM = _.get(submissionVM, 'value', null);
                                const submissionVMQuoteID = _.get(submissionVM, 'value.quoteID', null);
                                const mcsubmissionVMQuoteID = _.get(vehicle, 'quoteID', null);
                                const getMatchedQuoteID = (submissionVMQuoteID === mcsubmissionVMQuoteID
                                    && MCSingalQuoteIDForSync === submissionVMQuoteID
                                    && mcsubmissionVMQuoteID === MCSingalQuoteIDForSync);
                                const multicarVehiclePath = _.get(vehicle, 'lobData.privateCar.coverables.vehicles[0]', null);
                                const singlecarVehiclePath = _.get(clonedSubmissionVM, 'lobData.privateCar.coverables.vehicles[0]', null);
                                return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={quoteIndex} className="mc-milestone__quote-details-container">
                                        <div className="container--milestone-cards ml-0">
                                            <div className="horizontal-line--bright" />
                                            <HDCompletedCardInfo
                                                webAnalyticsEvent={{ event_action: `${messages.heading} - Car` }}
                                                id="mc-milestone-car-card"
                                                text={getVehicleDetails(getMatchedQuoteID ? singlecarVehiclePath : multicarVehiclePath, 'regno')}
                                                variant="car"
                                                additionalText={`${getVehicleDetails(getMatchedQuoteID ? singlecarVehiclePath : multicarVehiclePath, 'year')}
                                                ${getVehicleDetails(getMatchedQuoteID ? singlecarVehiclePath : multicarVehiclePath, 'make')}`}
                                                onEdit={() => handleEditVehicle(getMatchedQuoteID ? clonedSubmissionVM : vehicle, getMatchedQuoteID)}
                                                onDelete={(vehicle.isParentPolicy) ? null : () => handleDeleteVehicle(vehicle, quoteIndex)} />
                                            <div className="drivers-section">
                                                {renderLists(getMatchedQuoteID ? clonedSubmissionVM : vehicle, quoteIndex, getMatchedQuoteID)}
                                            </div>
                                            <div className="horizontal-line--bright mb-5" />
                                            {_.get(vehicle, 'lobData.privateCar.coverables.drivers').length < MAX_DRIVERS_PER_CAR && (
                                                <HDButtonDashed
                                                    webAnalyticsEvent={{ event_action: messages.addAnotherDriverEventLabel }}
                                                    id="mc-milestone-add-another-driver-btn"
                                                    onClick={() => addDriver(vehicle.lobData.privateCar.coverables.drivers, vehicle)}
                                                    label={messages.addAnotherdriver}
                                                    icon />
                                            )}
                                        </div>
                                        {_.get(vehicle, 'lobData.privateCar.coverables.drivers').length === MAX_DRIVERS_PER_CAR && (
                                            <HDInfoCardRefactor
                                                image={exclamationIcon}
                                                paragraphs={[messages.infoTipText]}
                                                className="mc-milestone__quote-details__max-drivers-info"
                                                id="mc-milestone-max-drivers-for-car" />
                                        )}
                                    </div>
                                );
                            })
                        }
                    </Col>
                </Row>
                <hr className="horizontal-line--bright mc-milestone__hr" />
                <Row>
                    <Col>
                        <HDLabelRefactor
                            className="mt-0 margin-bottom-md"
                            Tag="h2"
                            text={messages.allDone} />
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.continueCoverDetailsEventLabel }}
                            id="mc-milestone-continue-btn"
                            variant="primary"
                            label={messages.continueCoverDetails}
                            onClick={handleContinue}
                            className="mb-4"
                            size="md" />
                        {!checkPCWJourney(mcsubmissionVM, isPCWJourney) && (
                            <div>
                                <HDLabelRefactor
                                    className="mc-milestone__more-cars-header"
                                    Tag="h2"
                                    text={messages.moreCar} />
                                {showMutiCar && (
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.addAnotherCarEventLabel }}
                                        id="mc-milestone-add-another-car-btn"
                                        variant="secondary"
                                        label={messages.addAnothercar}
                                        onClick={addCarHandler}
                                        size="md" />
                                )}
                            </div>
                        )}
                        <DeleteDriverModal
                            show={!!deleteDriver}
                            onCancel={hideDeleteModal}
                            onConfirm={onDeleteConfirm}
                            onClose={hideDeleteModal}
                            driverName={deleteDriver ? deleteDriver.name : null}
                            pageMetadata={pageMetadata} />
                        <DeleteVehicleModal
                            show={!!deleteVehicle}
                            onCancel={hideDeleteVehicleModal}
                            onConfirm={onDeleteVehicleConfirm}
                            hideClose
                            onClose={hideDeleteVehicleModal}
                            pageMetadata={pageMetadata} />
                        <MaxVehicleModal
                            show={!!maxVehicle}
                            onCancel={hideMaxVehicleModal}
                            onConfirm={onMaxVehicleConfirm}
                            onClose={hideMaxVehicleModal}
                            pageMetadata={pageMetadata} />
                        <DataSyncModal
                            show={!!syncData}
                            onCancel={hideSyncDataModal}
                            onConfirm={onSyncDataConfirm}
                            onClose={hideSyncDataModal}
                            hideClose
                            pageMetadata={pageMetadata}
                            vehicleDetails={getVehicleDetails(scSubmissionVMVehicle, 'regno')}
                            vehicleName={getCarName(getVehicleDetails(scSubmissionVMVehicle, 'make'), getVehicleDetails(scSubmissionVMVehicle, 'model'))} />
                    </Col>
                </Row>
            </Container>
            {HDToast}
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        MCQuoteRetrieved: state.retrievemulticarQuoteModel,
        updatedMultiQuoteObject: state.updateMultiQuoteModel.updatedMultiQuoteObj,
        updateMultiQuoteError: state.updateMultiQuoteModel.multiQuoteError,
        previousPageName: state.wizardState.app.previousPageName,
        isEditQuoteJourney: state.wizardState.app.isEditQuoteJourney,
        MCSingalQuoteIDForSync: state.wizardState.app.MCSingalQuoteIDForSync,
        isPCWJourney: state.wizardState.app.isPCWJourney,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    incrementCurrentPageIndex: incrementCurrentPageIndexAction,
    updateMultiQuote
};

HDMultiCarMilestonePage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape([])
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    MCQuoteRetrieved: PropTypes.shape(
        {
            retrievemulticarQuoteObj: PropTypes.shape(
                {
                    quoteObj: PropTypes.shape(
                        {
                            quotes: PropTypes.array,
                            accountHolder: PropTypes.string,
                            accountNumber: PropTypes.string,
                            mpwrapperJobNumber: PropTypes.string,
                            mpwrapperNumber: PropTypes.string,
                            sessionUUID: PropTypes.string,
                        }
                    )
                }

            ),
            retrievemulticarQuoteError: PropTypes.shape({
                error: PropTypes.shape({
                    message: PropTypes.string,
                }),
            })
        }
    ).isRequired,
    updateMultiQuoteError: PropTypes.shape({}),
    updatedMultiQuoteObject: PropTypes.shape({
        accountHolder: PropTypes.shape({}),
        accountNumber: PropTypes.string,
        quotes: PropTypes.array,
        mpwrapperJobNumber: PropTypes.string,
        mpwrapperNumber: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    previousPageName: PropTypes.string,
    isEditQuoteJourney: PropTypes.bool,
    MCSingalQuoteIDForSync: PropTypes.shape({}),
    incrementCurrentPageIndex: PropTypes.func.isRequired,
    isPCWJourney: PropTypes.bool,
};
HDMultiCarMilestonePage.defaultProps = {
    updateMultiQuoteError: null,
    updatedMultiQuoteObject: null,
    previousPageName: '',
    isEditQuoteJourney: false,
    MCSingalQuoteIDForSync: null,
    isPCWJourney: false
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMultiCarMilestonePage);
