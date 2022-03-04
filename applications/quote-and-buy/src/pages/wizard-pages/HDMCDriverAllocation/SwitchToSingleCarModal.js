import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal } from '../../../web-analytics';
import * as messages from './HDMCDriverAllocation.messages';
import { pageMetadataPropTypes } from '../../../constant/propTypes';

const SwitchToSingleCarModal = ({
    onCancel, onConfirm, onClose, show, pageMetadata
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.switchToSingleCarMessages }}
        webAnalyticsEvent={{ event_action: messages.switchToSingleCarMessages }}
        id="switch-to-single-car-modal"
        customStyle="footer-btns-w-100 rev-button-order"
        show={show}
        headerText={messages.areYouSure}
        cancelLabel={messages.noGoBack}
        confirmLabel={messages.continueBtnOneCarLabel}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
        hideClose
    >
        <span>
            {messages.switchToSingleCarMessages}
        </span>
    </HDModal>
);

SwitchToSingleCarModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

SwitchToSingleCarModal.defaultProps = {
    show: false
};

export default SwitchToSingleCarModal;
