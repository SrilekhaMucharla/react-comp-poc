/* eslint-disable react/prop-types */
import React, {
    useState, useEffect, useContext, useRef
} from 'react';
import {
    HDLabelRefactor,
    HDInfoCardRefactor,
} from 'hastings-components';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDModal as HDModal
} from '../../web-analytics';
import * as messages from './HastingsDOBInterstititalPage.messages';
import { HOMEPAGE, OPENING_HOURS } from '../../constant/const';
import HastingsInterstitialPageHelper from '../HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import TipCirclePurple from '../../assets/images/icons/tip_circle_purple.svg';
import {
    setOfferedQuotesDetails,
    retrieveSubmission as retrieveQuoteAction,
    setSubmissionVM as setSubmissionVMAction,
    createQuote,
    updateEmailSaveProgress as updateEmailSaveProgressAction,
    setErrorStatusCode as setErrorStatusCodeAction,
    setNavigation as setNavigationAction,
    setWizardPagesState as setWizardPagesStateAction
} from '../../redux-thunk/actions';
import {
    CUSTOMIZE_QUOTE_WIZARD,
    POLICY_START_DATE,
    YOUR_QUOTES,
    ADD_ANOTHER_DRIVER,
    ROOT,
    INTRO
} from '../../routes/BaseRouter/RouteConst';
import initialSubmission from '../../routes/SubmissionVMInitial';
import HastingsUpdateInceptionDate from './HastingsUpdateInceptionDate';
import { TranslatorContext } from '../../integration/TranslatorContext';
import wizardRouterRoutes from '../../routes/WizardRouter/RouteConst';
import * as monetateHelper from '../../common/monetateHelper';

const HastingsDOBInterstitialPage = (props) => {
    const {
        location,
        history,
        dispatch,
        retrieveQuote,
        retrieveQuoteObject,
        submissionVM,
        setSubmissionVM,
        lwrQuoteObject,
        updateEmailSaveProgress,
        setErrorStatusCode,
        setNavigation,
        setWizardPageState
    } = props;
    const [errorFlag, setErrorFlag] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [navigationPage, setNavigationPage] = useState('');
    const [isPurged, setPurged] = useState(false);
    const [submissionNotFound, setSubmissionNotFound] = useState(false);
    const [email, setEmail] = useState('');
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const monthInputRef = useRef();
    const yearInputRef = useRef();
    let paramvalues;
    const translator = useContext(TranslatorContext);
    const ancillaryJourneyModel = useSelector((state) => (state.ancillaryJourneyModel));
    const ancillaryJourneyContinueSelectionModel = useSelector((state) => (state.wizardState.app));
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const [cookies, setCookie] = useCookies(['']);
    const pcwName = useSelector((state) => state.wizardState.app.pcwName);
    const isValidDate = (genDate) => {
        const monthTemp = month - 1;
        // eslint-disable-next-line eqeqeq
        if (genDate.getFullYear() == year && genDate.getMonth() == monthTemp && genDate.getDate() == day) {
            return true;
        }
        return false;
    };

    const navigateToQuote = () => {
        history.push({
            pathname: INTRO,
            state: { SaveAndReturn: false }
        });
    };

    const navigateToHome = () => {
        window.location.assign(HOMEPAGE);
    };

    useEffect(() => {
        dispatch(setNavigation({ isAppStartPoint: true }));
    }, []);
    useEffect(() => {
        let tempArray = []; let filteredArray = []; let nonFilteredArray = [];
        if (multiCarElements && multiCarElements !== undefined && _.isArray(multiCarElements)) {
            const reportingArray = monetateHelper.getReportingArray(multiCarElements);
            if (reportingArray && reportingArray.length) {
                reportingArray.map((element) => {
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
                filteredArray = cookies['mc.v'].producerCodeSeenParamArray
                && cookies['mc.v'].producerCodeSeenParamArray.filter((element) => element.producerCode === pcwName);
                nonFilteredArray = cookies['mc.v'].producerCodeSeenParamArray
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
            if (!cookies['mt.v'] && retrievedCookie) {
                setCookie('mt.v', retrievedCookie, {
                    path: '/'
                });
            }
            const obj = JSON.stringify(val);
            setCookie('mc.v', obj, {
                path: '/'
            });
        }
    }, [multiCarElements]);

    const navigationRoute = (page) => {
        dispatch(
            updateEmailSaveProgress(_.get(submissionVM.value, 'baseData.accountHolder.emailAddress1'))
        );
        switch (page) {
            case messages.multicarDriverAllocationPage:
                history.push({
                    pathname: wizardRouterRoutes.MC_DRIVER_ALLOCATION,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.milestonePage:
            case messages.addAnotherDriverPage: history.push({
                pathname: ADD_ANOTHER_DRIVER,
                state: { SaveAndReturn: true }
            });
                break;
            case messages.policyInfoPage: history.push({
                pathname: POLICY_START_DATE,
                state: { SaveAndReturn: true }
            });
                break;
            case messages.coverSummaryPage: history.push({
                pathname: YOUR_QUOTES,
                state: { SaveAndReturn: true }
            });
                break;
            case messages.customizeQuoteSummaryPage: history.push({
                pathname: CUSTOMIZE_QUOTE_WIZARD,
                state: { SaveAndReturn: true }
            });
                break;
            default: history.push({
                pathname: ROOT,
                state: { SaveAndReturn: true }
            });
                break;
        }
    };

    const updateInceptionDate = (newDay, newMonth, newYear) => {
        setShowModal(false);
        showLoader();
        // eslint-disable-next-line no-unused-vars
        const inceptionDate = {
            day: parseInt(newDay, 10),
            month: newMonth - 1,
            year: parseInt(newYear, 10)
        };
        _.set(submissionVM, 'baseData.periodStartDate.value', inceptionDate);
        dispatch(createQuote(submissionVM, translator));
    };

    useEffect(() => {
        hideLoader();
        if (lwrQuoteObject && lwrQuoteObject.baseData) {
            _.set(submissionVM, 'value', lwrQuoteObject);
            navigationRoute(navigationPage);
        }
    }, [lwrQuoteObject, dispatch]);

    const retreiveQuoteCall = () => {
        if (_.has(location, 'search')) {
            showLoader();
            paramvalues = location.search;
            let parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
            HastingsInterstitialPageHelper.updatePreSelectedAncillaries(parsedParams.selectedAncillaries, ancillaryJourneyModel, ancillaryJourneyContinueSelectionModel);
            const dateOfBirth = {
                day: day,
                month: month - 1,
                year: year
            };
            parsedParams = {
                ...parsedParams,
                dateOfBirth
            };
            if (parsedParams.email) {
                setEmail(parsedParams.email);
            }
            dispatch(
                retrieveQuote(parsedParams, translator),
            );
        }
    };

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
        if (retrieveQuoteObject && !retrieveQuoteObject.loading && retrieveQuoteObject.retrieveQuoteError) {
            hideLoader();
            // invalid dob
            if (retrieveQuoteObject.retrieveQuoteError.error
                && retrieveQuoteObject.retrieveQuoteError.error.data
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode === 807) {
                setErrorFlag(true);
            } else if (retrieveQuoteObject.retrieveQuoteError.error
                && retrieveQuoteObject.retrieveQuoteError.error.data
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode === 809) {
                setPurged(true);
            } else if (retrieveQuoteObject.retrieveQuoteError.error
                && retrieveQuoteObject.retrieveQuoteError.error.data
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode
                && retrieveQuoteObject.retrieveQuoteError.error.data.appErrorCode === 603) {
                setSubmissionNotFound(true);
            } else {
                setErrorFlag(true);
            }
        }
        if (_.get(retrieveQuoteObject, 'retrieveQuoteObj') && Object.keys(retrieveQuoteObject.retrieveQuoteObj).length > 0) {
            if (_.has(location, 'search')
                && retrieveQuoteObject
                && retrieveQuoteObject.retrieveQuoteObj
                && retrieveQuoteObject.retrieveQuoteObj.baseData) {
                hideLoader();
                setErrorFlag(false);
                paramvalues = location.search;
                const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
                HastingsInterstitialPageHelper.updatePreSelectedAncillaries(parsedParams.selectedAncillaries, ancillaryJourneyModel, ancillaryJourneyContinueSelectionModel);
                if (retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus === messages.BOUND) {
                    dispatch(setErrorStatusCode(503));
                } else {
                    setNavigationPage(parsedParams.page);
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
                    drivers.forEach((driver) => {
                        driversState.push({ licenceSuccessfulScanned: false, licenceSuccessfulValidated: false, licenceDataChanged: false });
                    });

                    dispatch(setWizardPageState({ drivers: driversState }));

                    let isNavigate = false;
                    if (retrieveQuoteObject.retrieveQuoteObj.errorsAndWarnings && retrieveQuoteObject.retrieveQuoteObj.errorsAndWarnings.retrieveErrorFlag) {
                        if (retrieveQuoteObject.retrieveQuoteObj.baseData.periodStatus === messages.DRAFT) {
                            isNavigate = true;
                        } else {
                            setShowModal(true);
                            isNavigate = false;
                        }
                    } else {
                        isNavigate = true;
                    }
                    if (isNavigate) {
                        navigationRoute(parsedParams.page);
                    }
                }
            } else {
                hideLoader();
                setErrorFlag(true);
            }
        }
    }, [dispatch, retrieveQuoteObject, submissionVM]);

    const handleContinueTriggerButton = () => {
        if (day !== '' && month !== '' && year !== ''
            && year.length === 4
            && month < 13
            && day < 32) {
            const genDate = new Date(year, month - 1, day);
            if (isValidDate(genDate)) {
                setErrorFlag(false);
                retreiveQuoteCall();
            } else {
                setErrorFlag(true);
            }
        } else {
            setErrorFlag(true);
        }
    };

    const handleDayBlur = ({ target: { value } }) => {
        if (value) {
            setDay(String(value).padStart(2, '0'));
        }
    };

    const handleMonthBlur = ({ target: { value } }) => {
        if (value) {
            setMonth(String(value).padStart(2, '0'));
        }
    };

    const handleDayChange = ({ target: { value } }) => {
        setDay(value);
        if (value.length === 2) monthInputRef.current.focus();
    };

    const handleMonthChange = ({ target: { value } }) => {
        setMonth(value);
        if (value.length === 2) yearInputRef.current.focus();
    };

    const handleYearChange = ({ target: { value } }) => {
        setYear(value);
    };

    const handleFocus = (event) => event.target.select();

    return (
        <Container fluid className="WizardBaseRouterContainer page-content-wrapper background-body dob-interstitial-container">
            <Container className="container--get-a-price">
                <Row>
                    {!isPurged && !submissionNotFound && (
                        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <HDLabelRefactor
                                id="dob-interstitial-date-header"
                                className="dob-interstitial__date-header"
                                text={messages.header}
                                Tag="h2" />
                            <Row>
                                <Col xs={12} md={9} xl={8} className="col-xxl-7">
                                    <Row className="dob-interstitial__date-input-row">
                                        <Col xs={3} className="dob-interstitial__date-input-col">
                                            <HDTextInput
                                                id="day-input"
                                                webAnalyticsEvent={{ event_action: messages.header }}
                                                type="numberOnly"
                                                inputMode="numeric"
                                                placeholder="DD"
                                                value={day}
                                                onChange={handleDayChange}
                                                onBlur={handleDayBlur}
                                                onFocus={handleFocus}
                                                maxLength="2"
                                                allowLeadingZero
                                                className="dob-interstitial__date-input"
                                                isInvalidCustom={errorFlag} />
                                        </Col>
                                        <Col xs={3} className="dob-interstitial__date-input-col">
                                            <HDTextInput
                                                id="month-input"
                                                webAnalyticsEvent={{ event_action: messages.header }}
                                                type="numberOnly"
                                                inputMode="numeric"
                                                placeholder="MM"
                                                value={month}
                                                ref={monthInputRef}
                                                onChange={handleMonthChange}
                                                onBlur={handleMonthBlur}
                                                onFocus={handleFocus}
                                                maxLength="2"
                                                allowLeadingZero
                                                className="dob-interstitial__date-input"
                                                isInvalidCustom={errorFlag} />
                                        </Col>
                                        <Col xs={6} className="dob-interstitial__date-input-col">
                                            <HDTextInput
                                                id="year-input"
                                                webAnalyticsEvent={{ event_action: messages.header }}
                                                type="numberOnly"
                                                inputMode="numeric"
                                                value={year}
                                                ref={yearInputRef}
                                                onChange={handleYearChange}
                                                onFocus={handleFocus}
                                                placeholder="YYYY"
                                                maxLength="4"
                                                className="dob-interstitial__date-input"
                                                isInvalidCustom={errorFlag} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {errorFlag && (
                                <div className="invalid-field dob-interstitial__invalid-field">
                                    <div className="message">
                                        {messages.invalidDate}
                                    </div>
                                </div>
                            )}
                            <HDInfoCardRefactor
                                image={TipCirclePurple}
                                paragraphs={[messages.subHeader]}
                                className="margin-top-md" />
                            <Row>
                                <Col md={6}>
                                    <HDButton
                                        id="confirm-button"
                                        className="dob-interstitial__confirm-btn w-100"
                                        webAnalyticsEvent={{ event_action: messages.confirm }}
                                        size="lg"
                                        label={messages.confirm}
                                        onClick={handleContinueTriggerButton} />
                                </Col>
                            </Row>
                        </Col>
                    )}
                    {isPurged && (
                        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <HDLabelRefactor
                                text={messages.purgedPageHeader}
                                Tag="h2" />
                            <HDLabelRefactor
                                text={messages.purgedSubHeader}
                                Tag="p" />
                            <HDLabelRefactor
                                text={email}
                                Tag="p"
                                className="font-demi-bold" />
                            <HDLabelRefactor
                                text={`${day.length < 2 ? `0${day}` : day}/${month.length < 2 ? `0${month}` : month}/${year}`}
                                Tag="p"
                                className="font-demi-bold" />
                            <Row className="flex-column flex-md-row">
                                <Col className="margin-top-md">
                                    <HDButton
                                        id="navigate-to-quote-button"
                                        webAnalyticsEvent={{ event_action: messages.getAQuote }}
                                        className="w-100 w-md-auto"
                                        variant="primary"
                                        size="lg"
                                        onClick={navigateToQuote}
                                        label={messages.getAQuote} />
                                </Col>
                                <Col className="margin-top-md">
                                    <HDButton
                                        id="navigate-to-home-button"
                                        webAnalyticsEvent={{ event_action: messages.returnToHome }}
                                        className="w-100 w-md-auto"
                                        variant="secondary"
                                        size="lg"
                                        onClick={navigateToHome}
                                        label={messages.returnToHome} />
                                </Col>
                            </Row>
                        </Col>
                    )}
                    {submissionNotFound && (
                        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <HDLabelRefactor
                                text={messages.purgedHeader}
                                Tag="h2" />
                            <HDLabelRefactor
                                text={messages.purgedParagraph1}
                                Tag="p" />
                            <HDLabelRefactor
                                text={messages.purgedParagraph2}
                                Tag="p" />
                            <HDLabelRefactor
                                text={messages.openingHoursHeader}
                                Tag="p" />
                            {OPENING_HOURS.map(({ days, hours }, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Row key={i} className="dob-interstitial__opening-hours">
                                    <Col xs={6}>
                                        <HDLabelRefactor Tag="p" text={days} />
                                    </Col>
                                    <Col xs={6}>
                                        <HDLabelRefactor Tag="p" text={hours} />
                                    </Col>
                                </Row>
                            ))}
                            <Row className="flex-column flex-md-row">
                                <Col className="margin-top-lg">
                                    <HDButton
                                        id="navigate-to-quote-button"
                                        webAnalyticsEvent={{ event_action: messages.getAQuote }}
                                        className="w-100 w-md-auto"
                                        variant="primary"
                                        size="md"
                                        onClick={navigateToQuote}
                                        label={messages.getAQuote} />
                                </Col>
                                <Col className="margin-top-lg">
                                    <HDButton
                                        id="navigate-to-home-button"
                                        webAnalyticsEvent={{ event_action: messages.returnToHome }}
                                        className="w-100 w-md-auto"
                                        variant="secondary"
                                        size="md"
                                        onClick={navigateToHome}
                                        label={messages.returnToHome} />
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </Container>
            <HDModal
                webAnalyticsView={{ page_section: messages.dateExpired }}
                webAnalyticsEvent={{ event_action: messages.dateExpired }}
                id="date-in-the-past-modal"
                show={showModal}
                headerText={messages.dateExpired}
                hideCancelButton
                hideConfirmButton
                hideClose
                className="dob-interstitial__update-inception-modal"
            >
                <HastingsUpdateInceptionDate updateInceptionDate={updateInceptionDate} />
            </HDModal>
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => ({
    retrieveQuoteObject: state.retrieveQuoteModel,
    submissionVM: state.wizardState.data.submissionVM,
    lwrQuoteObject: state.createQuoteModel.lwrQuoteObj,
});

const mapDispatchToProps = (dispatch) => ({
    setOfferedQuotesDetails,
    retrieveQuote: retrieveQuoteAction,
    setSubmissionVM: setSubmissionVMAction,
    createQuote,
    dispatch,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
    setErrorStatusCode: setErrorStatusCodeAction,
    setNavigation: setNavigationAction,
    setWizardPageState: setWizardPagesStateAction,
});

HastingsDOBInterstitialPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    updateEmailSaveProgress: PropTypes.func.isRequired,
    retrieveQuote: PropTypes.func.isRequired,
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
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({})
    }).isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
    lwrQuoteObject: PropTypes.shape({
        baseData: PropTypes.object,
        bindData: PropTypes.object,
        quoteData: PropTypes.object,
        lobData: PropTypes.object,
        quoteID: PropTypes.string,
        sessionUUID: PropTypes.string
    }),
    setErrorStatusCode: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired
};

HastingsDOBInterstitialPage.defaultProps = {
    lwrQuoteObject: null
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsDOBInterstitialPage);
