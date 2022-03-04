import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
    HDCompletedCardInfo,
    HDLabelRefactor,
    HDInfoCardRefactor,
    HDButtonRefactor
} from 'hastings-components';
import { Row, Col, Container } from 'react-bootstrap';
import { AnalyticsHDButtonDashed as HDButtonDashed } from '../../../web-analytics';
import DeleteDriverModal from './DeleteDriverModal';
import { setNavigation, singleToMultiProduct } from '../../../redux-thunk/actions';
import initialData from '../../../routes/SubmissionVMInitial';
import * as messages from './HDAddAnotherDriver.messages';
// import './HDAddAnotherDriverPage.scss';
import useToast from '../../Controls/Toast/useToast';
import HDAddAnotherCar from '../../HDAddAnotherCar/HDAddAnotherCar';
import formatRegNumber from '../../../common/formatRegNumber';
import { ABOUT_MC_COVER, VRN_SEARCH_PAGE } from '../../../routes/BaseRouter/RouteConst';
import exclamationIcon from '../../../assets/images/icons/exclamation-icon.svg';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';

const HDAddAnotherDriverPage = (props) => {
    const { handleForward, history } = props;
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
    const [HDToast, addToast] = useToast();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();

    const [driversList, setDriversList] = useState([]);
    const [deleteDriverIndex, setDeleteDriverIndex] = useState(-1);

    const onDelete = (index) => setDeleteDriverIndex(index);

    const hideDeleteModal = () => setDeleteDriver(null);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tick',
                    bgColor: 'main',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

    const setDrivers = () => {
        const list = drivers.map((driver, index) => {
            const { firstName, lastName, person } = driver;
            const deleteDriver = () => onDelete(index);
            return (
                // nothing else to use
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                    <HDCompletedCardInfo
                        text={`${firstName || person.firstName} ${lastName || person.lastName}`}
                        variant="driver"
                        additionalText={index === 0 ? messages.accountHolder : messages.anotherDriver}
                        onEdit={() => {}}
                        onDelete={index > 0 ? deleteDriver : null} />
                    <div className="line" />
                </React.Fragment>
            );
        });
    };

    const editDriver = (driver, index) => {
        handleForward({
            driverIndex: index, removeDriver: false, isDriverEdit: true, fixedId: driver.fixedId, isPolicyHolder: driver.isPolicyHolder
        });
    };

    const onDeleteConfirm = () => {
        if (!deleteDriver) return;
        const index = drivers.findIndex((driver) => (deleteDriver.fixedId && driver.fixedId === deleteDriver.fixedId)
            || (deleteDriver.publicID && driver.publicID === deleteDriver.publicID));
        _.pullAt(drivers, index);
        hideDeleteModal();
        // force drivers reaload
        dispatch(setNavigation({ canForward: true }));
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
        // history.push({ pathname: ABOUT_MC_COVER });
        showLoader();
        dispatch(singleToMultiProduct(submissionVM, MCsubmissionVM));
    };

    useEffect(() => {
        if (!_.isEmpty(singleToMultiProductModel.multiQuoteObj) && !singleToMultiProductModel.loading) {
            // success
            hideLoader();
            history.push({ pathname: VRN_SEARCH_PAGE });
        }
        if (singleToMultiProductModel.quoteError && !singleToMultiProductModel.loading) {
            // failure
            hideLoader();
        }
    }, [singleToMultiProductModel.multiQuoteObj, singleToMultiProductModel.loading, singleToMultiProductModel.quoteError]);

    return (
        <>
            <Container className="add-another-driver">
                <Row>
                    <Col xs={12} md={6} className="add-another-driver__left-column">
                        <HDLabelRefactor
                            className="add-another-driver__label"
                            Tag="h1"
                            text={drivers.length > 1 ? messages.anotherDriverAdded : messages.yourDetailAdded}
                            size="lg" />
                        <div className="add-another-driver__line" />
                        <HDCompletedCardInfo
                            text={formattedRegNumber}
                            variant="car"
                            onEdit={() => handleForward({ isVehicleEdit: true, isDriverEdit: false })}
                            additionalText={`${year}${make} ${model}`} />
                        <div className="add-another-driver__line" />
                        {
                        // eslint-disable-next-line no-nested-ternary
                            drivers.sort((driverA, driverB) => (driverA.isPolicyHolder ? -1 : driverB.isPolicyHolder ? 1 : 0)).map((driver, index) => {
                                const {
                                    isPolicyHolder, person, fixedId, firstName, lastName, publicID
                                } = driver;
                                const name = `${firstName || person.firstName} ${lastName || person.lastName}`;
                                return (
                                // nothing else to use
                                // eslint-disable-next-line react/no-array-index-key
                                    <React.Fragment key={index}>
                                        <HDCompletedCardInfo
                                            webAnalyticsEvent={{ event_action: messages.addAnother }}
                                            id="add-another-driver-button"
                                            text={name}
                                            variant="driver"
                                            additionalText={(isPolicyHolder || drivers.length === 1) ? messages.policyholder : messages.anotherDriver}
                                            onEdit={() => editDriver(driver, index)}
                                            onDelete={(isPolicyHolder || drivers.length === 1) ? null : () => setDeleteDriver({
                                                name, fixedId, publicID
                                            })} />
                                        <div className="add-another-driver__line" />
                                    </React.Fragment>
                                );
                            })}
                        {drivers.length < 5 && (
                            <HDButtonDashed
                                id="add-another-driver-button"
                                className="add-another-driver__button mt-5 mb-3"
                                onClick={() => addDriver()}
                                title={messages.addAnother}
                                icon />
                        )}
                        {drivers.length === 5 && (
                            <HDInfoCardRefactor
                                image={exclamationIcon}
                                paragraphs={[messages.infoTipText]}
                                className="mt-5 mb-3"
                                id="car-mileage-dont-know-info" />
                        )}
                        <HDButtonRefactor
                            variant="primary"
                            label={messages.continueBtnLabel}
                            onClick={handleForward}
                            className="mb-4" />
                        <DeleteDriverModal
                            show={!!deleteDriver}
                            onCancel={hideDeleteModal}
                            onConfirm={onDeleteConfirm}
                            onClose={hideDeleteModal}
                            driverName={deleteDriver ? deleteDriver.name : null} />
                        {HDToast}
                    </Col>
                    <Col xs={{ span: 12, offset: 0 }} md={{ span: 6, offset: 0 }} className="add-another-driver__right-column margin-top-lg-mobile">
                        <HDAddAnotherCar hidden={false} addCarHandler={addCarHandler} />
                    </Col>
                </Row>
            </Container>
            {HDFullscreenLoader}
        </>
    );
};

HDAddAnotherDriverPage.propTypes = {
    handleForward: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired
};

export default HDAddAnotherDriverPage;
