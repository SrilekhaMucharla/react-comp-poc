/* eslint-disable react/no-danger */
import React, {
    useState,
    useEffect,
    createRef,
    useRef
} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HastingsValidationService } from 'hastings-capability-validation';
import {
    AnalyticsHDButton as HDButtonRefactor,
    AnalyticsHDModal as HDModal
} from '../../web-analytics';
import EventEmmiter from '../../EventHandler/event';
import {
    HDCustomizeQuoteFooterPage,
    HDMCCustomizeQuoteSummaryPage,
    HDMultiCarSubVehicle,
    HDMotorLegalMultiCarPage,
    HDMCPersonalAccident,
    HDMCThanksPage,
    HDMCImportantStuffPage,
    HDMCDirectDebitPage,
    HDMCRACBreakDownPage,
    HDMCConfirmContactDetailsPage,
    HDMCPNCDPage,
    HDMCKeyCoverAncillaryPage,
    HDPaymentPage,
    HDCreatePasswordPage,
    HDBindErrorPage
} from '../wizard-pages';
import useToast from '../Controls/Toast/useToast';
import {
    PAYMENT_TYPE_ANNUALLY_CODE,
    PRIVACY_HEADER_HEIGHT,
    HEADER_HEIGHT_MOBILE,
    HOMEPAGE
} from '../../constant/const';
import messages from './HDMCCustomizeQuoteWizard.messages';
import pageMetadata from './HDMCCustomizeQuotePageMetadata';
import {
    mcUpdateMarketingPreference, updateEpticaId,
} from '../../redux-thunk/actions';
import {
    MC_CLEAR_MARKETING_PREFERENCES_RESET
} from '../../redux-thunk/action.types';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import { MISCELLANEOUS, THANK_YOU } from '../../customer/directintegrations/faq/epticaMapping';
import { multicarCustomizeQuoteSummaryPage } from '../HastingsDOBInterstitialPage/HastingsDOBInterstititalPage.messages';
import { trackView } from '../../web-analytics/trackData';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../wizard-pages/__helpers__/policyErrorCheck';

const SUMMARY_PAGE_INDEX = 0;
const PNCD = 1;
const ANCILLARY_INDEX = 2;
const IMPORTANT_STUFF_PAGE_INDEX = 3;
const MC_CCD = 4;
let PASSWORD_PAGE_INDEX;
let DIRECT_DEBIT_PAGE_INDEX;
let PAYMENT_PAGE_INDEX;
let THANKS_PAGE_INDEX;

const INSURE_ADVANTAGE_CODE = '437';

const iovationProdFiles = ['quote-and-buy/js/config.js', 'quote-and-buy/js/loader.js'];
const iovationLocalFiles = ['js/config.js', 'js/loader.js'];

const HDMCCustomizeQuoteWizard = ({
    multiCustomizeSubmissionVM,
    quotedData,
    mcsubmissionVM,
    mcupdateMarketingPreferencesModel,
    dispatch
}) => {
    const [routeIndex, setRouteIndex] = useState(0);
    const [subRouteIndex, setSubRouteIndex] = useState(0);
    const [currentCCDIndex, setcurrentCCDIndex] = useState(0);
    const [elRefs, setElRefs] = useState([]);
    const blackBoxRef = useRef(null);
    const [showIovationModal, setShowIovationModal] = useState(false);
    const [overallPrice, setOverallPrice] = useState(null);
    const [disabledContinue, setdisabledContinue] = useState(false);
    const [HDToast, addToast] = useToast();
    const [displayPNCDPage, setDisplayPNCDPage] = useState(true);
    const [showContinueButton, setShowContinueButton] = useState(true);
    const [ccdApiFlag, setccdApiFlag] = useState(false);
    const [gobackEnabled, setgobackEnabled] = useState(false);
    const [subrouteFinished, setsubrouteFinished] = useState(false);
    const [pncdCurrentCar, setPncdCurrentCar] = useState(0);
    const history = useHistory();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const getmcsubmissionVMQuotes = _.get(mcsubmissionVM, 'value.quotes', []);
    const parentPolicyCarIndex = getmcsubmissionVMQuotes.findIndex((quote) => quote.isParentPolicy);
    const vehicleDetailsFromSubmission = _.get(mcsubmissionVM, `value.quotes[${parentPolicyCarIndex}].baseData`, null);
    const insurancePaymentType = (vehicleDetailsFromSubmission)
        ? vehicleDetailsFromSubmission.affordablePaymentPlan : PAYMENT_TYPE_ANNUALLY_CODE;
    const [paymentType] = useState(insurancePaymentType);
    const [isImportantStuffPageReached, setIsImporatantStuffPageReached] = useState(false);
    const [indexArray, setindexArray] = useState([]);
    const insurerPath = 'baseData.insurer';
    const [showDeclineQuote, setShowDeclineQuote] = useState(false);
    /* useEffect(() => {
        if (multiCustomizeSubmissionVM) {
            _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', paymentType);
        }
    }, []); */


    let componentArray;

    const getAdditionalScrollOffset = () => {
        const isPrivacyPolicyHeaderOpen = document.body.classList.contains('privacy-policy-open');
        if (window.matchMedia('(max-width: 992px) and (orientation: landscape)').matches) {
            if (isPrivacyPolicyHeaderOpen) {
                return HEADER_HEIGHT_MOBILE + PRIVACY_HEADER_HEIGHT;
            }
            return HEADER_HEIGHT_MOBILE;
        }
        if (isPrivacyPolicyHeaderOpen) {
            return PRIVACY_HEADER_HEIGHT;
        }
        return 0;
    };

    const shouldPNCDShow = (McCustmzSubVM) => {
        const vehicleList = _.get(multiCustomizeSubmissionVM, 'value.customQuotes', []);
        let showPNCD = false;
        vehicleList.forEach((vehicle, index) => {
            const ncdYears = _.get(vehicle, 'ncdgrantedYears', 0);
            const claimsDetails = _.get(mcsubmissionVM,
                `value.quotes[${index}].lobData.privateCar.coverables.drivers[0].claimsAndConvictions.claimsDetailsCollection`);
            const validationDate = new Date(new Date().getFullYear() - 4, new Date().getMonth(), 1);
            const faultyClaims = claimsDetails.filter((claim) => claim.wasItMyFault === true && validationDate <= new Date(claim.accidentDate));
            if (ncdYears >= 1 && faultyClaims && faultyClaims.length < 2) {
                showPNCD = true;
            }
        });
        setDisplayPNCDPage(showPNCD);
    };

    const loadIovationfiles = () => {
        let filesToLoad = [...iovationProdFiles];
        if (window.location.hostname.includes('localhost')) {
            filesToLoad = [...iovationLocalFiles];
        }
        filesToLoad.forEach((file) => {
            const ioScript = document.createElement('script');
            ioScript.src = file;
            ioScript.type = 'text/javascript';
            ioScript.async = false;
            document.head.appendChild(ioScript);
        });
    };

    useEffect(() => {
        // reset scroll for history entry push
        window.scroll(0, 0);
        // window.scrollTo(0, 0);
        // block initial go-back attempt to GAP wizard
        history.push(history.location.pathname);

        const requestValue = blackBoxRef && blackBoxRef.current && blackBoxRef.current.value ? blackBoxRef.current.value : null;
        if (!requestValue) {
            loadIovationfiles();
        }
    }, []);

    const MOTOR_LEGAL_INDEX = 0;
    const RAC_INDEX = 1;
    const PERSONAL_ACCIDENT_INDEX = 2;
    const SUBSTITUTE_VEHICLE_INDEX = 3;
    const KEY_COVER_INDEX = 4;

    const getAncillariesMetadata = (subRoute) => {
        switch (subRoute) {
            case MOTOR_LEGAL_INDEX: return pageMetadata.HDMotorLegalMultiCarPage;
            case RAC_INDEX: return pageMetadata.HDMCRACBreakDownPage;
            case PERSONAL_ACCIDENT_INDEX: return pageMetadata.HDMCPersonalAccident;
            case SUBSTITUTE_VEHICLE_INDEX: return pageMetadata.HDMultiCarSubVehicle;
            case KEY_COVER_INDEX: return pageMetadata.HDMCKeyCoverAncillaryPage;
            default: return pageMetadata.HDMCAncillariesPage;
        }
    };

    const getCurrentAnalyticsPageMetadata = () => {
        switch (routeIndex) {
            case SUMMARY_PAGE_INDEX: return pageMetadata.HDMCCustomizeQuoteSummaryPage;
            case DIRECT_DEBIT_PAGE_INDEX: return pageMetadata.HDMCDirectDebitPage;
            case PAYMENT_PAGE_INDEX: return pageMetadata.HDPaymentPage;
            case THANKS_PAGE_INDEX: return pageMetadata.HDMCThanksPage;
            case MC_CCD: return pageMetadata.HDMCConfirmContactDetailsPage;
            case PASSWORD_PAGE_INDEX: return pageMetadata.HDCreatePasswordPage;
            case IMPORTANT_STUFF_PAGE_INDEX: return pageMetadata.HDMCImportantStuffPage;
            case PNCD: return pageMetadata.HDMCPNCDPage;
            case ANCILLARY_INDEX: return getAncillariesMetadata(subRouteIndex);
            default: return pageMetadata.HDCustomizeQuoteWizard;
        }
    };

    useEffect(() => {
        trackView({
            page_section: 'Page',
            ...getCurrentAnalyticsPageMetadata()
        });
    }, [routeIndex, subRouteIndex]);

    const moveToNextRoute = () => {
        if (routeIndex < componentArray.length - 1) {
            window.scrollTo(0, 0);
            if (routeIndex === SUMMARY_PAGE_INDEX && !displayPNCDPage) {
                setRouteIndex(routeIndex + 2);
            } else {
                setRouteIndex(routeIndex + 1);
            }
        }
    };

    const callIovationCheck = () => {
        const iovationRequestValue = blackBoxRef && blackBoxRef.current && blackBoxRef.current.value ? blackBoxRef.current.value : null;
        if (iovationRequestValue) {
            const requestDto = {
                beginBlackBox: iovationRequestValue,
                wrapperJobNumber: quotedData.mpwrapperJobNumber
            };
            if (quotedData.quotes.filter((q) => q.baseData.insurer === INSURE_ADVANTAGE_CODE).length > 0) {
                showLoader();
                HastingsValidationService.checkTransactionDetailsForMC(requestDto)
                    .then((validationResponse) => {
                        hideLoader();
                        const response = validationResponse.result.result;
                        if (response === messages.DENIED_MSG) {
                            setShowIovationModal(true);
                        } else {
                            setShowIovationModal(false);
                            moveToNextRoute();
                        }
                    })
                    .catch(() => {
                        hideLoader();
                        setShowIovationModal(false);
                        moveToNextRoute();
                    });
            } else {
                setShowIovationModal(false);
                moveToNextRoute();
            }
        } else {
            setShowIovationModal(false);
            moveToNextRoute();
        }
    };

    const ccdDriversArrayTemp = [];
    let accountHolderCellNumber;

    if (mcsubmissionVM && mcsubmissionVM.value && mcsubmissionVM.value.quotes && mcsubmissionVM.value.quotes.length) {
        mcsubmissionVM.value.quotes.forEach((submissionVM, quoteIndex) => {
            if (submissionVM.isParentPolicy) accountHolderCellNumber = _.get(submissionVM, `lobData.privateCar.coverables.drivers[${quoteIndex}].person.cellNumber`, '');
            submissionVM.lobData.privateCar.coverables.drivers.forEach((driver, driverIndex) => {
                if (driver.person && driver.isPolicyHolder) {
                    if (!ccdDriversArrayTemp.find((o) => o.driverEmail === driver.person.emailAddress1)) {
                        ccdDriversArrayTemp.push(
                            {
                                driverEmail: driver.person.emailAddress1,
                                firstName: driver.person.firstName,
                                lastName: driver.person.lastName,
                                quoteID: submissionVM.quoteID,
                                repeat: false
                            }
                        );
                    } else {
                        ccdDriversArrayTemp.push(
                            {
                                driverEmail: driver.person.emailAddress1,
                                firstName: driver.person.firstName,
                                lastName: driver.person.lastName,
                                quoteID: submissionVM.quoteID,
                                repeat: true
                            }
                        );
                        _.set(driver, 'person.cellNumber', accountHolderCellNumber);
                    }
                }
            });
        });
    }

    const previousCCDIndexCalculator = () => {
        let prevIteration = 0;
        for (let i = ccdDriversArrayTemp.length - 1; i >= 0; i -= 1) {
            if (i < currentCCDIndex && ccdDriversArrayTemp[i].repeat === false && ccdDriversArrayTemp[i]) {
                prevIteration = i;
                break;
            } else {
                prevIteration = mcsubmissionVM.value.quotes.length;
            }
        }
        const currentCCDIndexTemp = prevIteration;
        setccdApiFlag(false);
        if (currentCCDIndexTemp <= mcsubmissionVM.value.quotes.length) {
            setcurrentCCDIndex(currentCCDIndexTemp);
        }
    };

    const nextCCDIndexCalculator = () => {
        let nextIteration = 0;
        for (let i = 0; i < ccdDriversArrayTemp.length; i += 1) {
            if (i > currentCCDIndex && ccdDriversArrayTemp[i].repeat === false && ccdDriversArrayTemp[i]) {
                nextIteration = i;
                break;
            } else {
                nextIteration = mcsubmissionVM.value.quotes.length;
            }
        }
        const currentCCDIndexTemp = nextIteration;
        setccdApiFlag(false);
        if (currentCCDIndexTemp >= mcsubmissionVM.value.quotes.length) {
            moveToNextRoute();
        } else {
            setcurrentCCDIndex(currentCCDIndexTemp);
        }
    };

    const getCCDLabel = () => {
        let nextIteration = 0;
        for (let i = 0; i < ccdDriversArrayTemp.length; i += 1) {
            if (i > currentCCDIndex && ccdDriversArrayTemp[i].repeat === false && ccdDriversArrayTemp[i]) {
                nextIteration = i;
                break;
            } else {
                nextIteration = mcsubmissionVM.value.quotes.length;
            }
        }
        const currentCCDIndexTemp = nextIteration;
        if (currentCCDIndexTemp >= mcsubmissionVM.value.quotes.length) {
            return messages.ContinuetoPayment;
        }
        return messages.Continue;
    };


    const getChosenQuote = (quote, index) => {
        const chosenQuoteID = _.get(mcsubmissionVM, `value.quotes[${index}].bindData.chosenQuote`);
        return mcsubmissionVM.value.quotes[index].quoteData.offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
    };

    const hasQuoteErrors = () => {
        const data = _.get(mcsubmissionVM, 'value.quotes');
        let errorCount = 0;
        _.each(data, (quote, index) => {
            const quoteArray = [getChosenQuote(quote, index)];
            const hasCustomQuoteErrors = isUWErrorPresent(quoteArray)
            || isGrayListErrorPresent(quoteArray)
            || isCueErrorPresent(quoteArray);
            if (hasCustomQuoteErrors) {
                errorCount += 1;
            }
        });
        return errorCount;
    };


    useEffect(() => {
        if (mcupdateMarketingPreferencesModel && mcupdateMarketingPreferencesModel.loading) {
            showLoader();
        } else {
            hideLoader();
            if (mcupdateMarketingPreferencesModel && !_.isEmpty(mcupdateMarketingPreferencesModel.marketingUpdatedObj)) {
                _.set(mcsubmissionVM, 'value', mcupdateMarketingPreferencesModel.marketingUpdatedObj);
                dispatch({
                    type: MC_CLEAR_MARKETING_PREFERENCES_RESET
                });
                const isErrorState = hasQuoteErrors();
                if (isErrorState > 0) {
                    setShowDeclineQuote(true);
                    return;
                }
                nextCCDIndexCalculator();
            }
        }
    }, [mcupdateMarketingPreferencesModel]);

    const triggerrequoteAPI = () => {
        dispatch(mcUpdateMarketingPreference(mcsubmissionVM, currentCCDIndex));
    };

    const checkbuttonDisabled = (status) => {
        setdisabledContinue(!status);
    };

    const getOffsetScroll = (time) => {
        setTimeout(() => {
            window.scrollTo({
                top: elRefs[subRouteIndex].current.offsetTop + getAdditionalScrollOffset(),
                behavior: 'smooth'
            });
        }, time);
    };

    useEffect(() => {
        const tmpElRefs = componentArray[routeIndex].pages.map(() => createRef());
        setElRefs((tmpElRefs));
    }, [componentArray, routeIndex]);

    useEffect(() => {
        if (elRefs[subRouteIndex]) {
            if (subRouteIndex === 0) {
                window.scroll(0, 0);
            } else if (!gobackEnabled) {
                // eslint-disable-next-line no-unused-expressions
                subRouteIndex === 1 ? getOffsetScroll(200) : getOffsetScroll(0);
            }
        }
    }, [elRefs, subRouteIndex]);

    const goBack = () => {
        setgobackEnabled(true);
        if (routeIndex === MC_CCD) {
            if (disabledContinue) {
                setdisabledContinue(false);
            }
            if (currentCCDIndex === 0) {
                setRouteIndex(routeIndex - 1);
            } else {
                previousCCDIndexCalculator();
            }
        } else if (routeIndex === ANCILLARY_INDEX && !displayPNCDPage) {
            setRouteIndex(routeIndex - 2);
        } else if (routeIndex === ANCILLARY_INDEX && displayPNCDPage) {
            setPncdCurrentCar(_.get(multiCustomizeSubmissionVM, 'customQuotes.value').length - 1);
            setRouteIndex(routeIndex - 1);
        } else if (routeIndex === PNCD) {
            setPncdCurrentCar(0);
            setRouteIndex(routeIndex - 1);
        } else {
            setRouteIndex(routeIndex - 1);
        }
    };

    useEffect(() => {
        // block subsequent go-back attempts to GAP wizard
        const handleBrowserBack = (newLocation, action) => {
            const isErrorState = hasQuoteErrors();
            if (action === 'POP') {
                history.push(history.location.pathname);
                if (routeIndex !== 0 && isErrorState === 0) {
                    goBack();
                }
            }
        };

        const unlisten = history.listen(handleBrowserBack);
        return unlisten;
    }, [routeIndex]);

    const finishedWizard = () => { };

    const showRACToast = (toastMsgObj) => {
        if (toastMsgObj && toastMsgObj.msg) {
            const toastContent = [{
                id: 'mc-rac-breakdown-toast',
                iconType: toastMsgObj.icon,
                bgColor: 'main',
                content: (
                    <div>
                        {toastMsgObj.branchCode === messages.HP && toastMsgObj.chosenTermVal === messages.Roadside ? (
                            <span className="reg-num--toast">{toastMsgObj.regNum}</span>
                        ) : ''}
                        <span>
                            {toastMsgObj.msg}
                        </span>
                        {(toastMsgObj.branchCode === messages.HP && toastMsgObj.chosenTermVal !== messages.Roadside)
                            || (toastMsgObj.branchCode !== messages.HP) ? (
                                <>
                                    <span className="reg-num--toast">{toastMsgObj.regNum}</span>
                                    <span>
                                        {toastMsgObj.msgSecondPart ? toastMsgObj.msgSecondPart : null}
                                    </span>
                                    <span>
                                        {toastMsgObj.at ? toastMsgObj.at : null}
                                    </span>
                                    <span>
                                        {toastMsgObj.coverAmount ? toastMsgObj.coverAmount : null}
                                    </span>
                                </>
                            ) : ''}

                    </div>
                ),
                ...toastMsgObj
            }];
            addToast(toastContent);
        }
    };

    const showToast = (toastMsg, additionalMsg) => {
        const toastContent = [];
        if (toastMsg && toastMsg.length) {
            toastMsg.forEach((element) => {
                if (element.details && element.details.length) {
                    toastContent.push({
                        id: 'mc-cq-toast',
                        iconType: element.selection === 'yes' ? 'tick' : 'cross',
                        bgColor: 'main',
                        content: (
                            <div className={element.selection === 'yes' ? 'toast-container' : 'toast-container no-toast-margin'}>
                                <span className="toast-text" dangerouslySetInnerHTML={{ __html: element.message }} />
                                <br />
                                {element.selection === 'yes' ? <span className="toast-text" dangerouslySetInnerHTML={{ __html: additionalMsg }} /> : ''}
                            </div>
                        ),
                        ...element
                    });
                } else if (additionalMsg && !element.details.length && element.selection === 'yes') {
                    toastContent.push({
                        id: 'mc-cq-toast',
                        iconType: element.selection === 'yes' ? 'tick' : 'cross',
                        bgColor: 'main',
                        content: (
                            <div className="toast-container">
                                <span className="toast-text" dangerouslySetInnerHTML={{ __html: additionalMsg }} />
                            </div>
                        ),
                        ...element
                    });
                }
            });
            if (toastContent && toastContent.length) {
                addToast(toastContent);
            }
        }
    };

    const handleContinueTriggerButton = (toastMsg, additionalMsg, subrouteType) => {
        setgobackEnabled(false);
        if (routeIndex === MC_CCD && ccdApiFlag) {
            triggerrequoteAPI();
        } else if (routeIndex === MC_CCD && !ccdApiFlag) {
            nextCCDIndexCalculator();
        } else if (routeIndex === DIRECT_DEBIT_PAGE_INDEX || routeIndex === SUMMARY_PAGE_INDEX) {
            moveToNextRoute();
        } else if (routeIndex === IMPORTANT_STUFF_PAGE_INDEX) {
            callIovationCheck();
        } else {
            // eslint-disable-next-line no-lonely-if
            if (subrouteType) {
                if (subrouteFinished || (subRouteIndex > subrouteType)) {
                    showToast(toastMsg, additionalMsg);
                    window.scrollTo({
                        top: elRefs[subrouteType].current.offsetTop + getAdditionalScrollOffset(),
                        behavior: 'smooth'
                    });
                } else {
                    setSubRouteIndex(subrouteType);
                    showToast(toastMsg, additionalMsg);
                    if (subRouteIndex === subrouteType && elRefs[subRouteIndex] && elRefs[subRouteIndex].current) {
                        window.scrollTo({
                            top: elRefs[subRouteIndex].current.offsetTop + getAdditionalScrollOffset(),
                            behavior: 'smooth'
                        });
                    }
                }
            } else if (routeIndex === (componentArray.length - 1)
                && subRouteIndex === (componentArray[routeIndex].pages.length - 1)) {
                finishedWizard();
            } else if (!subrouteType && (subRouteIndex === (componentArray[routeIndex].pages.length - 1))) {
                showToast(toastMsg, additionalMsg);
                moveToNextRoute();
                if (subRouteIndex && subRouteIndex === (componentArray[routeIndex].pages.length - 1)) {
                    setsubrouteFinished(true);
                }
            }
        }
    };

    const invalidateImportantStuffPageStatus = () => {
        setIsImporatantStuffPageReached(false);
    };

    const setTotalPrice = (price) => {
        EventEmmiter.dispatch('change', price);
        setOverallPrice(price);
    };

    const moveToThankYouPage = () => {
        setSubRouteIndex(0);
        if (routeIndex < componentArray.length - 1) {
            window.scroll(0, 0);
            setRouteIndex(routeIndex + 2);
            dispatch(updateEpticaId(THANK_YOU));
        }
    };

    const moveToBindErrorPage = () => {
        setSubRouteIndex(0);
        if (routeIndex < componentArray.length - 1) {
            window.scroll(0, 0);
            setRouteIndex(routeIndex + 3);
            dispatch(updateEpticaId(MISCELLANEOUS));
        }
    };

    const setapiFlag = (flag) => {
        if (flag) {
            setccdApiFlag(true);
        }
    };
    const resetgobackEnabled = () => {
        setgobackEnabled(false);
    };
    const racIndexArrayFn = (data) => {
        setindexArray(data);
    };

    componentArray = [
        {
            id: 'MCCustomizeQuoteSummaryPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCCustomizeQuoteSummaryPage
                        pageMetadata={pageMetadata.HDMCCustomizeQuoteSummaryPage}
                        setTotalPrice={setTotalPrice}
                        shouldPNCDShow={shouldPNCDShow}
                        checkbuttonDisabled={checkbuttonDisabled} />
                </div>
            ]
        },
        {
            id: 'PNCDPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCPNCDPage
                        pageMetadata={pageMetadata.HDMCPNCDPage}
                        onGoBack={goBack}
                        toggleContinueElement={setShowContinueButton}
                        triggerNextRoute={moveToNextRoute}
                        initialCurrentCar={pncdCurrentCar} />
                </div>
            ]
        },
        {
            id: 'MCAditionalInformation',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMotorLegalMultiCarPage
                        pageMetadata={pageMetadata.HDMotorLegalMultiCarPage}
                        parentContinue={handleContinueTriggerButton}
                        overallPrice={overallPrice}
                        setTotalPrice={setTotalPrice}
                        onGoBack={goBack}
                        key={0} />
                </div>,
                <div ref={elRefs[1]}>
                    <HDMCRACBreakDownPage
                        pageMetadata={pageMetadata.HDMCRACBreakDownPage}
                        overallPrice={overallPrice}
                        setTotalPrice={setTotalPrice}
                        invalidateImportantStuffPage={invalidateImportantStuffPageStatus}
                        parentContinue={handleContinueTriggerButton}
                        key={1}
                        racToast={showRACToast}
                        gobackEnabled={gobackEnabled}
                        resetgobackEnabled={resetgobackEnabled}
                        subrouteFinished={subrouteFinished}
                        racIndexArrayFn={racIndexArrayFn}
                        indexArray={indexArray} />
                </div>,
                <div ref={elRefs[2]}>
                    <HDMCPersonalAccident
                        pageMetadata={pageMetadata.HDMCPersonalAccident}
                        parentContinue={handleContinueTriggerButton}
                        overallPrice={overallPrice}
                        invalidateImportantStuffPage={invalidateImportantStuffPageStatus}
                        setTotalPrice={setTotalPrice}
                        key={2} />
                </div>,
                <div ref={elRefs[3]}>
                    <HDMultiCarSubVehicle
                        pageMetadata={pageMetadata.HDMultiCarSubVehicle}
                        parentContinue={handleContinueTriggerButton}
                        overallPrice={overallPrice}
                        invalidateImportantStuffPage={invalidateImportantStuffPageStatus}
                        setTotalPrice={setTotalPrice}
                        key={3} />
                </div>,
                <div ref={elRefs[4]}>
                    <HDMCKeyCoverAncillaryPage
                        pageMetadata={pageMetadata.HDMCKeyCoverAncillaryPage}
                        parentContinue={handleContinueTriggerButton}
                        overallPrice={overallPrice}
                        invalidateImportantStuffPage={invalidateImportantStuffPageStatus}
                        setTotalPrice={setTotalPrice}
                        key={4} />
                </div>
            ]
        },
        {
            id: 'MCImportantStuffPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCImportantStuffPage
                        pageMetadata={pageMetadata.HDMCImportantStuffPage}
                        parentContinue={handleContinueTriggerButton}
                        overallPrice={overallPrice}
                        setTotalPrice={setTotalPrice}
                        key={0}
                        onGoBack={goBack}
                        toggleContinueElement={setShowContinueButton} />
                </div>
            ]
        },
        {
            id: 'HDMCConfirmContactDetailsPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCConfirmContactDetailsPage
                        pageMetadata={pageMetadata.HDMCConfirmContactDetailsPage}
                        setapiFlag={setapiFlag}
                        currentCCDIndex={currentCCDIndex}
                        showDeclineQuote={showDeclineQuote}
                        checkbuttonDisabled={checkbuttonDisabled}
                        toggleContinueElement={setShowContinueButton}
                        parentContinue={handleContinueTriggerButton}
                        getCCDLabel={getCCDLabel}
                        onGoBack={goBack} />
                </div>
            ]
        },
        {
            id: 'HDPaymentPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDPaymentPage
                        pageMetadata={pageMetadata.HDPaymentPage}
                        toggleContinueElement={setShowContinueButton}
                        paymentType={paymentType}
                        onPaymentSuccess={moveToNextRoute}
                        onMoveThankYouPage={moveToThankYouPage}
                        onBindFailure={moveToBindErrorPage}
                        onAbort={goBack} />
                </div>
            ]
        },
        {
            id: 'HDPasswordPage', // added ids for consistency
            pages: [<div ref={elRefs[0]}><HDCreatePasswordPage pageMetadata={pageMetadata.HDCreatePasswordPage} onSetNewPassSuccess={moveToNextRoute} /></div>]
        },
        {
            id: 'MCThanksPage', // added ids for consistency
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCThanksPage pageMetadata={pageMetadata.HDMCThanksPage} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDBindErrorPage
                        pageMetadata={pageMetadata.HDThanksPage}
                        toggleContinueElement={setShowContinueButton} />
                </div>
            ]
        }
    ];
    const affordabilityCheck = _.get(multiCustomizeSubmissionVM, 'value.insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);

    if (affordabilityCheck !== PAYMENT_TYPE_ANNUALLY_CODE) {
        componentArray.splice(5, 0, {
            id: 'MCDirectDebitPage',
            pages: [
                <div ref={elRefs[0]}>
                    <HDMCDirectDebitPage
                        pageMetadata={pageMetadata.HDMCDirectDebitPage}
                        parentContinue={handleContinueTriggerButton}
                        toggleContinueElement={setShowContinueButton}
                        onGoBack={goBack} />
                </div>
            ]
        });
        DIRECT_DEBIT_PAGE_INDEX = 5;
        PAYMENT_PAGE_INDEX = 6;
        PASSWORD_PAGE_INDEX = 7;
        THANKS_PAGE_INDEX = 8;
    } else if (affordabilityCheck === PAYMENT_TYPE_ANNUALLY_CODE) {
        DIRECT_DEBIT_PAGE_INDEX = -1;
        PAYMENT_PAGE_INDEX = 5;
        PASSWORD_PAGE_INDEX = 6;
        THANKS_PAGE_INDEX = 7;
    }

    const getWizardContent = () => componentArray[routeIndex].pages.slice(0, (subRouteIndex + 1));

    const getContinueLabel = () => {
        switch (routeIndex) {
            case IMPORTANT_STUFF_PAGE_INDEX:
            case DIRECT_DEBIT_PAGE_INDEX:
                return messages.agreeAndContinueLabel;
            default:
                return messages.continueLabel;
        }
    };

    const continueBtnContainerProps = {
        ...(routeIndex === DIRECT_DEBIT_PAGE_INDEX)
        && { className: 'container-continue-btn' }
    };

    const continueBtnColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 10, offset: 1 },
        ...(routeIndex === DIRECT_DEBIT_PAGE_INDEX)
        && { md: { span: 10, offset: 0 } }
    };

    const continueBtnColPropsBtn = {
        xs: { span: 12, offset: 0 },
        md: { span: 4, offset: 0 },
        lg: { span: 3, offset: 0 },
        ...(routeIndex === DIRECT_DEBIT_PAGE_INDEX)
        && { md: { span: 6, offset: 0 }, lg: { span: 5, offset: 0 }, xl: { span: 4, offset: 0 } },
        ...(routeIndex === IMPORTANT_STUFF_PAGE_INDEX)
        && { md: { span: 4, offset: 4 }, lg: { span: 4, offset: 4 } }
    };

    const getContinueButtonAnalyticsPage = () => {
        switch (routeIndex) {
            case SUMMARY_PAGE_INDEX: return pageMetadata.HDMCCustomizeQuoteSummaryPage.page_name;
            case PNCD: return pageMetadata.HDMCPNCDPage.page_name;
            case ANCILLARY_INDEX: return pageMetadata.HDMCAncillariesPage.page_name;
            case IMPORTANT_STUFF_PAGE_INDEX: return pageMetadata.HDMCImportantStuffPage.page_name;
            case MC_CCD: return pageMetadata.HDMCConfirmContactDetailsPage.page_name;
            case DIRECT_DEBIT_PAGE_INDEX: return pageMetadata.HDMCDirectDebitPage.page_name;
            case THANKS_PAGE_INDEX: return pageMetadata.HDMCThanksPage.page_name;
            default: return pageMetadata.HDCustomizeQuoteWizard.page_name;
        }
    };

    return (
        <Container fluid className={`customize-quote-wizard-wrapper customize-quote-wizard mc-customize-quote-wizard page-content-wrapper ${routeIndex !== IMPORTANT_STUFF_PAGE_INDEX ? ' mc-important-stuff' : ''}`}>
            <input type="text" hidden id="qabBlackBoxRequest" ref={blackBoxRef} />
            <div className="wizard-content">
                {getWizardContent()}
            </div>
            {
                showContinueButton && routeIndex !== ANCILLARY_INDEX && routeIndex !== DIRECT_DEBIT_PAGE_INDEX && (
                    <Container fluid className="margin-bottom-only-mobile-lg">
                        <Container {...continueBtnContainerProps}>
                            <Row className="background-mono customize-quote-wizard__continue">
                                <Col {...continueBtnColProps}>
                                    <Row>
                                        <Col {...continueBtnColPropsBtn} className="p-0">
                                            <HDButtonRefactor
                                                webAnalyticsEvent={{ event_action: `Continue - Redirecting from: ${getContinueButtonAnalyticsPage()}` }}
                                                className="mc-customize-quote-wizard__continue-button theme-white"
                                                size="md"
                                                label={getContinueLabel()}
                                                disabled={disabledContinue}
                                                onClick={handleContinueTriggerButton} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                )
            }
            {
                showIovationModal
                && (
                    <HDModal
                        webAnalyticsView={{ ...pageMetadata.HDCustomizeQuoteWizard, page_section: messages.iovationHeader }}
                        webAnalyticsEvent={{ event_action: messages.iovationHeader }}
                        id="iovation-modal"
                        customStyle="customize-quote"
                        show={showIovationModal}
                        headerText={messages.iovationHeader}
                        confirmLabel={messages.iovationConfirmLabel}
                        onConfirm={() => window.location.assign(HOMEPAGE)}
                        hideCancelButton
                        hideClose
                    >
                        {messages.iovationModalContent.map((paragraph) => (
                            <p key={paragraph}>
                                {paragraph}
                            </p>
                        ))}
                    </HDModal>
                )
            }
            {
                (routeIndex < PAYMENT_PAGE_INDEX) && (
                    <div className={`customize-quote-email ${routeIndex === MC_CCD ? ' contact-details-email' : ''}`}>
                        <HDCustomizeQuoteFooterPage
                            pageId={multicarCustomizeQuoteSummaryPage}
                            quoteID={quotedData.mpwrapperNumber}
                            pageMetadata={pageMetadata.HDCustomizeQuoteFooterPage} />
                    </div>
                )
            }
            {HDToast}
            {HDFullscreenLoader}
        </Container>
    );
};

const mapStateToProps = (state) => {
    // Taking the quoted data from mcsubmissionVM because use effect hook is not triggered by changes in the value() of multiCustomizeSubmissionVM
    const quotedData = state.wizardState.data.mcsubmissionVM ? { ...state.wizardState.data.mcsubmissionVM.value } : null;
    return {
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        mcupdateMarketingPreferencesModel: state.mcupdateMarketingPreferencesModel,
        quotedData,
    };
};

HDMCCustomizeQuoteWizard.propTypes = {
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }),
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired,
    mcUpdateMarketingPreference: PropTypes.func,
    mcupdateMarketingPreferencesModel: PropTypes.shape({
        loading: PropTypes.bool,
        marketingUpdatedObj: PropTypes.shape({})
    }),
    dispatch: PropTypes.func,
    quotedData: PropTypes.shape({ quotes: PropTypes.array.isRequired, mpwrapperJobNumber: PropTypes.string, mpwrapperNumber: PropTypes.string })
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    mcUpdateMarketingPreference: mcUpdateMarketingPreference,
});

HDMCCustomizeQuoteWizard.defaultProps = {
    multiCustomizeSubmissionVM: null,
    mcupdateMarketingPreferencesModel: null,
    dispatch: null,
    mcUpdateMarketingPreference: () => { },
    quotedData: null,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDMCCustomizeQuoteWizard));
