import React, { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
// import './HDBankAccountDetailsPage.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HastingsValidationService } from 'hastings-capability-validation';
import * as messages from './HDBankAccountDetailsPage.messages';
import useLoader from '../../Controls/Loader/useFullscreenLoader';
import { AnalyticsHDTextInput as HDTextInput } from '../../../web-analytics';
import { trackAPICallSuccess, trackAPICallFail } from '../../../web-analytics/trackAPICall';

const HDBankAccountDetailsPage = (props) => {
    const {
        customizeSubmissionVM,
        onFormValidation
    } = props;
    const [HDLoader, showLoader, hideLoader] = useLoader();
    const [sortCode, setSortCode] = useState('');
    const [isServiceDown, setServiceDown] = useState(false);
    const [sortCode1Validity, setSortCode1Validity] = useState(true);
    const [sortCode2Validity, setSortCode2Validity] = useState(true);
    const [sortCode3Validity, setSortCode3Validity] = useState(true);
    const [invalidEntry, setInvalidEntry] = useState(false);
    const [sortCode1, setSortCode1] = useState('');
    const [sortCode2, setSortCode2] = useState('');
    const [sortCode3, setSortCode3] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountNumberValidity, setAccountNumberValidity] = useState(true);
    const sortCode1Ref = useRef(null);
    const sortCode2Ref = useRef(null);
    const sortCode3Ref = useRef(null);
    const accountRef = useRef(null);
    const [sortCode1Touched, setSortCode1Touched] = useState(false);
    const [sortCode2Touched, setSortCode2Touched] = useState(false);


    const checkFormValidity = (isValidResponse) => {
        let isFormValid = true;
        const sortCodeVal = sortCode1 + sortCode2 + sortCode3;
        if (sortCode1.length !== 2) { isFormValid = false; }
        if (sortCode2.length !== 2) { isFormValid = false; }
        if (sortCode3.length !== 2) { isFormValid = false; }
        if (isValidResponse === undefined) {
            if (accountNumber.length < 1 || (!accountNumberValidity)) { isFormValid = false; }
        } else {
            isFormValid = isValidResponse;
        }
        onFormValidation({ formName: 'bankAccountDetails', value: isFormValid, dataForUpdate: { sortCode: sortCodeVal, accountNumber: accountNumber } });
    };

    const serviceCall = (bankReqDTO) => {
        showLoader();
        HastingsValidationService.validateBankAccount(bankReqDTO)
            .then((validationResponse) => {
                setServiceDown(false);
                if (!validationResponse.result.isValid) {
                    setInvalidEntry(true);
                    setServiceDown(false);
                    setSortCode1Validity(false);
                    setSortCode2Validity(false);
                    setSortCode3Validity(false);
                    setAccountNumberValidity(false);
                    checkFormValidity(false);
                    trackAPICallFail(messages.validateBankAccount, messages.invalidBankAccount);
                } else {
                    setInvalidEntry(false);
                    setSortCode1Validity(true);
                    setSortCode2Validity(true);
                    setSortCode3Validity(true);
                    setAccountNumberValidity(true);
                    checkFormValidity(true);
                    trackAPICallSuccess(messages.validateBankAccount);
                }
            })
            .catch(() => {
                setInvalidEntry(true);
                setServiceDown(true);
                setSortCode1Validity(true);
                setSortCode2Validity(true);
                setSortCode3Validity(true);
                setAccountNumberValidity(true);
                checkFormValidity(false);
                trackAPICallFail(messages.validateBankAccount, messages.validateBankAccountFailed);
            })
            .finally(() => {
                hideLoader();
            });
    };

    const constructSortCode = () => {
        if (sortCode1.length === 2 && sortCode2.length === 2 && sortCode3.length === 2) {
            const sortCodeGenerated = sortCode1 + sortCode2 + sortCode3;
            setSortCode(sortCodeGenerated);
            if (accountNumber.length === 8) {
                const quoteId = _.get(customizeSubmissionVM, 'quoteID.value');
                const sessionUID = _.get(customizeSubmissionVM, 'sessionUUID.value');
                const bankReqDTO = {
                    accountNumber: accountNumber, sortCode: sortCodeGenerated, sessionUUID: sessionUID, quoteID: quoteId
                };
                serviceCall(bankReqDTO);
            }
        } else {
            setSortCode('');
        }
    };


    const onSortCodeChange = (event, sortCodePosition) => {
        if (sortCodePosition === messages.one) {
            setSortCode1(event.target.value);
            setSortCode1Touched(true);
            if (event.target.value.length === 2) {
                sortCode2Ref.current.focus();
            }
        } else if (sortCodePosition === messages.two) {
            setSortCode2(event.target.value);
            setSortCode2Touched(true);
            if (event.target.value.length === 2) {
                sortCode3Ref.current.focus();
            }
            if (!sortCode1Touched) {
                setSortCode1Validity(false);
                setInvalidEntry(false);
            }
        } else {
            setSortCode3(event.target.value);
            if (event.target.value.length === 2) {
                accountRef.current.focus();
            }
            if (!sortCode1Touched) {
                setSortCode1Validity(false);
                setInvalidEntry(false);
            }
            if (!sortCode2Touched) {
                setSortCode2Validity(false);
                setInvalidEntry(false);
            }
        }
    };

    useEffect(() => {
        constructSortCode();
        checkFormValidity();
    }, [sortCode1, sortCode2, sortCode3, accountNumber]);


    const onAccountNumberChange = (event) => {
        setAccountNumber(event.target.value);
    };

    const sortCodeLengthValid = () => {
        return (sortCode1.length === 2 && sortCode2.length === 2 && sortCode3.length === 2);
    };

    const setSortCodesValid = () => {
        setSortCode1Validity(true);
        setSortCode2Validity(true);
        setSortCode3Validity(true);
    };

    const onAccountNumberBlur = ({ target: { value } }) => {
        if (sortCodeLengthValid()) setSortCodesValid();
        if (value.length === 0) {
            setInvalidEntry(false);
            setAccountNumberValidity(false);
        } else if (value.length < 8) {
            setAccountNumberValidity(false);
            setInvalidEntry(true);
            setServiceDown(false);
            accountRef.current.focus();
        } else {
            setAccountNumberValidity(true);
            setInvalidEntry(false);
            if (sortCode !== '') {
                const quoteId = _.get(customizeSubmissionVM, 'quoteID.value');
                const sessionUID = _.get(customizeSubmissionVM, 'sessionUUID.value');
                const bankReqDTO = {
                    accountNumber: accountNumber, sortCode: sortCode, sessionUUID: sessionUID, quoteID: quoteId
                };
                serviceCall(bankReqDTO);
            }
        }
    };

    const onSortCodeBlur = ({ target: { value } }, sortCodePosition) => {
        if (accountNumber.length === 8) {
            setAccountNumberValidity(true);
        }
        if (value.length === 0) {
            setInvalidEntry(false);
            if (sortCodePosition === messages.one) {
                setSortCode1Validity(false);
            } else if (sortCodePosition === messages.two) {
                setSortCode2Validity(false);
            } else {
                setSortCode3Validity(false);
            }
        } else if (sortCodePosition === messages.one) {
            if (value.length < 2) {
                setSortCode1Validity(false);
                setInvalidEntry(true);
                setServiceDown(false);
                sortCode1Ref.current.focus();
            } else {
                setSortCode1Validity(true);
                setInvalidEntry(false);
            }
        } else if (sortCodePosition === messages.two) {
            if (value.length < 2) {
                setSortCode2Validity(false);
                setInvalidEntry(true);
                setServiceDown(false);
                sortCode2Ref.current.focus();
            } else {
                setSortCode2Validity(true);
                setInvalidEntry(false);
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (value.length < 2) {
                setSortCode3Validity(false);
                setInvalidEntry(true);
                setServiceDown(false);
                sortCode3Ref.current.focus();
            } else {
                setSortCode3Validity(true);
                setInvalidEntry(false);
            }
        }
    };

    const isSortCodeValid = () => {
        return ((!(sortCode1Validity && sortCode2Validity && sortCode3Validity)) && !invalidEntry);
    };

    const isAccountNumberValid = () => {
        return (!accountNumberValidity && !invalidEntry);
    };


    return (
        <Row className="bank-account-details">
            <Col>
                <Row>
                    <Col xs={12} md={9} className="pr-md-5">
                        {invalidEntry && (
                            <HDLabelRefactor Tag="p" className="error margin-bottom-lg" text={isServiceDown ? messages.serviceDown : messages.invalidEntry} />
                        )}
                        <Row>
                            <Col xs={12} md={9}>
                                <HDLabelRefactor
                                    className="bank-account-details__sort-code-label mb-4"
                                    Tag="h5"
                                    text={messages.sortCode} />
                            </Col>
                        </Row>
                        <Row className="bank-account-details__sort-code-container">
                            <Col className="bank-account-details__sort-code-sub-container">
                                <HDTextInput
                                    className="bank-account-details__sort-code-1 input-group--on-white"
                                    webAnalyticsEvent={{
                                        event_value: `${messages.sortCode} - ${messages.one}`,
                                        event_action: `${messages.summary} - ${messages.directDebit}`
                                    }}
                                    size="lg"
                                    id="sort-code-1"
                                    onChange={(e) => { onSortCodeChange(e, '1'); }}
                                    type="numberOnly"
                                    path="sort-code-1"
                                    value={sortCode1}
                                    ref={sortCode1Ref}
                                    name="sort-code-1"
                                    maxLength="2"
                                    onBlur={(e) => { onSortCodeBlur(e, '1'); }}
                                    allowLeadingZero
                                    isInvalidCustom={!sortCode1Validity} />
                            </Col>
                            <div className="bank-account-details__hyphen">-</div>
                            <Col className="bank-account-details__sort-code-sub-container">
                                <HDTextInput
                                    className="bank-account-details__sort-code-2 input-group--on-white"
                                    size="lg"
                                    webAnalyticsEvent={{
                                        event_value: `${messages.sortCode} - ${messages.two}`,
                                        event_action: `${messages.summary} - ${messages.directDebit}`
                                    }}
                                    type="numberOnly"
                                    id="sort-code-2"
                                    ref={sortCode2Ref}
                                    path="sort-code-2"
                                    value={sortCode2}
                                    maxLength="2"
                                    onChange={(e) => { onSortCodeChange(e, '2'); }}
                                    onBlur={(e) => { onSortCodeBlur(e, '2'); }}
                                    name="sort-code-2"
                                    allowLeadingZero
                                    isInvalidCustom={!sortCode2Validity} />
                            </Col>
                            <div className="bank-account-details__hyphen">-</div>
                            <Col className="bank-account-details__sort-code-sub-container">
                                <HDTextInput
                                    className="bank-account-details__sort-code-3 input-group--on-white"
                                    size="lg"
                                    webAnalyticsEvent={{
                                        event_value: `${messages.sortCode} - ${messages.three}`,
                                        event_action: `${messages.summary} - ${messages.directDebit}`
                                    }}
                                    type="numberOnly"
                                    path="sort-code-3"
                                    ref={sortCode3Ref}
                                    maxLength="2"
                                    id="sort-code-3"
                                    value={sortCode3}
                                    onChange={(e) => { onSortCodeChange(e, '3'); }}
                                    onBlur={(e) => { onSortCodeBlur(e, '3'); }}
                                    name="sort-code-3"
                                    allowLeadingZero
                                    isInvalidCustom={!sortCode3Validity} />
                            </Col>
                        </Row>
                        {isSortCodeValid() && (<HDLabelRefactor Tag="p" className="error mb-0" text={messages.answerQuestion} />)}
                    </Col>
                </Row>
                <hr className="mx-0" />
                <Row className="bank-account-details__bank-account-container">
                    <Col>
                        <Row>
                            <Col xs={12} md={9}>
                                <HDLabelRefactor
                                    className="bank-account-details__account-nummber-label mb-4"
                                    Tag="h5"
                                    text={messages.accountNumber}
                                    size="xs" />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pr-md-5" xs={12} md={9}>
                                <HDTextInput
                                    className="bank-account-details__account-nummber-input input-group--on-white"
                                    size="lg"
                                    webAnalyticsEvent={{
                                        event_value: messages.accountNumber,
                                        event_action: `${messages.summary} - ${messages.directDebit}`
                                    }}
                                    type="numberOnly"
                                    maxLength="8"
                                    ref={accountRef}
                                    path="accountNumber"
                                    value={accountNumber}
                                    onChange={onAccountNumberChange}
                                    onBlur={onAccountNumberBlur}
                                    name="accountNumber"
                                    allowLeadingZero
                                    isInvalidCustom={!accountNumberValidity} />
                                {isAccountNumberValid() && (<HDLabelRefactor Tag="p" className="error mb-0" xs={12} md={9} text={messages.answerQuestion} />)}
                            </Col>
                        </Row>
                        <hr className="mx-0" />
                    </Col>
                </Row>
            </Col>
            {HDLoader}
        </Row>
    );
};


HDBankAccountDetailsPage.propTypes = {
    customizeSubmissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    onFormValidation: PropTypes.func
};

HDBankAccountDetailsPage.defaultProps = {
    onFormValidation: () => { }
};

export default HDBankAccountDetailsPage;
