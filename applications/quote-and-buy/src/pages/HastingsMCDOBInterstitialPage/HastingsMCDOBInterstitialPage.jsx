/* eslint-disable react/prop-types */
import React, {
    useState, useEffect, useContext, useRef
} from 'react';
import {
    HDLabelRefactor,
    HDInfoCardRefactor,
} from 'hastings-components';
import { connect, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import _ from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    handleDayBlur, handleMonthBlur, handleDayChange, handleMonthChange, handleYearChange
} from './util';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInput,
    AnalyticsHDModal as HDModal
} from '../../web-analytics';
import * as messages from './HastingsMCDOBInterstititalPage.messages';
import { HOMEPAGE, OPENING_HOURS } from '../../constant/const';
import HastingsInterstitialPageHelper from '../HastingsInterstitialPageContainer/HastingsInterstitialPageHelper';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import { trackAPICallSuccess, trackAPICallFail } from '../../web-analytics/trackAPICall';
import TipCirclePurple from '../../assets/images/icons/tip_circle_purple.svg';
import {
    updateEmailSaveProgress as updateEmailSaveProgressAction,
    setErrorStatusCode as setErrorStatusCodeAction,
    setNavigation as setNavigationAction,
    setSubmissionVM as setSubmissionVMAction,
    setMultiOfferedQuotesDetails,
    retrievemulticarQuote as retrievemulticarQuoteAction,
    setMultiCarSubmissionVM as setMultiCarSubmissionVMAction
} from '../../redux-thunk/actions';
import {
    MC_MILESTONE,
    ROOT,
    INTRO,
    MC_POLICY_START_DATE,
    MC_CUSTOMIZE_QUOTE_WIZARD,
    MC_DOB_INTERSTITIAL
} from '../../routes/BaseRouter/RouteConst';
import wizardRouterRoutes from '../../routes/WizardRouter/RouteConst';
import HastingsMCUpdateInceptionDate from './HastingsMCUpdateInceptionDate';
import HDQuoteService from '../../api/HDQuoteService';
import { getDataForMultiQuoteAPICallWithoutUpdatedFlag } from '../../common/submissionMappers';
import { TranslatorContext } from '../../integration/TranslatorContext';
import * as monetateHelper from '../../common/monetateHelper';
import { getLatestQuoteByInceptionDate } from '../../common/dateHelpers';
import initialSubmission from '../../routes/SubmissionVMInitial';
import trackQuoteData from '../../web-analytics/trackQuoteData';

const HastingsDOBInterstitialPage = (props) => {
    const {
        location,
        history,
        dispatch,
        updateEmailSaveProgress,
        setErrorStatusCode,
        setNavigation,
        submissionVM,
        setSubmissionVM,
        mcsubmissionVM,
        updatedMultiQuoteObj,
        retrieveMulticarQuote,
        retrievemulticarQuoteModel,
        setMulticarSubmissionVM
    } = props;
    const [errorFlag, setErrorFlag] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [navigationPage, setNavigationPage] = useState('');
    const [isPurged, setPurged] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [multicarsubmissionVMCreated, setmulticarSubmissionVMCreated] = useState(false);
    const viewModelService = useContext(ViewModelServiceContext);
    const monthInputRef = useRef();
    const yearInputRef = useRef();
    let paramvalues;
    const translator = useContext(TranslatorContext);
    const mcancillaryJourneyModel = useSelector((state) => (state.mcancillaryJourneyModel) || {});
    const [quotesList, setQuotesList] = useState([]);
    const [shouldKeep, setShouldKeep] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const multiCarElements = useSelector((state) => state.monetateModel.resultData);
    const retrievedCookie = useSelector((state) => state.monetateModel.monetateId);
    const [cookies, setCookie] = useCookies(['']);
    const pcwName = useSelector((state) => state.wizardState.app.pcwName);
    const [submissionNotFound, setSubmissionNotFound] = useState(false);
    const [email, setEmail] = useState('');

    if (viewModelService) {
        if (!multicarsubmissionVMCreated && _.get(mcsubmissionVM, 'value.accountNumber') === undefined) {
            dispatch(setMulticarSubmissionVM({
                mcsubmissionVM: viewModelService.create(
                    {},
                    'pc',
                    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
                ),
            }));
            setmulticarSubmissionVMCreated(true);
        }
    }

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

    const navigateToHome = () => {
        window.location.assign(HOMEPAGE);
    };

    const navigateToQuote = () => {
        history.push({
            pathname: INTRO,
            state: { SaveAndReturn: false }
        });
    };

    const retreiveMulticarQuoteCall = () => {
        if (_.has(location, 'search')) {
            showLoader();
            paramvalues = location.search;
            let parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
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
            dispatch(retrieveMulticarQuote(parsedParams, translator));
        }
    };

    const navigationRoute = (page) => {
        dispatch(
            updateEmailSaveProgress(_.get(mcsubmissionVM.value, 'accountHolder.emailAddress1'))
        );
        switch (page) {
            case messages.multicarDriverAllocationPage:
                history.push({
                    pathname: wizardRouterRoutes.MC_DRIVER_ALLOCATION,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.multicarPolicyHolderAllocation:
                history.push({
                    pathname: wizardRouterRoutes.MC_POLICY_HOLDER_ALLOCATION,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.multicarDriverAllocationSecondaryPage:
                history.push({
                    pathname: wizardRouterRoutes.MC_DRIVER_ALLOCATION_SECONDARY,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.mcPolicyInfoPage:
            case messages.mcSavingPage:
                history.push({
                    pathname: MC_POLICY_START_DATE,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.milestonePage:
            case messages.addAnotherDriverPage:
                history.push({
                    pathname: MC_MILESTONE,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.mcQuoteErrorPage:
                history.push({
                    pathname: wizardRouterRoutes.MC_QUOTE_ERROR_PAGE,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.mcYourQuotePage:
                history.push({
                    pathname: wizardRouterRoutes.MC_YOURQUOTE_PAGE,
                    state: { SaveAndReturn: true }
                });
                break;
            case messages.musticarCustomizeQuoteSummaryPage:
                history.push({
                    pathname: MC_CUSTOMIZE_QUOTE_WIZARD,
                    state: { SaveAndReturn: true }
                });
                break;
            default:
                history.push({
                    pathname: ROOT,
                    state: { SaveAndReturn: true }
                });
                break;
        }
    };

    const isValidDOBDate = () => {
        const genDate = new Date(year, month - 1, day);
        // eslint-disable-next-line eqeqeq
        if (genDate.getFullYear() == year && genDate.getMonth() == month - 1 && genDate.getDate() == day) {
            return true;
        }
        return false;
    };

    const isQuoteStartDateValid = (startDate) => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        let isValid = true;
        const convertedStartDate = new Date(new Date(startDate.year, startDate.month, startDate.day).setHours(0, 0, 0, 0));
        if (convertedStartDate < today) { isValid = false; }
        return isValid;
    };

    const handleContinueTriggerButton = () => {
        if (day !== '' && day < 32 && month !== '' && month < 13 && year !== '' && year.length === 4) {
            if (isValidDOBDate()) {
                setErrorFlag(false);
                retreiveMulticarQuoteCall();
            } else {
                setErrorFlag(true);
            }
        } else {
            setErrorFlag(true);
        }
    };

    const updateInceptionDatesHandler = () => {
        const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(location.search);
        setShowModal(false);
        showLoader();
        setQuotesList((oldData) => {
            const newData = [...oldData];
            return newData.map((quote) => {
                const q = { ...quote };
                const date = {
                    year: parseInt(quote.baseData.periodStartDate.year, 10),
                    month: parseInt(quote.baseData.periodStartDate.month, 10),
                    day: parseInt(quote.baseData.periodStartDate.day, 10)
                };
                q.baseData.periodStartDate = { ...date };
                return q;
            });
        });
        _.set(mcsubmissionVM, 'value.quotes', quotesList);
        HDQuoteService.multiQuote(getDataForMultiQuoteAPICallWithoutUpdatedFlag(mcsubmissionVM.value))
            .then(({ result }) => {
                _.set(mcsubmissionVM, 'value', result);
                dispatch(setNavigation({ multiCarFlag: true }));
                dispatch(setMultiOfferedQuotesDetails(mcsubmissionVM, translator));
                navigationRoute(parsedParams.page);
                hideLoader();
                trackQuoteData(result, translator);
                trackAPICallSuccess('Multi Quote');
            }).catch((error) => {
                hideLoader();
                trackAPICallFail('Multi Quote', 'Multi Quote Failed');
                dispatch(setErrorStatusCode(error.status));
            });
    };

    const updateErrorMessageList = (message, index) => {
        setErrorMessages((oldData) => {
            const newData = [...oldData];
            newData[index] = message;
            return newData;
        });
    };

    const handleInputChange = (quoteIndex, dateObj, errorDateMessage) => {
        if (dateObj.year && (dateObj.month || dateObj.month === 0) && dateObj.day) {
            setQuotesList((oldData) => {
                const newData = [...oldData];
                newData[quoteIndex].baseData.periodStartDate.year = dateObj.year;
                newData[quoteIndex].baseData.periodStartDate.month = dateObj.month;
                newData[quoteIndex].baseData.periodStartDate.day = dateObj.day;
                return newData;
            });
        }
        let shouldSendToApi = true;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const future30DaysFromToday = new Date(new Date().setHours(744, 0, 0, 0));
        const parentCarDate = new Date(
            quotesList[0].baseData.periodStartDate.year,
            quotesList[0].baseData.periodStartDate.month,
            quotesList[0].baseData.periodStartDate.day
        );
        let childLimitDate = null;
        updateErrorMessageList('', quoteIndex);
        setButtonEnabled(false);

        if (errorDateMessage !== '') { shouldSendToApi = false; updateErrorMessageList(errorDateMessage, quoteIndex); }

        if (!isNaN(parentCarDate.getTime())) {
            const temporaryParentDate = new Date(parentCarDate);
            childLimitDate = new Date(temporaryParentDate.setHours(7920, 0, 0, 0));
        } else { shouldSendToApi = false; }


        if (!isNaN(parentCarDate.getTime()) && errorDateMessage === '' && quoteIndex === 0) {
            quotesList.forEach((item, index) => {
                if (index > 0) {
                    const childCarDate = new Date(
                        item.baseData.periodStartDate.year,
                        item.baseData.periodStartDate.month,
                        item.baseData.periodStartDate.day
                    ).getTime();
                    if (childCarDate < parentCarDate.getTime()) { shouldSendToApi = false; updateErrorMessageList(messages.dateError330, index); }
                    if (childCarDate > childLimitDate.getTime()) { shouldSendToApi = false; updateErrorMessageList(messages.dateError330, index); }
                }
            });
        }
        if (!isNaN(parentCarDate.getTime()) && errorDateMessage === '' && quoteIndex > 0) {
            if (parentCarDate.getTime() < today.getTime() || parentCarDate.getTime() > future30DaysFromToday.getTime()) {
                shouldSendToApi = false;
                updateErrorMessageList(messages.dateExpired, 0);
            } else {
                quotesList.forEach((item, index) => {
                    if (index > 0) {
                        const childCarDate = new Date(
                            item.baseData.periodStartDate.year,
                            item.baseData.periodStartDate.month, item.baseData.periodStartDate.day
                        ).getTime();
                        if (childCarDate < parentCarDate.getTime() || childCarDate > childLimitDate.getTime()) {
                            shouldSendToApi = false;
                            updateErrorMessageList(messages.dateError330, index);
                        }
                    }
                });
            }
        }

        if (shouldSendToApi) {
            setButtonEnabled(true);
        }
    };


    useEffect(() => {
        dispatch(setNavigation({ isAppStartPoint: true, previousPageName: MC_DOB_INTERSTITIAL }));
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
    useEffect(() => {
        hideLoader();
        if (updatedMultiQuoteObj && updatedMultiQuoteObj.baseData) {
            _.set(mcsubmissionVM, 'value', updatedMultiQuoteObj);
            navigationRoute(navigationPage);
        }
    }, [updatedMultiQuoteObj, dispatch]);

    useEffect(() => {
        if (retrievemulticarQuoteModel && !retrievemulticarQuoteModel.loading && retrievemulticarQuoteModel.retrievemulticarQuoteError) {
            hideLoader();
            // invalid dob
            if (retrievemulticarQuoteModel.retrievemulticarQuoteError.error
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode === 807) {
                setErrorFlag(true);
            } else if (retrievemulticarQuoteModel.retrievemulticarQuoteError.error
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode === 809) {
                setPurged(true);
            } else if (retrievemulticarQuoteModel.retrievemulticarQuoteError.error
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode
                && retrievemulticarQuoteModel.retrievemulticarQuoteError.error.data.appErrorCode === 603) {
                setSubmissionNotFound(true);
            } else {
                setErrorFlag(true);
            }
        }

        if (retrievemulticarQuoteModel.retrievemulticarQuoteObj
            && Object.keys(retrievemulticarQuoteModel.retrievemulticarQuoteObj).length > 0
            && retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj
            && retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj.quotes.length > 1) {
            hideLoader();
            if (_.has(location, 'search')) {
                const filteredOfferedQuotes = [];
                paramvalues = location.search;
                const parsedParams = HastingsInterstitialPageHelper.parseQueryParams(paramvalues);
                const quoteIds = retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj.quotes.map((quote) => ({ quoteID: quote.quoteID }));
                HastingsInterstitialPageHelper.updatePreSelectedAncillariesMC(parsedParams.selectedAncillaries, mcancillaryJourneyModel, quoteIds);
                let isNavigate = true;
                let shouldShowModal = false;
                setQuotesList(() => { return [...retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj.quotes]; });
                _.set(mcsubmissionVM, 'value', retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj);
                dispatch(setNavigation({ multiCarFlag: true }));
                retrievemulticarQuoteModel.retrievemulticarQuoteObj.quoteObj.quotes.forEach((quote) => {
                    if (quote.baseData) {
                        setErrorFlag(false);
                        if (quote.baseData.periodStatus === messages.BOUND) {
                            dispatch(setErrorStatusCode(503));
                        } else {
                            setErrorMessages((old) => [...old, '']);
                            setNavigationPage(parsedParams.page);
                            const offeredQuotes = quote.quoteData.offeredQuotes || [];
                            const result = offeredQuotes.filter((offeredQuotesObj) => {
                                return offeredQuotesObj.branchCode === parsedParams.productBand;
                            });
                            filteredOfferedQuotes.push(...result);

                            // drafted and has retrieveErrorFlag error (date in the past but not purged)
                            if (quote.errorsAndWarnings && quote.errorsAndWarnings.retrieveErrorFlag && quote.baseData.periodStatus === messages.DRAFT) {
                                shouldShowModal = false;
                                isNavigate = true;
                            }
                            // quoted and periodStartDate expired
                            if (quote.baseData.periodStatus !== messages.DRAFT && !isQuoteStartDateValid(quote.baseData.periodStartDate)) {
                                shouldShowModal = true;
                                isNavigate = false;
                                setShouldKeep((old) => {
                                    return [...old, false];
                                });
                            }
                            if (quote.baseData.periodStatus !== messages.DRAFT && isQuoteStartDateValid(quote.baseData.periodStartDate)) {
                                setShouldKeep((old) => {
                                    return [...old, true];
                                });
                            }
                        }
                    }
                });
                if (filteredOfferedQuotes.length > 0) { dispatch(setMultiOfferedQuotesDetails(filteredOfferedQuotes)); }
                if (isNavigate) { navigationRoute(parsedParams.page); }
                if (shouldShowModal) { setShowModal(true); }
                const getMCSubmissionVM = _.get(mcsubmissionVM, 'value.quotes');
                _.set(submissionVM, 'value', getLatestQuoteByInceptionDate(getMCSubmissionVM));
            } else {
                setErrorFlag(true);
            }
        }
    }, [dispatch, retrievemulticarQuoteModel, mcsubmissionVM]);

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
                                                onChange={(e) => handleDayChange(e.target.value, setDay, monthInputRef)}
                                                onBlur={(e) => handleDayBlur(e.target.value, setDay)}
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
                                                onChange={(e) => handleMonthChange(e.target.value, setMonth, yearInputRef)}
                                                onBlur={(e) => handleMonthBlur(e.target.value, setMonth)}
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
                                                onChange={(e) => handleYearChange(e.target.value, setYear)}
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
                hideCancelButton
                hideConfirmButton
                hideClose
                className="dob-interstitial__update-inception-modal"
            >
                <div className="update-inception-date">
                    {quotesList.map((carQuote, index) => {
                        const key = `car-card-${index}`;
                        return (
                            <HastingsMCUpdateInceptionDate
                                key={key}
                                isExpired={!shouldKeep[index]}
                                carQuote={carQuote}
                                index={index}
                                handleInputChange={handleInputChange}
                                errorMessage={errorMessages[index]} />
                        );
                    })}
                    <HDButton
                        id="update-quote-button"
                        variant="primary"
                        className="theme-white w-100 margin-top-lg"
                        disabled={!buttonEnabled}
                        label={messages.updateQuote}
                        onClick={updateInceptionDatesHandler} />
                </div>
            </HDModal>
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        retrieveQuoteObject: state.retrieveQuoteModel,
        submissionVM: state.wizardState.data.submissionVM,
        updatedMultiQuoteObj: state.updateMultiQuoteModel.updatedMultiQuoteObj,
        retrievemulticarQuoteModel: state.retrievemulticarQuoteModel,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    updateEmailSaveProgress: updateEmailSaveProgressAction,
    setErrorStatusCode: setErrorStatusCodeAction,
    setNavigation: setNavigationAction,
    setMultiOfferedQuotesDetails,
    setMulticarSubmissionVM: setMultiCarSubmissionVMAction,
    retrieveMulticarQuote: retrievemulticarQuoteAction,
    setSubmissionVM: setSubmissionVMAction,
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
    setErrorStatusCode: PropTypes.func.isRequired,
    setNavigation: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    retrievemulticarQuoteModel: PropTypes.shape(
        {
            retrievemulticarQuoteObj: PropTypes.shape(
                {
                    quoteObj: PropTypes.shape(
                        {
                            quotes: PropTypes.array,
                            accountHolder: PropTypes.string,
                            accountNumber: PropTypes.string,
                            mpwrapperJobNumber: PropTypes.string,
                            mpwrapperNumber: PropTypes.string,
                            sessionUUID: PropTypes.string,
                        }
                    )
                }

            ),
            retrievemulticarQuoteError: PropTypes.shape({
                error: PropTypes.shape({
                    message: PropTypes.string,
                }),
            })
        }
    ).isRequired,
    setMultiCarSubmissionVM: PropTypes.func.isRequired,
    setSubmissionVM: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsDOBInterstitialPage);
