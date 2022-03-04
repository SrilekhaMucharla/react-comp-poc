import { Col, Row, Container } from 'react-bootstrap';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsPaymentService } from 'hastings-capability-payment';
import {
    HDQuoteInfoRefactor, HDLabelRefactor, HDInfoCardRefactor
} from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { AnalyticsHDModal as HDModal } from '../../../web-analytics';
import HDQuoteService from '../../../api/HDQuoteService';
import cardSecurityIcon from '../../../assets/images/icons/card_security_icon.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import {
    PAYMENT_TYPE_ANNUALLY_CODE,
    PAYMENT_TYPE_MONTHLY_CODE,
    WORLDPAY_MERCHANT_CODE,
    OPENING_HOURS
} from '../../../constant/const';
import loadWorldpayIframe from '../../../customer/directintegrations/worldpay/worldpay';
import EventEmmiter from '../../../EventHandler/event';
import { setSubmissionVM } from '../../../redux-thunk/actions';
import { getAmount as getHeaderAmount, getBindAndIssueAPIObject } from '../../../common/utils';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import * as messages from './HDPaymentPage.messages';
import arcTop from '../../../assets/images/background/top-arc.svg';
import {
    getMonthlyInitialPaymentAmount, getParentQuoteID, getPCStartDate, getAnnuallyInitialPayment
} from '../../../common/submissionMappers/helpers';

const NEW_CARD_TRANSACTION_TYPE = 'newcardpayment';

export const HDPaymentPage = ({
    submissionVM,
    customizeSubmissionVM,
    paymentType,
    toggleContinueElement,
    onAbort,
    onPaymentSuccess,
    onMoveThankYouPage,
    onBindFailure,
    dispatch,
    pageMetadata,
    multiCarFlag,
    mcPaymentSchedule
}) => {
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader(0);
    const [error, setError] = useState(null);
    const [bindAndIssueData, setBindAndIssueData] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    const viewModelService = useContext(ViewModelServiceContext);

    const paymentdetailsinfoDto = (viewModelService) ? viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.policyjob.dto.HastingsPaymentDetailsDTO',
    ) : null;

    const getSCAmount = () => {
        const firstMonthlyPayment = _.get(customizeSubmissionVM, 'quote.hastingsPremium.monthlyPayment.firstInstalment');
        const annuallyPayment = _.get(customizeSubmissionVM, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost');

        return (paymentType === PAYMENT_TYPE_MONTHLY_CODE && firstMonthlyPayment) ? firstMonthlyPayment.value : annuallyPayment.value;
    };

    const checkForAfordability = () => {
        return _.get(customizeSubmissionVM, 'value.insurancePaymentType');
    };

    const getErrorMessageBasedOnMultiCar = () => {
        if (multiCarFlag) {
            return customizeSubmissionVM.value.mpwrapperNumber;
        }
        return submissionVM.value.quoteID;
    };

    const getMCAmount = () => {
        let affordablePaymentPlan = PAYMENT_TYPE_ANNUALLY_CODE;

        affordablePaymentPlan = checkForAfordability();

        const payment = { amount: 0, currency: 'gbp' };

        if (affordablePaymentPlan === PAYMENT_TYPE_MONTHLY_CODE) {
            payment.amount = getMonthlyInitialPaymentAmount(submissionVM, mcPaymentSchedule);
        } else {
            payment.amount = getAnnuallyInitialPayment(submissionVM, customizeSubmissionVM);
        }
        return payment;
    };

    const getAmount = () => {
        if (multiCarFlag) {
            return getMCAmount();
        }
        return getSCAmount();
    };

    const checkDefCaseAnnually = (customQuoteObj) => {
        const pcDate = dayjs(getPCStartDate(submissionVM));
        const quoteStartDateObj = customQuoteObj.periodStartDate;
        const quoteStartDate = dayjs(`${_.get(quoteStartDateObj, 'year')}-${1 + _.get(quoteStartDateObj, 'month')}-${_.get(quoteStartDateObj, 'day')}`);
        return quoteStartDate.diff(pcDate, 'day') > 30;
    };

    const checkDefCaseMonthly = (customQuoteObj) => {
        let isDeferred = true;
        let initialPaymentDateObj;
        mcPaymentSchedule.mcPaymentScheduleObject.map((singlePaymentScheduleObj) => {
            if (singlePaymentScheduleObj.submissionID === getParentQuoteID(submissionVM)) {
                initialPaymentDateObj = singlePaymentScheduleObj.paymentSchedule[0].paymentDate;
            }
            return null;
        });
        mcPaymentSchedule.mcPaymentScheduleObject.map((singlePaymentScheduleObj) => {
            if (customQuoteObj.quoteID === singlePaymentScheduleObj.submissionID) {
                const firstInstalmentDate = singlePaymentScheduleObj.paymentSchedule[0].paymentDate;
                if (initialPaymentDateObj.month === firstInstalmentDate.month && initialPaymentDateObj.day === firstInstalmentDate.day
                    && initialPaymentDateObj.year === firstInstalmentDate.year) {
                    isDeferred = false;
                }
            }
            return null;
        });
        return isDeferred;
    };

    const getDepositAmountByPayingScheduled = (cq) => {
        if (checkForAfordability() === PAYMENT_TYPE_ANNUALLY_CODE) {
            return cq.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
        }
        return cq.quote.hastingsPremium.monthlyPayment.firstInstalment.amount;
    };

    const getTodaysDeposit = () => {
        const { customQuotes } = customizeSubmissionVM.value;
        const result = [];
        customQuotes.map((cq) => {
            let isQuoteDeferred = false;
            if (checkForAfordability() === PAYMENT_TYPE_ANNUALLY_CODE) {
                isQuoteDeferred = checkDefCaseAnnually(cq);
            } else { isQuoteDeferred = checkDefCaseMonthly(cq); }
            if (!isQuoteDeferred) {
                result.push({
                    jobNumber: cq.quoteID,
                    depositCollected: {
                        amount: getDepositAmountByPayingScheduled(cq)
                    }
                });
            }
            return null;
        });

        return result;
    };

    const getOrderCodeRequestData = (payerInfo, sessionUUID) => {
        if (multiCarFlag) {
            return {
                sessionUUID: sessionUUID,
                merchantCode: WORLDPAY_MERCHANT_CODE,
                transactionType: NEW_CARD_TRANSACTION_TYPE,
                paymentAmount: {
                    ...getAmount(),
                    amount: getAmount().amount.toFixed(2),
                },
                payerInfo,
                isPayerPolicyOwner: true, // check this from subission vms,
                mpwrapperJobNumber: customizeSubmissionVM.value.mpwrapperJobNumber, // needed only for MC
                mpwrapperNumber: customizeSubmissionVM.value.mpwrapperNumber,
                paymentDueTodayList: [
                    ...getTodaysDeposit()
                ]
            };
        }
        return {
            sessionUUID: sessionUUID,
            quoteId: customizeSubmissionVM.value.quoteID,
            merchantCode: WORLDPAY_MERCHANT_CODE,
            transactionType: NEW_CARD_TRANSACTION_TYPE,
            payerInfo: _.get(submissionVM, 'baseData.accountHolder.value'), // duplicate
            paymentAmount: {
                ...getAmount(),
                amount: getAmount().amount.toFixed(2),
            },
        };
    };


    const getPaymentFrequency = () => {
        if (!multiCarFlag) {
            const firstMonthlyPayment = _.get(customizeSubmissionVM, 'quote.hastingsPremium.monthlyPayment.firstInstalment');
            return (paymentType === PAYMENT_TYPE_MONTHLY_CODE && firstMonthlyPayment) ? messages.monthly : messages.everyyear;
        }
        return checkForAfordability() === PAYMENT_TYPE_MONTHLY_CODE ? messages.monthly : messages.everyyear;
    };

    const handleFetchingOrderCode = useCallback((clearErrors) => {
        const { sessionUUID } = customizeSubmissionVM.value;
        const payerInfo = multiCarFlag ? submissionVM.value.accountHolder : _.get(submissionVM, 'baseData.accountHolder.value');
        const fetchHostedPaymentURL = (dto) => {
            HastingsPaymentService.fetchHostedPaymentURL(dto)
                .then(({
                    result: {
                        errors, referenceValue, merchantCode, orderCode, referenceID
                    }
                }) => {
                    if (errors && errors.length) {
                        setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
                    } else {
                        setPaymentUrl(referenceValue);
                        setBindAndIssueData({
                            merchantCode,
                            orderCode,
                            referenceID
                        });
                        if (clearErrors) {
                            setError(null);
                        }
                    }
                })
                .catch(() => {
                    setPaymentUrl(null);
                    setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
                });
        };

        const handleFetchingHostedPaymentURL = (orderCode) => {
            const paymentData = {
                sessionUUID: sessionUUID,
                quoteId: multiCarFlag ? customizeSubmissionVM.value.mpwrapperNumber : customizeSubmissionVM.value.quoteID,
                orderCode,
                paymentDescription: multiCarFlag ? `Reference: ${customizeSubmissionVM.value.mpwrapperJobNumber}` : `Reference: ${submissionVM.value.quoteID}`,
                paymentAmount: {
                    ...getAmount(),
                    amount: getAmount().amount.toFixed(2)
                },
                orderContent: messages.orderContent
            };
            fetchHostedPaymentURL(paymentData);
        };

        const getFetchOrderHandler = () => {
            if (multiCarFlag) return HastingsPaymentService.fetchOrderCodeMP;
            return HastingsPaymentService.fetchOrderCode;
        };

        const fetchOrderCode = (dto) => {
            showLoader();
            getFetchOrderHandler()(dto)
                .then(({ result: orderCode }) => {
                    handleFetchingHostedPaymentURL(orderCode);
                })
                .catch(() => {
                    setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
                })
                .finally(() => {
                    hideLoader();
                });
        };

        const orderCodeRequest = getOrderCodeRequestData(payerInfo, sessionUUID);

        fetchOrderCode(orderCodeRequest);
    }, []);

    useEffect(() => {
        toggleContinueElement(false);
    }, [toggleContinueElement]);

    useEffect(() => {
        EventEmmiter.dispatch('change', { price: null });
        handleFetchingOrderCode(true);
    }, []);

    const getDepositCollected = (quote) => {
        const { bindData } = quote;
        const { chosenQuote } = bindData;
        const payableQuote = quote.quoteData.offeredQuotes.filter((qd) => qd.publicID === chosenQuote)[0];
        const { hastingsPremium } = payableQuote;
        if (checkForAfordability() === PAYMENT_TYPE_ANNUALLY_CODE) {
            const { annuallyPayment } = hastingsPremium;
            return annuallyPayment.premiumAnnualCost;
        }
        const { monthlyPayment } = hastingsPremium;
        return monthlyPayment.firstInstalment;
    };
    const getContactPhone = () => {
        const parentPolicy = submissionVM.value.quotes.filter((qd) => qd.isParentPolicy)[0];
        if (!parentPolicy) return '';
        const { baseData } = parentPolicy;
        const { accountHolder } = baseData;
        return _.get(accountHolder, 'cellNumber', '');
    };

    const alignBindIssueAPIObjectMC = () => {
        const { sessionUUID } = customizeSubmissionVM.value;
        const result = { ...customizeSubmissionVM.value };

        result.bindData = {
            ...submissionVM.value.quotes[0].bindData,
            contactPhone: getContactPhone(),
        };
        result.quotes = submissionVM.value.quotes.map((q) => {
            const quoteObj = {
                ...q,
                bindData: {
                    ...q.bindData,
                    contactPhone: getContactPhone(),
                    paymentDetailsInfo: {
                        ...q.bindData.paymentDetailsInfo,
                        ...bindAndIssueData,
                        ...paymentdetailsinfoDto.value,
                        depositCollected: {
                            ...getDepositCollected(q)
                        },
                        depositCollectedMP: {
                            ...getAmount(),
                            amount: getAmount().amount.toFixed(2)
                        },
                    }
                },
                sessionUUID: sessionUUID,
            };
            const { customQuotes } = customizeSubmissionVM.value;
            let isQuoteDeferred = false;
            customQuotes.map((customQuoteObj) => {
                if (customQuoteObj.quoteID === q.quoteID) {
                    if (checkForAfordability() === PAYMENT_TYPE_ANNUALLY_CODE) {
                        isQuoteDeferred = checkDefCaseAnnually(customQuoteObj);
                    } else { isQuoteDeferred = checkDefCaseMonthly(customQuoteObj); }
                }
                return null;
            });
            if (isQuoteDeferred) { delete quoteObj.bindData.paymentDetailsInfo.depositCollected; }
            return quoteObj;
        });
        return result;
    };

    const makeSubmissionVmRequest = (mcResult) => {
        if (multiCarFlag) return { ...submissionVM.value, ...mcResult };
        return { ...submissionVM.value };
    };

    const getBindAndIssueService = () => {
        if (multiCarFlag) return HDQuoteService.mcBindAndIssue;
        return HDQuoteService.bindAndIssueService;
    };

    const handleSingleCarResponse = (response) => {
        if (response.result.passwordToken && response.result.passwordToken.token) {
            onPaymentSuccess();
        } else {
            onMoveThankYouPage();
        }
    };

    const handleMultiCarResponse = (response) => {
        const { quotes } = response.result;
        const parentPolicy = quotes.filter((qd) => qd.isParentPolicy)[0];
        const { passwordToken } = parentPolicy;
        if (passwordToken && passwordToken.token) {
            onPaymentSuccess();
        } else {
            onMoveThankYouPage();
        }
    };
    // the affordablePaymentPlan is not returned from BE we need to perist that because of HDMCCustomizeQuoteWizard routing logic.
    const persistAffordablePaymentPlan = (result) => {
        if (multiCarFlag) {
            const parentPolicy = result.quotes.filter((qd) => qd.isParentPolicy)[0];
            parentPolicy.baseData = {
                ...parentPolicy.baseData,
                affordablePaymentPlan: checkForAfordability()
            };
            let newQuotes = result.quotes.filter((qd) => !qd.isParentPolicy);
            newQuotes = [...newQuotes, parentPolicy];
            const newResult = {
                ...result,
                quotes: [...newQuotes]
            };
            return newResult;
        }
        return result;
    };

    const callBindAPI = () => {
        if (paymentdetailsinfoDto && bindAndIssueData) {
            getBindAndIssueAPIObject(submissionVM, paymentdetailsinfoDto, bindAndIssueData, getAmount(), getPaymentFrequency());
            let subVMRequest = null;
            if (multiCarFlag) {
                subVMRequest = alignBindIssueAPIObjectMC();
            }
            showLoader();
            const handler = getBindAndIssueService();
            const requestData = makeSubmissionVmRequest(subVMRequest);
            handler(requestData).then((result) => {
                let responseData = result.result;
                if (multiCarFlag) {
                    responseData = persistAffordablePaymentPlan(result.result);
                }
                _.set(submissionVM, 'value', responseData);
                dispatch(setSubmissionVM({ submissionVM: submissionVM }));
                if (multiCarFlag) {
                    handleMultiCarResponse(result);
                } else {
                    handleSingleCarResponse(result);
                }
            }).catch(() => {
                setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
                setPaymentUrl(null);
                onBindFailure();
            }).finally(() => {
                hideLoader();
            });
        }
    };

    useEffect(() => {
        const showErrorAndTryAgain = () => {
            setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
            handleFetchingOrderCode(false);
        };

        const handleAbort = () => {
            const monthlyAmount = _.get(customizeSubmissionVM, 'quote.hastingsPremium.monthlyPayment.firstInstalment.value.amount');
            const annuallyAmount = _.get(customizeSubmissionVM, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.value.amount');
            const paymentFrequency = (paymentType === PAYMENT_TYPE_MONTHLY_CODE && monthlyAmount)
                ? PAYMENT_TYPE_MONTHLY_CODE : PAYMENT_TYPE_ANNUALLY_CODE;

            EventEmmiter.dispatch('change', getHeaderAmount(paymentFrequency, annuallyAmount, monthlyAmount));

            onAbort();
        };

        const worldpayResultCallback = ({ order: { status }, gateway: { paymentStatus } }) => {
            switch (status) {
                case messages.error:
                    setShowPopup(true);
                    break;
                case messages.failure:
                    if (paymentStatus === messages.refused || paymentStatus === messages.canceled) {
                        setShowPopup(true);
                    } else {
                        showErrorAndTryAgain();
                    }
                    break;
                case messages.success:
                    if (!_.isEmpty(bindAndIssueData)) {
                        callBindAPI();
                    } else {
                        setError(messages.getErrorMessage(getErrorMessageBasedOnMultiCar()));
                        setPaymentUrl(null);
                    }
                    break;
                case messages.cancelledByShopper:
                    handleAbort();
                    break;
                default:
            }
        };

        if (paymentUrl) {
            loadWorldpayIframe(paymentUrl, worldpayResultCallback);
        }
    }, [paymentUrl, bindAndIssueData]);

    const handleModalConfirmation = () => {
        setShowPopup(false);
        handleFetchingOrderCode(true);
    };

    const displayParagraphs = (paragraphs) => (
        paragraphs.map((paragraph, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i}>{paragraph}</p>
        )));

    const headerLabel = (
        <>
            &pound;
            {getAmount().amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </>
    );

    return (
        <Container fluid className="payment-page">
            <div className="arc-header">
                <img className="arc-header_arc" alt="arc-header" src={arcTop} />
            </div>
            <Container>
                <Row>
                    <Col xs={12} md={7} className="payment-page__main-header">
                        <HDLabelRefactor
                            className="h1"
                            Tag="span"
                            text={messages.pageHeaderPartOne} />
                        <HDLabelRefactor
                            className="payment-page__amount h1"
                            Tag="span"
                            text={headerLabel} />
                        <HDLabelRefactor
                            className="h1"
                            Tag="span"
                            text={messages.pageHeaderPartTwo} />
                    </Col>
                </Row>
                <Row className="payment-page__page-content">
                    <Col xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }} className="payment-page__page-content--pay">
                        <div className="payment-page__worldpay-container-wrapper">
                            <div className="payment-page__worldpay-container">
                                <Row className="payment-page__label">
                                    <Col xs="auto">
                                        <img className="payment-page__info-icon" src={cardSecurityIcon} alt="Card_Security_Icon" />
                                    </Col>
                                    <Col className="text-left pl-0">
                                        <p className="text-small mb-0">{messages.worldpayContainerLabel}</p>
                                    </Col>
                                </Row>
                                {error && (
                                    <Row className="payment-page__error-box">
                                        <Col>
                                            <span>{error}</span>
                                        </Col>
                                    </Row>
                                )}
                                {paymentUrl && (
                                    <Row>
                                        <Col>
                                            <div id="worldpay" className="payment-page__worldpay" />
                                        </Col>
                                    </Row>
                                )}
                                <HDInfoCardRefactor
                                    id="payment-page-bank-appr-info-card"
                                    image={tipCirclePurple}
                                    paragraphs={[messages.extrasTipMessage]}
                                    theme="light"
                                    size="thin"
                                    className="mt-3 mt-md-4" />
                            </div>
                        </div>
                        <div className="payment-page__cancel-info-container">
                            <HDQuoteInfoRefactor>
                                {messages.cancelMessage}
                            </HDQuoteInfoRefactor>
                        </div>
                    </Col>
                    <Col xs={{ span: 12, order: 1 }} md={{ span: 5, order: 2 }} className="payment-page__page-content--info">
                        <div className="payment-page__payment-info-container">
                            <HDLabelRefactor
                                className="payment-page__payment-info-label my-0"
                                Tag="h2"
                                text={messages.paymentInfoContainerHeader} />
                            <HDLabelRefactor
                                className="payment-page__cpa-label"
                                Tag="h5"
                                text={messages.cpaHeader} />
                            <Row className="payment-page__cpa-content">
                                <Col>
                                    {displayParagraphs(messages.cpaContent)}
                                </Col>
                            </Row>
                            <HDQuoteInfoRefactor>
                                {messages.cpaExtraInfoContent}
                            </HDQuoteInfoRefactor>
                        </div>
                    </Col>
                </Row>
                <HDModal
                    webAnalyticsView={{ ...pageMetadata, page_section: messages.modalHeader }}
                    webAnalyticsEvent={{ event_action: messages.modalHeader }}
                    id="something-went-wrong-modal"
                    customStyle="payment-page__customize-quote"
                    show={showPopup}
                    headerText={messages.modalHeader}
                    confirmLabel={messages.modalConfirmButtonLabel}
                    onConfirm={handleModalConfirmation}
                    hideCancelButton
                    hideClose
                >
                    <p>{messages.modalFirstParagraph}</p>
                    <p>
                        {messages.modalSecondParagraph[0]}
                        <span className="payment-page__phone-number">{messages.modalPhoneNumber}</span>
                        {messages.modalSecondParagraph[1]}
                        <span className="payment-page__quote-ref">{customizeSubmissionVM.value.quoteID}</span>
                        {messages.modalSecondParagraph[2]}
                    </p>
                    <h5 className="payment-page__opening-hours-header">{messages.modalOpeningHoursHeader}</h5>
                    <div className="payment-page__opening-hours">
                        <div>
                            {OPENING_HOURS.map(({ days }, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <p key={i}>{days}</p>
                            ))}
                        </div>
                        <div>
                            {OPENING_HOURS.map(({ hours }, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <p key={i}>{hours}</p>
                            ))}
                        </div>
                    </div>
                    <p>{messages.modalLastParagraph}</p>
                </HDModal>
                {HDFullscreenLoader}
            </Container>
        </Container>
    );
};

const mapStateToProps = (state) => {
    const { multiCarFlag = false } = state.wizardState.app;
    const submissionVM = multiCarFlag ? state.wizardState.data.mcsubmissionVM : state.wizardState.data.submissionVM;
    const customizeSubmissionVM = multiCarFlag ? state.wizardState.data.multiCustomizeSubmissionVM : state.wizardState.data.customizeSubmissionVM;
    return {
        multiCarFlag: multiCarFlag,
        submissionVM: submissionVM,
        customizeSubmissionVM: customizeSubmissionVM,
        mcPaymentSchedule: state.mcPaymentScheduleModel
    };
};

const mapDispatchToProps = (dispatch) => ({
    setSubmissionVM,
    dispatch
});

HDPaymentPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object, value: PropTypes.object }),
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    paymentType: PropTypes.string.isRequired,
    toggleContinueElement: PropTypes.func,
    onAbort: PropTypes.func,
    onPaymentSuccess: PropTypes.func,
    onMoveThankYouPage: PropTypes.func,
    onBindFailure: PropTypes.func,
    dispatch: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    multiCarFlag: PropTypes.bool,
    mcPaymentSchedule: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }).isRequired
};

HDPaymentPage.defaultProps = {
    submissionVM: null,
    customizeSubmissionVM: null,
    multiCarFlag: false,
    toggleContinueElement: () => { },
    onAbort: () => { },
    onPaymentSuccess: () => { },
    onMoveThankYouPage: () => { },
    onBindFailure: () => { },
    dispatch: () => { },
};

export default connect(mapStateToProps, mapDispatchToProps)(HDPaymentPage);
