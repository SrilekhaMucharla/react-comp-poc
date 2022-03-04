/* eslint-disable max-len */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as messages from './HDMCCustomizeQuoteSummaryPage.messages';
import HDMCMonthlyBreakdownHelper from './HDMCMonthlyBreakdownHelper/HDMCMonthlyBreakdownHelper';

const HDMCCQSPMonthlyBreakdown = ({
    mcsubmissionVM, deferredCase, aprRate, interestRate, multiCustomizeSubmissionVM,
    monthlyAmount, monthlyElevenCombinedPayment, monthlyIntialPayment, monthlyTotalAmountCredit, mcPaymentScheduleModel
}) => {
    const numberToWord = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five'
    };

    const CAR_NUMBERS = 'CAR_NUMBERS';
    const APR_RATE = 'APR_RATE';
    const INTEREST_RATE = 'INTEREST_RATE';
    const displayAmount = (value) => `£${value}`;
    const checkBreakdown = () => {
        if (!mcPaymentScheduleModel.mcPaymentScheduleObject) { return false; }
        for (let i = 0; i < mcPaymentScheduleModel.mcPaymentScheduleObject.length; i += 1) {
            if (mcPaymentScheduleModel.mcPaymentScheduleObject[i].paymentSchedule.length !== 12) { return true; }
        }
        return false;
    };

    if (deferredCase || checkBreakdown()) {
        return (
            <Row className="mc-hd-monthly-payments-description">
                <Col className="mc-hd-monthly-payments-description__col">
                    <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                        <Col className="mc-hd-monthly-payments-description__col">
                            {messages.totalPriceLabel.replace(CAR_NUMBERS, numberToWord[multiCustomizeSubmissionVM.value.customQuotes.length])}
                        </Col>
                        <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                            {displayAmount((monthlyTotalAmountCredit).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                        </Col>
                    </Row>
                    <Row className="mc-hd-monthly-payments-description__line mc-hd-monthly-payments-description__row">
                        <Col className="mc-hd-monthly-payments-description__col">{messages.totalCreditChargeLabel}</Col>
                        <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-demi-bold">
                            {displayAmount((monthlyAmount - monthlyTotalAmountCredit).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                        </Col>
                    </Row>
                    <Row className="mc-hd-monthly-payments-description__line-demibold mc-hd-monthly-payments-description__row">
                        <Col className="mc-hd-monthly-payments-description__col font-demi-bold">{messages.totalAmountPayableLabel}</Col>
                        <Col className="mc-hd-monthly-payments-description__col mc-hd-monthly-payments-description__row-value font-bold">
                            {displayAmount((monthlyAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                        </Col>
                    </Row>
                    <Row className="mc-hd-monthly-payments-description__commented-line mc-hd-monthly-payments-description__row">
                        <Col className="mc-hd-monthly-payments-description__col">
                            {messages.ratesComment.replace(APR_RATE, aprRate).replace(INTEREST_RATE, interestRate)}
                        </Col>
                    </Row>
                    <hr className="mc-hd-monthly-payments-description__hr" />
                    <HDMCMonthlyBreakdownHelper
                        mcsubmissionVM={mcsubmissionVM}
                        multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                        mcPaymentScheduleModel={mcPaymentScheduleModel} />
                </Col>
            </Row>
        );
    }
    return (
        <Row className="mc-hd-monthly-payments-description">
            <Col className="px-0">
                <Row className="mc-hd-monthly-payments-description__line">
                    <Col>{messages.initialPaymentLabel}</Col>
                    <Col className="col-auto text-right font-bold">{displayAmount((monthlyIntialPayment).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</Col>
                </Row>
                <Row className="mc-hd-monthly-payments-description__line">
                    <Col>
                        {messages.elevenCombinedMonthlyPaymentLabel.replace(
                            CAR_NUMBERS,
                            numberToWord[multiCustomizeSubmissionVM.value.customQuotes.length]
                        )}
                    </Col>
                    <Col className="col-auto text-right font-bold">{displayAmount((monthlyElevenCombinedPayment).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</Col>
                </Row>
                <hr className="mx-1" />
                <Row className="mc-hd-monthly-payments-description__line">
                    <Col>
                        {messages.totalPriceLabel.replace(CAR_NUMBERS, numberToWord[multiCustomizeSubmissionVM.value.customQuotes.length])}
                    </Col>
                    <Col className="col-auto text-right font-demi-bold">{displayAmount((monthlyTotalAmountCredit).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</Col>
                </Row>
                <Row className="mc-hd-monthly-payments-description__line">
                    <Col>{messages.totalCreditChargeLabel}</Col>
                    <Col className="col-auto text-right font-demi-bold">{displayAmount((monthlyAmount - monthlyTotalAmountCredit).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</Col>
                </Row>
                <Row className="mc-hd-monthly-payments-description__line-demibold">
                    <Col className="font-bold">{messages.totalAmountPayableLabel}</Col>
                    <Col className="col-auto text-right font-bold">{displayAmount((monthlyAmount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</Col>
                </Row>
                <Row className="mc-hd-monthly-payments-description__commented-line">
                    <Col>
                        {messages.ratesComment.replace(APR_RATE, aprRate).replace(INTEREST_RATE, interestRate)}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

HDMCCQSPMonthlyBreakdown.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    deferredCase: PropTypes.bool.isRequired,
    aprRate: PropTypes.number.isRequired,
    interestRate: PropTypes.number.isRequired,
    monthlyAmount: PropTypes.number.isRequired,
    monthlyElevenCombinedPayment: PropTypes.number.isRequired,
    monthlyIntialPayment: PropTypes.number.isRequired,
    monthlyTotalAmountCredit: PropTypes.number.isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired,
    mcPaymentScheduleModel: PropTypes.shape({
        mcPaymentScheduleObject: PropTypes.shape([])
    }).isRequired
};

export default HDMCCQSPMonthlyBreakdown;
