import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import * as messages from './HDCustomerReviews.messages';
// import './HDCustomerReviews.scss';
import HDCustomerReviewsWidget from './HDCustomerReviewsWidget';

const HDCustomerReviews = ({
    onLoadReviewsBagde
}) => (
    <div className="info-box">
        <div className="info-box-title">
            <h3>
                {messages.title}
                <span>{` ${messages.asterisk}`}</span>
            </h3>
        </div>
        <div className="info-box-description">
            <HDCustomerReviewsWidget onLoadReviewsBagde={onLoadReviewsBagde} />
            <Row className="margin-top-md">
                <Col>
                    <span className="customer-reviews__substantiation">{messages.vrnRightBoxSubstantiation}</span>
                </Col>
            </Row>
        </div>
    </div>
);

HDCustomerReviews.propTypes = {
    onLoadReviewsBagde: PropTypes.func.isRequired,
};

export default HDCustomerReviews;
