/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, {
    forwardRef, useState, useEffect, useRef
} from 'react';
import { FormControl, InputGroup, FormLabel } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import iconTick from './Icons_Tick.svg';

const REGEX = {
    alpha: /[^A-Za-z\s'-]/g,
    alphanum: /[^A-Za-z0-9\s'-]/g,
    number: /[^0-9]/g,
    postcode: /[^A-Z0-9\s]/g
};

const HDTextInputRefactor = forwardRef(({
    reference,
    path,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyPress,
    className,
    customClassName,
    icon,
    svgIcon,
    appendLabel,
    appendContent,
    size,
    mask,
    maskChar,
    placeholder,
    type,
    id,
    maxLength,
    reset,
    data,
    disabled,
    children,
    preText,
    tickIcon,
    thousandSeprator,
    allowLeadingZero,
    inputMode,
    isInvalidCustom
}, ref) => {
    const [cursor, setCursor] = useState(0);
    const [textValue, setTextValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const inputRef = ref || reference || useRef(null);

    useEffect(() => {
        // not every type of input supports selection (check to avoid errors)
        if (document.activeElement === inputRef.current && inputRef.current.selectionStart && inputRef.current.selectionStart !== cursor) {
            inputRef.current.selectionStart = cursor;
            inputRef.current.selectionEnd = cursor;
        }
    });

    const formatCurrency = (v) => {
        let digitsVal = (v) ? v.replace(/[^0-9.]/g, '') : '';
        const dotIndex = digitsVal.indexOf('.');
        if (dotIndex === 0) {
            digitsVal = digitsVal.replace('.', '');
        } else if (dotIndex < 0) {
            digitsVal = digitsVal ? parseInt(digitsVal, 10).toString() : '';
        } else if (dotIndex > 0) {
            const intPart = digitsVal.substring(0, dotIndex);
            const fractPart = digitsVal.substr(dotIndex + 1, 2).replace(/\./g, '');
            return `${intPart}.${fractPart}`;
        }
        return digitsVal;
    };

    const formatValue = (v) => {
        if (v && thousandSeprator) {
            const newValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const separatorsNumber = (newValue.match(/,/g) || []).length - (inputValue.match(/,/g) || []).length;
            if (separatorsNumber > 0) {
                setCursor((prevCursor) => prevCursor + separatorsNumber);
            }

            return newValue;
        }
        return v !== null && v !== undefined ? v : '';
    };

    useEffect(() => {
        if (reset) {
            setTextValue('');
        } else if (data) {
            setTextValue(data);
        } else {
            setTextValue(formatValue(value));
            setInputValue(formatValue(value));
        }
    }, [reset, data, value]);

    const formatNumber = (v) => {
        if (v) {
            const val = v.replace(REGEX.number, '');
            const intVal = parseInt(val, 10);
            return val ? allowLeadingZero ? val : intVal.toString() : '';
        }
        return '';
    };

    const capitalize = (val) => ((val) ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '');

    const replaceName = (val, replacer) => val.replace(/\s+/g, ' ').replace(/(\s)?(-)+(\s)?/g, '-')
        .replace(/(\s)?(')+(\s)?/g, '\'').replace(/([^\s-]+)/g, replacer);

    const formatNameSegment = (val) => {
        if (!val) {
            return '';
        }
        const indexOfApostrophe = val.indexOf('\'');
        if (indexOfApostrophe === 1) {
            const firstPart = val.substring(0, indexOfApostrophe);
            const secondPart = val.slice(indexOfApostrophe + 1);
            return `${firstPart}'${capitalize(secondPart)}`;
        }
        const caplitalized = capitalize(val);
        if (caplitalized.indexOf('Mc') === 0) {
            const secondPart = val.slice(2);
            return `Mc${capitalize(secondPart)}`;
        }
        return caplitalized;
    };

    const formatName = (val) => replaceName(val, formatNameSegment);

    const formatPhone = (val) => val.replace(REGEX.number, '').substring(0, maxLength);

    function handleChange(event) {
        const eventValue = event.target.value;

        const functions = {
            currency: (val) => formatCurrency(val),
            number: (val) => formatNumber(val),
            numberOnly: (val) => formatNumber(val),
            alpha: (val) => val.replace(REGEX.alpha, ''),
            alphanum: (val) => val.replace(REGEX.alphanum, ''),
            postcode: (val) => val.toUpperCase().replace(REGEX.postcode, ''),
            mask: (val) => val.toUpperCase(),
            password: (val) => val,
            email: (val) => val,
            firstName: (val) => formatName(val),
            lastName: (val) => formatName(val),
            phone: (val) => formatPhone(val),
            text: (val) => val
        };

        if (type) {
            const newValue = functions[type](eventValue);
            // eslint-disable-next-line no-param-reassign
            event.target.value = newValue;
            onChange(event);
        } else {
            onChange(event);
        }
    }

    function handleEventChange(event) {
        setCursor(event.target.selectionStart);
        handleChange(event);
    }

    const renderIcon = (content, isSvg) => (
        content && (
            <InputGroup.Prepend className="hd-text-input__input-group__prepend">
                <InputGroup.Text className="hd-text-input__input-group__text">
                    {isSvg ? <img src={content} alt="" /> : <i className={`fas fa-${content}`} />}
                </InputGroup.Text>
            </InputGroup.Prepend>
        )
    );

    const renderText = (content) => (
        content && (
            <InputGroup.Prepend className="hd-text-input__input-group__prepend">
                <InputGroup.Text className="hd-text-input__input-group__text">
                    {content}
                </InputGroup.Text>
            </InputGroup.Prepend>
        )
    );

    const renderAppend = (content) => (
        content && (
            <InputGroup.Append className="hd-text-input__input-group__append">
                <InputGroup.Text className="hd-text-input__input-group__append__text">
                    {content}
                </InputGroup.Text>
            </InputGroup.Append>
        )
    );

    const topMarginSize = classNames(
        { 'append-size-sm': size === 'sm' },
        { 'append-size-md': size === 'md' },
        { 'append-size-lg': size === 'lg' },
    );

    return (
        <InputGroup
            className={`${className} ${customClassName}${children ? ' has-children' : ''}${isInvalidCustom ? ' input-group--invalid' : ''}`}
            size={size}
        >
            {renderIcon(icon, false)}
            {renderIcon(svgIcon, true)}
            {renderText(preText)}
            {appendLabel ? (
                <React.Fragment>
                    <FormControl
                        className="hd-text-input__form-control-with-append-label"
                        id={id}
                        ref={inputRef}
                        path={path}
                        name={name}
                        inputMode={inputMode}
                        data-testid="text-input-with-append"
                        value={inputValue}
                        onChange={handleEventChange}
                        onKeyPress={onKeyPress}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        maxLength={maxLength}
                        placeholder={placeholder} />
                    <FormLabel
                        className={`hd-text-input__form-control-with-append-label__append-label ${topMarginSize}`}
                        data-testid="append-label"
                        size={size}
                    >
                        {appendLabel}
                    </FormLabel>
                </React.Fragment>
            ) : ((type === 'mask' && mask) ? (
                <InputMask
                    className="form-control hd-text-input__input-mask"
                    id={id}
                    inputRef={inputRef}
                    path={path}
                    name={name}
                    data-testid="masked-input"
                    value={value}
                    onChange={handleEventChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyPress={onKeyPress}
                    mask={mask}
                    maskChar={maskChar}
                    maxLength={maxLength}
                    alwaysShowMask />
            ) : (
                <FormControl
                    className="hd-text-input__form-control"
                    id={id}
                    ref={inputRef}
                    path={path}
                    name={name}
                    type={type}
                    inputMode={inputMode}
                    data-testid="text-input"
                    value={textValue}
                    disabled={disabled}
                    onChange={handleEventChange}
                    onBlur={onBlur}
                    onKeyPress={onKeyPress}
                    onFocus={onFocus}
                    maxLength={maxLength}
                    placeholder={placeholder} />
            ))}
            {renderAppend(appendContent)}
            {tickIcon && (
                <div className="hd-text-input__tick-icon">
                    <img className="hd-text-input__tick-icon__img" src={iconTick} alt="tick" />
                </div>
            )}
            <i className="fa fa-exclamation exclam hd-text-input__exclam" />
            {children && children}
        </InputGroup>
    );
});

HDTextInputRefactor.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    className: PropTypes.string,
    customClassName: PropTypes.string,
    icon: PropTypes.string,
    svgIcon: PropTypes.node,
    appendLabel: PropTypes.string,
    appendContent: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'lg']),
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    maxLength: PropTypes.string,
    type: PropTypes.oneOf(['alphanum', 'alpha', 'number', 'currency', 'postcode', 'mask', 'password', 'email', 'numberOnly', 'firstName', 'lastName']),
    reset: PropTypes.bool,
    data: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    preText: PropTypes.string,
    tickIcon: PropTypes.bool,
    thousandSeprator: PropTypes.bool,
    allowLeadingZero: PropTypes.bool,
    inputMode: PropTypes.oneOf(['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url']),
    isInvalidCustom: PropTypes.bool
};

HDTextInputRefactor.defaultProps = {
    path: 'path.to.input',
    name: 'input-name',
    value: '',
    onChange: () => { },
    onBlur: () => { },
    onFocus: () => {},
    onKeyPress: () => {},
    className: '',
    customClassName: '',
    icon: null,
    svgIcon: null,
    appendLabel: null,
    appendContent: null,
    size: null,
    mask: null,
    maskChar: '_',
    placeholder: null,
    type: null,
    id: '',
    maxLength: null,
    reset: false,
    data: null,
    disabled: false,
    children: null,
    preText: null,
    tickIcon: false,
    thousandSeprator: false,
    allowLeadingZero: false,
    inputMode: null,
    isInvalidCustom: null
};

// avoid obfuscation problem with types
HDTextInputRefactor.typeName = 'HDTextInput';

export default HDTextInputRefactor;
