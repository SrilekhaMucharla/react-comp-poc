/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import dayjs from 'dayjs';
import { AnalyticsHDOverlayPopup as HDOverlayPopup, AnalyticsHDLabel as HDLabel } from '../../../web-analytics';
import * as messages from '../HDThanksPage/HDThanksPage.messages';
import formatRegNumber from '../../../common/formatRegNumber';
import getMonthAsString from '../../../common/getMonthAsString';
import { getNumberAsString } from '../../../common/utils';
import { getAmountAsTwoDecimalDigit } from '../../../common/premiumFormatHelper';

const oneDayMS = 86400000;

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

const checkDeferredCase = (policyStartDate, childStartDate) => {
    const refDate = dayjs(new Date(policyStartDate));
    const childCarDate = dayjs(new Date(childStartDate));
    return childCarDate.diff(refDate, 'day') > 30;
};

const addCurrencyPrefix = (amountArray, currencySymbol) => {
    for (let i = 0; i < amountArray.length; i += 1) {
        amountArray[i] = `${currencySymbol}${amountArray[i].toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return amountArray;
};

const getCoverRenewStep = (carSteps, parentPolicyEndDate, paymentType, pageMetadata) => {
    const policyEndDate = new Date(parentPolicyEndDate.year, parentPolicyEndDate.month, parentPolicyEndDate.day);
    policyEndDate.setDate(policyEndDate.getDate() + 1);
    parentPolicyEndDate = {
        year: parentPolicyEndDate.year,
        month: parentPolicyEndDate.month,
        day: policyEndDate.getDate()
    };
    carSteps.push({
        id: 7,
        circle: {
            date: { day: `${parentPolicyEndDate.day}`, shortMonth: getMonthAsString(parentPolicyEndDate.month) }
        },
        description: {
            tooltip:
    <HDOverlayPopup
        id="mc_dd_all_cover_renews_overlay"
        webAnalyticsView={{ ...pageMetadata, page_section: `${paymentType} payment breakdown` }}
        webAnalyticsEvent={{ event_action: `${paymentType} payment breakdown` }}
        overlayButtonIcon={
            (
                <Row>
                    <Col className="col-auto pr-0">
                        <span className="mc-thanks-page__sync-icon fa fa-sync" />
                    </Col>
                    <Col className="pl-2">
                        <HDLabel
                            id="mc-thanks-page-policy-link"
                            webAnalyticsEvent={{ event_action: messages.allCoverRenewsText }}
                            Tag="a"
                            className="mc-thanks-page__policy-link"
                            text={messages.allCoverRenewsText} />
                    </Col>
                </Row>
            )}
    >
        <h2>{messages.mcPolicyRenewalOverlayHeader}</h2>
        <p>{messages.mcPolicyRenewalOverlayText1}</p>
        <p>{messages.mcPolicyRenewalOverlayText2}</p>
        <p>{messages.mcPolicyRenewalOverlayText3}</p>
        <p>{messages.mcPolicyRenewalOverlayText4}</p>
    </HDOverlayPopup>
        }
    });
    return carSteps;
};

const getPaymentTodayText = (noOfCars, isMonthly) => {
    if (isMonthly) {
        if (noOfCars <= 2) {
            return [messages.initialPaymentTodayText];
        }
        return [messages.initialPaymentForAllCarsTodayText];
    }
    if (noOfCars <= 2) {
        return [messages.paymentTodayText];
    }
    return [messages.paymentForAllCarsTodayText];
};

const getFirstPaymentRow = (paymentTodayRegNums, initialPaymentAmount, initialPaymentArray, isPaymentDone, mcSubVMQuotes, isMonthly, pageMetadata) => {
    const pcDate = new Date(mcSubVMQuotes[0].baseData.pccurrentDate);
    const returnArray = [
        {
            id: 'payToday',
            circle: {
                type: `${isPaymentDone ? 'green' : 'violet'}`,
                date: {
                    day: pcDate.getDate(),
                    shortMonth: getMonthAsString(pcDate.getMonth())
                }
            },
            description: {
                label: [...paymentTodayRegNums],
                name: getPaymentTodayText(paymentTodayRegNums.length, isMonthly),
                quote: {
                    single: `£${initialPaymentAmount
                        .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    instalments: addCurrencyPrefix(initialPaymentArray, '£')
                },
                tooltip:
    <HDOverlayPopup
        id="mc_dd_why_today_overlay"
        webAnalyticsView={{ ...pageMetadata, page_section: 'Why today overlay' }}
        webAnalyticsEvent={{ event_action: 'Why today overlay' }}
        overlayButtonIcon={
            (
                <Row className="mt-3">
                    <Col>
                        <HDLabel
                            Tag="a"
                            className="mc-thanks-page__policy-link"
                            text={messages.whyPayTodayText} />
                    </Col>
                </Row>
            )}
    >
        <h2>{messages.whyPayTodayOverlayHeader}</h2>
        <p>{messages.whyPayTodayOverlayContent}</p>
    </HDOverlayPopup>
            }
        }
    ];
    if (isPaymentDone) { delete returnArray[0].circle.date; delete returnArray[0].description.tooltip; }
    if (initialPaymentArray.length === 1) { delete returnArray[0].description.quote.instalments; }
    return returnArray;
};

const getDayMonthTwoDigit = (dayMonth) => {
    const dayMonthString = (`0${dayMonth}`).slice(-2);
    return dayMonthString;
};

const getPaymentDueRow = (carSteps, clubbingIndex) => {
    carSteps.push({
        id: `${clubbingIndex} info`,
        circle: {
            date: {
                day: `${new Date(carSteps[clubbingIndex].startDateEpoch).getDate()}`,
                shortMonth: getMonthAsString(new Date(carSteps[clubbingIndex].startDateEpoch).getMonth())
            }
        },
        description: {
            label: [...carSteps[clubbingIndex].description.label],
            name: [messages.coverStartsText]
        },
        startDateEpoch: carSteps[clubbingIndex].startDateEpoch
    });
};

const modifyDeferredRow = (carSteps, clubbingIndex, paymentType) => {
    carSteps[clubbingIndex].description.name = [messages.paymentDue];
    let paymentDueDate;
    if (paymentType === 'monthly') {
        paymentDueDate = new Date(carSteps[clubbingIndex].initialPaymentDate);
    } else {
        paymentDueDate = new Date(carSteps[clubbingIndex].startDateEpoch - 7 * oneDayMS);
    }
    carSteps[clubbingIndex].circle.date.day = paymentDueDate.getDate();
    carSteps[clubbingIndex].circle.date.shortMonth = getMonthAsString(paymentDueDate.getMonth());
    carSteps[clubbingIndex].description.quote = {
        single: `£${carSteps[clubbingIndex].stepAmount}`
    };
    if (paymentType === 'monthly' && carSteps[clubbingIndex].initialPaymentArray.length > 1) {
        carSteps[clubbingIndex].description.quote.instalments = carSteps[clubbingIndex].initialPaymentArray;
    }
    if (paymentType === 'yearly' && carSteps[clubbingIndex].annualAmountArray.length > 1) {
        carSteps[clubbingIndex].description.quote.instalments = carSteps[clubbingIndex].annualAmountArray;
    }
};

const getRegNumber = (customSubVM, mcSubVMQuotes) => {
    let regNumber = '';
    for (let i = 0; i < mcSubVMQuotes.length; i += 1) {
        if (customSubVM.quoteID === mcSubVMQuotes[i].quoteID) {
            regNumber = _.get(mcSubVMQuotes[i], 'lobData.privateCar.coverables.vehicles[0].license', '');
        }
    }
    return regNumber;
};

const getParentQuoteID = (mcSubVMQuotes) => {
    for (let i = 0; i < mcSubVMQuotes.length; i += 1) {
        if (mcSubVMQuotes[i].isParentPolicy) { return mcSubVMQuotes[i].quoteID; }
    }
    return '';
};

export const getMCYearlyPaymentBreakDownData = (mcSubVMQuotes, customQuotes, isPaymentDone, pageMetadata) => {
    let quotesCopy = _.cloneDeep(customQuotes);
    let parentPolicyEndDate = null;
    let initialPaymentAmount = 0;
    const initialPaymentArray = [];
    const parentQuoteID = getParentQuoteID(mcSubVMQuotes);
    const pcDate = new Date(_.get(mcSubVMQuotes[0], 'baseData.pccurrentDate', new Date()));
    pcDate.setHours(0, 0, 0, 0);

    // for sorting quotes by their start date and storing some yearly constants
    quotesCopy.map((quote) => {
        _.set(quote, 'startDateEpoch', getDateObject(quote.periodStartDate).getTime());
        _.set(quote, 'regNumber', getRegNumber(quote, mcSubVMQuotes));
        if (quote.quoteID === parentQuoteID) {
            parentPolicyEndDate = quote.periodEndDate;
        }
        return null;
    });
    quotesCopy = sortByDateEpoch(quotesCopy);

    // for setting initialPayment array pcDate is required for below loop, which is being set in previous loop
    const paymentTodayRegNums = [];
    quotesCopy.map((quoteObj) => {
        if (!checkDeferredCase(pcDate.getTime(), quoteObj.startDateEpoch)) {
            initialPaymentAmount += quoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount;
            initialPaymentArray.push(quoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount);
            paymentTodayRegNums.push(formatRegNumber(quoteObj.regNumber));
        }
        return null;
    });

    const getCarSteps = () => {
        // for generating rows for each car
        let carSteps = [];
        quotesCopy.map((quoteObj, index) => {
            const singleStep = {
                id: `${index}`,
                circle: {
                    date: { day: `${quoteObj.periodStartDate.day}`, shortMonth: getMonthAsString(quoteObj.periodStartDate.month) }
                },
                description: {
                    label: [formatRegNumber(quoteObj.regNumber)],
                    name: [messages.coverStartsText],
                },
                startDateEpoch: getDateObject(quoteObj.periodStartDate).getTime(),
                stepAmount: getAmountAsTwoDecimalDigit(quoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount),
                annualAmountArray: [quoteObj.quote.hastingsPremium.annuallyPayment.premiumAnnualCost.amount
                    .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })]
            };
            carSteps.push(singleStep);
            return null;
        });
        carSteps = sortByDateEpoch(carSteps);

        // for clubbing together cars having same start date
        let clubbingIndex = 1;
        let totalGroups = 0;
        while (clubbingIndex < carSteps.length) {
            if (carSteps[clubbingIndex].startDateEpoch === carSteps[clubbingIndex - 1].startDateEpoch) {
                carSteps[clubbingIndex - 1].description.label = carSteps[clubbingIndex - 1].description.label
                    .concat(carSteps[clubbingIndex].description.label);
                carSteps[clubbingIndex - 1].stepAmount += carSteps[clubbingIndex].stepAmount;
                carSteps[clubbingIndex - 1].annualAmountArray = carSteps[clubbingIndex - 1].annualAmountArray
                    .concat(carSteps[clubbingIndex].annualAmountArray);
                carSteps.splice(clubbingIndex, 1);
            } else { clubbingIndex += 1; }
            totalGroups += 1;
        }

        // for adding payment due row for deferred case
        clubbingIndex = 1;
        while (clubbingIndex <= totalGroups) {
            if (carSteps[clubbingIndex] && !carSteps[clubbingIndex].id.includes('info')
                    && checkDeferredCase(pcDate.getTime(), carSteps[clubbingIndex].startDateEpoch)) {
                carSteps[clubbingIndex].description.name = [messages.paymentDue];
                modifyDeferredRow(carSteps, clubbingIndex, 'yearly');
                getPaymentDueRow(carSteps, clubbingIndex);
                // eslint-disable-next-line operator-assignment
                carSteps[clubbingIndex].startDateEpoch = carSteps[clubbingIndex].startDateEpoch - 7 * oneDayMS;
            }
            clubbingIndex += 1;
        }
        carSteps = sortByDateEpoch(carSteps);

        // for adding margin class
        clubbingIndex = 1;
        while (clubbingIndex < carSteps.length) {
            if (carSteps[clubbingIndex] && checkDeferredCase(carSteps[clubbingIndex - 1].startDateEpoch, carSteps[clubbingIndex].startDateEpoch)) {
                carSteps[clubbingIndex].topMargin = ' hd-big-step';
            } else {
                if (carSteps[clubbingIndex - 1].topMargin) {
                    carSteps[clubbingIndex - 1].topMargin += ' hd-small-step';
                } else {
                    carSteps[clubbingIndex - 1].topMargin = ' hd-small-step';
                }
            }
            clubbingIndex += 1;
        }
        return carSteps;
    };
    let returnArray = getFirstPaymentRow(paymentTodayRegNums, initialPaymentAmount, initialPaymentArray, isPaymentDone, mcSubVMQuotes, false, pageMetadata);

    returnArray = returnArray.concat(getCarSteps());

    // for adding All cover renews row
    returnArray = getCoverRenewStep(returnArray, parentPolicyEndDate, 'Yearly', pageMetadata);

    return returnArray;
};

export const getMCMonthlyPaymentBreakDownData = (mcSubVMQuotes, customQuotes, paymentScheduleResponse, isPaymentDone, pageMetadata) => {
    let quotesCopy = _.cloneDeep(customQuotes);
    let parentPolicyEndDate = null;
    let parentInitialPaymentDate = null;
    let initialPaymentAmount = 0;
    const initialPaymentArray = [];
    let instalmentsStartDate = null;
    const parentQuoteID = getParentQuoteID(mcSubVMQuotes);

    // for sorting quotes by their start date storing some monthly constants
    quotesCopy.map((quote) => {
        _.set(quote, 'startDateEpoch', getDateObject(quote.periodStartDate).getTime());
        _.set(quote, 'regNumber', getRegNumber(quote, mcSubVMQuotes));
        if (quote.quoteID === parentQuoteID) {
            parentPolicyEndDate = quote.periodEndDate;
            paymentScheduleResponse.map((singleQuoteSchedule) => {
                if (singleQuoteSchedule.submissionID === quote.quoteID) {
                    parentInitialPaymentDate = getDateObject(singleQuoteSchedule.paymentSchedule[0].paymentDate).getTime();
                    instalmentsStartDate = getDateObject(singleQuoteSchedule.paymentSchedule[1].paymentDate).getTime();
                }
                return null;
            });
        }
        return null;
    });
    quotesCopy = sortByDateEpoch(quotesCopy);

    // for setting initialPaymentArray, parentInitialPaymentDate is required for below loop which is being set in previous loop
    const paymentTodayRegNums = [];
    quotesCopy.map((quote) => {
        paymentScheduleResponse.map((singleQuoteSchedule) => {
            if (quote.quoteID === singleQuoteSchedule.submissionID
                && getDateObject(singleQuoteSchedule.paymentSchedule[0].paymentDate).getTime() === parentInitialPaymentDate) {
                initialPaymentAmount += singleQuoteSchedule.paymentSchedule[0].paymentAmount.amount;
                initialPaymentArray.push(singleQuoteSchedule.paymentSchedule[0].paymentAmount.amount);
                paymentTodayRegNums.push(formatRegNumber(quote.regNumber));
            }
            return null;
        });
        return null;
    });

    let returnArray = getFirstPaymentRow(paymentTodayRegNums, initialPaymentAmount, initialPaymentArray, isPaymentDone, mcSubVMQuotes, true, pageMetadata);

    const getPaymentSchedule = (quoteID) => {
        let paymentSchedule = null;
        paymentScheduleResponse.map((singlePaymentSchedule) => {
            if (quoteID === singlePaymentSchedule.submissionID) { paymentSchedule = singlePaymentSchedule; }
            return null;
        });
        return paymentSchedule;
    };

    const getTotalInstalmentAmount = (instalments) => {
        let sum = 0;
        instalments.map((instalment) => {
            sum += instalment;
            return null;
        });
        return sum;
    };

    // for adding instalments row in the timeline
    const getInstalmentsRow = () => {
        const returnInstalments = [];
        const instalmentsArray = [];

        // for generating instalments array at all instalment dates
        for (let i = paymentScheduleResponse.length - 1; i >= 0; i -= 1) {
            const singlePaymentSchedule = paymentScheduleResponse[i];
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

        // for storing instalment dates
        const instalmentDates = Object.keys(instalmentsArray);
        instalmentDates.sort();

        let lastPushedCarNumber = 0;
        let lastPushedIndex = 0;
        let singleInstalemtRow = null;
        for (let i = instalmentDates.length - 1; i > 0; i -= 1) {
            if (instalmentsArray[instalmentDates[i]].length !== instalmentsArray[instalmentDates[i - 1]].length) {
                singleInstalemtRow = {
                    id: `${i} instalment`,
                    description: {
                        name: [`${instalmentDates.length - i - lastPushedCarNumber} monthly ${(instalmentDates.length - i - lastPushedCarNumber) === 1
                            ? 'payment'
                            : 'payments'}`,
                        ` for ${getNumberAsString(instalmentsArray[instalmentDates[i]].length)} cars`],
                        quote: {
                            single: `£${getTotalInstalmentAmount(instalmentsArray[instalmentDates[i]])
                                .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            instalments: addCurrencyPrefix(instalmentsArray[instalmentDates[i]], '£')
                        }
                    },
                    startDateEpoch: instalmentDates[i]
                };
                if (instalmentsArray[instalmentDates[i]].length === 1) { delete singleInstalemtRow.description.quote.instalments; }
                returnInstalments.push(singleInstalemtRow);
                lastPushedCarNumber = instalmentDates.length - i - lastPushedCarNumber;
                lastPushedIndex = i;
            }
        }

        // for adding first instalment
        singleInstalemtRow = {
            id: '0 instalment',
            description: {
                name: [`${lastPushedIndex || '11'} monthly payments `],
                quote: {
                    single: `£${getTotalInstalmentAmount(instalmentsArray[instalmentDates[0]])
                        .toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    instalments: addCurrencyPrefix(instalmentsArray[instalmentDates[0]], '£')
                }
            },
            startDateEpoch: instalmentDates[0]
        };
        if (isPaymentDone) {
            // eslint-disable-next-line max-len
            singleInstalemtRow.description.name.push(`(starting on ${getDayMonthTwoDigit(new Date(instalmentsStartDate)
                .getDate())}/${getDayMonthTwoDigit(new Date(instalmentsStartDate).getMonth() + 1)}/${new Date(instalmentsStartDate).getFullYear()})`);
        } else {
            singleInstalemtRow.description.name.push(`(${messages.chosenDateStartText})`);
        }
        if (instalmentsArray[instalmentDates[0]].length === 1) { delete singleInstalemtRow.description.quote.instalments; }
        returnInstalments.push(singleInstalemtRow);
        return returnInstalments;
    };

    const getCarSteps = () => {
        // for generating rows for each car
        let carSteps = [];
        quotesCopy.map((quote, index) => {
            const singleStep = {
                id: `${index}`,
                circle: {
                    date: { day: `${quote.periodStartDate.day}`, shortMonth: getMonthAsString(quote.periodStartDate.month) }
                },
                description: {
                    label: [formatRegNumber(quote.regNumber)],
                    name: [messages.coverStartsText],
                },
                startDateEpoch: getDateObject(quote.periodStartDate).getTime(),
                stepAmount: getAmountAsTwoDecimalDigit(getPaymentSchedule(quote.quoteID).paymentSchedule[0].paymentAmount.amount),
                initialPaymentArray: [getAmountAsTwoDecimalDigit(getPaymentSchedule(quote.quoteID).paymentSchedule[0].paymentAmount.amount)],
                initialPaymentDate: getDateObject(getPaymentSchedule(quote.quoteID).paymentSchedule[0].paymentDate).getTime()
            };
            carSteps.push(singleStep);
            return null;
        });
        carSteps = sortByDateEpoch(carSteps);
        // for clubbing together cars having same start date
        let clubbingIndex = 1;
        let totalGroups = 0;
        while (clubbingIndex < carSteps.length) {
            if (carSteps[clubbingIndex].startDateEpoch === carSteps[clubbingIndex - 1].startDateEpoch) {
                carSteps[clubbingIndex - 1].description.label = carSteps[clubbingIndex - 1].description.label
                    .concat(carSteps[clubbingIndex].description.label);
                carSteps[clubbingIndex - 1].stepAmount += carSteps[clubbingIndex].stepAmount;
                carSteps[clubbingIndex - 1].initialPaymentArray = carSteps[clubbingIndex - 1].initialPaymentArray
                    .concat(carSteps[clubbingIndex].initialPaymentArray);
                carSteps.splice(clubbingIndex, 1);
            } else { clubbingIndex += 1; }
            totalGroups += 1;
        }

        // for adding payment due row for deferred case
        clubbingIndex = 1;
        while (clubbingIndex <= totalGroups) {
            if (carSteps[clubbingIndex] && !carSteps[clubbingIndex].id.includes('info')
                            && parentInitialPaymentDate !== carSteps[clubbingIndex].initialPaymentDate) {
                modifyDeferredRow(carSteps, clubbingIndex, 'monthly');
                getPaymentDueRow(carSteps, clubbingIndex);
                carSteps[clubbingIndex].startDateEpoch = carSteps[clubbingIndex].initialPaymentDate;
            }
            clubbingIndex += 1;
        }
        carSteps = carSteps.concat(getInstalmentsRow());
        carSteps = sortByDateEpoch(carSteps);
        return carSteps;
    };

    returnArray = returnArray.concat(getCarSteps());
    returnArray = getCoverRenewStep(returnArray, parentPolicyEndDate, 'Monthly', pageMetadata);
    return returnArray;
};
