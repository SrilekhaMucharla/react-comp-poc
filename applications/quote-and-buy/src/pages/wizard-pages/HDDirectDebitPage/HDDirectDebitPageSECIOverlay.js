/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Row, Col } from 'react-bootstrap';
import PropType from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics';
import * as helper from './HDDirectDebitPageHelper';
import * as message from './HDDirectDebitPage.messages';
import { pageMetadataPropTypes } from '../../../constant/propTypes';

const HDDirectDebitOverlay = ({
    // eslint-disable-next-line react/prop-types
    trigger,
    dataList,
    pageMetadata
}) => {
    const componetRef = useRef();
    const overlayHeader = (
        <Row className="overlay-header">
            <Col>
                <HDLabelRefactor className="my-0" Tag="h2" text={`${message.scciText} ${message.secci}`} />
            </Col>
            <Col xs="auto" className="align-self-end text-center direct-debit-seci-overlay__print-col">
                <ReactToPrint
                    trigger={() => (
                        <div className="direct-debit-seci-overlay__print-col__content">
                            <i className="fa fa-print direct-debit-seci-overlay__print-col__icon" aria-hidden="true" />
                            <div className="icon-text text-regular">{message.print}</div>
                        </div>
                    )}
                    content={() => componetRef.current} />
            </Col>
        </Row>
    );
    return (
        <HDOverlayPopup
            className="direct-debit-seci-overlay"
            webAnalyticsEvent={{ event_action: message.secciOverlay }}
            webAnalyticsView={{ ...pageMetadata, page_section: message.secciOverlay }}
            id="debit"
            overlayButtonIcon={trigger}
        >
            <div className="parent-row" id="parent-row" ref={componetRef}>
                {overlayHeader}
                <Row className="debit-debit-overlay__overlay-sub-header mb-3">
                    <Col>
                        <HDLabelRefactor className="my-0" Tag="h5" text={message.scciOverlaySubHeader} />
                    </Col>
                </Row>
                <div className="debit-debit-overlay__float-none" />
                <Row className="debit-debit-overlay__overlay-short-description">
                    <Col>
                        <HDLabelRefactor Tag="p" text={message.scciSubText} />
                    </Col>
                </Row>
                {helper.getOverlayContent(dataList).map((item, index) => (
                    <Row key={item.heading}>
                        <Col>
                            <div className="debit-debit-overlay__heading font-bold">
                                <span>
                                    {index + 1}
                                    {'. '}
                                </span>
                                <span>
                                    {item.heading}
                                </span>
                            </div>
                            {item.content.map((innerContent) => (
                                <p>
                                    {innerContent}
                                </p>
                            ))}
                        </Col>
                    </Row>
                ))}
            </div>
        </HDOverlayPopup>
    );
};

HDDirectDebitOverlay.PropType = {
    trigger: PropType.node.isRequired,
    dataList: PropType.shape({
        firstPayment: PropType.number,
        elevenMonths: PropType.number
    }).isRequired,
    pageMetadata: PropType.shape(pageMetadataPropTypes).isRequired

};

export default HDDirectDebitOverlay;
