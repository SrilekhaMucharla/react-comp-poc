import PropTypes from 'prop-types';
import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const HDInteractiveCardRefactor = ({ header, text, children, icons, className }) => (
    <Container className={className}>
        <Row className="interactive-card px-0">
            <Col className="interactive-card__content">
                <div className="interactive-card__content__header">{header}</div>
                <div className="interactive-card__content__text">{text}</div>
                {children}
            </Col>
            <Col xs="auto" className="interactive-card__icons pl-0">
                {icons}
            </Col>
        </Row>
    </Container>
);

HDInteractiveCardRefactor.propTypes = {
    header: PropTypes.node,
    text: PropTypes.node,
    children: PropTypes.node,
    icons: PropTypes.node,
    className: PropTypes.string
};

HDInteractiveCardRefactor.defaultProps = {
    header: undefined,
    text: undefined,
    children: undefined,
    icons: undefined,
    className: undefined
};

export default HDInteractiveCardRefactor;
