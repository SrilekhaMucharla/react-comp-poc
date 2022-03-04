// react
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';

// Hastings
import { HDLabelRefactor } from 'hastings-components';
import { AnalyticsHDButton as HDButton } from '../../../web-analytics';
import * as messages from './HDDriverScanPage.messages';

const HDCameraDisabled = (props) => {
    const { handleForward, handleBackward } = props;
    return (
        <Container className="camera-disabled">
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="camera-disabled__title-label"
                                Tag="h2"
                                text={messages.whoops}
                                size="lg" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="camera-disabled__paragraph-label"
                                Tag="p"
                                text={messages.whoopsP1}
                                size="xs" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="camera-disabled__paragraph-label"
                                Tag="p"
                                text={messages.whoopsP2}
                                size="xs" />

                        </Col>
                    </Row>
                    <Row className="buttons">
                        <Col tiny={12} md="auto">
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.whoops }}
                                size="lg"
                                name="try-again"
                                label={messages.tryAgainLabel}
                                onClick={handleBackward}
                                className="camera-disabled__try-again-button"
                                id="try-again-button" />

                        </Col>
                        <Col tiny={12} md={5}>
                            <HDButton
                                webAnalyticsEvent={{ event_action: messages.whoops }}
                                className="camera-disabled__continue-without-scan hd-btn-secondary btn-block"
                                size="lg"
                                name="continue"
                                label={messages.continueLabel}
                                onClick={handleForward}
                                id="continue-button" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

HDCameraDisabled.propTypes = {
    handleForward: PropTypes.func.isRequired,
    handleBackward: PropTypes.func.isRequired
};

export default HDCameraDisabled;
