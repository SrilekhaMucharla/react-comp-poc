import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import * as helper from './HDCustomizeQuoteBreakDownCoverHelper';
import * as message from './HDCustomizeQuoteBreakDownCoverPage.messages';
import RACImage from '../../../assets/images/wizard-images/RAC.png';
import VehicleImage from '../../../assets/images/wizard-images/RAC_Vehicle.png';
import { pageMetadataPropTypes } from '../../../constant/propTypes';


const HDCustomizeQuoteBreakDownCoverOverlay = ({
    trigger, className, pageMetadata
}) => {
    return (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${message.ancillaries} - ${message.breakDownCoverHeader}` }}
            webAnalyticsEvent={{ event_action: `${message.ancillaries} - ${message.breakDownCoverHeader}` }}
            id="search"
            labelText=""
            overlayButtonIcon={trigger}
            customStyle="break-down-overlay"
            className={className}
        >
            <img
                src={RACImage}
                alt="RAC"
                className="mb-3 mb-md-4" />
            <HDLabelRefactor
                Tag="h2"
                text={message.breakDownCoverHeader}
                id="break-down-overlay-rac-header-label" />
            <div>{message.breakDownCoverDescription}</div>
            <img
                src={VehicleImage}
                alt="Jeep"
                className="w-100 my-4" />
            {helper.getOverlayQuestionAnswer.map((item) => (
                <div key={item.question}>
                    <HDLabelRefactor Tag="h5" text={item.question} />
                    <p>{item.answer}</p>
                    {item.secondaryAnswer && (
                        <p>{item.secondaryAnswer}</p>
                    )}
                </div>
            ))}
        </HDOverlayPopup>
    );
};

HDCustomizeQuoteBreakDownCoverOverlay.propTypes = {
    trigger: PropTypes.node.isRequired,
    className: PropTypes.string,
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};

HDCustomizeQuoteBreakDownCoverOverlay.defaultProps = {
    className: ''
};

export default HDCustomizeQuoteBreakDownCoverOverlay;
