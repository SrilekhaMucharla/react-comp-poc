import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal } from '../../../web-analytics';
import * as messages from './HDAddAnotherDriver.messages';

const DeleteDriverModal = ({
    onCancel, onConfirm, onClose, driverName, show, pageMetadata
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.removeDriver }}
        webAnalyticsEvent={{ event_action: messages.removeDriver }}
        id="remove-driver-modal"
        show={show}
        headerText={messages.areYouSure}
        cancelLabel={messages.goBack}
        confirmLabel={messages.yes}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
    >
        <span>
    Are you sure you want to remove
            {driverName ? <b>{` ${driverName}`}</b> : ' this driver'}
    ?
        </span>
    </HDModal>
);

DeleteDriverModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    driverName: PropTypes.string,
    show: PropTypes.bool,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

DeleteDriverModal.defaultProps = {
    driverName: '',
    show: false
};

export default DeleteDriverModal;
