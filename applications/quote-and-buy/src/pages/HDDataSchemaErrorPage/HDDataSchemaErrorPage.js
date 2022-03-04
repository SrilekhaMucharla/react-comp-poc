import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton
} from '../../web-analytics';
import { HOMEPAGE, OPENING_HOURS } from '../../constant/const';
import { BASENAME } from '../../routes/BaseRouter/RouteConst';
import { MISCELLANEOUS } from '../../customer/directintegrations/faq/epticaMapping';
import * as messages from './HDDataSchemaErrorPage.messages';
import { updateEpticaId as updateEpticaIdAction } from '../../redux-thunk/actions';
import '../../assets/sass-refactor/main.scss';
import EventEmmiter from '../../EventHandler/event';

const HDDataSchemaErrorPage = ({ updateEpticaId }) => {
    const getAmountData = () => {
        const data = {
            amount: null,
            prefix: null,
            text: ''
        };
        return data;
    };

    useEffect(() => {
        window.scroll(0, 0);
        EventEmmiter.dispatch('change', getAmountData());
        updateEpticaId(MISCELLANEOUS);
    }, []);

    const handleGoBackToHomePage = () => {
        window.location.assign(HOMEPAGE);
    };
    const handleGetNewQuote = () => {
        window.location.assign(BASENAME);
    };
    return (
        <div className="data-schema-error-container page-content-wrapper">
            <Container>
                <Row>
                    <Col xs={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
                        <Row className="margin-top-lg">
                            <Col>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.header}
                                    className="mb-3" />
                                <HDLabelRefactor
                                    Tag="p"
                                    text={messages.subHeader} />
                                <HDLabelRefactor
                                    Tag="p"
                                    text={messages.generalOpeningText} />
                            </Col>
                        </Row>
                        {OPENING_HOURS.map(({ days, hours }, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Row key={i} className="time-chart-row">
                                <Col sm={6} md={8}>
                                    <HDLabelRefactor
                                        Tag="p"
                                        text={days} />
                                </Col>
                                <Col sm={6} md={4}>
                                    <HDLabelRefactor
                                        Tag="p"
                                        text={hours}
                                        className="time-chart-hours" />
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col>
                                <Row className="flex-column flex-md-row">
                                    <Col className="get-a-new-quote">
                                        <HDButton
                                            id="new-quote-button"
                                            webAnalyticsEvent={{ event_action: messages.getNewQuote }}
                                            className="w-100 w-md-auto data-schema-error-container--btn"
                                            variant="primary"
                                            size="lg"
                                            data-testid="new-quote-buttton"
                                            label={messages.getNewQuote}
                                            onClick={handleGetNewQuote} />
                                    </Col>
                                    <Col className="invalid-url-navigation">
                                        <HDButton
                                            webAnalyticsEvent={{ event_action: messages.homepageButton }}
                                            id="home-page-button"
                                            className="w-100 w-md-auto data-schema-error-container--btn"
                                            variant="secondary"
                                            size="lg"
                                            data-testid="goto-home-buttton"
                                            label={messages.homepageButton}
                                            onClick={handleGoBackToHomePage} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction
};

HDDataSchemaErrorPage.defaultProps = {
    updateEpticaId: () => {},
};

HDDataSchemaErrorPage.propTypes = {
    updateEpticaId: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(HDDataSchemaErrorPage);
