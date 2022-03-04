/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    HDForm, HDInfoCardRefactor, HDCustomerReviews, HDLabelRefactor
} from 'hastings-components';
import * as yup from 'hastings-components/yup';
import { Row, Col, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, {
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import { deployment } from 'app-config';
import submission from '../../routes/SubmissionVMInitial';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import loadReviewsBagde from '../../customer/directintegrations/reviews/reviews';
import { VEHICLE_DETAILS_GENERIC } from '../../customer/directintegrations/faq/epticaMapping';
import {
    AnalyticsHDButton as HDButtonRefactor,
    AnalyticsHDTextInput as HDTextInputRefactor,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../web-analytics';
import { HastingsVehicleInfoLookupService } from '../../../../../common/capabilities/hastings-capability-vehicleinfolookup';

import {
    setNavigation as setNavigationAction,
    setVehicleDetails as setVehicleDetailsAction,
    updateEpticaId as updateEpticaIdAction,
    setBackNavigationFlag as setBackNavigationFlagAction,
    setSubmissionVM,
    clearUpdateQuoteData,
    clearUpdateMultiQuoteData,
    clearCreatedSubmission,
    setErrorStatusCode
} from '../../redux-thunk/actions';
import {
    BASENAME, INTRO, WIZARD_INITIAL_ROUTE, ABOUT_MC_COVER
} from '../../routes/BaseRouter/RouteConst';
import wizardRoutes from '../../routes/WizardRouter/RouteConst';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import HDSearchVehiclePage from '../HDSearchVehiclePage/HDSearchVehiclePage';
import * as messages from './HDVRNSearch.messages';
import * as monetateHelper from '../../common/monetateHelper';
import TipCirclePurple from '../../assets/images/icons/tip_circle_purple.svg';
import backIcon from '../../assets/images/icons/back-icon.svg';
import { displayHeaderMassage, getMultiToSingleParam } from '../../common/utils';
import useScrollToTop from '../../routes/common/useScrollToTop';
import HDQuoteService from '../../api/HDQuoteService';
import mcsubmission from '../../routes/MCSubmissionVMInitial';
import {
    multiToSingle, multiToSingleFailed
} from '../HDMCIntroPage/HDMCIntroPage.messages';
import { trackView } from '../../web-analytics/trackData';

const HDVRNSearchPage = (props) => {
    const {
        setNavigation,
        setVehicleDetails,
        pageMetadata,
        setBackNavigationFlag,
        updateEpticaId,
        history,
        submissionVM,
        mcsubmissionVM,
        multiCarFlag,
        singleToMultiJourney,
        softSellJourney
    } = props;
    const pageID = 'HDVRNSearchPage';
    const viewModelService = useContext(ViewModelServiceContext);
    const [invalidEntry, setInvalidEntry] = useState(false);
    const [showMutiCar, setShowMultiCar] = useState(false);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const [isDuplicateCar, setDuplicateCar] = useState(false);
    const [isBikeReg, setIsBikeReg] = useState(false);
    const [invalidEntryMessage, setInvalidEntryMessage] = useState(messages.invalidRegNo);
    const [resetVRN, setVrn] = useState(true);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const messageTip = (multiCarFlag) ? messages.tipBodyMC : messages.tipBody;
    const [quoteLength, setQuoteLength] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);

    const getJourneyType = () => {
        return (multiCarFlag) ? 'multi_car' : 'single_car';
    };

    if (!isLoaded) {
        setIsLoaded(true);
        trackView({
            ...pageMetadata,
            page_section: 'Page',
            sales_journey_type: getJourneyType()
        });
    }

    useScrollToTop(location.pathname);
    useEffect(() => {
        setBackNavigationFlag({ data: true });
        updateEpticaId(VEHICLE_DETAILS_GENERIC);
        setNavigation({ isAppStartPoint: true });
        window.scroll(0, 0);
    }, []);

    useEffect(() => {
        setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
    }, [multiCarElements]);
    useEffect(() => {
        const getResetSubmissionFlag = _.get(history, 'location.state.resetSubmission', false);
        if (getResetSubmissionFlag) {
            _.set(submissionVM, 'value', submission);
            dispatch(setSubmissionVM({ submissionVM: submissionVM }));
            dispatch(clearCreatedSubmission());
            dispatch(clearUpdateQuoteData());
            dispatch(clearUpdateMultiQuoteData());
        }
    }, [history]);

    useEffect(() => {
        setQuoteLength(
            (mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes
            && mcsubmissionVM.value.quotes.length > 0)
                ? mcsubmissionVM.value.quotes.length
                : 0
        );
    }, [quoteLength]);

    const loadVehicleDetails = (regNo, vehicleInfo) => {
        // eslint-disable-next-line no-param-reassign
        vehicleInfo.result.regNo = regNo;
        setVehicleDetails({ data: vehicleInfo.result });
        // eslint-disable-next-line react/prop-types
        props.history.push(WIZARD_INITIAL_ROUTE);
    };
    const handleLookUp = (vehicleData) => {
        setVehicleDetails({ data: vehicleData });

        props.history.push(WIZARD_INITIAL_ROUTE);
    };
    const registrationReqVM = useMemo(() => {
        return viewModelService.create({}, 'pc', 'com.hastings.edgev10.capabilities.vehicleinfo.dto.request.RegistrationReqDTO');
    }, []);
    const registrationPath = registrationReqVM.registrationNumber;
    const regNumber = 'registrationNumber';

    const getVRN = () => {
        let regNo = '';
        if (registrationPath.value) {
            regNo = (registrationPath.value.toUpperCase()).replace(/\s+/g, '');
            _.set(registrationPath, 'value', regNo);
        }
        if (!regNo || regNo === '') {
            setInvalidEntryMessage(messages.invalidInput);
            setInvalidEntry(true);
            return;
        }
        if (isDuplicateCar) {
            return;
        }
        if (!registrationPath.aspects.valid) {
            if (regNo === '') {
                setInvalidEntryMessage(messages.invalidInput);
                setInvalidEntry(true);
            } else {
                setInvalidEntryMessage(messages.invalidVRNEntry);
                setInvalidEntry(true);
            }
            return;
        }
        const dataObject = [{ registrationNumber: regNo }];
        showLoader();
        HastingsVehicleInfoLookupService.retrieveVehicleDataBasedOnVRN(dataObject)
            .then((vehicleInfo) => {
                if ((!vehicleInfo.result && !vehicleInfo.result.abiCode) || vehicleInfo.result.type === undefined) {
                    setVrn(true);
                    setInvalidEntryMessage(messages.invalidVRNEntry);
                    setInvalidEntry(true);
                    trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.invalidVRNEntry);
                } else if (vehicleInfo.result.type === messages.motorcycleExt) {
                    setInvalidEntryMessage((multiCarFlag) ? messages.bikeRegInMC : messages.bikeReg);
                    setInvalidEntry(true);
                    setIsBikeReg(true);
                    trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.incorrectVRNBike);
                } else {
                    // Data retrieved without any errors
                    loadVehicleDetails(regNo, vehicleInfo);
                    trackAPICallSuccess(messages.retrieveVehicleDataBasedOnVRN);
                }
            })
            .catch(() => {
                setInvalidEntryMessage(messages.systemError);
                setInvalidEntry(true);
                trackAPICallFail(messages.retrieveVehicleDataBasedOnVRN, messages.notFoundVRN);
            })
            .finally(() => {
                hideLoader();
            });
    };

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid });
    };

    const handleChange = (event) => {
        const getmcsubmissionVMQuote = _.get(mcsubmissionVM, 'value.quotes', []);
        if (getmcsubmissionVMQuote.length) {
            getmcsubmissionVMQuote.some((data) => {
                const registrationNumber = _.get(data, 'lobData.privateCar.coverables.vehicles[0].registrationsNumber', '');
                const inputValue = event.target.value;
                if (registrationNumber === inputValue.toUpperCase().replace(/\s+/g, '')) {
                    setDuplicateCar(true);
                    setVrn(false);
                    setInvalidEntry(true);
                    setInvalidEntryMessage(messages.duplicateCar);
                    setIsBikeReg(false);
                    return true;
                } else {
                    setDuplicateCar(false);
                    setVrn(false);
                    setInvalidEntry(false);
                    setIsBikeReg(false);
                    return false;
                }
            });
        } else {
            setDuplicateCar(false);
            setVrn(false);
            setInvalidEntry(false);
            setIsBikeReg(false);
        }
    };

    const handleEnter = (event) => {
        if (event.which === 13) {
            getVRN();
        }
    };

    const tooltipOverlay = (id) => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.acceptancecriteriaprefix }}
            webAnalyticsEvent={{ event_action: messages.acceptancecriteriaprefix }}
            id={id}
            labelText={messages.overlayHeader}
            overlayButtonIcon={(
                <p>
                    {messages.acceptancecriteriaprefix}
                    <a>{messages.acceptancecriteria}</a>
                </p>
            )}
        >
            <div className="acceptance-criteria-overlay-container">
                <HDLabelRefactor id="page-vrn-overlay-title1" Tag="p" text={messages.overlayBodyTitle1} />
                <ul>
                    {[
                        messages.overlayBodyLiseElementa,
                        messages.overlayBodyLiseElementb,
                        messages.overlayBodyLiseElementc,
                        messages.overlayBodyLiseElementd,
                        messages.overlayBodyLiseElemente,
                        messages.overlayBodyLiseElementf,
                        messages.overlayBodyLiseElementg,
                        messages.overlayBodyLiseElementh,
                        // eslint-disable-next-line react/no-array-index-key
                    ].map((el, index) => (<li key={index}><span>{el}</span></li>))}
                </ul>
                <HDLabelRefactor id="page-vrn-overlay-title2" Tag="p" text={messages.overlayBodyTitle2} />
                <ol>
                    {[
                        messages.overlayBodyListElementPart2a,
                        messages.overlayBodyListElementPart2b,
                        messages.overlayBodyListElementPart2c,
                        // eslint-disable-next-line react/no-array-index-key
                    ].map((el, index) => (<li key={index}><span>{el}</span></li>))}
                </ol>
                <HDLabelRefactor id="page-vrn-overlay-title3" Tag="p" text={messages.overlayBodyTitle3} />
            </div>
        </HDOverlayPopup>
    );

    const validationSchema = yup.object({
        [regNumber]: yup.string()
    });

    const multiToSingleHandler = (pathNav) => {
        showLoader();
        HDQuoteService.multiToSingleQuote(getMultiToSingleParam(mcsubmissionVM))
            .then(({ result }) => {
                _.set(submissionVM, 'value', result);
                dispatch(setNavigation({ quoteID: result.quoteID, sessionUUID: result.sessionUUID, softSellJourney: false }));
                _.set(mcsubmissionVM, 'value', _.cloneDeep(mcsubmission));
                hideLoader();
                history.push({
                    pathname: pathNav
                });
                trackAPICallSuccess(multiToSingle);
            }).catch((error) => {
                hideLoader();
                dispatch(setErrorStatusCode(error.status));
                history.push({
                    pathname: INTRO
                });
                trackAPICallFail(multiToSingle, multiToSingleFailed);
            });
    };

    // eslint-disable-next-line consistent-return
    const handleBackNavigation = () => {
        if (singleToMultiJourney && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length === 1) {
            return history.push({
                pathname: ABOUT_MC_COVER
            });
        }
        if (!singleToMultiJourney && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length === 1) {
            const pathNav = wizardRoutes.MC_DRIVER_ALLOCATION;
            return multiToSingleHandler(pathNav);
        }
        if (mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length > 1) {
            return history.push({
                pathname: wizardRoutes.MC_MILESTONE,
                state: {
                    fromPage: history.location.pathname
                }
            });
        }
        const fromPageVal = _.get(history, 'location.state.fromPage', false);
        if (fromPageVal) {
            history.push({
                pathname: fromPageVal
            });
        } else {
            history.push({
                pathname: INTRO
            });
        }
    };

    const checkSingleToMultiHideBack = () => {
        const quotesArray = _.get(mcsubmissionVM, 'value.quotes', []);
        if (quotesArray.length === 0) {
            if (softSellJourney) { dispatch(setNavigation({ softSellJourney: false })); }
            return false;
        }
        if (quotesArray.length !== 0 && softSellJourney) {
            return true;
        }
        return false;
    };

    return (
        <div className={`page-content-wrapper background-body vrn-search-page-wrapper transparent-footer car-bg-outer${invalidEntry ? ' invalid' : ''}`}>
            <Container>
                <Row>
                    <Col>
                        {/* Added this because we need multi to single api call in some scenario */}
                        {!checkSingleToMultiHideBack() && (
                            <HDButtonRefactor
                                webAnalyticsEvent={{ event_action: messages.goBack, sales_journey_type: getJourneyType() }}
                                id="backNavMain"
                                name="go-back"
                                className="go-back margin-bottom-md"
                                variant="default"
                                label={messages.goBack}
                                onClick={handleBackNavigation}
                            >
                                <img className="back-icon" src={backIcon} alt="Back" />
                            </HDButtonRefactor>
                        )}
                    </Col>
                </Row>
                <Row className="margin-top-lg">
                    <Col xs={12} md={12} lg={6}>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="page-vrn-title"
                                    Tag="h1"
                                    text={(multiCarFlag) ? displayHeaderMassage(messages.headerMessageMC, quoteLength) : messages.headerMessage} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8}>
                                <HDForm validationSchema={validationSchema} submissionVM={registrationReqVM} onValidation={handleValidation}>
                                    <HDTextInputRefactor
                                        webAnalyticsEvent={{
                                            event_action: messages.carDetails,
                                            event_value: messages.enterRegNumber,
                                            sales_journey_type: getJourneyType()
                                        }}
                                        className="input-licence-plate"
                                        id="page-vrn-search-input"
                                        path={regNumber}
                                        name={regNumber}
                                        maxLength="8"
                                        preText="GB"
                                        reset={resetVRN}
                                        type="alphanum"
                                        onChange={(e) => handleChange(e)}
                                        placeholder={messages.inputPlaceholder}
                                        isInvalidCustom={invalidEntry}
                                        onKeyPress={(e) => handleEnter(e)} />
                                </HDForm>
                            </Col>
                        </Row>
                        {invalidEntry && (
                            <Row>
                                <Col>
                                    <div className="invalid-field margin-top-lg margin-top-lg-mobile mb-0">
                                        <div className="message">
                                            {invalidEntryMessage}
                                            {isBikeReg && !multiCarFlag && <a href={messages.bikeUrl}>{messages.switchBike}</a>}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row className="margin-top-lg margin-top-lg-mobile">
                            <Col>
                                <HDButtonRefactor
                                    webAnalyticsEvent={{
                                        event_action: messages.findCarBtnText,
                                        sales_journey_type: getJourneyType()
                                    }}
                                    id="page-vrn-get-button"
                                    label={messages.findCarBtnText}
                                    variant="primary"
                                    onClick={() => { getVRN(); }} />
                            </Col>
                        </Row>
                        <Row className="margin-top-lg">
                            <Col>
                                <HDSearchVehiclePage
                                    pageMetadata={pageMetadata}
                                    onConfirm={handleLookUp}
                                    trigger={(
                                        <a id="page-vrn-make-model-link" parent={pageID}>
                                            {messages.findMakeModelBtnText}
                                        </a>
                                    )}
                                    {...props} />
                            </Col>
                        </Row>
                        <Row className="margin-top-lg">
                            <Col>
                                <HDInfoCardRefactor id="page-vrn-info-card" image={TipCirclePurple} paragraphs={[messageTip]} />
                            </Col>
                        </Row>
                        <Row className="margin-top-lg">
                            <Col>
                                <HDLabelRefactor Tag="p" icon={tooltipOverlay('page-vrn-acceptance-criteria-link')} />
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={{ span: 12, offset: 0 }} md={{ span: 12, offset: 0 }} lg={{ span: 5, offset: 1 }} className="margin-top-mobile-lg">
                        {showMutiCar && <HDCustomerReviews id="page-vrn-customer-review" onLoadReviewsBagde={loadReviewsBagde} /> }
                    </Col>
                </Row>
            </Container>
            <div className="car-bg" />
            {HDFullscreenLoader}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        multiCarFlag: state.wizardState.app.multiCarFlag,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        singleToMultiJourney: state.wizardState.app.singleToMultiJourney,
        softSellJourney: state.wizardState.app.softSellJourney
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setVehicleDetails: setVehicleDetailsAction,
    setBackNavigationFlag: setBackNavigationFlagAction,
    updateEpticaId: updateEpticaIdAction,
    setSubmissionVM,
    clearUpdateQuoteData,
    clearUpdateMultiQuoteData,
    clearCreatedSubmission
};

HDVRNSearchPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func,
        location: PropTypes.object,
    }).isRequired,
    setVehicleDetails: PropTypes.func.isRequired,
    setBackNavigationFlag: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    multiCarFlag: PropTypes.bool.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    mcsubmissionVM: PropTypes.shape({
        value: PropTypes.shape({
            quotes: PropTypes.shape([])
        })
    }),
    singleToMultiJourney: PropTypes.bool,
    softSellJourney: PropTypes.bool
};

HDVRNSearchPage.defaultProps = {
    mcsubmissionVM: null,
    singleToMultiJourney: null,
    softSellJourney: false
};

export default connect(mapStateToProps, mapDispatchToProps)(HDVRNSearchPage);
