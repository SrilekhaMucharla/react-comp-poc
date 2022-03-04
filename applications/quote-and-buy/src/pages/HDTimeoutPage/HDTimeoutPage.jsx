import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
} from '../../web-analytics';
import { HOMEPAGE } from '../../constant/const';
import { MISCELLANEOUS } from '../../customer/directintegrations/faq/epticaMapping';
import * as messages from './HDTimeoutPage.messages';
import { updateEpticaId as updateEpticaIdAction } from '../../redux-thunk/actions';

const HDTimeoutPage = ({ updateEpticaId }) => {
    useEffect(() => {
        updateEpticaId(MISCELLANEOUS);
    }, []);

    const handleContinueTriggerButton = () => {
        window.location.assign(HOMEPAGE);
    };

    return (
        <div className="page-content-wrapper background-body">
            <Container className="timeout-container">
                <Row>
                    <Col>
                        <HDLabelRefactor Tag="h2" text={messages.header} id="timeout-header-label" />
                        <HDLabelRefactor Tag="p" text={messages.subHeaderOne} id="timeout-sub-header-one-label" />
                        <HDLabelRefactor Tag="p" text={messages.subHeaderTwo} id="timeout-sub-header-two-label" />
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.homepageButton }}
                            id="home-page-button"
                            size="lg"
                            label={messages.homepageButton}
                            className="margin-top-lg"
                            onClick={handleContinueTriggerButton} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const mapDispatchToProps = {
    updateEpticaId: updateEpticaIdAction
};

HDTimeoutPage.defaultProps = {
    updateEpticaId: () => {},
};
HDTimeoutPage.propTypes = {
    updateEpticaId: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(HDTimeoutPage);
