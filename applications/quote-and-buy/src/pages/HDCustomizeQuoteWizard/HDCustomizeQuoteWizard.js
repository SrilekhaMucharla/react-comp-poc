/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import React, {
    createRef, useEffect, useState, useRef
} from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import { HastingsValidationService } from 'hastings-capability-validation';
import {
    HDLabelRefactor
} from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDModal as HDModal
} from '../../web-analytics';
import { trackView } from '../../web-analytics/trackData';
import BackNavigation from '../Controls/BackNavigation/BackNavigation';
import {
    HDCustomizeQuoteSummaryPage,
    HDKeyCoverAncillaryPage,
    HDPersonalAccidentsPage,
    HDSubstituteVehiclePage,
    HDCustomizeQuoteBreakDownCoverPage,
    HDMotorLegalPage,
    HDConfirmContactDetailsPage,
    HDImportantStuffPage,
    HDCustomizeQuoteFooterPage,
    HDDirectDebitPage,
    HDAutomaticUpgrade,
    HDThanksPage,
    HDPaymentPage,
    HDCreatePasswordPage,
    HDBindErrorPage,
    HDPNCDPage
} from '../wizard-pages';
import useFullscreenLoader from '../Controls/Loader/useFullscreenLoader';
import * as messages from './HDCustomizeQuoteWizard.messages';
// import './HDCustomizeQuoteWizard.scss';
import {
    CUSTOMISE_QUOTE,
    THANK_YOU,
    AUTOMATIC_UPGRADE,
    LEGAL,
    MISCELLANEOUS
} from '../../customer/directintegrations/faq/epticaMapping';
import {
    customizeWizardConfig,
    customizeWizardConfigYDWithDebit,
    customizeWizardConfigDebit,
    customizeWizardConfigYDWithoutDebit
} from './HDCustomizeQuoteWizard.config';
import {
    PAYMENT_TYPE_ANNUALLY_CODE,
    HASTINGS_ESSENTIAL,
    HOMEPAGE,
    UPGRADE,
    DOWNGRADE,
    HASTINGS_DIRECT,
    HASTINGS_PREMIER,
    PRIVACY_HEADER_HEIGHT,
    HEADER_HEIGHT_MOBILE
} from '../../constant/const';
import HDPrimerYouDrivePage from '../wizard-pages/HDPrimerYouDrivePage/HDPrimerYouDrivePage';
import { customizeQuoteSummaryPage } from '../HastingsDOBInterstitialPage/HastingsDOBInterstititalPage.messages';
import {
    updateCustomQuote as updateCustomQuoteAction,
    updateEpticaId as updateEpticaIdAction,
    setCustomizeSubmissionVM as setCustomizeSubmissionVMAction,
    setNavigation,
    updateQuoteCoverages
} from '../../redux-thunk/actions';
import pageMetadata from './HDCustomizeQuotePageMetadata';
import arcTop from '../../assets/images/background/top-arc.svg';
import {
    isHigherBrandsAvailable
} from '../../common/utils';
import { faultyClaims } from '../../common/faultClaimsHelper';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../wizard-pages/__helpers__/policyErrorCheck';

const SUMMARY_PAGE_INDEX = 0;
let DIRECT_DEBIT_PAGE_INDEX;
let PAYMENT_PAGE_INDEX;
let PASSWORD_PAGE_INDEX;
let THANKS_PAGE_INDEX;
let CONTACT_DETAILS_PAGE_INDEX;
let YOU_DRIVE_PAGE_INDEX;
let IMPORTANT_STUFF_PAGE_INDEX;
let ANCILLARY_INDEX = 2;
let PNCD_PAGE_INDEX = 1;
let AUTOMATIC_UPGRADE_INDEX = 3;
function HDCustomizeQuoteWizard(props) {
    const {
        submissionVM,
        customizeSubmissionVM,
        updateEpticaId,
        offeredQuoteObject,
        setCustomizeSubmissionVM,
        updateDDIVM,
        dispatch,
    } = props;
    const [showContinue, setContinueElement] = useState(true);
    const [showDowngradeModal, setShowDowngradeModal] = useState(false);
    const [showManualUpgrade, setShowManualUpgrade] = useState(false);
    const [showManualDowngrade, setShowManualDowngrade] = useState(false);
    const [upgradeOrDowngrade, setUpgradeOrDowngrade] = useState(null);
    const [changingBrand, setChangingBrand] = useState(false);
    const [disabledContinue, setDisabledContinue] = useState(false);
    const [routeIndex, setRouteIndex] = useState(0);
    const [subRouteIndex, setSubRouteIndex] = useState(0);
    const [elRefs, setElRefs] = React.useState([]);
    const [showDirectDebitModal, setShowDirectDebitModal] = useState(false);
    const [brandCode, setBrandCode] = useState(null);
    const vehicleDetailsFromSubmission = _.get(submissionVM, 'value.baseData', null);
    const insurancePaymentType = (vehicleDetailsFromSubmission)
        ? vehicleDetailsFromSubmission.affordablePaymentPlan : PAYMENT_TYPE_ANNUALLY_CODE;
    const [paymentType, setPaymentType] = useState(insurancePaymentType);
    if (customizeSubmissionVM) {
        _.set(customizeSubmissionVM.value, 'insurancePaymentType', paymentType);
    }
    const [autoUpgraded, setAutoUpgrade] = useState(false);
    const [brand, setBrand] = useState(null);
    const [showIovationModal, setShowIovationModal] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [displayPNCDPage, setDisplayPNCDPage] = useState();
    const history = useHistory();
    const insurerPath = 'baseData.insurer';
    const blackBoxRef = useRef(null);
    const [iovationCalled, setIovationCalled] = useState(false);
    const [blackBoxRequest, setBlackBoxRequest] = useState();
    const preUpgradeObject = useSelector((state) => state.wizardState.app.autoUpgradeData);
    const updateQuoteCoverage = useSelector((state) => (state.updateQuoteCoveragesModel));
    const location = useLocation();

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
    useEffect(() => {
        // reset scroll for history entry push
        window.scroll(0, 0);
        // window.scrollTo(0, 0);
        // block initial go-back attempt to GAP wizard
        history.push(history.location.pathname);

        dispatch(updateEpticaId(CUSTOMISE_QUOTE));
        dispatch(setNavigation({ isEditQuoteJourney: false, isEditQuoteJourneyFromSummmary: false }));
        const requestValue = blackBoxRef && blackBoxRef.current && blackBoxRef.current.value ? blackBoxRef.current.value : null;
        if (!requestValue) {
            loadIovationFiles();
        }
    }, []);

    useEffect(() => {
        const tmpElRefs = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < componentArray[routeIndex].pages.length; i++) {
            tmpElRefs[i] = createRef();
        }
        setElRefs(tmpElRefs);
    }, [routeIndex]);
    useEffect(() => {
        if (elRefs[subRouteIndex]) {
            if (subRouteIndex === 0) {
                window.scroll(0, 0);
            } else {
                window.scrollTo({
                    top: elRefs[subRouteIndex].current.offsetTop + getAdditionalScrollOffset(),
                    behavior: 'smooth'
                });
            }
        }
    }, [elRefs, subRouteIndex]);

    useEffect(() => {
        isPNCDOffered();
    }, [customizeSubmissionVM]);

    const retrieveBlackBoxRequest = (blackBoxReq) => {
        setBlackBoxRequest(blackBoxReq);
    };

    const goBack = () => {
        const branchCode = _.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '');
        if (routeIndex === 0) {
            setSubRouteIndex(0);
            // eslint-disable-next-line react/prop-types
            props.history.goBack();
        }
        if (routeIndex === IMPORTANT_STUFF_PAGE_INDEX && branchCode === 'YD') {
            setSubRouteIndex(0);
            setRouteIndex(routeIndex - 2);
            dispatch(updateEpticaId(uiArraySet[routeIndex - 2].epticaIds[0]));
            return;
        }
        if (routeIndex === ANCILLARY_INDEX && branchCode === 'YD' && !displayPNCDPage) {
            const newSubRouteIndex = componentArray[routeIndex - 2].pages.length - 1;
            setSubRouteIndex(newSubRouteIndex);
            setRouteIndex(routeIndex - 2);
            dispatch(updateEpticaId(uiArraySet[routeIndex - 2].epticaIds[newSubRouteIndex]));
            return;
        }
        if (routeIndex === IMPORTANT_STUFF_PAGE_INDEX && branchCode !== 'YD') {
            if (!autoUpgraded && !preUpgradeObject) {
                setSubRouteIndex(0);
                setRouteIndex(ANCILLARY_INDEX);
                dispatch(updateEpticaId(LEGAL));
            } else {
                setSubRouteIndex(componentArray[routeIndex - 1].pages.length - 1);
                setRouteIndex(AUTOMATIC_UPGRADE_INDEX);
                dispatch(updateEpticaId(AUTOMATIC_UPGRADE));
            }
        } else if (routeIndex === ANCILLARY_INDEX && !displayPNCDPage) {
            const newSubRouteIndex = componentArray[routeIndex - 1].pages.length - 1;
            setSubRouteIndex(newSubRouteIndex);
            setRouteIndex(SUMMARY_PAGE_INDEX);
            dispatch(updateEpticaId(uiArraySet[SUMMARY_PAGE_INDEX].epticaIds[newSubRouteIndex]));
        } else if (checkIfDDPage()) {
            setShowDirectDebitModal(true);
        } else {
            const lastSubRouteIndex = routeIndex === AUTOMATIC_UPGRADE_INDEX ? 0 : componentArray[routeIndex - 1].pages.length - 1;
            setSubRouteIndex(lastSubRouteIndex);
            setRouteIndex(routeIndex - 1);
            dispatch(updateEpticaId(uiArraySet[routeIndex - 1].epticaIds[lastSubRouteIndex]));

            if (routeIndex - 1 === SUMMARY_PAGE_INDEX && isUpgradable()) {
                setShowManualUpgrade(true);
                setShowManualDowngrade(false);
            } else {
                setShowManualUpgrade(false);
            }
        }
    };

    const hasQuoteErrors = () => {
        const customQuoteObject = [_.get(customizeSubmissionVM, 'value.quote', {})];
        return (isUWErrorPresent(customQuoteObject)
        || isGrayListErrorPresent(customQuoteObject)
        || isCueErrorPresent(customQuoteObject));
    };

    useEffect(() => {
        // block subsequent go-back attempts to GAP wizard
        const handleBrowserBack = (newLocation, action) => {
            if (action === 'POP') {
                history.push(history.location.pathname);
                if (routeIndex !== 0 && !hasQuoteErrors()) {
                    goBack();
                }
            }
        };

        const unlisten = history.listen(handleBrowserBack);
        return unlisten;
    }, [routeIndex]);

    const getCurrentAnalyticsPageMetadata = () => {
        switch (routeIndex) {
            case SUMMARY_PAGE_INDEX: return pageMetadata.HDCustomizeQuoteSummaryPage;
            case DIRECT_DEBIT_PAGE_INDEX: return pageMetadata.HDDirectDebitPage;
            case PAYMENT_PAGE_INDEX: return pageMetadata.HDCustomizeQuoteSummaryPage;
            case THANKS_PAGE_INDEX: return pageMetadata.HDThanksPage;
            case CONTACT_DETAILS_PAGE_INDEX: return pageMetadata.HDConfirmContactDetailsPage;
            case YOU_DRIVE_PAGE_INDEX: return pageMetadata.HDPrimerYouDrivePage;
            case ANCILLARY_INDEX: return pageMetadata.HDAncillariesPage;
            case PASSWORD_PAGE_INDEX: return pageMetadata.HDCreatePasswordPage;
            case IMPORTANT_STUFF_PAGE_INDEX: return pageMetadata.HDImportantStuffPage;
            case PNCD_PAGE_INDEX: return pageMetadata.HDPNCDPage;
            case AUTOMATIC_UPGRADE_INDEX: return pageMetadata.HDAutomaticUpgrade;
            default: return pageMetadata.HDCustomizeQuoteWizard;
        }
    };

    useEffect(() => {
        trackView({
            page_section: 'Page',
            ...getCurrentAnalyticsPageMetadata()
        });
    }, [routeIndex, subRouteIndex]);

    const compareValue = () => {
        const updatedFName = _.get(updateDDIVM, 'value.payerDetails.firstName');
        const updateLName = _.get(updateDDIVM, 'value.payerDetails.lastName');
        const fName = submissionVM.value.baseData.accountHolder.firstName;
        const lName = submissionVM.value.baseData.accountHolder.lastName;
        const postCode = submissionVM.value.baseData.accountHolder.primaryAddress.postalCode;
        const updatedPostalCode = _.get(updateDDIVM, 'value.payerAddress.postalCode');
        const updatedAddress = _.get(updateDDIVM, 'value.payerAddress.addressLine1');
        const address = submissionVM.value.baseData.accountHolder.primaryAddress.addressLine1;
        const prefixValue = submissionVM.value.baseData.accountHolder.prefix;
        const updatedPrefix = _.get(updateDDIVM, 'value.payerDetails.prefix');

        if (updatedFName !== fName || updateLName !== lName
            || postCode !== updatedPostalCode || updatedAddress !== address
            || prefixValue !== updatedPrefix) {
            return true;
        }
    };

    const checkIfDDPage = () => {
        const branchCode = _.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '');
        const paymentMode = _.get(customizeSubmissionVM, 'value.insurancePaymentType');
        if ((routeIndex === DIRECT_DEBIT_PAGE_INDEX || routeIndex === DIRECT_DEBIT_PAGE_INDEX && branchCode === 'YD') && paymentMode !== '1' && compareValue()) {
            return true;
        }
    };
    const loadIovationFiles = () => {
        const insurer = (_.get(submissionVM, insurerPath));
        if (insurer && insurer.value && insurer.value.code && insurer.value.code === '437') {
            const jsFiles = ['quote-and-buy/js/config.js', 'quote-and-buy/js/loader.js']; // remove the quote-and-buy/ for testing in local
            for (const files in jsFiles) {
                const script = document.createElement('script');
                script.src = jsFiles[files];
                script.type = 'text/javascript';
                script.async = false;
                document.head.appendChild(script);
            }
        }
    };

    const callIovation = () => {
        const requestValue = blackBoxRef && blackBoxRef.current && blackBoxRef.current.value ? blackBoxRef.current.value : null;
        if (requestValue) {
            const quoteId = _.get(customizeSubmissionVM, 'quoteID.value');
            const requestDto = {
                accountCode: quoteId,
                beginBlackBox: requestValue
            };
            HastingsValidationService.checkTransactionDetails(requestDto)
                .then((validationResponse) => {
                    const response = validationResponse.result.result;
                    if (response === 'D') {
                        setShowIovationModal(true);
                    } else {
                        setShowIovationModal(false);
                    }
                })
                .catch(() => {
                    setShowIovationModal(false);
                });
        } else {
            setShowIovationModal(false);
        }
    };

    const toggleContinueElement = (doEnable) => {
        setContinueElement(doEnable);
        if (routeIndex === 5) {
            if (!iovationCalled) {
                setIovationCalled(true);
                callIovation();
            }
        }
    };

    const handleUpgrade = (newBrand) => {
        setUpgradeOrDowngrade(UPGRADE);
        setBrand(newBrand);
    };

    const handleDowngrade = (newBrand) => {
        setUpgradeOrDowngrade(DOWNGRADE);
        setBrand(newBrand);
    };

    const loadPage = (forward, index) => {
        if (forward) {
            handleForward(index);
        } else {
            goBack();
        }
    };

    const moveToNextRoute = () => {
        setSubRouteIndex(0);
        const branchCode = _.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '');
        if (routeIndex < componentArray.length - 1) {
            if (routeIndex === SUMMARY_PAGE_INDEX && !displayPNCDPage && branchCode !== 'YD') {
                setRouteIndex(routeIndex + 2);
                dispatch(updateEpticaId(uiArraySet[routeIndex + 2].epticaIds[0]));
                return;
            }
            if (routeIndex === YOU_DRIVE_PAGE_INDEX && !displayPNCDPage && branchCode === 'YD') {
                setRouteIndex(routeIndex + 2);
                dispatch(updateEpticaId(uiArraySet[routeIndex + 2].epticaIds[0]));
                return;
            }
            if (routeIndex === ANCILLARY_INDEX && !autoUpgraded) {
                setRouteIndex(routeIndex + 2);
                dispatch(updateEpticaId(uiArraySet[routeIndex + 2].epticaIds[0]));
                window.scroll(0, 0);
                return;
            }
            window.scroll(0, 0);
            setRouteIndex(routeIndex + 1);
            dispatch(updateEpticaId(uiArraySet[routeIndex + 1].epticaIds[0]));
        }
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
    useEffect(() => {
        if (changingBrand) {
            if (customizeSubmissionVM
                && updateQuoteCoverage
                && (_.get(updateQuoteCoverage, 'quoteCoveragesObj')
                    && Object.keys(updateQuoteCoverage.quoteCoveragesObj).length > 0)) {
                hideLoader();
                _.set(customizeSubmissionVM, 'value', updateQuoteCoverage.quoteCoveragesObj);
                _.set(customizeSubmissionVM.value, 'otherOfferedQuotes', updateQuoteCoverage.quoteCoveragesObj.otherQuotes);
                _.set(submissionVM, 'value.lobData.privateCar.coverables', updateQuoteCoverage.quoteCoveragesObj.coverables);
                _.set(customizeSubmissionVM.value, 'ncdProtectionAdditionalAmount',
                    updateQuoteCoverage.quoteCoveragesObj.coverables.vehicles[0].ncdProtection.ncdProtectionAdditionalAmount);
                if (updateQuoteCoverage.quoteCoveragesObj.quote) {
                    _.set(submissionVM, 'value.baseData.brandCode', (updateQuoteCoverage.quoteCoveragesObj.quote.branchCode));
                }
                _.unset(customizeSubmissionVM, 'value.otherQuotes');
                setCustomizeSubmissionVM({ customizeSubmissionVM });
                if (routeIndex !== messages.motorLegalIndex) {
                    moveToNextRoute();
                    setBrandCode(_.get(customizeSubmissionVM, 'value.quote.branchCode'));
                } else {
                    setShowDowngradeModal(false);
                    setShowManualDowngrade(false);
                }
                setChangingBrand(false);
            }
        }
    }, [updateQuoteCoverage]);

    const cancelUpgradeOrDowngrade = () => {
        setUpgradeOrDowngrade(null);
    };

    const componentArray = [
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDCustomizeQuoteSummaryPage
                        pageMetadata={pageMetadata.HDCustomizeQuoteSummaryPage}
                        toggleContinueElement={toggleContinueElement}
                        disableContinueElement={setDisabledContinue}
                        onUpgrade={handleUpgrade}
                        onDowngrade={handleDowngrade}
                        onUpgradeDowngradeCancellation={cancelUpgradeOrDowngrade}
                        paymentType={paymentType}
                        retrieveBlackBoxRequest={retrieveBlackBoxRequest}
                        onPaymentTypeChange={setPaymentType}
                        showManualUpgrade={showManualUpgrade}
                        setShowManualUpgrade={setShowManualUpgrade}
                        showManualDowngrade={showManualDowngrade}
                        setShowManualDowngrade={setShowManualDowngrade} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDPNCDPage
                        toggleContinueElement={toggleContinueElement}
                        triggerNextRoute={moveToNextRoute}
                        pageMetadata={pageMetadata.HDPNCDPage} />

                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDMotorLegalPage
                        pageMetadata={pageMetadata.HDMotorLegalPage}
                        toggleContinueElement={toggleContinueElement}
                        showManualDowngrade={showManualDowngrade}
                        setShowManualDowngrade={setShowManualDowngrade}
                        onUpgradeDowngradeCancellation={cancelUpgradeOrDowngrade}
                        onUpgrade={handleUpgrade}
                        onDowngrade={handleDowngrade}
                        onGoBack={goBack}
                        displayPNCDPage={displayPNCDPage}
                        key={0}
                        navigate={(f) => loadPage(f, 0)} />

                </div>,
                <div ref={elRefs[1]}>
                    <HDCustomizeQuoteBreakDownCoverPage
                        pageMetadata={pageMetadata.HDCustomizeQuoteBreakDownCoverPage}
                        toggleContinueElement={toggleContinueElement}
                        key={1}
                        navigate={(f) => loadPage(f, 1)} />
                </div>,
                <div ref={elRefs[2]}>
                    <HDPersonalAccidentsPage
                        pageMetadata={pageMetadata.HDPersonalAccidentsPage}
                        toggleContinueElement={toggleContinueElement}
                        key={2}
                        navigate={(f) => loadPage(f, 2)} />

                </div>,
                <div ref={elRefs[3]}>
                    <HDSubstituteVehiclePage
                        pageMetadata={pageMetadata.HDSubstituteVehiclePage}
                        toggleContinueElement={toggleContinueElement}
                        key={3}
                        navigate={(f) => loadPage(f, 3)} />

                </div>,
                <div ref={elRefs[4]}>
                    <HDKeyCoverAncillaryPage
                        pageMetadata={pageMetadata.HDKeyCoverAncillaryPage}
                        toggleContinueElement={toggleContinueElement}
                        key={4}
                        navigate={(f) => loadPage(f, 4)} />

                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDAutomaticUpgrade
                        pageMetadata={pageMetadata.HDAutomaticUpgrade}
                        toggleContinueElement={toggleContinueElement}
                        navigate={(f) => loadPage(f, 0)}
                        onGoBack={goBack} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDImportantStuffPage
                        pageMetadata={pageMetadata.HDImportantStuffPage}
                        toggleContinueElement={toggleContinueElement}
                        paymentType={paymentType}
                        onGoBack={goBack}
                        onPaymentTypeChange={setPaymentType} />
                </div>]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDConfirmContactDetailsPage
                        pageMetadata={pageMetadata.HDConfirmContactDetailsPage}
                        toggleContinueElement={toggleContinueElement}
                        onGoBack={goBack}
                        onMarketingPreferencesSuccess={moveToNextRoute} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDPaymentPage
                        pageMetadata={pageMetadata.HDPaymentPage}
                        toggleContinueElement={toggleContinueElement}
                        paymentType={paymentType}
                        onPaymentSuccess={moveToNextRoute}
                        onMoveThankYouPage={moveToThankYouPage}
                        onBindFailure={moveToBindErrorPage}
                        onAbort={goBack} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDCreatePasswordPage
                        pageMetadata={pageMetadata.HDCreatePasswordPage}
                        toggleContinueElement={toggleContinueElement}
                        onSetNewPassSuccess={moveToNextRoute} />
                </div>
            ]
        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDThanksPage
                        pageMetadata={pageMetadata.HDThanksPage}
                        toggleContinueElement={toggleContinueElement} />
                </div>
            ]

        },
        {
            pages: [
                <div ref={elRefs[0]}>
                    <HDBindErrorPage
                        pageMetadata={pageMetadata.HDThanksPage}

                        toggleContinueElement={toggleContinueElement} />
                </div>
            ]
        }
    ];

    const isPNCDOffered = () => {
        const ncdYears = _.get(customizeSubmissionVM, 'value.ncdgrantedYears');
        const claimsDetails = faultyClaims(submissionVM);
        if (ncdYears >= 1 && claimsDetails && claimsDetails.length < 2) {
            setDisplayPNCDPage(true);
            return true;
        }
        setDisplayPNCDPage(false);
        return false;
    };

    let uiArraySet;

    if (_.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '') === 'YD'
        && _.get(customizeSubmissionVM, 'value.insurancePaymentType') !== PAYMENT_TYPE_ANNUALLY_CODE) {
        componentArray.splice(1, 0, {
            pages: [
                <div ref={elRefs[0]}>
                    <HDPrimerYouDrivePage
                        pageMetadata={pageMetadata.HDPrimerYouDrivePage}
                        toggleContinueElement={toggleContinueElement}
                        onGoBack={goBack}
                        primerYouDriveFlag={moveToNextRoute} />
                </div>
            ]
        });
        componentArray.splice(7, 0, {
            pages: [
                <div ref={elRefs[0]}>
                    <HDDirectDebitPage
                        pageMetadata={pageMetadata.HDDirectDebitPage}
                        triggerNextRoute={moveToNextRoute}
                        toggleContinueElement={toggleContinueElement}
                        onGoBack={goBack} />
                </div>
            ]
        });
        uiArraySet = customizeWizardConfigYDWithDebit;
        YOU_DRIVE_PAGE_INDEX = 1;
        PNCD_PAGE_INDEX = 2;
        ANCILLARY_INDEX = 3;
        AUTOMATIC_UPGRADE_INDEX = 4;
        IMPORTANT_STUFF_PAGE_INDEX = 5;
        CONTACT_DETAILS_PAGE_INDEX = 6;
        DIRECT_DEBIT_PAGE_INDEX = 7;
        PAYMENT_PAGE_INDEX = 8;
        PASSWORD_PAGE_INDEX = 9;
        THANKS_PAGE_INDEX = 10;
    } else if (_.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '') !== 'YD'
        && _.get(customizeSubmissionVM, 'value.insurancePaymentType') !== PAYMENT_TYPE_ANNUALLY_CODE) {
        componentArray.splice(6, 0, {
            pages: [
                <div ref={elRefs[0]}>
                    <HDDirectDebitPage
                        pageMetadata={pageMetadata.HDDirectDebitPage}
                        toggleContinueElement={toggleContinueElement}
                        triggerNextRoute={moveToNextRoute}
                        onGoBack={goBack} />
                </div>
            ]
        });
        uiArraySet = customizeWizardConfigDebit;
        IMPORTANT_STUFF_PAGE_INDEX = 4;
        CONTACT_DETAILS_PAGE_INDEX = 5;
        DIRECT_DEBIT_PAGE_INDEX = 6;
        PAYMENT_PAGE_INDEX = 7;
        PASSWORD_PAGE_INDEX = 8;
        THANKS_PAGE_INDEX = 9;
    } else if (_.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '') === 'YD'
        && _.get(customizeSubmissionVM, 'value.insurancePaymentType') === PAYMENT_TYPE_ANNUALLY_CODE) {
        componentArray.splice(1, 0, {
            pages: [
                <div ref={elRefs[0]}>
                    <HDPrimerYouDrivePage
                        pageMetadata={pageMetadata.HDPrimerYouDrivePage}
                        toggleContinueElement={toggleContinueElement}
                        onGoBack={goBack}
                        primerYouDriveFlag={moveToNextRoute} />
                </div>
            ]
        });
        uiArraySet = customizeWizardConfigYDWithoutDebit;
        YOU_DRIVE_PAGE_INDEX = 1;
        PNCD_PAGE_INDEX = 2;
        ANCILLARY_INDEX = 3;
        AUTOMATIC_UPGRADE_INDEX = 4;
        IMPORTANT_STUFF_PAGE_INDEX = 5;
        CONTACT_DETAILS_PAGE_INDEX = 6;
        PAYMENT_PAGE_INDEX = 7;
        PASSWORD_PAGE_INDEX = 8;
        THANKS_PAGE_INDEX = 9;
        DIRECT_DEBIT_PAGE_INDEX = -1;
    } else if (_.get(offeredQuoteObject, 'offeredQuotes[0].branchCode', '') !== 'YD'
        && _.get(customizeSubmissionVM, 'value.insurancePaymentType') === PAYMENT_TYPE_ANNUALLY_CODE) {
        uiArraySet = customizeWizardConfig;
        IMPORTANT_STUFF_PAGE_INDEX = 4;
        CONTACT_DETAILS_PAGE_INDEX = 5;
        PAYMENT_PAGE_INDEX = 6;
        PASSWORD_PAGE_INDEX = 7;
        THANKS_PAGE_INDEX = 8;
        DIRECT_DEBIT_PAGE_INDEX = -1;
    }

    const isUpgradable = () => {
        const currentBrand = _.get(customizeSubmissionVM, 'value.quote.branchCode');
        return (currentBrand === HASTINGS_ESSENTIAL || currentBrand === HASTINGS_DIRECT) && isHigherBrandsAvailable(currentBrand, customizeSubmissionVM,
            submissionVM);
    };

    // Please make use of this method for redirection or any finishing logic
    const finishedWizard = () => {
        // console.log('WIZARD ENDS HERE.');
    };
    const setAutoUpgradeValue = () => {
        let motorLegalVal = 0;
        let breakDownVal = 0;
        let annualAmount = 0; let hpPremium = 0;
        let keyCoverVal = 0; let svVal = 0;
        let pacVal = 0;
        let keyCoverValHp = 0;
        let svValHp = 0;
        let pacValHp = 0;
        let breakDownValHp = 0;
        let isBreakdownSelected;
        let defaultKCVal = 0; let defaultPACVal = 0; let defaultSVVal = 0;
        setAutoUpgrade(false);
        const selectedBrand = _.get(customizeSubmissionVM, 'value.quote.branchCode');
        if (selectedBrand === HASTINGS_ESSENTIAL || selectedBrand === HASTINGS_DIRECT) {
            annualAmount = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount');
            let HPObject = (customizeSubmissionVM && customizeSubmissionVM.value
                && customizeSubmissionVM.value.otherOfferedQuotes.filter((data) => data.branchCode === HASTINGS_PREMIER)) || [];

            HPObject = HPObject.length && (HPObject[0].offeredQuote) ? HPObject : (customizeSubmissionVM && customizeSubmissionVM.value && customizeSubmissionVM.value.otherOfferedDataForUpgrade
                && customizeSubmissionVM.value.otherOfferedDataForUpgrade.filter((data) => data.branchCode === HASTINGS_PREMIER));

            if (_.isArray(HPObject) && HPObject && HPObject[0] && HPObject[0].offeredQuote) {
                hpPremium = (HPObject && HPObject[0].offeredQuote && HPObject[0].offeredQuote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount) || 0;
                HPObject && HPObject[0] && HPObject[0].coverages.privateCar.ancillaryCoverages.map((data) => {
                    data.coverages.map((nestedData) => {
                        if (nestedData.publicID === messages.RAC_ANC_EXT && nestedData.selected) {
                            breakDownValHp = nestedData.amount.amount;
                        }
                        if (nestedData.publicID === messages.KEY_COVER_ANC_EXT && nestedData.selected) {
                            keyCoverValHp = nestedData.amount.amount;
                        }
                        if (nestedData.publicID === messages.PERSONAL_ACCIDENT_ANC_EXT && nestedData.selected) {
                            pacValHp = nestedData.amount.amount;
                        }
                        if (nestedData.publicID === messages.SUBSTITUTE_VEHICLE_ANC_EXT && nestedData.selected) {
                            svValHp = nestedData.amount.amount;
                        }
                    });
                });
            } else {
                hpPremium = (HPObject && HPObject[0] && HPObject[0].hastingsPremium.annuallyPayment.premiumAnnualCost.amount) || 0;
            }
        }
        if (customizeSubmissionVM
            && customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages) {
            customizeSubmissionVM.value.coverages.privateCar.ancillaryCoverages.map((data) => {
                data.coverages.map((nestedData) => {
                    if (nestedData.publicID === messages.MOTOR_LEGAL_ANC_EXT && nestedData.selected) {
                        motorLegalVal = nestedData.amount.amount;
                    }
                    if (nestedData.publicID === messages.RAC_ANC_EXT && nestedData.selected) {
                        isBreakdownSelected = true;
                        breakDownVal = nestedData.amount.amount;
                    }
                    if (nestedData.publicID === messages.KEY_COVER_ANC_EXT) {
                        defaultKCVal = nestedData.amount.amount;
                        if (nestedData.selected) {
                            keyCoverVal = nestedData.amount.amount;
                        }
                    }
                    if (nestedData.publicID === messages.PERSONAL_ACCIDENT_ANC_EXT) {
                        defaultPACVal = nestedData.amount.amount;
                        if (nestedData.selected) {
                            pacVal = nestedData.amount.amount;
                        }
                    }
                    if (nestedData.publicID === messages.SUBSTITUTE_VEHICLE_ANC_EXT) {
                        defaultSVVal = nestedData.amount.amount;
                        if (nestedData.selected) {
                            svVal = nestedData.amount.amount;
                        }
                    }
                });
            });
        }
        if (motorLegalVal > 0 && Boolean(isBreakdownSelected) && annualAmount > 0) {
            let sum = annualAmount;
            if (breakDownValHp !== breakDownVal && breakDownValHp < breakDownVal) {
                sum = annualAmount - (-(breakDownValHp - breakDownVal));
            }
            if (breakDownValHp !== breakDownVal && breakDownValHp > breakDownVal) {
                sum = annualAmount + (breakDownValHp - breakDownVal);
            }
            // sum = (svValHp >0)?(svVal>0)?sum:(sum+svVal);
            if (svValHp > 0) {
                sum = svVal > 0 ? sum : sum + defaultSVVal;
            }
            if (svValHp === 0) {
                sum = svVal > 0 ? sum - svVal : sum;
            }
            if (keyCoverValHp > 0) {
                sum = keyCoverVal > 0 ? sum : sum + defaultKCVal;
            }
            if (keyCoverValHp === 0) {
                sum = keyCoverVal > 0 ? sum - keyCoverVal : sum;
            }
            if (pacValHp > 0) {
                sum = pacVal > 0 ? sum : sum + defaultPACVal;
            }
            if (pacValHp === 0) {
                sum = pacVal > 0 ? sum - pacVal : sum;
            }
            if ((sum > hpPremium) && isUpgradable() && hpPremium > 0) {
                dispatch(setNavigation({
                    autoUpgradeData: {
                        quoteBeforeUpdate: _.cloneDeep(customizeSubmissionVM.value.quote),
                        premierObject: _.cloneDeep(customizeSubmissionVM.value.otherOfferedQuotes),
                    }
                }));
                setAutoUpgrade(true);
            }
        }
    };

    const handleForward = (index) => {
        setAutoUpgradeValue();
        if (routeIndex === componentArray.length - 1 && index === (componentArray[routeIndex].pages.length - 1)) {
            finishedWizard();
        } else if (index < subRouteIndex) {
            window.scrollTo({
                top: elRefs[index + 1].current.offsetTop + getAdditionalScrollOffset(),
                behavior: 'smooth'
            });
        } else if (componentArray[routeIndex].pages.length > 0) {
            if (subRouteIndex < componentArray[routeIndex].pages.length - 1) {
                setSubRouteIndex(subRouteIndex + 1);
                dispatch(updateEpticaId(uiArraySet[routeIndex].epticaIds[subRouteIndex + 1]));
            } else {
                moveToNextRoute();
            }
        } else {
            moveToNextRoute();
        }
    };

    const findCoveragesForBrand = (otherOfferedQuotes) => {
        const offerings = otherOfferedQuotes || []; // _.get(submissionVM, 'lobData.privateCar.offerings.value') || [];
        const { coverages } = offerings.find((offering) => offering.branchCode === brand);
        return coverages;
    };

    const addMissingBranchNameIfNeeded = (quotes) => quotes.map((quote) => {
        const { branchName, offeredQuote } = quote;
        if (!branchName && offeredQuote) {
            return {
                ...quote,
                branchName: offeredQuote.branchName
            };
        }
        return quote;
    });

    const changeBrand = () => {
        if (brand) {
            const otherOfferedQuotes = customizeSubmissionVM.value.otherOfferedDataForUpgrade || customizeSubmissionVM.value.otherOfferedQuotes || [];
            const newQuote = addMissingBranchNameIfNeeded(otherOfferedQuotes).find((quote) => quote.branchCode === brand);
            if (brand === HASTINGS_ESSENTIAL) {
                _.set(customizeSubmissionVM, 'value.coverType', 'comprehensive');
            }
            _.set(customizeSubmissionVM, 'value.quote', newQuote.offeredQuote || offeredQuoteObject.offeredQuotes[0]);
            _.set(offeredQuoteObject, 'offeredQuotes[0]', newQuote.offeredQuote || offeredQuoteObject.offeredQuotes[0]);
            _.set(customizeSubmissionVM, 'value.coverages', findCoveragesForBrand(otherOfferedQuotes));
            setChangingBrand(true);
            dispatch(updateQuoteCoverages(customizeSubmissionVM));
            showLoader();
        }
    };

    const handleContinueTriggerButton = () => {
        if (routeIndex === SUMMARY_PAGE_INDEX) {
            dispatch(setNavigation({
                isEditQuoteJourney: false,
                isAddAnotherCar: false,
                isEditQuoteJourneyFromSummmary: false
            }));
        }
        if (upgradeOrDowngrade === DOWNGRADE) {
            setShowDowngradeModal(true);
            setUpgradeOrDowngrade(null);
        } else if (upgradeOrDowngrade === UPGRADE) {
            setUpgradeOrDowngrade(null);
            changeBrand();
        } else if (routeIndex === SUMMARY_PAGE_INDEX && isUpgradable() && !showManualUpgrade) {
            setShowManualUpgrade(true);
        } else if (routeIndex === messages.motorLegalIndex && showManualDowngrade) {
            setShowManualDowngrade(false);
        } else if (routeIndex === componentArray.length - 1
            && subRouteIndex === (componentArray[routeIndex].pages.length - 1)) {
            finishedWizard();
        } else if (subRouteIndex < componentArray[routeIndex].pages.length - 1) {
            setSubRouteIndex(subRouteIndex + 1);
        } else {
            moveToNextRoute();
        }
    };

    const hideDowngradeModal = () => {
        setShowDowngradeModal(false);
    };

    const handleDowngradeConfirmation = () => {
        changeBrand();
        setShowDowngradeModal(false);
    };

    const confirmDirectDebitModal = () => {
        setSubRouteIndex(componentArray[routeIndex - 1].pages.length - 1);
        setRouteIndex(routeIndex - 1);
        setShowDirectDebitModal(false);
        _.set(props.updateDDIVM.value, 'payerDetails.firstName', submissionVM.value.baseData.accountHolder.firstName);
        _.set(props.updateDDIVM.value, 'payerDetails.lastName', submissionVM.value.baseData.accountHolder.lastName);
        _.set(props.updateDDIVM.value, 'payerAddress', submissionVM.value.baseData.accountHolder.primaryAddress);
        _.set(props.updateDDIVM.value, 'payerDetails.prefix', submissionVM.value.baseData.accountHolder.prefix);
    };

    const hideDirectDebitModal = () => {
        setShowDirectDebitModal(false);
    };

    const getWizardContent = () => {
        const wizardObject = componentArray[routeIndex].pages.slice(0, (subRouteIndex + 1)).map((item) => {
            return item;
        });
        return wizardObject;
    };

    // page refresh is navigating to the intro screen
    const errorRouteHandling = () => {
        props.history.push({ pathname: '/invalidURL', state: { from: location } });
    };

    const quoteID = _.get(submissionVM, 'value.quoteID');
    const selectedBrandCode = _.get(customizeSubmissionVM, 'value.quote.branchCode');
    const brandCodeValue = selectedBrandCode || brandCode;

    useEffect(() => {
        setBrandCode(_.get(customizeSubmissionVM, 'value.quote.branchCode'));
    }, [customizeSubmissionVM]);

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
        && { md: { span: 6, offset: 0 }, lg: { span: 5, offset: 0 }, xl: { span: 4, offset: 0 } }
        || (showManualDowngrade || showManualUpgrade || routeIndex === IMPORTANT_STUFF_PAGE_INDEX)
        && { md: { span: 4, offset: 4 }, lg: { span: 4, offset: 4 } }
    };

    const marginBottomWizardContent = {
        ...(routeIndex === IMPORTANT_STUFF_PAGE_INDEX)
        && { className: 'margin-botom-wizard-content' }
    };

    return (
        <Container fluid className="customize-quote-wizard-wrapper customize-quote-wizard page-content-wrapper">
            <input type="text" hidden id="qabBlackBoxRequest" ref={blackBoxRef} />
            <div>
                {
                    (routeIndex !== SUMMARY_PAGE_INDEX
                        && routeIndex < PAYMENT_PAGE_INDEX
                        && routeIndex !== THANKS_PAGE_INDEX
                        && routeIndex !== CONTACT_DETAILS_PAGE_INDEX
                        && routeIndex !== DIRECT_DEBIT_PAGE_INDEX
                        && routeIndex !== YOU_DRIVE_PAGE_INDEX
                        && routeIndex !== IMPORTANT_STUFF_PAGE_INDEX
                        && routeIndex !== AUTOMATIC_UPGRADE_INDEX)
                    && ((routeIndex !== ANCILLARY_INDEX && displayPNCDPage)
                        || (routeIndex === ANCILLARY_INDEX && !displayPNCDPage))
                    && (
                        <Row className="mx-0 wizard-head arc-header">
                            <Col xs={uiArraySet[routeIndex].measurement[0].header}>
                                <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                                <BackNavigation
                                    id="backNavMainWizard"
                                    className="back-button"
                                    onClick={goBack}
                                    onKeyPress={goBack} />
                                <Row className="pt-5 pt-md-3 pb-4 text-md-center">
                                    <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                                        <div className="container--anc">
                                            <HDLabelRefactor
                                                Tag="h1"
                                                text={messages.beforeYouPay}
                                                className="wizard-title" />
                                            <p className="wizard-description">
                                                {messages.pncdHeaderText}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )
                }
                {
                    (routeIndex === YOU_DRIVE_PAGE_INDEX)
                    && (
                        <Row className="mx-0">
                            <Col xs={uiArraySet[routeIndex].measurement[0].header} className="wizard-head wizard-head-youdrive">
                                <BackNavigation
                                    id="backNavMainWizard"
                                    className="back-button"
                                    onClick={goBack}
                                    onKeyPress={goBack} />
                            </Col>
                        </Row>
                    )
                }
                <div
                    // xs={uiArraySet[routeIndex].measurement[1].bodyxs}
                    // md={uiArraySet[routeIndex].measurement[2].bodymd}
                    // ${!showContinue ? ' set-margin-bottom' : ''
                    className="wizard-content"
                >
                    {submissionVM && submissionVM.value && submissionVM.value.baseData ? getWizardContent() : errorRouteHandling()}
                </div>
                {
                    showContinue
                    && (
                        <Container fluid>
                            <Container {...continueBtnContainerProps}>
                                <Row className="background-mono customize-quote-wizard__continue">
                                    <Col {...continueBtnColProps}>
                                        <Row>
                                            <Col {...continueBtnColPropsBtn} className="p-0">
                                                <HDButton
                                                    webAnalyticsEvent={{ event_action: `Continue - Redirecting from: ${getCurrentAnalyticsPageMetadata().page_name}` }}
                                                    className="customize-quote-wizard__continue-button customize-quote-wizard__continue-button--margin-bottom theme-white"
                                                    size="lg"
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
                <HDModal
                    webAnalyticsView={{ ...pageMetadata.HDCustomizeQuoteWizard, page_section: messages.downgradeModalTitle }}
                    webAnalyticsEvent={{ event_action: messages.downgradeModalTitle }}
                    customStyle="footer-btns-w-100 rev-button-order"
                    show={showDowngradeModal}
                    headerText={messages.downgradeModalTitle}
                    confirmLabel={messages.downgradeModalConfirmBtnLabel}
                    cancelLabel={messages.downgradeModalCancelBtnLabel}
                    onCancel={hideDowngradeModal}
                    onConfirm={handleDowngradeConfirmation}
                    hideClose
                >
                    <p>
                        {messages.downgradeModalContent}
                    </p>
                </HDModal>
                <HDModal
                    webAnalyticsView={{ ...pageMetadata.HDCustomizeQuoteWizard, page_section: messages.debitModalTitle }}
                    webAnalyticsEvent={{ event_action: messages.debitModalTitle }}
                    customStyle="customize-quote rev-button-order"
                    show={showDirectDebitModal}
                    headerText={messages.debitModalTitle}
                    confirmLabel={messages.debitModalConfirmLabel}
                    cancelLabel={messages.debitModalCancelBtnLabel}
                    onCancel={hideDirectDebitModal}
                    onConfirm={confirmDirectDebitModal}
                    hideClose
                >
                    <p>
                        {messages.debitModalText}
                    </p>
                </HDModal>
                {/* className={`customize-quote-email${routeIndex === 3 ? ' contact-details-email' : ''}` */}
                {
                    (routeIndex < PAYMENT_PAGE_INDEX) && (
                        <div
                            xs={uiArraySet[routeIndex].measurement[0].header}
                            // eslint-disable-next-line max-len
                            className={`customize-quote-email ${routeIndex === CONTACT_DETAILS_PAGE_INDEX ? ' contact-details-email' : ''}`}
                        >
                            <HDCustomizeQuoteFooterPage
                                pageMetadata={pageMetadata.HDCustomizeQuoteFooterPage}
                                pageId={customizeQuoteSummaryPage}
                                quoteID={quoteID}
                                brand={brandCodeValue}
                                submissionVM={submissionVM} />
                        </div>
                    )
                }
            </div>
            {showIovationModal
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
                        {messages.iovationModalContent.map((paragraph, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <p key={i}>
                                {paragraph}
                            </p>
                        ))}
                    </HDModal>
                )
            }
            {HDFullscreenLoader}
        </Container>
    );
}

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    updateDDIVM: state.wizardState.data.updateDDIVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    offeredQuoteObject: state.offeredQuoteModel,
    customQuoteData: state.customQuoteModel,
});

const mapDispatchToProps = (dispatch) => ({
    updateCustomQuote: updateCustomQuoteAction,
    updateEpticaId: updateEpticaIdAction,
    setCustomizeSubmissionVM: setCustomizeSubmissionVMAction,
    dispatch
});
HDCustomizeQuoteWizard.propTypes = {
    submissionVM: PropTypes.shape({
        value: PropTypes.shape({
            baseData: PropTypes.shape({
                accountHolder: PropTypes.shape({
                    firstName: PropTypes.string,
                    lastName: PropTypes.string,
                    primaryAddress: PropTypes.shape({
                        postalCode: PropTypes.string,
                        addressLine1: PropTypes.string,
                    }),
                    prefix: PropTypes.string
                })
            })
        })
    }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    customQuoteData: PropTypes.shape({ loading: PropTypes.bool, customUpdatedQuoteObj: PropTypes.object }).isRequired,
    updateCustomQuote: PropTypes.func.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    setCustomizeSubmissionVM: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    updateDDIVM: PropTypes.shape({
        value: PropTypes.func
    }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDCustomizeQuoteWizard));
