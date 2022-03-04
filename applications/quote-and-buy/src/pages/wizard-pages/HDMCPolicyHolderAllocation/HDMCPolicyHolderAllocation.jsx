import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
    HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import {
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo,
    AnalyticsHDButton as HDButton,
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDModal as HDModal,
    AnalyticsHDRadioButtonList as HDRadioButtonList
} from '../../../web-analytics';
import {
    setNavigation as setNavigationAction, setErrorStatusCode
} from '../../../redux-thunk/actions';
import * as messages from './HDMCPolicyHolderAllocation.messages';
import formatRegNumber from '../../../common/formatRegNumber';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import { getDataForMultiUpdateQuoteAPICall, getDataForUpdateMultiQuoteAPICall } from '../../../common/submissionMappers';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { getLatestQuoteByInceptionDate } from '../../../common/dateHelpers';
import HDQuoteService from '../../../api/HDQuoteService';
import { trackAPICallFail, trackAPICallSuccess } from '../../../web-analytics/trackAPICall';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import { parseDriverDisplayData, getFilteredDriverData } from './serviceHelper';
import initialData from '../../../routes/SubmissionVMInitial';

const HDMCPolicyHolderAllocation = (props) => {
    const {
        mcsubmissionVM, handleForward, setNavigation, pageMetadata
    } = props;
    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const submissionVM = useSelector((state) => state.wizardState.data.submissionVM);
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const {
        year, make, model, registrationsNumber
    } = vehicle;

    const [driverSelected, setDriverSelected] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [isDriverSelected, setIsDriverSelected] = useState(false);
    const policyHolderIDs = [];
    const dispatch = useDispatch();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const cloneViewModel = (viewModel) => _.cloneDeep(viewModel);
    const firstDriverPath = 'value.lobData.privateCar.coverables.drivers[0]';
    const MCQuotesPath = 'value.quotes';
    const quoteIDPath = 'value.quoteID';
    const driverListPath = 'value.lobData.privateCar.coverables.drivers';
    const vehicleDriversPath = 'value.lobData.privateCar.coverables.vehicleDrivers';
    const basePolicyAddressPath = 'value.baseData.policyAddress';
    const numberOfCarsOnHouseholdPath = 'value.baseData.numberOfCarsOnHousehold';

    // disable continue button
    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        setNavigation({ canForward: false, showForward: false });
    }, []);

    // set input if driver is added in single car submissionVM
    useEffect(() => {
        // set the selected driver if he is added as a policy holder
        const scDriver = _.get(submissionVM, firstDriverPath, null);
        if (scDriver) setDriverSelected(scDriver);

        const getSCSubmissionVMDrivers = _.get(submissionVM, driverListPath, null);
        const index = getSCSubmissionVMDrivers.findIndex((driver) => (_.isEmpty(driver.person.prefix)));
        _.pullAt(getSCSubmissionVMDrivers, index);
        _.set(submissionVM, driverListPath, getSCSubmissionVMDrivers);
    }, []);

    useEffect(() => {
        _.set(mcsubmissionVM, 'value', _.cloneDeep(mcsubmissionVM.value));

        if (isEditQuoteJourney) {
            // value of mcsubmissionVM before edit is clicked for this policy
            // To avoid issues of submissionVM and mcSubmissionVM sync
            const mcsubmissionVMBeforeEditJourney = _.get(mcsubmissionVM, 'value', {});
            dispatch(setNavigation({
                mcsubmissionVMBeforeEdit: mcsubmissionVMBeforeEditJourney,
            }));
        }
    }, [mcsubmissionVM, mcsubmissionVM.value]);

    // trigger the multicar update draft
    const triggerAPI = () => {
        HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
            .then(({ result }) => {
                // set the mcsubmissionVM
                _.set(mcsubmissionVM, 'value', result);
                // check quote based on updated date and update the same object in submissionVM
                const getMCSubmissionVM = _.get(mcsubmissionVM, MCQuotesPath);
                _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
                hideLoader();
                trackAPICallSuccess('Update MC Quote');
                // move to driver allocation secondary page
                handleForward({ addedExistingDriver: true });
            }).catch((error) => {
                // error handeling
                dispatch(setErrorStatusCode(error.status));
                trackAPICallFail('Update MC Quote', 'Update MC Quote Failed');
            });
    };

    // Continue button handler
    const apiDataHandler = () => {
        let mcQuote = _.get(mcsubmissionVM, MCQuotesPath, []);
        // push the submissionVM to McSubmissionVM >>> check if same quote id is available in mcSubmissionVM
        const getSCQuoteID = _.get(submissionVM, quoteIDPath, null);

        // to handle the back functionality if api is not triggered.
        mcQuote = mcQuote.filter((item) => item.quoteID !== undefined);

        if (mcQuote.length && getSCQuoteID === null) {
            // to add the policy holder and submission without quote id
            mcQuote.some((data) => {
                if (data.quoteID !== getSCQuoteID) {
                    _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                    return mcQuote.push(submissionVM.value);
                }
                return false;
            });
            if (getSCQuoteID === null) {
                _.set(mcsubmissionVM, MCQuotesPath, mcQuote);
                triggerAPI();
                showLoader();
            }
        }
        if (mcQuote.length && getSCQuoteID !== null) {
            // to replace the policy holder from mcsubmission and submission is having the quote id
            mcQuote.some((data) => {
                if (data.quoteID !== getSCQuoteID) {
                    _.set(submissionVM, 'value.isQuoteToBeUpdated', true);
                    return mcQuote.push(submissionVM.value);
                }
                return false;
            });
            _.set(mcsubmissionVM, MCQuotesPath, mcQuote);
            triggerAPI();
            showLoader();
        }
    };

    // input handle change
    const handleChange = (e, { value: driver }) => {
        e.persist();
        // set the driver object
        setDriverSelected(driver);
        // set to track if selected driver changed
        setIsDriverSelected(true);
    };

    const getMultiCarQuoteObject = () => {
        const getMCQuoteArray = _.get(mcsubmissionVM, MCQuotesPath, []);
        return getMCQuoteArray || [];
    };

    const getTheIndexOfSelectedSubmission = () => {
        const i = getMultiCarQuoteObject().findIndex((o) => {
            const driversList = _.get(o, 'lobData.privateCar.coverables.drivers', []);
            return driversList.some((e) => {
                return e.person.publicID === _.get(driverSelected, 'person.publicID');
            });
        });
        return i;
    };

    // fetching numberOfCarsOnHousehold of account holder
    const getNumberOfCarsOnHousehold = () => {
        let accountHolderNumberOfCarsOnHousehold;
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) {
                accountHolderNumberOfCarsOnHousehold = _.cloneDeep(mcsubmissionVM.value.quotes[i].baseData.numberOfCarsOnHousehold);
                break;
            }
        }
        return accountHolderNumberOfCarsOnHousehold || 0;
    };

    // fetching policy address of account holder
    const getAHPolicyAddress = () => {
        let accountHolderAddress;
        for (let i = 0; i < mcsubmissionVM.value.quotes.length; i += 1) {
            if (mcsubmissionVM.value.quotes[i].isParentPolicy) {
                accountHolderAddress = _.cloneDeep(mcsubmissionVM.value.quotes[i].baseData.policyAddress);
                break;
            }
        }
        return accountHolderAddress || {};
    };

    const setForPageNavigation = () => {
        const dataObject = cloneViewModel(submissionVM);
        // check if submission is having quote id
        const isSubmissionQuoteID = _.get(dataObject, quoteIDPath, null);
        // reset the data if PH is changed
        if (isSubmissionQuoteID) {
            // remove from mcsubmissionvm if driver is changed in submissionVM
            const elements = getMultiCarQuoteObject().filter((x) => {
                return x.quoteID !== isSubmissionQuoteID;
            });
            // add the filtered mcsubmissionVM
            _.set(mcsubmissionVM, MCQuotesPath, elements);
            // cleaned the tempid from submissionVM
            _.set(dataObject, vehicleDriversPath, []);
        }
        // set the sc driver object []
        _.set(dataObject, driverListPath, []);
        const gerSingleCarSubmissionDriverArray = _.get(dataObject, driverListPath, null);
        // remove the driver object before pushing the policy holder
        if (_.isEmpty(gerSingleCarSubmissionDriverArray)) {
            // set the information in order to call the update draft api
            // push the policyAddress and numberOfCarsOnHousehold to submissionvm
            _.set(dataObject, basePolicyAddressPath, getAHPolicyAddress());
            _.set(dataObject, numberOfCarsOnHouseholdPath, getNumberOfCarsOnHousehold());
            _.set(dataObject, firstDriverPath, driverSelected);
            const updatedSubmission = getDataForMultiUpdateQuoteAPICall(dataObject.value);
            _.set(submissionVM, 'value', updatedSubmission);
            // trigger the api call after update
            apiDataHandler();
        }
        // change flag to false aftre every select to track the drive data
        setIsDriverSelected(false);
    };

    // continue if PH is selected
    const handleContinue = () => {
        // check if policy holder is available in submissionVM
        const isPolicyHolderAdded = _.get(submissionVM, `${firstDriverPath}.isPolicyHolder`, false);
        if (!isPolicyHolderAdded) {
            setForPageNavigation();
        } else if (isDriverSelected) {
            setForPageNavigation();
        } else {
            handleForward({ addedExistingDriver: true });
        }
    };

    // to check the driver is policy holder
    const checkPolicyHolder = () => {
        mcsubmissionVM.value.quotes.map((quoteObject) => {
            quoteObject.lobData.privateCar.coverables.drivers.map((driverObject) => {
                if (driverObject.isPolicyHolder) { policyHolderIDs.push(driverObject.person.publicID); }
                return null;
            });
            return null;
        });
        if (policyHolderIDs.includes(driverSelected.person.publicID)) {
            handleContinue();
        } else {
            setModalOpen(true);
        }
    };

    // Modal cancel event
    const onCancel = () => {
        setModalOpen(false);
    };

    // modal confirm event
    const onConfirm = () => {
        const dataObject = cloneViewModel(submissionVM);
        const isSubmissionQuoteID = _.get(dataObject, quoteIDPath, null);
        // reset the data if PH is changed
        if (isSubmissionQuoteID) {
            const elements = getMultiCarQuoteObject().filter((x) => {
                return x.quoteID !== isSubmissionQuoteID;
            });
            _.set(mcsubmissionVM, MCQuotesPath, _.cloneDeep(elements));
            _.set(dataObject, vehicleDriversPath, []);
        }
        _.set(dataObject, driverListPath, []);
        // push the policyAddress and numberOfCarsOnHousehold to submissionVM
        _.set(dataObject, firstDriverPath, _.cloneDeep(driverSelected));
        // _.set(dataObject, `${firstDriverPath}.isPolicyHolder`, false);
        _.set(dataObject, basePolicyAddressPath, getAHPolicyAddress());
        _.set(dataObject, numberOfCarsOnHouseholdPath, getNumberOfCarsOnHousehold());
        _.unset(dataObject, `${firstDriverPath}.ownYourHome`);
        _.unset(dataObject, `${firstDriverPath}.anyChildrenUnder16`);
        const updatedSubmission = getDataForMultiUpdateQuoteAPICall(dataObject.value);
        _.set(submissionVM, 'value', updatedSubmission);
        // to handle the goback from Address verify page
        _.set(submissionVM, `${firstDriverPath}.isPolicyHolder`, false);
        // hide the modal and move to page for adding the required information
        setModalOpen(false);
        handleForward({ notAPolicyHolder: true });
    };

    // registation number formating for display
    const formattedRegNumber = useMemo(() => formatRegNumber(registrationsNumber), [registrationsNumber]);

    // remove all the driver while assigning the policy holder
    const removeExistingDriver = () => {
        return new Promise(async (resolve) => {
            _.set(submissionVM, driverListPath, []);
            _.set(submissionVM, vehicleDriversPath, []);
            resolve();
        });
    };

    // Add New Driver
    const addDriver = () => {
        removeExistingDriver().then(() => {
            const initData = _.cloneDeep(initialData.lobData.privateCar.coverables.drivers[0]);
            const initBaseData = _.cloneDeep(initialData.baseData);
            initData.tempID = uuidv4();
            _.set(submissionVM, 'value.baseData', initBaseData);
            _.set(submissionVM, `${firstDriverPath}`, initData);
            _.set(submissionVM, `${firstDriverPath}.isPolicyHolder`, true);
            _.set(submissionVM, `${firstDriverPath}.isPolicyOwner`, true);
            _.set(submissionVM, basePolicyAddressPath, getAHPolicyAddress());
            _.set(submissionVM, numberOfCarsOnHouseholdPath, getNumberOfCarsOnHousehold());
            setNavigation({ previousPageName: '' });
            handleForward({
                addNewDriver: true
            });
        });
    };

    // eslint-disable-next-line no-nested-ternary
    const driversDisplayData = getFilteredDriverData(mcsubmissionVM).sort((driverA, driverB) => (driverA.isPolicyHolder
        ? -1 : driverB.isPolicyHolder ? 1 : 0)).map(parseDriverDisplayData);

    return (
        <>
            <Container className="mc-ph-alloc-container">
                <Row>
                    <Col>
                        <HDLabelRefactor
                            Tag="h2"
                            text={messages.whowillbePolicyholder}
                            id="mc-ph-alloc-who-will-be-policyholder-label" />
                        <div className="horizontal-line--bright" />
                        <HDCompletedCardInfo
                            className="mc-ph-alloc__card-list"
                            webAnalyticsEvent={{ event_action: `${messages.whowillbePolicyholder} - Car` }}
                            text={formattedRegNumber}
                            variant="car"
                            additionalText={`${year} ${make} ${model}`} />
                        <div className="horizontal-line--bright" />
                        <HDInfoCardRefactor
                            image={exclamationIcon}
                            paragraphs={[(
                                <ul className="mb-0 pad-inl-start-sm">
                                    {messages.infoSecondParagraphList.map((text, i) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <li key={i}>{text}</li>
                                    ))}
                                </ul>
                            )]}
                            className="margin-top-lg margin-bottom-md margin-bottom-lg-lg"
                            id="mc-alloc-driver-info" />
                        <Row>
                            <Col xs={12} lg={10}>
                                <HDRadioButtonList
                                    webAnalyticsEvent={{ event_action: messages.whowillbePolicyholder, event_value: messages.selectedPolicyholderEventVal }}
                                    id="mc-ph-alloc-select-policyholder-list"
                                    items={driversDisplayData}
                                    onChange={handleChange}
                                    value={parseDriverDisplayData(driverSelected)} />
                                <HDButtonDashed
                                    webAnalyticsEvent={{ event_action: messages.addAnotherDriverEventLabel }}
                                    id="mc-ph-alloc-add-another-driver-button"
                                    onClick={addDriver}
                                    label={messages.addAnotherdriver}
                                    icon />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} className="margin-top-xl">
                                <HDButton
                                    webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                    id="mc-ph-alloc-continue-button"
                                    className="mc-ph-alloc__continue-button w-100"
                                    size="md"
                                    label="Continue"
                                    onClick={checkPolicyHolder}
                                    disabled={!isDriverSelected && !_.get(driverSelected, 'person.publicID')} />
                            </Col>
                        </Row>
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: messages.moreInfo }}
                            webAnalyticsEvent={{ event_action: messages.moreInfo }}
                            id="mc-ph-alloc-need-more-info-modal"
                            customStyle="rev-button-order footer-btns-w-100"
                            show={modalOpen}
                            headerText={messages.moreInfo}
                            cancelLabel={messages.goBack}
                            confirmLabel={messages.yes}
                            onCancel={onCancel}
                            onConfirm={onConfirm}
                            onClose={onCancel}
                            hideClose
                        >
                            <p className="margin-bottom-tiny">
                                {messages.ModalP1}
                            </p>
                            <p className="mb-0">
                                {messages.ModalP2}
                            </p>
                        </HDModal>
                    </Col>
                </Row>
            </Container>
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
};

HDMCPolicyHolderAllocation.propTypes = {
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
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCPolicyHolderAllocation);
