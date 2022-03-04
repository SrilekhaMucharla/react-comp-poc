import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    HDAlertRefactor as HDAlert, HDCustomerReviewsWidget, HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import React, {
    useContext,
    useEffect,
    useState
} from 'react';
import { connect, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import lockIcon from '../../assets/images/icons/lock-icon.svg';
import mobileIcon from '../../assets/images/icons/youdrive-mobile-icon.png';
import loadReviewsBagde from '../../customer/directintegrations/reviews/reviews';
import {
    retrieveQuote as retrieveQuoteAction,
    setOfferedQuotesDetails,
    setSubmissionVM as setSubmissionVMAction,
    updateEpticaId as updateEpticaIdAction,
    updateEmailSaveProgress as updateEmailSaveProgressAction,
    setNavigation as setNavigationAction,
    setWizardPagesState as setWizardPagesStateAction,
    updateAncillaryJourney as updateAncillaryJourneyAction
} from '../../redux-thunk/actions';
import { CUSTOMISE_QUOTE } from '../../customer/directintegrations/faq/epticaMapping';
import { CUSTOMIZE_QUOTE_WIZARD } from '../../routes/BaseRouter/RouteConst';
import routes from '../../routes/WizardRouter/RouteConst';
import initialSubmission from '../../routes/SubmissionVMInitial';
import * as messages from './HastingsInterstitialPage.messages';
import { MOTOR_LEGAL } from '../../constant/const';
import HastingsInterstitialPageHelper from './HastingsInterstitialPageHelper';
import HastingsInterstitialRatingsWizardComponent from './HastingsInterstitialRatingsWizardComponent';
import { getPCWName } from '../wizard-pages/HDMotorLegal/HastingsPCWHelper';
import HDOfferSlideshow from './components/HDOfferSlideshow';
import { TranslatorContext } from '../../integration/TranslatorContext';
import { getQuoteDeclineErrors, selectedBrandHasDeclineError } from '../wizard-pages/__helpers__/policyErrorCheck';
import * as monetateHelper from '../../common/monetateHelper';
import customEventTracking from '../../web-analytics/customEventTracking';

function HastingsInterstitialPage(props) {
    const {
        location,
        dispatch,
        retrieveQuote,
        history,
        retrieveQuoteObject,
        setSubmissionVM,
        submissionVM,
        updateEpticaId,
        updateEmailSaveProgress,
        setNavigation,
        setWizardPageState,
        updateAncillaryJourney
    } = props;
    const [isShowInterstitial, setIsShowInterstitial] = useState(true);
    const [producerCode, setProducerCode] = useState(null);
    const [quoteStatus, setQuoteStatus] = useState(null);
    const [brand, setBrand] = useState(null);
    const [showMutiCar, setShowMultiCar] = useState(false);
    const [isFirstLoad, setFirstLoad] = useState(true);
    let paramvalues;
    const translator = useContext(TranslatorContext);
    const ancillaryJourneyModel = useSelector((state) => (state.ancillaryJourneyModel));
    const ancillaryJourneyContinueSelectionModel = useSelector((state) => (state.wizardState.app));
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const monetateLoaded = useSelector((state) => state.monetateModel.loading);
    const [cookies, setCookie] = useCookies(['']);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const pcwName = useSelector((state) => state.wizardState.app.pcwName);
    const slideshowItems = [(
        <div className="subtitle first-subtitle">
            <HDLabelRefactor
                id="page-interstitial-title-line-two"
                Tag="h2"
                text={messages.reasonOne} />
        </div>
    ), (
        <div className="subtitle second-subtitle">
            <HDLabelRefactor
                id="page-interstitial-title-line-two"
                Tag="h2"
                text={messages.reasonTwo} />
        </div>
    ), (
        <div className="subtitle third-subtitle">
            <HDLabelRefactor
                id="page-interstitial-title-line-two"
                Tag="h2"
                text={messages.reasonThree} />
        </div>
    )];

    useEffect(() => {
        let tempArray = []; let filteredArray = []; let nonFilteredArray = [];
        if (multiCarElements && multiCarElements !== undefined && _.isArray(multiCarElements)) {
            setShowMultiCar(monetateHelper.getMultiCarParams(multiCarElements));
            const reportingArray = monetateHelper.getReportingArray(multiCarElements);
            if (reportingArray && reportingArray.length) {
                reportingArray.forEach((element) => {
                    window.monetateEngineData.push(element);
                });
            }
            const seenParam = monetateHelper.getSeenParam(multiCarElements);
            let producerCodeArray = monetateHelper.fetchCookieByName('mc.producerCode') && monetateHelper.fetchCookieByName('mc.producerCode');
            if (!producerCodeArray.includes(pcwName)) {
                tempArray = cookies && cookies['mc.v'] && cookies['mc.v'].producerCodeSeenParamArray ? cookies['mc.v'].producerCodeSeenParamArray : [];
                producerCodeArray = producerCodeArray.concat(producerCodeArray.length && cookies['mc.producerCode'] ? `${`,${pcwName}`}` : `${pcwName}`);
                setCookie('mc.producerCode', producerCodeArray, {
                    path: '/'
                });
                tempArray.push({ producerCode: pcwName, seenMulticar: seenParam === undefined ? 'None' : seenParam.toString() });
            } else {
                filteredArray = cookies && cookies['mc.v']
                    && cookies['mc.v'].producerCodeSeenParamArray
                    && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode === pcwName);
                nonFilteredArray = cookies && cookies['mc.v']
                    && cookies['mc.v'].producerCodeSeenParamArray
                    && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode !== pcwName);
                if (filteredArray && filteredArray.length) {
                    filteredArray[0].producerCode = pcwName;
                    filteredArray[0].seenMulticar = (seenParam === undefined) ? 'None' : seenParam.toString();
                }
                tempArray = [...nonFilteredArray, ...filteredArray];
            }
            const pcSeenObj = {
                producerCodeSeenParamArray: tempArray
            };

            const val = { monetateId: cookies['mt.v'] ? cookies['mt.v'] : retrievedCookie, seenParam: seenParam && seenParam.toString(), ...pcSeenObj };
            const obj = JSON.stringify(val);
            setCookie('mc.v', obj, {
                path: '/'
            });
        }
        if (!cookies['mt.v'] && retrievedCookie) {
            setCookie('mt.v', retrievedCookie);
        }
    }, [multiCarElements]);

    useEffect(() => {
        if (_.has(location, 'search')) {
            dispatch(updateEpticaId(CUSTOMISE_QUOTE));
            paramvalues = location.search;
            const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
            HastingsInterstitialPageHelper.updatePreSelectedAncillaries(
                parsedParams.selectedAncillaries, ancillaryJourneyModel, ancillaryJourneyContinueSelectionModel
            );
            if (parsedParams.productBand === 'YD') {
                setIsShowInterstitial(false);
            }
            setProducerCode(parsedParams.producerCode);
            if (parsedParams.isLegalAnc) {
                dispatch(updateAncillaryJourney(MOTOR_LEGAL));
                dispatch(setNavigation({ pcwLegalChosen: true, showContinueOnML: true }));
            }
            if (parsedParams.productBand === 'HP') {
                dispatch(setNavigation({ pcwLegalChosen: true }));
            }
            if (parsedParams.isBreakDownAnc || parsedParams.productBand === 'HP') {
                dispatch(setNavigation({ pcwBreakdownChosen: true }));
            }
            setBrand(parsedParams.productBand);
            if (parsedParams.quoteID === 123456789) {
                setQuoteStatus(messages.PLEASE_CHECK_DATA);
            } else {
                dispatch(
                    retrieveQuote(parsedParams, translator),
                );
                dispatch(setNavigation({
                    isAppStartPoint: true,
                    isPCWJourney: true
                }));
            }
        }
    }, []);

    const viewModelService = useContext(ViewModelServiceContext);
    const [submissionVMCreated, setSubmissionVMCreated] = useState(false);
    if (viewModelService) {
        if (!submissionVMCreated) {
            dispatch(setSubmissionVM({
                submissionVM: viewModelService.create(
                    initialSubmission,
                    'pc',
                    'edgev10.capabilities.quote.submission.dto.QuoteDataDTO'
                ),
            }));
            setSubmissionVMCreated(true);
        }
    }

    useEffect(() => {
        setQuoteStatus(null);
        if (retrieveQuoteObject && (getQuoteDeclineErrors(retrieveQuoteObject.retrieveQuoteObj)
            || (brand && selectedBrandHasDeclineError(retrieveQuoteObject.retrieveQuoteObj, brand)))) {
            dispatch(setNavigation({ canSkip: false, canForward: true, showForward: true }));
            history.push({
                pathname: routes.QUOTE_DECLINE,
                state: { PCWJourney: true }
            });
        } else {
            if (retrieveQuoteObject && retrieveQuoteObject.retrieveQuoteError) {
                setQuoteStatus(messages.PLEASE_CHECK_DATA);
            }
            if (_.get(retrieveQuoteObject, 'retrieveQuoteObj') && Object.keys(retrieveQuoteObject.retrieveQuoteObj).length > 0) {
                if (_.has(location, 'search')
                    && retrieveQuoteObject
                    && retrieveQuoteObject.retrieveQuoteObj
                    && retrieveQuoteObject.retrieveQuoteObj.baseData
                    && retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus
                    && (retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus === messages.QUOTED)) {
                    paramvalues = location.search;
                    const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
                    HastingsInterstitialPageHelper.updatePreSelectedAncillaries(
                        parsedParams.selectedAncillaries, ancillaryJourneyModel, ancillaryJourneyContinueSelectionModel
                    );
                    let offeredQuotes = retrieveQuoteObject.retrieveQuoteObj.quoteData.offeredQuotes || [];
                    offeredQuotes = offeredQuotes || [];
                    const filteredOfferedQuotes = offeredQuotes.filter((offeredQuotesObj) => {
                        return offeredQuotesObj.branchCode === parsedParams.productBand;
                    });
                    dispatch(
                        setOfferedQuotesDetails(filteredOfferedQuotes),
                    );
                    _.set(submissionVM, 'value', retrieveQuoteObject.retrieveQuoteObj);


                    // create drivers states for wizard
                    const drivers = _.get(submissionVM.value, 'lobData.privateCar.coverables.drivers', []);
                    const driversState = [];
                    drivers.forEach(() => {
                        driversState.push({ licenceSuccessfulScanned: false, licenceSuccessfulValidated: true, licenceDataChanged: false });
                    });

                    const numberOfCarsOnHousehold = _.get(submissionVM, 'value.baseData.numberOfCarsOnHousehold');
                    const branchCode = _.get(submissionVM, 'value.baseData.brandCode');
                    dispatch(setWizardPageState({ drivers: driversState }));

                    dispatch(
                        updateEmailSaveProgress(_.get(submissionVM.value, 'baseData.accountHolder.emailAddress1')),
                    );
                    if (!monetateLoaded) {
                        if (numberOfCarsOnHousehold > 1 && branchCode !== messages.YD && showMutiCar) {
                            history.push({
                                pathname: routes.PROMOTION,
                                state: { PCWJourney: true, waMultiFlag: true }
                            });
                        } else {
                            history.push({
                                pathname: CUSTOMIZE_QUOTE_WIZARD,
                                state: { PCWJourney: true }
                            });
                        }
                    }
                } else {
                    setQuoteStatus(messages.PLEASE_CHECK_DATA);
                }
            }
        }
    }, [dispatch, retrieveQuoteObject, submissionVM, monetateLoaded]);

    const webAnalyticsErrorEvent = (data) => {
        if (isFirstLoad) {
            customEventTracking(data);
            setFirstLoad(false);
        }
    };

    const errorEventData = {
        element_id: 'interstitial-page',
        event_action: 'please_check_your_data',
        event_value: 'flyout_error_please_check_your_data',
        event_type: 'error_event',
        sales_journey_type: 'single_car',
        error_type: 'backend',
        error_message: 'please check your data'
    };

    const displayRetrieveError = () => {
        const quoteError = _.get(retrieveQuoteObject, 'retrieveQuoteError');
        const error = _.get(retrieveQuoteObject, 'retrieveQuoteError.error');
        const errorMessage = _.get(retrieveQuoteObject, 'retrieveQuoteError.error.message');
        if (quoteError && error && errorMessage) {
            return (<p className="error">{retrieveQuoteObject.retrieveQuoteError.error.message}</p>);
        }
        return null;
    };

    const displayCheckDataError = () => {
        if (retrieveQuoteObject
            && retrieveQuoteObject.retrieveQuoteObj
            && retrieveQuoteObject.retrieveQuoteObj.baseData
            && retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus
            && (retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus === 'Expired')) {
            return (<HDAlert className="interstitial-page-alert" message={messages.PLEASE_CHECK_DATA} />);
        }
        return null;
    };

    const displayQuoteStatus = () => {
        if (quoteStatus !== null) {
            webAnalyticsErrorEvent({ ...errorEventData, event_label: quoteStatus });
            return (<HDAlert className="interstitial-page-alert" message={quoteStatus} />);
        }
        return null;
    };

    return (
        <div className="page-content-wrapper background-body interstitial-page-container car-bg-outer transparent-footer">
            <Container>
                <Row>
                    <Col>
                        {displayRetrieveError()}
                        {displayQuoteStatus()}
                        {displayCheckDataError()}
                    </Col>
                </Row>
                <Row className="margin-top-lg">
                    {isShowInterstitial ? (
                        <Col xs={12} md={6} lg={6}>
                            <Row>
                                <Col>
                                    <HDLabelRefactor
                                        id="page-interstitial-title"
                                        Tag="h1"
                                        className="mb-0"
                                        text={messages.hi} />
                                    <HDLabelRefactor
                                        id="page-interstitial-title-line-two"
                                        Tag="h1"
                                        text={messages.welcome} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="interstitial-subtitle">
                                        <HDOfferSlideshow items={slideshowItems} interval={4000} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    ) : (
                        <Col xs={12} md={6} lg={6}>
                            <Row>
                                <Col>
                                    <HDLabelRefactor
                                        id="page-youdrive-title"
                                        Tag="h1"
                                        text={messages.youdriveHi} />
                                </Col>
                            </Row>
                            <Row className="margin-top-lg">
                                <Col xs={8}>
                                    <HDLabelRefactor
                                        id="page-youdrive-cta"
                                        Tag="p"
                                        text={messages.youdriveContent} />
                                </Col>
                                <Col xs={4}>
                                    <img src={mobileIcon} className="img-fluid" alt="mobileIcon" />
                                </Col>
                            </Row>
                        </Col>
                    )}
                    <Col sm={{ span: 12, offset: 0 }} md={{ span: 6, offset: 0 }} lg={{ span: 5, offset: 1 }} className="margin-top-mobile-lg">
                        <div className="info-box">
                            <div className="info-box-title pr-0 pl-0 pb-4">
                                <Row className="no-gutters pr-4 pl-4">
                                    <Col className="text-center">
                                        {producerCode && producerCode !== 'Default' && producerCode !== 'ClearScore'
                                            && (
                                                <HDLabelRefactor
                                                    className="page-interstitial-info-box-title"
                                                    id="page-interstitial-info-box-title"
                                                    Tag="p"
                                                    text={`${messages.wizardHeader} ${getPCWName(producerCode)}`} />
                                            )
                                        }
                                    </Col>
                                </Row>
                                <Row className="margin-top-md margin-bottom-md">
                                    <Col>
                                        <div className="interstitial-progress-bar">
                                            <div className="line-progress">
                                                <div className="animated-progress animated-progress1" />
                                            </div>
                                            <div className="circle-progress circle-progress1">
                                                <i className="fa fa-check" />
                                            </div>
                                            <div className="line-progress">
                                                <div className="animated-progress animated-progress2" />
                                            </div>
                                            <div className="circle-progress circle-progress2">
                                                <i className="fa fa-check" />
                                            </div>
                                            <div className="line-progress">
                                                <div className="animated-progress animated-progress3" />
                                            </div>
                                            <div className="circle-progress circle-progress3">
                                                <i className="fa fa-check" />
                                            </div>
                                        </div>
                                        <div className="interstitial-details interstitial-progress-bar">
                                            <div className="progress-details vehicle-details">
                                                <span>{messages.cardetails}</span>
                                            </div>
                                            <div className="progress-details cover-details">
                                                <span>{messages.personaldetails}</span>
                                            </div>
                                            <div className="progress-details personal-details">
                                                <span>{messages.coverdetails}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="margin-top-md no-gutters pr-4 pl-4">
                                    <Col className="align-content-center">
                                        <p className="secure-safe-info">
                                            <img src={lockIcon} alt="lock icon" />
                                            {' '}
                                            {messages.safeinfo}
                                        </p>
                                    </Col>
                                </Row>
                                {isShowInterstitial && (
                                    <Row className="margin-top-md no-gutters pr-4 pl-4">
                                        <Col>
                                            <HastingsInterstitialRatingsWizardComponent brand={brand} />
                                        </Col>
                                    </Row>
                                )}
                            </div>
                            <div className="info-box-description">
                                <Row>
                                    <Col>
                                        <HDCustomerReviewsWidget onLoadReviewsBagde={loadReviewsBagde} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="car-bg" />
        </div>
    );
}

const mapStateToProps = (state) => ({
    retrieveQuoteObject: state.retrieveQuoteModel,
    submissionVM: state.wizardState.data.submissionVM,
});

const mapDispatchToProps = (dispatch) => ({
    retrieveQuote: retrieveQuoteAction,
    setSubmissionVM: setSubmissionVMAction,
    updateEpticaId: updateEpticaIdAction,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
    setNavigation: setNavigationAction,
    setOfferedQuotesDetails,
    dispatch,
    setWizardPageState: setWizardPagesStateAction,
    updateAncillaryJourney: updateAncillaryJourneyAction
});
HastingsInterstitialPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    retrieveQuote: PropTypes.func.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    updateEmailSaveProgress: PropTypes.func.isRequired,
    retrieveQuoteObject: PropTypes.shape({
        retrieveQuoteObj: PropTypes.shape({
            quoteData: PropTypes.shape({
                offeredQuotes: PropTypes.array
            }),
            bindData: PropTypes.shape({}),
            lobData: PropTypes.shape({}),
            quoteID: PropTypes.string,
            sessionUUID: PropTypes.string,
            baseData: PropTypes.shape({
                periodStatus: PropTypes.string,
            }),
        }),
        retrieveQuoteError: PropTypes.shape({
            error: PropTypes.shape({
                message: PropTypes.string,
            }),
        }),
    }).isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired,
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired,
    setWizardPageState: PropTypes.func.isRequired,
    updateAncillaryJourney: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsInterstitialPage);
