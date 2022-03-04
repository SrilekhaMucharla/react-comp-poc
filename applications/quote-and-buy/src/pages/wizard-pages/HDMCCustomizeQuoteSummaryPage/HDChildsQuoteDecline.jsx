import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { checkHastingsErrorFromHastingErrorObj } from '../__helpers__/policyErrorCheck';
import {
    CUE_ERROR_CODE, GREY_LIST_ERROR_CODE, UW_ERROR_CODE, QUOTE_DECLINE_ERROR_CODE
} from '../../../constant/const';
import getCarName from '../../../common/getCarName';
import * as messages from './HDChildsQuoteDecline.messages';

const HDChildsQuoteDecline = ({
    mcsubmissionVM,
    multiCustomizeSubmissionVM,
    quoteCount
}) => {
    const childsQuoteDeclinedData = [];
    let quoteErrorMsg = '';
    let prevErrorCode = null;
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const multiQuoteId = _.get(mcsubmissionVM, 'mpwrapperNumber.value');

    const getCarData = (submissionVM) => {
        const regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`) || '';
        const make = _.get(submissionVM, `${vehiclePath}.value.make`) || '';
        const model = _.get(submissionVM, `${vehiclePath}.value.model`) || '';
        const carName = getCarName(make, model);
        return { regNum, carName };
    };

    if (mcsubmissionVM.value.quotes.length && multiCustomizeSubmissionVM.value.customQuotes.length) {
        const customDataTemp = multiCustomizeSubmissionVM.value.customQuotes;
        customDataTemp.map((customUpdatedQuote) => {
            if (!customUpdatedQuote.quote.hastingsErrors) return null;
            mcsubmissionVM.quotes.children.map((submissionVM) => {
                if (submissionVM.value.quoteID === customUpdatedQuote.quoteID) {
                    const hasError = checkHastingsErrorFromHastingErrorObj(customUpdatedQuote.quote.hastingsErrors);
                    if (hasError.errorCode === UW_ERROR_CODE
                        || hasError.errorCode === GREY_LIST_ERROR_CODE
                        || hasError.errorCode === QUOTE_DECLINE_ERROR_CODE) {
                        const carData = getCarData(submissionVM);
                        childsQuoteDeclinedData.push({
                            registrationsNumber: carData.regNum,
                            carName: carData.carName,
                        });
                    } else if (hasError.errorCode === CUE_ERROR_CODE) {
                        const carData = getCarData(submissionVM);
                        childsQuoteDeclinedData.push({
                            registrationsNumber: carData.regNum,
                            carName: carData.carName,
                        });
                    }
                    if (hasError.errorCode === UW_ERROR_CODE
                        || hasError.errorCode === GREY_LIST_ERROR_CODE
                        || hasError.errorCode === QUOTE_DECLINE_ERROR_CODE) {
                        prevErrorCode = hasError.errorCode;
                        quoteErrorMsg = messages.uwAndGreyListErrorMsg(quoteCount);
                    } else if (hasError.errorCode === CUE_ERROR_CODE) {
                        quoteErrorMsg = (prevErrorCode === UW_ERROR_CODE || prevErrorCode === GREY_LIST_ERROR_CODE)
                            ? messages.uwAndGreyListErrorMsg(quoteCount) : messages.cueErrorsMsg(multiQuoteId, quoteCount);
                    }
                }
                return null;
            });
            return null;
        });
    }
    const quoteDeclineContent = () => {
        const quoteDeclineContentDiv = (
            <>
                <Row>
                    <Col>
                        <HDLabelRefactor
                            id="quote-childs-decline-cant-provide-quote"
                            className="quote-childs-decline__cant-provide-quote"
                            Tag="h2"
                            text={messages.cannotContinueUW} />
                    </Col>
                </Row>
                {childsQuoteDeclinedData.map((declineQuote) => (
                    <>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="quote-decline-child-registration-number"
                                    className="quote-decline-child__registration-number"
                                    Tag="h2"
                                    text={declineQuote.registrationsNumber} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HDLabelRefactor
                                    id="quote-decline-child-make-and-modal"
                                    className="quote-decline-child__make-and-modal text-md"
                                    Tag="h4"
                                    text={declineQuote.carName} />
                            </Col>
                        </Row>
                    </>
                ))}
                <Row>
                    <Col>
                        <HDLabelRefactor
                            id="quote-decline-child-msg"
                            className="quote-decline-child__msg"
                            Tag="p"
                            text={quoteErrorMsg} />
                    </Col>
                </Row>
            </>
        );
        return quoteDeclineContentDiv;
    };

    return (
        <Container id="quote-childs-decline" className="quote-childs-decline margin-top-lg">
            {quoteDeclineContent()}
        </Container>
    );
};

HDChildsQuoteDecline.propTypes = {
    mcsubmissionVM: PropTypes.shape({
        quotes: PropTypes.object,
        value: PropTypes.object
    }).isRequired,
    multiCustomizeSubmissionVM: PropTypes.shape({ value: PropTypes.object, customQuotes: PropTypes.object }).isRequired,
    quoteCount: PropTypes.number.isRequired
};

export default HDChildsQuoteDecline;
