import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslatorContext } from '../../../../../applications/quote-and-buy/src/integration/TranslatorContext';
import HDTextInputRefactor from '../HDTextInputRefactor/HDTextInputRefactor';
import HDToggleButtonGroupRefactor from '../HDToggleButtonGroupRefactor/HDToggleButtonGroupRefactor';
import HDDropdownList from '../HDDropdownList/HDDropdownList';
import HDImageRadioButton from '../HDImageRadioButton/HDImageRadioButton';
import HDAsyncSelect from '../HDDropdownList/HDAsyncSelect';
import HDDatePicker from '../HDDatePicker/HDDatePicker';
import HDSwitch from '../HDSwitch/HDSwitch';
import getValueFromModel from './ViewModelDataExtractor';
import HDCheckbox from '../HDCheckbox/HDCheckbox';

const allowedHDComponents = [
    HDImageRadioButton.typeName,
    HDTextInputRefactor.typeName,
    HDToggleButtonGroupRefactor.typeName,
    HDDropdownList.typeName,
    HDAsyncSelect.typeName,
    HDDatePicker.typeName,
    HDSwitch.typeName,
    HDCheckbox.typeName
];

/*
* HDForm
* @param {objcet} submissionVM - view model object
* @param {object} validationSchema - yup validation schema
* @param {array} children - react elements or function
* @param {func} onValidation - on validation handler
* @returns {*}
* @constructor
*/
const HDForm = ({
    submissionVM,
    validationSchema,
    children,
    onValidation,
    className,
    resetFormOnStart,
    initValues,
    passedKey
}) => {
    const firstLevelChildren = children;
    const translator = useContext(TranslatorContext);

    let initialValues = {};

    // init values from vm, but only once on every page load
    // this handles next/back buttons for value binding
    if (validationSchema && validationSchema.fields) {
        Object.keys(validationSchema.fields)
            .forEach((fieldName) => {
                const { vmPath } = validationSchema.fields[fieldName];
                initialValues[fieldName] = getValueFromModel(fieldName, vmPath, submissionVM);
            });
    }

    if (_.isBoolean(resetFormOnStart) && resetFormOnStart) {
        initialValues = {};
    }

    if (initValues && Object.keys(initValues).length > 0) {
        initialValues = initValues;
    }

    const [initialValuesState, setInitialValuesState] = useState(initialValues);

    return (
        <Formik
            key={passedKey}
            initialTouched={[]}
            initialValues={initialValuesState}
            validationSchema={validationSchema}
            validateOnMount
        >
            {(formikProps) => {
                const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleSubmit,
                    isValid,
                    setFieldTouched,
                    validateForm,
                    validateField
                } = formikProps;


                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    validateForm();
                }, [validationSchema]);

                onValidation(isValid);

                const cloneChildIfNeeded = (child) => {
                    // check if there are any nested elements that we need to wrap
                    if (child && child.props && child.props.children) {
                        // recreate children
                        let newChildren;

                        if (Array.isArray(child.props.children)) {
                            newChildren = _.map(child.props.children, (secondLevelChild) => {
                                if (typeof secondLevelChild === 'function') {
                                    const evalChild = secondLevelChild(formikProps);
                                    return cloneChildIfNeeded(evalChild);
                                }

                                // eslint-disable-next-line no-use-before-define
                                return customChildWrapper(secondLevelChild);
                            });
                        } else {
                            // one child in this property
                            // eslint-disable-next-line no-use-before-define
                            newChildren = [customChildWrapper(child.props.children)];
                        }

                        // eslint-disable-next-line no-param-reassign
                        return React.cloneElement(child, child.props, newChildren);
                    }

                    return child;
                };

                const customSubmitHandler = (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    // run manual validation before submit
                    validateForm()
                        .then((manualErrors) => {
                            // in case of errors stop submiting
                            if (Object.keys(manualErrors).length === 0) {
                                handleSubmit();
                            }

                            // manual touch all fields to display errors
                            Object.keys(manualErrors)
                                .forEach((path) => {
                                    setFieldTouched(path, true, false);
                                });
                        });
                };

                const customChildWrapper = (child) => {
                    const isValidHDElement = child
                        && child.type
                        && allowedHDComponents.includes(child.type.typeName);

                    if (isValidHDElement) {
                        // eslint-disable-next-line max-len
                        const displayValidationMessage = child.props.displayValidationMessage === undefined ? true : child.props.displayValidationMessage;

                        const childFieldName = child.props.name;
                        const childFieldError = _.get(errors, childFieldName);

                        const isInvalid = _.get(touched, childFieldName) && childFieldError;
                        const isInvalidClassName = isInvalid && displayValidationMessage ? 'is-invalid' : '';

                        // Workaround for dropdown value recovery from VM
                        const formikFieldValue = _.get(values, childFieldName);
                        const submissionValue = _.get(submissionVM, child.props.path);
                        if (!_.isNil(submissionValue)
                            && !_.isNil(submissionValue.value)
                            && HDDropdownList.typeName === child.type.typeName
                            && typeof formikFieldValue === 'string') {
                            const option = _.head(child.props.options.filter((opt) => opt.value === formikFieldValue));
                            if (option) {
                                _.set(values, childFieldName, option);
                            }
                        }

                        // added for AsyncSelect
                        // did not use options as options are dynamically loded via loadOptions function
                        if (!_.isNil(submissionValue)
                            && !_.isNil(submissionValue.value)
                            && !_.isEmpty(submissionValue.value)
                            && HDAsyncSelect.typeName === child.type.typeName
                            && typeof formikFieldValue === 'string') {
                            const validTypekey = submissionValue.aspects.availableValues.some((item) => item.code === formikFieldValue);
                            if (validTypekey) {
                                const label = translator(
                                    {
                                        id: submissionValue.value.name,
                                        defaultMessage: submissionValue.value.name
                                    }
                                );
                                _.set(values, childFieldName, {
                                    label: label,
                                    value: formikFieldValue
                                });
                            }
                        }

                        // Init value to avoid warnings
                        // A Date object has no key/values so it'll return true.
                        if (_.isNil(formikFieldValue)
                            || (!_.isDate(formikFieldValue)
                                && !_.isBoolean(formikFieldValue)
                                && !_.isNumber(formikFieldValue)
                                && _.isEmpty(formikFieldValue))) {
                            if (child.type.typeName === HDDatePicker.typeName) {
                                _.set(values, childFieldName, undefined);
                            } else {
                                _.set(values, childFieldName, '');
                            }
                        }

                        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

                        const customHandleBlur = (e) => {
                            if (isSafari) {
                                if (validationSchema.fields[childFieldName]) validateField(childFieldName);
                                touched[childFieldName] = true;
                            } else {
                                setFieldTouched(childFieldName, true, true);
                            }
                            if (typeof child.props.onBlur === 'function') {
                                child.props.onBlur(e);
                            }
                        };

                        // apply change to View Model
                        const customHandleChange = (e) => {
                            const vmPath = e.target.getAttribute('path');
                            const eventValue = e.target.value;
                            const { checked, type } = e.target;
                            if (eventValue !== null && typeof eventValue === 'object' && eventValue.getMonth === undefined) {
                                // this is for select option (drop down)
                                // eventValue.getMonth === 'undefined' to omit Date object
                                _.set(submissionVM, `${vmPath}.value`, eventValue.value);
                            } else if (eventValue !== null && eventValue instanceof Date) {
                                _.set(submissionVM, `${vmPath}.value`, {});
                                if (eventValue.getMonth !== undefined) {
                                    _.set(submissionVM, `${vmPath}.year`, eventValue.getFullYear());
                                    _.set(submissionVM, `${vmPath}.day`, eventValue.getDate());
                                    _.set(submissionVM, `${vmPath}.month`, eventValue.getMonth());
                                } else {
                                    _.set(submissionVM, `${vmPath}.value`, eventValue);
                                }
                            } else if (checked !== undefined && _.isBoolean(checked) && type === 'checkbox') {
                                _.set(submissionVM, `${vmPath}.value`, checked);
                            } else {
                                _.set(submissionVM, `${vmPath}.value`, eventValue);
                            }

                            handleChange(e);

                            if (typeof child.props.onChange === 'function') {
                                child.props.onChange(e);
                            }
                        };

                        const childKey = `${child.props.path}.${child.props.name}.${child.props.id}`;

                        return (
                            <Form.Group key={childKey}>
                                <Form.Control
                                    {...child.props}
                                    custom
                                    className={`${child.props.className} ${isInvalidClassName}`}
                                    as={child.type}
                                    path={child.props.path}
                                    name={childFieldName}
                                    value={_.get(values, childFieldName)}
                                    onChange={(e) => customHandleChange(e)}
                                    onBlur={customHandleBlur}
                                    isInvalid={isInvalid && displayValidationMessage}
                                    ref={child.props.innerRef} />
                                {!child.props.noErrorMessage && (
                                    <Form.Control.Feedback type="invalid">
                                        {childFieldError}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        );
                    }

                    // clone child
                    return cloneChildIfNeeded(child);
                };

                let childrenWithExtraProp;
                if (typeof firstLevelChildren === 'function') {
                    const evalChild = firstLevelChildren(formikProps);
                    childrenWithExtraProp = cloneChildIfNeeded(evalChild);
                } else if (Array.isArray(firstLevelChildren)) {
                    childrenWithExtraProp = _.map(firstLevelChildren, (child) => {
                        let childElement;

                        if (typeof child === 'function') {
                            childElement = customChildWrapper(child(formikProps));
                        } else {
                            childElement = customChildWrapper(child);
                        }

                        return childElement;
                    });
                } else {
                    childrenWithExtraProp = customChildWrapper(firstLevelChildren);
                }
                return (
                    <Form noValidate onSubmit={customSubmitHandler} className={className}>
                        {childrenWithExtraProp}
                    </Form>
                );
            }}
        </Formik>
    );
};

HDForm.propTypes = {
    submissionVM: PropTypes.shape({
        lobData: PropTypes.object.isRequired
    }).isRequired,
    validationSchema: PropTypes.shape({
        tests: PropTypes.array,
        fields: PropTypes.object
    }).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.func,
        PropTypes.array,
        PropTypes.element
    ]).isRequired,
    onValidation: PropTypes.func,
    className: PropTypes.string,
    resetFormOnStart: PropTypes.bool,
    initValues: PropTypes.shape({}),
    passedKey: PropTypes.string
};

HDForm.defaultProps = {
    onValidation: () => {},
    className: '',
    resetFormOnStart: false,
    initValues: {},
    passedKey: 'default-key'
};

export default HDForm;
