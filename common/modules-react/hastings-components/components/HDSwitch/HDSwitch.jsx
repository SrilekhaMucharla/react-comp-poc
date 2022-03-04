import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const HDSwitch = ({
    id,
    values,
    value,
    theme,
    onChange,
    path,
    name
}) => {
    const [val, setVal] = useState(value);

    const handleChange = (event) => {
        const { checked } = event.target;
        const newValue = checked ? values[1].value : values[0].value;
        setVal(newValue);
        onChange(
            {
                target: {
                    value: newValue,
                    name: name,
                    label: checked ? values[1].name : values[0].name,
                    getAttribute: (attr) => (attr === 'path' ? path : null)
                }
            }
        );
    };

    const keyId = id || 'hd-custom-switch';
    const isChecked = val === values[1].value;

    return (
        <div className={classNames('hd-switch', `switch--${theme}`)}>
            <div className={classNames('custom-control', 'custom-switch')}>
                <input
                    name={name}
                    type="checkbox"
                    className="custom-control-input"
                    id={keyId}
                    onChange={handleChange}
                    checked={isChecked} />
                <label
                    htmlFor={keyId}
                    className={classNames('custom-control-label-left', !isChecked && 'active')}
                >
                    {values[0].name}
                </label>
                <label
                    htmlFor={keyId}
                    className={classNames('custom-control-label', 'custom-control-label-right', isChecked && 'active')}
                >
                    {values[1].name}
                </label>
            </div>
        </div>
    );
};

HDSwitch.propTypes = {
    id: PropTypes.string,
    theme: PropTypes.oneOf(['dark', 'light']),
    values: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired

};

HDSwitch.defaultProps = {
    id: null,
    theme: 'dark',
    onChange: () => {},
};

HDSwitch.typeName = 'HDSwitch';

export default HDSwitch;
