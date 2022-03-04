import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const HDLabelRefactor = ({
    Tag,
    text,
    className,
    icon,
    id,
    iconPosition,
    additionalContent,
    adjustImagePosition,
    href,
    target,
    ...otherProps
}) => {
    return (
        <>
            {(icon && iconPosition === 'r' && Tag === 'a')
                && (
                    <Row className={`anchor-with-icon align-items-start ${className}`}>
                        <Col className="pr-0">
                            <Tag id={id} {...otherProps} href={href} target={target}>
                                <span>{text}</span>
                                {additionalContent}
                            </Tag>
                        </Col>
                        <Col xs="auto" className={`${Tag === 'h2' && adjustImagePosition ? 'mt-h2' : ''} ${Tag === 'h3' ? 'mt-h3' : ''} ${Tag === 'h5' ? 'mt-h5' : ''}`}>
                            {icon}
                        </Col>
                    </Row>
                )}
            {(icon && iconPosition === 'r' && Tag !== 'a')
            && (
                <Row className={`label-with-icon align-items-start ${className}`}>
                    <Col className="pr-0">
                        <Tag id={id} {...otherProps} className={className}>
                            {text}
                            {additionalContent}
                        </Tag>
                    </Col>
                    <Col xs="auto" className={`${Tag === 'h2' && adjustImagePosition ? 'mt-h2' : ''} ${Tag === 'h3' ? 'mt-h3' : ''} ${Tag === 'h5' ? 'mt-h5' : ''}`}>
                        {icon}
                    </Col>
                </Row>
            )}
            {(icon && iconPosition === 'l' && Tag === 'a')
                && (
                    <Row className={`anchor-with-icon ${className}`}>
                        <Col xs="auto" className="d-flex pr-2">
                            {icon}
                        </Col>
                        <Col className="pl-0">
                            <Tag id={id} {...otherProps} href={href} className={className} target={target}>
                                <span>{text}</span>
                                {additionalContent}
                            </Tag>
                        </Col>
                    </Row>
                )}
            {(icon && iconPosition === 'l' && Tag !== 'a')
            && (
                <Row className={`label-with-icon ${className}`}>
                    <Col xs="auto" className="d-flex pr-2">
                        {icon}
                    </Col>
                    <Col className="pl-0">
                        <Tag id={id} {...otherProps} className={className}>
                            {text}
                            {additionalContent}
                        </Tag>
                    </Col>
                </Row>
            )}
            {(icon && !iconPosition)
                && (
                    <Tag className={className} id={id} {...otherProps}>
                        {text}
                        {icon}
                    </Tag>
                )}
            {(!icon && !iconPosition && Tag === 'a')
                && (
                    <Tag className={`hd-tag ${className || ''}`} id={id} {...otherProps} href={href} target={target}>
                        <span>{text}</span>
                        {additionalContent}
                    </Tag>
                )}
            {(!icon && !iconPosition && Tag !== 'a')
            && (
                <Tag className={className} id={id} {...otherProps}>
                    {text}
                    {additionalContent}
                </Tag>
            )}
        </>
    );
};

HDLabelRefactor.propTypes = {
    Tag: PropTypes.string,
    text: PropTypes.node.isRequired,
    className: PropTypes.string,
    icon: PropTypes.node,
    id: PropTypes.string,
    iconPosition: PropTypes.string,
    additionalContent: PropTypes.node,
    adjustImagePosition: PropTypes.bool,
    href: PropTypes.string,
    target: PropTypes.string,
};
HDLabelRefactor.defaultProps = {
    Tag: undefined,
    className: '',
    icon: undefined,
    id: undefined,
    iconPosition: undefined,
    additionalContent: undefined,
    adjustImagePosition: true,
    href: undefined,
    target: undefined,
};

export default HDLabelRefactor;
