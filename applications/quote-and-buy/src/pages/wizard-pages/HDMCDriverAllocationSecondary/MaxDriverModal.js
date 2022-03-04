import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal } from '../../../web-analytics';
import * as messages from './HDMCDriverAllocationSecondary.messages';

const MaxDriverModal = ({
    onCancel, onConfirm, onClose, show, pageMetadata, hideClose
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.reachedMax }}
        webAnalyticsEvent={{ event_action: messages.reachedMax }}
        id="maximum-driver-count-modal"
        customStyle="rev-button-order"
        show={show}
        headerText={messages.important}
        cancelLabel={messages.noGoBack}
        confirmLabel={messages.ok}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
        hideClose={hideClose}
    >
        <span>{messages.reachedMax}</span>
    </HDModal>
);

MaxDriverModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    hideClose: PropTypes.bool,
};

MaxDriverModal.defaultProps = {
    show: false,
    hideClose: false
};

export default MaxDriverModal;
