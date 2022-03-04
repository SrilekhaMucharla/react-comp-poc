import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const HDInfoCardRefactor = ({
    title, image, paragraphs, children, isRight, notes, className, id, theme, size
}) => {
    const infoCardClass = classNames(
        { 'info-card--light': theme === 'light' },
        { 'info-card--mint': theme === 'mint' },
        { 'info-card--thin': size === 'thin' },
    );

    return (
        <div id={id} className={`info-card ${isRight ? 'right ' : 'left '}${infoCardClass} ${className || ''}`}>
            {image && <img className="info-card__icon" src={image} alt="info-card" />}
            {title && <p key="info-card-title" className="info-card__title">{title}</p>}
            {/* eslint-disable-next-line react/no-array-index-key */}
            {!!paragraphs.length && paragraphs.map((paragraph, index) => (<p key={index} className={`info-card__paragraph paragraph_${index}`}>{paragraph}</p>))}
            {notes && <p key="info-card-notes" className="info-card__notes">{notes}</p>}
            {children}
        </div>
    );
};


HDInfoCardRefactor.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    notes: PropTypes.string,
    children: PropTypes.node,
    isRight: PropTypes.bool,
    className: PropTypes.string,
    theme: PropTypes.string,
    size: PropTypes.string
};

HDInfoCardRefactor.defaultProps = {
    id: '',
    title: null,
    image: null,
    paragraphs: [],
    notes: null,
    children: null,
    isRight: false,
    className: null,
    theme: null,
    size: null
};

export default HDInfoCardRefactor;
