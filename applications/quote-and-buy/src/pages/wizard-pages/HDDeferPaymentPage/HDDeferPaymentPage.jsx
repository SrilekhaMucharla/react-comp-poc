import React from 'react';
import PropTypes from 'prop-types';
import {
    Container, Row, Col
} from 'react-bootstrap';
import { HDInfoCard } from 'hastings-components';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDButton as HDButton
} from '../../../web-analytics/index';
import TipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import BackNavigation from '../../Controls/BackNavigation/BackNavigation';
import * as messages from './HDDeferPaymentPage.messages';
import getDeferText from './helpers';
import './HDDeferPaymentPage.scss';

export default function HDDeferPaymentPage({ payments }) {
    return (
        <Container className="container-defer-payment">
            <Row>
                <Col xs={12} md={10}>
                    <BackNavigation />
                    <h1 className="heading-primary u-margin-bottom-mid">{messages.mainHeading}</h1>
                    <HDToggleButtonGroup
                        webAnalyticsEvent={{ event_action: messages.mainHeading }}
                        id="pay-all-button-group"
                        className="btn-group-defer u-margin-bottom-mid"
                        availableValues={
                            [
                                {
                                    value: 'payFull',
                                    content:
    <>
        <span>{messages.payFull}</span>
        <span className="btn-secondary-description">
            {`(£${payments.reduce((prev, curr) => prev + curr.amount, 0)} for all cars)`}
        </span>
    </>
                                },
                                {
                                    value: 'payDefer',
                                    content:
    <>
        <span>{messages.payDefer}</span>
        <span data-testid="text-defer" className="btn-secondary-description">
            {getDeferText(payments)}
        </span>
    </>
                                }
                            ]
                        } />
                    <HDInfoCard className="u-margin-bottom-big">
                        <img src={TipCirclePurple} alt="tip icon" />
                        <p style={{ margin: 0 }}>
                            {messages.infoCardContent}
                        </p>
                    </HDInfoCard>
                    <HDButton
                        webAnalyticsEvent={{ event_action: messages.continueRedirect }}
                        id="continue-to-summary-button"
                        variant="btnprimary"
                        label={null}
                    >
                        {messages.continueToSummary}
                    </HDButton>
                </Col>
            </Row>
        </Container>
    );
}

HDDeferPaymentPage.propTypes = {
    payments: PropTypes.arrayOf(PropTypes.shape({
        dueDate: PropTypes.string,
        amount: PropTypes.number
    })),
};

HDDeferPaymentPage.defaultProps = {
    payments: [{
        dueDate: 'today',
        amount: 458.50
    }, {
        dueDate: '15/12/2020',
        amount: 301.40
    }, {
        dueDate: '02/02/2021',
        amount: 237.16
    }]
};
