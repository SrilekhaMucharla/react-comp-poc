import { Col, Row } from 'react-bootstrap';
import { HDLabelRefactor, HDInfoCardRefactor } from 'hastings-components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import HDExcessTableRefactor, { ExcessProps } from './components/HDExcessTableRefactor';
import * as messages from './HDYourExcessPopup.messages';
import InfoIcon from './svg/InfoIcon';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import useNareApplicable from '../__helpers__/nareHelper';

const HDYourExcessPopup = ({
    drivers, globalExcesses, customizeSubmissionVM, pcCurrentDate, pageMetadata, className
}) => {
    const allExcesses = [];
    const branchCode = _.get(customizeSubmissionVM, 'value.quote.branchCode', '');
    const periodStartDate = _.get(customizeSubmissionVM, 'value.periodStartDate', '');
    const excessInfoMessage = (branchCode === messages.HE) ? messages.excessMessageHE : messages.excessMessage;

    drivers.map(({ excesses }) => {
        if (allExcesses.find((el) => (el.excessName === excesses.excessName)) === undefined) return allExcesses.push(excesses);
        return null;
    });
    return (
        <HDOverlayPopup
            webAnalyticsEvent={{ event_action: `${messages.customizeQuote} - ${messages.mainHeader}` }}
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.customizeQuote} - ${messages.mainHeader}` }}
            id="popup-your-excess"
            className={`popup-your-excess-container${(className) ? ` ${className}` : ''}`}
            overlayButtonIcon={<InfoIcon width="20" height="20" color="#0085ff" />}
        >
            <Row className="popup-your-excess">
                <Col>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h2"
                                text={messages.mainHeader}
                                size="lg" />
                        </Col>
                    </Row>
                    <Row className="popup-your-excess__tables">
                        <Col>
                            <Row>
                                <Col>
                                    {(drivers && drivers.length > 0 && allExcesses && allExcesses.length > 0) && allExcesses.map((excess) => (
                                        <HDExcessTableRefactor
                                            excess={excess}
                                            drivers={drivers}
                                            tableColumnOne={messages.Compulsory}
                                            tableColumnTwo={messages.Voluntary} />
                                    ))}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {(globalExcesses && globalExcesses.length > 0) && globalExcesses.map((excess) => (
                                        <HDExcessTableRefactor
                                            className={(excess.excessName === messages.windowGlassText) ? 'popup-your-excess__windowscreen' : ''}
                                            drivers={[{ id: 1, name: messages.forAllDriversHeader }]}
                                            tableColumnOne={(excess.excessName === messages.windowGlassText) ? messages.Repair : messages.Compulsory}
                                            tableColumnTwo={(excess.excessName === messages.windowGlassText) ? messages.Replacement : messages.Voluntary}
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
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h3"
                                text={messages.overlayHeaderOne} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overlayBodyOne}
                                Tag="p" />
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overlayBodyTwo}
                                Tag="p" />
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overlayBodyThree}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h3"
                                text={messages.overlayHeaderTwo} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overlayBodyVoluntaryExcess}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h3"
                                text={messages.overlayHeaderThree} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overBodyCompulsoryExcess}
                                Tag="p" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                Tag="h3"
                                text={messages.overlayHeaderFour} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                className="popup-your-excess__description"
                                text={messages.overBodyDesc}
                                Tag="p" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </HDOverlayPopup>
    );
};

HDYourExcessPopup.defaultProps = {
    className: null,
    customizeSubmissionVM: null
};

HDYourExcessPopup.propTypes = {
    drivers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        excesses: PropTypes.arrayOf(ExcessProps).isRequired
    })).isRequired,
    globalExcesses: PropTypes.arrayOf(ExcessProps).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
    className: PropTypes.string
};

export default HDYourExcessPopup;
