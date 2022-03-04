import React, {
    useRef,
    useState
} from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import {
    HDLabelRefactor
} from 'hastings-components';
import _ from 'lodash';
import {
    AnalyticsHDTextInput as HDTextInput,
} from '../../../../web-analytics';
import * as messages from './HDMCBankDetails.messages';
import HDMCBankDetailsSortCodes from './HDMCSortCodes';
import { formikPropTypes } from '../../../../constant/propTypes';

const HDMCBankDetails = ({
    validatorError,
    validateBankAccDetails,
    serviceDown,
    formikProps
}) => {
    const {
        errors: formikErrors,
        values: formikValues,
        setFieldValue: setFormikFieldValue,
        touched: formikTouched,
        handleBlur: formikHandleBlur
    } = formikProps;

    const accountNumberFieldName = 'accountNumber';
    const accNumberRef = useRef(null);
    const [showChildError, setShowChildError] = useState();
    const [accountNumberValid, setAccountNumberValid] = useState(true);

    const continueToAccountNumber = () => {
        if (accNumberRef.current) {
            accNumberRef.current.focus();
        }
    };

    const blurAccNumberHandler = (e) => {
        validateBankAccDetails(formikValues);
        formikHandleBlur(e);
        if (e.target.value < 8) {
            setAccountNumberValid(false);
        } else {
            setAccountNumberValid(true);
        }
    };

    const onChangeHandler = (e) => {
        setFormikFieldValue(accountNumberFieldName, e.target.value);
        formikValues.accountNumber = e.target.value;
        if (formikValues.accountNumber.length > 7) validateBankAccDetails(formikValues);
    };

    // eslint-disable-next-line consistent-return
    const errorMsg = () => {
        if (serviceDown) return messages.serviceDown;
        if (validatorError) return messages.invalidDetails;
    };

    const sortCodeReqErrorMsg = (() => {
        if (showChildError) return showChildError;
    })();

    const reqErrorMsg = (() => {
        const value = _.get(formikValues, `${accountNumberFieldName}`, null);
        if ((formikErrors[accountNumberFieldName] && formikTouched[accountNumberFieldName] && !value)) return messages.invalidBankAccountInfoMessage;
    })();

    const accountNumberValidityCheck = () => {
        return (formikErrors[accountNumberFieldName] && formikTouched[accountNumberFieldName]) || validatorError || !accountNumberValid;
    };

    return (
        <>
            <Row>
                <Col xs={12} lg={9} className="pr-lg-5">
                    {(validatorError || serviceDown) && (
                        <Row className="bank-account-details__sort-code-error-container">
                            <Col>
                                <HDLabelRefactor
                                    Tag="p"
                                    className="error margin-bottom-lg"
                                    text={errorMsg()} />
                            </Col>
                        </Row>
                    )}
                    <HDMCBankDetailsSortCodes
                        sortCodesFinished={continueToAccountNumber}
                        validatorError={validatorError}
                        validateBankAccDetails={validateBankAccDetails}
                        formikProps={formikProps}
                        setShowError={setShowChildError}
                        accountNumberValidation={setAccountNumberValid} />
                    {showChildError && sortCodeReqErrorMsg && (
                        <Row className="bank-account-details__sort-code-error-container">
                            <Col>
                                <HDLabelRefactor
                                    Tag="p"
                                    className="error margin-bottom-lg"
                                    text={sortCodeReqErrorMsg} />
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
            <hr className="mx-0" />
            <Row>
                <Col xs={12} lg={9} className="pr-lg-5">
                    <HDLabelRefactor
                        className="mt-0 mb-3"
                        Tag="h5"
                        text={messages.accountNumber} />
                    <HDTextInput
                        ref={accNumberRef}
                        id="account-number-input"
                        className="input-group input-group--on-white"
                        value={formikValues[accountNumberFieldName]}
                        onChange={onChangeHandler}
                        onBlur={blurAccNumberHandler}
                        name={accountNumberFieldName}
                        maxLength="8"
                        path={`bankDetails.${accountNumberFieldName}`}
                        type="numberOnly"
                        isInvalidCustom={accountNumberValidityCheck()} />
                    {reqErrorMsg && (
                        <Row className="bank-account-details__sort-code-error-container">
                            <Col>
                                <HDLabelRefactor
                                    Tag="p"
                                    className="error margin-bottom-lg"
                                    text={reqErrorMsg} />
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>

        </>
    );
};

HDMCBankDetails.propTypes = {
    validatorError: PropTypes.bool.isRequired,
    validateBankAccDetails: PropTypes.func.isRequired,
    serviceDown: PropTypes.bool.isRequired,
    formikProps: PropTypes.shape(formikPropTypes).isRequired
};

export default HDMCBankDetails;
