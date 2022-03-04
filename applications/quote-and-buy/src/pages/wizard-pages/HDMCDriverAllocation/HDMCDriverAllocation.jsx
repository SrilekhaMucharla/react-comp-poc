import React, {
    useEffect, useState, useMemo, useContext
} from 'react';
import PropTypes from 'prop-types';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
    HDLabelRefactor,
    HDInfoCardRefactor,
} from 'hastings-components';
import { Row, Col, Container } from 'react-bootstrap';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo
} from '../../../web-analytics';
import DeleteDriverModal from '../HDAddAnotherDriverPage/DeleteDriverModal';
import { setNavigation, singleToMultiProduct, setMultiCarSubmissionVM } from '../../../redux-thunk/actions';
import initialData from '../../../routes/SubmissionVMInitial';
import * as messages from './HDMCDriverAllocation.messages';
import useToast from '../../Controls/Toast/useToast';
import formatRegNumber from '../../../common/formatRegNumber';
import { VRN_SEARCH_PAGE } from '../../../routes/BaseRouter/RouteConst';
import routes from '../../../routes/WizardRouter/RouteConst';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import TipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import SwitchToSingleCarModal from './SwitchToSingleCarModal';
import { MAX_DRIVERS_PER_CAR } from '../../../constant/const';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import * as monetateHelper from '../../../common/monetateHelper';

const HDMCDriverAllocation = (props) => {
    const { handleForward, history, pageMetadata } = props;
    const dispatch = useDispatch();
    const location = useLocation();

    const drivers = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.drivers.value);
    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const submissionVM = useSelector((state) => state.wizardState.data.submissionVM);
    const MCsubmissionVM = useSelector((state) => state.wizardState.data.mcsubmissionVM);
    const singleToMultiProductModel = useSelector((state) => state.singleToMultiProductModel);
    const {
        year, make, model, registrationsNumber
    } = vehicle;
    const [deleteDriver, setDeleteDriver] = useState(null);
    const [aPITriggerPoint, setAPITriggerPoint] = useState(false);
    const [HDToast, addToast] = useToast();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const hideDeleteModal = () => setDeleteDriver(null);
    const viewModelService = useContext(ViewModelServiceContext);
    const [switchingToSingleCar, setSwitchingToSingleCar] = useState(null);
    const hideSwitchToSingleCarModal = () => setSwitchingToSingleCar(null);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const [showMutiCar, setShowMultiCar] = useState(false);

    useEffect(() => {
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
    }, [multiCarElements]);
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
    }, []);

    const editDriver = (driver, index) => {
        handleForward({
            driverIndex: index,
            removeDriver: false,
            isDriverEdit: true,
            fixedId: driver.fixedId,
            isPolicyHolder: driver.isPolicyHolder,
            fromPage: routes.MC_DRIVER_ALLOCATION
        });
    };

    const onDeleteConfirm = () => {
        if (!deleteDriver) return;
        const index = drivers.findIndex((driver) => (deleteDriver.fixedId && driver.fixedId === deleteDriver.fixedId)
            || (deleteDriver.publicID && driver.publicID === deleteDriver.publicID));
        _.pullAt(drivers, index);
        const vehicleDriversList = _.get(submissionVM.value, 'lobData.privateCar.coverables.vehicleDrivers', []);
        const vehicleDriversIndex = vehicleDriversList.findIndex((indexObj) => (deleteDriver.fixedId && indexObj.driverID === deleteDriver.fixedId));
        _.pullAt(vehicleDriversList, vehicleDriversIndex);

        hideDeleteModal();
        // force drivers reaload
        dispatch(setNavigation({ canForward: true }));
    };

    const onSwitchToSingleCarConfirm = () => {
        if (!switchingToSingleCar) return;
        dispatch(setNavigation({ multiCarFlag: false }));
        handleForward();
    };

    useEffect(() => {
        const removeDriver = _.get(location, 'state.removeDriver', false);
        if (removeDriver && drivers.length > 1) {
            _.pullAt(drivers, drivers.length - 1);
        }
        dispatch(setNavigation({
            canForward: true,
            showForward: false,
            updateQuoteFlag: false,
            triggerLWRAPICall: false
        }));
    }, []);

    const addDriver = () => {
        const initData = _.cloneDeep(initialData.lobData.privateCar.coverables.drivers[0]);
        initData.tempID = uuidv4();
        initData.isPolicyHolder = false;
        drivers.push(initData);
        handleForward({
            driverIndex: drivers.length - 1, removeDriver: false, isDriverEdit: false, isPolicyHolder: false
        });
    };

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationsNumber), [registrationsNumber]);

    const addCarHandler = () => {
        showLoader();
        if (viewModelService) {
            if (_.get(MCsubmissionVM, 'value.accountNumber') === undefined) {
                dispatch(setMultiCarSubmissionVM({
                    mcsubmissionVM: viewModelService.create(
                        {},
                        'pc',
                        'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
                    ),
                }));
            }
        }
        dispatch(singleToMultiProduct(submissionVM, MCsubmissionVM));
        setAPITriggerPoint(true);
    };

    useEffect(() => {
        if (!_.isEmpty(singleToMultiProductModel.multiQuoteObj) && !singleToMultiProductModel.loading && aPITriggerPoint) {
            // success
            dispatch(setNavigation({ multiCarFlag: true, fromMCDriverAllocation: true }));
            _.set(MCsubmissionVM, 'value', singleToMultiProductModel.multiQuoteObj);
            hideLoader();
            history.push({
                pathname: VRN_SEARCH_PAGE,
                state: { resetSubmission: true }
            });
            setAPITriggerPoint(false);
        }
        if (singleToMultiProductModel.quoteError && !singleToMultiProductModel.loading && aPITriggerPoint) {
            // failure
            hideLoader();
            setAPITriggerPoint(false);
        }
    }, [singleToMultiProductModel.multiQuoteObj, singleToMultiProductModel.loading, singleToMultiProductModel.quoteError]);

    return (
        <>
            <Container className="mc-driver-allocation">
                <Row>
                    <Col>
                        <HDLabelRefactor
                            id="mc-driver-allocation-header"
                            Tag="h2"
                            text={drivers.length > 1 ? messages.anotherDriverAdded : messages.heading}
                            size="lg" />
                        <div className="container--milestone-cards ml-0">
                            <div className="horizontal-line--bright" />
                            <HDCompletedCardInfo
                                webAnalyticsEvent={{
                                    event_action: `${drivers.length > 1 ? messages.anotherDriverAdded : messages.heading} - Car`
                                }}
                                id="mc-driver-allocation-car-card"
                                text={formattedRegNumber}
                                variant="car"
                                onEdit={() => handleForward({ isVehicleEdit: true, isDriverEdit: false })}
                                additionalText={`${year}${make} ${model}`} />
                            <div className="horizontal-line--bright" />
                            {
                                // eslint-disable-next-line no-nested-ternary
                                drivers.sort((driverA, driverB) => (driverA.isPolicyHolder ? -1 : driverB.isPolicyHolder ? 1 : 0)).map((driver, index) => {
                                    const {
                                        isPolicyHolder, person, fixedId, firstName, lastName, publicID
                                    } = driver;
                                    const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
                                    return (
                                        // nothing else to use
                                        <React.Fragment key={`${index + 1}`}>
                                            <HDCompletedCardInfo
                                                webAnalyticsEvent={{
                                                    event_action: `${drivers.length > 1 ? messages.anotherDriverAdded : messages.heading} - Drivers`
                                                }}
                                                id="mc-driver-allocation-driver-card"
                                                text={name}
                                                variant="driver"
                                                additionalText={(isPolicyHolder || drivers.length === 1) ? messages.accountHolder : messages.anotherDriver}
                                                onEdit={() => editDriver(driver, index)}
                                                onDelete={(isPolicyHolder || drivers.length === 1) ? null : () => setDeleteDriver({
                                                    name, fixedId, publicID
                                                })} />
                                            {drivers.length > 1 && <div className="horizontal-line--bright" />}
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                        <div className="margin-top-lg" />
                        <Row>
                            <Col xs={12} md={6} className={`${drivers.length < MAX_DRIVERS_PER_CAR ? 'padding-right-md-tiny' : ''}`}>
                                {showMutiCar && (
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.addAnotherCarEventLabel }}
                                        id="mc-driver-allocation-add-another-car-btn"
                                        className="w-100 mb-4 mc-driver-allocation__add-another-car-btn"
                                        variant="primary"
                                        size="md"
                                        label={messages.addAnothercar}
                                        onClick={addCarHandler} />
                                )}
                            </Col>
                            {drivers.length < MAX_DRIVERS_PER_CAR && (
                                <Col xs={12} md={6} className="padding-left-md-tiny">
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: messages.addAnotherdriverEventLabel }}
                                        id="mc-driver-allocation-add-another-driver-btn"
                                        className="w-100 mb-4 mc-driver-allocation__add-another-driver-btn"
                                        variant="secondary"
                                        size="md"
                                        label={messages.addAnotherdriver}
                                        onClick={() => addDriver()} />
                                </Col>
                            )}
                        </Row>
                        {drivers.length === MAX_DRIVERS_PER_CAR && (
                            <HDInfoCardRefactor
                                image={exclamationIcon}
                                paragraphs={[messages.infoTipText]}
                                className="mb-3"
                                id="mc-driver-allocation-max-car-info" />
                        )}
                        <HDInfoCardRefactor
                            image={TipCirclePurple}
                            paragraphs={[messages.tipBody]}
                            className="mb-3"
                            id="mc-driver-allocation-dont-worry-info" />
                        <hr className="horizontal-line--bright" />
                        <HDLabelRefactor
                            className="add-another-driver__label"
                            Tag="h2"
                            text={messages.nocarstoadd}
                            size="lg" />
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.continueOneCarEventLabel }}
                            id="mc-driver-allocation-continue-sc-btn"
                            variant="secondary"
                            label={messages.continuesingleCar}
                            onClick={setSwitchingToSingleCar}
                            className="mb-4 margin-top-md mc-driver-allocation__cont-single-car-btn"
                            size="md" />
                        <DeleteDriverModal
                            show={!!deleteDriver}
                            onCancel={hideDeleteModal}
                            onConfirm={onDeleteConfirm}
                            onClose={hideDeleteModal}
                            driverName={deleteDriver ? deleteDriver.name : null}
                            pageMetadata={pageMetadata} />
                        <SwitchToSingleCarModal
                            show={!!switchingToSingleCar}
                            onCancel={hideSwitchToSingleCarModal}
                            onConfirm={onSwitchToSingleCarConfirm}
                            onClose={hideSwitchToSingleCarModal}
                            pageMetadata={pageMetadata} />
                        {HDToast}
                    </Col>
                </Row>
            </Container>
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    };
};

const mapDispatchToProps = {
};

HDMCDriverAllocation.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape([])
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func,
        location: PropTypes.object,
    }).isRequired,
    handleForward: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCDriverAllocation);
