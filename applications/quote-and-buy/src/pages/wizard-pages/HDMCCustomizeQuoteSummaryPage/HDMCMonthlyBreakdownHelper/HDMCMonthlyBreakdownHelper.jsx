import React from 'react';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import twoWords from '../../__helpers__/twoWords';
import formatRegNumber from '../../../../common/formatRegNumber';
import * as messages from '../HDMCCustomizeQuoteSummaryPage.messages';

const HDMCMonthlyBreakdownHelper = ({
    mcsubmissionVM, multiCustomizeSubmissionVM, mcPaymentScheduleModel, pricetableQuotes
}) => {
    const displayAmount = (value) => `£${value}`;
    const numberToWord = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five'
    };
    const getDayMonthTwoDigit = (dayMonth) => {
        const dayMonthString = (`0${dayMonth}`).slice(-2);
        return dayMonthString;
    };
    const getStartDateString = (quote) => {
        return (`${getDayMonthTwoDigit(_.get(quote, 'periodStartDate.day'))}
            /${getDayMonthTwoDigit(1 + _.get(quote, 'periodStartDate.month'))}
            /${_.get(quote, 'periodStartDate.year')}`);
    };
    const getDaysInsured = (quote) => {
        const startDate = dayjs(`${_.get(quote, 'periodStartDate.year')}-${1 + _.get(quote, 'periodStartDate.month')}-${_.get(quote, 'periodStartDate.day')}`);
        const endDate = dayjs(`${_.get(quote, 'periodEndDate.year')}-${1 + _.get(quote, 'periodEndDate.month')}-${_.get(quote, 'periodEndDate.day')}`);
        return endDate.diff(startDate, 'day') + 1;
    };
    const getInitialPaymentData = (customQuoteObject) => {
        let intialPaymentObject = null;
        for (let i = 0; i < mcPaymentScheduleModel.mcPaymentScheduleObject.length; i += 1) {
            if (customQuoteObject.quoteID === mcPaymentScheduleModel.mcPaymentScheduleObject[i].submissionID) {
                // eslint-disable-next-line prefer-destructuring
                intialPaymentObject = mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule[0];
            }
        }
        return intialPaymentObject;
    };
    const getDateObject = (date) => {
        const dateString = `${1 + date.month}/${date.day}/${date.year}`;
        return new Date(dateString);
    };
    const sortByDateEpoch = (quotes) => {
        quotes.sort((a, b) => {
            return a.startDateEpoch - b.startDateEpoch;
        });
        return quotes;
    };
    const getInitialPaymentDate = (carObject) => {
        const pcStartDate = new Date(_.get(mcsubmissionVM.quotes.children[0], 'value.baseData.pccurrentDate'));
        pcStartDate.setHours(0, 0, 0, 0);
        const carInitialPaymentDate = new Date(
            `${1 + carObject.initialPaymentDate.month}/${carObject.initialPaymentDate.day}/${carObject.initialPaymentDate.year}`
        );
        if (pcStartDate.getTime() === carInitialPaymentDate.getTime()) {
            return `${messages.initialPaymentLabel} today`;
        }
        return `${messages.initialPaymentLabel}
            on ${getDayMonthTwoDigit(carObject.initialPaymentDate.day)}
            /${getDayMonthTwoDigit(1 + carObject.initialPaymentDate.month)}
            /${carObject.initialPaymentDate.year}`;
    };
    const getTotalInstalmentAmount = (instalments) => {
        let sum = 0;
        instalments.map((instalment) => {
            sum += instalment;
            return null;
        });
        return sum;
    };

    const getVehicleObject = (quoteID) => {
        let vehicleObject;
        mcsubmissionVM.value.quotes.map((quoteObject) => {
            if (quoteObject.quoteID === quoteID) {
                vehicleObject = _.cloneDeep(quoteObject.lobData.privateCar.coverables.vehicles[0]);
            }
            return null;
        });
        return vehicleObject;
    };
    // for adding blue line rows (combined payment rows) in payment breakdown
    const getCombinedPaymentRows = () => {
        const cominedPaymentsArray = [];
        const paymentscheduleObjArr = [];
        const instalmentsArray = [];
        // for generating instalments array on all instalment dates
        for (let i = mcPaymentScheduleModel.mcPaymentScheduleObject.length - 1; i >= 0; i -= 1) {
            const singlePaymentSchedule = mcPaymentScheduleModel.mcPaymentScheduleObject[i];
            paymentscheduleObjArr.push(mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule.length);
            if (singlePaymentSchedule.paymentSchedule.length < 2) {
                singlePaymentSchedule.paymentSchedule.map((instalment, index) => {
                    if (instalmentsArray[Object.keys(instalmentsArray).pop()]) {
                        instalmentsArray[Object.keys(instalmentsArray).pop()].push(instalment.paymentAmount.amount);
                    }
                    return null;
                });
            } else {
                singlePaymentSchedule.paymentSchedule.map((instalment, index) => {
                    if (index > 0) {
                        if (instalmentsArray[getDateObject(instalment.paymentDate).getTime()]) {
                            instalmentsArray[getDateObject(instalment.paymentDate).getTime()].push(instalment.paymentAmount.amount);
                        } else {
                            instalmentsArray[getDateObject(instalment.paymentDate).getTime()] = [instalment.paymentAmount.amount];
                        }
                    }
                    return null;
                });
            }
        }

        // for storing instalment dates
        const instalmentDates = Object.keys(instalmentsArray);
        instalmentDates.sort();
        paymentscheduleObjArr.sort((a, b) => {
            return b - a;
        });

        let lastPushedCarNumber = 0;
        let lastPushedIndex = 0;
        let singleCombinedPayment = null;
        if (paymentscheduleObjArr.every((val, i, arr) => val === arr[0])) {
            singleCombinedPayment = {
                id: 'combinedPayment 0',
                isCarRow: false,
                carsCount: instalmentsArray[instalmentDates[0]].length,
                combinedAmount: getTotalInstalmentAmount(instalmentsArray[instalmentDates[0]])
                    .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                months: paymentscheduleObjArr[0] - 1,
                startDateEpoch: instalmentDates[0]
            };
        } else {
            for (let i = instalmentDates.length - 1; i > 0; i -= 1) {
                if (instalmentsArray[instalmentDates[i]].length !== instalmentsArray[instalmentDates[i - 1]].length) {
                    singleCombinedPayment = {
                        id: `combinedPayment ${i}`,
                        isCarRow: false,
                        carsCount: instalmentsArray[instalmentDates[i]].length,
                        combinedAmount: getTotalInstalmentAmount(instalmentsArray[instalmentDates[i]])
                            .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        months: instalmentDates.length - i - lastPushedCarNumber,
                        startDateEpoch: instalmentDates[i]
                    };
                    cominedPaymentsArray.push(singleCombinedPayment);
                    lastPushedCarNumber = instalmentDates.length - i - lastPushedCarNumber;
                    lastPushedIndex = i;
                }
            }
            // for adding first row
            singleCombinedPayment = {
                id: 'combinedPayment 0',
                isCarRow: false,
                carsCount: instalmentsArray[instalmentDates[0]].length,
                combinedAmount: getTotalInstalmentAmount(instalmentsArray[instalmentDates[0]])
                    .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                months: lastPushedIndex,
                startDateEpoch: instalmentDates[0]
            };
        }
        cominedPaymentsArray.push(singleCombinedPayment);
        return cominedPaymentsArray;
    };

    const getInstalmentsCount = (customQuoteObject) => {
        let instalmentsCount = 0;
        for (let i = 0; i < mcPaymentScheduleModel.mcPaymentScheduleObject.length; i += 1) {
            if (customQuoteObject.quoteID === mcPaymentScheduleModel.mcPaymentScheduleObject[i].submissionID) {
                instalmentsCount = mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule.length;
            }
        }
        return instalmentsCount;
    };

    const getBreakdownRowsObjects = (carsArray, combinedPaymentRows) => {
        const sortedCombinedPaymentRows = sortByDateEpoch(combinedPaymentRows);
        const sortedCarsArray = sortByDateEpoch(carsArray);
        let carIndex = 0;
        let combinedPaymentIndex = 0;
        const breakdownRowsArray = [];
        breakdownRowsArray.push(sortedCarsArray[0]);
        while (carIndex < sortedCarsArray.length - 1) {
            if (sortedCarsArray[carIndex].instalmentsCount !== sortedCarsArray[carIndex + 1].instalmentsCount) {
                breakdownRowsArray.push(sortedCombinedPaymentRows[combinedPaymentIndex]);
                combinedPaymentIndex += 1;
            }
            carIndex += 1;
            breakdownRowsArray.push(sortedCarsArray[carIndex]);
        }
        // for adding last combined payment row
        breakdownRowsArray.push(sortedCombinedPaymentRows[combinedPaymentIndex]);
        return breakdownRowsArray;
    };
    const getCarsObjects = () => {
        const carsArray = multiCustomizeSubmissionVM.value.customQuotes.map((customQuoteObject) => {
            const customQuoteObjectCopy = _.cloneDeep(customQuoteObject);
            const vehicleObject = getVehicleObject(customQuoteObjectCopy.quoteID);
            const singleCarObject = {
                isCarRow: true,
                id: customQuoteObjectCopy.quoteID,
                regNumber: vehicleObject.registrationsNumber,
                displayName: `${vehicleObject.make} ${twoWords((vehicleObject.model) ? vehicleObject.model.toUpperCase() : null)}`,
                startDate: getStartDateString(customQuoteObjectCopy),
                daysInsured: getDaysInsured(customQuoteObjectCopy),
                initialPaymentDate: getInitialPaymentData(customQuoteObjectCopy).paymentDate,
                initialPaymentAmount: getInitialPaymentData(customQuoteObjectCopy).paymentAmount.amount,
                startDateEpoch: getDateObject(customQuoteObject.periodStartDate).getTime(),
                instalmentsCount: getInstalmentsCount(customQuoteObjectCopy)
            };
            return singleCarObject;
        });
        const combinedPaymentRows = getCombinedPaymentRows();
        return getBreakdownRowsObjects(carsArray, combinedPaymentRows);
    };

    const getquoteAmount = (quote, type) => {
        let singlecarAmt = 0;
        multiCustomizeSubmissionVM.value.customQuotes.forEach((customQuote) => {
            if (quote.id === customQuote.quoteID && type === messages.annuallyText) {
                singlecarAmt = _.get(customQuote, 'quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount', 0);
            } else if (quote.id === customQuote.quoteID && type === messages.monthlyText) {
                singlecarAmt = _.get(customQuote, 'quote.hastingsPremium.monthlyPayment.premiumAnnualCost.amount', 0);
            }
        });
        return `£${singlecarAmt.toFixed(2)}`;
    };

    const getbuysummaryPrice = (quoteId) => {
        if (quoteId && pricetableQuotes && pricetableQuotes.length) {
            const tableQuote = pricetableQuotes.find((pricetableQuote) => pricetableQuote.id === quoteId);
            return (
                <>
                    <Row className="mc-hd-monthly-payments-description__row">
                        <Col className="mc-hd-monthly-payments-description__col">
                            <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                                <Col className="mc-hd-monthly-payments-description__col">{messages.priceTableTotalAmountPolicyPrice}</Col>
                                <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                    {getquoteAmount(tableQuote, messages.monthlyText)}
                                </Col>
                            </Row>
                            {tableQuote.ancillaries.map((ancillary) => (
                                <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                                    <Col className="mc-hd-monthly-payments-description__col">{ancillary.name}</Col>
                                    <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                        {ancillary.value}
                                    </Col>
                                </Row>
                            ))}
                        </Col>
                    </Row>
                    <hr className="important-stuff__hr" />
                </>
            );
        }
        return null;
    };

    const getInstalmentsRow = () => {
        const carsObjects = getCarsObjects();
        const instalmentsRow = carsObjects.map((singleCarObject, index) => {
            if (singleCarObject.isCarRow) {
                return (
                    <Col key={singleCarObject.id} className="mc-hd-monthly-payments-description__col">
                        <Row className="mc-hd-monthly-payments-description__payment-car-info mc-hd-monthly-payments-description__row">
                            <span className="mc-hd-monthly-payments-description__payment-reg-num">
                                {formatRegNumber(singleCarObject.regNumber)}
                            </span>
                            <span className="mc-hd-monthly-payments-description__payment-car-name font-medium">
                                {singleCarObject.displayName}
                            </span>
                        </Row>
                        {singleCarObject && singleCarObject.id ? getbuysummaryPrice(singleCarObject.id) : ''}
                        <Row className="mc-hd-monthly-payments-description__row">
                            <Col className="mc-hd-monthly-payments-description__col">
                                <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                                    <Col className="mc-hd-monthly-payments-description__col">{messages.startDate}</Col>
                                    <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                        {singleCarObject.startDate}
                                    </Col>
                                </Row>
                                <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                                    <Col className="mc-hd-monthly-payments-description__col">{messages.daysInsured}</Col>
                                    <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                        {singleCarObject.daysInsured}
                                    </Col>
                                </Row>
                                <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                                    <Col className="mc-hd-monthly-payments-description__col">{getInitialPaymentDate(singleCarObject)}</Col>
                                    <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                        {displayAmount(singleCarObject.initialPaymentAmount)
                                            .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {index + 1 < carsObjects.length && carsObjects[index + 1].isCarRow ? (
                            <hr className="mc-hd-monthly-payments-description__hr-sec" />
                        ) : null}
                    </Col>
                );
            }
            return (
                <Row key={singleCarObject.id} className="mc-hd-monthly-payments-description__payment-quote-info mc-hd-monthly-payments-description__row">
                    <Col className="mc-hd-monthly-payments-description__col">
                        <Row className="mc-hd-monthly-payments-description__monthly-payment-container mc-hd-monthly-payments-description__row">
                            <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__instalment-months">
                                {`${singleCarObject.months} ${singleCarObject.carsCount > 1
                                    ? 'combined ' : ''}monthly payments for ${numberToWord[singleCarObject.carsCount]}
                                    car${singleCarObject.carsCount > 1 ? 's ' : ''}`}
                            </Col>
                            <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                                {displayAmount(singleCarObject.combinedAmount)
                                    .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        });
        return instalmentsRow;
    };

    return (
        getInstalmentsRow()
    );
};

HDMCMonthlyBreakdownHelper.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    pricetableQuotes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        daysInsured: PropTypes.number.isRequired,
        paymentBase: PropTypes.string.isRequired,
        paymentCredit: PropTypes.string,
        paymentCreditCharge: PropTypes.string,
        instalments: PropTypes.shape({
            count: PropTypes.number,
            value: PropTypes.string,
            paymentInitial: PropTypes.string
        }),
        ancillaries: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string
        })),
        isDeferred: PropTypes.bool
    })),
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }).isRequired
};

export default HDMCMonthlyBreakdownHelper;
