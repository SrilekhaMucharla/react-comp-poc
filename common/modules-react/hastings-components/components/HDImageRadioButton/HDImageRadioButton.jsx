import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import onlineProductLogo from '../../../../../applications/quote-and-buy/src/assets/images/logo/logo-online-product.svg';
import standardProductLogo from '../../../../../applications/quote-and-buy/src/assets/images/logo/logo-standard-product.svg';


const HDImageRadioButton = ({
    className, path, name, currentValue, value, onChange, onBlur, image, labelValue, secondaryLabel, selected, hideInput, type, onlineProduct
}) => {
    return (
        <div className={`hd-image-radio-btn${(className) ? ` ${className}` : ''}${(selected) ? ' selected' : ''}`}>
            {image ? (
                <div>
                    <img
                        className={classnames(`hd-image-radio-btn__image ${onlineProduct ? 'online-product-on' : ''}`, { selected })}
                        src={image}
                        alt={currentValue} />
                    {onlineProduct && (
                        <img
                            className={classnames('hd-image-radio-btn__image_online', { selected })}
                            src={currentValue === 'YD' ? standardProductLogo : onlineProductLogo}
                            alt="Online product logo" />
                    )}
                    {secondaryLabel && <div className="hd-image-radio-btn__inverted-text">{secondaryLabel}</div>}
                </div>
            ) : (
                <div className="hd-image-radio-btn__header-value">
                    {currentValue}
                    {secondaryLabel && <div className="hd-image-radio-btn__inverted-text">{secondaryLabel}</div>}
                </div>
            )}
            {labelValue ? <div className="label-text">{labelValue}</div> : ''}
            {!hideInput && (
                <input
                    className="hd-image-radio-btn_input"
                    data-testid="radio-btn"
                    type={type}
                    path={path}
                    name={name}
                    value={currentValue}
                    checked={currentValue === value}
                    onChange={onChange}
                    onBlur={onBlur} />
            )}
        </div>
    );
};

HDImageRadioButton.propTypes = {
    className: PropTypes.string,
    path: PropTypes.string,
    name: PropTypes.string,
    currentValue: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    image: PropTypes.node,
    labelValue: PropTypes.string,
    secondaryLabel: PropTypes.string,
    selected: PropTypes.bool,
    hideInput: PropTypes.bool,
    onlineProduct: PropTypes.bool,
    type: PropTypes.string
};

HDImageRadioButton.defaultProps = {
    className: '',
    path: 'path.to.radio-button',
    name: 'radio-button-name',
    value: '',
    onChange: () => { },
    onBlur: () => { },
    labelValue: '',
    image: null,
    secondaryLabel: null,
    selected: false,
    hideInput: false,
    onlineProduct: false,
    type: 'radio'
};

// avoid obfuscation problem with types
HDImageRadioButton.typeName = 'HDImageRadioButton';

export default HDImageRadioButton;
