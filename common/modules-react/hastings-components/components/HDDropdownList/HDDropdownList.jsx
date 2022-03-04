import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';


const HDDropdownList = ({
    ref,
    titleTag,
    path,
    name,
    value,
    options,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    selectSize,
    defaultValue,
    label,
    className,
    customClassName,
    reset,
    data,
    isDisabled,
    theme,
    isSearchable,
    enableNative,
    // eslint-disable-next-line no-unused-vars
    displayValidationMessage // used in wrapped component, HDForm, to disable errors
}) => {
    const ddlistClass = classNames(
        { 'hastings-ddlist-lg': selectSize === 'lg' },
        { 'hastings-ddlist-sm': selectSize === 'sm' },
        { 'hastings-ddlist-thin': selectSize === 'thin' },
        { 'col-md-8 pl-0 pr-0': selectSize === 'md-8' },
        'drop-down-list',
        { blue: theme === 'blue' },
    );

    const [dropDownValue, setDropDownValue] = useState(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    // Hook
    function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });
        useEffect(() => {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            // Add event listener
            window.addEventListener('resize', handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }
    const size = useWindowSize();

    useEffect(() => {
        if (reset) {
            setDropDownValue(null);
        } else if (data) {
            setDropDownValue(data);
        } else {
            setDropDownValue(value);
        }
    }, [reset, data, value]);

    useEffect(() => {
        if (enableNative && (size.width < 1024)) {
            setIsMobileDevice(true);
        } else {
            setIsMobileDevice(false);
        }
    });

    const handleChangeNative = (event) => {
        const index = event.nativeEvent.target.selectedIndex;
        const wrappedEvent = {
            target: {
                name: name,
                value: {
                    value: event.target.value,
                    label: event.nativeEvent.target[index].text,
                },
                getAttribute: (attr) => {
                    if (attr === 'path') {
                        return path;
                    }

                    return '';
                }
            }
        };
        onChange(wrappedEvent);
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
    };
    const customStyles = {
        menu: (provided) => ({
            ...provided,
            'z-index': 99998
        }),
        control: (provided) => ({
            ...provided,
            height: 'inherit'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            paddingRight: '15px',
            color: '#60759e'
        }),
        // eslint-disable-next-line
        option: (optionStyles, { optionIsDisabled, isFocused, isSelected }) => {
            // const color = '#0085ff';
            return {
                ...optionStyles,
                // eslint-disable-next-line no-nested-ternary
                backgroundColor: optionIsDisabled
                    ? null
                    // eslint-disable-next-line no-nested-ternary
                    : isSelected
                        ? '#60759e'
                        : isFocused
                            ? '#0085ff'
                            : null,
                ':active': {
                    ...optionStyles[':active'],
                    backgroundColor:
                        !optionIsDisabled && (isSelected ? '#0085ff' : '#60759e'),
                    color: '#fff',
                },
                ':hover': {
                    ...optionStyles[':hover'],
                    backgroundColor: '#0085ff',
                    color: '#fff',
                }
            };
        }
    };

    return (
        <div ref={ref} className={`${className} ${customClassName}`}>
            {label && <HDLabelRefactor Tag={titleTag} {...label} />}

            {isMobileDevice && (
                <div className={`select-themed ${ddlistClass}`}>
                    <select onChange={handleChangeNative}>
                        {!value && (
                            <option selected disabled>{placeholder}</option>
                        )}
                        {(value && !value.value) && (
                            <option value={value}>{placeholder}</option>
                        )}
                        {(value && value.value && value.label) && (
                            <option value={value.value}>{value.label}</option>
                        )}
                        {options.map((option, index) => (
                            <option value={option.value} name={index}>{option.label}</option>
                        ))}
                    </select>
                    <div className="inidicator">
                        <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                            <path
                                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                        </svg>
                    </div>
                </div>
            )}
            {!isMobileDevice && (
                <Select
                    isSearchable={isSearchable}
                    path={path}
                    name={name}
                    className={`hd-dropdown ${ddlistClass}`}
                    value={dropDownValue}
                    options={options}
                    onChange={handleChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    styles={customStyles}
                    isDisabled={isDisabled}
                    components={{
                        IndicatorSeparator: () => null
                    }} />
            )}
        </div>
    );
};

HDDropdownList.propTypes = {
    ref: PropTypes.shape({}),
    titleTag: PropTypes.string,
    path: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            value: PropTypes.any,
            label: PropTypes.string
        })]),
    options: PropTypes.arrayOf(String).isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    selectSize: PropTypes.oneOf(['sm', 'lg', 'thin', 'md-8']),
    label: PropTypes.shape(HDLabelRefactor.propTypes),
    className: PropTypes.string,
    customClassName: PropTypes.string,
    displayValidationMessage: PropTypes.bool,
    reset: PropTypes.bool,
    data: PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.string
    }),
    isDisabled: PropTypes.bool,
    theme: PropTypes.oneOf(['blue', 'white']),
    isSearchable: PropTypes.bool,
    enableNative: PropTypes.bool,
};

HDDropdownList.defaultProps = {
    ref: null,
    titleTag: 'h5',
    path: 'path.to.dropdown',
    name: 'dropdown-name',
    value: null,
    selectSize: null,
    label: null,
    placeholder: 'Please select',
    defaultValue: null,
    onChange: () => {
    },
    onBlur: () => {
    },
    className: '',
    customClassName: '',
    displayValidationMessage: true,
    reset: false,
    data: null,
    isDisabled: false,
    theme: 'white',
    isSearchable: true,
    enableNative: false
};

// avoid obfuscation problem with types
HDDropdownList.typeName = 'HDDropdownList';

export default HDDropdownList;
