/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import {
    setNavigation as setNavigationAction,
    updateEpticaId as updateEpticaIdAction
} from '../../../redux-thunk/actions';
import {
    AnalyticsHDButton as HDButton,
} from '../../../web-analytics';

import {
    HASTINGS_DIRECT, HOMEPAGE, OPENING_HOURS, UW_ERROR_CODE
} from '../../../constant/const';
import { MISCELLANEOUS } from '../../../customer/directintegrations/faq/epticaMapping';
import * as messages from './HDQuoteDeclinePage.messages';
import { isCueErrorPresent, isUWErrorPresent, isGrayListErrorPresent } from '../__helpers__/policyErrorCheck';
import EventEmmiter from '../../../EventHandler/event';

const HDQuoteDeclinePage = ({
    submissionVM,
    customizeSubmissionVM,
    isDisplayedAsModal,
    setNavigation,
    updateEpticaId,
    dispatch,
    showHomepageButton,
    retrieveQuoteObject,
}) => {
    const history = useHistory();
    const numbers = require('./PhoneNumbers.json');
    const quoteId = _.get(submissionVM, 'quoteID.value');
    const producerCode = _.get(submissionVM, 'baseData.producerCode.value');
    const campaignCode = _.get(submissionVM, 'baseData.trackingCode.value[0].codeValue');
    const productCode = _.get(submissionVM, 'baseData.productCode.value');
    const selectedBrand = (customizeSubmissionVM) ? _.get(customizeSubmissionVM, 'quote.branchCode.value') : HASTINGS_DIRECT;
    const phoneNumberKey = (producerCode && campaignCode && productCode)
        ? `${producerCode}/${campaignCode}/${productCode}/${selectedBrand}` : selectedBrand;
    const phoneNumber = (numbers[phoneNumberKey]) ? numbers[phoneNumberKey] : numbers[selectedBrand];
    const offeredQuotes = _.get(history, 'location.state.PCWJourney', false)
        ? _.get(retrieveQuoteObject, 'retrieveQuoteObj.quoteData.offeredQuotes')
        : (submissionVM) ? _.get(submissionVM, 'quoteData.offeredQuotes.value') : [_.get(customizeSubmissionVM, 'quote.value')];
    let uwErrors = false;
    let greyListErrors = false;
    let cueErrors = false;
    let currentQuoteUWErrors = false;
    let selectedBrandUWErrors = false;
    const errorStatusCode = useSelector((state) => state.errorStatus.errorStatusCode);

    const getAmountData = () => {
        const data = {
            amount: null,
            prefix: null,
            text: ''
        };
        return data;
    };

    useEffect(() => {
        window.scroll(0, 0);
        dispatch(updateEpticaId(MISCELLANEOUS));
        EventEmmiter.dispatch('change', getAmountData());
    }, []);

    if (offeredQuotes) {
        uwErrors = isUWErrorPresent(offeredQuotes);
        const currentQuote = offeredQuotes.find(({ branchCode }) => branchCode === selectedBrand);
        currentQuoteUWErrors = currentQuote && currentQuote.hastingsErrors && currentQuote.hastingsErrors[0].technicalErrorCode === UW_ERROR_CODE;
        selectedBrandUWErrors = isDisplayedAsModal && customizeSubmissionVM && _.get(customizeSubmissionVM, 'quote.hastingsErrors.value')
            && _.get(customizeSubmissionVM, 'quote.hastingsErrors.value[0].technicalErrorCode') === UW_ERROR_CODE;
        if (uwErrors) {
            // enable button so user can go to homepage;
            dispatch(setNavigation({ canForward: true }));
        }
        greyListErrors = isGrayListErrorPresent(offeredQuotes);

        cueErrors = isCueErrorPresent(offeredQuotes);
    } else {
        dispatch(setNavigation({ canForward: false }));
    }

    const handleContinueTriggerButton = () => {
        window.location.assign(HOMEPAGE);
    };

    const quoteDeclineContent = () => {
        let quoteDeclineContentDiv = '';
        if (!offeredQuotes || errorStatusCode === 716) {
            quoteDeclineContentDiv = (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-offer-quote"
                                className="quote-decline__cant-offer-quote"
                                Tag="h2"
                                text={messages.cantOfferQuote} />
                        </Col>
                    </Row>
                    <Row className="decline-content">
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-offer-quote-desc"
                                className="quote-decline__cant-offer-quote-desc"
                                Tag="p"
                                text={messages.cannotContinueMessageUW} />
                        </Col>
                    </Row>
                </>
            );
        } else if (greyListErrors) {
            quoteDeclineContentDiv = (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cannot-continue"
                                className="quote-decline__cannot-continue"
                                Tag="h2"
                                text={messages.cannotContinue} />
                        </Col>
                    </Row>
                    <Row className="decline-content">
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cannot-continue-message"
                                className="quote-decline__cannot-continue-message"
                                Tag="p"
                                text={messages.cannotContinueMessage} />
                        </Col>
                    </Row>
                </>
            );
        } else if (uwErrors || currentQuoteUWErrors || selectedBrandUWErrors) {
            quoteDeclineContentDiv = (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-provide-quote"
                                className="quote-decline__cant-provide-quote"
                                Tag="h2"
                                text={messages.cannotContinueUW} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-general-outside-hours"
                                className="quote-decline__general-outside-hours"
                                Tag="p"
                                text={isDisplayedAsModal ? messages.cantOfferQuoteDesc : messages.cannotContinueMessageUW} />
                        </Col>
                    </Row>
                </>
            );
        } else if (cueErrors) {
            quoteDeclineContentDiv = (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-provide-quote"
                                className="quote-decline__cant-provide-quote"
                                Tag="h2"
                                text={messages.cantProvideQuoteCUEIssues} />
                        </Col>
                    </Row>
                    <Row className="decline-content">
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-provide-quote-desc"
                                className="quote-decline__cant-provide-quote-desc"
                                Tag="p"
                                text={messages.cantProvideQuoteDesc(messages.staticPhoneNumber, quoteId)} />
                        </Col>
                    </Row>
                    <Row className="working-hours-content">
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-general-hours"
                                className="quote-decline__general-hours"
                                Tag="p"
                                text={messages.generalHoursMessage} />
                        </Col>
                    </Row>
                    {OPENING_HOURS.map(({ days, hours }, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Row key={i} className="time-chart-row">
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
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-general-outside-hours"
                                className="quote-decline__general-outside-hours"
                                Tag="p"
                                text={messages.outsideHours} />
                        </Col>
                    </Row>
                </>
            );
        } else {
            quoteDeclineContentDiv = (
                <>
                    <Row>
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-offer-quote"
                                className="quote-decline__cant-offer-quote"
                                Tag="h2"
                                text={messages.cantOfferQuote} />
                        </Col>
                    </Row>
                    <Row className="decline-content">
                        <Col>
                            <HDLabelRefactor
                                id="quote-decline-cant-offer-quote-desc"
                                className="quote-decline__cant-offer-quote-desc"
                                Tag="p"
                                text={messages.cannotContinueMessageUW} />
                        </Col>
                    </Row>
                </>
            );
        }
        return quoteDeclineContentDiv;
    };

    return (
        <Container id="quote-decline" className="quote-decline margin-top-lg">
            {quoteDeclineContent()}
            { showHomepageButton && (
                <Row>
                    <Col>
                        <HDButton
                            webAnalyticsEvent={{ event_action: messages.homepageButton }}
                            id="go-to-homepage-button"
                            size="lg"
                            label={messages.homepageButton}
                            className="margin-top-lg"
                            onClick={handleContinueTriggerButton} />
                    </Col>
                </Row>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
        customizeSubmissionVM: state.wizardState.data.customizeSubmissionVM,
        retrieveQuoteObject: state.retrieveQuoteModel,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    setNavigation: setNavigationAction,
    updateEpticaId: updateEpticaIdAction,
});

HDQuoteDeclinePage.propTypes = {
    submissionVM: PropTypes.shape({ value: PropTypes.object }).isRequired,
    customizeSubmissionVM: PropTypes.shape({ value: PropTypes.object }),
    retrieveQuoteObject: PropTypes.shape({
        retrieveQuoteObj: PropTypes.shape({
            quoteData: PropTypes.shape({
                offeredQuotes: PropTypes.array
            })
        }),
    }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    updateEpticaId: PropTypes.func.isRequired,
    isDisplayedAsModal: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    showHomepageButton: PropTypes.bool,
};

HDQuoteDeclinePage.defaultProps = {
    customizeSubmissionVM: null,
    isDisplayedAsModal: false,
    showHomepageButton: false
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HDQuoteDeclinePage));
