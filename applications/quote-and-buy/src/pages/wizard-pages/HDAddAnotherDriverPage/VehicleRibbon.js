/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { HDRibbon } from 'hastings-components';
import { useHistory, useLocation } from 'react-router-dom';
import routes from '../../../routes/WizardRouter/RouteConst';
import twoWords from '../__helpers__/twoWords';
import * as messages from '../HDAddAnotherCarPage/HDAddAnotherCar.messages';
import DeleteVehicleModal from '../../HDMultiCarMilestonePage/DeleteVehicleModal';

import HDQuoteService from '../../../api/HDQuoteService';
import { getMultiToSingleParam } from '../../../common/utils';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import {
    setNavigation as setNavigationAction,
    setErrorStatusCode,
    updateMultiQuote,
    resetCurrentPageIndex as resetCurrentPageIndexAction
} from '../../../redux-thunk/actions';
import { getDataForUpdateMultiQuoteAPICall } from '../../../common/submissionMappers';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { removeDataBasedOnPeriodStatus, removeOfferings } from '../../../common/submissionMappers/helpers';
import mcsubmission from '../../../routes/MCSubmissionVMInitial';
import {
    multiToSingle, multiToSingleFailed
} from '../../HDMCIntroPage/HDMCIntroPage.messages';

const VehicleRibbon = (props) => {
    const {
        vehicleAdded, fromMCDriverAllocation, setNavigation, resetCurrentPageIndex
    } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const submissionVM = useSelector((state) => state.wizardState.data.submissionVM);
    const mcsubmissionVM = useSelector((state) => state.wizardState.data.mcsubmissionVM);
    const currentCarIndex = useSelector((state) => state.wizardState.app.currentPageIndex);
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);
    const mcSingalQuoteEditObject = useSelector((state) => state.wizardState.app.MCSingalQuoteEditObject);
    let vehicles;
    if (vehicleAdded) {
        const vehicleIndex = useSelector((state) => state.wizardState.app.currentPageIndex);
        const checkMCAvailability = _.get(mcsubmissionVM, 'value.quotes', []);
        if (checkMCAvailability.length) {
            vehicles = useSelector(
                (state) => state.wizardState.data.mcsubmissionVM.quotes.children[vehicleIndex].lobData.privateCar.coverables.vehicles.value[0]
            );
        } else {
            vehicles = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.value[0]);
        }
    } else {
        vehicles = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.value[0]);
    }
    const vehicleReg = _.get(vehicles, 'registrationsNumber', null);
    const vehicleMake = _.get(vehicles, 'make', null);
    const vehicleModel = _.get(vehicles, 'model', null);
    const vehicleDetails = (vehicleReg) || `${vehicleMake} ${twoWords((vehicleModel) ? vehicleModel.toUpperCase() : null)}`;
    const QUOTES = 'value.quotes';

    const [deleteVehicle, setDeleteVehicle] = useState(null);
    const onDelete = () => setDeleteVehicle(true);
    const hideDeleteModal = () => setDeleteVehicle(false);

    const getMulticarSubmissionVMQuote = () => {
        return _.get(mcsubmissionVM, QUOTES, []);
    };

    let isChildCar = false;
    if (getMulticarSubmissionVMQuote().length) {
        isChildCar = true;
        if (location.pathname === routes.MC_POLICY_START_DATE || location.pathname === routes.MC_YOURQUOTE_PAGE) {
            const isParentCar = useSelector((state) => state.wizardState.data.mcsubmissionVM.quotes.children[currentCarIndex].isParentPolicy.value);
            isChildCar = !isParentCar;
        } else if (isEditQuoteJourney && submissionVM.value) {
            const isParentCar = submissionVM.value.isParentPolicy;
            isChildCar = !isParentCar;
        } else if (mcSingalQuoteEditObject && mcSingalQuoteEditObject.isParentPolicy) {
            const isParentCar = mcSingalQuoteEditObject.isParentPolicy;
            isChildCar = !isParentCar;
        }
    }

    // api trigger: update draft for multi product
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

    // api trigger: multi to single product
    const triggerMultiToSingleAPI = () => {
        return new Promise(async (resolve, reject) => {
            showLoader();
            await HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
                .then(({ result }) => {
                    hideLoader();
                    hideDeleteModal();
                    // update submissionVM, multi car initial state
                    _.set(submissionVM, 'value', result);
                    resetCurrentPageIndex();
                    dispatch(setNavigation({
                        quoteID: (result && result.quoteID) || '',
                        sessionUUID: (result && result.sessionUUID) || '',
                        softSellJourney: false
                    }));
                    resolve();
                }).catch((error) => {
                    hideLoader();
                    dispatch(setErrorStatusCode(error.status));
                    trackAPICallFail(multiToSingle, multiToSingleFailed);
                    reject();
                });
        });
    };

    const removeSelectedVehicleFromSubmission = () => {
        let mcQuotes = _.cloneDeep(_.get(mcsubmissionVM, QUOTES, []));
        mcQuotes = mcQuotes.filter((quoteObj) => {
            return quoteObj.quoteID !== _.get(submissionVM, 'value.quoteID', null);
        });
        _.set(mcsubmissionVM, QUOTES, _.cloneDeep(mcQuotes));
        resetCurrentPageIndex();
        return mcQuotes;
    };

    // navigate after each multi to single product api call
    const navigationAfterMultiToSingleServiceCall = () => {
        if (fromMCDriverAllocation) {
            const mcsubmissionInit = _.cloneDeep(mcsubmission);
            _.set(mcsubmissionVM, 'value', mcsubmissionInit);
            history.push(routes.MC_DRIVER_ALLOCATION);
        } else {
            dispatch(setNavigation({
                multiCarFlag: false
            }));
            const mcsubmissionInit = _.cloneDeep(mcsubmission);
            _.set(mcsubmissionVM, 'value', mcsubmissionInit);
            history.push(routes.ADD_ANOTHER_DRIVER);
        }
        trackAPICallSuccess(multiToSingle);
    };

    const onDeleteConfirm = () => {
        if (!deleteVehicle) return;
        dispatch(setNavigation({
            isEditQuoteJourney: false
        }));
        const mcsubmissionVMCloned = _.cloneDeep(mcsubmissionVM.value);
        if (location.pathname !== routes.MC_YOURQUOTE_PAGE && location.pathname !== routes.MC_POLICY_START_DATE) {
            removeSelectedVehicleFromSubmission();
            if (getMulticarSubmissionVMQuote().length > 1) {
                // mcsubmissioVMCloned: from this,  remove deleted quoteID
                dispatch(setNavigation({ fromMCDriverAllocation: false }));
                hideDeleteModal();
                // navigate to multicar milestone
                triggerUpdateDraft().then(() => {
                    history.push({
                        pathname: routes.MC_MILESTONE,
                        state: {
                            shouldNotUpdate: true
                        }
                    });
                });
            } else {
                triggerMultiToSingleAPI().then(() => {
                    navigationAfterMultiToSingleServiceCall();
                });
            }
        } else if (mcsubmissionVMCloned.quotes.length === 2) {
            // multi to single set submissionVM after successful response
            // navigate to mc driver allocation
            triggerMultiToSingleAPI().then(() => {
                navigationAfterMultiToSingleServiceCall();
            });
        } else {
            // length > 2
            // move quotes to draft state and then navigate the user to mc milestone page
            // we will do update here after removing deleted car from copy of mcsubmissioVM and then pass shoudlNotUpdate as true
            // currentCarIndex should not give error in mc policy start date page
            // will give error in MC YOURQUOTES PAGE (current car Index)
            showLoader();
            const mcsubmissionVMCopy = _.cloneDeep(mcsubmissionVM.value); // this should not have deleted car
            if (currentCarIndex > -1) _.pullAt(mcsubmissionVMCopy.quotes, currentCarIndex);
            // if periodStatus === qutoed, then remove bindData and offerings from payload
            // mcsubmissionVMCopy = getDataForUpdateMultiQuoteAPICall(mcsubmissionVMCopy);
            mcsubmissionVMCopy.quotes.map((paramObject) => {
                removeDataBasedOnPeriodStatus(paramObject, ['Quoted', 'Draft']); // Adding draft to fix issue regarding binddata send in update call
                removeOfferings(paramObject);
                return null;
            });
            HDQuoteService.updateMultiQuote(getDataForUpdateMultiQuoteAPICall(mcsubmissionVMCopy))
                .then(({ result }) => {
                    _.set(mcsubmissionVM, 'value', result);
                    resetCurrentPageIndex();
                    history.push({
                        pathname: routes.MC_MILESTONE,
                        state: {
                            shouldNotUpdate: true
                        }
                    });
                    hideLoader();
                    trackAPICallSuccess('Update Multi Quote');
                }).catch((error) => {
                    dispatch(setErrorStatusCode(error.status));
                    hideLoader();
                    trackAPICallFail('Update Multi Quote', 'Update Multi Quote Failed');
                });
        }
    };
    return (
        <>
            <HDRibbon
                text={vehicleDetails}
                actionText={isChildCar ? messages.removeCar : ''}
                onClick={onDelete}
                className="vehicle-ribbon" />
            {
                <DeleteVehicleModal
                    show={!!deleteVehicle}
                    onCancel={hideDeleteModal}
                    onConfirm={() => onDeleteConfirm()}
                    onClose={hideDeleteModal}
                    hideClose />
            }
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        fromMCDriverAllocation: state.wizardState.app.fromMCDriverAllocation,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    updateMultiQuote,
    resetCurrentPageIndex: resetCurrentPageIndexAction,
};

VehicleRibbon.propTypes = {
    vehicleAdded: PropTypes.bool.isRequired,
    fromMCDriverAllocation: PropTypes.bool.isRequired,
    setNavigation: PropTypes.func.isRequired,
    resetCurrentPageIndex: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleRibbon);
