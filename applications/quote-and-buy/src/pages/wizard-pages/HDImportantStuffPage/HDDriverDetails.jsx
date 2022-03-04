import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import * as messages from './HDQuoteDriverTable.messages';


const HDDriverDetails = ({
    driver: {
        dateOfBirth, occupation, drivingLicence, accidence, convictions
    },
}) => {
    const entryColsProps = { xs: 12, lg: 6 };
    const keyColsProps = { xs: 6 };
    const valueColsProps = { xs: 6 };
    return (
        <Row className="driver-details-card">
            <Col {...entryColsProps}>
                <Row>
                    <Col {...keyColsProps} className="col-xl-5 col-xxl-4 driver-details-card__key">{messages.dateOfBirth}</Col>
                    <Col {...valueColsProps} className="col-xl-7 col-xxl-8 driver-details-card__value">{dateOfBirth}</Col>
                </Row>
            </Col>
            <Col {...entryColsProps}>
                <Row>
                    <Col {...keyColsProps} className="col-xxl-6 driver-details-card__key">{messages.accidence}</Col>
                    <Col {...valueColsProps} className="col-xxl-6 driver-details-card__value">{accidence}</Col>
                </Row>
            </Col>
            <Col {...entryColsProps}>
                <Row>
                    <Col {...keyColsProps} className="col-xl-5 col-xxl-4 driver-details-card__key">{messages.occupation}</Col>
                    <Col {...valueColsProps} className="col-xl-7 driver-details-card__value">{occupation}</Col>
                </Row>
            </Col>
            {convictions && (
                <Col {...entryColsProps}>
                    <Row>
                        <Col {...keyColsProps} className="col-xxl-6 driver-details-card__key">{messages.convictions}</Col>
                        <Col {...valueColsProps} className="col-xxl-6 driver-details-card__value">{convictions}</Col>
                    </Row>
                </Col>
            )}
            <Col {...entryColsProps}>
                <Row>
                    <Col {...keyColsProps} className="col-xl-5 col-xxl-4 driver-details-card__key">{messages.drivingLicence}</Col>
                    <Col {...valueColsProps} className="col-xl-7 col-xxl-8 driver-details-card__value">{drivingLicence}</Col>
                </Row>
            </Col>
        </Row>
    );
};

HDDriverDetails.propTypes = {
    driver: PropTypes.shape({
        dateOfBirth: PropTypes.string.isRequired,
        occupation: PropTypes.string.isRequired,
        drivingLicence: PropTypes.string.isRequired,
        accidence: PropTypes.string.isRequired,
        convictions: PropTypes.string.isRequired,
    }).isRequired,
};

export default HDDriverDetails;
