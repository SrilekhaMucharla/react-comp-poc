import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HDInfoCardRefactor } from 'hastings-components';
import * as messages from './HDMCYourExcessPopup.messages';
import InfoIcon from '../HDCustomizeQuoteSummaryPage/svg/InfoIcon';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import HDExcessTableRefactor, { ExcessProps } from '../HDCustomizeQuoteSummaryPage/components/HDExcessTableRefactor';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import useNareApplicable from '../__helpers__/nareHelper';

// Couldn't find OverlayPopup label that could be put above close icon
// Since OverlayPopup is used in SC, I didn't want to modify it, leaving below styles to copy and meet Acceptence Criteria of 296044

const overlayPopupLabelElementStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '40px',
    width: '100%',
    backgroundColor: '#01355a',
    padding: '8px 24px',
};

const HDMCYourExcessPopup = ({
    pageMetadata, registrationNumber, periodStartDate, branchCode, pcCurrentDate, className, drivers, globalExcesses
}) => {
    const overlayPopupCarLabelElement = <div style={overlayPopupLabelElementStyles}><span className="reg-num">{registrationNumber}</span></div>;
    const allExcesses = [];
    const excessInfoMessage = (branchCode === messages.HE) ? messages.excessMessageHE : messages.excessMessage;
    drivers.map(({ excesses }) => {
        if (allExcesses.find((el) => (el.excessName === excesses.excessName)) === undefined) return allExcesses.push(excesses);
        return null;
    });
    return (
        <HDOverlayPopup
            className={className}
            webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.yourExcess}` }}
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.yourExcess}` }}
            id="popup-mc-your-excess"
            overlayButtonIcon={<InfoIcon width="30" height="30" color="#0085ff" />}
        >
            {overlayPopupCarLabelElement}
            <h2>{messages.yourExcess}</h2>
            <Row className="popup-your-excess__tables">
                <Col>
                    <Row>
                        <Col>
                            {(drivers && drivers.length > 0 && allExcesses && allExcesses.length > 0) && allExcesses.map((excess) => (
                                <HDExcessTableRefactor
                                    excess={excess}
                                    drivers={drivers}
                                    tableColumnOne={messages.compulsory}
                                    tableColumnTwo={messages.voluntary} />
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {(globalExcesses && globalExcesses.length > 0) && globalExcesses.map((excess) => (
                                <HDExcessTableRefactor
                                    className={(excess.excessName === messages.windowGlassText) ? 'popup-your-excess__windowscreen' : ''}
                                    drivers={[{ id: 1, name: messages.forAllDriversHeader }]}
                                    tableColumnOne={(excess.excessName === messages.windowGlassText) ? messages.repair : messages.compulsory}
                                    tableColumnTwo={(excess.excessName === messages.windowGlassText) ? messages.replacement : messages.voluntary}
                                    hideTotalColumn={(excess.excessName === messages.windowGlassText)}
                                    excess={excess} />
                            ))}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                {(periodStartDate && pcCurrentDate && useNareApplicable(periodStartDate, pcCurrentDate)
                && (
                    <HDInfoCardRefactor
                        id="excess-info-card"
                        image={tipCirclePurple}
                        paragraphs={[excessInfoMessage]}
                        theme="light"
                        size="thin"
                        className="mt-3 mt-md-4 excess-info-card" />
                ))}
            </Row>
            <h3>{messages.yourExcessExplained}</h3>
            <p className="popup-your-excess__description">{messages.yourExcessExplainedParagraph1}</p>
            <p className="popup-your-excess__description">{messages.yourExcessExplainedParagraph2}</p>
            <p className="popup-your-excess__description">{messages.yourExcessExplainedParagraph3}</p>
            <h3>{messages.voluntaryExcess}</h3>
            <p className="popup-your-excess__description">{messages.voluntaryExcessParagraph}</p>
            <h3>{messages.compulsoryExcess}</h3>
            <p className="popup-your-excess__description">{messages.compulsoryExcessParagraph}</p>
            <h3>{messages.inShort}</h3>
            <p className="popup-your-excess__description">{messages.inShortParagraph}</p>
        </HDOverlayPopup>
    );
};

HDMCYourExcessPopup.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    registrationNumber: PropTypes.string,
    periodStartDate: PropTypes.shape({
        year: PropTypes.number,
        month: PropTypes.number,
        day: PropTypes.number
    }),
    branchCode: PropTypes.string,
    className: PropTypes.string,
    drivers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        excesses: PropTypes.arrayOf(ExcessProps).isRequired
    })).isRequired,
    globalExcesses: PropTypes.arrayOf(ExcessProps).isRequired
};

HDMCYourExcessPopup.defaultProps = {
    registrationNumber: null,
    className: '',
    periodStartDate: null,
    branchCode: ''
};

export default HDMCYourExcessPopup;
