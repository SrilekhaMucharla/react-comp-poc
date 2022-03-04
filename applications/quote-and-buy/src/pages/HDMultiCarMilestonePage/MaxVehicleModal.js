import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal } from '../../web-analytics';
import * as messages from './HDMultiCarMilestonePage.messages';
import { pageMetadataPropTypes } from '../../constant/propTypes';

const MaxVehicleModal = ({
    onCancel, onConfirm, onClose, show, pageMetadata
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.reachedMax }}
        webAnalyticsEvent={{ event_action: messages.reachedMax }}
        id="maximum-vehicle-count-modal"
        show={show}
        headerText={messages.important}
        cancelLabel={messages.noGoBack}
        confirmLabel={messages.ok}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
    >
        <span>{messages.reachedMax}</span>
    </HDModal>
);

MaxVehicleModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

MaxVehicleModal.defaultProps = {
    show: false
};

export default MaxVehicleModal;
