/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import PropTypes from 'prop-types';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';
// import './HDToggleButtonGroup.scss';

const HDToggleButton = PropTypes.shape({
    icon: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    name: PropTypes.string,
    content: PropTypes.node,
    onChange: PropTypes.func,
});

/*
 * @param {string} propTypes.path - string, in VM use this for PATH to value
 * @param {string} propTypes.name - string, in VM is just a fieldname
 * @param {string} propTypes.label - @see {HDLabel.propTypes}
 * @param {onChange} propTypes.onChange - onChange handler
 * @param {string} propTypes.availableValues - array of HDToggleButton
 * @param {string} propTypes.customClassName - additional classes for styling
 * @param {string} propTypes.btnGroupClassName - additional classes for styling button groups (grid helpers recommended)
 */

const HDToggleButtonGroup = ({
    path,
    name,
    value,
    label,
    onChange,
    availableValues,
    className,
    customClassName,
    btnGroupClassName,
    btnClassName,
    doReset,
    data,
    type,
    children,
    disabled
}) => {
    if (!path) {
        return ('');
    }

    const extractedValue = value && value.value ? value.value : value;
    const [val, setVal] = useState(extractedValue);
    const [prevVal, setPrevVal] = useState(extractedValue);
    const handleChange = (displayValue) => (event) => {
        event.target.setAttribute('previousvalue', prevVal);
        event.target.setAttribute('path', path);
        // eslint-disable-next-line no-param-reassign
        event.target.label = displayValue;
        if (event.target.type !== 'radio') {
            setVal(event.target.checked);
        } else {
            setVal(event.target.value);
        }
        onChange(event);
    };


    useEffect(() => {
        if (doReset) {
            setVal(null);
        } else if (data) {
            setVal(data);
        } else {
            setVal(extractedValue);
        }
        setPrevVal(val);
    }, [doReset, data, value]);

    return (
        <div className={`${customClassName} ${className}`}>
            {label && (<HDLabelRefactor {...label} />)}
            {children}
            <ToggleButtonGroup type={type || 'radio'} name={name} value={val} className={btnGroupClassName}>
                {availableValues.map((availableValue) => (
                    <ToggleButton
                        variant="default"
                        className={btnClassName}
                        key={availableValue.value}
                        value={availableValue.value}
                        onChange={handleChange(availableValue.name)}
                        type={type || 'radio'}
                        disabled={disabled}
                        checked={val}
                    >
                        {availableValue.content ? availableValue.content : (
                            <div>
                                {!!availableValue.icon && (
                                    <div>
                                        <i className={`fas fa-${availableValue.icon} fa-lg`} />
                                    </div>
                                )}
                                {!!availableValue.name && (
                                    <div>
                                        {availableValue.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </div>
    );
};

HDToggleButton.defaultProps = {
    icon: null,
    onChange: () => {
    }
};

HDToggleButtonGroup.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    label: PropTypes.shape(HDLabelRefactor.propTypes),
    onChange: PropTypes.func,
    availableValues: PropTypes.arrayOf(HDToggleButton).isRequired,
    className: PropTypes.string,
    customClassName: PropTypes.string,
    btnGroupClassName: PropTypes.string,
    btnClassName: PropTypes.string,
    doReset: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.any,
    type: PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool,
};

HDToggleButtonGroup.defaultProps = {
    path: 'path.to.toggle-button',
    name: 'toggle-button-name',
    value: '',
    label: null,
    onChange: () => {
    },
    className: '',
    customClassName: '',
    btnGroupClassName: '',
    btnClassName: '',
    doReset: false,
    data: null,
    type: 'radio',
    children: null,
    disabled: false,
};

// avoid obfuscation problem with types
HDToggleButtonGroup.typeName = 'HDToggleButtonGroup';

export default HDToggleButtonGroup;
