import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { HDLabelRefactor } from 'hastings-components';
import {
    AnalyticsHDButton as HDButton,
} from '../../../web-analytics';
import { getMCError } from '../../../common/utils';
import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE, HOMEPAGE, OPENING_HOURS
} from '../../../constant/const';
import * as messages from './HDMCQuoteDeclinePage.messages';

const HDMCQuoteDeclinePage = ({ mcsubmissionVM }) => {
    const errorObject = getMCError(mcsubmissionVM);
    const quoteId = _.get(mcsubmissionVM, 'mpwrapperNumber.value');
    let quoteDeclineContent = null;
    let eventMessage = '';

    const handleContinueTriggerButton = () => {
        window.location.assign(HOMEPAGE);
    };

    if (errorObject.errorCode === UW_ERROR_CODE) {
        eventMessage = messages.uwErrorHeader;
        quoteDeclineContent = (
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.uwErrorHeader} />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.uwErrorBody} />
                </Col>
            </Row>
        );
    } else if (errorObject.errorCode === GREY_LIST_ERROR_CODE) {
        eventMessage = messages.greyListErrorHeader;
        quoteDeclineContent = (
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.greyListErrorHeader} />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.cannotContinueMessage} />
                </Col>
            </Row>
        );
    } else if (errorObject.errorCode === CUE_ERROR_CODE) {
        eventMessage = messages.cueErrorHeader;
        quoteDeclineContent = (
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.cueErrorHeader} />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.cueErrorBody(messages.staticPhoneNumber, quoteId)} />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.generalHoursMessage} />
                    {OPENING_HOURS.map(({ days, hours }, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Row key={i} className="mc-quote-decline__time-table__row">
                            <Col sm={6} md={8}>
                                <HDLabelRefactor
                                    Tag="p"
                                    text={days} />
                            </Col>
                            <Col sm={6} md={4}>
                                <HDLabelRefactor
                                    Tag="p"
                                    text={hours}
                                    className="time-chart-hours" />
                            </Col>
                        </Row>
                    ))}
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.cueErrorFooter}
                        className="margin-top-sm" />
                </Col>
            </Row>
        );
    } else {
        eventMessage = messages.uwErrorHeader;
        quoteDeclineContent = (
            <Row>
                <Col>
                    <HDLabelRefactor
                        Tag="h2"
                        text={messages.uwErrorHeader} />
                    <HDLabelRefactor
                        Tag="p"
                        text={messages.uwErrorBody} />
                </Col>
            </Row>
        );
    }

    return (
        <Container className="mc-quote-decline margin-top-lg">
            {quoteDeclineContent}
            <Row>
                <Col>
                    <HDButton
                        webAnalyticsEvent={{ event_action: eventMessage }}
                        id="go-to-homepage-button"
                        size="md"
                        label={messages.homepageButton}
                        className="margin-top-lg"
                        onClick={handleContinueTriggerButton} />
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        mcsubmissionVM: state.wizardState.data.mcsubmissionVM
    };
};

HDMCQuoteDeclinePage.propTypes = {
    mcsubmissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired
};

export default withRouter(connect(mapStateToProps)(HDMCQuoteDeclinePage));
