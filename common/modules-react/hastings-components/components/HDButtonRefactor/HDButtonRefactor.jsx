import React from 'react';
// import { connect, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { sendEventData } from '../../../../../applications/quote-and-buy/src/redux-thunk/actions';
// import styles from './HDButtonRefactor.module.scss';

function HDButtonRefactor(props) {
    // const {
    //     id, label, action, parent, variant, disabled, type, onClick, children, fullWidth, className, size
    // } = props;
    const {
        label, variant, disabled, type, onClick, children, fullWidth, className, size, id, onKeyPress
    } = props;
    // const dispatch = useDispatch();
    const btnClass = classNames(
        { 'hd-btn': true },
        { 'hd-btn-primary': variant === 'primary' },
        { 'hd-btn-secondary': variant === 'secondary' },
        { 'hd-btn-tertiary': variant === 'tertiary' },
        { 'hd-card-button': variant === 'card-button' },
        { 'hd-btn-secondary-large': variant === 'btn-secondary-large' },
        { 'hd-btn-default': variant === 'default' }
    );
    const buttonClick = (event) => {
        event.target.value = label;
        onClick(event);
    };
    return (
        <Button
            id={id}
            type={type}
            variant={variant}
            className={`${btnClass} ${className}`}
            disabled={disabled}
            onClick={buttonClick}
            block={fullWidth}
            size={size}
            onKeyPress={onKeyPress}
        >
            {children}
            {label}
        </Button>
    );
}

HDButtonRefactor.propTypes = {
    id: PropTypes.string,
    // action: PropTypes.string,
    // parent: PropTypes.string,
    variant: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    // eslint-disable-next-line react/require-default-props
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    children: PropTypes.node,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

HDButtonRefactor.defaultProps = {
    id: '',
    // action: '',
    // parent: '',
    variant: 'primary',
    label: 'button',
    type: 'button',
    disabled: false,
    onKeyPress: null,
    children: null,
    fullWidth: false,
    className: '',
    size: null,
    onClick: () => {}
};

export default HDButtonRefactor;
