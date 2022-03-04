import React, {
    useEffect, useCallback, useState, useMemo
} from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDCompletedCardInfo as HDCompletedCardInfo
} from '../../../web-analytics';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { setNavigation as setNavigationAction, setErrorStatusCode } from '../../../redux-thunk/actions';
import * as messages from './HDMCCompletedCarDetails.messages';
import formatRegNumber from '../../../common/formatRegNumber';
import DeleteVehicleModal from '../../HDMultiCarMilestonePage/DeleteVehicleModal';
import HDQuoteService from '../../../api/HDQuoteService';
import { getMultiToSingleParam } from '../../../common/utils';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import WizardRoutes from '../../../routes/WizardRouter/RouteConst';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import {
    multiToSingle, multiToSingleFailed
} from '../../HDMCIntroPage/HDMCIntroPage.messages';
import { getDataForUpdateMultiQuoteAPICall } from '../../../common/submissionMappers';

const HDMCCompletedCarDetailsPage = (props) => {
    const {
        submissionVM, mcsubmissionVM, setNavigation, handleForward, editQuoteJourney, pageMetadata
    } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [registrationNumber, setRegistrationNumber] = useState();
    const [make, setMake] = useState();
    const [model, setModel] = useState();
    const [year, setYear] = useState('');
    const [isParentCar, setParentCar] = useState(true);
    const [deleteVehicle, setDeleteVehicle] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const fetchBusinessesFinalData = useCallback(() => {
        const vehicleVM = _.get(submissionVM, vehiclePath);
        setRegistrationNumber(vehicleVM.registrationsNumber.value !== undefined ? vehicleVM.registrationsNumber.value : null);
        setMake(vehicleVM.make.value !== undefined ? vehicleVM.make.value : '');
        setModel(vehicleVM.model.value !== undefined ? vehicleVM.model.value : '');
        setYear(vehicleVM.year.value !== undefined ? vehicleVM.year.value : '');
    }, [submissionVM]);

    useEffect(() => {
        fetchBusinessesFinalData();
    }, [fetchBusinessesFinalData]);

    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        dispatch(setNavigation({
            canForward: true,
            showForward: false,
            updateQuoteFlag: false,
            triggerLWRAPICall: false
        }));
    }, []);

    const formattedRegNumber = useMemo(() => formatRegNumber(registrationNumber), [registrationNumber]);

    useEffect(() => {
        const getmcsubmissionVMQuote = _.get(mcsubmissionVM, 'value.quotes', []);
        const isParent = getmcsubmissionVMQuote.length === 0;
        if (getmcsubmissionVMQuote.length !== 0) {
            setParentCar(_.get(submissionVM, 'value.isParentPolicy', false));
        } else {
            setParentCar(isParent);
        }
    }, []);

    const hideDeleteVehicleModal = () => setDeleteVehicle(false);

    const getUpdatedMCSubmission = () => {
        mcsubmissionVM.value.quotes = mcsubmissionVM.value.quotes.filter((quoteObj) => {
            return quoteObj.quoteID !== _.get(submissionVM, 'value.quoteID', null);
        });
        return mcsubmissionVM.value.quotes;
    };

    // for FE-BE sync
    const updateMCSubmissionVM = () => {
        HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVM.value))
            .then(({ result }) => {
                _.set(mcsubmissionVM, 'value', result);
                dispatch(setNavigation({ hideGoBack: false, softSellJourney: false }));
                history.push({
                    pathname: WizardRoutes.MC_MILESTONE,
                    state: {
                        fromPage: history.location.pathname
                    }
                });
                hideLoader();
                trackAPICallSuccess('Update Multi Quote');
            }).catch((error) => {
                dispatch(setErrorStatusCode(error.status));
                hideLoader();
                trackAPICallFail('Update Draft MC Quote', 'Update Draft MC Quote Failed');
            });
    };

    const onDeleteVehicleConfirm = () => {
        const getmcsubmissionVMQuote = getUpdatedMCSubmission();
        if (_.get(submissionVM, 'value.quoteID', false) && getmcsubmissionVMQuote.length > 1) {
            setDeleteVehicle(false);
            showLoader();
            updateMCSubmissionVM();
        } else if (getmcsubmissionVMQuote.length > 1) {
            history.push({
                pathname: WizardRoutes.MC_MILESTONE,
                state: {
                    fromPage: history.location.pathname
                }
            });
        } else if (getmcsubmissionVMQuote.length === 1) {
            setDeleteVehicle(false);
            showLoader();
            HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    _.set(submissionVM, 'value', result);
                    _.set(mcsubmissionVM, 'value', mcsubmission);
                    dispatch(setNavigation({ quoteID: result.quoteID, sessionUUID: result.sessionUUID, softSellJourney: false }));
                    hideLoader();
                    history.push({
                        pathname: WizardRoutes.MC_DRIVER_ALLOCATION,
                        state: {
                            fromPage: history.location.pathname
                        }
                    });
                    trackAPICallSuccess(multiToSingle);
                }).catch((error) => {
                    hideLoader();
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                });
        }
    };

    const editVehicleHandler = () => {
        dispatch(setNavigation({ hideGoBack: true }));
        handleForward({ isVehicleEdit: true });
    };

    return (
        <div className="mc-car-details-wrapper">
            <Container fluid className="mc-car-completed-details-container">
                <Row>
                    <Col>
                        <HDLabelRefactor
                            Tag="h1"
                            text={isParentCar ? messages.carDetailsSorted : messages.childCarDetailsSorted}
                            id="car-details-sorted-label"
                            className="margin-bottom-sm" />
                        <HDLabelRefactor
                            Tag="h5"
                            text={messages.sortOutTheDriver}
                            id="car-details-sorted-driver-label"
                            className="margin-bottom-lg" />
                        <div className="horizontal-line--bright" />
                        <HDCompletedCardInfo
                            id="car-details-sorted-completed-card-info"
                            webAnalyticsEvent={{
                                event_action: messages.sortOutTheDriver
                            }}
                            text={formattedRegNumber}
                            variant="car"
                            onEdit={editVehicleHandler}
                            onDelete={isParentCar ? null : () => setDeleteVehicle(true)}
                            additionalText={`${year} ${make} ${model}`} />
                        <div className="horizontal-line--bright" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DeleteVehicleModal
                            show={!!deleteVehicle}
                            onCancel={hideDeleteVehicleModal}
                            onConfirm={onDeleteVehicleConfirm}
                            hideClose
                            onClose={hideDeleteVehicleModal}
                            pageMetadata={pageMetadata} />
                        <HDButton
                            id="car-details-sorted-continue-button"
                            webAnalyticsEvent={{ event_action: messages.continueBtnEventLabel }}
                            onClick={() => handleForward({ isInEditJourney: editQuoteJourney })}
                            label={messages.continueBtnLabel}
                            variant="primary"
                            className="mc-car-completed-details__cont-btn"
                            size="md" />
                    </Col>
                </Row>
            </Container>
            { HDFullscreenLoader }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        editQuoteJourney: state.wizardState.app.isEditQuoteJourney
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDMCCompletedCarDetailsPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    editQuoteJourney: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape({
            quotes: PropTypes.shape([])
        })
    }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

HDMCCompletedCarDetailsPage.defaultProps = {
    mcsubmissionVM: null
};


export default connect(mapStateToProps, mapDispatchToProps)(HDMCCompletedCarDetailsPage);
