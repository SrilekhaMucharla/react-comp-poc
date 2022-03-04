import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import React from 'react';
import PropTypes from 'prop-types';
import * as messages from './HDStartDatePopup.messages';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
// import './HDStartDatePopup.scss';
import InfoIcon from './svg/InfoIcon';

const HDStartDatePopup = (props) => {
    const { pageMetadata, className } = props;

    return (
        <HDOverlayPopup
            className={className}
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.mainHeader}` }}
            webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.mainHeader}` }}
            id="popup-start-date"
            overlayButtonIcon={<InfoIcon width="20" height="20" color="#0085ff" />}
        >
            <Row className="popup-start-date">
                <Col>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-start-date__label"
                                Tag="h2"
                                text={messages.mainHeader}
                                size="lg" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-start-date__description"
                                text={messages.paragraphOne}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-start-date__description"
                                Tag="p"
                                text={messages.paragraphTwo} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </HDOverlayPopup>
    );
};

HDStartDatePopup.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    className: PropTypes.string
};

HDStartDatePopup.defaultProps = {
    className: null
};

export default HDStartDatePopup;
