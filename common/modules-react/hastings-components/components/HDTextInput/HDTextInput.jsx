/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, {
    forwardRef, useState, useEffect, useRef
} from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
// import theme from '../../custom-bootstrap-branding-variables.scss';
import theme from '../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss';
import iconTick from './Icons_Tick.svg';

const StyledInputPrepend = styled(InputGroup.Prepend)`
  flex: 0 0 48px;
  height: 60px;
  font-family: CharlesWright-Bold;
  .input-group-text {
    width: 3.75em;
    justify-content: center;
    background: ${theme.commonCompoBGColorBlueLight};
    color: #ffffff;
    border-color: #000000;
  }
`;

const StyledFormControl = styled(FormControl)`
  border-color: #000000;
  font-family: ${theme.genericFontFace};
  height: 60px !important;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  color: ${theme.commonCompoTextColorBlueDark};
  &:focus {
    border-color: #000000;
    box-shadow: 0 0 2px #000000;
  }
`;

const StyledFormControlWithAppendLabel = styled(FormControl)`
  border-color: #000000;
  border-top-right-radius: 0.25rem !important;
  border-bottom-right-radius: 0.25rem !important;
  height: 60px !important;
  font-family: ${theme.genericFontFace};
  font-size: 26px;
  font-weight: 600;
  line-height: 1.35;
  color: ${theme.commonCompoTextColorBlueDark};
  &:focus {
    border-color: #000000;
    box-shadow: 0 0 2px #000000;
  }
`;

const StyledAppendLabel = styled.label`
  position: absolute;
  right: 15px;
  top: ${(props) => (props.size === 'sm' ? '3px' : (props.size === 'lg' ? '10px' : '18px'))};
  font-family: ${theme.genericFontFace};
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  color: ${theme.tertiaryTextColor};
`;

const StyledInputMask = styled(InputMask)`
  border-color: #000000;
  font-family: ${theme.genericFontFace};
  height: 60px !important;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.35;
  color: ${theme.commonCompoTextColorBlueDark};
  &:focus {
    border-color: #000000;
    box-shadow: 0 0 2px #000000;
  }
`;

const StyledTickIcon = styled('div')`
    z-index: 20;
    position: absolute;
    right: -8px;
    top: -12px;

    img {
        width: 24px;
        height: 24px;
    }
`;

const REGEX = {
    alpha: /[^A-Za-z\s'-]/g,
    alphanum: /[^A-Za-z0-9\s'-]/g,
    number: /[^0-9]/g,
    postcode: /[^A-Z0-9\s]/g
};

/**
 * @deprecated Use HDTextInputRefactor instead.
 */
const HDTextInput = forwardRef(({
    path,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    className,
    icon,
    svgIcon,
    appendLabel,
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
    allowLeadingZero
}, ref) => {
    const [cursor, setCursor] = useState(0);
    const [textValue, setTextValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const inputRef = ref || useRef(null);
    useEffect(() => {
        // not every type of input supports selection (check to avoid errors)
        if (inputRef.current.selectionStart) {
            inputRef.current.selectionStart = cursor;
            inputRef.current.selectionEnd = cursor;
        }
    });

    const formatCurrency = (v) => {
        const digitsVal = (v) ? v.replace(/[^0-9.]/g, '') : '';
        const dotIndex = digitsVal.indexOf('.');
        if (dotIndex === 0) {
            return digitsVal.replace('.', '');
        }
        if (dotIndex > 0) {
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
        if (v) {
            return v;
        }
        return '';
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
            if (val && allowLeadingZero) {
                return val.toString();
            } if (val) {
                return parseInt(val, 10).toString();
            }
            return '';
        }
        return '';
    };

    function handleChange(event) {
        const eventValue = event.target.value;

        const functions = {
            currency: (val) => { return formatCurrency(val); },
            number: (val) => { return formatNumber(val); },
            numberOnly: (val) => { return formatNumber(val); },
            alpha: (val) => { return val.replace(REGEX.alpha, ''); },
            alphanum: (val) => { return val.replace(REGEX.alphanum, ''); },
            postcode: (val) => { return val.toUpperCase().replace(REGEX.postcode, ''); },
            mask: (val) => { return val.toUpperCase(); },
            password: (val) => { return val; },
            email: (val) => { return val; }
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
            <StyledInputPrepend>
                <InputGroup.Text>
                    {isSvg ? <img src={content} alt="" /> : <i className={`fas fa-${content}`} />}
                </InputGroup.Text>
            </StyledInputPrepend>
        )
    );
    const renderText = (content) => (
        content && (
            <StyledInputPrepend>
                <InputGroup.Text>
                    {content}
                </InputGroup.Text>
            </StyledInputPrepend>
        )
    );
    return (
        <InputGroup className={className} size={size}>
            {renderIcon(icon, false)}
            {renderIcon(svgIcon, true)}
            {renderText(preText)}
            {appendLabel ? (
                <React.Fragment>
                    <StyledFormControlWithAppendLabel
                        id={id}
                        ref={inputRef}
                        path={path}
                        name={name}
                        data-testid="text-input-with-append"
                        value={inputValue}
                        onChange={handleEventChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        maxLength={maxLength}
                        placeholder={placeholder} />
                    <StyledAppendLabel data-testid="append-label" size={size}>{appendLabel}</StyledAppendLabel>
                </React.Fragment>
            ) : ((type === 'mask' && mask) ? (
                <StyledInputMask
                    id={id}
                    ref={inputRef}
                    path={path}
                    name={name}
                    data-testid="masked-input"
                    className="form-control"
                    value={value}
                    onChange={handleEventChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    mask={mask}
                    maskChar={maskChar}
                    maxLength={maxLength}
                    alwaysShowMask />
            ) : (
                <StyledFormControl
                    id={id}
                    ref={inputRef}
                    path={path}
                    name={name}
                    type={type}
                    data-testid="text-input"
                    className={`text-input${disabled ? '-disabled' : ''}`}
                    value={textValue}
                    disabled={disabled}
                    onChange={handleEventChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    maxLength={maxLength}
                    placeholder={placeholder} />
            ))}
            {tickIcon && <StyledTickIcon><img className="tick-icon" src={iconTick} alt="tick" /></StyledTickIcon>}
            {children && children}
        </InputGroup>
    );
});

HDTextInput.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    icon: PropTypes.string,
    svgIcon: PropTypes.node,
    appendLabel: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    maxLength: PropTypes.string,
    type: PropTypes.oneOf(['alphanum', 'alpha', 'number', 'currency', 'postcode', 'mask', 'password', 'email']),
    reset: PropTypes.bool,
    data: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    preText: PropTypes.string,
    onFocus: PropTypes.func,
    tickIcon: PropTypes.bool,
    thousandSeprator: PropTypes.bool,
    allowLeadingZero: PropTypes.bool
};

HDTextInput.defaultProps = {
    path: 'path.to.input',
    name: 'input-name',
    value: '',
    onChange: () => { },
    onBlur: () => { },
    onFocus: () => { },
    className: null,
    icon: null,
    svgIcon: null,
    appendLabel: null,
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
    allowLeadingZero: false
};

// avoid obfuscation problem with types
HDTextInput.typeName = 'HDTextInput';

export default HDTextInput;
