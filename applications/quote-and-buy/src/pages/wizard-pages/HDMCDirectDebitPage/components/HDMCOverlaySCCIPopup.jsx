import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import { Row, Col } from 'react-bootstrap';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../../web-analytics';
import * as messages from './HDMCOverlaySCCIPopup.messages';
import { getPriceWithCurrencySymbol } from '../../../../common/utils';
import { pageMetadataPropTypes } from '../../../../constant/propTypes';

const HDMCOverlaySCCIPopup = ({
    initialPayment,
    noOfPayment, costOfPayment,
    overlayButtonIcon,
    pageMetadata,
    creditAgreementData
}) => {
    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.scciOverlayTitle }}
            webAnalyticsEvent={{ event_action: messages.scciOverlayTitle }}
            id="scci-overlay"
            className="scci_popup_overlay"
            overlayButtonIcon={overlayButtonIcon}
        >
            <Row className="overlay-header">
                <Col>
                    <HDLabelRefactor className="my-0" Tag="h2" text={messages.scciOverlayTitle} />
                </Col>
                <Col xs="auto" className="align-self-end text-center direct-debit-seci-overlay__print-col">
                    <div className="direct-debit-seci-overlay__print-col__content">
                        <i className="fa fa-print direct-debit-seci-overlay__print-col__icon" aria-hidden="true" />
                        <div className="icon-text text-regular">{messages.print}</div>
                    </div>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <HDLabelRefactor className="my-0" Tag="h5" text={messages.scciOverlaySubHeader} />
                </Col>
            </Row>
            <Row className="scci_description">
                <Col>
                    <HDLabelRefactor Tag="p" text={messages.scciHeaderDescription} />
                </Col>
            </Row>
            <Row className="scci_contact_details_header">
                <Col>
                    <HDLabelRefactor Tag="p" className="scci_info_header" text={messages.scciFirstParagraphHeader} />
                </Col>
            </Row>
            <Row className="scci_contact_details_content">
                <Col>
                    <HDLabelRefactor Tag="p" text={messages.scciFirstParagraphContent} />
                </Col>
            </Row>
            <Row className="scci_key_features_header">
                <Col>
                    <HDLabelRefactor Tag="p" className="scci_info_header" text={messages.scciSecondParagraphHeader} />
                </Col>
            </Row>
            <Row className="scci_key_features_content">
                <Col>
                    {messages.scciKeyFeaturesContent(getPriceWithCurrencySymbol({ amount: creditAgreementData.initialPayment, currency: 'gbp' }),
                        creditAgreementData.instalmentsCount - 1,
                        getPriceWithCurrencySymbol({ amount: creditAgreementData.subsequentPayment, currency: 'gbp' })).map((paragraph) => <p>{paragraph}</p>)}
                </Col>
            </Row>
            <Row className="scci_cost_of_credit_header">
                <Col>
                    <HDLabelRefactor Tag="p" className="scci_info_header" text={messages.scciThirdParagraphHeader} />
                </Col>
            </Row>
            <Row className="scci_cost_of_credit_content">
                <Col>
                    {messages.scciCreditCostContent.map((paragraph) => <p>{paragraph}</p>)}
                </Col>
            </Row>
            <Row className="scci_legal_aspects_header">
                <Col>
                    <HDLabelRefactor className="scci_info_header" Tag="p" text={messages.scciForthParagraphHeader} />
                </Col>
            </Row>
            <Row className="scci_legal_aspects_content">
                <Col>
                    {messages.scciImportantLegalAspectsContent.map((paragraph) => <p>{paragraph}</p>)}
                </Col>
            </Row>
            <Row className="scci_aditional_information_header">
                <Col>
                    <HDLabelRefactor className="scci_info_header" Tag="p" text={messages.fifthParagraphHeader} />
                </Col>
            </Row>
            <Row className="scci_aditional_information_content">
                <Col>
                    <HDLabelRefactor Tag="p" text={messages.fifthParagraphSectionA} />
                </Col>
            </Row>
            <Row className="scci_aditional_information_content">
                <Col>
                    <HDLabelRefactor Tag="p" text={messages.fifthParagraphSectionB} />
                </Col>
            </Row>
            <Row className="scci_aditional_information_content">
                <Col>
                    <HDLabelRefactor Tag="p" text={messages.fifthParagraphSectionC} />
                </Col>
            </Row>
        </HDOverlayPopup>
    );
};

HDMCOverlaySCCIPopup.propTypes = {
    initialPayment: PropTypes.number.isRequired,
    noOfPayment: PropTypes.number.isRequired,
    costOfPayment: PropTypes.number.isRequired,
    overlayButtonIcon: PropTypes.node.isRequired,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    creditAgreementData: PropTypes.shape({
        amountPayable: PropTypes.number,
        aprRate: PropTypes.number,
        currencyCode: PropTypes.string,
        initialPayment: PropTypes.number,
        instalmentsCount: PropTypes.number,
        interestRate: PropTypes.number,
        subsequentPayment: PropTypes.number,
        totalPrice: PropTypes.number,
    }).isRequired,
};

export default HDMCOverlaySCCIPopup;
