import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDModal as HDModal } from '../../web-analytics';
import * as messages from './HDMultiCarMilestonePage.messages';
import { pageMetadataPropTypes } from '../../constant/propTypes';

const DeleteVehicleModal = ({
    onCancel, onConfirm, onClose, show, pageMetadata, hideClose
}) => (
    <HDModal
        webAnalyticsView={{ ...pageMetadata, page_section: messages.removeVehicle }}
        webAnalyticsEvent={{ event_action: messages.removeVehicle }}
        customStyle="rev-button-order"
        id="remove-vehicle-modal"
        show={show}
        headerText={messages.areYouSure}
        cancelLabel={messages.goBack}
        confirmLabel={messages.yes}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onClose={onClose}
        hideClose={hideClose}
    >
        <p className="mb-5">{messages.removedCar}</p>
    </HDModal>
);

DeleteVehicleModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    hideClose: PropTypes.bool,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

DeleteVehicleModal.defaultProps = {
    show: false,
    hideClose: false
};

export default DeleteVehicleModal;
