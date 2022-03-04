/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import HDLabel from '../HDLabel/HDLabel';
import theme from '../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss';
// import './HDToggleButtonGroup.scss';

const StyledHDLabel = styled(HDLabel)`
    margin-bottom: 38px;
    color: ${theme.secondaryTextColor};
`;


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

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDToggleButtonGroupRefactor instead.
 */
const HDToggleButtonGroup = ({
    path,
    name,
    value,
    label,
    onChange,
    availableValues,
    customClassName,
    btnGroupClassName,
    doReset,
    data,
    type,
    children
}) => {
    if (!path) {
        return ('');
    }

    const [val, setVal] = useState(value);
    const [prevVal, setPrevVal] = useState(value);
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
            setVal(value);
        }
        setPrevVal(val);
    }, [doReset, data, value]);

    return (
        <div className={customClassName}>
            {label && (<StyledHDLabel {...label} />)}
            {children}
            <ToggleButtonGroup type={type || 'radio'} name={name} value={val} className={btnGroupClassName}>
                {availableValues.map((availableValue) => (
                    <ToggleButton
                        variant="default"
                        key={availableValue.value}
                        value={availableValue.value}
                        onChange={handleChange(availableValue.name)}
                        type={type || 'radio'}
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
    label: PropTypes.shape(HDLabel.propTypes),
    onChange: PropTypes.func,
    availableValues: PropTypes.arrayOf(HDToggleButton).isRequired,
    customClassName: PropTypes.string,
    btnGroupClassName: PropTypes.string,
    doReset: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.any,
    type: PropTypes.string,
    children: PropTypes.node
};

HDToggleButtonGroup.defaultProps = {
    path: 'path.to.toggle-button',
    name: 'toggle-button-name',
    value: '',
    label: null,
    onChange: () => {
    },
    customClassName: '',
    btnGroupClassName: '',
    doReset: false,
    data: null,
    type: 'radio',
    children: null
};

// avoid obfuscation problem with types
HDToggleButtonGroup.typeName = 'HDToggleButtonGroup';

export default HDToggleButtonGroup;
