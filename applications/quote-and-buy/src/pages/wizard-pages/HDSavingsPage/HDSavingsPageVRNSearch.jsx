import React, {
    useContext, useState, useRef, useEffect
} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Col, Row } from 'react-bootstrap';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    HDQuoteInfoRefactor, HDLabelRefactor
} from 'hastings-components';
import { AnalyticsHDButton as HDButtonRefactor, AnalyticsHDTextInput as HDTextInputRefactor } from '../../../web-analytics';
import { HastingsVehicleInfoLookupService } from '../../../../../../common/capabilities/hastings-capability-vehicleinfolookup';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { WIZARD_INITIAL_ROUTE } from '../../../routes/BaseRouter/RouteConst';
import {
    setNavigation as setNavigationAction,
    setVehicleDetails as setVehicleDetailsAction
} from '../../../redux-thunk/actions';
import { HASTINGS_DIRECT } from '../../../constant/const';
import EventEmmiter from '../../../EventHandler/event';
import * as messages from './HDSavingsPage.messages';

const HDSavingsPageVRNSearch = (props) => {
    const {
        submissionVM, history, setVehicleDetails, carInfo, dontHaveRegHandler, firstNonRegQuoteID, showedNoRegModal, mcsubmissionVM
    } = props;

    const getChosenQuote = () => {
        const chosenQuoteID = carInfo.value.bindData.chosenQuote;
        return carInfo.value.quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
    };

    const numbers = require('../HDQuoteDeclinePage/PhoneNumbers.json');
    const producerCode = _.get(carInfo, 'baseData.producerCode.value');
    const campaignCode = _.get(carInfo, 'baseData.trackingCode.value[0].codeValue');
    const productCode = _.get(carInfo, 'baseData.productCode.value');
    const selectedBrand = getChosenQuote() ? _.get(getChosenQuote(), 'branchCode') : HASTINGS_DIRECT;
    const phoneNumberKey = (producerCode && campaignCode && productCode)
        ? `${producerCode}/${campaignCode}/${productCode}/${selectedBrand}` : selectedBrand;
    const phoneNumber = (numbers[phoneNumberKey]) ? numbers[phoneNumberKey] : numbers[selectedBrand];
    const viewModelService = useContext(ViewModelServiceContext);
    const registrationReqVM = (viewModelService) ? viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.vehicleinfo.dto.request.RegistrationReqDTO',
    ) : null;
    const [regNumber, setRegNumber] = useState('');
    const [error, setError] = useState(null);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const inputRef = useRef(null);
    const vehicleArray = 'lobData.privateCar.coverables.vehicles[0]';

    useEffect(() => {
        if (showedNoRegModal && firstNonRegQuoteID === carInfo.value.quoteID) { inputRef.current.focus(); }
    }, [showedNoRegModal]);

    const handleRegNumberChange = (event) => {
        setRegNumber(event.target.value.toUpperCase());
        setError(null);
    };

    const loadVehicleDetails = (regNo, vehicleInfo) => {
        // eslint-disable-next-line no-param-reassign
        vehicleInfo.result.regNo = regNo;
        const tempCarInfo = _.cloneDeep(carInfo.value);
        _.set(tempCarInfo, `${vehicleArray}.importType`, vehicleInfo.result.imported);
        _.set(tempCarInfo, `${vehicleArray}.transmission`, vehicleInfo.result.transmission);
        _.set(submissionVM, 'value', tempCarInfo);
        setVehicleDetails({ data: vehicleInfo.result });
        EventEmmiter.dispatch('change', { price: null });
        history.push({
            pathname: WIZARD_INITIAL_ROUTE,
            state: { fromPage: history.location.pathname }
        });
    };

    const lookupVehicleByRegNumber = () => {
        const regNo = regNumber.toUpperCase().replace(/\s+/g, '');
        const dataObject = [{ registrationNumber: regNo }];

        if (registrationReqVM) {
            registrationReqVM.registrationNumber.value = regNo;
        }
        if (!regNo || regNo === '') {
            setError(messages.emptyRegNumberErrorMsg);
        } else if (!registrationReqVM || !registrationReqVM.registrationNumber.aspects.valid) {
            setRegNumber('');
            setError(messages.notFoundVRN);
        } else {
            setError(null);
            showLoader();
            HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN(dataObject)
                .then((vehicleInfo) => {
                    if ((!vehicleInfo.result && !vehicleInfo.result.abiCode) || vehicleInfo.result.type === undefined) {
                        setError(messages.notFoundVRN);
                    } else if (vehicleInfo.result.type === messages.motorcycleExt) {
                        setError(messages.bikeRegErrorMsg);
                    } else {
                        setRegNumber('');
                        loadVehicleDetails(regNo, vehicleInfo);
                    }
                })
                .catch(() => {
                    setError(messages.systemError);
                })
                .finally(() => {
                    hideLoader();
                    setRegNumber('');
                });
        }
    };

    const checkVRNHandler = () => {
        let existingVRN = false;
        mcsubmissionVM.value.quotes.map((quoteObject) => {
            const registrationNumber = _.get(quoteObject, 'lobData.privateCar.coverables.vehicles[0].registrationsNumber', '');
            if ((registrationNumber === regNumber.toUpperCase().replace(/\s+/g, '')) && regNumber.toUpperCase().replace(/\s+/g, '')) { existingVRN = true; }
            return null;
        });
        if (existingVRN) {
            setRegNumber('');
            setError(messages.sameVRNErrorMsg);
        } else { lookupVehicleByRegNumber(); }
    };

    return (
        <>
            <Row>
                <Col xs={12} className="car-info-card__body__reg-prompt">
                    <HDLabelRefactor
                        Tag="h3"
                        text={messages.tellRegNumber}
                        className="mt-lg-2" />
                    <Row>
                        <Col className="mx-md-3">
                            <HDQuoteInfoRefactor>
                                {messages.noRegInfoContent}
                            </HDQuoteInfoRefactor>
                        </Col>
                    </Row>
                    <Row className="car-info-card__body__reg-prompt__input-section">
                        <Col xs={12} md={8} className="px-0">
                            <HDTextInputRefactor
                                webAnalyticsEvent={{ event_action: messages.tellRegNumber }}
                                className="input-licence-plate input-group--on-white"
                                id="savings-search-input"
                                maxLength="8"
                                preText="GB"
                                value={regNumber}
                                type="alphanum"
                                onChange={handleRegNumberChange}
                                placeholder={messages.enterReg}
                                ref={inputRef} />
                        </Col>
                        <Col xs={12} md={4} className="px-0 pl-md-3 mt-3 mt-md-0">
                            <HDButtonRefactor
                                webAnalyticsEvent={{ event_action: `${messages.tellRegNumber} - button` }}
                                id="find-car-button"
                                label={messages.findCar}
                                variant="primary"
                                size="md"
                                onClick={checkVRNHandler}
                                className="theme-white btn-block" />
                        </Col>
                        {error && (
                            <Row>
                                <Col>
                                    <div className="invalid-field">
                                        <div className="message">
                                            {error}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <HDLabelRefactor
                                Tag="a"
                                text={messages.dontHaveReg}
                                className="car-info-card__body__reg-prompt__no-reg decorated-blue-line theme-white"
                                onClick={() => dontHaveRegHandler(phoneNumber)} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        showedNoRegModal: state.wizardState.app.showedNoRegModal,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setNavigation: (data) => dispatch(setNavigationAction(data)),
        setVehicleDetails: (data) => dispatch(setVehicleDetailsAction(data))
    };
};

HDSavingsPageVRNSearch.propTypes = {
    carInfo: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
    submissionVM: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func,
        location: PropTypes.object,
    }).isRequired,
    setVehicleDetails: PropTypes.func.isRequired,
    dontHaveRegHandler: PropTypes.func.isRequired,
    firstNonRegQuoteID: PropTypes.number.isRequired,
    showedNoRegModal: PropTypes.bool.isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.object
    }).isRequired,
};

HDSavingsPageVRNSearch.defaultProps = {

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDSavingsPageVRNSearch));
