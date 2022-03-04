import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import styled from 'styled-components';
import classNames from 'classnames';

const StyledCardDiv = styled.div`
    border-top: 1px solid #c9c8c8;
`;

const StyledHeaderDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 58px;
    font-family: Helvetica;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    color: #333333;
    &.lg {
      font-family: Arial;
      font-size: 20px;
      line-height: 27px;
      color: #404040;
      .btn-link {
        border-bottom: 3px solid #007bff;
      }
    }
    .btn-link {
      color: #333333;
      border-bottom: 3px solid #007bff;
      &:focus {
        box-shadow: none;
      }
    }
`;

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use HDAccordionRefactor instead.
 */
const HDAccordion = ({
    cards,
    className,
    size,
    supportInnerHTML
}) => {
    const [activeId, setActiveId] = useState(null);

    const handleToogle = (currentId) => {
        if (currentId !== activeId) {
            setActiveId(currentId);
        } else {
            setActiveId(null);
        }
    };

    return (
        <Accordion className={className}>
            {cards.map(({ header, content }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledCardDiv key={i}>
                    <StyledHeaderDiv className={classNames({ lg: size === 'lg' })}>
                        <div className="header">
                            {header}
                        </div>
                        <Accordion.Toggle as={Button} variant="link" eventKey={`eventKey${i}`} onClick={() => handleToogle(i)}>
                            <i className={classNames('fas', { 'fa-angle-down': activeId !== i }, { 'fa-angle-up': activeId === i })} />
                        </Accordion.Toggle>
                    </StyledHeaderDiv>
                    <Accordion.Collapse eventKey={`eventKey${i}`}>
                        {/* eslint-disable-next-line react/no-danger */}
                        {(supportInnerHTML) ? <div dangerouslySetInnerHTML={{ __html: content }} /> : <div>{content}</div>}
                    </Accordion.Collapse>
                </StyledCardDiv>
            ))}
        </Accordion>
    );
};

HDAccordion.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        content: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    })).isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg']),
    supportInnerHTML: PropTypes.bool,
};

HDAccordion.defaultProps = {
    className: null,
    size: null,
    supportInnerHTML: false,
};

export default HDAccordion;
