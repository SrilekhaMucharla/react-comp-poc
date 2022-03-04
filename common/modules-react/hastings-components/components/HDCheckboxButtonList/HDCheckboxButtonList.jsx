import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import HDImageRadioButton from '../HDImageRadioButton/HDImageRadioButton';

const KEY_CODE_ENTER = 13;

const HDCheckboxButtonList = ({
    className,
    items,
    selectedItems,
    onChange,
    colProps
}) => {
    const handleChange = (e, item, prevChecked) => {
        e.target.prevChecked = prevChecked;
        e.target.label = item.label;
        onChange(e, item);
    };
    return (
        <Row className={`hd-checkbox-button-list${(className) ? ` ${className}` : ''}`}>
            <Col>
                {(items && items.length > 0) && items.map(((el, index) => {
                    const isChecked = selectedItems.some((selectedItem) => selectedItem.id === el.id);
                    return (
                        <React.Fragment key={el.id}>
                            <Row>
                                <Col {...colProps}>
                                    <div
                                        id="hd-checkbox-button-list-item-button"
                                        className="hd-checkbox-button-list_item-container"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => handleChange(e, el, isChecked)}
                                        onKeyDown={(e) => { if (e.keyCode === KEY_CODE_ENTER) handleChange(e, el, isChecked); }}
                                    >
                                        <HDImageRadioButton
                                            type="checkbox"
                                            className="hd-checkbox-button-list__item mb-3"
                                            currentValue={el.label}
                                            name="item"
                                            value={isChecked && el.label}
                                            selected={isChecked}
                                            id={`default-checkbox-${index + 1}`} />
                                    </div>
                                </Col>
                            </Row>
                            {isChecked && (typeof el.content === 'function' ? el.content() : el.content)}
                        </React.Fragment>
                    );
                }))}
            </Col>
        </Row>
    );
};

HDCheckboxButtonList.defaultProps = {
    className: null,
    colProps: null,
    selectedItems: []
};

HDCheckboxButtonList.propTypes = {
    className: PropTypes.string,
    colProps: PropTypes.shape(Col.PropTypes),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired
        }).isRequired
    ).isRequired,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired
        }).isRequired
    ),
    onChange: PropTypes.func.isRequired,
};

HDCheckboxButtonList.typeName = 'HDCheckboxButtonList';

export default HDCheckboxButtonList;
