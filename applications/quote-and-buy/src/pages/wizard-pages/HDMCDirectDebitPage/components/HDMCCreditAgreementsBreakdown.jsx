import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './HDMCCreditAgreementsBreakdown.messages';
import HDMCCarCreditAgreement from './HDMCCarCreditAgreement';
import HDMCCreditAgreementsBreakdownHelper from './HDMCCreditAgreementsBreakdownHelper/HDMCCreditAgreementsBreakdownHelper';
import { paymentSchedulePropTypes } from '../../../../constant/propTypes';
import { getPriceWithCurrencySymbol } from '../../../../common/utils';

/***
 * @author MStajic
 * @date 15.06.2021
 * @description Breakdown of payments on the DirectDebitCard page light blue box;
 * @returns {JSX.Element}
 */
const HDMCCreditAgreementsBreakdown = ({
    vehicles, premiumInfo, mcPaymentScheduleModel, multiCustomizeSubmissionVM, mcsubmissionVM
}) => {
    // eslint-disable-next-line max-len
    const totalAmountCredit = vehicles.reduce((sum, carItem) => sum + carItem.totalAmountCredit, 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // eslint-disable-next-line max-len
    const totalPremiumAmountCost = vehicles.reduce((sum, carItem) => sum + carItem.premiumAnualCostAmount, 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const totalPremiumAmountCostNumber = parseFloat(totalPremiumAmountCost.replace(',', ''));
    const totalAmountCreditNumber = parseFloat(totalAmountCredit.replace(',', ''));
    const creditCharge = totalPremiumAmountCostNumber - totalAmountCreditNumber;

    function sortByLength(arr) {
        return arr.sort((a, b) => { return a.paymentSchedule.length - b.paymentSchedule.length; });
    }

    const renderVehicleDetails = () => {
        return vehicles.map((v) => {
            return (
                <Fragment key={v.vehicleDetails.vrn}>
                    <HDMCCarCreditAgreement
                        vrn={v.vehicleDetails.vrn}
                        days={v.policyDuration}
                        displayName={v.vehicleDetails.displayName}
                        includeExtra={v.parentCar}
                        amount={v.totalAmountCredit}
                        currency={v.initialPayment.currency} />
                    <hr className="horizontal_spacing_line" />
                </Fragment>
            );
        });
    };

    return (
        <div className="direct-debit__monthly-payment-box credit_agreement_box mb-4">
            <div className="credit_agreement_holder">
                <HDLabelRefactor Tag="h5" text={messages.creditAgreementHeaderText} className="mb-0" />
                <div className="vehicles_breakdown">
                    {renderVehicleDetails()}
                </div>
                <Row className="align-items-end">
                    <Col className="policy_car_info">
                        <HDLabelRefactor Tag="span" text={messages.creditAgreementTotalPrice} />
                        <HDLabelRefactor className="font-bold" Tag="span" text={` ${vehicles.length} cars`} />
                    </Col>
                    <Col xs="auto" className="policy_car_amount">
                        <HDLabelRefactor
                            className="currency_amount"
                            Tag="span"
                            text={getPriceWithCurrencySymbol({
                                amount: totalAmountCredit,
                                currency: vehicles[0].initialPayment.currency || 'gbp'
                            })} />
                    </Col>
                </Row>
                <Row className="mt-2 align-items-end">
                    <Col className="total_car_count policy_car_info">
                        <HDLabelRefactor Tag="span" text={messages.totalCreditCharge} />
                    </Col>
                    <Col xs="auto" className="policy_car_amount">
                        <HDLabelRefactor
                            className="currency_amount"
                            Tag="span"
                            text={getPriceWithCurrencySymbol({
                                amount: creditCharge,
                                currency: vehicles[0].initialPayment.currency || 'gbp'
                            })} />
                    </Col>
                </Row>
                <Row className="mt-2 align-items-end">
                    <Col className="policy_car_info">
                        <HDLabelRefactor Tag="span" text={messages.totalAmount} />
                    </Col>
                    <Col xs="auto" className="policy_car_amount">
                        <HDLabelRefactor
                            className="currency_amount"
                            Tag="span"
                            text={getPriceWithCurrencySymbol({
                                amount: totalPremiumAmountCost,
                                currency: vehicles[0].initialPayment.currency || 'gbp'
                            })} />
                    </Col>
                </Row>
                <Row className="mb-2 mt-1">
                    <Col>
                        <HDLabelRefactor
                            className="rate-line"
                            Tag="span"
                            text={messages.creditInterestRate(premiumInfo.representativeAPR,
                                premiumInfo.rateOfInterest)} />
                    </Col>
                </Row>
                <hr className="horizontal_spacing_line" />
                {mcPaymentScheduleModel.mcPaymentScheduleObject && (
                    <HDMCCreditAgreementsBreakdownHelper
                        mcsubmissionVM={mcsubmissionVM}
                        multiCustomizeSubmissionVM={multiCustomizeSubmissionVM}
                        mcPaymentScheduleModel={sortByLength(mcPaymentScheduleModel.mcPaymentScheduleObject)} />
                )}
            </div>
        </div>
    );
};

HDMCCreditAgreementsBreakdown.propTypes = {
    vehicles: PropTypes.arrayOf(PropTypes.object),
    premiumInfo: PropTypes.shape({
        rateOfInterest: PropTypes.number.isRequired,
        representativeAPR: PropTypes.number.isRequired,
    }),
    mcPaymentScheduleModel: PropTypes.shape(paymentSchedulePropTypes),
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }),
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired
};

HDMCCreditAgreementsBreakdown.defaultProps = {
    vehicles: [{}],
    premiumInfo: {
        rateOfInterest: 0,
        representativeAPR: 0,
    },
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

export default connect(mapStateToProps)(HDMCCreditAgreementsBreakdown);
