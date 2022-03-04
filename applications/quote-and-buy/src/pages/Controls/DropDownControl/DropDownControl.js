import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import './DropDownControl.scss';

const DropDownList = ({
    options,
    onChange,
    name
}) => {
    const [value, setValue] = useState();

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
    };

    return (
        <span id="dropDownSelectBox" className="selBox">
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select id="dropDownSelect" name={name} onChange={handleChange} value={value} className="minimal">
                {options.map((e, key) => {
                    // eslint-disable-next-line react/no-array-index-key
                    return <option key={key} value={e.value}>{e.name}</option>;
                })}
            </select>
        </span>
    );
};

DropDownList.propTypes = {
    options: PropTypes.arrayOf(String),
    name: PropTypes.string,
    onChange: PropTypes.func
};

DropDownList.defaultProps = {
    name: '',
    options: [],
    onChange: () => {
    }
};

export default DropDownList;
