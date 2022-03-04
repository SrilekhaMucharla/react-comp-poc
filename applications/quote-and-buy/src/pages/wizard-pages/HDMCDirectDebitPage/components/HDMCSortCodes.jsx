import { HDLabelRefactor } from 'hastings-components';
import React, {
    createRef,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import * as messages from './HDMCBankDetails.messages';
import {
    AnalyticsHDTextInput as HDTextInput,
} from '../../../../web-analytics';
import { formikPropTypes } from '../../../../constant/propTypes';
import EventEmmiter from '../../../../EventHandler/event';

const HDMCBankDetailsSortCodes = ({
    sortCodesFinished,
    validatorError,
    formikProps,
    setShowError,
    validateBankAccDetails,
}) => {
    const {
        errors: formikErrors,
        values: formikValues,
        setFieldValue: setFormikFieldValue,
        touched: formikTouched,
        handleBlur: formikHandleBlur
    } = formikProps;

    const ErrorMessage = 'ForceClearAPIErrorMessage';
    const sortCodesArray = useMemo(() => [1, 2, 3], []);
    const sortCodesIds = ['sort-code-1', 'sort-code-2', 'sort-code-3'];
    const sortCodeFieldName = 'sortCodes';
    const sortCodesRefs = useRef(sortCodesArray.map(() => createRef()));
    const [sortCodeValidationError, setSortCodeValidationError] = useState();

    const handleSortCodeChange = (fieldIndex, value) => {
        try {
            const currentFormikValues = formikValues[sortCodeFieldName] || [];
            if (currentFormikValues.length > 0) {
                const formiksValueObject = formikValues[sortCodeFieldName].map((fv) => {
                    return fv;
                });
                if (formiksValueObject[fieldIndex]) {
                    formiksValueObject[fieldIndex] = {
                        sortCodeIndex: fieldIndex,
                        sortCodeValue: value,
                    };
                    const newFormikValues = Object.values(formiksValueObject);
                    setFormikFieldValue(sortCodeFieldName, [...newFormikValues]);
                } else {
                    setFormikFieldValue(sortCodeFieldName, [...currentFormikValues, { sortCodeIndex: fieldIndex, sortCodeValue: value }]);
                }
                formikValues[sortCodeFieldName][fieldIndex] = {
                    sortCodeIndex: fieldIndex,
                    sortCodeValue: value
                };
                validateBankAccDetails(formikValues);
            } else {
                setFormikFieldValue(sortCodeFieldName, [...currentFormikValues, { sortCodeIndex: fieldIndex, sortCodeValue: value }]);
            }
            const sortCodeCombined = Array.isArray(formikValues[sortCodeFieldName]) && formikValues[sortCodeFieldName].map((sc) => sc.sortCodeValue).join('');
            if (sortCodeCombined && sortCodeCombined.length <= 6) {
                setSortCodeValidationError(false);
            } else {
                setSortCodeValidationError(true);
            }
        } catch (error) {
            // left for debbuging since source maps are wrong
            // console.error("Handle change", error);
        }
    };

    const handleSortCodeUserInput = (fieldIndex, value) => {
        if (value.length === 2) {
            if (fieldIndex < 2) {
                sortCodesRefs.current[fieldIndex + 1].current.focus();
            } else {
                sortCodesFinished();
            }
        }
    };

    const getFormikValue = (index) => {
        return _.get(formikValues, `[${sortCodeFieldName}][${index}].sortCodeValue`, '');
    };

    const checkForSortCodeErrors = () => {
        return (sortCodesIds.some((sortCodeId, idx) => _.get(formikTouched, `${sortCodesIds[idx]}`) && _.get(formikErrors, `${sortCodeFieldName}[${idx}]`)) || validatorError || sortCodeValidationError);
    };

    useEffect(() => {
        const shouldShowErrorMsg = sortCodesIds.some(
            (sortCodeId, idx) => formikTouched[sortCodeId] && _.get(formikErrors, `${sortCodeFieldName}[${idx}]`)
        );

        if (shouldShowErrorMsg) {
            setShowError(messages.invalidBankAccountInfoMessage);
            EventEmmiter.dispatch('change', ErrorMessage);
        } else {
            setShowError();
        }
    }, [validatorError, formikErrors[sortCodeFieldName], formikTouched]);

    return (
        <>
            <HDLabelRefactor
                className="mt-0 mb-3"
                Tag="h5"
                text={messages.sortCode} />
            <Row className="bank-account-details__sort-code-container">
                {sortCodesArray.map((sr, index) => {
                    return (
                        <>
                            {/* dont know what to use as keys so string+index for now */}
                            {/* eslint-disable-next-line react/no-array-index-key */}
                            <Col key={`sortCode-${index}`} className="bank-account-details__sort-code-sub-container">
                                <HDTextInput
                                    ref={sortCodesRefs.current[index]}
                                    // eslint-disable-next-line max-len
                                    className={`bank-account-details__sort-code-${index + 1} input-group--on-white`}
                                    size="lg"
                                    webAnalyticsEvent={{
                                        event_value: `${messages.sortCode} - ${messages.sortCodeValuesMessage[index]}`,
                                        event_action: `${messages.summary} - ${messages.directDebit}`
                                    }}
                                    type="numberOnly"
                                    id={sortCodesIds[index]}
                                    value={getFormikValue(index)}
                                    onChange={(e) => {
                                        handleSortCodeChange(index, e.target.value);
                                        handleSortCodeUserInput(index, e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        handleSortCodeChange(index, e.target.value);
                                        formikHandleBlur(e);
                                    }}
                                    maxLength="2"
                                    name={sortCodesIds[index]}
                                    allowLeadingZero
                                    path={`bankDetails.${sortCodeFieldName}.sortCode-${index}`}
                                    isInvalidCustom={checkForSortCodeErrors(index)} />
                            </Col>
                            {(index !== sortCodesArray.length - 1) && <div className="bank-account-details__hyphen"> -</div>}
                        </>

                    );
                })}
            </Row>
        </>
    );
};
HDMCBankDetailsSortCodes.propTypes = {
    sortCodesFinished: PropTypes.func.isRequired,
    validatorError: PropTypes.bool.isRequired,
    formikProps: PropTypes.shape(formikPropTypes).isRequired,
    setShowError: PropTypes.func.isRequired,
    validateBankAccDetails: PropTypes.func.isRequired
};

export default HDMCBankDetailsSortCodes;
