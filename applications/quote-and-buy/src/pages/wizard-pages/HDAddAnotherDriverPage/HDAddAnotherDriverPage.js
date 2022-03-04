import React, {
    useEffect, useState, useMemo
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import {
    HDLabelRefactor,
    HDInfoCardRefactor,
} from 'hastings-components';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Container } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import {
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDButton as HDButton,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo
} from '../../../web-analytics';

import DeleteDriverModal from './DeleteDriverModal';
import { setNavigation } from '../../../redux-thunk/actions';
import initialData from '../../../routes/SubmissionVMInitial';
import * as messages from './HDAddAnotherDriver.messages';
import useToast from '../../Controls/Toast/useToast';
import HDAddAnotherCar from '../../HDAddAnotherCar/HDAddAnotherCar';
import formatRegNumber from '../../../common/formatRegNumber';
import { ABOUT_MC_COVER } from '../../../routes/BaseRouter/RouteConst';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import * as monetateHelper from '../../../common/monetateHelper';

const HDAddAnotherDriverPage = (props) => {
    const [cookies, setCookie] = useCookies(['']);
    const [isManagingDrivers, setManagingDrivers] = useState(true);
    const { handleForward, history, pageMetadata } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const [showMutiCar, setShowMultiCar] = useState(false);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const drivers = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.drivers.value);
    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const vehicleDrivers = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicleDrivers.value);
    const isEditQuoteJourneyDriver = useSelector((state) => state.wizardState.app.isEditQuoteJourneyDriver);
    const customizeVM = useSelector((state) => state.wizardState.data.customizeSubmissionVM);
    const selectedBrandCode = _.get(customizeVM, 'value.quote.branchCode', '');
    const {
        yearManufactured, make, model, registrationsNumber
    } = vehicle;
    const [deleteDriver, setDeleteDriver] = useState(null);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const [HDToast, addToast] = useToast();

    const hideDeleteModal = () => setDeleteDriver(null);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tickWhite',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

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
        setManagingDrivers(false);
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
    }, []);
    useEffect(() => {
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
        if (!cookies['mt.v'] && retrievedCookie) {
            setCookie('mt.v', retrievedCookie);
        }
    }, [multiCarElements]);
    const editDriver = (driver, index) => {
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        handleForward({
            driverIndex: index, removeDriver: false, isDriverEdit: true, fixedId: driver.fixedId, isPolicyHolder: !driver.relationToProposer
        });
    };

    const onDeleteConfirm = () => {
        if (!deleteDriver) return;
        const index = drivers.findIndex((driver) => (deleteDriver.fixedId && driver.fixedId === deleteDriver.fixedId)
            || (deleteDriver.publicID && driver.publicID === deleteDriver.publicID));
        _.pullAt(drivers, index);
        const vehicleDriverIndex = vehicleDrivers.findIndex((driver) => (deleteDriver.fixedId && driver.driverID === deleteDriver.fixedId));
        _.pullAt(vehicleDrivers, vehicleDriverIndex);
        hideDeleteModal();
        // force drivers reaload
        dispatch(setNavigation({ canForward: true }));
    };


    const addDriver = () => {
        const initData = _.cloneDeep(initialData.lobData.privateCar.coverables.drivers[0]);
        initData.tempID = uuidv4();
        initData.isPolicyHolder = false;
        drivers.push(initData);
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        handleForward({
            driverIndex: drivers.length - 1, removeDriver: false, isDriverEdit: false, isPolicyHolder: false
        });
    };

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationsNumber), [registrationsNumber]);
    const addCarHandler = () => {
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        history.push({
            pathname: ABOUT_MC_COVER,
            state: { resetSubmission: true, fromPage: history.location.pathname }
        });
    };

    // return main driver first, then sort according to fixedid
    const sortDrivers = (driverA, driverB) => {
        if (!driverA.relationToProposer) {
            return -1;
        } if (!driverB.relationToProposer) {
            return 1;
        } return parseInt(driverA.fixedId, 10) - parseInt(driverB.fixedId, 10);
    };

    const checkEditJourneyOnContinue = () => {
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        dispatch(setNavigation({
            isEditFromMilestonePage: false
        }));
        handleForward();
    };

    const checkEditOnvehicle = () => {
        if (isEditQuoteJourneyDriver) {
            dispatch(setNavigation({
                finishEditingEnabled: true
            }));
        }
        dispatch(setNavigation({
            isEditFromMilestonePage: true
        }));
        handleForward({ isVehicleEdit: true, isDriverEdit: false });
    };


    return (
        <Container className="add-another-driver">
            <Row>
                <Col xs={12} md={6} className="add-another-driver__left-column">
                    {!isManagingDrivers && (
                        <>
                            <HDLabelRefactor
                                className="add-another-driver__label"
                                Tag="h1"
                                text={drivers.length === 1 ? messages.yourDetailAdded : messages.anotherDriverAdded}
                                size="lg" />
                            <div className="horizontal-line--bright" />
                            <HDCompletedCardInfo
                                id="card-card"
                                webAnalyticsEvent={{ event_action: `${drivers.length === 1 ? messages.yourDetailAdded : messages.anotherDriverAdded} - Car` }}
                                text={formattedRegNumber}
                                variant="car"
                                onEdit={() => { checkEditOnvehicle(); }}
                                additionalText={`${yearManufactured}${make} ${model}`} />
                            <div className="horizontal-line--bright" />
                            {
                                // eslint-disable-next-line no-nested-ternary
                                drivers.sort(sortDrivers).map((driver, index) => {
                                    const {
                                        relationToProposer, person, fixedId, firstName, lastName, publicID
                                    } = driver;
                                    const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
                                    return (
                                    // nothing else to use
                                    // eslint-disable-next-line react/no-array-index-key
                                        <React.Fragment key={index}>
                                            <HDCompletedCardInfo
                                                webAnalyticsEvent={{
                                                    event_action: `${drivers.length === 1
                                                        ? messages.yourDetailAdded : messages.anotherDriverAdded} - Drivers`
                                                }}
                                                id="driver-card"
                                                text={name}
                                                variant="driver"
                                                additionalText={(!relationToProposer || drivers.length === 1) ? messages.policyholder : messages.anotherDriver}
                                                onEdit={() => editDriver(driver, index)}
                                                onDelete={(!relationToProposer || drivers.length === 1) ? null : () => setDeleteDriver({
                                                    name, fixedId, publicID
                                                })} />
                                            <div className="horizontal-line--bright" />
                                        </React.Fragment>
                                    );
                                })}
                            {drivers.length < 5 && (
                                <HDButtonDashed
                                    webAnalyticsEvent={{ event_action: messages.addAnother }}
                                    id="add-another-driver-button"
                                    className="add-another-driver__button"
                                    onClick={() => addDriver()}
                                    label={messages.addAnother}
                                    icon />
                            )}
                            {drivers.length === 5 && (
                                <HDInfoCardRefactor
                                    image={exclamationIcon}
                                    paragraphs={[messages.infoTipText]}
                                    className="add-another-driver__info-card mt-5 mb-5 width-max-content"
                                    id="car-mileage-dont-know-info" />
                            )}
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                id="continue-button"
                                variant="primary"
                                label={messages.continueBtnLabel}
                                onClick={() => { checkEditJourneyOnContinue(); }}
                                className="add-another-driver__continue-button mb-4" />
                            <DeleteDriverModal
                                pageMetadata={pageMetadata}
                                show={!!deleteDriver}
                                onCancel={hideDeleteModal}
                                onConfirm={onDeleteConfirm}
                                onClose={hideDeleteModal}
                                driverName={deleteDriver ? deleteDriver.name : null} />
                        </>
                    )}
                    {HDToast}
                </Col>
                {showMutiCar && selectedBrandCode !== messages.youDrive && (
                    <Col xs={{ span: 12, offset: 0 }} md={{ span: 6, offset: 0 }} className="add-another-driver__right-column margin-top-lg-mobile">
                        <HDAddAnotherCar hidden={false} addCarHandler={addCarHandler} />
                    </Col>
                )}
            </Row>
        </Container>
    );
};

HDAddAnotherDriverPage.propTypes = {
    handleForward: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
        location: PropTypes.object
    }).isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default HDAddAnotherDriverPage;
