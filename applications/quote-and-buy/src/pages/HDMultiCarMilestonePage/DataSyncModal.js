import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { AnalyticsHDModal as HDModal } from '../../web-analytics';
import * as messages from './HDMultiCarMilestonePage.messages';
import { pageMetadataPropTypes } from '../../constant/propTypes';

const DataSyncModal = ({
    onCancel, onConfirm, onClose, show, pageMetadata, hideClose, vehicleDetails, vehicleName
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.areYouSure }}
        webAnalyticsEvent={{ event_action: messages.areYouSure }}
        customStyle="rev-button-order footer-btns-w-100"
        id="data-sync-modal"
        show={show}
        headerText={messages.areYouSure}
        cancelLabel={messages.goBack}
        confirmLabel={messages.yesImSure}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
        hideClose={hideClose}
    >
        <p className="mb-4 subHeaderText">{messages.subHeaderText}</p>
        <Row>
            <Col>
                <div className="completed-info-card__main-text car">{vehicleDetails}</div>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className="completed-info-card__additional-text mt-1">{vehicleName}</div>
            </Col>
        </Row>
        <p className="mb-4 mt-4 innerParagraphText">{messages.innerParagraphText}</p>
    </HDModal>
);

DataSyncModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    hideClose: PropTypes.bool,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired,
    vehicleDetails: PropTypes.string.isRequired,
    vehicleName: PropTypes.string.isRequired,
};

DataSyncModal.defaultProps = {
    show: false,
    hideClose: false
};

export default DataSyncModal;
