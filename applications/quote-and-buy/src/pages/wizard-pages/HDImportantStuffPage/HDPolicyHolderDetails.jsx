import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import * as messages from './HDQuoteDriverTable.messages';
import formatRegNumber from '../../../common/formatRegNumber';

const HDPolicyHolderDetails = ({
    policyHolder: {
        registrationNumber,
        car,
        policyHolder,
        yearsNoClaims,
        address,
        namedDrivers,
    },
}) => (
    <Row className="policyholder-details-container">
        <Col xs={12} lg={5} className="policyholder-details__left-column">
            <div className="policyholder-details__left-column__registration">
                {formatRegNumber(registrationNumber)}
            </div>
            <HDLabelRefactor
                Tag="h5"
                text={car}
                className="mb-0"
                id="policyholder-details-car-label" />
        </Col>
        <Col xs={12} lg={7} className="policyholder-details__right-column">
            <Row noGutters>
                <Col xs={12} lg={6} className="policyholder-details__right-column__item">
                    <Row>
                        <Col xs={6} lg={12} className="policyholder-details__right-column__item__key">{messages.policyHolder}</Col>
                        <Col xs={6} lg={12}>
                            <div className="policyholder-details__right-column__item__value">
                                {policyHolder}
                            </div>
                            <div className="policyholder-details__right-column__item__value">
                                <span className="font-bold">
                                    {yearsNoClaims}
                                </span>
                                {messages.yearsNoClaims(yearsNoClaims)}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} lg={6} className="policyholder-details__right-column__item order-lg-last">
                    <Row>
                        <Col xs={6} lg={12} className="policyholder-details__right-column__item__key">
                            {messages.address}
                        </Col>
                        <Col xs={6} lg={12} className="policyholder-details__right-column__item__value">
                            {address}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} lg={6} className="policyholder-details__right-column__item">
                    <Row>
                        {(namedDrivers.length > 0) && (
                            <Col xs={6} lg={12} className="policyholder-details__right-column__item__key">
                                {messages.namedDrivers}
                            </Col>
                        )}
                        <Col xs={6} lg={12}>
                            {namedDrivers.map((driver) => (
                                <div className="policyholder-details__right-column__item__value" key={driver}>
                                    {driver}
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    </Row>
);

HDPolicyHolderDetails.propTypes = {
    policyHolder: PropTypes.shape({
        registrationNumber: PropTypes.string.isRequired,
        car: PropTypes.string.isRequired,
        policyHolder: PropTypes.string.isRequired,
        yearsNoClaims: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        namedDrivers: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default HDPolicyHolderDetails;
