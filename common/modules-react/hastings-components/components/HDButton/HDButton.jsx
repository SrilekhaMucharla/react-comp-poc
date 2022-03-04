import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { sendEventData } from '../../../../../applications/quote-and-buy/src/redux-thunk/actions';
// import styles from './HDButtonRefactor.module.scss';

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDButtonRefactor instead.
 */
function HDButton(props) {
    const {
        label, variant, disabled, type, onClick, children, fullWidth, className, size
    } = props;
    const btnClass = classNames(
        { 'hastings-btn': true },
        { 'hastings-btnprimary': variant === 'btnprimary' },
        { 'hastings-btnsecondary': variant === 'btnsecondary' },
        { 'hastings-btntertiary': variant === 'btntertiary' },
        { 'hastings-cardbutton': variant === 'cardbutton' },
        { 'hastings-btnsecondary-large': variant === 'btnsecondarylarge' }
    );
    const buttonClick = (event) => {
        event.target.value = label;
        onClick(event);
    };

    return (
        <Button
            type={type}
            variant={variant}
            className={`${btnClass} ${className}`}
            disabled={disabled}
            onClick={buttonClick}
            block={fullWidth}
            size={size}
        >
            {children}
            {label}
        </Button>
    );
}

HDButton.propTypes = {
    variant: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    // eslint-disable-next-line react/require-default-props
    onClick: PropTypes.func,
    children: PropTypes.node,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg'])
};

HDButton.defaultProps = {
    variant: 'btnprimary',
    label: 'button',
    type: 'button',
    disabled: false,
    children: null,
    fullWidth: false,
    className: '',
    size: null,
    onClick: () => {}
};

export default HDButton;
