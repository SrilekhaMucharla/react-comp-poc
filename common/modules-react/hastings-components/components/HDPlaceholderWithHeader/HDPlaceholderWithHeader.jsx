import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import classNames from 'classnames';

const HDPlaceholderWithHeader = ({
    icon, title, children, className, theme
}) => {
    const headerClass = classNames(
        { 'placeholder-w-header__header--dark': theme === 'dark-header' },
    );

    return (
        <Container fluid className={`placeholder-w-header theme-white ${className}`}>
            <Row className={`placeholder-w-header__header ${headerClass}`}>
                <Col className="pl-0">
                    {title}
                </Col>
                {icon && (
                    <Col xs="auto" className="px-0">
                        {icon}
                    </Col>
                )}
            </Row>
            <Row>
                <Col>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

HDPlaceholderWithHeader.propTypes = {
    title: PropTypes.node.isRequired,
    icon: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    theme: PropTypes.string,
};

HDPlaceholderWithHeader.defaultProps = {
    icon: null,
    children: null,
    className: '',
    theme: 'default'
};

export default HDPlaceholderWithHeader;
