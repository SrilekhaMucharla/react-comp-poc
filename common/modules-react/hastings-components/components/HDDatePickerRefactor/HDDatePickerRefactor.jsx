import React, {
    useCallback, useEffect, useState, useRef
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import HDOverlayPopup from '../HDOverlayPopup/HDOverlayPopup';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';

import * as constants from './HDDatePickerConst';
import HDQuoteInfoRefactor from '../HDQuoteInfoRefactor/HDQuoteInfoRefactor';
import iconsCalendar from './icons/Icons_Calendar.svg';
import iconsCalendarBlue from './icons/Icons_Calendar_blue.svg';


function HDDatePickerRefactor(props) {
    const {
        minDate,
        maxDate,
        hidePicker,
        value,
        onBlur,
        onChange,
        onSelect,
        label,
        subLabel,
        id,
        path,
        name,
        className,
        customClassName,
        showFieldsNames,
        information,
        theme,
        inputStyle,
        pickerPos,
        inputCols,
        inputSectionCol,
        initialDate,
    } = props;
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [dayClicked, setDayClicked] = useState(false);
    const [monthClicked, setMonthClicked] = useState(false);
    const [yearClicked, setYearClicked] = useState(false);
    const [hidden, setHidden] = useState(true);
    const [initialValueOnMount, setInitialValueOnMount] = useState(_.isDate(value));
    const [closeOnSelect, setCloseOnSelect] = useState(false);
    const [triggerOnChangeEvent, setTriggerOnChangeEvent] = useState(true);
    const monthInputRef = useRef();
    const yearInputRef = useRef();

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
        if (e.target.name === 'day') {
            setDay(e.target.value ? String(e.target.value).padStart(2, '0') : '');
            setDayClicked(true);
        }
        if (e.target.name === 'month') {
            setMonth(e.target.value ? String(e.target.value).padStart(2, '0') : '');
            setMonthClicked(true);
        }
        if (e.target.name === 'year') {
            setYearClicked(true);
        }
    };

    const customNativeOnChangeHandler = useCallback((date) => {
        if (!triggerOnChangeEvent) {
            setTriggerOnChangeEvent(true);
            return;
        }

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
        setCloseOnSelect(false);
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
                    customNativeOnChangeHandler('invalid'); // invalid triggers typeError in YUP
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
    [day, month, year]);

    useEffect(() => {
        if (dayClicked && monthClicked && yearClicked) {
            onBlur('');
        }
    },
    [dayClicked, monthClicked, yearClicked]);

    useEffect(() => {
        // use three inputs provided by user if
        const dateFromInputs = dateFromInputsFn();

        if (_.isDate(value) && dateFromInputs.getTime() !== value.getTime()) {
            // restore incoming value
            setDay(value.getDate() ? String(value.getDate()).padStart(2, '0') : null);
            setMonth(value.getMonth() + 1 ? String(value.getMonth() + 1).padStart(2, '0') : null);
            setYear(value.getFullYear());

            customNativeOnChangeHandler(value);
            // when component detects changes in Day, Month, Year, do not sent onChangeRequest
            setTriggerOnChangeEvent(false);
        }
    },
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
            if (nextDay.length === 2) monthInputRef.current.focus();
        }
    };

    const handleMonthChange = ({ target: { value: nextMonth } }) => {
        const numericValue = stripAllNonNumeric(nextMonth);
        if (nextMonth.length <= 2 || (_.isNumber(numericValue) && numericValue < 100)) {
            setMonth(numericValue);
            if (nextMonth.length === 2) yearInputRef.current.focus();
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

    const dateInputsClass = classNames(
        { 'hd-date-picker__date-fields--thin': inputStyle === 'thin' },
    );

    const dateSelected = (e) => {
        onSelect(e);
        setCloseOnSelect(true);
    };

    const handleFocus = (event) => event.target.select();

    const pickerElement = (
        <div className="hd-date-picker__cal-icon">
            <HDOverlayPopup
                className="hd-date-picker__cal-overlay"
                id="hd-date-picker-overlay"
                overlayButtonIcon={(
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                    <img
                        src={calendarImage}
                        alt="Icons_Calendar_img"
                        onClick={handleCalClick} />
                )}
                labelText={constants.START_DATE}
                closeOnSelect={closeOnSelect}
            >
                <div id="hd-date-picker-overlay-container" className="hd-date-picker__overlay-container">
                    {!!information && (
                        <HDQuoteInfoRefactor>
                            <span>{information}</span>
                        </HDQuoteInfoRefactor>
                    )}
                    <DatePicker
                        selected={_.isDate(value) ? value : null}
                        dateFormat={constants.dateFormat}
                        onChange={(dateSel) => setDateFields(dateSel)}
                        onSelect={(e) => { dateSelected(e); onBlur({ ...e, target: { name: name } }); }}
                        inline
                        id={id}
                        minDate={substractDays((initialDate) || new Date(), minDate || 0)}
                        maxDate={addDays((initialDate) || new Date(), maxDate || 365)} />
                </div>
            </HDOverlayPopup>
        </div>
    );

    const labelElement = (
        label && (
            <HDLabelRefactor
                id="hd-date-picker-label"
                className="hd-date-picker__label"
                Tag="h2"
                {...label} />
        )
    );

    return (
        <div id={id} className={`${customClassName} ${className} hd-date-picker__date-control hd-date-picker__date-control__${theme}`}>
            {pickerPos === 'label-right' && !hidePicker
                ? (
                    <Row>
                        <Col xs="auto">{labelElement}</Col>
                        <Col className="pl-0">{pickerElement}</Col>
                    </Row>
                )
                : labelElement}
            {subLabel && (
                <HDLabelRefactor
                    id="hd-date-picker-sublabel"
                    className="hd-date-picker__label hd-date-picker__sublabel"
                    Tag="h2"
                    {...subLabel} />

            )}
            {value && (
                <input
                    path={path}
                    name={name}
                    value={value}
                    type="hidden" />
            )}

            <div className="hd-date-picker__date-fields">
                <Row>
                    <Col {...inputSectionCol}>
                        <Row>
                            <Col {...inputCols[0]}>
                                {showFieldsNames && <div className="hd-date-picker__date-fields__day-name">{constants.dayFieldName}</div>}
                                <input
                                    id="hd-date-picker-date-input-day"
                                    className={`form-control hd-date-picker__date-fields__day ${dateInputsClass}`}
                                    type="string"
                                    pattern="/[^0-9]/g"
                                    placeholder="DD"
                                    value={day || ''}
                                    name="day"
                                    onChange={handleDayChange}
                                    onBlur={customOnBlurEvent}
                                    onFocus={handleFocus}
                                    min="1"
                                    max="31"
                                    inputMode="numeric" />
                                <i className="fa fa-exclamation exclam hd-date-picker__exclam" />
                            </Col>
                            <Col {...inputCols[1]}>
                                {showFieldsNames && <div className="hd-date-picker__date-fields__month-name">{constants.monthFieldName}</div>}
                                <input
                                    ref={monthInputRef}
                                    id="hd-date-picker-date-input-month"
                                    className={`form-control hd-date-picker__date-fields__month ${dateInputsClass}`}
                                    type="string"
                                    pattern="/[^0-9]/g"
                                    name="month"
                                    placeholder="MM"
                                    value={month || ''}
                                    onChange={handleMonthChange}
                                    onBlur={customOnBlurEvent}
                                    onFocus={handleFocus}
                                    min="1"
                                    max="12"
                                    inputMode="numeric" />
                                <i className="fa fa-exclamation exclam hd-date-picker__exclam" />
                            </Col>
                            <Col {...inputCols[2]}>
                                {showFieldsNames && <div className="hd-date-picker__date-fields__year-name">{constants.yearFieldName}</div>}
                                <input
                                    ref={yearInputRef}
                                    id="hd-date-picker-date-input-year"
                                    className={`form-control hd-date-picker__date-fields__year ${dateInputsClass}`}
                                    type="string"
                                    pattern="/[^0-9]/g"
                                    name="year"
                                    placeholder="YYYY"
                                    value={year || ''}
                                    onChange={handleYearChange}
                                    onBlur={customOnBlurEvent}
                                    onFocus={handleFocus}
                                    inputMode="numeric" />
                                <i className="fa fa-exclamation exclam hd-date-picker__exclam" />
                            </Col>
                        </Row>
                    </Col>
                    {pickerPos === 'input-right' && !hidePicker && <Col xs={1} className="pl-0">{pickerElement}</Col>}
                </Row>
            </div>
        </div>
    );
}

HDDatePickerRefactor.propTypes = {
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
    onSelect: PropTypes.func,
    onConfirm: PropTypes.func,
    label: PropTypes.shape(HDLabelRefactor.PropTypes),
    subLabel: PropTypes.shape(HDLabelRefactor.PropTypes),
    onChange: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    customClassName: PropTypes.string,
    showFieldsNames: PropTypes.bool,
    information: PropTypes.string,
    theme: PropTypes.string,
    inputStyle: PropTypes.oneOf(['thin']),
    pickerPos: PropTypes.oneOf(['input-right', 'label-right']),
    inputCols: PropTypes.arrayOf(PropTypes.shape(Col.PropTypes)),
    inputSectionCol: PropTypes.arrayOf(PropTypes.shape(Col.PropTypes)),
    initialDate: PropTypes.object
};

HDDatePickerRefactor.defaultProps = {
    path: 'path.to.input',
    name: 'input-name',
    minDate: 0,
    maxDate: 365,
    hidePicker: false,
    value: undefined,
    onBlur: () => { },
    onConfirm: () => { },
    onChange: () => { },
    onSelect: () => { },
    label: null,
    subLabel: null,
    id: '',
    className: '',
    customClassName: '',
    showFieldsNames: false,
    information: null,
    theme: 'dark',
    inputStyle: null,
    pickerPos: 'input-right',
    inputCols: [],
    inputSectionCol: undefined,
    initialDate: null
};

// avoid obfuscation problem with types
HDDatePickerRefactor.typeName = 'HDDatePicker';

export default HDDatePickerRefactor;
