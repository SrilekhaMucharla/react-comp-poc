/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, {
    useState, useMemo, useEffect, useContext
} from 'react';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch, connect, useSelector } from 'react-redux';
import {
    HDLabelRefactor,
    HDForm, yup, HDInfoCardRefactor
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDCheckboxButtonList as HDCheckboxButtonList,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo,
    AnalyticsHDDropdownList as HDDropdownList,
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    setNavigation as setNavigationAction,
    setSubmissionVM as setSubmissionVMAction,
    updateMultiQuote,
    setMultiCarSubmissionVM,
    clearUpdateMultiQuoteData,
    setErrorStatusCode
} from '../../../redux-thunk/actions';
import * as messages from './HDMCDriverAllocationSecondary.messages';
import useToast from '../../Controls/Toast/useToast';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import formatRegNumber from '../../../common/formatRegNumber';
import DeleteDriverModal from '../HDAddAnotherDriverPage/DeleteDriverModal';
import MaxDriverModal from './MaxDriverModal';
import { MAX_DRIVERS_PER_CAR } from '../../../constant/const';
import { getDataForMultiUpdateQuoteAdditionalDriverAPICall, getDataForUpdateMultiQuoteAPICall } from '../../../common/submissionMappers';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { getLatestQuoteByInceptionDate } from '../../../common/dateHelpers';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import { VRN_SEARCH_PAGE } from '../../../routes/BaseRouter/RouteConst';
import initialData from '../../../routes/SubmissionVMInitial';
import MaxVehicleModal from '../../HDMultiCarMilestonePage/MaxVehicleModal';
import * as monetateHelper from '../../../common/monetateHelper';
import HDQuoteService from '../../../api/HDQuoteService';
import { checkPCWJourney } from '../../../common/utils';

const HDMCDriverAllocationSecondary = (props) => {
    const {
        mcsubmissionVM, handleForward, setNavigation, setSubmissionVM, pageMetadata,
        updatedMultiQuoteObject,
        updateMultiQuoteError,
        history,
        isEditQuoteJourney,
        isPCWJourney
    } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const translator = useContext(TranslatorContext);
    const relationCodes = ['S', 'O', 'B', 'M', 'A', 'C', 'U', 'J', 'E', 'W', 'F'];

    const [driverSelectedPublicID, setDriverSelectedPublicID] = useState('');
    const [selectedPersonPublicID, setSelectedPersonPublicID] = useState([]);
    const [selectedDriverItems, setSelectedDriverItems] = useState([]);
    const [policyHolderPersonPublicID, setPolicyHolderPersonPublicID] = useState();
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);

    const [deleteDriver, setDeleteDriver] = useState(null);
    const hideDeleteModal = () => setDeleteDriver(null);
    const [maxDriver, setMaxDriver] = useState(null);
    const hideMaxDriverModal = () => setMaxDriver(null);

    const [maxVehicle, setMaxVehicle] = useState(null);
    const hideMaxVehicleModal = () => setMaxVehicle(null);

    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const driversSC = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.drivers);
    const submissionVM = useSelector((state) => state.wizardState.data.submissionVM);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const [showMutiCar, setShowMultiCar] = useState(false);
    const [HDToast, addToast] = useToast();

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
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
    }, [multiCarElements]);
    const {
        year, make, model, registrationsNumber
    } = vehicle;
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const MCQuotesPath = 'value.quotes';
    const driversValuePath = 'value.lobData.privateCar.coverables.drivers';
    const scQuoteID = 'value.quoteID';
    const driversPath = 'lobData.privateCar.coverables.drivers';

    // create path and name for relationToProposer
    const relationToProposerFieldName = 'relationToProposer';
    const [dropdownSelect, setDropdownSelect] = useState(false);

    const [isValidFlag, setIsValidFlag] = useState(true);
    let relationshipFlag;
    let relationToProposerPath;

    // disable the continue button
    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canForward: false, showForward: false, previousPageName: history.location.pathname });
    }, []);

    // remove the additional driver from sc submission
    function removeItemAll(arr) {
        let i = 0;
        while (i < arr.length) {
            if (!arr[i].isPolicyHolder) { arr.splice(i, 1); } else { i += 1; }
        }
        return arr;
    }

    // create the data to preselects the drivers
    useEffect(() => {
        const driversPublicIDArray = [];
        const driverObjectSingleCar = _.get(submissionVM, driversValuePath, []);
        // removeItemAll(driverObjectSingleCar);
        // create temporary array from sc submission to preselect the drivers
        const selectedDriversFromSCSubmissionArray = [];
        driverObjectSingleCar.forEach((ele) => {
            if (!ele.isPolicyHolder) {
                driversPublicIDArray.push(ele.person.publicID);
                const driverItemObjectD = {
                    label: `${ele.firstName || ele.person.firstName} ${ele.lastName || ele.person.lastName}`,
                    id: ele.person.publicID,
                    value: ele,
                    content: () => generateHDForm(ele.person.publicID)
                };
                selectedDriversFromSCSubmissionArray.push(driverItemObjectD);
            } else {
                setPolicyHolderPersonPublicID(ele.person.publicID);
            }
        });
        setSelectedPersonPublicID(driversPublicIDArray);
        setSelectedDriverItems(selectedDriversFromSCSubmissionArray);
    }, []);

    // disable the continue button
    useEffect(() => {
        driversSC.value.forEach(() => {
            const driverObjectSingleCar = _.get(submissionVM, driversValuePath, []);
            relationshipFlag = true;
            driverObjectSingleCar.forEach((ele) => {
                if (!ele.isPolicyHolder) {
                    if (ele.relationToProposer === undefined) relationshipFlag = false;
                }
            });
            setIsValidFlag(relationshipFlag);
            setDropdownSelect(false);
        });
    }, [submissionVM, driversSC, driverSelectedPublicID, dropdownSelect, selectedPersonPublicID]);

    // on change for dropdown to track the validation
    const handleDropdownEvent = () => {
        setDropdownSelect(true);
    };

    // get single car policy holder public id
    const getSCPolicyHolderPublicID = () => {
        const scDriverPersonPublicID = _.get(submissionVM, driversValuePath, []);
        const scPHPersonPublicID = scDriverPersonPublicID.filter((ele) => {
            if (ele.isPolicyHolder) return true;
            return false;
        });
        return scPHPersonPublicID.length && scPHPersonPublicID[0].person.publicID;
    };

    // Filter : get driver list from multicarSubmissionVM except submissionVM policy holder
    const allQuoteDriverObject = [];
    function getFilteredDriverData() {
        const quoteList = _.get(mcsubmissionVM, 'value.quotes', []);
        quoteList.forEach((quoteObject) => {
            const driverList = _.get(quoteObject, driversPath, []);
            driverList.forEach((driverObject) => {
                allQuoteDriverObject.push(driverObject);
            });
        });
        getSCPolicyHolderPublicID();
        const scDriverPersonPublicID = getSCPolicyHolderPublicID();
        const PHFilteredDriver = allQuoteDriverObject.filter((ele) => {
            return ele.person.publicID !== scDriverPersonPublicID || '';
        });
        const distinctValues = _.uniqBy(PHFilteredDriver, (elem) => [elem.person.publicID].join());
        return distinctValues || [];
    }

    // Filter : removed driver from submissionVM on every uncheck
    function arrayRemove(arr, value) {
        return arr.filter((ele) => {
            return ele !== value;
        });
    }
    const cloneViewModel = (viewModel) => _.cloneDeep(viewModel);
    // Driver on change for checkbox
    const driverSelectionHandler = (e, driverDisplayItem) => {
        e.persist();
        const driver = driverDisplayItem.value;
        // set selected driver public ID
        setDriverSelectedPublicID(driver.person.publicID);
        const dataObject = cloneViewModel(submissionVM);
        const driverObjectSingleCar = _.get(dataObject, driversValuePath, []);

        // check if driver is already selected : remove from SubmissionVM and update selectedPersonPublicID array
        // check if driver is not selected : push to SubmissionVM and update selectedPersonPublicID array
        if (selectedPersonPublicID.indexOf(driver.person.publicID) === -1) {
            // update selectedPersonPublicID array
            setSelectedPersonPublicID([...selectedPersonPublicID, driver.person.publicID]);
            setSelectedDriverItems([...selectedDriverItems, driverDisplayItem]);
            // update submissionVM
            driverObjectSingleCar.some((driverObj) => {
                if (driverObj.person.publicID !== driver.person.publicID) {
                    return driverObjectSingleCar.push(driver);
                }
                return null;
            });
            _.set(dataObject, driversValuePath, driverObjectSingleCar);
            // set the necessary information in driver object before pushing to single car submissionVM
            const updatedSubmission = getDataForMultiUpdateQuoteAdditionalDriverAPICall(dataObject.value, policyHolderPersonPublicID, driver.person.publicID);
            _.set(submissionVM, 'value', updatedSubmission);
        } else if (selectedPersonPublicID.includes(driver.person.publicID)) {
            // update selectedPersonPublicID array
            const removedDataArray = arrayRemove(selectedPersonPublicID, driver.person.publicID);
            setSelectedPersonPublicID(removedDataArray);
            setSelectedDriverItems(selectedDriverItems.filter((elem) => elem.id !== driverDisplayItem.id));
            // update submissionVM
            driverObjectSingleCar.some((driverObj) => {
                if (driverObj.person.publicID !== driver.person.publicID) {
                    return driverObjectSingleCar.splice(driverObjectSingleCar.findIndex((v) => v.person.publicID === driver.person.publicID), 1);
                }
                return null;
            });
            _.set(submissionVM, driversValuePath, driverObjectSingleCar);
        }
        // refresh the submissionVM
        setSubmissionVM({ submissionVM: submissionVM });
    };

    // format the vehicle number
    const formattedRegNumber = useMemo(() => formatRegNumber(registrationsNumber), [registrationsNumber]);

    // Add New Driver
    const addDriver = () => {
        const driverObjectSingleCar = _.get(submissionVM, driversValuePath, []);
        if (driverObjectSingleCar.length >= MAX_DRIVERS_PER_CAR) {
            setMaxDriver(true);
        } else {
            setMaxDriver(null);
            const driver = _.get(submissionVM, driversValuePath, []);
            const initData = _.cloneDeep(initialData.lobData.privateCar.coverables.drivers[0]);
            initData.tempID = uuidv4();
            initData.isPolicyHolder = false;
            initData.isPolicyOwner = false;
            driver.push(initData);
            setNavigation({ previousPageName: '' });
            handleForward({
                driverIndex: driver.length - 1, removeDriver: false, isDriverEdit: false, isPolicyHolder: false, moveToMCMilestone: false, addNewDriver: true, selectPolicyHolder: false
            });
        }
    };

    // Continue button handler
    const continueHandler = () => {
        // check the max count of driver
        const driverObjectSingleCar = _.get(submissionVM, driversValuePath, []);
        if (driverObjectSingleCar.length > MAX_DRIVERS_PER_CAR) {
            setMaxDriver(true);
        } else {
            setMaxDriver(null);
            let mcQuote = _.get(mcsubmissionVM, 'value.quotes', []);
            // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
            const getSCQuoteID = _.get(submissionVM, scQuoteID, null);
            mcQuote = mcQuote.filter((item) => item.quoteID !== getSCQuoteID);
            if (mcQuote.length && getSCQuoteID === null) {
                mcQuote.some((data) => {
                    if (data.quoteID !== getSCQuoteID) {
                        _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                        return mcQuote.push(submissionVM.value);
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
                // to add quote from mcsubmissionVM and submission is having the quote id
                mcQuote.some((data) => {
                    if (data.quoteID !== getSCQuoteID) {
                        _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                        return mcQuote.push(submissionVM.value);
                    }
                    return false;
                });
                const distinctValues = _.uniqBy(mcQuote, (elem) => [elem.quoteID].join());
                _.set(mcsubmissionVM, 'value.quotes', distinctValues);
                dispatch(updateMultiQuote(mcsubmissionVM));
                setAPITriggerPoint(true);
                showLoader();
            }
        }
    };

    // update the mcsubmissionVM and submissionVM after updateDraftMultiProduct
    useEffect(() => {
        if (updatedMultiQuoteObject && updatedMultiQuoteObject.accountNumber && aPITriggerPoint) {
            _.set(mcsubmissionVM, 'value', updatedMultiQuoteObject);
            dispatch(setMultiCarSubmissionVM({
                mcsubmissionVM: mcsubmissionVM
            }));
            // check quote based on updated date and update the same object in submissionVM
            const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
            _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
            clearUpdateMultiQuoteData();
            hideLoader();
            // move to milestone page
            handleForward({
                moveToMCMilestone: true
            });
            setAPITriggerPoint(false);
        }
        if (updateMultiQuoteError && _.get(updateMultiQuoteError, 'status')) {
            hideLoader();
        }
    }, [updatedMultiQuoteObject, updateMultiQuoteError]);

    // api trigger
    const triggerUpdateDraft = () => {
        return new Promise(async (resolve, reject) => {
            showLoader();
            await HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    hideLoader();
                    resolve();
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    hideLoader();
                    reject();
                });
        });
    };

    const getMultiCarQuoteObject = () => {
        const getMCQuoteArray = _.get(mcsubmissionVM, MCQuotesPath, []);
        return getMCQuoteArray || [];
    };

    const setIsQuoteToBeUpdatedFlag = () => {
        const isSubmissionQuoteID = _.get(submissionVM, 'value.quoteID', null);
        if (isSubmissionQuoteID) {
            const elements = getMultiCarQuoteObject().filter((x) => {
                return x.quoteID !== isSubmissionQuoteID;
            });
            _.set(mcsubmissionVM, MCQuotesPath, _.cloneDeep(elements));
        }
        const mcQuote = _.get(mcsubmissionVM, MCQuotesPath, []);
        mcQuote.some((data) => {
            if (data.quoteID !== isSubmissionQuoteID) {
                _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                return mcQuote.push(submissionVM.value);
            }
            return false;
        });
        // added this commented code.. we may need this in future
        // const distintValues = _.uniqBy(mcQuote, (elem) => [elem.quoteID].join());
        // _.set(mcsubmissionVM, 'value.quotes', distintValues);
        _.set(mcsubmissionVM, MCQuotesPath, mcQuote);
    };

    const conditionalTriggerUpdateDraft = () => {
        if (selectedPersonPublicID.length) {
            setIsQuoteToBeUpdatedFlag();
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

    // Add another car handler
    const addAnotherCarHandler = () => {
        // if user selected any additional driver- otherwise ignore api trigger
        dispatch(setNavigation({ softSellJourney: false, hideGoBack: false }));
        const vehicleArrayLength = _.get(mcsubmissionVM, 'value.quotes', []);
        if (vehicleArrayLength.length === monetateHelper.getMaxVehicles(multiCarElements)) {
            setMaxVehicle(true);
        } else if (isEditQuoteJourney) {
            dispatch(setNavigation({
                isEditQuoteJourney: false
            }));
            conditionalTriggerUpdateDraft();
        } else {
            conditionalTriggerUpdateDraft();
        }
    };

    // To get the relationship metadata for dropdown
    const getAvailableValuesToRelation = useMemo(() => _.get(submissionVM, `lobData.privateCar.coverables.drivers.children.0.${relationToProposerFieldName}`)
        .aspects
        .availableValues
        .map((yearTC) => ({
            value: yearTC.code,
            label: translator({
                id: yearTC.name,
                defaultMessage: yearTC.name
            })
        })).filter((relation) => relationCodes.includes(relation.value)), []);

    // handle submissionVM handler
    const handleValidation = (isValid) => { };

    // filter and return driver except policy holder
    function returnSingleCarPolicyHolder() {
        const driverObjectSingleCar = _.get(submissionVM, driversValuePath, driversSC.value || []);
        return driverObjectSingleCar.filter((ele) => {
            return ele.isPolicyHolder !== false;
        });
    }

    // create the subissionVM Path for every driver which selected to add the relationship
    const getRequiredInfor = (driverSelectedPublicIDs, personPublicIDs) => {
        if (driverSelectedPublicIDs === personPublicIDs) {
            const driverObjectSingleCar = _.get(submissionVM, driversValuePath, driversSC.value || []);
            const elements = driverObjectSingleCar.filter((ele, index) => {
                if (ele.person.publicID === personPublicIDs) return index;
            });
            const indexes = driverObjectSingleCar.findIndex((element) => {
                if (element.person.publicID === personPublicIDs) {
                    return true;
                }
            });
            const driverPath = `lobData.privateCar.coverables.drivers.children[${indexes}]`;
            relationToProposerPath = `${driverPath}.${relationToProposerFieldName}`;
            return true;
        }
        return false;
    };

    // find the index of selected car and set the relationToProposerPath for selected driver
    const findIndexOfSingleCarDriver = (personPublicIDs) => {
        const driverObjectSingleCar = _.get(submissionVM, driversValuePath, driversSC.value || []);
        const indexes = driverObjectSingleCar.findIndex((element) => {
            if (element.person.publicID === personPublicIDs) {
                return true;
            }
        });
        relationToProposerPath = `lobData.privateCar.coverables.drivers.children[${indexes}].relationToProposer`;
        return indexes;
    };

    const getTheIndexOfSelectedSubmission = () => {
        const scQuotesID = _.get(submissionVM, scQuoteID, null);
        const i = getMultiCarQuoteObject().findIndex((o) => {
            return o.quoteID === scQuotesID;
        });
        return i;
    };

    // Delete Driver
    const onDeleteConfirm = () => {
        if (!deleteDriver) return;
        _.set(mcsubmissionVM.value, `quotes[${getTheIndexOfSelectedSubmission()}].lobData.privateCar.coverables.drivers`, []);
        _.set(mcsubmissionVM.value, `quotes[${getTheIndexOfSelectedSubmission()}].lobData.privateCar.coverables.vehicleDrivers`, []);
        _.set(submissionVM, driversValuePath, []);
        _.set(submissionVM, 'value.lobData.privateCar.coverables.vehicleDrivers', []);
        // force reload
        setNavigation({ canForward: false });
        hideDeleteModal();
        handleForward({
            selectPolicyHolder: true
        });
    };

    // show max driver Modal
    const onMaxDriverConfirm = () => {
        if (!maxDriver) return;
        hideMaxDriverModal();
    };

    // show max vehicle Modal
    const onMaxVehicleConfirm = () => {
        if (!maxVehicle) return;
        hideMaxVehicleModal();
    };

    // create dropdown for each driver
    const generateHDForm = (personPublicID) => {
        relationToProposerPath = `lobData.privateCar.coverables.drivers.children[${findIndexOfSingleCarDriver(personPublicID)}].relationToProposer`;

        // validation schema for HDForm : using custom validation
        const validationSchema = yup.object({
            [relationToProposerFieldName]: yup.object({ value: yup.string() })
                .required('This filed is required.')
                .nullable()
                .VMValidation(relationToProposerPath, 'Wrong value', submissionVM),
        });

        return (
            <>
                <HDForm
                    passedKey={`MCDriverAllocationSecondary${personPublicID}`}
                    submissionVM={submissionVM}
                    validationSchema={validationSchema}
                    onValidation={handleValidation}
                >
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.relationSelectLabel}
                                id="mc-driver-alloc-2nd-relationship-label" />
                        </Col>
                    </Row>
                    <Row className="margin-bottom-lg">
                        <Col sm={8} xs={12}>
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: messages.relationSelectLabel }}
                                id="mc-driver-alloc-2nd-dropdown-driver-relationship"
                                name={relationToProposerFieldName}
                                path={relationToProposerPath}
                                theme="blue"
                                options={getAvailableValuesToRelation}
                                placeholder={messages.driversSelectPlaceholder}
                                onChange={handleDropdownEvent} />
                        </Col>
                    </Row>
                </HDForm>
            </>
        );
    };

    const parseDriverDisplayData = (driver) => {
        if (!driver) return null;
        const {
            person = {}, firstName, lastName
        } = driver;
        const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
        return {
            label: name,
            id: person.publicID,
            value: driver,
            content: () => generateHDForm(person.publicID)
        };
    };

    const driversDisplayData = getFilteredDriverData().map(parseDriverDisplayData);

    return (
        <>
            <Container className="mc-driver-alloc-2nd-container">
                <Row>
                    <Col xs={12}>
                        <HDLabelRefactor
                            Tag="h1"
                            text={messages.heading}
                            id="mc-driver-alloc-2nd-headings-label" />
                    </Col>
                    <Col xs={12} lg={10} className="margin-bottom-xl">
                        <React.Fragment>
                            <div className="horizontal-line--bright" />
                            <HDCompletedCardInfo
                                webAnalyticsEvent={{ event_action: `${messages.heading} - Car` }}
                                id="mc-driver-alloc-2nd-car-card"
                                text={formattedRegNumber}
                                variant="car"
                                additionalText={`${year} ${make} ${model}`} />
                            <div className="horizontal-line--bright" />
                        </React.Fragment>
                        {
                            // eslint-disable-next-line no-nested-ternary
                            returnSingleCarPolicyHolder().sort((driverA, driverB) => (driverA.isPolicyHolder
                                ? -1 : driverB.isPolicyHolder ? 1 : 0)).map((driver, driverI) => {
                                const {
                                    isPolicyHolder, person, firstName, lastName
                                } = driver;
                                const accountHolderIdentifier = _.get(person, 'accountHolder', false);
                                const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
                                const fixedId = _.get(driver, 'fixedId', '');
                                const publicID = _.get(person, 'publicID', '');
                                const additionalTextPolicyAccountHolder = (accountHolderIdentifier && isPolicyHolder)
                                    ? messages.accountHolder : (!accountHolderIdentifier && !isPolicyHolder)
                                        ? messages.anotherDriver : messages.policyholder;
                                return (
                                // eslint-disable-next-line react/no-array-index-key
                                    <React.Fragment key={driverI}>
                                        <div className="horizontal-line--bright" />
                                        <HDCompletedCardInfo
                                            webAnalyticsEvent={{ event_action: `${messages.heading} - Drivers` }}
                                            id="mc-driver-alloc-2nd-driver-card"
                                            text={`${driver.displayName}`}
                                            variant="driver"
                                            additionalText={additionalTextPolicyAccountHolder}
                                            onDelete={() => setDeleteDriver({
                                                name, fixedId, publicID
                                            })} />
                                    </React.Fragment>
                                );
                            })}
                        <div className="horizontal-line--bright" />
                    </Col>
                    <Col xs={12}>
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.subheading}
                            id="mc-driver-alloc-2nd-more-drivers-label" />
                    </Col>
                    <Col xs={12}>
                        <HDCheckboxButtonList
                            webAnalyticsEvent={{ event_action: messages.subheading, eventValuePartial: messages.driverSelectedEventVal }}
                            id="mc-driver-alloc-2nd-select-drivers-list"
                            items={driversDisplayData}
                            selectedItems={selectedDriverItems}
                            onChange={driverSelectionHandler}
                            colProps={{ xs: 12, lg: 10, xl: 8 }} />
                    </Col>
                    <Col xs={12} lg={10} xl={8}>

                        <HDButtonDashed
                            webAnalyticsEvent={{ event_action: messages.addAnotherDriverEventLabel }}
                            id="mc-driver-alloc-2nd-add-another-driver-btn"
                            className="margin-top-sm"
                            onClick={addDriver}
                            label={messages.addAnotherdriver}
                            icon
                            disabled={!isValidFlag} />
                    </Col>
                    <Col xs={12} lg={12}>
                        {_.get(submissionVM, driversPath).length >= MAX_DRIVERS_PER_CAR && (
                            <HDInfoCardRefactor
                                image={exclamationIcon}
                                paragraphs={[messages.maxlimitReached]}
                                size="thin"
                                className="margin-top-lg"
                                id="mc-driver-alloc-2nd-max-drivers-for-car-info" />
                        )}
                        <hr className="my-md-5" />
                        <Row>
                            <Col xs={12} md={6}>
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                    id="mc-driver-alloc-2nd-continue-button"
                                    className="mc-driver-alloc-2nd-continue-btn btn-block"
                                    size="md"
                                    variant="primary"
                                    label={messages.continueText}
                                    onClick={continueHandler}
                                    disabled={!isValidFlag} />
                            </Col>
                            {!checkPCWJourney(mcsubmissionVM, isPCWJourney) && (
                                <Col xs={12} md={6}>
                                    {showMutiCar && (
                                        <HDButton
                                            webAnalyticsEvent={{ event_action: messages.addAnotherCarEventLabel }}
                                            className="margin-top-md mt-md-0 btn-block"
                                            id="mc-driver-alloc-2nd-add-another-car-btn"
                                            size="md"
                                            variant="secondary"
                                            label={messages.addAnothercar}
                                            onClick={addAnotherCarHandler}
                                            disabled={!isValidFlag} />
                                    )}
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <DeleteDriverModal
                        show={!!deleteDriver}
                        onCancel={hideDeleteModal}
                        onConfirm={onDeleteConfirm}
                        onClose={hideDeleteModal}
                        driverName={deleteDriver ? deleteDriver.name : null}
                        pageMetadata={pageMetadata} />
                    <MaxDriverModal
                        show={!!maxDriver}
                        customStyle="footer-btns-w-100"
                        onCancel={hideMaxDriverModal}
                        onConfirm={onMaxDriverConfirm}
                        onClose={hideMaxDriverModal}
                        hideClose
                        pageMetadata={pageMetadata} />
                    <MaxVehicleModal
                        show={!!maxVehicle}
                        onCancel={hideMaxVehicleModal}
                        onConfirm={onMaxVehicleConfirm}
                        onClose={hideMaxVehicleModal}
                        pageMetadata={pageMetadata} />
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
        updatedMultiQuoteObject: state.updateMultiQuoteModel.updatedMultiQuoteObj,
        updateMultiQuoteError: state.updateMultiQuoteModel.multiQuoteError,
        isEditQuoteJourney: state.wizardState.app.isEditQuoteJourney,
        isPCWJourney: state.wizardState.app.isPCWJourney,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setSubmissionVM: setSubmissionVMAction,
    updateMultiQuote,
    clearUpdateMultiQuoteData
};

HDMCDriverAllocationSecondary.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape([])
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func,
        location: PropTypes.object,
    }).isRequired,
    handleForward: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
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
    isEditQuoteJourney: PropTypes.bool,
    isPCWJourney: PropTypes.bool,
};

HDMCDriverAllocationSecondary.defaultProps = {
    updateMultiQuoteError: null,
    updatedMultiQuoteObject: null,
    isEditQuoteJourney: false,
    isPCWJourney: false
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCDriverAllocationSecondary);
