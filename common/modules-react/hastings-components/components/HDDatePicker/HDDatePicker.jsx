import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import HDOverlayPopup from '../HDOverlayPopup/HDOverlayPopup';
import HDLabel from '../HDLabel/HDLabel';

import * as constants from './HDDatePickerConst';
// import './HDDatePicker.scss';
import HDQuoteInfo from '../HDQuoteInfo/HDQuoteInfo';
import iconsCalendar from './icons/Icons_Calendar.svg';
import iconsCalendarBlue from './icons/Icons_Calendar_blue.svg';

const StyledHDLabel = styled(HDLabel)`
    margin-bottom: 38px;
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDDatePickerRefactor instead.
 */
function HDDatePicker(props) {
    const {
        minDate,
        maxDate,
        hidePicker,
        value,
        onBlur,
        onChange,
        label,
        subLabel,
        id,
        path,
        name,
        className,
        showFieldsNames,
        information,
        theme
    } = props;
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [hidden, setHidden] = useState(true);
    const [initialValueOnMount, setInitialValueOnMount] = useState(_.isDate(value));

    const isNullOrBlank = useCallback((v) => {
        return _.isNil(v) || _.isNaN(v) || v === '' || v === undefined;
    }, []);

    const isNotNullOrBlank = useCallback((v) => {
        return !isNullOrBlank(v);
    }, [isNullOrBlank]);

    const customOnBlurEvent = (e) => {
        if (isNotNullOrBlank(day) && isNotNullOrBlank(month) && isNotNullOrBlank(year)) {
            onBlur(e);
        }
        if (e.target.name === 'day') setDay(e.target.value ? String(e.target.value).padStart(2, '0') : '');
        if (e.target.name === 'month') setMonth(e.target.value ? String(e.target.value).padStart(2, '0') : '');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const customNativeOnChangeHandler = useCallback((date) => {
        /**
         * @param {number | date} eventValue
         * @param {string} targetName internal formik filed name
         * @param {string} eventPath VM path to data
         * @returns {{target: {getAttribute: target.getAttribute, name: *, value: *}}}
         */
        const wrappedEvent = (eventValue, targetName, eventPath) => {
            return {
                target: {
                    value: eventValue,
                    name: targetName, // used in formik internal state to handle values
                    getAttribute: (attr) => {
                        if (attr === 'path') {
                            return eventPath;
                        }

                        return '';
                    }
                }
            };
        };

        // fire onChange if this is not first default value
        if (!initialValueOnMount) {
            if (!_.isNil(date) && date !== '' && date !== undefined) {
                // set main value
                onChange(wrappedEvent(date, name, path));
            } else {
                onChange(wrappedEvent(undefined, name, path));
            }
        }
    });

    const setDateFields = useCallback((date) => {
        // update vm
        customNativeOnChangeHandler(date);

        // update three inputs
        if (date != null) {
            setDay(date.getDate() ? String(date.getDate()).padStart(2, '0') : '');
            setMonth(date.getMonth() + 1 ? String(date.getMonth() + 1).padStart(2, '0') : '');
            setYear(date.getFullYear());
        } else {
            setDay(null);
            setMonth(null);
            setYear(null);
        }
    }, [customNativeOnChangeHandler]);

    const handleCalClick = useCallback(() => {
        setHidden(!hidden);
    }, [hidden]);

    const dateFromInputsFn = () => {
        return new Date(new Date(year, month - 1, day, 0, 0, 0, 0).setFullYear(year));
    };

    const calendarImage = theme === 'blue' ? iconsCalendarBlue : iconsCalendar;

    useEffect(() => {
        if (isNotNullOrBlank(day) && isNotNullOrBlank(month) && isNotNullOrBlank(year)) {
            // This supports date before 1900
            const inputDate = dateFromInputsFn();
            // update underlying states only if date has changed against previous
            // on mount do not sent event of change
            if (!_.isNaN(inputDate)) {
                // check month
                if (inputDate.getMonth() !== parseInt(month, 10) - 1) {
                    // day used outside of the month
                    // like 32 day of March
                    customNativeOnChangeHandler('');
                } else {
                    // all is good pass event to formik
                    customNativeOnChangeHandler(inputDate);

                    // after mount with default revers flag and sent update event
                    if (initialValueOnMount) {
                        setInitialValueOnMount(false);
                    }
                }
            }
        } else if (isNullOrBlank(day) || isNullOrBlank(month) || isNullOrBlank(year)) {
            // value is already provided, but user removed one of input - like day
            customNativeOnChangeHandler('');
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [day, month, year]);

    useEffect(() => {
        // use three inputs provided by user if
        const dateFromInputs = dateFromInputsFn();

        // Clear only when all inputs [day, month, year]
        // but not clear when user input is wrong (like 32nd day of month
        const isDateOfMonthNotInCurrentMonth = !(dateFromInputs.getMonth() !== parseInt(month, 10) - 1);
        if (!_.isDate(value) && isNotNullOrBlank(day) && isNotNullOrBlank(month) && isNotNullOrBlank(year) && isDateOfMonthNotInCurrentMonth) {
            setDay('');
            setMonth('');
            setYear('');
        }

        if (_.isDate(value) && dateFromInputs.getTime() !== value.getTime()) {
            // restore incoming value
            setDay(value.getDate() ? String(value.getDate()).padStart(2, '0') : null);
            setMonth(value.getMonth() + 1 ? String(value.getMonth() + 1).padStart(2, '0') : null);
            setYear(value.getFullYear());
        }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]);

    const stripAllNonNumeric = (val) => {
        if (_.isString(val)) {
            return val.replace(/\D/g, '');
        }
        return val;
    };

    const handleDayChange = ({ target: { value: nextDay } }) => {
        const numericValue = stripAllNonNumeric(nextDay);
        if (nextDay.length <= 2 || (_.isNumber(numericValue) && numericValue < 100)) {
            setDay(numericValue);
        }
    };

    const handleMonthChange = ({ target: { value: nextMonth } }) => {
        const numericValue = stripAllNonNumeric(nextMonth);
        if (nextMonth.length <= 2 || (_.isNumber(numericValue) && numericValue < 100)) {
            setMonth(numericValue);
        }
    };

    const handleYearChange = ({ target: { value: nextYear } }) => {
        const numericValue = stripAllNonNumeric(nextYear);
        if (nextYear.length <= 4 || (_.isNumber(numericValue) && numericValue < 10000)) {
            setYear(parseInt(numericValue, 10));
        }
    };

    const addDays = (theDate, days) => {
        return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
    };

    const substractDays = (theDate, days) => {
        return new Date(theDate.getTime() - days * 24 * 60 * 60 * 1000);
    };

    return (
        <div id="hastingDateControl" className={`${className} hastings-date-control hastings-date-control-${theme}`}>
            {label && (<StyledHDLabel className="hastings-date-control-label" {...label} />)}
            {subLabel && (
                <StyledHDLabel className="hastings-date-control-sublabel" {...subLabel} />)}
            {value && (
                <input
                    path={path}
                    name={name}
                    value={value}
                    type="hidden" />
            )}

            <div className="hastings-date-fields">
                <div className="fields">
                    <div>
                        {showFieldsNames && <div>{constants.dayFieldName}</div>}
                        <input
                            id="hastingDateControlDay"
                            className="hastings-date-dd"
                            type="string"
                            pattern="/[^0-9]/g"
                            placeholder="DD"
                            value={day || ''}
                            name="day"
                            onChange={handleDayChange}
                            onBlur={customOnBlurEvent}
                            min="1"
                            max="31" />
                    </div>
                    <div>
                        {showFieldsNames && <div>{constants.monthFieldName}</div>}
                        <input
                            id="hastingDateControlMonth"
                            className="hastings-date-mm"
                            type="string"
                            pattern="/[^0-9]/g"
                            name="month"
                            placeholder="MM"
                            value={month || ''}
                            onChange={handleMonthChange}
                            onBlur={customOnBlurEvent}
                            min="1"
                            max="12" />
                    </div>
                    <div>
                        {showFieldsNames && <div>{constants.yearFieldName}</div>}
                        <input
                            id="hastingDateControlYear"
                            className="hastings-date-yyyy"
                            type="string"
                            pattern="/[^0-9]/g"
                            name="year"
                            placeholder="YYYY"
                            value={year || ''}
                            onChange={handleYearChange}
                            onBlur={customOnBlurEvent} />
                    </div>
                </div>
                <div className="hastings-cal-icon" hidden={hidePicker}>
                    <HDOverlayPopup
                        id="hastingsDatePickerlOverlay"
                        overlayButtonIcon={(
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                            <img
                                src={calendarImage}
                                alt="Icons_Calendar_img"
                                onClick={handleCalClick} />
                        )}
                    >
                        <div id="datePickerOverlayContainer" className="datepickerroverlaycontainer">
                            <p
                                id="datePickerStartDate"
                                className="datepickerroverlayheader"
                            >
                                {constants.START_DATE}
                            </p>
                            {!!information && (
                                <HDQuoteInfo>
                                    <span>{information}</span>
                                </HDQuoteInfo>
                            )}
                            <DatePicker
                                selected={value}
                                dateFormat={constants.dateFormat}
                                onChange={(dateSel) => setDateFields(dateSel)}
                                inline
                                id={id}
                                minDate={substractDays(new Date(), minDate || 0)}
                                maxDate={addDays(new Date(), maxDate || 365)} />
                        </div>
                    </HDOverlayPopup>
                </div>
            </div>
        </div>
    );
}

HDDatePicker.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    minDate: PropTypes.number,
    maxDate: PropTypes.number,
    hidePicker: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.shape({
            getDate: PropTypes.func,
            getMonth: PropTypes.func,
            getFullYear: PropTypes.func,
            getTime: PropTypes.func,
        }),
        PropTypes.string]),
    onBlur: PropTypes.func,
    onConfirm: PropTypes.func,
    label: PropTypes.shape(HDLabel.PropTypes),
    subLabel: PropTypes.shape(HDLabel.PropTypes),
    onChange: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    showFieldsNames: PropTypes.bool,
    information: PropTypes.string,
    theme: PropTypes.string,
};

HDDatePicker.defaultProps = {
    path: 'path.to.input',
    name: 'input-name',
    minDate: 0,
    maxDate: 365,
    hidePicker: false,
    value: undefined,
    onBlur: () => { },
    onConfirm: () => { },
    onChange: () => { },
    label: null,
    subLabel: null,
    id: '',
    className: '',
    showFieldsNames: false,
    information: null,
    theme: 'dark',
};

// avoid obfuscation problem with types
HDDatePicker.typeName = 'HDDatePicker';

export default HDDatePicker;
