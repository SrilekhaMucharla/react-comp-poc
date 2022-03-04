import {
    HDLabelRefactor, HDPlaceholderWithHeader, HDQuoteInfoRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import BlueTick from '../../../assets/images/icons/blue-tick-icon.svg';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import HDInsurersOverlay from './HDInsurersOverlay';
import * as messages from './HDOtherThingsPage.messages';

// import HDInsurersOverlay from './HDInsurersOverlay';
// import * as messages from './HDOtherThingsPage.messages';

const HDOtherThings = ({ pageMetadata, isOnlineProductType }) => {
    const displayParagraphs = (paragraphs) => (
        paragraphs.map((paragraph, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i}>{paragraph}</p>
        )));

    return (
        <HDPlaceholderWithHeader
            title={(
                <HDLabelRefactor
                    Tag="h2"
                    text={messages.header}
                    className="my-0" />
            )}
            theme="dark-header"
        >
            <Row>
                <Col className="other-things__content">
                    {
                        isOnlineProductType && (
                            <>
                                <HDLabelRefactor
                                    Tag="h4"
                                    text={messages.onlineInsuranceHeader}
                                    className="mb-3" />
                                <p>{messages.onlineInsuranceParaOne}</p>
                                {messages.onlineInsuranceList.map((item) => (
                                    <HDLabelRefactor
                                        Tag="p"
                                        text={item}
                                        icon={<img src={BlueTick} alt={messages.tick} />}
                                        iconPosition="l"
                                        className="mb-2" />
                                ))}
                                <p>{messages.onlineInsuranceParaThree}</p>
                            </>
                        )
                    }
                    <HDLabelRefactor
                        Tag="h4"
                        text={messages.automaticRenewalHeader}
                        className="mb-3" />
                    <p>{messages.automaticRenewalParaOne}</p>
                    <p>{messages.automaticRenewalParaTtwo}</p>
                    <p>{messages.automaticRenewalParaThree}</p>
                    <HDLabelRefactor
                        Tag="h4"
                        text={messages.cancel}
                        className="margin-top-lg mb-3" />
                    <p>{messages.cancelcontentone}</p>
                    <p>{messages.cancelcontenttwo}</p>
                    <p>{messages.cancelcontentthree}</p>
                    <HDLabelRefactor
                        Tag="h4"
                        text={messages.insurer}
                        className="margin-top-lg mb-3" />
                    <p>{messages.insurercontentone}</p>
                    <p>{messages.insurercontenttwo}</p>
                    <div className="overlay-insurer-container">
                        <HDOverlayPopup
                            id="other-things-full-insurers-overlay"
                            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.summary} - ${messages.insurer}` }}
                            webAnalyticsEvent={{ event_action: `${messages.summary} - ${messages.insurer}` }}
                            showButtons={false}
                            overlayButtonIcon={(
                                <HDLabelRefactor
                                    Tag="a"
                                    text={messages.seeall} />
                            )}
                        >
                            <HDInsurersOverlay />
                        </HDOverlayPopup>
                    </div>
                    <HDLabelRefactor
                        Tag="h4"
                        text={messages.docs}
                        className="margin-top-lg mb-3" />
                    <p>{messages.docscontentOne}</p>
                    <HDLabelRefactor
                        className="mt-5 mb-3"
                        Tag="h4"
                        text={messages.cpaHeader} />
                    <Row className="payment-page__cpa-content">
                        <Col>
                            {displayParagraphs(messages.cpaContent)}
                        </Col>
                    </Row>
                    <HDQuoteInfoRefactor>
                        {messages.cpaExtraInfoContent}
                    </HDQuoteInfoRefactor>

                </Col>
            </Row>
        </HDPlaceholderWithHeader>
    );
};


HDOtherThings.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    isOnlineProductType: PropTypes.bool.isRequired,
};

export default HDOtherThings;
