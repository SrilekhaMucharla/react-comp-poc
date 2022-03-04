/* eslint-disable max-len */
import {
    HDInfoCardRefactor, HDLabelRefactor, HDPaymentBreakdown, HDQuoteInfoRefactor
} from 'hastings-components';
import { HastingsPaymentService } from 'hastings-capability-payment';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import React, {
    useContext, useEffect, useState, useMemo
} from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
import {
    setSubmissionVM,
    setUpdateDDIVM
} from '../../../redux-thunk/actions';
import * as messages from './HDDirectDebitPage.messages';
import getMonthlyPaymentBreakDownData from './PaymentBreakdownMonthly';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import HDDirectDebitOverlay from './HDDirectDebitPageSECIOverlay';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import exclamation from '../../../assets/images/icons/exclamation-icon.svg';
import HDBankAccountDetailsPage from './HDBankAccountDetailsPage';
import HDImportantInfo from './HDImportantInfo';
import HDAccountHolderDetailsPage from './HDAccountHolderDetailsPage';
import HDPreferredPaymentDatePage from './HDPreferredPaymentDatePage';
import updateDDI from '../__helpers__/updateDDIVMInitial';
import useLoader from '../../Controls/Loader/useFullscreenLoader';
import formatRegNumber from '../../../common/formatRegNumber';

const HDDirectDebitPage = (props) => {
    const {
        customizeSubmissionVM,
        offeredQuoteObject,
        customQuoteData,
        submissionVM,
        dispatch,
        updateDDIVM,
        onGoBack,
        toggleContinueElement,
        triggerNextRoute,
        pageMetadata
    } = props;
    const [HDLoader, showLoaderBig, hideLoaderBig] = useLoader();
    const [payableAmount, setPayableAmount] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    const [firstMonthInstalment, setFirstMonthInstalment] = useState(0);
    const [elevenMonthInstalment, setElevenMonthInstalment] = useState(0);
    const [totalCreditCharge, setTotalCreditCharge] = useState(0);
    const [totalAmountToCredit, setActualAmount] = useState(0);
    const [invalidEntry] = useState(false);
    const viewModelService = useContext(ViewModelServiceContext);
    const [updateDDIVMCreated, setUpdateVMCreated] = useState(false);
    const [quoteId, setQuoteId] = useState('');
    const [enableContinue, setEnableContinue] = useState(false);
    const [isAccountHolderFormValid, setIsAccountHolderFormValid] = useState(true);
    const [isBankAccountFormValid, setIsBankAccountFormValid] = useState(false);
    const [isPreferredPaymentDateFormValid, setIsPreferredPaymentDateFormValid] = useState(false);
    const [dataForUpdateDDIApiCall, setDataForUpdateDDIApiCall] = useState({});
    const [accountHolderDetails, setAccountHolderDetails] = useState({});
    const paymentDay = useSelector((state) => state.wizardState.app.paymentDay);
    const quoteIDPath = 'value.quoteID';

    if (viewModelService) {
        if (!updateDDIVMCreated && _.get(updateDDIVM, quoteIDPath) === undefined) {
            dispatch(setUpdateDDIVM({
                updateDDIVM: viewModelService.create(
                    updateDDI,
                    'pc',
                    'com.hastings.edgev10.capabilities.payments.dto.request.DDIRequestDTO'
                ),
            }));
            setUpdateVMCreated(true);
        }
    }

    const vehicle = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.vehicles.children[0].value);
    const periodStartDate = useSelector((state) => state.wizardState.data.submissionVM.baseData.periodStartDate.value);
    const periodEndDate = useSelector((state) => state.wizardState.data.submissionVM.baseData.periodEndDate.value);

    const formattedRegNumber = useMemo(() => formatRegNumber(vehicle.registrationsNumber), [vehicle.registrationsNumber]);

    const onFormValidationHandler = (validationObj) => {
        // expexted { formName: accountHolderDetails/bankAccountDetails/preferredPaymentDate, value: true/false, dataForUpdate: {} }
        if (validationObj.formName === 'accountHolderDetails' && Object.keys(dataForUpdateDDIApiCall).length !== 0) {
            setIsAccountHolderFormValid(validationObj.value);
            setDataForUpdateDDIApiCall((oldData) => {
                // const newData = { ...oldData, loanHolder: { ...validationObj.dataForUpdate.driverDetails }, loanHolderAddress: { ...validationObj.dataForUpdate.driverAddress } };
                const newData = { ...oldData };
                newData.payerDetails.firstName = validationObj.dataForUpdate.driverDetails.firstName;
                newData.payerDetails.lastName = validationObj.dataForUpdate.driverDetails.lastName;
                newData.payerDetails.prefix = validationObj.dataForUpdate.driverDetails.prefix.value;
                newData.payerAddress = { ...validationObj.dataForUpdate.driverAddress };
                return newData;
            });
        }
        if (validationObj.formName === 'bankAccountDetails' && Object.keys(dataForUpdateDDIApiCall).length !== 0) {
            setIsBankAccountFormValid(validationObj.value);
            setDataForUpdateDDIApiCall((oldData) => {
                const newData = { ...oldData };
                newData.bankDetails.sortCode = validationObj.dataForUpdate.sortCode;
                newData.bankDetails.accountNumber = validationObj.dataForUpdate.accountNumber;
                return newData;
            });
        }
        if (validationObj.formName === 'preferredPaymentDate' && Object.keys(dataForUpdateDDIApiCall).length !== 0) {
            setIsPreferredPaymentDateFormValid(validationObj.value);
            setDataForUpdateDDIApiCall((oldData) => {
                const newData = { ...oldData };
                newData.preferredPaymentDate = validationObj.dataForUpdate.preferredPaymentDate;
                return newData;
            });
        }
    };

    const handleContinueTriggerButton = () => {
        dataForUpdateDDIApiCall.quoteID = submissionVM.value.quoteID;
        if (
            JSON.stringify(dataForUpdateDDIApiCall.payerDetails) === JSON.stringify(accountHolderDetails.loanHolder)
            && JSON.stringify(dataForUpdateDDIApiCall.payerAddress) === JSON.stringify(accountHolderDetails.loanHolderAddress)) {
            dataForUpdateDDIApiCall.isPayerPolicyOwner = true;
        } else {
            dataForUpdateDDIApiCall.isPayerPolicyOwner = false;
        }
        showLoaderBig();
        HastingsPaymentService.updateDDI(dataForUpdateDDIApiCall).then(({ result }) => {
            if (result.isUpdated) {
                triggerNextRoute();
            }
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            hideLoaderBig();
        });
    };

    useEffect(() => {
        setEnableContinue(isAccountHolderFormValid && isBankAccountFormValid && isPreferredPaymentDateFormValid);
    }, [isAccountHolderFormValid, isBankAccountFormValid, isPreferredPaymentDateFormValid]);

    useEffect(() => {
        if (customizeSubmissionVM && Object.keys(customizeSubmissionVM).length) {
            if (offeredQuoteObject && offeredQuoteObject.offeredQuotes && offeredQuoteObject.offeredQuotes.length) {
                const elevenMonthsInstalments = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.elevenMonthsInstalments');
                if (elevenMonthsInstalments) {
                    setElevenMonthInstalment(elevenMonthsInstalments.amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                }
            }
            const firstMonth = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.firstInstalment.amount');
            const totalPay = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount');
            const actualAmount = _.get(customizeSubmissionVM, 'value.quote.hastingsPremium.monthlyPayment.totalAmountCredit');
            const creditCharge = (totalPay - actualAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setTotalCreditCharge(creditCharge);
            if (firstMonth) {
                setFirstMonthInstalment(firstMonth.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            }
            if (totalPay) {
                setPayableAmount(totalPay.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            }
            if (actualAmount) {
                setActualAmount(actualAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            }
            if (paymentDay) {
                setIsPreferredPaymentDateFormValid(true);
            }
        }
    }, [setSubmissionVM, customizeSubmissionVM, offeredQuoteObject, submissionVM, paymentDay]);

    useEffect(() => {
        if (updateDDIVMCreated && updateDDIVM && Object.keys(updateDDIVM).length && _.get(updateDDIVM, quoteIDPath) === undefined) {
            if (offeredQuoteObject && offeredQuoteObject.offeredQuotes && offeredQuoteObject.offeredQuotes.length) {
                _.set(updateDDIVM.value, 'sessionUUID', submissionVM.value.sessionUUID);
                _.set(updateDDIVM.value, 'quoteID', submissionVM.value.quoteID);
                _.set(updateDDIVM.value, 'payerDetails.firstName', submissionVM.value.baseData.accountHolder.firstName);
                _.set(updateDDIVM.value, 'payerDetails.lastName', submissionVM.value.baseData.accountHolder.lastName);
                _.set(updateDDIVM.value, 'payerAddress', submissionVM.value.baseData.accountHolder.primaryAddress);
                _.set(updateDDIVM.value, 'payerDetails.prefix', submissionVM.value.baseData.accountHolder.prefix);
                setQuoteId(submissionVM.value.quoteID);
            }
        }
    }, [setSubmissionVM, submissionVM, updateDDIVMCreated, updateDDIVM, offeredQuoteObject]);
    useEffect(() => {
        let payerFromUpdate; let payerAddressFromUpdate;
        // Hide parent continue button
        toggleContinueElement(false);
        if (updateDDIVM && Object.keys(updateDDIVM).length) {
            payerFromUpdate = _.get(updateDDIVM.value, 'payerDetails', {});
            payerAddressFromUpdate = _.get(updateDDIVM.value, 'payerDetailspayerAddress', {});
        }
        setDataForUpdateDDIApiCall({
            sessionUUID: submissionVM.value.sessionUUID,
            quoteID: submissionVM.value.quoteID,
            payerDetails: {
                firstName: payerFromUpdate && payerFromUpdate.firstName ? payerFromUpdate.firstName : submissionVM.value.baseData.accountHolder.firstName,
                lastName: payerFromUpdate && payerFromUpdate.lastName ? payerFromUpdate.lastName : submissionVM.value.baseData.accountHolder.lastName,
                prefix: payerFromUpdate && payerFromUpdate.prefix ? payerFromUpdate.prefix : submissionVM.value.baseData.accountHolder.prefix
            },
            payerAddress: {
                addressLine1: payerAddressFromUpdate && payerAddressFromUpdate.addressLine1 ? payerAddressFromUpdate.addressLine1 : submissionVM.value.baseData.accountHolder.primaryAddress.addressLine1,
                city: payerAddressFromUpdate && payerAddressFromUpdate.city ? payerAddressFromUpdate.city : submissionVM.value.baseData.accountHolder.primaryAddress.city,
                county: payerAddressFromUpdate && payerAddressFromUpdate.county ? payerAddressFromUpdate.county : submissionVM.value.baseData.accountHolder.primaryAddress.county,
                postalCode: payerAddressFromUpdate && payerAddressFromUpdate.postalCode ? payerAddressFromUpdate.postalCode : submissionVM.value.baseData.accountHolder.primaryAddress.postalCode,
                country: payerAddressFromUpdate && payerAddressFromUpdate.country ? payerAddressFromUpdate.country : submissionVM.value.baseData.accountHolder.primaryAddress.country
            },
            bankDetails: {
                accountName: 'Test Account',
                accountNumber: '',
                sortCode: ''
            },
            isPayerPolicyOwner: true, // TODO check if this is correct (updateDDIVM/submissionVM in console)
            preferredPaymentDate: paymentDay ? paymentDay.value : null
        });
        setAccountHolderDetails({
            loanHolder: {
                firstName: submissionVM.value.baseData.accountHolder.firstName,
                lastName: submissionVM.value.baseData.accountHolder.lastName,
                prefix: submissionVM.value.baseData.accountHolder.prefix
            },
            loanHolderAddress: {
                addressLine1: submissionVM.value.baseData.accountHolder.primaryAddress.addressLine1,
                city: submissionVM.value.baseData.accountHolder.primaryAddress.city,
                county: submissionVM.value.baseData.accountHolder.primaryAddress.county,
                postalCode: submissionVM.value.baseData.accountHolder.primaryAddress.postalCode,
                country: submissionVM.value.baseData.accountHolder.primaryAddress.country
            }
        });

        if (customQuoteData.loading) {
            setShowLoader(true);
        } else {
            setShowLoader(false);
        }
    }, []);

    const copyDate = new Date();
    copyDate.setDate(copyDate.getDate() + 30);
    const prefStartDate = messages.onPrefferedDate;// Code must be removed once pref date integrated.
    const paymentBreakDownData = getMonthlyPaymentBreakDownData(firstMonthInstalment, elevenMonthInstalment, periodStartDate, periodEndDate, prefStartDate, formattedRegNumber, pageMetadata);
    const continueBtnColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 10, offset: 1 },
    };

    const continueBtnColPropsBtn = {
        xs: { span: 12, offset: 0 },
        md: { span: 4, offset: 0 },
        lg: { span: 3, offset: 0 },
    };

    return (
        <div className={`direct-debit${invalidEntry ? ' invalid' : ''}`}>
            <div className="arc-header" />
            <Col>
                {showLoader && (
                    <Row className="direct-debit__loader">
                        <Col>
                            Loading
                            <i className="fa fa-spinner fa-pulse" />
                        </Col>
                    </Row>
                )}
                <Row className="direct-debit--container offset-1">
                    <Col>
                        <BackNavigation
                            id="backNavMainWizard"
                            className="mb-0"
                            onClick={onGoBack}
                            onKeyPress={onGoBack} />
                    </Col>
                </Row>
                <Row className="direct-debit--container offset-1">
                    <Col>
                        <HDLabelRefactor id="direct-debit-title" className="direct-debit__title" Tag="h1" text={messages.pageHeader} />
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-3 px-3 ml-lg-3 order-lg-last direct-debit__body_right  pb-5 pb-lg-0">
                        <HDPaymentBreakdown title={messages.paymentBreakTitle} steps={paymentBreakDownData} />
                    </Col>
                    <Col xs={12} lg={6} className="p-4 mr-3 direct-debit__debit-left-container theme-white">
                        <Row>
                            <Col>
                                {(quoteId !== '' || _.get(updateDDIVM, quoteIDPath))
                                && (
                                    <HDAccountHolderDetailsPage
                                        submissionVM={submissionVM}
                                        updateDDIVM={updateDDIVM.value}
                                        onFormValidation={onFormValidationHandler}
                                        pageMetadata={pageMetadata} />
                                )}
                                <HDBankAccountDetailsPage customizeSubmissionVM={customizeSubmissionVM} onFormValidation={onFormValidationHandler} />
                                {(quoteId !== '' || _.get(updateDDIVM, quoteIDPath))
                                && (
                                    <HDPreferredPaymentDatePage
                                        updateDDIVM={updateDDIVM.value}
                                        onFormValidation={onFormValidationHandler}
                                        pageMetadata={pageMetadata} />
                                )}
                                <HDInfoCardRefactor
                                    theme="mint"
                                    className="direct-debit__debit-overlay-container-box mb-4"
                                    image={exclamation}
                                >
                                    <Row className="mb-2">
                                        <Col className="direct-debit__debit-overlay-container-box-content">
                                            <HDLabelRefactor text={messages.scciHeader} Tag="span" />
                                            <HDDirectDebitOverlay
                                                trigger={(
                                                    <HDLabelRefactor
                                                        Tag="a"
                                                        text={`${messages.scciText} ${messages.secci}`}
                                                        className="direct-debit__debit-overlay-link p-0" />
                                                )}
                                                {...props}
                                                dataList={{
                                                    firstPayment: firstMonthInstalment,
                                                    elevenMonths: elevenMonthInstalment
                                                }} />
                                            <span>
                                                {messages.scciMidNote}
                                            </span>
                                            <p className="mt-3">
                                                {messages.scciFootNote}
                                            </p>
                                        </Col>
                                    </Row>
                                </HDInfoCardRefactor>
                                <Row className="direct-debit__monthly-payment-box mx-0 mb-4">
                                    <Col>
                                        <Row>
                                            <Col>
                                                <HDLabelRefactor
                                                    className="direct-debit__imp mt-0"
                                                    Tag="h2"
                                                    text={messages.creditAgreement} />
                                            </Col>
                                        </Row>
                                        <Row className="direct-debit__line">
                                            <Col>
                                                {messages.costOfCover}
                                                <div className="mt-1">{messages.addedExtras}</div>
                                            </Col>
                                            <Col xs="auto" className="text-right pl-0">
                                                <b>
                                                    &pound;
                                                    {totalAmountToCredit}
                                                </b>
                                            </Col>
                                        </Row>
                                        <Row className="direct-debit__line direct-debit__total">
                                            <Col>{messages.creditCharge}</Col>
                                            <Col xs="auto" className="text-right pl-0">
                                                <b>
                                                    &pound;
                                                    {totalCreditCharge}
                                                </b>
                                            </Col>
                                        </Row>
                                        <Row className="direct-debit__line direct-debit__total pb-0">
                                            <Col>{messages.totalPayable}</Col>
                                            <Col xs="auto" className="text-right pl-0">
                                                <b>
                                                    &pound;
                                                    {payableAmount}
                                                </b>
                                            </Col>
                                        </Row>
                                        <Row className="direct-debit__rate-line">
                                            <Col>
                                                {messages.rateStatement.replace('APR_RATE', customizeSubmissionVM
                                                && customizeSubmissionVM.value
                                                && customizeSubmissionVM.value.quote
                                                && customizeSubmissionVM.value.quote.hastingsPremium
                                                && customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment
                                                && customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.representativeAPR
                                                    ? customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.representativeAPR
                                                    : '14.9').replace('INTEREST_RATE', customizeSubmissionVM
                                                        && customizeSubmissionVM.value
                                                        && customizeSubmissionVM.value.quote
                                                        && customizeSubmissionVM.value.quote.hastingsPremium
                                                        && customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment
                                                        && customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.rateOfInterest
                                                    ? customizeSubmissionVM.value.quote.hastingsPremium.monthlyPayment.rateOfInterest
                                                    : '25')}
                                            </Col>
                                        </Row>
                                        <hr className="mx-0 direct-debit__credit-agreement-hr" />
                                        <Row className="direct-debit__line pb-0">
                                            <Col>{messages.initialPayment}</Col>
                                            <Col xs="auto" className="text-right pl-0">
                                                <b>
                                                    &pound;
                                                    {firstMonthInstalment}
                                                </b>
                                            </Col>
                                        </Row>
                                        <Row className="direct-debit__line pb-0">
                                            <Col>{messages.elevenMonthPayment}</Col>
                                            <Col xs="auto" className="text-right pl-0">
                                                <b>
                                                    &pound;
                                                    {elevenMonthInstalment}
                                                </b>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col>
                                        <HDInfoCardRefactor
                                            className="direct-debit__payment-text"
                                            image={tipCirclePurple}
                                            paragraphs={[
                                                <>
                                                    {messages.paymentTextStartPt1}
                                                    <span className="font-medium">{messages.paymentAmount(firstMonthInstalment)}</span>
                                                    {messages.paymentTextStartPt2}
                                                </>
                                            ]}
                                            theme="light"
                                            size="thin" />
                                    </Col>
                                </Row>
                                <HDImportantInfo />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={7} className="direct-debit__info-card-agree">
                        <HDQuoteInfoRefactor className="my-4">
                            <span>{messages.agreeterms}</span>
                        </HDQuoteInfoRefactor>
                    </Col>
                </Row>


                <Container fluid>
                    <Row className="background-mono customize-quote-wizard__continue dd_continue">
                        <Col {...continueBtnColProps}>
                            <Row>
                                <Col {...continueBtnColPropsBtn} className="p-0">
                                    <HDButton
                                        webAnalyticsEvent={{ event_action: `Continue - Redirecting from: ${pageMetadata.page_name}` }}
                                        className="customize-quote-wizard__continue-button theme-white"
                                        size="lg"
                                        disabled={!enableContinue}
                                        label={messages.agreeAndContinueLabel}
                                        onClick={handleContinueTriggerButton} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                {HDLoader}
            </Col>
        </div>
    );
};
const mapStateToProps = (state) => ({
    submissionVM: state.wizardState.data.submissionVM,
    customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
    updateDDIVM: state.wizardState.data.updateDDIVM,
    offeredQuoteObject: state.offeredQuoteModel,
    customQuoteData: state.customQuoteModel
});

const mapDispatchToProps = (dispatch) => ({
    setUpdateDDIVM,
    dispatch
});

HDDirectDebitPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object, value: PropTypes.object }).isRequired,
    offeredQuoteObject: PropTypes.shape({ offeredQuotes: PropTypes.array }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    customQuoteData: PropTypes.shape({ loading: PropTypes.bool, customUpdatedQuoteObj: PropTypes.object }),
    dispatch: PropTypes.shape({}),
    toggleContinueElement: PropTypes.func,
    updateDDIVM: PropTypes.shape({ value: PropTypes.object }),
    onGoBack: PropTypes.func,
    triggerNextRoute: PropTypes.func,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

HDDirectDebitPage.defaultProps = {
    customizeSubmissionVM: null,
    updateDDIVM: null,
    dispatch: null,
    customQuoteData: null,
    toggleContinueElement: () => {},
    onGoBack: () => {},
    triggerNextRoute: () => {}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDDirectDebitPage));
