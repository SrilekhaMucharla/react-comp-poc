import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import {
    AnalyticsHDButton as HDButton,
    AnalyticsHDTextInput as HDTextInput
} from '../../web-analytics';
import * as messages from './HastingsDOBInterstititalPage.messages';

const HastingsUpdateInceptionDate = (props) => {
    const { updateInceptionDate } = props;

    const [errorFlag, setErrorFlag] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [handleDayTouched, setHandleDayTouched] = useState(false);
    const [handleMonthTouched, setHandleMonthTouched] = useState(false);
    const [handleYearTouched, setHandleYearTouched] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [typeOfError, setTypeOfError] = useState();
    const monthInputRef = useRef();
    const yearInputRef = useRef();

    const handleDayChange = ({ target: { value } }) => {
        setDay(value);
        if (value.length === 2) monthInputRef.current.focus();
    };

    const handleMonthChange = ({ target: { value } }) => {
        setMonth(value);
        if (value.length === 2) yearInputRef.current.focus();
    };

    const handleYearChange = ({ target: { value } }) => {
        setYear(value);
    };

    const onDayBlur = ({ target: { value } }) => {
        if (value) {
            setDay(String(value).padStart(2, '0'));
        }
        setHandleDayTouched(true);
    };

    const onMonthBlur = ({ target: { value } }) => {
        if (value) {
            setMonth(String(value).padStart(2, '0'));
        }
        setHandleMonthTouched(true);
    };

    const onYearBlur = () => {
        setHandleYearTouched(true);
    };

    const isValidDate = (genDate) => {
        const monthTemp = month - 1;
        // eslint-disable-next-line eqeqeq
        if (genDate.getFullYear() == year && genDate.getMonth() == monthTemp && genDate.getDate() == day) {
            const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
            const futureAtMidnight = new Date(new Date().setHours(744, 0, 0, 0));
            const currentDate = new Date(year, monthTemp, day);
            if (currentDate >= todayAtMidnight && currentDate <= futureAtMidnight) {
                return true;
                // eslint-disable-next-line no-else-return
            } else {
                setTypeOfError(currentDate < todayAtMidnight ? messages.pastDate : messages.futureDate);
                return false;
            }
        }
        return false;
    };

    useEffect(() => {
        if (handleDayTouched && handleMonthTouched && handleYearTouched) {
            if (year.length === 4
                && year >= 1900
                && month < 13
                && day < 32) {
                const genDate = new Date(year, month - 1, day);
                if (isValidDate(genDate)) {
                    setErrorFlag(false);
                    setButtonEnabled(true);
                } else {
                    setErrorFlag(true);
                    setButtonEnabled(false);
                }
            } else {
                setErrorFlag(true);
                setTypeOfError(messages.invalidDate);
                setButtonEnabled(false);
            }
        }
    }, [handleDayTouched, handleMonthTouched, handleYearTouched, day, month, year]);

    const closeModal = () => {
        updateInceptionDate(day, month, year);
    };

    const handleFocus = (event) => event.target.select();

    return (
        <div className="update-inception-date">
            <p className="margin-top-md margin-bottom-md">
                {messages.thirtyDays}
            </p>
            <Row className="update-inception-date__date-input-row">
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id="day-input"
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        placeholder="DD"
                        value={day}
                        onChange={handleDayChange}
                        onBlur={onDayBlur}
                        onFocus={handleFocus}
                        maxLength="2"
                        allowLeadingZero
                        isInvalidCustom={errorFlag} />
                </Col>
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id="month-input"
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        placeholder="MM"
                        value={month}
                        ref={monthInputRef}
                        onChange={handleMonthChange}
                        onBlur={onMonthBlur}
                        onFocus={handleFocus}
                        maxLength="2"
                        allowLeadingZero
                        isInvalidCustom={errorFlag} />
                </Col>
                <Col className="update-inception-date__date-input-col">
                    <HDTextInput
                        id="year-input"
                        className="input-group--on-white font-demi-bold"
                        webAnalyticsEvent={{ event_action: messages.thirtyDays }}
                        type="numberOnly"
                        inputMode="numeric"
                        value={year}
                        ref={yearInputRef}
                        onChange={handleYearChange}
                        onBlur={onYearBlur}
                        onFocus={handleFocus}
                        placeholder="YYYY"
                        maxLength="4"
                        isInvalidCustom={errorFlag} />
                </Col>
            </Row>
            {errorFlag && (
                <div className="invalid-field update-inception-date__invalid-field">
                    <div className="message">
                        {typeOfError}
                    </div>
                </div>
            )}
            <HDButton
                id="update-quote-button"
                variant="primary"
                className="theme-white w-100 margin-top-lg"
                webAnalyticsEvent={{ event_action: messages.updateQuote }}
                disabled={!buttonEnabled}
                label={messages.updateQuote}
                onClick={closeModal} />
        </div>
    );
};

HastingsUpdateInceptionDate.propTypes = {
    updateInceptionDate: PropTypes.func.isRequired
};
export default HastingsUpdateInceptionDate;
