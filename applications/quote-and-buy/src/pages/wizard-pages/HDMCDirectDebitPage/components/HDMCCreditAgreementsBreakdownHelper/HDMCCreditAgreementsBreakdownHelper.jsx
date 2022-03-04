import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { HDLabelRefactor, HDVehicleSimpleDetails } from 'hastings-components';
import twoWords from '../../../__helpers__/twoWords';
import * as messages from '../../../HDMCCustomizeQuoteSummaryPage/HDMCCustomizeQuoteSummaryPage.messages';

const HDMCCreditAgreementsBreakdownHelper = ({
    mcsubmissionVM, multiCustomizeSubmissionVM, mcPaymentScheduleModel
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
        for (let i = 0; i < mcPaymentScheduleModel.length; i += 1) {
            if (customQuoteObject.quoteID === mcPaymentScheduleModel[i].submissionID) {
                // eslint-disable-next-line prefer-destructuring
                intialPaymentObject = mcPaymentScheduleModel[i].paymentSchedule[0];
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

    function sortByLength(arr) {
        return arr.sort((a, b) => { return b.paymentSchedule.length - a.paymentSchedule.length; });
    }

    // for adding blue line rows (combined payment rows) in payment breakdown
    const getCombinedPaymentRows = () => {
        const cominedPaymentsArray = [];
        const instalmentsArray = [];
        const paymentscheduleObjArr = [];
        // for generating instalments array on all instalment dates
        for (let i = mcPaymentScheduleModel.length - 1; i >= 0; i -= 1) {
            const singlePaymentSchedule = mcPaymentScheduleModel[i];
            paymentscheduleObjArr.push(mcPaymentScheduleModel[i].paymentSchedule.length);
            paymentscheduleObjArr.sort((a, b) => {
                return b - a;
            });
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
        for (let i = 0; i < mcPaymentScheduleModel.length; i += 1) {
            if (customQuoteObject.quoteID === mcPaymentScheduleModel[i].submissionID) {
                instalmentsCount = mcPaymentScheduleModel[i].paymentSchedule.length;
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

    const renderMonthlyBreakdown = (singleCarObject) => {
        if (singleCarObject) {
            return (
                `${singleCarObject.months} ${singleCarObject.carsCount > 1
                    ? 'combined ' : ''}monthly payments for ${numberToWord[singleCarObject.carsCount]}
                    car${singleCarObject.carsCount > 1 ? 's ' : ''}`
            );
        }
        return '';
    };

    const getInstalmentsRow = () => {
        const carsObjects = getCarsObjects();
        const instalmentsRow = carsObjects.map((singleCarObject) => {
            if (singleCarObject.isCarRow) {
                return (
                    <Fragment key={singleCarObject.regNumber}>
                        <HDVehicleSimpleDetails vrn={singleCarObject.regNumber} displayName={singleCarObject.displayName} className="vehicle-details" />
                        <Row className="align-items-end mb-1">
                            <Col className="policy_car_info">
                                <HDLabelRefactor Tag="span" text={messages.initialPaymentMCBreakdown} />
                            </Col>
                            <Col xs="auto" className="policy_car_amount">
                                <HDLabelRefactor
                                    className="currency_amount"
                                    Tag="span"
                                    text={displayAmount(singleCarObject.initialPaymentAmount)
                                        .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                            </Col>
                        </Row>
                    </Fragment>
                );
            }
            return (
                <Row className="align-items-end">
                    <Col className="policy_car_info">
                        <HDLabelRefactor
                            className="font-bold"
                            Tag="span"
                            text={renderMonthlyBreakdown(singleCarObject)} />
                    </Col>
                    <Col xs="auto" className="policy_car_amount">
                        <HDLabelRefactor
                            className="currency_amount"
                            Tag="span"
                            text={displayAmount(singleCarObject.combinedAmount)
                                .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
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

HDMCCreditAgreementsBreakdownHelper.propTypes = {
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

export default HDMCCreditAgreementsBreakdownHelper;
