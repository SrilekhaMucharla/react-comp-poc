import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor, HDInfoCardRefactor } from 'hastings-components';
import { Row, Col } from 'react-bootstrap';
import HDExcessTable from './HDExcessTable';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import * as messages from './HDYourExcessFees.messages';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { pageMetadataPropTypes } from '../../../constant/propTypes';
import useNareApplicable from '../__helpers__/nareHelper';


const HDYourExcessFees = ({
    branchCode, accidentalDamage, driverList, theftDamage, windScreenDamage, periodStartDate, pcCurrentDate, pageMetadata
}) => {
    let accList = [];
    if (accidentalDamage && accidentalDamage.length > 0) {
        accList = driverList.map((driver) => {
            return {
                excessName: driver.displayName,
                compulsoryAmount: driver.youngAndInExpExcess + accidentalDamage[0].compulsoryAmount,
                voluntaryAmount: accidentalDamage[0].voluntaryAmount
            };
        });
    }
    const excessInfoMessage = (branchCode === messages.HE) ? messages.excessMessageHE : messages.excessMessage;

    const tooltipOverlay = () => (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: messages.overlayHeaderOne }}
            webAnalyticsEvent={{ event_action: messages.overlayHeaderOne }}
            id="your-excess-overlay"
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <HDLabelRefactor Tag="h4" text={messages.overlayHeaderOne} className="margin-bottom-md" />
            <p>{messages.overlayBodyOne}</p>
            <p>{messages.overlayBodyTwo}</p>
            <p>{messages.overlayBodyThree}</p>
            <HDLabelRefactor Tag="h5" text={messages.overlayHeaderTwo} className="mt-4" />
            <p>{messages.overlayBodyVoluntaryExcess}</p>
            <HDLabelRefactor Tag="h5" text={messages.overlayHeaderThree} className="mt-4" />
            <p>{messages.overBodyCompulsoryExcess}</p>
            <HDLabelRefactor Tag="h5" text={messages.overlayHeaderFour} className="mt-4" />
            <p>{messages.overBodyDesc}</p>
        </HDOverlayPopup>
    );

    return (
        <Row className="your-excess-details-container">
            <Col className="px-md-0">
                <HDLabelRefactor
                    Tag="h2"
                    text={messages.headerText}
                    id="your-excess-details-header-label" />
                <p>{messages.textPart1}</p>
                <HDLabelRefactor
                    text={messages.excessQuestion}
                    Tag="span"
                    icon={tooltipOverlay()}
                    iconPosition="r"
                    className="your-excess-details__more-info"
                    id="your-excess-details-more-info-label" />
                {(accidentalDamage && accidentalDamage.length > 0) && (
                    <HDExcessTable
                        name={messages.tableHeaderOne}
                        tableColumnOne={messages.Compulsory}
                        tableColumnTwo={messages.Voluntary}
                        excesses={accList}
                        className="your-excess-details__excess-table" />
                )}
                <HDExcessTable
                    name={messages.tableHeaderTwo}
                    tableColumnOne={messages.Compulsory}
                    tableColumnTwo={messages.Voluntary}
                    excesses={theftDamage}
                    className="your-excess-details__excess-table" />
                {(windScreenDamage && windScreenDamage.length > 0)
                    && (
                        <HDExcessTable
                            name={messages.tableHeaderThree}
                            tableColumnOne={messages.Repair}
                            tableColumnTwo={messages.Replacement}
                            excesses={windScreenDamage}
                            hideTotalColumn
                            className="your-excess-details__excess-table" />
                    )}
                {periodStartDate && pcCurrentDate && useNareApplicable(periodStartDate, pcCurrentDate) ? (
                    <HDInfoCardRefactor
                        id="your-excess-details-double-excess-info-card"
                        image={tipCirclePurple}
                        paragraphs={[excessInfoMessage]}
                        theme="light"
                        size="thin"
                        className="margin-top-lg mb-3" />
                ) : (branchCode === messages.HE && (
                    <HDInfoCardRefactor
                        id="your-excess-details-double-excess-info-card"
                        image={tipCirclePurple}
                        paragraphs={[messages.infoTipText]}
                        theme="light"
                        size="thin"
                        className="margin-top-lg mb-3" />
                ))}
            </Col>
        </Row>
    );
};

HDYourExcessFees.defaultProps = {
    periodStartDate: null
};

HDYourExcessFees.propTypes = {
    accidentalDamage: PropTypes.arrayOf(PropTypes.shape({
        compulsoryAmount: PropTypes.number,
        voluntaryAmount: PropTypes.number
    })).isRequired,
    theftDamage: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        compulsoryAmount: PropTypes.number,
        voluntaryAmount: PropTypes.number
    })).isRequired,
    windScreenDamage: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        compulsoryAmount: PropTypes.number,
        voluntaryAmount: PropTypes.number
    })).isRequired,
    branchCode: PropTypes.string.isRequired,
    driverList: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string,
    })).isRequired,
    periodStartDate: PropTypes.shape({
        year: PropTypes.number,
        month: PropTypes.number,
        day: PropTypes.number
    }),
    pageMetadata: PropTypes.shape(pageMetadataPropTypes).isRequired
};


export default HDYourExcessFees;
