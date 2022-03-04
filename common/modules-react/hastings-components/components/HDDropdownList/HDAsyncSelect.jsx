import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AsyncSelect from 'react-select/lib/Async';
import HDLabel from '../HDLabel/HDLabel';
import * as styles from '../../../../../applications/quote-and-buy/src/assets/sass-refactor/main.scss';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';

const HDAsyncSelect = ({
    path,
    name,
    value,
    cacheOptions,
    loadOptions,
    defaultOptions,
    onInputChange,
    onChange,
    onBlur,
    placeholder,
    selectSize,
    label,
    className,
    customClassName,
    // eslint-disable-next-line no-unused-vars
    displayValidationMessage // used in wrapped component, HDForm
}) => {
    const ddlistClass = classNames(
        { 'hastings-ddlist-lg': selectSize === 'lg' },
        { 'hastings-ddlist-sm': selectSize === 'sm' },
        { 'col-md-8 pl-0 pr-0': selectSize === 'md-8' }
    );

    const checkSecondaryQuestionValue = (event) => {
        const selectedEvent = event.target.name;
        if (event && (selectedEvent === 'occupationFull'
            || selectedEvent === 'occupationPart')) {
            const wrappedEventSecondary = {
                target: {
                    value: null,
                    name: selectedEvent === 'occupationFull' ? 'businessTypeFull'
                        : 'businessTypePart',
                    getAttribute: () => {
                        return '';
                    }
                }
            };
            onChange(wrappedEventSecondary);
        }
    };

    const handleChange = (event) => {
        const wrappedEvent = {
            target: {
                value: event,
                name: name,
                getAttribute: (attr) => {
                    if (attr === 'path') {
                        return path;
                    }

                    return '';
                }
            }
        };

        onChange(wrappedEvent);
        checkSecondaryQuestionValue(wrappedEvent);
    };

    const showNoOptionMessage = (input) => {
        if (input.inputValue) {
            return 'Please enter a valid value';
        }
        return null;
    };
    const customStyles = {
        control: (base) => ({
            ...base,
            height: 60,
            minHeight: 60,
        }),
        menu: (base) => ({
            ...base,
            'z-index': 999
        }),
    };
    return (
        <div className={`${className} ${customClassName}`}>
            {label ? <HDLabelRefactor Tag="h5" {...label} /> : ''}
            <AsyncSelect
                components={{ DropdownIndicator: () => null, IndicatorSeperator: () => null }}
                path={path}
                name={name}
                value={value}
                className={`async-select ${ddlistClass}`}
                cacheOptions={cacheOptions}
                loadOptions={loadOptions}
                defaultOptions={defaultOptions}
                onInputChange={onInputChange}
                onChange={handleChange}
                styles={customStyles}
                onBlur={onBlur}
                placeholder={placeholder}
                isClearable
                noOptionsMessage={showNoOptionMessage} />
        </div>
    );
};
HDAsyncSelect.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    }),
    options: PropTypes.arrayOf(String),
    cacheOptions: PropTypes.bool,
    loadOptions: PropTypes.func,
    defaultOptions: PropTypes.bool,
    onInputChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    selectSize: PropTypes.oneOf(['sm', 'lg']),
    label: PropTypes.shape(HDLabel.propTypes),
    className: PropTypes.string,
    customClassName: PropTypes.string,
    displayValidationMessage: PropTypes.bool
};

HDAsyncSelect.defaultProps = {
    path: 'path.to.dropdown',
    name: 'dropdown-name',
    value: null,
    selectSize: null,
    label: null,
    options: null,
    cacheOptions: false,
    loadOptions: () => { },
    defaultOptions: false,
    onInputChange: () => { },
    defaultValue: null,
    onChange: () => {
    },
    onBlur: () => {
    },
    className: '',
    customClassName: '',
    displayValidationMessage: true,
    placeholder: 'text'
};

// avoid obfuscation problem with types
HDAsyncSelect.typeName = 'HDAsyncSelect';
export default HDAsyncSelect;
