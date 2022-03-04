import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor,
    HDPlaceholderWithHeader
} from 'hastings-components';
import PropTypes from 'prop-types';
import {
    AnalyticsHDOverlayPopup as HDOverlayPopup,
} from '../../../web-analytics';
import * as messages from './HDOurFees.messages';
import HDOurFeesOverlay from './HDOurFeesOverlay';

const HDOurFees = ({ pageMetadata }) => {
    const feesTableData = [
        { type: messages.policyone, fee: messages.twenty },
        { type: messages.policytwo, fee: messages.zero },
        { type: messages.policythree, fee: messages.fourtyfive },
        { type: messages.policyfour, fee: messages.twenty },
        { type: messages.policyfive, fee: messages.thirty },
        { type: messages.policysix, fee: messages.twelve },
    ];

    return (
        <HDPlaceholderWithHeader
            title={(
                <HDLabelRefactor
                    Tag="h2"
                    text={messages.ourfees}
                    className="my-0" />
            )}
            theme="dark-header"
        >
            <Row>
                <Col className="our-fees__content">
                    <p>{messages.feesContentOne}</p>
                    <p className="mb-4">{messages.feesContentTwo}</p>
                    <table className="our-fees__content__table">
                        <thead>
                            <tr>
                                <th className="our-fees__content__table__th font-bold text-md-lg">{messages.typeoffee}</th>
                                <th className="our-fees__content__table__th font-medium text-right text-md-lg">{messages.fee}</th>
                            </tr>
                        </thead>
                        <tbody className="our-fees__content__table__body">
                            {feesTableData.map(({ type, fee }, rowIndex) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <tr className="our-fees__content__table__body__tr" key={rowIndex}>
                                    <td className="our-fees__content__table__td">{type}</td>
                                    <td className="our-fees__content__table__td text-right font-bold">{fee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <HDOverlayPopup
                        webAnalyticsView={{ ...pageMetadata, page_section: messages.ourfees }}
                        webAnalyticsEvent={{ event_action: messages.ourfees }}
                        id="our-fees-all-fees-overlay"
                        showButtons={false}
                        overlayButtonIcon={(
                            <HDLabelRefactor
                                Tag="a"
                                text={messages.seeall}
                                className="my-3 mt-md-4 mb-md-0" />
                        )}
                    >
                        <HDOurFeesOverlay />
                    </HDOverlayPopup>
                </Col>
            </Row>
        </HDPlaceholderWithHeader>
    );
};

HDOurFees.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

export default HDOurFees;
