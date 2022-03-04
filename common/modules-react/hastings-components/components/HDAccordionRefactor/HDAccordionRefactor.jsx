import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import classNames from 'classnames';


const HDAccordionRefactor = ({
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
        <Accordion className={`hd-accordion ${className}`}>
            {cards.map(({ header, content }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="hd-accordion__card" key={i}>
                    <hr />
                    <div className={`hd-accordion__header ${classNames({ lg: size === 'lg' })}`}>
                        <h5>{header}</h5>
                        <Accordion.Toggle className="hd-accordion__toggle" as={Button} variant="link" eventKey={`eventKey${i}`} onClick={() => handleToogle(i)}>
                            <i
                                className={`hd-accordion__link ${classNames('fas', { 'fa-angle-down': activeId !== i }, { 'fa-angle-up': activeId === i })}`} />
                        </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey={`eventKey${i}`}>
                        {/* eslint-disable-next-line react/no-danger */}
                        {(supportInnerHTML)
                            ? (
                                <div
                                    className="hd-accordion__inner-html"
                                    dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <div className="hd-accordion__content">
                                    {content}
                                </div>
                            )}
                    </Accordion.Collapse>
                </div>
            ))}
        </Accordion>
    );
};

HDAccordionRefactor.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        content: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    })).isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg']),
    supportInnerHTML: PropTypes.bool,
};

HDAccordionRefactor.defaultProps = {
    className: null,
    size: null,
    supportInnerHTML: false,
};

export default HDAccordionRefactor;
