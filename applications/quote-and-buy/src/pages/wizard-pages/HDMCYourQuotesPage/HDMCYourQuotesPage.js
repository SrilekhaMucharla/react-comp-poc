import {
    HDLabelRefactor, HDQuoteInfoRefactor
} from 'hastings-components';
import { useLocation, useHistory } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import React, {
    useEffect, useState, useContext
} from 'react';
import { connect, useSelector } from 'react-redux';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTable as HDTable
} from '../../../web-analytics';
import * as messages from './HDMCYourQuotesPage.messages';
import useScrollToTop from '../../../routes/common/useScrollToTop';
import { BRAND_AVAILABLE_FEATURE } from './HDMCBrandBenefits';
import {
    setNavigation as setNavigationAction,
    setMultiOfferedQuotesDetails as setMultiOfferedQuotesDetailsAction,
    setErrorStatusCode as setErrorStatusCodeAction,
    incrementCurrentPageIndex as incrementCurrentPageIndexAction,
    decrementCurrentPageIndex as decrementCurrentPageIndexAction
} from '../../../redux-thunk/actions';
import heLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-essential.svg';
import ydLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import hdLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import hpLogo from '../../../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import {
    HASTINGS_PREMIER,
    UW_ERROR_CODE,
    GREY_LIST_ERROR_CODE,
    PAYMENT_TYPE_MONTHLY_CODE
} from '../../../constant/const';
import HDQuoteService from '../../../api/HDQuoteService';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';
import useToast from '../../Controls/Toast/useToast';
import getCarName from '../../../common/getCarName';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import EventEmmiter from '../../../EventHandler/event';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import routes from '../../../routes/WizardRouter/RouteConst';
import formatRegNumber from '../../../common/formatRegNumber';
import { getDataForMultiQuoteAPICall } from '../../../common/submissionMappers';
import { getUpdateSelectedVersionForMPAPI } from '../../../common/utils';
import { trackView } from '../../../web-analytics/trackData';
import { getAmountAsTwoDecimalDigitsOrWhole } from '../../../common/premiumFormatHelper';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import trackQuoteData from '../../../web-analytics/trackQuoteData';
import { getPCWName } from '../HDMotorLegal/HastingsPCWHelper';

const ICONS = {
    HE: heLogo,
    YD: ydLogo,
    HD: hdLogo,
    HP: hpLogo
};

const HDMCYourQuotesPage = (props) => {
    const {
        setNavigation,
        mcsubmissionVM,
        setMultiOfferedQuotesDetails,
        setErrorStatusCode,
        incrementCurrentPageIndex,
        decrementCurrentPageIndex,
        isPCWJourney,
        pcwName
    } = props;
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [brands, setBrands] = useState([]);
    const [coverages, setCoverages] = useState({});
    const [paymentType, setPaymentType] = useState();
    const [isOffQuotesPayTypeMonthly, setIsOffQuotesPayTypeMonthly] = useState(false);
    const [registrationsNumber, setRegistrationsNumber] = useState('');
    const [selectedBrandName, setSelectedBrandName] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [canForward, setCanForward] = useState(false);
    const [submissionVMIndex, setSubmissionVMIndex] = useState(0);
    const [selectedMCQuotes, setSelectedMCQuotes] = useState([]);
    const [HDToast, addToast] = useToast();
    const [totalDiscount, setTotalDiscount] = useState(0);
    const location = useLocation();
    const history = useHistory();
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const offeredQuotesPath = 'quoteData.offeredQuotes.value';
    const offeringsPath = 'lobData.privateCar.offerings.value';
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const chosenQuotePath = 'bindData.chosenQuote.value';
    const coverTypeFieldName = 'coverType';
    const coverTypePath = `${vehiclePath}.${coverTypeFieldName}`;
    const isAddAnotherCar = useSelector((state) => state.wizardState.app.isAddAnotherCar);
    const isEditQuoteJourney = useSelector((state) => state.wizardState.app.isEditQuoteJourney);

    const translator = useContext(TranslatorContext);

    useScrollToTop(submissionVMIndex);

    const getSingleSubmissionVM = () => {
        return mcsubmissionVM.quotes.children[submissionVMIndex] || {};
    };

    // For calculating total mc discount
    const getMultiCarDiscount = () => getAmountAsTwoDecimalDigitsOrWhole(mcsubmissionVM.value.totalMPDiscount);

    useEffect(() => {
        setTotalDiscount(getMultiCarDiscount());
        if (isPCWJourney) {
            const submissionVM = getSingleSubmissionVM();
            const chosenQuoteID = _.get(submissionVM, chosenQuotePath) || '';
            const offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
            const pcwJourneyChoosenQuote = offeredQuotes.find((offeredQuote) => offeredQuote.publicID === chosenQuoteID);
            if (pcwJourneyChoosenQuote) {
                setSelectedBrand(pcwJourneyChoosenQuote.branchCode);
                setSelectedBrandName(pcwJourneyChoosenQuote.branchName);
                setCanForward(true);
            }
        }
        if (isAddAnotherCar && submissionVMIndex === 0 && mcsubmissionVM.value.quotes.length > 1) {
            setSelectedBrand(null);
            setSelectedBrandName(null);
            setCanForward(false);
            setSubmissionVMIndex(submissionVMIndex + 1);
        }
    }, []);

    // For displaying total discount at top right corner
    useEffect(() => {
        if (totalDiscount) {
            const data = {
                price: totalDiscount,
                text: <span className="white-space-md-normal">{messages.totalMultiCarSaving}</span>,
                currency: '£'
            };
            EventEmmiter.dispatch('change', data);
        }
    }, [totalDiscount]);

    useEffect(() => {
        if (_.has(location, 'state')) {
            const paramvalues = location.state;
            if (paramvalues && paramvalues.SaveAndReturn) {
                addToast({
                    iconType: 'tick',
                    bgColor: 'light',
                    content: messages.welcomeBack
                });
            }
        }
    }, []);

    useEffect(() => {
        setNavigation({
            canSkip: false,
            canForward: false,
            showForward: false,
            triggerLWRAPICall: false
        });
    }, []);

    useEffect(() => {
        // setting up local state to initial value for next car
        setCoverages({});
        const submissionVM = getSingleSubmissionVM();
        if (
            submissionVM.lobData
            && submissionVM.lobData.privateCar
            && submissionVM.lobData.privateCar.coverables
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0]
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value
            && submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value.code
        ) {
            setPaymentType(submissionVM.lobData.privateCar.coverables.vehicles.children[0].insurancePaymentType.value.code);
        }

        const offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        const tempOffQuotesAvailPayType = offeredQuotes.some(({ hastingsPremium }) => !!hastingsPremium.monthlyPayment);
        setIsOffQuotesPayTypeMonthly(tempOffQuotesAvailPayType);

        const BranchCodeAndName = offeredQuotes.filter((offeredQuote) => (!(offeredQuote.hastingsErrors
            && offeredQuote.hastingsErrors.filter((hastingsError) => (hastingsError.technicalErrorCode === UW_ERROR_CODE
                || hastingsError.technicalErrorCode === GREY_LIST_ERROR_CODE)).length > 0)))
            .map(({ branchName, branchCode }) => ({
                brandCode: branchCode,
                brandName: branchName
            }));
        setBrands(BranchCodeAndName);
        const regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`) || '';
        const tempMake = _.get(submissionVM, `${vehiclePath}.value.make`) || '';
        const tempModel = _.get(submissionVM, `${vehiclePath}.value.model`) || '';
        setRegistrationsNumber(formatRegNumber(regNum));
        setMake(tempMake);
        setModel(tempModel);
    }, [submissionVMIndex]);

    useEffect(() => {
        const submissionVM = getSingleSubmissionVM();
        const offerings = _.get(submissionVM, offeringsPath) || [];
        const result = {};
        brands.forEach(({ brandCode }) => {
            const offeringForBrand = offerings.find((offering) => offering.branchCode === brandCode);
            if (offeringForBrand) {
                const vehicleCoverages = offeringForBrand.coverages.vehicleCoverages[0].coverages;
                const ancillaryCoverages = offeringForBrand.coverages.ancillaryCoverages[0].coverages;
                _.set(result, brandCode, [...vehicleCoverages, ...ancillaryCoverages]);
            }
        });
        setCoverages(result);
    }, [brands]);

    const mcYourQuoteInfoText = () => {
        if (isPCWJourney && submissionVMIndex === 0) {
            return (
                <>
                    <span>
                        {messages.mcPCWYourQuoteParagraph(selectedBrandName)}
                    </span>
                    <span className="font-weight-bold">
                        {getPCWName(pcwName)}
                    </span>
                </>
            );
        }
        return (<span>{messages.mcYourQuoteParagraph}</span>);
    };

    const getBrands = () => brands.map(({ brandCode }) => ({
        value: brandCode,
        image: ICONS[brandCode],
        stickyHeaderText: brandCode === HASTINGS_PREMIER ? messages.motorLegalBreakdownText : null
    }));

    const displayAmount = ({ amount, currency }, braces = false, prefix = '') => {
        const currencySymbols = {
            gbp: '£'
        };
        const value = `${prefix}${currencySymbols[currency]}${amount.toFixed(2)}`;
        return braces ? `{${value}}` : value;
    };

    const displayCurrency = (value) => `£${value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const findCoverageByBrandAndId = (brandCode, id) => {
        if (!_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode].find((cov) => cov.publicID === id);
        }
        return null;
    };

    const displayCoverage = (coverage, prefix) => {
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
                value: displayAmount(amount, false, prefix)
            };
        }
        return {
            value: false
        };
    };

    const findCoverageByBrandAndName = (brandCode, name) => {
        if (!_.isEmpty(coverages) && brandCode) {
            return coverages[brandCode].find((cov) => cov.name === name);
        }
        return null;
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
            cells: brands.map(({ brandCode }) => {
                if (covName === messages.legalCoverName || covName === messages.roadsideAssistantCovName) {
                    const coverage = findCoverageByBrandAndName(brandCode, covName);
                    const prefix = covName === messages.roadsideAssistantCovName ? 'from ' : '+ ';
                    return displayCoverage(coverage, prefix);
                    // eslint-disable-next-line no-else-return
                } else if (covName === messages.drivingOtherCarsCovName) {
                    const coverage = findCoverageByBrandAndName(brandCode, covName);
                    return { value: coverage ? coverage.selected : false };
                }
                return { value: BRAND_AVAILABLE_FEATURE[brandCode][covName] };
            })
        }));
    };

    const getData = () => {
        const submissionVM = getSingleSubmissionVM();
        const offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        const availableBrandsValues = brands.map((brand) => brand.brandCode);
        const availableQuotes = offeredQuotes.filter(({ branchCode }) => availableBrandsValues.includes(branchCode));
        const allData = [{
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
        },
        {
            rowLabel: messages.totalExcessLabel,
            cells: availableBrandsValues.map((brandCode) => {
                const accidentalDamageCov = findCoverageByBrandAndId(brandCode, messages.acctidentalDamageCovId);
                const coverTypeValue = _.get(submissionVM, `${coverTypePath}.value`);
                let totalExcessValue = accidentalDamageCov
                    ? accidentalDamageCov.terms.filter((amt) => amt.publicID !== messages.pcAccOnlineCompExcessKey)
                        .reduce((total, current) => total + current.directValue, 0) : 0;
                if (coverTypeValue && coverTypeValue.code === 'tpft') {
                    const fireAndTheftCov = findCoverageByBrandAndId(brandCode, messages.fireAndTheftKey);
                    totalExcessValue = fireAndTheftCov ? fireAndTheftCov.terms.filter((amt) => amt.publicID !== messages.pcOnlineLossFireTheftCompExcessCTKey)
                        .reduce((total, current) => total + current.directValue, 0) : 0;
                }
                return {
                    value: displayCurrency(totalExcessValue)
                };
            })
        },
        ...getCoveragesToDisplay(availableBrandsValues)];

        if (paymentType === PAYMENT_TYPE_MONTHLY_CODE && isOffQuotesPayTypeMonthly) {
            return allData;
        }

        return allData.filter((item) => item.rowLabel !== messages.payMonthlyLabel);
    };

    // applyDiscountOnMulticar API to update the discount
    const applyDiscountAPITriggerPoint = () => {
        HDQuoteService.applyDiscountOnMulticar(getDataForMultiQuoteAPICall(mcsubmissionVM))
            .then(({ result }) => {
                setSelectedBrand(null);
                trackAPICallSuccess('Apply Discount On Multicar');
                setTotalDiscount(getAmountAsTwoDecimalDigitsOrWhole(result.totalMPDiscount));
                _.set(mcsubmissionVM, 'value', result);
                setNavigation({
                    isDiscountApplied: true
                });
                hideLoader();
                history.push(routes.COVERAGE_TRANSITION);
            }).catch((error) => {
                trackAPICallFail('Apply Discount On MC', 'Apply Discount On MC Failed');
                hideLoader();
                setErrorStatusCode(error.status);
            });
    };

    // updateSelectedVersionForMP API to update the selected cover
    const updateSelectVersionForMPAPITriggerPoint = (brandName) => {
        const submissionVM = getSingleSubmissionVM();
        HDQuoteService.updateSelectedVersionForMP(getUpdateSelectedVersionForMPAPI(submissionVM, mcsubmissionVM, brandName))
            .then(({ result }) => {
                trackQuoteData(result, translator);
                trackAPICallSuccess('Update Selected Version For MP');
                setTotalDiscount(getAmountAsTwoDecimalDigitsOrWhole(result.totalMPDiscount));
                _.set(mcsubmissionVM, 'value', result);
                hideLoader();
            }).catch((error) => {
                trackAPICallFail('Update Selected Version For MP', 'Update Selected Version For MP Failed');
                hideLoader();
                // TODO: Business will confirm
                // setErrorStatusCode(error.status);
            });
    };

    const handleBrandSelection = (event) => {
        setSelectedBrand(event.target.value);
        const submissionVM = getSingleSubmissionVM();
        const offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        const filteredOfferedQuotes = offeredQuotes.filter((offeredQuotesObj) => {
            return offeredQuotesObj.branchCode === event.target.value;
        });
        setSelectedBrandName(filteredOfferedQuotes[0].branchName);
        if (submissionVMIndex === mcsubmissionVM.value.quotes.length - 1) {
            updateSelectVersionForMPAPITriggerPoint(filteredOfferedQuotes[0].branchName);
            showLoader();
        }
        setCanForward(true);
    };

    const handleForward = () => {
        const submissionVM = getSingleSubmissionVM();
        const offeredQuotes = _.get(submissionVM, offeredQuotesPath) || [];
        const filteredOfferedQuotes = offeredQuotes.filter((offeredQuotesObj) => {
            return offeredQuotesObj.branchCode === selectedBrand;
        });
        const tempSelectedMCQuotes = [...selectedMCQuotes];
        const [first] = filteredOfferedQuotes;
        tempSelectedMCQuotes[submissionVMIndex] = first;
        setSelectedMCQuotes(tempSelectedMCQuotes);
        setCanForward(false);
        if (submissionVMIndex < mcsubmissionVM.value.quotes.length - 1) {
            incrementCurrentPageIndex();
            setSelectedBrand(null);
            setSubmissionVMIndex(submissionVMIndex + 1);
            updateSelectVersionForMPAPITriggerPoint(selectedBrandName);
            trackView({
                page_name: 'HastingsMCYourQuotePage',
                page_type: 'Car Insurance - Get Price',
                sales_journey_type: 'multi_car',
                page_section: 'Page'
            });
            showLoader();
        } else {
            applyDiscountAPITriggerPoint();
            setMultiOfferedQuotesDetails(tempSelectedMCQuotes);
            showLoader();
        }
    };

    const handleBackward = () => {
        if (selectedMCQuotes.length && submissionVMIndex > 0) {
            const prevSelectedMCQuote = selectedMCQuotes[submissionVMIndex - 1];
            trackView({
                page_name: 'HastingsMCYourQuotePage',
                page_type: 'Car Insurance - Get Price',
                sales_journey_type: 'multi_car',
                page_section: 'Page'
            });
            setSelectedBrand(prevSelectedMCQuote.branchCode);
        }
        setCanForward(true);
        if (submissionVMIndex === 0 || (submissionVMIndex === 1 && isAddAnotherCar)) {
            history.push(routes.MC_SAVINGS_PAGE);
        } else {
            decrementCurrentPageIndex();
            setSubmissionVMIndex(submissionVMIndex - 1);
        }
    };

    const getQuoteHeader = () => {
        const submissionVM = getSingleSubmissionVM();
        const isParentPolicy = _.get(submissionVM, 'isParentPolicy.value') || false;
        if (isParentPolicy && !isPCWJourney) {
            return messages.mcYourQuoteHeader;
        // eslint-disable-next-line no-else-return
        } else if (!isParentPolicy && !isPCWJourney) {
            return messages.mcChildCarYourQuoteHeader;
        } else if (isPCWJourney && !isParentPolicy && isAddAnotherCar) {
            return messages.mcYourQuoteHeader;
        } else if (isPCWJourney && isParentPolicy && isEditQuoteJourney) {
            return messages.mcYourQuoteHeader;
        } else if (isPCWJourney && !isParentPolicy && isEditQuoteJourney) {
            return messages.mcChildCarYourQuoteHeader;
        }
    };

    return (
        <>
            {getSingleSubmissionVM() && (!_.isEmpty(coverages)) && (
                <>
                    <Container fluid>
                        <Row>
                            <Col className="hd-mc-your-quotes__head">
                                <Row className="margin-top-md">
                                    <Col>
                                        <BackNavigation
                                            id="backNavMCYourQuote"
                                            className="ml-md-5"
                                            onClick={() => handleBackward()}
                                            onKeyPress={() => handleBackward()} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} md={{ span: 10, offset: 1 }}>
                                        <HDLabelRefactor
                                            Tag="h1"
                                            text={(
                                                <span>
                                                    {getQuoteHeader()}
                                                    <span className="d-md-block">{`${getCarName(make, model)}...`}</span>
                                                </span>
                                            )}
                                            className="font-bold text-center"
                                            id="hd-mc-your-quotes-make-model-text" />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container className="hd-mc-your-quotes-container">
                        <Row>
                            <Col xs={12} md={{ span: 10, offset: 1 }}>
                                <Row className="justify-content-center">
                                    <HDLabelRefactor
                                        Tag="h2"
                                        text={registrationsNumber}
                                        className="hd-mc-your-quotes__reg-num"
                                        id="hd-mc-your-quotes-choose-label" />
                                </Row>
                                <Row>
                                    <Col className="px-sm-0">
                                        <HDQuoteInfoRefactor className="margin-bottom-lg">
                                            {mcYourQuoteInfoText()}
                                        </HDQuoteInfoRefactor>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="p-0">
                                        <HDTable
                                            webAnalyticsEvent={{ event_action: messages.chooseCover }}
                                            id="hd-mc-your-quotes-coverlevel-type-table"
                                            className="elevated-box hd-mc-your-quotes__cover-table"
                                            name="brand"
                                            selectedHeaderValue={selectedBrand}
                                            onSelect={handleBrandSelection}
                                            headerValues={getBrands()}
                                            defaultIndex={getBrands().findIndex((brand) => brand.value === selectedBrand)}
                                            data={getData()}
                                            hideBubbleOnHeaderSticky />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <HDLabelRefactor
                                            Tag="h2"
                                            text={messages.getTotalMultiCarSavingText(totalDiscount)}
                                            className="hd-mc-your-quotes__total-savings-label font-bold margin-top-xl"
                                            id="hd-mc-your-quotes-total-saving-text" />
                                        <HDLabelRefactor
                                            Tag="p"
                                            text={messages.savingTextBasedOnCurrCovSel}
                                            className="hd-mc-your-quotes__total-savings-sublabel text-small margin-bottom-lg"
                                            id="hd-mc-your-quotes-saving-text" />
                                        <HDButton
                                            webAnalyticsEvent={{
                                                event_action: `${messages.confirmCovLabel} {REG_NUMBER}`,
                                                event_value: `${messages.confirmCovLabel} {REG_NUMBER}`
                                            }}
                                            id="hd-mc-your-quotes-continue-button"
                                            variant="primary"
                                            size="md"
                                            label=""
                                            onClick={() => handleForward()}
                                            className="hd-mc-your-quotes__confirm-cover-btn mx-auto theme-white mb-4 mb-md-5"
                                            disabled={!canForward}
                                        >
                                            <span>
                                                <span className="hd-mc-your-quotes__confirm-cover-btn__regular-text">{messages.confirmCovLabel}</span>
                                                <span className="hd-mc-your-quotes__reg-num--small">{registrationsNumber}</span>
                                            </span>
                                        </HDButton>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
            {HDFullscreenLoader}
            {HDToast}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        isPCWJourney: state.wizardState.app.isPCWJourney,
        pcwName: state.wizardState.app.pcwName
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
    setMultiOfferedQuotesDetails: setMultiOfferedQuotesDetailsAction,
    setErrorStatusCode: setErrorStatusCodeAction,
    incrementCurrentPageIndex: incrementCurrentPageIndexAction,
    decrementCurrentPageIndex: decrementCurrentPageIndexAction
};

HDMCYourQuotesPage.propTypes = {
    setNavigation: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object,
    }).isRequired,
    setMultiOfferedQuotesDetails: PropTypes.func.isRequired,
    setErrorStatusCode: PropTypes.func.isRequired,
    incrementCurrentPageIndex: PropTypes.func.isRequired,
    decrementCurrentPageIndex: PropTypes.func.isRequired,
    isPCWJourney: PropTypes.bool.isRequired,
    pcwName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCYourQuotesPage);
