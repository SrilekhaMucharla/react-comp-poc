import React from 'react';
import PropTypes from 'prop-types';
import {
    Row, Col, Container
} from 'react-bootstrap';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';

const HDDataCard = ({
    title,
    description,
    icon,
    data,
    linkText,
    onLinkClick,
    className,
    linkClass,
    hideGoBack
}) => {
    const mapSection = (no, keys, values) => {
        return (
            <div key={no} className="section">
                {keys.map((key, i) => (
                    <div className="item" key={key}>
                        <div className="key">
                            {key}
                        </div>
                        <div className="value">
                            {values[i]}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderItems = (size) => {
        let result = [];
        const keys = Object.keys(data);
        const values = Object.values(data);
        for (let i = 0; i < keys.length; i += size) {
            result = [...result, mapSection(i, keys.slice(i, i + size), values.slice(i, i + size))];
        }
        return result;
    };

    return (
        <div className={`hd-data-card theme-white ${className}`}>
            <Container fluid className="p-0">
                <Row>
                    <Col xs={12} md={8}>
                        {(icon) && (
                            <div className="icon p-3">
                                <i className={`fas fa-${icon} fa-3x`} />
                            </div>
                        )}
                        {title && (
                            <div className="licence-plate">
                                {title}
                            </div>
                        )}
                        <h4 className="description">
                            {description}
                        </h4>

                    </Col>
                    <Col xs={12} md={{ span: 12, order: 3 }}>
                        <div className="data">
                            {renderItems(3)}
                        </div>
                    </Col>
                    {hideGoBack ? '' : <Col xs={12} md={4} className="text-right-md-up mt-md-0 mt-4">
                        {(linkText) && (
                            <HDLabelRefactor
                                id="dc-link"
                                Tag="a"
                                text={linkText}
                                className={linkClass}
                                onClick={onLinkClick} />
                        )}
                    </Col>}
                </Row>
            </Container>
        </div>
    );
};

HDDataCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    linkText: PropTypes.string,
    onLinkClick: PropTypes.func,
    className: PropTypes.string,
    hideGoBack: PropTypes.bool,
    linkClass: PropTypes.string
};

HDDataCard.defaultProps = {
    description: null,
    icon: null,
    linkText: null,
    onLinkClick: null,
    title: null,
    className: null,
    hideGoBack: false,
    linkClass: null
};

export default HDDataCard;