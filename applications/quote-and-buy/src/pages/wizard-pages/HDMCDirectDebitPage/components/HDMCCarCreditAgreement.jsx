import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { HDLabelRefactor, HDVehicleSimpleDetails } from 'hastings-components';
import * as messages from './HDMCCarCreditAgreement.messages';
import { getPriceWithCurrencySymbol } from '../../../../common/utils';

/**
 * @author MStajic
 * @date 15.06.2021
 * @description Blue box on the DirectDebitPage that shows car breakdown payments
 * @returns {JSX.Element}
 */
const HDMCCarCreditAgreement = ({
    vrn, displayName, days = 365, includeExtra = true, amount = 1000, currency = 'gbp'
}) => {
    return (
        <>
            <HDVehicleSimpleDetails displayName={displayName} vrn={vrn} className="vehicle-details" />
            <Row className="align-items-end">
                <Col className="policy_car_info">
                    <span>{messages.policyPriceText}</span>
                    <span className="font-bold">{`${days} days`}</span>
                    <span>{messages.policyCoverText}</span>
                    {includeExtra && (
                        <span>{messages.includingOptionalExtras}</span>
                    )}
                </Col>
                <Col xs="auto" className="policy_car_amount">
                    <HDLabelRefactor
                        Tag="span"
                        className="currency_amount"
                        text={getPriceWithCurrencySymbol({ amount: amount, currency: currency })} />
                </Col>
            </Row>
        </>
    );
};

HDMCCarCreditAgreement.propTypes = {
    vrn: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    days: PropTypes.number,
    includeExtra: PropTypes.bool,
    amount: PropTypes.number,
};

HDMCCarCreditAgreement.defaultProps = {
    includeExtra: true,
    amount: 100,
    days: 365,
};

export default HDMCCarCreditAgreement;
