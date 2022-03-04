import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dayjs from 'dayjs';
import {
    Container, Row, Col
} from 'react-bootstrap';
import { HDPriceTable, HDQuoteInfoRefactor, HDLabelRefactor } from 'hastings-components';
import HDOurFees from '../HDImportantStuffPage/HDOurFees';
import HDHeader from './components/HDHeader';
import HDCoverSummary from './components/HDCoverSummary';
import HDAdditionalInformation from './components/HDAdditionalInformation';
import HDDriverDetails from './components/HDDriverDetails';
import HDVehicleDetails from './components/HDMCVehicleDetails/HDVehicleDetails';
import {
    getPriceWithCurrencySymbol,
    returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM,
    subtractFloats,
    sumFloats
} from '../../../common/utils';
import mapResponseToProps from './mapper';
import { getDateFromParts } from '../../../common/dateHelpers';
import {
    accidentalDamageCompulsoryKey,
    accidentalDamageVoluntaryKey,
    COVERAGE_ACCIDENTAL_DAMAGE_KEY,
    COVERAGE_FIRE_THEFT_KEY,
    COVERAGE_WINDSCREEN_DAMAGE_KEY,
    fireAndTheftCompulsory,
    fireAndTheftVoluntary,
    windScreenExcessRepairKey,
    windScreenExcessReplacementKey,
    PAYMENT_TYPE_ANNUALLY_CODE,
    PAYMENT_TYPE_MONTHLY_CODE
} from '../../../constant/const';
import {
    mcGetPaymentSchedule as mcGetPaymentScheduleAction,
} from '../../../redux-thunk/actions';
import * as messages from './HDMCImportantStuffPage.messages';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import arcTop from '../../../assets/images/background/top-arc.svg';
import formatRegNumber from '../../../common/formatRegNumber';
import { pageMetadataPropTypes, paymentSchedulePropTypes } from '../../../constant/propTypes';
import { getVehicleBreakdownPayments } from '../HDMCDirectDebitPage/_helpers_';
import useFullscreenLoader from '../../Controls/Loader/useFullscreenLoader';
import {
    AnalyticsHDModal as HDModal,
} from '../../../web-analytics';

const getDriverRole = (driver, isAccountHolder) => {
    if (isAccountHolder) {
        return 'Account holder';
    }

    if (driver.isPolicyHolder) {
        return 'Policyholder';
    }

    return '';
};

const getDriverDetailsProps = (drivers, accountHolderId) => {
    const mappedDrivers = drivers.allIds.map((driverId) => {
        const driver = drivers.byId[driverId];
        const { claimsDetailsCollection, convictionsCollection, } = driver.claimsAndConvictions;

        return {
            personId: driver.person.publicID,
            name: driver.displayName,
            role: getDriverRole(driver, driver.person.publicID === accountHolderId),
            dateOfBirth: getDateFromParts(driver.dateOfBirth),
            licenceTypeKey: driver.licenceType,
            licenceHeldForKey: driver.licenceHeldFor,
            occupationKey: driver.occupationFull,
            claimsCountInFiveYears: claimsDetailsCollection.length,
            convictionsCountInFiveYears: convictionsCollection.length
        };
    });

    const sorted = _.sortBy(mappedDrivers, (item) => {
        if (item.role) {
            return item.role;
        }

        return undefined;
    });

    return _.uniqBy(sorted, 'personId');
};

const getMonthlyPayments = (monthlyPayment, general, paymentsCount) => {
    const paymentCreditCharge = {
        amount: subtractFloats(monthlyPayment.premiumAnnualCost.amount, monthlyPayment.totalAmountCredit),
        currency: monthlyPayment.premiumAnnualCost.currency
    };

    return {
        totalPayments: {
            paymentTotalCredit: sumFloats(general.paymentTotalCredit || 0, monthlyPayment.premiumAnnualCost.amount),
            paymentTotalCreditCharge: sumFloats(general.paymentTotalCreditCharge || 0, paymentCreditCharge.amount),
            instalmentsTotal: {
                count: paymentsCount,
                value: sumFloats((general.instalmentsTotal && general.instalmentsTotal.value) || 0, monthlyPayment.elevenMonthsInstalments.amount),
                paymentInitial: sumFloats((general.instalmentsTotal && general.instalmentsTotal.paymentInitial) || 0, monthlyPayment.firstInstalment.amount),
            },
            rateOfInterest: `${monthlyPayment.rateOfInterest}%`,
            representativeApr: `${monthlyPayment.representativeAPR}%`,
        },
        quotePayments: {
            paymentCredit: getPriceWithCurrencySymbol(monthlyPayment.premiumAnnualCost),
            paymentCreditCharge: getPriceWithCurrencySymbol(paymentCreditCharge),
            instalments: {
                count: paymentsCount,
                value: getPriceWithCurrencySymbol(monthlyPayment.elevenMonthsInstalments),
                paymentInitial: getPriceWithCurrencySymbol(monthlyPayment.firstInstalment)
            }
        }
    };
};

const getincludedText = (quoteID, ancillary, mcQuotes) => {
    if (ancillary.name === messages.Breakdown) {
        let roadsideAmount = 0;
        let chosenterm = '';
        // eslint-disable-next-line array-callback-return
        mcQuotes.customQuotes.map((quoteObj) => {
            if (quoteObj.quoteID === quoteID) {
                quoteObj.coverages.privateCar.ancillaryCoverages[0].coverages.map((cov) => {
                    if (cov.publicID === messages.BreakdownKey) {
                        // eslint-disable-next-line array-callback-return
                        cov.terms.map((termsObj) => {
                            roadsideAmount = termsObj.options && termsObj.options.filter((option) => option.name === messages.roadside);
                            chosenterm = termsObj.chosenTermValue ? termsObj.chosenTermValue : '';
                        });
                    }
                });
            }
        });
        const diffAmount = (ancillary.amount.amount - _.get(roadsideAmount[0], 'amount.amount', 0));
        if (diffAmount && diffAmount > 0 && chosenterm !== messages.roadside) {
            return `£${diffAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return messages.Included;
    }
    return messages.Included;
};

const filterCustomeQuoteByID = (quoteId, mcQuotes) => {
    const mcQuotesCustomQuotes = _.get(mcQuotes, 'customQuotes', []);
    return mcQuotesCustomQuotes.filter((ele) => {
        return ele.quoteID === quoteId;
    });
};

const getPriceTableProps = (vehicles, quotes, mcQuotes) => {
    const priceTableProps = quotes.allIds.reduce((accumulator, quoteId) => {
        const quote = quotes.byId[quoteId];
        const updatedFilterCustomeQuote = filterCustomeQuoteByID(quoteId, mcQuotes);
        const startDate = dayjs(getDateFromParts(updatedFilterCustomeQuote[0].periodStartDate));
        const endDate = dayjs(getDateFromParts(updatedFilterCustomeQuote[0].periodEndDate));
        const quotedVehicle = vehicles.byId[quote.vehicles[0]];
        const { annuallyPayment, monthlyPayment } = updatedFilterCustomeQuote[0].quote.hastingsPremium;
        const paymentBase = annuallyPayment.premiumAnnualCost;

        let monthlyPayments = {
            totalPayments: undefined,
            quotePayments: undefined
        };

        if (monthlyPayment) {
            const paymentsCount = endDate.diff(startDate, 'month');
            monthlyPayments = getMonthlyPayments(monthlyPayment, accumulator.general, paymentsCount);
        }

        return {
            general: {
                paymentTotalBase: sumFloats(accumulator.general.paymentTotalBase || 0, paymentBase.amount),
                ...monthlyPayments.totalPayments,
            },
            quotes: [...accumulator.quotes, {
                id: quoteId,
                isDeferred: quote.isDeferred,
                name: `${quotedVehicle.make} ${quotedVehicle.model}`,
                label: formatRegNumber(quotedVehicle.registrationsNumber),
                paymentBase: getPriceWithCurrencySymbol(paymentBase),
                ...monthlyPayments.quotePayments,
                basePolicyPayment: {
                    ...paymentBase
                },
                startDate: startDate.format('DD/MM/YYYY'),
                daysInsured: endDate.diff(startDate, 'days') + 1,
                ancillaries: vehicles.byId[quote.vehicles[0]].ancillaries
                    .filter((ancillary) => { return ancillary.selected; })
                    .map((selected) => {
                        return {
                            name: selected.name,
                            // eslint-disable-next-line max-len
                            value: selected.required && quote.branchCode === messages.HP ? getincludedText(quoteId, selected, mcQuotes) : getPriceWithCurrencySymbol(selected.amount)
                        };
                    })
            }]
        };
    }, {
        general: {},
        quotes: []
    });

    return priceTableProps;
};

const getExcessValues = (terms, compulsoryKey, voluntaryKey, excessName) => ({
    compulsoryAmount: terms.find((term) => term.publicID === compulsoryKey).directValue,
    voluntaryAmount: terms.find((term) => term.publicID === voluntaryKey).directValue,
    excessName: excessName
});

export const getExcessTableProps = (excesses) => {
    return excesses.reduce((accumulator, excess) => {
        const { publicID: excessPublicId, terms } = excess;

        if (excessPublicId === COVERAGE_ACCIDENTAL_DAMAGE_KEY) {
            return {
                ...accumulator,
                accidentalDamage: getExcessValues(terms, accidentalDamageCompulsoryKey, accidentalDamageVoluntaryKey, 'Accidental damage')
            };
        }

        if (excessPublicId === COVERAGE_FIRE_THEFT_KEY) {
            return {
                ...accumulator,
                theftDamage: getExcessValues(terms, fireAndTheftCompulsory, fireAndTheftVoluntary, 'Fire and theft')
            };
        }

        if (excessPublicId === COVERAGE_WINDSCREEN_DAMAGE_KEY) {
            return {
                ...accumulator,
                windscreenDamage: getExcessValues(terms, windScreenExcessRepairKey, windScreenExcessReplacementKey, 'Windscreen/glass')
            };
        }

        return accumulator;
    }, {
        accidentalDamage: {
            compulsoryAmount: 0,
            voluntaryamount: 0
        },
        theftDamage: {
            compulsoryAmount: 0,
            voluntaryamount: 0
        },
        windscreenDamage: {
            compulsoryAmount: 0,
            voluntaryamount: 0
        }
    });
};

const getVehicleDetailsProps = (vehicles, quotes, drivers, mcQuotes) => quotes.allIds.map((quoteId) => {
    const quote = quotes.byId[quoteId];
    const quoteVehicle = vehicles.byId[quote.vehicles[0]];
    const quoteDrivers = quote.drivers.map((driverFixedId) => drivers.byId[driverFixedId]);
    const updatedFilterCustomeQuote = filterCustomeQuoteByID(quoteId, mcQuotes);

    return {
        policyStartDate: getDateFromParts(updatedFilterCustomeQuote[0].periodStartDate),
        periodStartDate: updatedFilterCustomeQuote[0].periodStartDate,
        policyEndDate: getDateFromParts(updatedFilterCustomeQuote[0].periodEndDate),
        vehicleLicense: formatRegNumber(quoteVehicle.registrationsNumber),
        vehicleName: `${quoteVehicle.make} ${quoteVehicle.model.split(' ').slice(0, 2).join(' ')}`,
        policyholder: quoteDrivers.find((driver) => driver.isPolicyHolder).displayName,
        noClaimsDiscountYears: quoteVehicle.ncdProtection.ncdgrantedYears,
        namedDrivers: quoteDrivers.filter((driver) => !driver.isPolicyHolder),
        policyAddress: quote.policyAddress,
        brandCode: quote.branchCode,
        coverTypeKey: quoteVehicle.coverType,
        insurerKey: quote.insurer,
        ancillaries: quoteVehicle.ancillaries,
        quoteID: quoteId,
        endorsements: quoteVehicle.endorsements,
        ...getExcessTableProps(quoteVehicle.excesses)
    };
});

// eslint-disable-next-line
// TODO:
// 1) Deduplicate state data
// 2) Replace VMs in wizard state with input collected from user; take available values (e.g. for dropdowns) from DTOs
// 3) const driversFromWizardState = useSelector((state) => state.wizardState.app.pages.drivers);
// 4) cannot uniquely identify above drivers to figure out which had his Licence scanned to implement AC8 of US297044

const HDMCImportantStuffPage = ({
    onGoBack,
    toggleContinueElement,
    mcsubmissionVM,
    multiCustomizeSubmissionVM,
    pageMetadata,
    setTotalPrice,
    mcPaymentScheduleModel,
    mcGetPaymentSchedule,
}) => {
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();
    const [isLoading, setIsLoading] = useState(true);
    const [vehiclePaymentsBreakdown, setVehiclePaymentBreakdown] = useState(null);
    const [whyMonthlyPaymentAvailablityModalShow, SetWhyMonthlyPaymentAvailablityModalShow] = useState(false);
    const mcQuotes = {
        ...mcsubmissionVM.value,
        ...multiCustomizeSubmissionVM.value,
    };
    const isAvailableForMonthly = PAYMENT_TYPE_ANNUALLY_CODE !== _.get(multiCustomizeSubmissionVM, 'value.insurancePaymentType', PAYMENT_TYPE_ANNUALLY_CODE);
    const [mappedProps, setMappedProps] = useState(undefined);
    const [monthlySelected, setMonthlySelected] = useState(true);

    const callFetchPaymentSchedule = (policyStartDate) => {
        showLoader();
        const param = {
            preferredPaymentDay: policyStartDate,
            mpwrapperNumber: mcsubmissionVM.value.mpwrapperNumber,
            mpwrapperJobNumber: mcsubmissionVM.value.mpwrapperJobNumber,
            sessionUUID: mcsubmissionVM.value.sessionUUID
        };
        mcGetPaymentSchedule(param);
    };

    const setPaymentType = (isMonthly) => {
        let data;
        let totalpaymentAmt = 0;
        let paymentType;
        if (isMonthly) {
            paymentType = PAYMENT_TYPE_MONTHLY_CODE;
            multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
                totalpaymentAmt += _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            });
            data = {
                price: totalpaymentAmt.toFixed(2),
                text: `Total price for ${mcsubmissionVM.value.quotes.length} cars\nPay monthly`,
                currency: '£'
            };
        } else {
            paymentType = PAYMENT_TYPE_ANNUALLY_CODE;
            multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
                totalpaymentAmt += customQuote.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
            });
            data = {
                price: totalpaymentAmt.toFixed(2),
                text: `Total price for ${mcsubmissionVM.value.quotes.length} cars\nPay in full`,
                currency: '£'
            };
        }
        multiCustomizeSubmissionVM.value.customQuotes.map((customQuote) => {
            _.set(customQuote, 'insurancePaymentType', paymentType);
            return null;
        });
        _.set(multiCustomizeSubmissionVM.value, 'insurancePaymentType', paymentType);
        setTotalPrice(data);
    };

    const monthlySelectedHandler = (selected) => {
        setMonthlySelected(selected);
        setPaymentType(selected);
    };

    const whyMonthlyPaymentAvailablityHandler = () => {
        SetWhyMonthlyPaymentAvailablityModalShow(!whyMonthlyPaymentAvailablityModalShow);
    };

    const checkDDUnavailability = () => {
        if (_.get(multiCustomizeSubmissionVM.value.customQuotes[0], 'quote.hastingsPremium.monthlyPayment')) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        const init = async () => {
            const { accountHolder, ...rest } = mcQuotes;
            const {
                drivers,
                quotes,
                vehicles,
                mcQuoteReference
            } = mapResponseToProps(rest);

            const driverDetailsProps = getDriverDetailsProps(drivers, accountHolder.publicID);
            const priceTableProps = getPriceTableProps(vehicles, quotes, mcQuotes);
            const vehicleDetailsProps = getVehicleDetailsProps(vehicles, quotes, drivers, mcQuotes);
            return {
                ...priceTableProps,
                mcQuoteReference: mcQuoteReference,
                drivers: driverDetailsProps,
                vehicles: vehicleDetailsProps,
            };
        };

        init().then((mapped) => {
            setMappedProps(mapped);
        });
        toggleContinueElement(true);
    }, []);

    useEffect(() => {
        if (checkDDUnavailability()) {
            hideLoader();
            setIsLoading(false);
            return;
        }
        const { mcPaymentScheduleObject } = mcPaymentScheduleModel;
        if (!mcPaymentScheduleObject) {
            const parentPolicy = mcsubmissionVM.value.quotes.find((quote) => quote.isParentPolicy);
            const policyStartDate = getDateFromParts(parentPolicy.baseData.periodStartDate);
            callFetchPaymentSchedule(dayjs(policyStartDate).add(14, 'days').get('date'));
        } else {
            hideLoader();
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (checkDDUnavailability()) {
            hideLoader();
            setIsLoading(false);
            return;
        }
        if (mcsubmissionVM && mcPaymentScheduleModel.mcPaymentScheduleObject) {
            const breakdownData = getVehicleBreakdownPayments(mcsubmissionVM, mcPaymentScheduleModel);
            setVehiclePaymentBreakdown(breakdownData);
            hideLoader();
            setIsLoading(false);
        }
    }, [mcPaymentScheduleModel]);

    const mainColProps = {
        xs: { span: 12, offset: 0 },
        md: { span: 8, offset: 2 },
        lg: { span: 10, offset: 1 }
    };

    const tabletPadding = 'tablet-padding-sm';

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
        // to check all the quotes are having monthlyPayment object
        if (returnMonthlyPaymentAvailableForMCCustomizeSubmissionVM(multiCustomizeSubmissionVM) === PAYMENT_TYPE_ANNUALLY_CODE) { return null; }
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

    return (
        <>
            {isLoading && HDFullscreenLoader}
            {!isLoading && (
                <>
                    <Container fluid>
                        <Row>
                            <Col xs={12} className="wizard-head mc-important-stuff__head arc-header">
                                <img className="arc-header_arc" alt="arc-header" src={arcTop} />
                                <Row>
                                    <Col {...mainColProps}>
                                        <Row>
                                            <Col xs={12}>
                                                <BackNavigation
                                                    id="backNavMainWizard"
                                                    className="mb-0"
                                                    onClick={onGoBack}
                                                    onKeyPress={onGoBack} />
                                            </Col>
                                        </Row>
                                        <Row className="margin-top-md mc-important-stuff__header">
                                            <Col xs={12}>
                                                <HDHeader multicarReference={mappedProps && mappedProps.mcQuoteReference} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row>
                            <Col className={tabletPadding} {...mainColProps}>
                                <Row as="section">
                                    <Col className={tabletPadding}>
                                        {(mappedProps && !isLoading) && (
                                            <HDPriceTable
                                                general={mappedProps.general}
                                                quotes={mappedProps.quotes}
                                                paymentsBreakdown={vehiclePaymentsBreakdown}
                                                paymentTypeSelectionHandler={monthlySelectedHandler}
                                                userSelectedOption={isAvailableForMonthly}
                                                mcsubmissionVM={mcsubmissionVM}
                                                multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                                                mcPaymentScheduleModel={mcPaymentScheduleModel}
                                                whyMonthlyPaymentAvailablityHandler={whyMonthlyPaymentAvailablityHandler} />
                                        )}
                                    </Col>
                                </Row>
                                <Row as="section">
                                    <Col className={tabletPadding}>
                                        <HDLabelRefactor Tag="h1" text={messages.coverSummaryMainHeading} className="mt-0 mb-2" />
                                        <p>{messages.coverSummaryMainParagraph}</p>
                                        <HDCoverSummary />
                                        {mappedProps && (
                                            <>
                                                <HDLabelRefactor
                                                    Tag="h2"
                                                    text={messages.driverDetailsMainHeading}
                                                    className="mc-important-stuff__driver-details-header mb-2 mb-md-3" />
                                                <p>{messages.driverDetailsMainParagraph}</p>
                                                <HDQuoteInfoRefactor>
                                                    <p className="mb-2">{messages.driverDetailsImportantInfo1}</p>
                                                    <p className="mb-0">{messages.driverDetailsImportantInfo2}</p>
                                                </HDQuoteInfoRefactor>
                                                {mappedProps.drivers.map((driver) => (
                                                    <Row>
                                                        <Col className="px-mobile-0">
                                                            <HDDriverDetails key={driver.publicID} driver={driver} />
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <HDLabelRefactor
                                                    Tag="h2"
                                                    text={messages.vehicleDetailsMainHeading}
                                                    className="mc-important-stuff__car-details-header mb-n1" />
                                                {mappedProps.vehicles.map((vehicle, idx) => {
                                                    return ((
                                                        <Row>
                                                            <Col className="px-mobile-0">
                                                                <HDVehicleDetails
                                                                    pageMetadata={pageMetadata}
                                                                    key={vehicle.publicID}
                                                                    vehicle={vehicle}
                                                                    quoteData={{
                                                                        ...mappedProps.quotes[idx],
                                                                        rateOfInterest: mappedProps.general.rateOfInterest,
                                                                        representativeApr: mappedProps.general.representativeApr,
                                                                    }}
                                                                    quoteReference={mappedProps.mcQuoteReference}
                                                                    creditAgreementData={getCreditAgreementData(vehicle.quoteID)}
                                                                    isCreditAgreementVisible={monthlySelected && isAvailableForMonthly} />
                                                            </Col>
                                                        </Row>
                                                    ));
                                                })}
                                            </>
                                        )}
                                        <HDAdditionalInformation
                                            pageMetadata={pageMetadata}
                                            isCreditAgreementVisible={monthlySelected && isAvailableForMonthly} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>

                    <HDModal
                        id="missing-monthly-payment-modal"
                        customStyle="customize-quote"
                        show={whyMonthlyPaymentAvailablityModalShow}
                        headerText={messages.missingMonthlyPaymentsModalHeader}
                        confirmLabel={messages.missingMonthlyPaymentsModalConfirmLabel}
                        onConfirm={() => SetWhyMonthlyPaymentAvailablityModalShow(false)}
                        hideCancelButton
                        hideClose
                    >
                        {messages.missingMonthlyPaymentsModalContent.map((paragraph, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <p key={i}>
                                {paragraph}
                            </p>
                        ))}
                    </HDModal>
                </>
            )}
        </>
    );
};

HDMCImportantStuffPage.propTypes = {
    onGoBack: PropTypes.func,
    toggleContinueElement: PropTypes.func,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }),
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired,
    setTotalPrice: PropTypes.func.isRequired,
    mcPaymentScheduleModel: PropTypes.shape(paymentSchedulePropTypes),
    mcGetPaymentSchedule: PropTypes.func.isRequired,
};

HDMCImportantStuffPage.defaultProps = {
    onGoBack: () => { },
    toggleContinueElement: () => { },
    multiCustomizeSubmissionVM: null,
    mcPaymentScheduleModel: null,
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM,
        multiCustomizeSubmissionVM: state.wizardState.data.multiCustomizeSubmissionVM,
        mcPaymentScheduleModel: state.mcPaymentScheduleModel,
    };
};

const mapDispatchToProps = {
    mcGetPaymentSchedule: mcGetPaymentScheduleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(HDMCImportantStuffPage);
