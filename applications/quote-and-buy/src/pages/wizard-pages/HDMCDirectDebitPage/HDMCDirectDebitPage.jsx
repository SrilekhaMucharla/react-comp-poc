import {
    HDForm,
    HDInfoCardRefactor,
    HDLabelRefactor,
    HDPaymentBreakdown,
    HDQuoteInfoRefactor,
    yup,
} from 'hastings-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Row, Col, Container
} from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import { HastingsValidationService } from 'hastings-capability-validation';
import {
    AnalyticsHDButton as HDButtonRefactor,
} from '../../../web-analytics';
import * as messages from './HDMCDirectDebitPage.messages';
import { getMCMonthlyPaymentBreakDownData } from '../HDMCThanksPage/MCPaymentBreakdownData';
import HDDirectDebitOverlay from '../HDDirectDebitPage/HDDirectDebitPageSECIOverlay';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import exclamation from '../../../assets/images/icons/exclamation-icon.svg';
import HDImportantInfo from '../HDDirectDebitPage/HDImportantInfo';
import HDMCCreditAgreementsBreakdown from './components/HDMCCreditAgreementsBreakdown';
import VehicleDetailsWithSCCI from './components/HDMCVehicleDetailsWithSCCI';
import { getPriceWithCurrencySymbol } from '../../../common/utils';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import {
    getCarBreakdownInstallments, getMulticarDDI, getQuotedVehicleDetails,
} from './_helpers_';
import {
    mcGetPaymentSchedule as mcGetPaymentScheduleAction,
    setNavigation as setNavigationAction
} from '../../../redux-thunk/actions';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import { getDateFromParts } from '../../../common/dateHelpers';
import { mcSubmissionPropTypes, paymentSchedulePropTypes, pageMetadataPropTypes } from '../../../constant/propTypes';
import HDMCPayerDetails from './components/HDMCPayerDetails';
import HDMCBankDetails from './components/HDMCBankDetails';
import HDMCPreferredPaymentDay from './components/HDMCPreferredPaymentDay';
import { trackAPICallFail, trackAPICallSuccess } from '../../../web-analytics/trackAPICall';
import { HastingsPaymentService } from '../../../../../../common/capabilities/hastings-capability-payment';
import { getMonthlyInitialPaymentAmount } from '../../../common/submissionMappers/helpers';
import EventEmmiter from '../../../EventHandler/event';

const HDMCDirectDebitPage = ({
    mcsubmissionVM,
    mcPaymentSchedule,
    paymentDay,
    setNavigation,
    mcGetPaymentSchedule,
    parentContinue,
    pageMetadata,
    onGoBack,
    multiCustomizeSubmissionVM,
    mcPaymentScheduleModel
}) => {
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [invalidEntry] = useState(false);
    const [carInfoList, setCarInfoList] = useState(undefined);
    const [paymentBreakdownData, setPaymentBreakdownData] = useState(undefined);
    const [error, setError] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [validatorError, setValidatorError] = useState(false);
    const [serviceDown, setServiceDown] = useState(false);
    const [bankAccDetails, setBankAccDetails] = useState({});

    const callFetchPaymentSchedule = (policyStartDate) => {
        const param = {
            preferredPaymentDay: policyStartDate,
            mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
            mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
            sessionUUID: mcsubmissionVM.value.sessionUUID
        };
        mcGetPaymentSchedule(param);
    };

    const ErrorMessage = 'ForceClearAPIErrorMessage';
    const viewModelService = useContext(ViewModelServiceContext);

    const getUpdateMultiproductDDIVM = () => {
        const { accountNumber, sortCode } = bankAccDetails;
        const multicarDDI = getMulticarDDI(mcsubmissionVM.value, paymentDay.value, sortCode, accountNumber);
        const viewModel = viewModelService.create(multicarDDI, 'pc', 'com.hastings.edgev10.capabilities.payments.dto.request.MultiproductDDIRequestDTO');
        return viewModel;
    };

    const callUpdateMultiproductDDI = (dto) => {
        showLoader();
        HastingsPaymentService.updateMultiproductDDI(dto.value)
            .then(() => {
                setError({});
                parentContinue();
            })
            .catch((err) => setError((errorState) => ({ ...errorState, promiseError: err })))
            .finally(() => {
                hideLoader();
            });
    };

    const isContinueDisabled = () => {
        if (!paymentDay || Object.keys(error).length > 0 || validatorError || Object.keys(formErrors).length > 0) {
            return true;
        }
        return false;
    };

    const validateBankDetails = (bankAccDetailsObject) => {
        showLoader();
        setValidatorError(false);
        const { accountNumber } = bankAccDetailsObject;
        if (!accountNumber) {
            hideLoader();
            return null;
        }
        const { sessionUUID, mpwrapperNumber } = mcsubmissionVM.value;
        const requestObj = {
            accountNumber: accountNumber,
            sortCode: Array.isArray(bankAccDetailsObject.sortCodes) && bankAccDetailsObject.sortCodes.map((sc) => sc.sortCodeValue).join(''),
            SessionUUID: sessionUUID,
            quoteID: mpwrapperNumber,
        };
        return HastingsValidationService.validateBankAccount(requestObj).then(({ result }) => {
            if (result.isValid) {
                setBankAccDetails(requestObj);
                setValidatorError(false);
            } else {
                setValidatorError(true);
            }
            setServiceDown(false);
            trackAPICallSuccess(messages.validateBankAccount);
        }).catch(() => {
            setServiceDown(true);
            trackAPICallFail(messages.validateBankAccount, messages.invalidBankAccount);
        }).finally(() => {
            hideLoader();
        });
    };

    const handleContinueClicked = () => {
        const updateMulticarDDIVM = getUpdateMultiproductDDIVM();
        callUpdateMultiproductDDI(updateMulticarDDIVM);
    };

    const getInstalmentsData = (quoteID) => {
        let instalmentsData = {};
        for (let i = 0; i < mcPaymentScheduleModel.mcPaymentScheduleObject.length; i += 1) {
            if (quoteID === mcPaymentScheduleModel.mcPaymentScheduleObject[i].submissionID) {
                instalmentsData = {
                    numberOfInstalments: mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule.length,
                    firstInstalment: mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule[0].paymentAmount.amount,
                    subsequentInstalment: _.get(mcPaymentScheduleModel.mcPaymentScheduleObject[i], 'paymentSchedule[1].paymentAmount.amount', ''),
                    currencyCode: mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule[0].paymentAmount.currency
                };
                break;
            }
        }
        return instalmentsData;
    };

    const getCreditAgreementData = (quoteID) => {
        if (!_.get(multiCustomizeSubmissionVM, 'value.customQuotes[0].quote.hastingsPremium.monthlyPayment', false)) { return null; }
        let creditAgreementData;
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObj) => {
            if (quoteID === customQuoteObj.quoteID) {
                const monthlyPaymentObj = _.cloneDeep(customQuoteObj.quote.hastingsPremium.monthlyPayment);
                const instalmentsData = getInstalmentsData(customQuoteObj.quoteID);
                creditAgreementData = {
                    amountPayable: monthlyPaymentObj.premiumAnnualCost.amount,
                    totalPrice: monthlyPaymentObj.totalAmountCredit,
                    interestRate: monthlyPaymentObj.rateOfInterest,
                    aprRate: monthlyPaymentObj.representativeAPR,
                    instalmentsCount: instalmentsData.numberOfInstalments,
                    initialPayment: instalmentsData.firstInstalment,
                    subsequentPayment: instalmentsData.subsequentInstalment,
                    currencyCode: instalmentsData.currencyCode
                };
            }
            return null;
        });
        return creditAgreementData;
    };

    const handleDataEvent = () => {
        const vehicleDetails = getQuotedVehicleDetails(mcsubmissionVM.value.quotes, mcPaymentSchedule);
        const coverableInstalments = getCarBreakdownInstallments(mcPaymentSchedule);
        let indexIndicator = 0;

        const vehicleData = vehicleDetails.map((v) => {
            let followedByNoOfMonths = 1;
            let amount = 0;
            let currency = null;
            const scheduleKeys = Object.keys(coverableInstalments).sort((a, b) => a - b);

            // eslint-disable-next-line no-plusplus
            for (let i = indexIndicator; i < scheduleKeys.length; i++) {
                const key = scheduleKeys[i];
                const value = coverableInstalments[key];

                const nextKey = scheduleKeys[i + 1];
                const nextValue = coverableInstalments[nextKey];
                if (!nextValue) {
                    amount = value.reduce((sum, item) => sum + item.amount, 0);
                    // eslint-disable-next-line prefer-destructuring
                    currency = value[0].currency;
                    break;
                }
                if (value.length >= nextValue.length) {
                    followedByNoOfMonths += 1;
                } else {
                    indexIndicator = i + 1;
                    amount = value.reduce((sum, item) => sum + item.amount, 0);
                    // eslint-disable-next-line prefer-destructuring
                    currency = value[0].currency;
                    break;
                }
            }
            const creditAgreementData = getCreditAgreementData(v.quoteID);
            return {
                ...v,
                futurePayments: {
                    amount,
                    currency,
                    followedBy: followedByNoOfMonths,
                    creditAgreementData: creditAgreementData
                }
            };
        });

        setCarInfoList(vehicleData);
    };

    useEffect(() => {
        const { mcPaymentScheduleObject } = mcPaymentSchedule;
        if (!mcPaymentScheduleObject) {
            const parentPolicy = mcsubmissionVM.value.quotes.find((quote) => quote.isParentPolicy);
            const policyStartDate = getDateFromParts(parentPolicy.baseData.periodStartDate);
            callFetchPaymentSchedule(dayjs(policyStartDate).add(14, 'days').get('date'));
        }
    }, []);

    useEffect(() => {
        if (mcPaymentSchedule.loading) {
            showLoader();
            return;
        }

        hideLoader();
    }, [mcPaymentSchedule.loading]);

    useEffect(() => {
        const { mcPaymentScheduleObject, mcPaymentScheduleError } = mcPaymentSchedule;

        if ((mcPaymentScheduleObject && mcPaymentScheduleObject.length > 0) || mcPaymentScheduleError) {
            setPaymentBreakdownData(getMCMonthlyPaymentBreakDownData(mcsubmissionVM.value.quotes, multiCustomizeSubmissionVM.value.customQuotes,
                mcPaymentScheduleObject, false));
        }
    }, [mcPaymentSchedule]);

    useEffect(() => {
        if (mcsubmissionVM && mcPaymentSchedule.mcPaymentScheduleObject) {
            handleDataEvent();
        }
    }, [mcPaymentSchedule]);

    const validationSchema = yup.object({
        sortCodes: yup.array().of(yup.object().shape({
            sortCodeIndex: yup.number().min(0).max(3).required(),
            sortCodeValue: yup.string().matches(/^[0-9]+$/, 'Must be only digits').min(2).max(2)
                .required('Sort code input invalid'),
        })).max(3).required('Sort codes are mandatory'),
        accountNumber: yup.string().length(8).required('Account number is mandatory'),
    });

    const continueBtnColPropsBtn = {
        xs: { span: 12, offset: 0 },
        md: { span: 5, offset: 0 },
        lg: { span: 3, offset: 0 },
    };


    const errorChange = () => { };
    let eventData;
    const getEventData = (event) => {
        eventData = event;
        if (eventData === ErrorMessage) {
            setServiceDown(false);
            setValidatorError(false);
        }
        EventEmmiter.unsubscribe('change', (e) => {
            errorChange(e);
        });
    };

    useEffect(() => {
        EventEmmiter.subscribe('change', (event) => { getEventData(event); });
    }, [eventData]);

    return (
        <>
            {paymentBreakdownData
                && (
                    <Container className={`mc-direct-debit${invalidEntry ? ' invalid' : ''}`}>
                        <div className="arc-header" />
                        <Row>
                            <Col>
                                <BackNavigation
                                    id="backNavMainWizard"
                                    className="mb-0"
                                    onClick={onGoBack}
                                    onKeyPress={onGoBack} />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <HDLabelRefactor id="direct-debit-title" className="direct-debit__title" Tag="h1" text={messages.pageHeader} />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col className="pt-3 px-3 ml-lg-4 order-lg-last mc-direct-debit__body-right-col pb-5 pb-lg-0">
                                <HDPaymentBreakdown title={messages.paymentBreakTitle} steps={paymentBreakdownData} />
                            </Col>
                            <Col lg={7} xs={12} className="theme-white mc-direct-debit__body-left-col">
                                <Row className="mc-account-holder-details-row">
                                    <Col xs={12} className="p-4 mr-3 pt-0 theme-white">
                                        <Row>
                                            <HDMCPayerDetails pageMetadata={pageMetadata} mcsubmissionVM={mcsubmissionVM} />
                                        </Row>
                                    </Col>
                                </Row>
                                <HDForm
                                    validationSchema={validationSchema}
                                    resetFormOnStart
                                    className="account-holder-details mt-4"
                                >
                                    {(hdProps) => {
                                        setFormErrors(hdProps.errors);
                                        return (
                                            <>
                                                <hr className="mx-0" />
                                                <Row>
                                                    <Col>
                                                        <HDMCBankDetails
                                                            validateBankAccDetails={validateBankDetails}
                                                            serviceDown={serviceDown}
                                                            validatorError={validatorError}
                                                            formikProps={hdProps} />
                                                    </Col>
                                                </Row>
                                                <hr className="mx-0" />
                                                <Row>
                                                    <Col xs={12} lg={9} className="pr-lg-5">
                                                        <HDMCPreferredPaymentDay
                                                            error={error}
                                                            setParentError={setError}
                                                            setParentNavigation={setNavigation}
                                                            callFetchPaymentSchedule={callFetchPaymentSchedule}
                                                            mcSubmissionVM={mcsubmissionVM}
                                                            paymentDay={paymentDay}
                                                            paymentScheduleModel={mcPaymentSchedule}
                                                            pageMetadata={pageMetadata} />
                                                    </Col>
                                                </Row>
                                            </>
                                        );
                                    }}
                                </HDForm>
                                {carInfoList && (
                                    <HDInfoCardRefactor
                                        theme="mint"
                                        className="direct-debit__debit-overlay-container-box mb-4 mt-5"
                                        image={exclamation}
                                        paragraphs={[
                                            messages.mintBoxMCfirstParagaph(carInfoList.length),
                                            messages.mintBoxMCsecondparagraph,
                                            messages.mintBoxMCThirdParagraph, (
                                                <div className="direct-debit_vehicles_class_list">
                                                    {
                                                        carInfoList.map((car) => {
                                                            const { vehicleDetails, initialPayment, futurePayments } = car;
                                                            const { followedBy, amount, creditAgreementData } = futurePayments;
                                                            return (
                                                                <VehicleDetailsWithSCCI
                                                                    key={vehicleDetails.vrn}
                                                                    vrn={vehicleDetails.vrn}
                                                                    displayName={vehicleDetails.displayName}
                                                                    pageMetadata={pageMetadata}
                                                                    paymentInfo={{
                                                                        initialPayment: initialPayment.amount,
                                                                        followedBy,
                                                                        amount,
                                                                        creditAgreementData: creditAgreementData
                                                                    }} />
                                                            );
                                                        })
                                                    }
                                                </div>)
                                        ]} />
                                )}
                                {carInfoList && mcsubmissionVM && (
                                    <HDMCCreditAgreementsBreakdown
                                        premiumInfo={{
                                            rateOfInterest:
                                                mcsubmissionVM.value.quotes[0].quoteData.offeredQuotes[0].hastingsPremium.monthlyPayment.rateOfInterest,
                                            representativeAPR:
                                                mcsubmissionVM.value.quotes[0].quoteData.offeredQuotes[0].hastingsPremium.monthlyPayment.representativeAPR,
                                        }}
                                        vehicles={carInfoList} />
                                )}
                                {carInfoList && (
                                    <HDInfoCardRefactor
                                        image={tipCirclePurple}
                                        className="info-card mb-4 mt-4"
                                        theme="light"
                                        size="thin"
                                    >
                                        <Row className="pink_box_paragraphs">
                                            <Col className="pink_info_content">
                                                <p>
                                                    {messages.initPaymentMC}
                                                    {' '}
                                                    <span className="font-bold">
                                                        {`${getPriceWithCurrencySymbol({
                                                            amount: getMonthlyInitialPaymentAmount(mcsubmissionVM, mcPaymentSchedule || mcPaymentScheduleModel),
                                                            currency: carInfoList[0].initialPayment.currency || 'gbp'
                                                        })} `}
                                                    </span>
                                                    {messages.initPaymentMCSecondPart}
                                                </p>
                                            </Col>
                                        </Row>
                                    </HDInfoCardRefactor>
                                )}
                                <HDInfoCardRefactor className="debit-overlay-container-box mb-4" image={exclamation}>
                                    <div className="mb-2">
                                        {messages.scciHeader}
                                        {' '}
                                        <HDDirectDebitOverlay
                                            trigger={(
                                                <span className="link">
                                                    {messages.scciText}
                                                    {' '}
                                                    {messages.scci}
                                                </span>
                                            )}
                                            dataList={{
                                                firstPayment: '{firstMonthInstalment placeholder}',
                                                elevenMonths: '{elevenMonthInstalment placeholder}'
                                            }} />
                                        {' '}
                                        {messages.scciMidNote}
                                        {' '}
                                    </div>
                                    <p>
                                        {messages.scciFootNote}
                                    </p>
                                </HDInfoCardRefactor>
                                <HDImportantInfo />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} lg={7} className="px-md-0">
                                <HDQuoteInfoRefactor className="my-4">
                                    <span>{messages.agreeTerms}</span>
                                </HDQuoteInfoRefactor>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...continueBtnColPropsBtn} className="p-0">
                                <HDButtonRefactor
                                    webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                                    disabled={isContinueDisabled()}
                                    className="customize-quote-wizard__continue-button theme-white"
                                    size="lg"
                                    label={messages.continueLabel}
                                    onClick={handleContinueClicked} />
                            </Col>
                        </Row>
                    </Container>
                )}
            {HDFullscreenLoader}
        </>
    );
};

const mapStateToProps = (state) => ({
    mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
    mcPaymentSchedule: state.mcPaymentScheduleModel,
    paymentDay: state.wizardState.app.paymentDay,
    updateDDIVM: state.wizardState.data.updateDDIVM,
    multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
    mcPaymentScheduleModel: state.mcPaymentScheduleModel,
});

const mapDispatchToProps = {
    mcGetPaymentSchedule: mcGetPaymentScheduleAction,
    setNavigation: setNavigationAction
};

HDMCDirectDebitPage.propTypes = {
    parentContinue: PropTypes.func.isRequired,
    mcsubmissionVM: PropTypes.shape(mcSubmissionPropTypes).isRequired,
    mcPaymentSchedule: PropTypes.shape(paymentSchedulePropTypes).isRequired,
    paymentDay: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    setNavigation: PropTypes.func.isRequired,
    mcGetPaymentSchedule: PropTypes.func.isRequired,
    updateDDIVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    onGoBack: PropTypes.func,
    multiCustomizeSubmissionVM: PropTypes.shape({
        value: PropTypes.object,
    }).isRequired,
    mcPaymentScheduleModel: PropTypes.shape(paymentSchedulePropTypes),
};

HDMCDirectDebitPage.defaultProps = {
    paymentDay: null,
    onGoBack: () => { },
    mcPaymentScheduleModel: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCDirectDebitPage);
