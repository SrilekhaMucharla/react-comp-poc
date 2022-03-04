/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import PropTypes from 'prop-types';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics/index';
import * as messages from './HDVoluntaryExcessPopup.messages';
import InfoIcon from '../HDCustomizeQuoteSummaryPage/svg/InfoIcon';

const HDVoluntaryExcessPopup = ({ pageMetadata }) => (
    <HDOverlayPopup
        webAnalyticsView={{ ...pageMetadata, page_section: messages.mainHeader }}
        webAnalyticsEvent={{ event_action: messages.mainHeader }}
        id="popup-voluntary-excess"
        overlayButtonIcon={<InfoIcon width="27" height="27" color="#0085ff" />}
        labelText={messages.mainHeader}
    >
        <Row className="voluntary-excess__container">
            <Col>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            Tag="p"
                            className="voluntary-excess__subheader"
                            text={messages.headerDescription} />
                        <HDLabelRefactor
                            Tag="p"
                            className="voluntary-excess__subheader"
                            text={messages.headerDescription1} />
                        <HDLabelRefactor
                            Tag="p"
                            className="voluntary-excess__subheader"
                            text={messages.headerDescription2} />
                    </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__question"
                            text={messages.voluntaryExcessText}
                            Tag="h5" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__answer"
                            text={messages.voluntaryExcessAnsText}
                            Tag="p" />
                    </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__question"
                            text={messages.compulsoryExcessText}
                            Tag="h5" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__answer"
                            text={messages.compulsoryExcessAnsText}
                            Tag="p" />
                    </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__question"
                            text={messages.inShortText}
                            Tag="h5" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            className="voluntary-excess__answer"
                            text={messages.inShortAnsText}
                            Tag="p" />
                    </Col>
                </Row>
            </Col>
        </Row>
    </HDOverlayPopup>
);

HDVoluntaryExcessPopup.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default HDVoluntaryExcessPopup;
