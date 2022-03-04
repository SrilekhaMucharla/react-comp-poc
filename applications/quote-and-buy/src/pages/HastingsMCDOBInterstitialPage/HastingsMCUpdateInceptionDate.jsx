import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    HDLabelRefactor
} from 'hastings-components';
import { Col, Row } from 'react-bootstrap';
import {
    handleDayBlur, handleMonthBlur, handleDayChange, handleMonthChange, handleYearChange, handleFocus
} from './util';
import {
    AnalyticsHDTextInput as HDTextInput
} from '../../web-analytics';
import * as messages from './HastingsMCDOBInterstititalPage.messages';

const HastingsUpdateInceptionDate = ({
    isExpired,
    carQuote,
    index,
    handleInputChange,
    errorMessage
}) => {
    const [errorFlag, setErrorFlag] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [handleDayTouched, setHandleDayTouched] = useState(false);
    const [handleMonthTouched, setHandleMonthTouched] = useState(false);
    const [handleYearTouched, setHandleYearTouched] = useState(false);
    const [typeOfError, setTypeOfError] = useState();
    const [carModel, setCarModel] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const monthInputRef = useRef();
    const yearInputRef = useRef();

    useEffect(() => {
        setCarModel(`${carQuote.lobData.privateCar.coverables.vehicles[0].make} ${carQuote.lobData.privateCar.coverables.vehicles[0].model}`);
        setRegNumber(carQuote.lobData.privateCar.coverables.vehicles[0].registrationsNumber);
        setDay(carQuote.baseData.periodStartDate.day);
        setMonth(carQuote.baseData.periodStartDate.month + 1);
        setYear(carQuote.baseData.periodStartDate.year);
        if (carQuote.baseData.periodStartDate.day && (carQuote.baseData.periodStartDate.month || carQuote.baseData.periodStartDate.month === 0) && carQuote.baseData.periodStartDate.year) {
            setHandleDayTouched(true);
            setHandleMonthTouched(true);
            setHandleYearTouched(true);
        }
    }, []);

    useEffect(() => {
        if (errorMessage !== '') {
            setErrorFlag(() => true);
            setTypeOfError(errorMessage);
        } else {
            setErrorFlag(() => false);
            setTypeOfError('');
        }
    }, [errorMessage]);

    const isValidDate = () => {
        const monthTemp = month - 1;
        const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
        const futureAtMidnight = new Date(new Date().setHours(744, 0, 0, 0));
        const currentDate = new Date(year, monthTemp, day);
        const validationObj = {};
        if (currentDate >= todayAtMidnight) {
            if ((index === 0 && currentDate <= futureAtMidnight) || index > 0) { validationObj.bool = true; validationObj.message = ''; }
            if (index === 0 && currentDate > futureAtMidnight) { validationObj.bool = false; validationObj.message = messages.futureDate; }
        } else {
            validationObj.bool = false;
            validationObj.message = messages.pastDate;
        }
        return validationObj;
    };

    useEffect(() => {
        if (handleDayTouched && handleMonthTouched && handleYearTouched) {
            let errorDateMessage = '';
            const date = {};
            if (year >= 1900 && month < 13 && day < 32) {
                const dataObj = isValidDate();
                if (dataObj.bool) {
                    date.day = parseInt(day, 10);
                    date.month = parseInt(month, 10) - 1;
                    date.year = parseInt(year, 10);
                    errorDateMessage = '';
                } else {
                    errorDateMessage = dataObj.message;
                }
            } else {
                errorDateMessage = messages.invalidDate;
            }
            handleInputChange(index, date, errorDateMessage);
        }
    }, [handleDayTouched, handleMonthTouched, handleYearTouched, day, month, year]);

    return (
        <>
            <HDLabelRefactor
                Tag="h4"
                text={isExpired ? messages.expiredStartDateTitle : messages.confirmStartDateTitle}
                className="" />
            <HDLabelRefactor
                Tag="h4"
                className="update-inception-date__car-reg-ribbon"
                text={regNumber} />
            <HDLabelRefactor
                Tag="p"
                className="update-inception-date__car-model"
                text={carModel} />
            <HDLabelRefactor
                Tag="p"
                className="update-inception-date__car-date-question"
                text={messages.carDateQuestion} />
            <HDLabelRefactor
                Tag="p"
                className="margin-top-md margin-bottom-md"
                text={index > 0 ? messages.dateMessage330 : messages.thirtyDays} />
            {errorFlag && (
                <div className="invalid-field update-inception-date__invalid-field">
                    <div className="message">
                        {typeOfError}
                    </div>
                </div>
            )}
            <Row className="update-inception-date__date-input-row mb-3">
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id={`day-input-${index}`}
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        placeholder="DD"
                        value={day}
                        onFocus={handleFocus}
                        onChange={(e) => handleDayChange(e.target.value, setDay, monthInputRef)}
                        onBlur={(e) => handleDayBlur(e.target.value, setDay, setHandleDayTouched)}
                        maxLength="2"
                        allowLeadingZero
                        isInvalidCustom={errorFlag} />
                </Col>
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id={`month-input-${index}`}
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        placeholder="MM"
                        value={month}
                        ref={monthInputRef}
                        onFocus={handleFocus}
                        onChange={(e) => handleMonthChange(e.target.value, setMonth, yearInputRef)}
                        onBlur={(e) => handleMonthBlur(e.target.value, setMonth, setHandleMonthTouched)}
                        maxLength="2"
                        allowLeadingZero
                        isInvalidCustom={errorFlag} />
                </Col>
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id={`year-input-${index}`}
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        value={year}
                        ref={yearInputRef}
                        onFocus={handleFocus}
                        onChange={(e) => handleYearChange(e.target.value, setYear, setHandleYearTouched)}
                        placeholder="YYYY"
                        maxLength="4"
                        isInvalidCustom={errorFlag} />
                </Col>
            </Row>
        </>
    );
};

HastingsUpdateInceptionDate.propTypes = {
    isExpired: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    errorMessage: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    carQuote: PropTypes.shape({
        quoteID: PropTypes.string,
        isParentPolicy: PropTypes.bool,
        baseData: {
            periodStatus: PropTypes.string,
            accountHolder: PropTypes.shape({}),
            termType: PropTypes.string,
            numberOfCarsOnHousehold: PropTypes.number,
            producerCode: PropTypes.string,
            brandCode: PropTypes.string,
            insurer: PropTypes.string,
            isPostalDocument: PropTypes.bool,
            marketingContacts: PropTypes.shape({}),
            isExistingCustomer: PropTypes.bool,
            affordablePaymentPlan: PropTypes.string,
            pccurrentDate: PropTypes.string,
            productCode: PropTypes.string,
            policyAddress: PropTypes.shape({}),
            periodStartDate: PropTypes.shape({}),
            periodEndDate: PropTypes.shape({}),
            productName: PropTypes.string,
            jobType: PropTypes.string
        },
        lobData: PropTypes.shape({
            privateCar: PropTypes.shape({
                coverables: PropTypes.shape({
                    vehicles: PropTypes.shape([
                        { registrationsNumber: PropTypes.string }
                    ])
                })
            })
        }),
        quoteData: PropTypes.shape({}).isRequired,
        bindData: PropTypes.shape({}).isRequired,
        projectedMPDiscount: PropTypes.number.isRequired,
        quoteCreationTime: PropTypes.string.isRequired,
        quoteUpdateTime: PropTypes.number.isRequired
    }).isRequired
};
export default HastingsUpdateInceptionDate;
