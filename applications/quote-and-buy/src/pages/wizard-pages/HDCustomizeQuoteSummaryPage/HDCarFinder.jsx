import { Col, Row } from 'react-bootstrap';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HDLabelRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import React, { forwardRef, useContext, useState } from 'react';
import { connect } from 'react-redux';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDModal as HDModal,
} from '../../../web-analytics';
import HDFaq from '../../Controls/HDFaq/HDFaq';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import { HastingsVehicleInfoLookupService } from '../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import gbIcon from '../../../assets/images/wizard-images/hastings-icons/icons/GB.svg';
import { setVehicleDetails as setVehicleDetailsAction } from '../../../redux-thunk/actions';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import * as messages from './HDCarFinder.messages';
// import './HDCarFinder.scss';

export const HDCarFinder = forwardRef(({
    submissionVM,
    vehicleDetails,
    onFind,
    setVehicleDetails,
    findVehicleCallback,
    pageMetadata,
    setPreviousVehicleDetails
}, ref) => {
    const [regNumber, setRegNumber] = useState('');
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    const viewModelService = useContext(ViewModelServiceContext);

    const registrationReqVM = (viewModelService) ? viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.vehicleinfo.dto.request.RegistrationReqDTO',
    ) : null;

    const lookupVehicleByRegNumber = () => {
        const regNo = regNumber.replace(/\s+/g, '');
        const dataObject = [{ registrationNumber: regNo }];

        if (registrationReqVM) {
            registrationReqVM.registrationNumber.value = regNo;
        }

        if (!regNo) {
            setError(messages.emptyRegNumberErrorMsg);
        } else if (!registrationReqVM || !registrationReqVM.registrationNumber.aspects.valid) {
            setError(messages.invalidRegNumberErrorMsg);
        } else {
            setPreviousVehicleDetails({
                details: vehicleDetails,
                vehicle: (submissionVM) ? submissionVM.lobData.privateCar.coverables.vehicles.children[0].value : null
            });
            setError(null);
            showLoader();
            HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN(dataObject)
                .then((vehicleInfo) => {
                    if ((!vehicleInfo.result && !vehicleInfo.result.abiCode) || vehicleInfo.result.type === undefined) {
                        setError(messages.carNotFoundErrorMsg);
                        trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.invalidVRN);
                    } else if (vehicleInfo.result.type === messages.motorcycleExt) {
                        setError(messages.bikeRegErrorMsg);
                        trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.incorrectVRNBike);
                    } else {
                        setVehicleDetails({
                            data: {
                                ...vehicleInfo.result,
                                regNo
                            }
                        });
                        onFind(true);
                        findVehicleCallback(vehicleInfo, regNo);
                        trackAPICallSuccess(messages.retrieveVehicleDataBasedOnVRN);
                        setRegNumber('');
                    }
                })
                .catch(() => {
                    setError(messages.carNotFoundErrorMsg);
                    trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.notFoundVRN);
                })
                .finally(() => {
                    hideLoader();
                });
        }
    };

    const handleClick = () => {
        lookupVehicleByRegNumber();
    };

    const handleRegNumberChange = (event) => {
        setRegNumber(event.target.value.toUpperCase());
        setError(null);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Row className="customize-quote-car-finder theme-white">
                <Col>
                    <Row>
                        <Col>
                            <HDLabelRefactor className="customize-quote-car-finder__main-header mt-0" Tag="h2" size="lg" text={messages.mainHeader} />
                        </Col>
                    </Row>
                    <Row className="customize-quote-car-finder__find-car">
                        <Col xs={12} md={8} className="px-0">
                            <HDTextInput
                                webAnalyticsEvent={{ event_action: messages.mainHeader }}
                                customClassName="customize-quote-car-finder__input-box"
                                id="reg-number"
                                ref={ref}
                                name="regNumber"
                                size="lg"
                                type="alphanum"
                                maxLength="8"
                                svgIcon={gbIcon}
                                value={regNumber}
                                onChange={handleRegNumberChange} />
                        </Col>
                        <Col xs={12} md={4} className="px-0 pl-md-4 mt-3 mt-md-0 text-right">
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.findButtonLabel }}

                                className="customize-quote-car-finder__find-button"
                                label={messages.findButtonLabel}
                                onClick={handleClick} />
                            {error && (
                                <div className="customize-quote-car-finder__error-box">
                                    <span>{error}</span>
                                </div>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="customize-quote-car-finder__not-know-link theme-white-override"
                                Tag="a"
                                text={messages.dontKnowLink}
                                onClick={handleShowModal} />
                        </Col>
                    </Row>
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata, page_section: messages.dontKnowPopupHeader }}
                        webAnalyticsEvent={{ event_action: messages.dontKnowPopupHeader }}
                        id="reg-number-modal"
                        className="customize-quote-car-finder__modal"
                        show={showModal}
                        headerText={messages.dontKnowPopupHeader}
                        confirmLabel={messages.dontKnowPopupConfirmLabel}
                        onClose={handleHideModal}
                        onConfirm={handleHideModal}
                        hideCancelButton
                    >
                        <Row className="mb-3">
                            <Col>
                                <HDLabelRefactor text={messages.dontKnowPopupContent} Tag="p" />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <HDLabelRefactor text={messages.questionHeader} Tag="h6" />
                            </Col>
                        </Row>
                        <Row className="customize-quote-car-finder__modal-additional-info mb-n2">
                            <Col xs="auto" className="pr-0">
                                <div className="fas fa-question-circle customize-quote-car-finder__modal__alert" />
                            </Col>
                            <Col xs="auto" className="px-2">
                                <HDLabelRefactor
                                    text={messages.findAnswerLabel}
                                    Tag="span" />
                            </Col>
                            <Col xs="auto" className="px-0 theme-white">
                                <HDFaq isInPopup />
                            </Col>
                        </Row>
                    </HDModal>
                </Col>
            </Row>
            {HDFullscreenLoader}
        </>
    );
});

const connectForwardRef = () => {
    const mapStateToProps = (state) => ({
        submissionVM: state.wizardState.data.submissionVM,
        vehicleDetails: state.vehicleDetails.data,
    });

    const mapDispatchToProps = {
        setVehicleDetails: setVehicleDetailsAction,
    };

    return connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });
};

HDCarFinder.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    vehicleDetails: PropTypes.shape({}).isRequired,
    onFind: PropTypes.func.isRequired,
    setVehicleDetails: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    findVehicleCallback: PropTypes.func.isRequired,
    setPreviousVehicleDetails: PropTypes.func.isRequired,
};

export default connectForwardRef()(HDCarFinder);
