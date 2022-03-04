/* eslint-disable no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import {
    HDForm,
    HDLabelRefactor
} from 'hastings-components';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
    useContext, useEffect, useMemo, useState, useCallback
} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import HDQuoteService from '../../../api/HDQuoteService';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import hdLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import heLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential.svg';
import hpLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import ydLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import getYoungAndInexperiencedExcess from '../../../common/getYoungAndInexperiencedExcess';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';
import { getAmount, getPriceWithCurrencySymbol } from '../../../common/utils';
import {
    CUE_ERROR_CODE,
    GREY_LIST_ERROR_CODE,
    HOMEPAGE,
    PAYMENT_TYPE_MONTHLY_CODE, QUOTE_DECLINE_ERROR_CODE, UW_ERROR_CODE, YOU_DRIVE,
    PAYMENT_TYPE_ANNUALLY_CODE
} from '../../../constant/const';
import EventEmmiter from '../../../EventHandler/event';
// import './HDYourQuotesPage.scss';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import {
    createQuote as createQuoteAction,
    markRerateModalAsDisplayed as markRerateModalDisplayedAction, setBackNavigationFlag as setBackNavigationFlagAction, setNavigation as setNavigationAction,
    setOfferedQuotesDetails as setOfferedQuotesDetailsAction
} from '../../../redux-thunk/actions';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDDatePicker as HDDatePicker,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDModal as HDModal, AnalyticsHDPolicySelect as HDPolicySelect, AnalyticsHDSwitch as HDSwitch,
    AnalyticsHDTable as HDTable
} from '../../../web-analytics';
import { trackAPICallFail, trackAPICallSuccess } from '../../../web-analytics/trackAPICall';
import { trackEvent } from '../../../web-analytics/trackData';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import useToast from '../../Controls/Toast/useToast';
import { isCueErrorPresent, isGrayListErrorPresent, isUWErrorPresent } from '../__helpers__/policyErrorCheck';
import { BRAND_AVAILABLE_FEATURE } from './HDBenefits';
import HDMoreDetailsPopup from './HDMoreDetailsPopup';
import HDVoluntaryExcessPopup from './HDVoluntaryExcessPopup';
import * as messages from './HDYourQuotesPage.messages';
import trackQuoteData from '../../../web-analytics/trackQuoteData';

const ICONS = {
    HE: heLogo,
    YD: ydLogo,
    HD: hdLogo,
    HP: hpLogo
};

const COVER_TYPES = {
    comprehensive: 0,
    tpft: 1
};

const AMOUNT_VALUE = 'AMOUNT';

const MAX_EXCESS_VALUE = '500';
const CURRENCY = 'gbp';
const maxExcessLabel = getPriceWithCurrencySymbol({ amount: MAX_EXCESS_VALUE, currency: CURRENCY });

const HDYourQuotesPage = ({
    submissionVM,
    setNavigation,
    setBackNavigationFlag,
    quoteObject,
    setOfferedQuotesDetails,
    createQuote,
    pageMetadata,
    handleForward,
    rerateModal: { status: hasRerateModalBeenShown },
    markRerateModalDisplayed,
    isEditQuoteJourney,
    canForward
}) => {
    const history = useHistory();
    const [brand, setBrand] = useState(null);
    const [paymentType, setPaymentType] = useState();
    const [coverType, setCoverType] = useState(null);
    const [showComprehensivePopup, setShowComprehensivePopup] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [HDToast, addToast] = useToast();
    const [showRerateModal, setShowRerateModal] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const location = useLocation();
    const [policySelected, setPolicySelected] = useState('online');
    const [coverLevel, setCoverLevel] = useState('HE');
    const [coverNeeded, setCoverNeeded] = useState(false);
    const [stdOffCommIncVal, setStdOffCommIncVal] = useState(null);
    const [stopPropgation, setStopPropgation] = useState(false);
    const offeredQuotesPath = 'quoteData.offeredQuotes';
    const offeringsPath = 'lobData.privateCar.offerings';
    const periodStartDatePath = 'baseData.periodStartDate';
    const periodEndDatePath = 'baseData.periodEndDate';
    const baseDataPath = 'baseData';
    const policyStartDateFieldName = 'periodStartDate';
    const policyStartDatePath = `${baseDataPath}.${policyStartDateFieldName}`;
    const isEligibleForOnlineProduct = `${baseDataPath}.isEligibleForOnlineProduct`;

    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const voluntaryExcessFieldName = 'voluntaryExcess';
    const voluntaryExcessPath = `${vehiclePath}.${voluntaryExcessFieldName}`;

    const coverTypeFieldName = 'coverType';
    const coverTypePath = `${vehiclePath}.${coverTypeFieldName}`;

    const regNumberFieldName = 'registrationsNumber';
    const regNumberPath = `${vehiclePath}.${regNumberFieldName}.value`;

    const insurancePaymentTypeFieldName = 'insurancePaymentType';
    // const insurancePaymentTypePath = `${vehiclePath}.${insurancePaymentTypeFieldName}`;
    const insurancePaymentTypePath = `${baseDataPath}.affordablePaymentPlan`;
    const driverPath = 'lobData.privateCar.coverables.drivers';
    const driversListFromSubmission = (_.get(submissionVM, driverPath));
    const isEligible = _.get(submissionVM, isEligibleForOnlineProduct).value || false;
    const driversList = (driversListFromSubmission) ? driversListFromSubmission.value : [];
    const translator = useContext(TranslatorContext);
    const displayAmounts = (value) => `£${value}`;

    let previousSelectedDate = '';


    const availablePaymentTypes = useMemo(() => {
        return _.get(submissionVM, insurancePaymentTypePath).aspects.availableValues.map((type) => ({
            value: type.code,
            name: translator({
                id: type.name,
                defaultMessage: type.name
            })
        })).sort((a, b) => b.value - a.value);
    }, [submissionVM]);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tickWhite',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

    const getVoluntaryExcessValues = submissionVM
        ? _.get(submissionVM, voluntaryExcessPath).aspects.availableValues.map((typeCode) => {
            return {
                value: typeCode.code,
                label: displayAmounts(
                    translator({
                        id: typeCode.name,
                        defaultMessage: typeCode.name
                    })
                )
            };
        })
        : [submissionVM];

    const [isMaxExcessModalShown, setIsMaxExcessModalShown] = useState(false);
    const [showIUnderstandModal, setShowIUnderstandModal] = useState(false);
    const [isOffQuotesPayTypeMonthly, setIsOffQuotesPayTypeMonthly] = useState(false);
    const [showCoverlevelNotAvailModal, setShowCoverlevelNotAvailModal] = useState(false);
    const [initialPolicyStartDate, setInitialPolicyStartDate] = useState(null);
    const [selCoverTypeFromModal, setSelCoverTypeFromModal] = useState(null);
    const [coverTypeToggle, setCoverTypeToggle] = useState(false);
    const [previousExcessFormValue, setPreviousExcessFormValue] = useState(null);
    let pcDate = _.get(submissionVM, 'value.baseData.pccurrentDate');
    pcDate = new Date(pcDate);
    pcDate = Date.UTC(pcDate.getUTCFullYear(), pcDate.getUTCMonth(), pcDate.getUTCDate());
    const pcCurrentDate = pcDate || new Date();
    const todayAtMidnight = new Date(new Date(pcCurrentDate).setHours(0, 0, 0, 0));
    const futureAtMidnight = new Date(new Date(pcCurrentDate).setHours(720, 0, 0, 0));
    const [voluntaryExcessValue, setVoluntaryExcessValue] = useState({});
    const [isYoungAndInexpDriver, setIsYoungAndInexpDriver] = useState(false);

    const getCoverTypeValues = submissionVM
        ? _.get(submissionVM, coverTypePath).aspects.availableValues.map((typeCode) => {
            return {
                value: typeCode.code,
                label: translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                })
            };
        }).filter((obj) => obj.value === 'comprehensive' || obj.value === 'tpft')
        : [submissionVM];

    const isValidDate = (genDate) => {
        if (genDate >= todayAtMidnight && genDate <= futureAtMidnight) {
            return true;
        }
        return false;
    };

    const callQuoteAPI = () => {
        const newPolicyStartDate = _.get(submissionVM, policyStartDatePath).value;
        previousSelectedDate = _.cloneDeep(newPolicyStartDate);
        if (newPolicyStartDate && newPolicyStartDate.year && (newPolicyStartDate.month || newPolicyStartDate.month === 0) && newPolicyStartDate.day) {
            if (submissionVM.aspects.valid) {
                setInitialPolicyStartDate(newPolicyStartDate);
                createQuote(submissionVM, translator);
            }
        }
    };

    const handleDateChange = (event, hdprops) => {
        const newPolicyStartDate = _.get(submissionVM, `${policyStartDatePath}.value`);
        if (newPolicyStartDate && newPolicyStartDate.year && (newPolicyStartDate.month || newPolicyStartDate.month === 0) && newPolicyStartDate.day) {
            const seletedDate = new Date(newPolicyStartDate.year, newPolicyStartDate.month, newPolicyStartDate.day);
            if (newPolicyStartDate && !_.isEqual(newPolicyStartDate, initialPolicyStartDate)
            && !_.isEqual(newPolicyStartDate, previousSelectedDate) && isValidDate(seletedDate)) {
                if (hasRerateModalBeenShown) {
                    callQuoteAPI();
                } else {
                    setShowRerateModal(true);
                }
            } else {
                previousSelectedDate = initialPolicyStartDate;
            }
        }
    };

    const displayRerateModalForStartDateSelected = (date) => {
        const newPolicyStartDate = _.get(submissionVM, `${policyStartDatePath}.value`);
        if (!_.isEqual(newPolicyStartDate, initialPolicyStartDate) && date !== undefined && isValidDate(date)) {
            if (hasRerateModalBeenShown) {
                callQuoteAPI();
            } else {
                setShowRerateModal(true);
            }
        }
    };

    const handleExcessChange = ({ target: { value: selectedVoluntaryExcess } }, hdProps) => {
        const selectedVoluntaryExcessValue = selectedVoluntaryExcess.value;
        const previousFormValue = hdProps.values[voluntaryExcessFieldName].value;
        setPreviousExcessFormValue(previousFormValue);
        const isSameSelected = previousFormValue === selectedVoluntaryExcessValue;

        if (isSameSelected) {
            return;
        }

        if (selectedVoluntaryExcessValue > +MAX_EXCESS_VALUE) {
            setIsMaxExcessModalShown(true);
            hdProps.setFieldValue(voluntaryExcessFieldName, { value: MAX_EXCESS_VALUE, label: maxExcessLabel });
            _.set(submissionVM, voluntaryExcessPath, MAX_EXCESS_VALUE);
            return;
        }

        _.set(submissionVM, voluntaryExcessPath, selectedVoluntaryExcessValue);
        hdProps.setFieldValue(voluntaryExcessFieldName, selectedVoluntaryExcess);
        if (hasRerateModalBeenShown) {
            callQuoteAPI();
        } else {
            setShowRerateModal(true);
        }
    };

    const handleMaxExcessConfirm = () => {
        if (previousExcessFormValue !== MAX_EXCESS_VALUE && hasRerateModalBeenShown) {
            callQuoteAPI();
        }

        setIsMaxExcessModalShown(false);

        if (!hasRerateModalBeenShown) {
            setShowRerateModal(true);
        }
    };

    const getAvailableQuotes = () => {
        const errorCodes = [UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE];
        let offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        offeredQuotes = offeredQuotes.value || [];

        return offeredQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.some(({ technicalErrorCode }) => errorCodes.indexOf(technicalErrorCode) > -1))));
    };

    const getYouDriveBubbleContent = () => (
        <>
            {messages.requiredYourDrivingData}
            &nbsp;
            <span className="fa fa-rss" />
        </>
    );

    const getBrands = () => getAvailableQuotes().map(({ branchCode }) => ({
        value: branchCode,
        image: ICONS[branchCode],
        stickyHeaderText: branchCode === YOU_DRIVE && getYouDriveBubbleContent()
    }));

    const getCoverages = () => {
        let offerings = _.get(submissionVM, offeringsPath) || [];
        offerings = offerings.value || [];
        const result = {};
        getAvailableQuotes().forEach(({ branchCode }) => {
            const offeringForBrand = offerings.find((offering) => offering.branchCode === branchCode);
            if (offeringForBrand) {
                const vehicleCoverages = offeringForBrand.coverages.vehicleCoverages[0].coverages;
                const ancillaryCoverages = offeringForBrand.coverages.ancillaryCoverages[0].coverages;
                _.set(result, branchCode, [...vehicleCoverages, ...ancillaryCoverages]);
            }
        });

        return result;
    };

    useEffect(() => {
        setNavigation({
            canSkip: false,
            canForward: brand,
            showForward: false,
            triggerLWRAPICall: false
        });

        if (
            submissionVM.lobData
            && submissionVM.lobData.privateCar
            && submissionVM.lobData.privateCar.coverables
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value.code
        ) {
            setPaymentType(_.get(submissionVM, `value.${insurancePaymentTypePath}`, PAYMENT_TYPE_ANNUALLY_CODE));
            // setPaymentType(submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value.code);
        }
    }, [setNavigation, submissionVM, brand]);

    const updatePremiumAmountInHeader = () => {
        const offeredQuotes = getAvailableQuotes();
        const selectedBrandCode = _.get(submissionVM, 'value.baseData.brandCode');
        const paymentPlan = _.get(submissionVM, 'value.baseData.affordablePaymentPlan');
        if (isEditQuoteJourney && offeredQuotes && offeredQuotes.length > 0 && selectedBrandCode && paymentPlan) {
            const selectQuote = offeredQuotes.filter((offeredQuote) => offeredQuote.branchCode === selectedBrandCode);
            const selectedQuote = selectQuote && selectQuote[0];
            if (selectedQuote && selectedQuote.hastingsPremium) {
                const annualVal = (selectedQuote.hastingsPremium.annuallyPayment
                    && selectedQuote.hastingsPremium.annuallyPayment.premiumAnnualCost)
                    ? selectedQuote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount : null;
                const monthlyVal = (selectedQuote.hastingsPremium.monthlyPayment
                    && selectedQuote.hastingsPremium.monthlyPayment.elevenMonthsInstalments)
                    ? selectedQuote.hastingsPremium.monthlyPayment.elevenMonthsInstalments.amount : null;
                EventEmmiter.dispatch('change', getAmount(paymentPlan, annualVal, monthlyVal));
            }
        }
    };

    const updateStdOffCommIncVal = () => {
        const stdComm = _.get(submissionVM, 'value.stdOfferCommissionIncermentalVal');
        if (stdComm) {
            setStdOffCommIncVal(
                Math.abs(stdComm.amount).toLocaleString('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            );
        }
    };

    const getWebAnyalMess = () => (policySelected === 'online' ? `${messages.eventValueOnline}` : '');


    /**
     * Track brand selection
     * @param {string} type brand
     */
    const trackSelectedCover = (type) => {
        if (type) {
            const hyphen = policySelected === 'online' ? ' - ' : '';
            trackEvent({
                event_value: `${type === 'YD' ? type : type.concat(hyphen, getWebAnyalMess())}`,
                event_action: 'Quote - Select cover type',
                event_type: (policySelected === 'online' && type !== 'YD') ? 'link' : 'table_select',
                element_id: 'cover-type-table',
            });
        }
    };

    const setSelectBrand = (event) => {
        const filteredOfferedQuotes = getAvailableQuotes().filter((offeredQuotesObj) => {
            return offeredQuotesObj.branchCode === event;
        });
        setBrand(event);
        setOfferedQuotesDetails(filteredOfferedQuotes);
        const quoteID = _.get(submissionVM, 'value.quoteID');
        if (quoteID && filteredOfferedQuotes[0]) {
            const updateSelectedversionRequest = {
                branch: filteredOfferedQuotes[0].branchName,
                quoteID: quoteID
            };
            showLoader();
            trackSelectedCover(event);
            HDQuoteService.updateSelectedVersion(updateSelectedversionRequest)
                .then(({ result }) => {
                    trackAPICallSuccess('Retrieve Quote');
                    hideLoader();
                    _.set(submissionVM, 'value', result);
                    updatePremiumAmountInHeader();
                    updateStdOffCommIncVal();
                }).catch((error) => {
                    // dispatch(setErrorStatusCode(error.status))
                    trackAPICallFail('Retrieve Quote', 'Retrieve Quote Failed');
                    hideLoader();
                });
        }
    };

    /**
     * Set value of policy type
     */
    const getPolicySelected = () => {
        const { getPolicyTypeBasedOnFlag } = messages;
        setPolicySelected(
            getPolicyTypeBasedOnFlag(
                _.get(submissionVM, 'value.isOnlineProductType')
            )
        );
    };


    const trackPolicyEvent = () => {
        const { eventValueOnline, eventValueStandard } = messages;
        const policy = policySelected === 'online' ? `${eventValueOnline}` : `${eventValueStandard}`;
        trackEvent({
            event_value: policy,
            event_action: `${messages.customizeQuotePolicySupp}`,
            event_type: 'link',
            element_id: 'hd-your-quote_cover-selection',
        });
    };

    /**
     * call api and save selected
     * policy type
     */
    const updateProduct = useCallback((policyType, canShowToaster = true) => {
        const { toastForOnlie, toastForStandard } = messages;
        const updateProductRequest = {
            onlineSelection: policyType === 'online',
            quoteID: _.get(submissionVM, 'value.quoteID'),
            sessionUUID: _.get(submissionVM, 'value.sessionUUID'),
        };
        showLoader();
        HDQuoteService.updateProduct(updateProductRequest)
            .then(({ result }) => {
                trackQuoteData(result, translator);
                hideLoader();
                _.set(submissionVM, 'value', result);
                if (canShowToaster) {
                    addToast({
                        iconType: 'tickWhite',
                        bgColor: 'light',
                        content: policyType === 'online' ? toastForOnlie : toastForStandard
                    });
                } else {
                    getPolicySelected();
                }
                setStopPropgation(false);
                updateStdOffCommIncVal();
            }).catch(() => {
                trackAPICallFail('updateProduct Quote', 'updateProduct Quote Failed');
                hideLoader();
                setStopPropgation(false);
            });
    }, []);


    useEffect(() => {
        window.scroll(0, 0);
        updatePremiumAmountInHeader();
        if (!isOffQuotesPayTypeMonthly) {
            const tempOffQuotesAvailPayType = getAvailableQuotes().some(({ hastingsPremium }) => !!hastingsPremium.monthlyPayment);
            setIsOffQuotesPayTypeMonthly(tempOffQuotesAvailPayType);
        }

        const youngAndInexpeiencedExcess = getYoungAndInexperiencedExcess(driversList);
        if (youngAndInexpeiencedExcess > 0) {
            setIsYoungAndInexpDriver(true);
        }
        // set policy type on page load
        if (isEligible && !_.get(submissionVM, 'value.isOnlineProductType')) {
            updateProduct('online', false);
        }
    }, []);

    useEffect(() => {
        if (stopPropgation) {
            trackPolicyEvent();
        }
        getPolicySelected();
    }, [stopPropgation]);


    useEffect(() => {
        if (submissionVM) {
            setInitialPolicyStartDate(_.get(submissionVM, policyStartDatePath).value);
            const offeredQuotes = getAvailableQuotes();
            if (offeredQuotes.length === 1) {
                setBrand(offeredQuotes[0].branchCode);
                setSelectBrand(offeredQuotes[0].branchCode);
            }
        }
    }, [submissionVM]);

    useEffect(() => {
        const coverTypeValueCheck = _.get(submissionVM, `${coverTypePath}.value`);
        setCoverType({
            value: coverTypeValueCheck.code,
            label: getCoverTypeValues.filter((el) => el.value === coverTypeValueCheck.code)[0].label
        });
        setCategoryList(getCoverTypeValues);
        const voluntaryExcessBEValue = _.get(submissionVM, `${voluntaryExcessPath}.value`);
        const voluntaryExcessObj = getVoluntaryExcessValues.filter((data) => data.value === voluntaryExcessBEValue.code);
        setVoluntaryExcessValue(voluntaryExcessObj[0]);
    }, [
        submissionVM.lobData.privateCar.coverables.vehicles.children[0].coverType.value,
        submissionVM.lobData.privateCar.coverables.vehicles.children[0].voluntaryExcess.value
    ]);

    useEffect(() => {
        setCoverTypeToggle(!coverTypeToggle);
        if (!quoteObject.lwrQuoteObj.quoteData) {
            return;
        }
        const { offeredQuotes } = quoteObject.lwrQuoteObj.quoteData;
        const hasQuoteErrors = isUWErrorPresent(offeredQuotes) || isGrayListErrorPresent(offeredQuotes) || isCueErrorPresent(offeredQuotes);
        if (hasQuoteErrors) {
            handleForward({ isQuoteErrorState: true });
        }
    }, [quoteObject]);

    const displayAmount = ({ amount, currency }, braces = false, prefix = '') => {
        const currencySymbols = {
            gbp: '£'
        };
        const value = `${prefix}${currencySymbols[currency]}${getAmountAsTwoDecimalDigit(amount)}`;
        return braces ? `{${value}}` : value;
    };

    const displayCurrency = (value) => `£${getAmountAsTwoDecimalDigit(value)}`;

    const getMonthlyPremiumInfo = (availableQuotes) => {
        return [{
            rowLabel: messages.payMonthlyLabel,
            highlighted: true,
            cells: availableQuotes.map(({ hastingsPremium }) => {
                const {
                    monthlyPayment: { firstInstalment, elevenMonthsInstalments, premiumAnnualCost }
                } = hastingsPremium;
                return {
                    value: displayAmount(premiumAnnualCost),
                    extraLines: [
                        `${messages.monthlyPaymentPrefix} ${displayAmount(elevenMonthsInstalments)}`,
                        messages.montlhyFirstPaymentLabel.replace(AMOUNT_VALUE, displayAmount(firstInstalment))
                    ]
                };
            })
        }];
    };

    const getAnnuallyPremiumInfo = (availableQuotes) => {
        return [{
            rowLabel: messages.payInFullLabel,
            highlighted: true,
            cells: availableQuotes.map(({ hastingsPremium }) => {
                const {
                    annuallyPayment: { premiumAnnualCost }
                } = hastingsPremium;
                return {
                    value: displayAmount(premiumAnnualCost)
                };
            })
        }];
    };

    const getPremiumInfo = () => {
        const availableQuotes = getAvailableQuotes();
        if (paymentType === PAYMENT_TYPE_MONTHLY_CODE && isOffQuotesPayTypeMonthly) {
            return getMonthlyPremiumInfo(availableQuotes);
        }
        return getAnnuallyPremiumInfo(availableQuotes);
    };

    const findCoverageByBrandAndName = (brandCode, name) => {
        const coverages = getCoverages();
        if (!_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode].find((cov) => cov.name === name);
        }
        return null;
    };

    const findCoverageByBrandAndKey = (brandCode, key) => {
        const coverages = getCoverages();
        if (!_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode].find((cov) => cov.publicID === key);
        }
        return null;
    };

    const getTotalExcessValues = () => getAvailableQuotes().map(({ branchCode, productType }) => {
        const { online, standardAccDmgExcessKey, onlineAccDmgExcessKey } = messages;
        const accidentalDamageCov = _.cloneDeep(findCoverageByBrandAndKey(branchCode, messages.accidentalDamageKey));
        const youngAndInexpExcessAllDrivers = accidentalDamageCov ? accidentalDamageCov.terms.filter(
            (amt) => amt.publicID === messages.youngAndInexperiencedKey
        ) : 0;
        const cmpYAndIAccDamage = getYoungAndInexperiencedExcess(driversList);

        // filtering terms based on online or standard policies
        const excessType = (productType === online ? standardAccDmgExcessKey : onlineAccDmgExcessKey);
        accidentalDamageCov.terms = accidentalDamageCov.terms.filter((term) => term.publicID !== excessType);

        let totalExcessValue = accidentalDamageCov ? accidentalDamageCov.terms.reduce((total, current) => (_.has(current, 'directValue')
            ? total + current.directValue : total + 0), 0) : 0;

        if (cmpYAndIAccDamage === 0 && totalExcessValue > 0) {
            totalExcessValue -= youngAndInexpExcessAllDrivers[0].directValue;
        }
        if (coverType && coverType.value && coverType.value === 'tpft') {
            const fireAndTheftCov = _.cloneDeep(findCoverageByBrandAndKey(branchCode, messages.fireAndTheftKey));
            // filtering terms based on online or standard policies
            fireAndTheftCov.terms = productType === messages.online ? fireAndTheftCov.terms.filter(
                (term) => term.publicID !== messages.standardLossFireTheftCovKey
            ) : fireAndTheftCov.terms.filter((term) => term.publicID !== messages.onlineLossFireTheftCovKey);
            totalExcessValue = fireAndTheftCov ? fireAndTheftCov.terms.reduce((total, current) => (_.has(current, 'directValue')
                ? total + current.directValue : total + 0), 0) : 0;
        }
        return {
            value: displayCurrency(totalExcessValue)
        };
    });

    const displayCoverage = (coverage, prefix, covName) => {
        if (!coverage) {
            return {
                value: false
            };
        }
        const { selected, amount } = coverage;
        if (selected) {
            return {
                value: true
            };
        }
        if (amount) {
            return {
                value: covName === messages.roadsideAssistantCovName
                    ? <div className="hd-your-quote__table__from-value">{displayAmount(amount, false, prefix)}</div>
                    : displayAmount(amount, false, prefix)
            };
        }
        return {
            value: false
        };
    };

    const getCoveragesToDisplay = () => {
        const coveragesMapping = {
            [messages.legalCoverName]: messages.legalCoverLabel,
            [messages.roadsideAssistantCovName]: messages.roadsideAssistantCovLabel,
            [messages.courtesyCarCovName]: messages.courtesyCarCovLabel,
            [messages.claimsHelplineCovName]: messages.claimsHelplineCovLabel,
            [messages.euCoverLabelCovName]: messages.euCoverCovLabel,
            [messages.drivingOtherCarsCovName]: messages.drivingOtherCarsCovLabel,
            [messages.managePolicyCovName]: messages.managePolicyCovLabel,
            [messages.windscreenCoverCovName]: messages.windscreenCoverCovLabel,
            [messages.vandalismPromiseCovName]: messages.vandalismPromiseCovLabel,
            [messages.uninsuredDriverPromiseCovName]: messages.uninsuredDriverPromiseCovLabel,
            [messages.personalBelongingsCoverCovName]: messages.personalBelongingsCoverCovLabel,

        };
        return Object.keys(coveragesMapping).map((covName) => ({
            rowLabel: coveragesMapping[covName],
            cells: getAvailableQuotes().map(({ branchCode }) => {
                if (covName === messages.legalCoverName || covName === messages.roadsideAssistantCovName) {
                    const coverage = findCoverageByBrandAndName(branchCode, covName);
                    const prefix = covName === messages.roadsideAssistantCovName ? 'from ' : '+ ';
                    return displayCoverage(coverage, prefix, covName);
                }
                if (covName === coveragesMapping[messages.drivingOtherCarsCovName]) {
                    const coverage = findCoverageByBrandAndName(branchCode, messages.drivingOtherCarsPCLabel);
                    return { value: coverage ? coverage.selected : false };
                }
                return { value: BRAND_AVAILABLE_FEATURE[branchCode][covName][(coverType) ? COVER_TYPES[coverType.value] : 0] };
            })
        }));
    };

    const getMoreDetailsPopups = () => {
        return getAvailableQuotes().map(({
            branchCode, branchName, hastingsPremium, productType
        }, i) => (
            <HDMoreDetailsPopup
                pageMetadata={pageMetadata}
                brandCode={branchCode}
                brandName={branchName}
                coverType={(coverType) ? coverType.label : null} // {_.get(submissionVM, coverTypePath)}
                startDate={_.get(submissionVM, periodStartDatePath)}
                endDate={_.get(submissionVM, periodEndDatePath)}
                paymentType={availablePaymentTypes.find((elem) => elem.value === paymentType)}
                coverages={getCoverages()}
                driversList={driversList}
                isYoungAndInexpDriver={isYoungAndInexpDriver}
                registrationNumber={_.get(submissionVM, regNumberPath)}
                hastingsPremium={hastingsPremium}
                productType={productType} />
        ));
    };


    const closeRerateModal = () => {
        callQuoteAPI();
        markRerateModalDisplayed();
        setShowRerateModal(false);
    };
    const closeIUnderstandModal = () => {
        setShowIUnderstandModal(false);
    };
    const closeCoverlevelNotAvailModal = () => {
        setShowCoverlevelNotAvailModal(false);
    };
    const onAnnualInfoIconClick = () => {
        setShowIUnderstandModal(true);
    };
    const handleValidation = (isValid) => {
        setNavigation({
            canForward: brand && isValid
        });
    };

    const declineQuote = () => {
        window.location.assign(HOMEPAGE);
    };

    const validationSchema = yup.object({
        [policyStartDateFieldName]: yup
            .date()
            .required(messages.dateErrorMessage)
            .typeError(messages.dateErrorMessage)
            .min(todayAtMidnight, messages.datePastErrorMessage)
            .max(futureAtMidnight, messages.dateErrorMessage)
            .VMValidation(policyStartDatePath, messages.dateErrorMessage, submissionVM),
        [insurancePaymentTypeFieldName]: yup
            .string()
            .required(messages.requiredFieldMessage)
            .VMValidation(insurancePaymentTypePath, null, submissionVM),
        [voluntaryExcessFieldName]: yup
            .string()
            .required(messages.voluntaryExcessRequired)
            .VMValidation(voluntaryExcessPath, messages.voluntaryExcessRequired, submissionVM)
    });

    const resetModificationDropDowns = () => {
        setShowComprehensivePopup(false);
    };

    const addModification = () => {
        setShowComprehensivePopup(false);
        if (brand === 'HE' && selCoverTypeFromModal.value === 'tpft') {
            setShowCoverlevelNotAvailModal(true);
        } else {
            _.set(submissionVM, `${coverTypePath}.value`, selCoverTypeFromModal.value);
            if (hasRerateModalBeenShown) {
                callQuoteAPI();
            } else {
                setShowRerateModal(true);
            }
        }
    };

    const onCategoryChange = (category) => {
        setSelCoverTypeFromModal(category.target.value);
    };

    const handleEditClick = () => {
        trackEvent({
            event_value: messages.edit,
            event_action: `${messages.quote} - ${messages.edit}`,
            event_type: 'button_click',
            element_id: 'your-quote-edit-cover-level-button',
        });
        setSelCoverTypeFromModal(coverType);
        setShowComprehensivePopup(true);
    };

    const indexOfSelectedBrand = (selectedBrand, availableBrands) => {
        return availableBrands.findIndex((el) => el.value === selectedBrand);
    };

    const renderOnlyAnnualyOrMonthlyAnnualPaymentOption = () => {
        return !isOffQuotesPayTypeMonthly
            ? (
                <div className="d-flex">
                    <span className="text-small text-md-lg font-bold mr-2 px-3 py-2 hd-your-quote__your-options-header__show-annual-text">
                        {messages.onlyAnnualAvailText}
                    </span>
                    <img
                        onClick={onAnnualInfoIconClick}
                        src={infoCircleBlue}
                        role="presentation"
                        alt="info_circle" />
                </div>
            )
            : (
                <span className="clear-child-margins">
                    <HDSwitch
                        webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.showPrice}` }}
                        id="payment-type-switch"
                        theme="light"
                        path={insurancePaymentTypePath}
                        name={insurancePaymentTypeFieldName}
                        value={paymentType}
                        onChange={(event) => setPaymentType(event.target.value)}
                        values={availablePaymentTypes} />
                </span>
            );
    };


    /**
     * On change in the policy selection
     * @param {*} event setPolicySelected
     * state
     */
    const createPolicySelect = (event) => {
        if (stopPropgation) {
            return;
        }
        setStopPropgation(true);
        const policyType = event.target.value;
        setPolicySelected(policyType);
        updateProduct(policyType);
    };

    /**
      * function to navigate
      * and to validate policy cover
      * @param {*} context
     */

    const continueQuote = (context) => {
        const { selectedPolicy, selectedCoverLevel } = messages;
        if (policySelected === selectedPolicy && coverLevel === selectedCoverLevel) {
            window.scrollTo({
                top: 600,
                behavior: 'smooth',
            });
            setCoverNeeded(true);
        } else {
            setNavigation({
                showWizardTooltip: false,
                wizardTooltip: null,
                submissionVM: submissionVM
            });

            setBackNavigationFlag({ data: true });
            handleForward(context);
        }
    };

    const noCloseModal = () => setCoverNeeded(false);

    const onConfirmModal = () => {
        setStopPropgation(true);
        setCoverLevel('YD');
        updateProduct('standard');
        noCloseModal();
        trackPolicyEvent();
    };

    return (
        <>
            <Container className="hd-your-quote-container">
                <Row>
                    <Col sm={12} md={{ span: 10, offset: 1 }}>
                        {quoteObject && quoteObject.quoteError !== null && quoteObject.quoteError.error && quoteObject.quoteError.error.message && (
                            <p className="error">{quoteObject.quoteError.error.message}</p>
                        )}
                        <HDForm submissionVM={submissionVM} validationSchema={validationSchema} onValidation={handleValidation}>
                            {(hdProps) => {
                                return (
                                    <>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="h1"
                                                    text={messages.yourQuoteHeader}
                                                    className="font-bold text-center"
                                                    id="your-quote-choose-label" />
                                                <HDLabelRefactor
                                                    Tag="p"
                                                    text={messages.yourQuoteSubHeader}
                                                    className="text-center"
                                                    id="your-quote-avail-options-label" />
                                            </Col>
                                        </Row>
                                        <Row className="hd-your-quote__section-main-header mt-3 align-items-center theme-white">
                                            <Col>
                                                <HDLabelRefactor
                                                    Tag="h3"
                                                    text={coverType && coverType.label ? coverType.label : messages.notAvailable}
                                                    className="m-0"
                                                    id="your-quote-cover-level-label" />
                                            </Col>
                                            <Col xs="auto">
                                                <HDLabelRefactor
                                                    Tag="a"
                                                    text={messages.edit}
                                                    className=""
                                                    onClick={handleEditClick}
                                                    id="your-quote-edit-cover-level-button"
                                                    onKeyPress={handleEditClick}
                                                    role="button"
                                                    tabIndex="0" />
                                            </Col>
                                        </Row>
                                        <Row className="hd-your-quote__sections border_bottom">
                                            <Col lg={6} className="hd-your-quote__sections__section">
                                                <HDDropdownList
                                                    webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.voluntaryExcess}` }}
                                                    id="voluntary-excess-dropdown"
                                                    path={voluntaryExcessPath}
                                                    name={voluntaryExcessFieldName}
                                                    data={voluntaryExcessValue}
                                                    label={{
                                                        Tag: 'h3',
                                                        text: messages.yourExcessHeader,
                                                        icon: <HDVoluntaryExcessPopup pageMetadata={pageMetadata} />,
                                                        iconPosition: 'r',
                                                        className: 'hd-your-quote__sections__excess-value-label',
                                                        id: 'your-quote-vol-excess-label'
                                                    }}
                                                    onChange={(e) => { handleExcessChange(e, hdProps); }}
                                                    options={getVoluntaryExcessValues}
                                                    selectSize="thin" />
                                            </Col>
                                            <Col lg={6} className="hd-your-quote__sections__section">
                                                <HDDatePicker
                                                    webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.policyStartDate}` }}
                                                    id="policy-start-date"
                                                    className="hd-your-quote__sections__date-picker"
                                                    theme="blue"
                                                    path={policyStartDatePath}
                                                    name={policyStartDateFieldName}
                                                    onBlur={(e) => handleDateChange(e, hdProps)}
                                                    onSelect={(e) => displayRerateModalForStartDateSelected(e)}
                                                    minDate={0}
                                                    maxDate={30}
                                                    initialDate={new Date(pcCurrentDate)}
                                                    label={{
                                                        id: 'your-quote-date-picker-label',
                                                        className: 'margin-bottom-md',
                                                        text: messages.startDateHeader,
                                                        Tag: 'h3'
                                                    }}
                                                    showFieldsNames
                                                    information={messages.policyStartDateInfo}
                                                    inputStyle="thin"
                                                    pickerPos="label-right" />
                                            </Col>
                                        </Row>

                                        {
                                            isEligible && (
                                                <Row className="hd-your-quote__section-policyselect">
                                                    <HDPolicySelect
                                                        pageMetadata={pageMetadata}
                                                        webAnalyticsView={{ ...pageMetadata, page_section: `${getWebAnyalMess()}` }}
                                                        webAnalyticsEvent={{ event_action: `${getWebAnyalMess()}` }}
                                                        onChange={createPolicySelect}
                                                        className="hd-your-quote__cover-selection"
                                                        selectedOption={policySelected}
                                                        canHideOnlineInfo={false}
                                                        saveValue={(brand && policySelected) ? stdOffCommIncVal : null} />
                                                </Row>
                                            )
                                        }


                                        <Row className="hd-your-quote__your-options-header align-items-start
                                        align-items-md-center flex-column flex-md-row pb-4 pt-4 pt-md-5"
                                        >
                                            <Col className="pl-sm-0">
                                                <HDLabelRefactor
                                                    Tag="h2"
                                                    text={messages.header}
                                                    className="mt-0 mb-2 mb-md-0"
                                                    id="your-quote-your-options-label" />
                                            </Col>
                                            <Col xs={12} md="auto" className="px-sm-0">
                                                <Container className="p-0">
                                                    <Row className="align-items-center">
                                                        <Col>
                                                            <HDLabelRefactor
                                                                Tag="h5"
                                                                text={messages.showPriceText}
                                                                className="text-small text-md-lg m-0"
                                                                id="your-quote-show-price-label" />
                                                        </Col>
                                                        <Col xs="auto">
                                                            {renderOnlyAnnualyOrMonthlyAnnualPaymentOption()}
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </Col>
                                        </Row>

                                    </>
                                );
                            }}
                        </HDForm>
                        {
                            quoteObject
                            && _.get(submissionVM, `${baseDataPath}.periodStatus.value.code`) === messages.quotedStatus
                            && quoteObject.quoteError === null
                            && Boolean(quoteObject.lwrQuoteObj)
                            && getTotalExcessValues()
                            && getCoveragesToDisplay()
                            && getBrands()
                            && getBrands().length && (
                                <Row>
                                    <Col className="p-0">
                                        <HDTable
                                            onlineProduct={!(policySelected === 'standard')}
                                            id="cover-type-table"
                                            className="hd-your-quote__cover-table elevated-box theme-white"
                                            name="brand"
                                            selectedHeaderValue={brand}
                                            defaultIndex={indexOfSelectedBrand(brand, getBrands())}
                                            onSelect={(event) => {
                                                if (coverType.value === 'tpft' && event.target.value === 'HE') {
                                                    setShowCoverlevelNotAvailModal(true);
                                                    _.set(submissionVM, `${coverTypePath}.value`, 'comprehensive');
                                                    callQuoteAPI();
                                                }
                                                setSelectBrand(event.target.value);
                                                setBrand(event.target.value);
                                                setCoverLevel(event.target.value);
                                            }}
                                            headerValues={getBrands()}
                                            data={[
                                                ...getPremiumInfo(),
                                                { rowLabel: messages.totalExcessLabel, cells: getTotalExcessValues() },
                                                ...getCoveragesToDisplay()
                                            ]}
                                            moreDetailsPopups={getMoreDetailsPopups()} />

                                    </Col>
                                </Row>
                            )}
                        <HDModal
                            webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.headerText}` }}
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.headerText}` }}
                            id="edit-cover-details-popup"
                            show={showComprehensivePopup}
                            confirmLabel={messages.confirmLabel}
                            customStyle={messages.wide}
                            className="hd-your-quote__section-main-header-edit-details"
                            headerText={messages.headerText}
                            hideCancelButton
                            onClose={resetModificationDropDowns}
                            onConfirm={() => {
                                addModification();
                            }}
                        >
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.headerText} - ${messages.selectCoverLevel}` }}
                                id="cover-type-dropdown"
                                name={coverTypeFieldName}
                                defaultValue={selCoverTypeFromModal}
                                value={selCoverTypeFromModal}
                                label={{
                                    Tag: 'h5',
                                    text: messages.dropdownLabel
                                }}
                                options={categoryList}
                                onChange={onCategoryChange} />
                        </HDModal>

                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.rerateModalHeader}` }}
                            webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.rerateModalHeader}` }}
                            id="rerate-modal"
                            customStyle="your-quote"
                            show={showRerateModal}
                            headerText={messages.rerateModalHeader}
                            confirmLabel={messages.rerateModalConfirmLabel}
                            onConfirm={closeRerateModal}
                            hideCancelButton
                            hideClose
                        >
                            <p>
                                {messages.rerateModalContent}
                            </p>
                        </HDModal>
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.iUnderstandModalHeader}` }}
                            webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.iUnderstandModalHeader}` }}
                            id="understand-modal"
                            customStyle="your-quote"
                            show={showIUnderstandModal}
                            headerText={messages.iUnderstandModalHeader}
                            confirmLabel={messages.iUnderstandConfirmLabel}
                            onConfirm={closeIUnderstandModal}
                            hideCancelButton
                            hideClose
                        >
                            <HDLabelRefactor
                                Tag="p"
                                text={messages.iUnderstandContent} />

                            <HDLabelRefactor
                                Tag="p"
                                className="mt-3"
                                text={messages.iUnderstandContentSecondParagraph} />

                        </HDModal>
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.coverlevelNotAvailModalHeader}` }}
                            webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.coverlevelNotAvailModalHeader}` }}
                            id="unavailable-cover-level-modal"
                            customStyle="your-quote"
                            show={showCoverlevelNotAvailModal}
                            headerText={messages.coverlevelNotAvailModalHeader}
                            confirmLabel={messages.ok}
                            onConfirm={closeCoverlevelNotAvailModal}
                            hideCancelButton
                        >
                            <p>
                                {messages.coverlevelNotAvailContent1}
                                <span className="font-bold">{messages.thirdParty}</span>
                                {messages.coverlevelNotAvailContent2}
                                <span className="font-bold">{messages.comprehensive}</span>
                            </p>
                        </HDModal>
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.quote} - ${messages.sorryCannotChooseThat}` }}
                            webAnalyticsEvent={{ event_action: `${messages.quote} - ${messages.sorryCannotChooseThat}` }}
                            id="max-excess-exceeded-modal"
                            customStyle="your-quote"
                            show={isMaxExcessModalShown}
                            headerText={messages.sorryCannotChooseThat}
                            confirmLabel={messages.ok}
                            onConfirm={handleMaxExcessConfirm}
                            hideCancelButton
                            hideClose
                        >
                            <p>
                                {messages.maxExcess}
                                &nbsp;
                                {maxExcessLabel}
                            </p>
                        </HDModal>
                        <HDModal
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.eventValueOverlayClosed}` }}
                            webAnalyticsEvent={{ event_action: `${messages.eventValueOverlayClosed}` }}
                            id="confirm-cover-modal"
                            customStyle="footer-btns-w-100 rev-button-order"
                            show={coverNeeded}
                            headerText={messages.rerateModalHeader}
                            confirmLabel={messages.yourDriveOkLabel}
                            cancelLabel={messages.yourDriveCancelLabel}
                            onCancel={noCloseModal}
                            onConfirm={onConfirmModal}
                            hideClose
                        >
                            <p>
                                The online policy option isn’t available for YouDrive, so we’ll switch
                                all prices to a standard policy so you can do a direct comparison.
                            </p>
                            <p>
                                If you’d prefer to still see the online prices, just go back to the previous screen.
                            </p>
                        </HDModal>
                        {HDToast}
                    </Col>
                </Row>
                {HDFullscreenLoader}


            </Container>
            <Container className={classNames('wizard-navigation margin-top-lg margin-top-lg-mobile', { 'margin-bottom-xl': isEditQuoteJourney })}>
                <div className="wizard-navigation-forward wizard-navigation-forward_override">

                    <div className="wizard-buttons-footer">
                        <HDButton
                            id="continue-button"
                            webAnalyticsEvent={{ event_action: `Continue - Redirecting from: ${messages.wizardId}` }}
                            variant="primary"
                            onClick={() => continueQuote()}
                            disabled={!canForward}
                            label={messages.continueBtnLabel} />
                    </div>

                </div>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    quoteObject: state.createQuoteModel,
    rerateModal: state.rerateModal,
    isEditQuoteJourney: state.wizardState.app.isEditQuoteJourney,
    canForward: state.wizardState.app.canForward,
});

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setOfferedQuotesDetails: setOfferedQuotesDetailsAction,
    createQuote: createQuoteAction,
    markRerateModalDisplayed: markRerateModalDisplayedAction,
    setBackNavigationFlag: setBackNavigationFlagAction
};

HDYourQuotesPage.propTypes = {
    submissionVM: PropTypes.shape({
        lobData: PropTypes.object,
        baseData: PropTypes.object,
        aspects: PropTypes.object,
        isOnlineProductType: PropTypes.bool,
        stdOfferCommissionIncermentalVal: PropTypes.object
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    quoteObject: PropTypes.shape({
        quoteObj: PropTypes.object,
        quoteError: PropTypes.object,
        lwrQuoteObj: PropTypes.object
    }).isRequired,
    setOfferedQuotesDetails: PropTypes.func.isRequired,
    setBackNavigationFlag: PropTypes.func.isRequired,
    createQuote: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    rerateModal: PropTypes.shape({
        status: PropTypes.bool
    }).isRequired,
    markRerateModalDisplayed: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired,
    isEditQuoteJourney: PropTypes.bool,
    canForward: PropTypes.bool,
};

HDYourQuotesPage.defaultProps = {
    isEditQuoteJourney: false,
    canForward: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDYourQuotesPage);
