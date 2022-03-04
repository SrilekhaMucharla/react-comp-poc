/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import HDLabel from '../HDLabel/HDLabel';
import theme from "../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss";
// import './HDCheckbox.scss';

const StyledToggleButton = styled.div`
    
`;

const StyledHDLabel = styled(HDLabel)`
    margin-bottom: 38px;
    color: ${theme.secondaryTextColor};
`;


const HDToggleButton = PropTypes.shape({
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
 * @param {string} propTypes.className - additional class for styling
 */

const HDCheckbox = ({
    path,
    name,
    value,
    label,
    text,
    onChange,
    className,
    doReset,
    data
}) => {
    if (!path) {
        return ('');
    }

    const [val, setVal] = useState(value);
    const [prevVal, setPrevVal] = useState(value);
    const handleChange = (event) => {
        event.target.setAttribute('previousvalue', prevVal);
        event.target.setAttribute('path', path);
        setVal(event.target.checked);
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
        <StyledToggleButton className={className}>
            {label && (<StyledHDLabel {...label} />)}
            <ButtonGroup toggle type="checkbox" name={name} value={val}>
                <ToggleButton
                    variant="default"
                    value={val}
                    onChange={handleChange}
                    type="checkbox"
                    checked={val}
                    name={name}
                >
                    <div>
                        {!!text && (
                            <div>
                                {text}
                            </div>
                        )}
                    </div>
                </ToggleButton>
            </ButtonGroup>
        </StyledToggleButton>
    );
};

HDCheckbox.defaultProps = {
    onChange: () => {
    }
};

HDCheckbox.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    label: PropTypes.shape(HDLabel.propTypes),
    onChange: PropTypes.func,
    availableValues: PropTypes.arrayOf(HDToggleButton).isRequired,
    className: PropTypes.string,
    doReset: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.any,
    type: PropTypes.string,
    text: PropTypes.string,
};

HDCheckbox.defaultProps = {
    path: 'path.to.toggle-button',
    name: 'toggle-button-name',
    value: '',
    label: null,
    onChange: () => {
    },
    className: '',
    doReset: false,
    data: null,
    type: 'checkbox',
    text: ''
};

// avoid obfuscation problem with types
HDCheckbox.typeName = 'HDCheckbox';

export default HDCheckbox;
