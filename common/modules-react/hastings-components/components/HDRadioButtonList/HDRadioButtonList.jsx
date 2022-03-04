import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import HDImageRadioButton from '../HDImageRadioButton/HDImageRadioButton';

const KEY_CODE_ENTER = 13;

const HDRadioButtonList = ({
    className,
    items,
    onChange,
    value
}) => {
    const handleChange = (e, item) => {
        e.target.label = item.label;
        onChange(e, item);
    };
    return (
        <Row className={`hd-radio-button-list${(className) ? ` ${className}` : ''}`}>
            <Col>
                {(items && items.length > 0) && items.map(((el, index) => {
                    return (
                        <div
                            key={el.id}
                            className="hd-radio-button-list_item-container"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleChange(e, el)}
                            onKeyDown={(e) => { if (e.keyCode === KEY_CODE_ENTER) handleChange(e, el); }}
                        >
                            <HDImageRadioButton
                                className="hd-radio-button-list__item"
                                currentValue={el.label}
                                name="item"
                                value={value && value.label}
                                selected={value && value.id === el.id}
                                id={`default-radio-${index + 1}`} />
                        </div>
                    );
                }))}
            </Col>
        </Row>
    );
};

HDRadioButtonList.defaultProps = {
    className: null,
    value: null
};

HDRadioButtonList.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired
        }).isRequired
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.shape({
        id: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.any
    }),
};

HDRadioButtonList.typeName = 'HDRadioButtonList';

export default HDRadioButtonList;
