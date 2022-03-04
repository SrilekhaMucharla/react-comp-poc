import React from 'react';
import PropTypes from 'prop-types';
// import './HDButtonDashed.scss';
import classNames from 'classnames';
import plusIcon from '../../icons/Icon-before.svg';

const HDButtonDashed = ({
    id,
    label,
    icon,
    onClick,
    onKeyDown,
    tabIndex,
    disabled,
    theme,
    className
}) => {
    const onButtonClick = () => {
        const eventValue = {
            target: {
                value: label
            }
        };
        if (!disabled) onClick(eventValue);
    };
    return (
        <div
            id={id}
            tabIndex={tabIndex}
            role="button"
            onKeyDown={onKeyDown}
            className={classNames(disabled && 'disabled', `btn-dashed--${theme}`, className)}
            onClick={onButtonClick}
        >
            {icon && <img className="icon" src={plusIcon} alt="Plus" />}
            {label && <div className="text">{label}</div>}
        </div>
    );
};

HDButtonDashed.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.bool,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    theme: PropTypes.oneOf(['dark', 'light']),
    className: PropTypes.string
};

HDButtonDashed.defaultProps = {
    id: null,
    label: null,
    icon: false,
    onClick: () => { },
    onKeyDown: () => { },
    tabIndex: 0,
    disabled: false,
    theme: 'dark',
    className: null
};

export default HDButtonDashed;
