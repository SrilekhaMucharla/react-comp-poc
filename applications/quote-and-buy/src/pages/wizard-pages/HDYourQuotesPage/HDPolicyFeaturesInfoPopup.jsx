/* eslint-disable react/no-array-index-key */
import {
    HDAccordionRefactor,
    HDLabelRefactor
} from 'hastings-components';
import React from 'react';
import PropTypes from 'prop-types';
import { AnalyticsHDOverlayPopup as HDOverlayPopup } from '../../../web-analytics/index';
import './HDPolicyFeaturesInfoPopup.scss';
import * as messages from './HDPolicyFeaturesInfoPopup.messages';

const HDPolicyFeaturesInfoPopup = ({ pageMetadata }) => {
    const renderWindscreenContent = () => (
        <div className="windsreen-content">
            <div className="description">
                {messages.windscreenCoverDescription}
            </div>
            <h3>{messages.whatCoversHeader}</h3>
            <ul className="fa-ul">
                {messages.windsreenCovers.map((cover, i) => (
                    <li key={i}>
                        <span className="fa-li"><i className="fas fa-check" /></span>
                        {cover}
                    </li>
                ))}
            </ul>
            <h3>{messages.whatDoesntCoverHeader}</h3>
            <ul className="fa-ul">
                {messages.windscreenNotCovers.map((notCover, i) => (
                    <li key={i}>
                        <span className="fa-li"><i className="fas fa-times" /></span>
                        {notCover}
                    </li>
                ))}
            </ul>
        </div>
    );

    const getCards = () => ([
        { header: messages.windscreenCoverLabel, content: renderWindscreenContent() },
        { header: messages.roadsideAssistanceLabel, content: <p>{messages.content}</p> },
        { header: messages.uninsuredDriverPromiseLabel, content: <p>{messages.content}</p> },
        { header: messages.legalCoverLabel, content: <p>{messages.content}</p> },
        { header: messages.telematicsLabel, content: <p>{messages.content}</p> }
    ]);

    return (
        <HDOverlayPopup
            id="popup-policy-features"
            webAnalyticsView={{ ...pageMetadata, page_section: messages.mainHeader }}
            webAnalyticsEvent={{ event_action: messages.mainHeader }}
            overlayButtonIcon={<i className="fas fa-info-circle" />}
        >
            <HDLabelRefactor text={messages.mainHeader} Tag="h2" />
            <div className="policy-features-description">
                {messages.mainDescription}
            </div>
            <HDAccordionRefactor cards={getCards()} />
        </HDOverlayPopup>
    );
};

HDPolicyFeaturesInfoPopup.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default HDPolicyFeaturesInfoPopup;
